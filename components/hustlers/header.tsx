"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type HeaderProps = {
  userType: "worker" | "client";
  onToggle: (type: "worker" | "client") => void;
  worldIdHash?: string;
  userId?: string;
  verified: boolean;
};

export function Header({
  userType,
  onToggle,
  worldIdHash,
  userId,
  verified,
}: HeaderProps) {
  const truncatedHash = worldIdHash
    ? `${worldIdHash.slice(0, 10)}…${worldIdHash.slice(-6)}`
    : "Not verified";

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="text-xl font-bold text-balance"
            style={{ color: "var(--primary)" }}
            aria-label="HustlersHub app title"
          >
            HustlersHub
          </span>
          {verified && (
            <Card className="px-2.5 py-1.5 text-xs bg-secondary/60 border-secondary/40">
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon
                  className="size-4"
                  style={{ color: "var(--primary)" }}
                  aria-hidden
                />
                <span className="sr-only">Status:</span>
                World ID Verified
              </span>
            </Card>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-md bg-secondary p-1">
            <Button
              variant="ghost"
              className={cn(
                "h-8 px-3 rounded-md text-sm transition-all duration-300 hover:scale-[1.01] active:scale-95",
                userType === "worker"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground"
              )}
              onClick={() => onToggle("worker")}
              aria-pressed={userType === "worker"}
            >
              <UserIcon className="mr-1.5 size-4" aria-hidden />
              Worker
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "h-8 px-3 rounded-md text-sm transition-all duration-300 hover:scale-[1.01] active:scale-95",
                userType === "client"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground"
              )}
              onClick={() => onToggle("client")}
              aria-pressed={userType === "client"}
            >
              <BriefcaseIcon className="mr-1.5 size-4" aria-hidden />
              Client
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl px-4 pb-3">
        <p className="text-xs text-muted-foreground truncate">
          <span className="font-medium">World ID:</span> {truncatedHash}{" "}
          {userId && (
            <>
              <span className="mx-1">•</span>
              <span className="font-medium">User:</span> {userId}
            </>
          )}
        </p>
      </div>
    </header>
  );
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.5 7.5a1 1 0 0 1-1.414 0l-3-3A1 1 0 1 1 6.207 10.6l2.293 2.293 6.793-6.793a1 1 0 0 1 1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function UserIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
    </svg>
  );
}
function BriefcaseIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M10 4h4a2 2 0 0 1 2 2v1h3a1 1 0 0 1 1 1v4h-8v1h8v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6h8v-1H4V8a1 1 0 0 1 1-1h3V6a2 2 0 0 1 2-2Zm4 3V6a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v1Z" />
    </svg>
  );
}
