"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Task = {
  id: string;
  title: string;
  reward: number; // USDC
  slots: { taken: number; max: number };
  description: string;
  category: "text" | "creative" | "technical" | "data" | "verification";
  requiresFile?: boolean;
  fileTypes?: string[]; // e.g., ["image/*", ".pdf", ".zip"]
  estimatedTime: string; // e.g., "1-2 min"
};

export function TaskCard({
  task,
  onClaim,
}: {
  task: Task;
  onClaim: (task: Task) => void;
}) {
  const remaining = Math.max(0, task.slots.max - task.slots.taken);
  const isSoldOut = remaining === 0;

  return (
    <Card className="bg-card border-border transition-all duration-300 hover:shadow-md hover-glow-primary">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          {task.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          {/* Emphasize reward using Electric Green */}
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: "var(--primary)" }}
          >
            ${task.reward.toFixed(2)} USDC
          </span>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full capitalize">
              {task.category}
            </span>
            {task.requiresFile && (
              <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 rounded-full">
                📎 Files
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            ⏱️ {task.estimatedTime} • {remaining}/{task.slots.max} slots
          </span>
        </div>
        <Button
          className="rounded-md h-9 px-4 transition-all duration-300 hover:scale-[1.01] active:scale-95"
          style={{
            backgroundColor: isSoldOut ? "var(--muted)" : "var(--primary)",
            color: isSoldOut
              ? "var(--muted-foreground)"
              : "var(--primary-foreground)",
          }}
          disabled={isSoldOut}
          onClick={() => onClaim(task)}
          aria-disabled={isSoldOut}
        >
          {isSoldOut ? "Sold Out" : "Claim Task"}
        </Button>
      </CardContent>
    </Card>
  );
}
