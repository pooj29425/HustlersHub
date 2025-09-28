"use client";
import { ReactNode, useEffect, useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export default function MinikitProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Install and initialize MiniKit
    const initMiniKit = async () => {
      try {
        await MiniKit.install();
        setIsInitialized(true);
        console.log("MiniKit initialized successfully");
      } catch (error) {
        console.error("Failed to initialize MiniKit:", error);

        setIsInitialized(true);
      }
    };

    initMiniKit();
  }, []);

  return <>{children}</>;
}
