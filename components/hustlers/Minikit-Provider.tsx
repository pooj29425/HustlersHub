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
        // Still render children even if MiniKit fails to install
        // This allows the app to work in browsers outside World App
        setIsInitialized(true);
      }
    };

    initMiniKit();
  }, []);

  // You can add a loading state here if needed
  // if (!isInitialized) {
  //   return <div>Initializing...</div>;
  // }

  return <>{children}</>;
}
