"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";

export type Submission = {
  id: string;
  taskTitle: string;
  workerHash: string;
  proof: string;
  files?: File[];
  status: "pending" | "approved" | "rejected";
  comments?: string;
};

export function SubmissionCard({
  sub,
  onApprove,
  onReject,
}: {
  sub: Submission;
  onApprove: (id: string, comment?: string) => void;
  onReject: (id: string, comment?: string) => void;
}) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [viewingFile, setViewingFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const truncated = `${sub.workerHash.slice(0, 10)}…${sub.workerHash.slice(
    -6
  )}`;
  const statusColor =
    sub.status === "pending"
      ? "var(--warning)"
      : sub.status === "approved"
      ? "var(--success)"
      : "var(--destructive)";

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || ""))
      return "🖼️";
    if (["pdf"].includes(ext || "")) return "📕";
    if (["doc", "docx"].includes(ext || "")) return "📄";
    if (["xls", "xlsx", "csv"].includes(ext || "")) return "📊";
    if (["zip", "rar", "7z"].includes(ext || "")) return "🗜️";
    if (["mp4", "avi", "mov", "wmv"].includes(ext || "")) return "🎥";
    if (["mp3", "wav", "ogg", "flac"].includes(ext || "")) return "🎵";
    if (["js", "ts", "py", "html", "css", "json"].includes(ext || ""))
      return "💻";
    return "📎";
  };

  const handleActionClick = (type: "approve" | "reject") => {
    setActionType(type);
    setShowCommentForm(true);
  };

  const handleSubmitAction = () => {
    if (actionType === "approve") {
      onApprove(sub.id, comment);
    } else if (actionType === "reject") {
      onReject(sub.id, comment);
    }
    setShowCommentForm(false);
    setComment("");
    setActionType(null);
  };

  const handleCancelAction = () => {
    setShowCommentForm(false);
    setComment("");
    setActionType(null);
  };

  const handleViewFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setViewingFile(file);
    setFilePreviewUrl(url);
  };

  const handleCloseFileView = () => {
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    setViewingFile(null);
    setFilePreviewUrl(null);
  };

  // Cleanup file URLs on component unmount
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);
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
      <CardContent className="pt-0 space-y-4">
        {/* Proof Text */}
        <div>
          <h4 className="text-sm font-medium mb-2">Work Description:</h4>
          <div className="rounded-md bg-secondary/60 text-sm p-3 border border-border whitespace-pre-wrap break-words">
            {sub.proof}
          </div>
        </div>

        {/* Submitted Files */}
        {sub.files && sub.files.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">
              Submitted Files ({sub.files.length}):
            </h4>
            <div className="space-y-2">
              {sub.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-lg flex-shrink-0">
                      {getFileIcon(file.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span className="capitalize">
                          {file.type || "Unknown type"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = URL.createObjectURL(file);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = file.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                      }}
                      className="text-xs"
                    >
                      Download
                    </Button>
                    {(file.type.startsWith("image/") ||
                      file.type === "text/plain" ||
                      file.type === "application/pdf") && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewFile(file)}
                            className="text-xs"
                          >
                            👁️ View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <span className="text-lg">
                                {getFileIcon(file.name)}
                              </span>
                              {file.name}
                              <span className="text-sm font-normal text-muted-foreground ml-2">
                                ({formatFileSize(file.size)})
                              </span>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="overflow-auto max-h-[60vh]">
                            {file.type.startsWith("image/") &&
                              filePreviewUrl && (
                                <img
                                  src={filePreviewUrl}
                                  alt={file.name}
                                  className="max-w-full h-auto rounded-lg"
                                />
                              )}
                            {file.type === "text/plain" && (
                              <div className="bg-secondary/30 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
                                {/* Text content would be loaded here */}
                                <p className="text-muted-foreground italic">
                                  Text file preview - content would be displayed
                                  here
                                </p>
                              </div>
                            )}
                            {file.type === "application/pdf" && (
                              <div className="bg-secondary/30 p-8 rounded-lg text-center">
                                <div className="text-6xl mb-4">📕</div>
                                <p className="text-lg font-medium mb-2">
                                  PDF Document
                                </p>
                                <p className="text-muted-foreground mb-4">
                                  PDF preview not available. Download to view
                                  the full document.
                                </p>
                                <Button
                                  onClick={() => {
                                    const url = URL.createObjectURL(file);
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.download = file.name;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    URL.revokeObjectURL(url);
                                  }}
                                >
                                  📥 Download PDF
                                </Button>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing Comments */}
        {sub.comments && (
          <div>
            <h4 className="text-sm font-medium mb-2">Comments:</h4>
            <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 text-sm p-3 border border-blue-200 dark:border-blue-800">
              {sub.comments}
            </div>
          </div>
        )}

        {/* Action Buttons / Comment Form */}
        {sub.status === "pending" && (
          <div className="space-y-3">
            {!showCommentForm ? (
              <div className="flex items-center gap-2">
                <Button
                  className="rounded-md transition-all duration-300 hover:scale-[1.01] active:scale-95 flex-1"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                  onClick={() => handleActionClick("approve")}
                >
                  💰 Approve &amp; Pay
                </Button>
                <Button
                  className="rounded-md transition-all duration-300 hover:scale-[1.01] active:scale-95 flex-1"
                  style={{
                    backgroundColor: "var(--destructive)",
                    color: "var(--destructive-foreground)",
                  }}
                  onClick={() => handleActionClick("reject")}
                >
                  ❌ Reject
                </Button>
              </div>
            ) : (
              <div className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {actionType === "approve" ? "💰" : "❌"}
                  </span>
                  <h4 className="text-sm font-medium">
                    {actionType === "approve"
                      ? "Approve & Pay Worker"
                      : "Reject Submission"}
                  </h4>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Leave a comment (optional):
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={
                      actionType === "approve"
                        ? "Great work! Payment has been processed..."
                        : "Please revise the work because..."
                    }
                    className="mt-1 min-h-20"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSubmitAction}
                    className="flex-1"
                    style={{
                      backgroundColor:
                        actionType === "approve"
                          ? "var(--primary)"
                          : "var(--destructive)",
                      color:
                        actionType === "approve"
                          ? "var(--primary-foreground)"
                          : "var(--destructive-foreground)",
                    }}
                  >
                    {actionType === "approve"
                      ? "✅ Confirm Payment"
                      : "❌ Confirm Rejection"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancelAction}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status indicator for completed submissions */}
        {sub.status !== "pending" && (
          <div
            className={`p-3 rounded-lg text-sm ${
              sub.status === "approved"
                ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{sub.status === "approved" ? "✅" : "❌"}</span>
              <span className="font-medium">
                {sub.status === "approved"
                  ? "Payment Completed"
                  : "Submission Rejected"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
