"use client";
import { useState, useCallback } from "react";
import {
  MiniKit,
  VerifyCommandInput,
  VerificationLevel,
} from "@worldcoin/minikit-js";
import { toast } from "@/hooks/use-toast";

export interface AuthState {
  isConnecting: boolean;
  isVerifying: boolean;
  isConnected: boolean;
  isVerified: boolean;
  walletAddress: string | null;
  worldIdHash: string | null;
  userId: string | null;
  error: string | null;
}

export interface UseWorldcoinAuthReturn extends AuthState {
  connectWallet: () => Promise<void>;
  verifyWorldId: () => Promise<void>;
  reset: () => void;
  isInWorldApp: boolean;
}

export function useWorldcoinAuth(): UseWorldcoinAuthReturn {
  const [state, setState] = useState<AuthState>({
    isConnecting: false,
    isVerifying: false,
    isConnected: false,
    isVerified: false,
    walletAddress: null,
    worldIdHash: null,
    userId: null,
    error: null,
  });

  // Check if MiniKit is available
  const isInWorldApp = typeof window !== "undefined" && MiniKit.isInstalled();

  const connectWallet = useCallback(async () => {
    console.log("🔗 Attempting wallet connection...");
    console.log("📱 Is in World App:", isInWorldApp);

    if (!isInWorldApp) {
      const errorMsg =
        "Please open this app in World App to connect your wallet. Currently accessing from: " +
        (typeof window !== "undefined" ? window.location.hostname : "server");
      console.log("❌", errorMsg);
      toast({
        title: "World App Required",
        description: errorMsg,
        variant: "destructive",
      });
      setState((prev) => ({ ...prev, error: errorMsg }));
      return;
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Get nonce from backend
      console.log("🎲 Fetching nonce from /api/nonce...");
      const nonceResponse = await fetch("/api/nonce");
      console.log("📝 Nonce response status:", nonceResponse.status);

      if (!nonceResponse.ok) {
        const errorText = await nonceResponse.text();
        console.log("❌ Nonce error response:", errorText);
        throw new Error(
          `Failed to get nonce: ${nonceResponse.status} - ${errorText}`
        );
      }
      const { nonce } = await nonceResponse.json();
      console.log("✅ Received nonce:", nonce.substring(0, 8) + "...");

      // Perform wallet authentication using SIWE
      console.log("🔐 Calling MiniKit.commandsAsync.walletAuth...");
      const authPayload = {
        nonce: nonce,
        requestId: crypto.randomUUID(),
        expirationTime: new Date(
          new Date().getTime() + 7 * 24 * 60 * 60 * 1000
        ), // 7 days
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // 24 hours ago
        statement:
          "Connect to HustlersHub - The bot-proof marketplace for human micro-tasks",
      };
      console.log("📤 Auth payload:", authPayload);

      const { finalPayload } = await MiniKit.commandsAsync.walletAuth(
        authPayload
      );
      console.log("📥 MiniKit response:", finalPayload);

      if (finalPayload.status === "error") {
        throw new Error("Wallet connection failed");
      }

      // Verify the signature on the backend
      console.log("🔍 Verifying SIWE signature...");
      const verifyResponse = await fetch("/api/complete-siwe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
        }),
      });

      console.log("📝 SIWE verification status:", verifyResponse.status);

      if (!verifyResponse.ok) {
        const errorText = await verifyResponse.text();
        console.log("❌ SIWE verification error:", errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        throw new Error(
          errorData.message ||
            `Failed to verify signature: ${verifyResponse.status}`
        );
      }

      const result = await verifyResponse.json();

      if (result.isValid) {
        const walletAddress = finalPayload.address;
        const userId = `user_${walletAddress.slice(2, 8)}`;

        setState((prev) => ({
          ...prev,
          isConnecting: false,
          isConnected: true,
          walletAddress,
          userId,
          error: null,
        }));

        toast({
          title: "Wallet Connected",
          description: `Connected to ${walletAddress.slice(
            0,
            10
          )}...${walletAddress.slice(-6)}`,
        });
      } else {
        throw new Error("Invalid signature verification");
      }
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error.message || "Failed to connect wallet",
      }));

      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  }, [isInWorldApp]);

  const verifyWorldId = useCallback(async () => {
    if (!isInWorldApp) {
      toast({
        title: "World App Required",
        description:
          "Please open this app in World App to verify with World ID.",
        variant: "destructive",
      });
      return;
    }

    setState((prev) => ({ ...prev, isVerifying: true, error: null }));

    try {
      const verifyPayload: VerifyCommandInput = {
        action: "hustlershub-verification", // This should match your action ID in Developer Portal
        signal: state.walletAddress || undefined,
        verification_level: VerificationLevel.Orb, // Use Orb for highest security
      };

      // Perform World ID verification
      const { finalPayload } = await MiniKit.commandsAsync.verify(
        verifyPayload
      );

      if (finalPayload.status === "error") {
        throw new Error("World ID verification failed");
      }

      // Verify the proof on the backend
      const verifyResponse = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload,
          action: "hustlershub-verification",
          signal: state.walletAddress || undefined,
        }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.message || "Failed to verify World ID proof");
      }

      const result = await verifyResponse.json();

      if (result.verified) {
        const worldIdHash = `wid_${finalPayload.nullifier_hash.slice(0, 40)}`;

        setState((prev) => ({
          ...prev,
          isVerifying: false,
          isVerified: true,
          worldIdHash,
          error: null,
        }));

        toast({
          title: "World ID Verified",
          description: "Your identity has been successfully verified!",
        });
      } else {
        throw new Error("World ID verification failed");
      }
    } catch (error: any) {
      console.error("World ID verification error:", error);
      setState((prev) => ({
        ...prev,
        isVerifying: false,
        error: error.message || "Failed to verify World ID",
      }));

      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify World ID",
        variant: "destructive",
      });
    }
  }, [isInWorldApp, state.walletAddress]);

  const reset = useCallback(() => {
    setState({
      isConnecting: false,
      isVerifying: false,
      isConnected: false,
      isVerified: false,
      walletAddress: null,
      worldIdHash: null,
      userId: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    connectWallet,
    verifyWorldId,
    reset,
    isInWorldApp,
  };
}
