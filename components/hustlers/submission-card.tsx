"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export type Submission = {
  id: string
  taskTitle: string
  workerHash: string
  proof: string
  status: "pending" | "approved" | "rejected"
}

export function SubmissionCard({
  sub,
  onApprove,
  onReject,
}: {
  sub: Submission
  onApprove: (id: string) => void
  onReject: (id: string) => void
}) {
  const truncated = `${sub.workerHash.slice(0, 10)}…${sub.workerHash.slice(-6)}`
  const statusColor =
    sub.status === "pending" ? "var(--warning)" : sub.status === "approved" ? "var(--success)" : "var(--destructive)"
  return (
    <Card
      className="bg-card border-border transition-all duration-300 hover:shadow-md hover-glow-primary"
      style={{ borderColor: statusColor }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{sub.taskTitle}</CardTitle>
        <p className="text-xs mt-1">
          Worker:{" "}
          <span style={{ color: "var(--primary)" }} className="font-medium">
            {truncated}
          </span>{" "}
          •{" "}
          <span className="font-medium" style={{ color: statusColor }}>
            Status: {sub.status}
          </span>
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-md bg-secondary/60 text-sm p-3 border border-border whitespace-pre-wrap break-words">
          {sub.proof}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button
            className="rounded-md transition-all duration-300 hover:scale-[1.01] active:scale-95"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            onClick={() => onApprove(sub.id)}
          >
            Approve &amp; Pay
          </Button>
          <Button
            className="rounded-md transition-all duration-300 hover:scale-[1.01] active:scale-95"
            style={{ backgroundColor: "var(--destructive)", color: "var(--destructive-foreground)" }}
            onClick={() => onReject(sub.id)}
          >
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
