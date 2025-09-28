"use client";

import type React from "react";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/hustlers/header";
import { TaskCard, type Task } from "@/components/hustlers/task-card";
import {
  SubmissionCard,
  type Submission,
} from "@/components/hustlers/submission-card";
import { cn } from "@/lib/utils";
import { useWorldcoinAuth } from "@/hooks/use-worldcoin-auth";

export default function Page() {
  // Real Worldcoin authentication - COMMENTED OUT FOR DEVELOPMENT
  /*
  const {
    isConnecting,
    isVerifying,
    isConnected,
    isVerified,
    walletAddress,
    worldIdHash,
    userId,
    connectWallet,
    verifyWorldId,
    isInWorldApp,
    error: authError,
  } = useWorldcoinAuth();
  */

  // TEMPORARY: Mock authentication state for development
  const [mockIsConnecting, setMockIsConnecting] = useState(false);
  const [mockIsVerifying, setMockIsVerifying] = useState(false);
  const [mockIsConnected, setMockIsConnected] = useState(false);
  const [mockIsVerified, setMockIsVerified] = useState(false); // Start with false to show landing page

  const isConnecting = mockIsConnecting;
  const isVerifying = mockIsVerifying;
  const isConnected = mockIsConnected;
  const isVerified = mockIsVerified;
  const walletAddress = mockIsConnected ? "0x1234...5678" : null; // Mock wallet address
  const worldIdHash = mockIsVerified ? "mock_world_id_hash" : null;
  const userId = mockIsVerified ? "mock_user_id" : null;
  const isInWorldApp = false;
  const authError = null;

  // Mock authentication functions with realistic flow
  const connectWallet = async () => {
    setMockIsConnecting(true);
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setMockIsConnecting(false);
    setMockIsConnected(true);
  };

  const verifyWorldId = async () => {
    setMockIsVerifying(true);
    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setMockIsVerifying(false);
    setMockIsVerified(true);
  };

  // App state
  const [userType, setUserType] = useState<"worker" | "client">("worker");
  const [claimedTask, setClaimedTask] = useState<Task | null>(null);
  const [proofText, setProofText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Demo data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "t1",
      title: "Rate an AI summary",
      reward: 0.5,
      slots: { taken: 35, max: 50 },
      description: "Read the summary and rate 1-5 with a short note.",
      category: "text",
      estimatedTime: "1 min",
    },
    {
      id: "t2",
      title: "Find a broken link",
      reward: 0.75,
      slots: { taken: 50, max: 50 },
      description: "Browse provided page and paste any broken link.",
      category: "verification",
      estimatedTime: "2 min",
    },
    {
      id: "t3",
      title: "Transcribe 30s audio",
      reward: 1.2,
      slots: { taken: 4, max: 10 },
      description: "Listen and provide accurate transcript.",
      category: "data",
      estimatedTime: "2-3 min",
    },
    {
      id: "t4",
      title: "Design a simple logo",
      reward: 5.0,
      slots: { taken: 2, max: 5 },
      description:
        "Create a minimalist logo for a coffee shop. Must be original and delivered as PNG/SVG.",
      category: "creative",
      requiresFile: true,
      fileTypes: ["image/*", ".svg"],
      estimatedTime: "15-30 min",
    },
    {
      id: "t5",
      title: "Write a JavaScript function",
      reward: 2.5,
      slots: { taken: 8, max: 15 },
      description:
        "Create a function that validates email addresses with proper regex. Include test cases.",
      category: "technical",
      estimatedTime: "10-15 min",
    },
    {
      id: "t6",
      title: "Create social media graphics",
      reward: 3.0,
      slots: { taken: 1, max: 8 },
      description:
        "Design 3 Instagram post templates for a fitness brand. Upload as JPG/PNG files.",
      category: "creative",
      requiresFile: true,
      fileTypes: ["image/*"],
      estimatedTime: "20-25 min",
    },
    {
      id: "t7",
      title: "Translate text snippet",
      reward: 1.0,
      slots: { taken: 12, max: 20 },
      description:
        "Translate 200 words from English to Spanish. Must be native-level accuracy.",
      category: "text",
      estimatedTime: "5-8 min",
    },
    {
      id: "t8",
      title: "Debug Python script",
      reward: 4.0,
      slots: { taken: 3, max: 6 },
      description:
        "Fix bugs in a data processing script. Upload corrected .py file with comments.",
      category: "technical",
      requiresFile: true,
      fileTypes: [".py", ".txt"],
      estimatedTime: "20-30 min",
    },
    {
      id: "t9",
      title: "Product photo editing",
      reward: 2.8,
      slots: { taken: 5, max: 12 },
      description:
        "Remove background and enhance lighting for e-commerce photos. Deliver in high resolution.",
      category: "creative",
      requiresFile: true,
      fileTypes: ["image/*"],
      estimatedTime: "10-15 min",
    },
    {
      id: "t10",
      title: "Data entry from PDF",
      reward: 1.5,
      slots: { taken: 18, max: 25 },
      description:
        "Extract customer information from invoice PDFs into structured format.",
      category: "data",
      estimatedTime: "8-12 min",
    },
  ]);
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: "s1",
      taskTitle: "Rate an AI summary (1 min)",
      workerHash: "wid_0x9f2c1ab3d93a7e21fefc4481aa77a6cc4e57f2b9",
      proof:
        "Rating: 4/5\nFeedback: Coherent but missed one key point about context.",
      files: [
        new File(
          ["Sample rating report content here..."],
          "ai_summary_rating.txt",
          { type: "text/plain" }
        ),
        new File(
          ["Additional feedback and analysis..."],
          "detailed_analysis.pdf",
          { type: "application/pdf" }
        ),
      ],
      status: "pending",
    },
  ]);

  // Post Task form
  const [postTab, setPostTab] = useState<"review" | "post">("review");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskReward, setNewTaskReward] = useState<number>(0.5);
  const [newTaskCategory, setNewTaskCategory] =
    useState<Task["category"]>("text");
  const [newTaskRequiresFile, setNewTaskRequiresFile] = useState(false);
  const [newTaskFileTypes, setNewTaskFileTypes] = useState<string[]>([]);
  const [newTaskEstimatedTime, setNewTaskEstimatedTime] = useState("1-2 min");
  const [customFileType, setCustomFileType] = useState("");
  const [taskSubmissionSuccess, setTaskSubmissionSuccess] = useState(false);
  // No longer calculating total escrow since max workers is removed
  const escrowTotal = Math.max(0, newTaskReward);

  const verified = isVerified;

  // Determine the current step for UI purposes
  const getStep = () => {
    if (isVerified) return "verified";
    if (isVerifying) return "verifying";
    if (isConnected) return "connected";
    if (isConnecting) return "connecting";
    return "idle";
  };
  const step = getStep();

  // COMMENTED OUT: Authentication action handler
  /*
  async function onPrimaryAction() {
    if (!isConnected) {
      await connectWallet();
    } else if (isConnected && !isVerified) {
      await verifyWorldId();
    }
  }
  */

  // TEMPORARY: Mock action for development - simulates real flow
  async function onPrimaryAction() {
    if (!mockIsConnected) {
      console.log("Mock: Connecting wallet...");
      await connectWallet();
    } else if (mockIsConnected && !mockIsVerified) {
      console.log("Mock: Verifying World ID...");
      await verifyWorldId();
    }
  }

  function handleClaim(task: Task) {
    setClaimedTask(task);
    setUploadedFiles([]); // Reset files when claiming new task
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);

    // Validate file sizes (10MB limit)
    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
    }

    // Reset the input
    event.target.value = "";
  }

  function removeFile(index: number) {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  function submitWork() {
    if (!claimedTask) return;

    // Use mock worldIdHash if real one is not available
    const currentWorldIdHash = worldIdHash || "mock_world_id_hash";

    // Check if task requires files and none were uploaded
    if (claimedTask.requiresFile && uploadedFiles.length === 0) {
      alert(
        "This task requires file uploads. Please upload the required files."
      );
      return;
    }

    // Create submission with verified World ID
    setTasks((prev) =>
      prev.map((t) =>
        t.id === claimedTask.id
          ? {
              ...t,
              slots: {
                ...t.slots,
                taken: Math.min(t.slots.taken + 1, t.slots.max),
              },
            }
          : t
      )
    );

    // Prepare proof text with file information
    let fullProof = proofText || "(no text proof provided)";
    if (uploadedFiles.length > 0) {
      const fileInfo = uploadedFiles
        .map((file) => `📎 ${file.name} (${formatFileSize(file.size)})`)
        .join("\n");
      fullProof += `\n\nUploaded Files:\n${fileInfo}`;
    }

    setSubmissions((prev) => [
      {
        id: "s_" + crypto.randomUUID().slice(0, 8),
        taskTitle: claimedTask.title,
        workerHash: currentWorldIdHash,
        proof: fullProof,
        files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
        status: "pending",
      },
      ...prev,
    ]);
    setProofText("");
    setUploadedFiles([]);
    setClaimedTask(null);
  }

  function approve(id: string, comment?: string) {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "approved", comments: comment } : s
      )
    );
  }
  function reject(id: string, comment?: string) {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "rejected", comments: comment } : s
      )
    );
  }

  return (
    <main className="min-h-dvh">
      {/* Header shows after verification so the Connect screen stays focused */}
      {verified && (
        <Header
          userType={userType}
          onToggle={setUserType}
          worldIdHash={worldIdHash || undefined}
          userId={userId || undefined}
          verified={verified}
        />
      )}

      {/* Landing Page */}
      {!verified && (
        <div className="min-h-dvh bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/5 to-transparent" />

          {/* Connect Wallet Button - Top Right */}
          <div className="absolute top-6 right-6 z-50">
            <Button
              className={cn(
                "h-11 px-6 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl",
                "bg-primary/90 backdrop-blur-sm text-primary-foreground border border-primary/20",
                "hover:bg-primary hover:shadow-primary/25"
              )}
              onClick={onPrimaryAction}
              disabled={step === "connecting" || step === "verifying"}
              aria-busy={step === "connecting" || step === "verifying"}
            >
              {step === "idle" && (
                <>
                  <span className="mr-2">🔗</span>
                  Connect Wallet
                </>
              )}
              {step === "connecting" && (
                <>
                  <span className="mr-2 animate-spin">🔄</span>
                  Connecting...
                </>
              )}
              {step === "connected" && (
                <>
                  <span className="mr-2">🌍</span>
                  Verify with World ID
                </>
              )}
              {step === "verifying" && (
                <>
                  <span className="mr-2 animate-pulse">✨</span>
                  Verifying...
                </>
              )}
              {step === "verified" && (
                <>
                  <span className="mr-2">✅</span>
                  Verified
                </>
              )}
            </Button>
          </div>

          {/* Hero Section */}
          <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-24 pb-16 md:pt-32 md:pb-20">
            <div className="text-center space-y-12">
              {/* Main Hero Card */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl mx-auto max-w-4xl">
                <CardContent className="p-8 md:p-12 space-y-8">
                  <div className="space-y-6 fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-bold text-balance bg-gradient-to-r from-white via-primary to-primary/80 bg-clip-text text-transparent floating">
                      HustlersHub
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 text-balance max-w-3xl mx-auto fade-in-up-delay leading-relaxed">
                      The bot-proof marketplace where human micro-tasks meet
                      <span className="text-primary font-semibold">
                        {" "}
                        blockchain verification
                      </span>
                    </p>
                  </div>

                  {/* Status indicators */}
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    {(step === "connecting" || step === "verifying") && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                        <Spinner />
                        <span className="text-sm text-primary">
                          {step === "connecting"
                            ? "Connecting wallet..."
                            : "Verifying identity..."}
                        </span>
                      </div>
                    )}

                    {walletAddress && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-sm text-green-400">
                          Connected: {walletAddress.slice(0, 8)}…
                          {walletAddress.slice(-4)}
                        </span>
                      </div>
                    )}

                    {step === "verified" && (
                      <div className="flex justify-center">
                        <VerifiedPill />
                      </div>
                    )}
                  </div>

                  {authError && (
                    <div className="max-w-md mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-sm text-red-400 text-center">
                        {authError}
                      </p>
                    </div>
                  )}

                  {!isInWorldApp && (
                    <div className="max-w-md mx-auto p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <p className="text-sm text-amber-400 text-center">
                        ⚠️ For full functionality, open this app in World App
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Features Section */}
          <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-12">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      Why HustlersHub?
                    </h2>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                      Built on Worldcoin's human verification technology to
                      ensure every participant is a real person
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 group">
                      <CardHeader className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300 group-hover:scale-110">
                          <span className="text-3xl">🛡️</span>
                        </div>
                        <CardTitle className="text-xl text-white">
                          Bot-Proof Security
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 text-center">
                          World ID verification ensures every user is a unique
                          human, eliminating bots and fake accounts from the
                          marketplace.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 group">
                      <CardHeader className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300 group-hover:scale-110">
                          <span className="text-3xl">💰</span>
                        </div>
                        <CardTitle className="text-xl text-white">
                          Instant USDC Rewards
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 text-center">
                          Complete micro-tasks and earn USDC rewards instantly.
                          From simple ratings to data transcription - every task
                          counts.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 group">
                      <CardHeader className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300 group-hover:scale-110">
                          <span className="text-3xl">⚡</span>
                        </div>
                        <CardTitle className="text-xl text-white">
                          Lightning Fast
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 text-center">
                          Most tasks take just 1-3 minutes to complete. Perfect
                          for earning during coffee breaks or commute time.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* How It Works Section */}
          <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-12">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      How It Works
                    </h2>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                      Join as a Worker to earn or as a Client to post tasks
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-12">
                    {/* Worker Flow */}
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/30 transition-all duration-300">
                      <CardContent className="p-6 space-y-6">
                        <h3 className="text-2xl font-bold text-primary flex items-center gap-3">
                          <span className="text-3xl">👷</span>
                          As a Worker
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-4 text-left">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                              1
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">
                                Connect & Verify
                              </h4>
                              <p className="text-slate-300 text-sm">
                                Connect your wallet and complete World ID
                                verification
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 text-left">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                              2
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">
                                Browse Tasks
                              </h4>
                              <p className="text-slate-300 text-sm">
                                Explore available micro-tasks with clear USDC
                                rewards
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 text-left">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                              3
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">
                                Complete & Earn
                              </h4>
                              <p className="text-slate-300 text-sm">
                                Submit your work and receive instant USDC
                                payments upon approval
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Client Flow */}
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/30 transition-all duration-300">
                      <CardContent className="p-6 space-y-6">
                        <h3 className="text-2xl font-bold text-primary flex items-center gap-3">
                          <span className="text-3xl">💼</span>
                          As a Client
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-4 text-left">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                              1
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">
                                Connect & Verify
                              </h4>
                              <p className="text-slate-300 text-sm">
                                Secure your account with wallet connection and
                                World ID
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 text-left">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                              2
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">
                                Post Tasks
                              </h4>
                              <p className="text-slate-300 text-sm">
                                Create micro-tasks with clear instructions and
                                fair rewards
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 text-left">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                              3
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">
                                Review & Pay
                              </h4>
                              <p className="text-slate-300 text-sm">
                                Review submissions and approve quality work for
                                automatic payment
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Example Tasks Section */}
          <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-12">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      Popular Task Types
                    </h2>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                      From simple ratings to data entry - find tasks that match
                      your skills
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-white/15 to-white/5 border-white/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between gap-2 text-white">
                          <span className="flex items-center gap-2">
                            <span className="text-xl">⭐</span>
                            Rate AI Summary
                          </span>
                          <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
                            $0.50
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 text-sm">
                          Read AI-generated summaries and provide ratings with
                          brief feedback. Takes ~1 minute.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-white/15 to-white/5 border-white/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between gap-2 text-white">
                          <span className="flex items-center gap-2">
                            <span className="text-xl">🔍</span>
                            Find Broken Links
                          </span>
                          <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
                            $0.75
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 text-sm">
                          Browse web pages and identify broken or invalid links.
                          Takes ~2 minutes.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-white/15 to-white/5 border-white/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between gap-2 text-white">
                          <span className="flex items-center gap-2">
                            <span className="text-xl">🎧</span>
                            Transcribe Audio
                          </span>
                          <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
                            $1.20
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 text-sm">
                          Listen to short audio clips and provide accurate
                          transcriptions. Takes ~3 minutes.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CTA Section */}
          <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16">
            <Card className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-primary/30 shadow-2xl shadow-primary/20">
              <CardContent className="text-center py-12 space-y-8 backdrop-blur-xl">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Ready to Start Earning?
                  </h2>
                  <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                    Join thousands of verified humans earning USDC through
                    meaningful micro-tasks
                  </p>
                </div>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-primary/20"
                  onClick={onPrimaryAction}
                  disabled={step === "connecting" || step === "verifying"}
                >
                  {step === "idle" && (
                    <>
                      <span className="mr-2">🚀</span>
                      Get Started Now
                    </>
                  )}
                  {step === "connecting" && (
                    <>
                      <span className="mr-2 animate-spin">🔄</span>
                      Connecting...
                    </>
                  )}
                  {step === "connected" && (
                    <>
                      <span className="mr-2">🌍</span>
                      Complete Verification
                    </>
                  )}
                  {step === "verifying" && (
                    <>
                      <span className="mr-2 animate-pulse">✨</span>
                      Verifying...
                    </>
                  )}
                  {step === "verified" && (
                    <>
                      <span className="mr-2">✅</span>
                      Welcome to HustlersHub!
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Footer */}
          <footer className="relative z-10 border-t border-white/10 mt-20">
            <div className="mx-auto w-full max-w-7xl px-4 py-12">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-primary">
                        HustlersHub
                      </h3>
                      <p className="text-sm text-slate-300">
                        The bot-proof marketplace for human micro-tasks, powered
                        by Worldcoin verification.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-white">Platform</h4>
                      <div className="space-y-2 text-sm text-slate-300">
                        <p>🌍 World ID Verified</p>
                        <p>⛓️ Blockchain Secured</p>
                        <p>💰 USDC Rewards</p>
                        <p>🛡️ Bot-Proof</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-white">Task Types</h4>
                      <div className="space-y-2 text-sm text-slate-300">
                        <p>Data Entry</p>
                        <p>Content Rating</p>
                        <p>Audio Transcription</p>
                        <p>Link Verification</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-white">
                        Getting Started
                      </h4>
                      <div className="space-y-2 text-sm text-slate-300">
                        <p>Download World App</p>
                        <p>Connect Wallet</p>
                        <p>Verify Identity</p>
                        <p>Start Earning</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 mt-8 pt-8 text-center">
                    <p className="text-sm text-slate-300">
                      Built with ❤️ using Worldcoin MiniKit • Ensuring every
                      participant is human
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </footer>
        </div>
      )}

      {/* Screen 2 & 4: Dashboard */}
      {verified && (
        <section className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl px-5 sm:px-6 pb-14 pt-[96px]">
          <div className="mb-5">
            <VerifiedPill />
          </div>
          {userType === "worker" ? (
            <WorkerDashboard tasks={tasks} onClaim={handleClaim} />
          ) : (
            <ClientDashboard
              submissions={submissions}
              approve={approve}
              reject={reject}
              postTab={postTab}
              setPostTab={setPostTab}
              newTaskTitle={newTaskTitle}
              setNewTaskTitle={setNewTaskTitle}
              newTaskDesc={newTaskDesc}
              setNewTaskDesc={setNewTaskDesc}
              newTaskReward={newTaskReward}
              setNewTaskReward={setNewTaskReward}
              newTaskCategory={newTaskCategory}
              setNewTaskCategory={setNewTaskCategory}
              newTaskRequiresFile={newTaskRequiresFile}
              setNewTaskRequiresFile={setNewTaskRequiresFile}
              newTaskFileTypes={newTaskFileTypes}
              setNewTaskFileTypes={setNewTaskFileTypes}
              newTaskEstimatedTime={newTaskEstimatedTime}
              setNewTaskEstimatedTime={setNewTaskEstimatedTime}
              customFileType={customFileType}
              setCustomFileType={setCustomFileType}
              taskSubmissionSuccess={taskSubmissionSuccess}
              setTaskSubmissionSuccess={setTaskSubmissionSuccess}
              escrowTotal={escrowTotal}
              addTask={() => {
                // Show success message immediately
                setTaskSubmissionSuccess(true);

                const nt: Task = {
                  id: "t_" + crypto.randomUUID().slice(0, 8),
                  title: newTaskTitle || "Untitled Task",
                  reward: Math.max(0, Number(newTaskReward) || 0),
                  slots: {
                    taken: 0,
                    max: 50, // Default to 50 workers maximum
                  },
                  description: newTaskDesc || "No description.",
                  category: newTaskCategory,
                  requiresFile: newTaskRequiresFile,
                  fileTypes: newTaskRequiresFile ? newTaskFileTypes : undefined,
                  estimatedTime: newTaskEstimatedTime,
                };
                setTasks((prev) => [nt, ...prev]);

                // Reset form fields after a brief delay to show success message
                setTimeout(() => {
                  setNewTaskTitle("");
                  setNewTaskDesc("");
                  setNewTaskReward(0.5);
                  setNewTaskCategory("text");
                  setNewTaskRequiresFile(false);
                  setNewTaskFileTypes([]);
                  setNewTaskEstimatedTime("1-2 min");
                  setCustomFileType("");
                  setTaskSubmissionSuccess(false);
                }, 3000); // Hide success message after 3 seconds
              }}
            />
          )}
        </section>
      )}

      {/* Screen 3: Task Claim View (Modal) */}
      {claimedTask && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Submit Work Modal"
        >
          <div className="w-full sm:max-w-xl sm:rounded-2xl bg-card border border-border shadow-xl transition-all duration-300">
            <div className="px-4 py-3 flex items-center justify-between border-b border-border">
              <h2 className="text-lg font-semibold">{claimedTask.title}</h2>
              <Button
                variant="ghost"
                className="h-8 px-2 text-muted-foreground"
                onClick={() => setClaimedTask(null)}
                aria-label="Close"
              >
                Close
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {claimedTask.description}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full capitalize">
                    {claimedTask.category}
                  </span>
                  <span className="text-muted-foreground">
                    ⏱️ {claimedTask.estimatedTime}
                  </span>
                  <span className="text-primary font-medium">
                    ${claimedTask.reward.toFixed(2)} USDC
                  </span>
                </div>
              </div>

              {/* Text Proof Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="proof">
                  {claimedTask.requiresFile
                    ? "Description & Notes"
                    : "Proof of Work"}
                </label>
                <Textarea
                  id="proof"
                  className="min-h-24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-0"
                  placeholder={
                    claimedTask.requiresFile
                      ? "Describe your approach, provide context, or add any notes..."
                      : "Paste text, links, or notes that prove your work..."
                  }
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                />
              </div>

              {/* File Upload Section */}
              {claimedTask.requiresFile && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Upload Files <span className="text-destructive">*</span>
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {claimedTask.fileTypes?.join(", ") || "Any file type"}
                    </span>
                  </div>

                  <div
                    className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors hover:bg-primary/5"
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer.files);
                      setUploadedFiles((prev) => [...prev, ...files]);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => e.preventDefault()}
                  >
                    <input
                      type="file"
                      multiple
                      accept={claimedTask.fileTypes?.join(",")}
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center gap-3 text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl">📁</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Click to upload files or drag & drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Accepted:{" "}
                          {claimedTask.fileTypes?.join(", ") || "Any file type"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Max size: 10MB per file
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Uploaded Files:</p>
                      <div className="space-y-1">
                        {uploadedFiles.map((file, index) => {
                          const getFileIcon = (fileName: string) => {
                            const ext = fileName
                              .split(".")
                              .pop()
                              ?.toLowerCase();
                            if (
                              [
                                "jpg",
                                "jpeg",
                                "png",
                                "gif",
                                "svg",
                                "webp",
                              ].includes(ext || "")
                            )
                              return "🖼️";
                            if (["pdf"].includes(ext || "")) return "📕";
                            if (["doc", "docx"].includes(ext || ""))
                              return "📄";
                            if (["xls", "xlsx", "csv"].includes(ext || ""))
                              return "📊";
                            if (["zip", "rar", "7z"].includes(ext || ""))
                              return "🗜️";
                            if (
                              ["mp4", "avi", "mov", "wmv"].includes(ext || "")
                            )
                              return "🎥";
                            if (
                              ["mp3", "wav", "ogg", "flac"].includes(ext || "")
                            )
                              return "🎵";
                            if (
                              [
                                "js",
                                "ts",
                                "py",
                                "html",
                                "css",
                                "json",
                              ].includes(ext || "")
                            )
                              return "�";
                            return "📎";
                          };

                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/50 hover:border-primary/20 transition-colors"
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
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                                title="Remove file"
                              >
                                ✕
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setClaimedTask(null);
                    setUploadedFiles([]);
                    setProofText("");
                  }}
                  className="rounded-md"
                >
                  ← Back
                </Button>
                <Button
                  className="rounded-md transition-all duration-300 hover:scale-[1.01] active:scale-95"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                  onClick={submitWork}
                  disabled={
                    claimedTask?.requiresFile && uploadedFiles.length === 0
                  }
                >
                  🚀 Submit Work
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function VerifiedPill() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-sm transition-colors duration-300">
      <CheckIcon
        className="size-4"
        style={{ color: "var(--primary)" }}
        aria-hidden
      />
      <span>World ID Verified</span>
    </div>
  );
}

function WorkerDashboard({
  tasks,
  onClaim,
}: {
  tasks: Task[];
  onClaim: (t: Task) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Available Tasks</h2>
      <div className="grid gap-5">
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} onClaim={onClaim} />
        ))}
      </div>
    </div>
  );
}

function ClientDashboard(props: {
  submissions: Submission[];
  approve: (id: string) => void;
  reject: (id: string) => void;
  postTab: "review" | "post";
  setPostTab: (t: "review" | "post") => void;
  newTaskTitle: string;
  setNewTaskTitle: (v: string) => void;
  newTaskDesc: string;
  setNewTaskDesc: (v: string) => void;
  newTaskReward: number;
  setNewTaskReward: (v: number) => void;
  newTaskCategory: Task["category"];
  setNewTaskCategory: (v: Task["category"]) => void;
  newTaskRequiresFile: boolean;
  setNewTaskRequiresFile: (v: boolean) => void;
  newTaskFileTypes: string[];
  setNewTaskFileTypes: (v: string[]) => void;
  newTaskEstimatedTime: string;
  setNewTaskEstimatedTime: (v: string) => void;
  customFileType: string;
  setCustomFileType: (v: string) => void;
  taskSubmissionSuccess: boolean;
  setTaskSubmissionSuccess: (v: boolean) => void;
  escrowTotal: number;
  addTask: () => void;
}) {
  const {
    submissions,
    approve,
    reject,
    postTab,
    setPostTab,
    newTaskTitle,
    setNewTaskTitle,
    newTaskDesc,
    setNewTaskDesc,
    newTaskReward,
    setNewTaskReward,
    newTaskCategory,
    setNewTaskCategory,
    newTaskRequiresFile,
    setNewTaskRequiresFile,
    newTaskFileTypes,
    setNewTaskFileTypes,
    newTaskEstimatedTime,
    setNewTaskEstimatedTime,
    customFileType,
    setCustomFileType,
    taskSubmissionSuccess,
    setTaskSubmissionSuccess,
    escrowTotal,
    addTask,
  } = props;

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-secondary p-1 inline-flex">
        <Button
          variant="ghost"
          className={cn(
            "h-9 px-3 rounded-md text-sm",
            postTab === "review" && "bg-primary text-primary-foreground"
          )}
          onClick={() => setPostTab("review")}
        >
          Review Submissions (
          {submissions.filter((s) => s.status === "pending").length})
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "h-9 px-3 rounded-md text-sm",
            postTab === "post" && "bg-primary text-primary-foreground"
          )}
          onClick={() => setPostTab("post")}
        >
          Post New Task
        </Button>
      </div>

      {postTab === "post" ? (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Create Detailed Task</CardTitle>
            <CardDescription>
              Provide comprehensive details to attract quality workers and
              ensure clear expectations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-primary">
                Basic Information
              </h3>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="t-title">
                  Task Title <span className="text-destructive">*</span>
                </label>
                <Input
                  id="t-title"
                  placeholder="e.g., Rate AI-generated product descriptions"
                  value={newTaskTitle}
                  onChange={(e) => {
                    console.log("Title input changed:", e.target.value);
                    setNewTaskTitle(e.target.value);
                  }}
                  onFocus={() => console.log("Title input focused")}
                  onBlur={() => console.log("Title input blurred")}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-0"
                  readOnly={false}
                  disabled={false}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="t-desc">
                  Detailed Description & Instructions{" "}
                  <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="t-desc"
                  className="min-h-32 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-0"
                  placeholder={`Provide clear, step-by-step instructions. Example:

1. Review the provided AI-generated product descriptions
2. Rate each description on a scale of 1-5 for:
   - Accuracy (does it match the product?)
   - Clarity (is it easy to understand?)
   - Appeal (would it convince customers?)
3. Provide brief feedback if rating is below 3
4. Submit your ratings and comments

What you'll be working with: [describe the content/materials]
What we're looking for: [describe quality criteria]
Any specific guidelines: [mention dos and don'ts]`}
                  value={newTaskDesc}
                  onChange={(e) => {
                    console.log("Description input changed:", e.target.value);
                    setNewTaskDesc(e.target.value);
                  }}
                  onFocus={() => console.log("Description textarea focused")}
                  readOnly={false}
                  disabled={false}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="t-category">
                    Task Category
                  </label>
                  <Select
                    value={newTaskCategory}
                    onValueChange={setNewTaskCategory}
                  >
                    <SelectTrigger className="focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-0">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">📝 Text & Writing</SelectItem>
                      <SelectItem value="creative">
                        🎨 Creative & Design
                      </SelectItem>
                      <SelectItem value="technical">
                        ⚙️ Technical & Code
                      </SelectItem>
                      <SelectItem value="data">📊 Data & Research</SelectItem>
                      <SelectItem value="verification">
                        ✅ Verification & Review
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="t-time">
                    Estimated Time per Task
                  </label>
                  <Select
                    value={newTaskEstimatedTime}
                    onValueChange={setNewTaskEstimatedTime}
                  >
                    <SelectTrigger className="focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-0">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2 min">⚡ 1-2 minutes</SelectItem>
                      <SelectItem value="3-5 min">🕐 3-5 minutes</SelectItem>
                      <SelectItem value="5-10 min">🕑 5-10 minutes</SelectItem>
                      <SelectItem value="10-15 min">
                        🕒 10-15 minutes
                      </SelectItem>
                      <SelectItem value="15-30 min">
                        🕓 15-30 minutes
                      </SelectItem>
                      <SelectItem value="30+ min">🕔 30+ minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* File Requirements */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-sm font-medium text-primary">
                File Requirements
              </h3>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requires-files"
                  checked={newTaskRequiresFile}
                  onCheckedChange={setNewTaskRequiresFile}
                />
                <label
                  htmlFor="requires-files"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  This task requires workers to upload files
                </label>
              </div>

              {newTaskRequiresFile && (
                <div className="space-y-3 ml-6 border-l-2 border-border pl-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Accepted File Types
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Images", value: "image/*" },
                        { label: "PDFs", value: ".pdf" },
                        { label: "Documents", value: ".doc,.docx,.rtf" },
                        { label: "Spreadsheets", value: ".xls,.xlsx,.csv" },
                        { label: "Text Files", value: ".txt,.md" },
                        { label: "Archives", value: ".zip,.rar,.7z" },
                        { label: "Audio", value: "audio/*" },
                        { label: "Video", value: "video/*" },
                        {
                          label: "Code Files",
                          value: ".js,.ts,.py,.html,.css,.json",
                        },
                        {
                          label: "Design Files",
                          value: ".psd,.ai,.sketch,.fig,.xd",
                        },
                        { label: "Presentations", value: ".ppt,.pptx" },
                        { label: "Any File", value: "*" },
                      ].map((type) => (
                        <Badge
                          key={type.value}
                          variant={
                            newTaskFileTypes.includes(type.value)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => {
                            if (newTaskFileTypes.includes(type.value)) {
                              setNewTaskFileTypes(
                                newTaskFileTypes.filter((t) => t !== type.value)
                              );
                            } else {
                              setNewTaskFileTypes([
                                ...newTaskFileTypes,
                                type.value,
                              ]);
                            }
                          }}
                        >
                          {type.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      className="text-sm font-medium"
                      htmlFor="custom-file-type"
                    >
                      Custom File Type (optional)
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="custom-file-type"
                        placeholder="e.g., .psd, .ai, .sketch"
                        value={customFileType}
                        onChange={(e) => setCustomFileType(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (
                            customFileType.trim() &&
                            !newTaskFileTypes.includes(customFileType.trim())
                          ) {
                            setNewTaskFileTypes([
                              ...newTaskFileTypes,
                              customFileType.trim(),
                            ]);
                            setCustomFileType("");
                          }
                        }}
                        disabled={!customFileType.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {newTaskFileTypes.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <strong>Selected:</strong> {newTaskFileTypes.join(", ")}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment & Workers */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-sm font-medium text-primary">
                Payment & Workers
              </h3>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="t-reward">
                  Reward per Worker (USDC){" "}
                  <span className="text-destructive">*</span>
                </label>
                <Input
                  id="t-reward"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={newTaskReward}
                  onChange={(e) => {
                    console.log("Reward input changed:", e.target.value);
                    setNewTaskReward(Number.parseFloat(e.target.value || "0"));
                  }}
                  onFocus={() => console.log("Reward input focused")}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-0"
                  readOnly={false}
                  disabled={false}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum: $0.01 • Suggested: $0.50-$2.00 for most micro-tasks
                </p>
              </div>

              <div className="rounded-md bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Cost per Worker</span>
                  <span className="text-lg font-bold text-primary">
                    ${escrowTotal.toFixed(2)} USDC
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Workers will be paid this amount upon task completion and
                  approval (max 50 workers)
                </p>
              </div>
            </div>

            <Button
              className="w-full rounded-md h-12 text-base font-semibold"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
              onClick={addTask}
              disabled={
                !newTaskTitle.trim() ||
                !newTaskDesc.trim() ||
                newTaskReward <= 0 ||
                (newTaskRequiresFile && newTaskFileTypes.length === 0)
              }
            >
              � Post Task (${escrowTotal.toFixed(2)} USDC per worker)
            </Button>

            {taskSubmissionSuccess ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-green-600 dark:text-green-400 text-lg">
                    ✅
                  </span>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Task successfully posted!
                  </p>
                </div>
                <p className="text-xs text-green-700 dark:text-green-300 text-center mt-1">
                  Your task is now available to workers and will appear in their
                  dashboard.
                </p>
              </div>
            ) : (
              (!newTaskTitle.trim() ||
                !newTaskDesc.trim() ||
                newTaskReward <= 0 ||
                (newTaskRequiresFile && newTaskFileTypes.length === 0)) && (
                <div className="space-y-1">
                  <p className="text-xs text-destructive text-center">
                    Please fix the following issues:
                  </p>
                  <ul className="text-xs text-destructive text-center space-y-0.5">
                    {!newTaskTitle.trim() && <li>• Task title is required</li>}
                    {!newTaskDesc.trim() && (
                      <li>• Task description is required</li>
                    )}
                    {newTaskReward <= 0 && (
                      <li>• Reward must be greater than $0.00</li>
                    )}
                    {newTaskRequiresFile && newTaskFileTypes.length === 0 && (
                      <li>
                        • Please select at least one file type when files are
                        required
                      </li>
                    )}
                  </ul>
                </div>
              )
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {submissions.map((s) => (
            <SubmissionCard
              key={s.id}
              sub={s}
              onApprove={approve}
              onReject={reject}
            />
          ))}
          {submissions.length === 0 && (
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" {...props}>
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.5 7.5a1 1 0 0 1-1.414 0l-3-3A1 1 0 1 1 6.207 10.6l2.293 2.293 6.793-6.793a1 1 0 0 1 1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <div className="inline-flex items-center justify-center">
      <span
        className="block size-6 rounded-full animate-spin"
        style={{
          border: "3px solid rgba(255,255,255,0.12)",
          borderTopColor: "var(--primary)",
          borderRightColor: "var(--primary)",
        }}
        aria-label="Loading"
      />
    </div>
  );
}
