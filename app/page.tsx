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
import { Header } from "@/components/hustlers/header";
import { TaskCard, type Task } from "@/components/hustlers/task-card";
import {
  SubmissionCard,
  type Submission,
} from "@/components/hustlers/submission-card";
import { cn } from "@/lib/utils";
import { useWorldcoinAuth } from "@/hooks/use-worldcoin-auth";

export default function Page() {
  // Real Worldcoin authentication
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
      status: "pending",
    },
  ]);

  // Post Task form
  const [postTab, setPostTab] = useState<"review" | "post">("review");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskReward, setNewTaskReward] = useState<number>(0.5);
  const [newTaskMax, setNewTaskMax] = useState<number>(10);
  const escrowTotal = useMemo(
    () => Math.max(0, newTaskReward) * Math.max(0, Math.floor(newTaskMax || 0)),
    [newTaskReward, newTaskMax]
  );

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

  async function onPrimaryAction() {
    if (!isConnected) {
      await connectWallet();
    } else if (isConnected && !isVerified) {
      await verifyWorldId();
    }
  }

  function handleClaim(task: Task) {
    setClaimedTask(task);
    setUploadedFiles([]); // Reset files when claiming new task
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
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
    if (!claimedTask || !worldIdHash) return;

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
        workerHash: worldIdHash,
        proof: fullProof,
        status: "pending",
      },
      ...prev,
    ]);
    setProofText("");
    setUploadedFiles([]);
    setClaimedTask(null);
  }

  function approve(id: string) {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "approved" } : s))
    );
  }
  function reject(id: string) {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "rejected" } : s))
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
        <div className="min-h-dvh bg-gradient-to-br from-background via-background to-secondary/20">
          {/* Hero Section */}
          <section className="mx-auto w-full max-w-6xl px-4 py-12 md:py-20">
            <div className="text-center space-y-8">
              <div className="space-y-4 fade-in-up">
                <h1 className="text-4xl md:text-6xl font-bold text-balance bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent floating">
                  HustlersHub
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-2xl mx-auto fade-in-up-delay">
                  The bot-proof marketplace where human micro-tasks meet
                  blockchain verification
                </p>
              </div>

              {/* Connect Wallet Card */}
              <div className="max-w-md mx-auto">
                <Card className="bg-card/80 backdrop-blur border-border transition-all duration-300 hover:shadow-lg hover-glow-primary">
                  <CardHeader>
                    <CardTitle className="text-center text-lg">
                      Get Started
                    </CardTitle>
                    <CardDescription className="text-center">
                      Connect your wallet and verify with World ID to join the
                      marketplace
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      className={cn(
                        "w-full h-12 rounded-lg transition-all duration-300 hover:scale-[1.01] active:scale-95",
                        "bg-primary text-primary-foreground shadow-lg"
                      )}
                      onClick={onPrimaryAction}
                      disabled={step === "connecting" || step === "verifying"}
                      aria-busy={step === "connecting" || step === "verifying"}
                    >
                      {step === "idle" && "🔗 Connect Wallet"}
                      {step === "connecting" && "🔄 Connecting..."}
                      {step === "connected" && "🌍 Verify with World ID"}
                      {step === "verifying" && "✨ Verifying..."}
                      {step === "verified" && "✅ Verified"}
                    </Button>

                    {step === "connecting" || step === "verifying" ? (
                      <div className="flex items-center justify-center py-4">
                        <Spinner />
                      </div>
                    ) : (
                      walletAddress && (
                        <div className="text-xs text-center text-muted-foreground p-2 bg-secondary/50 rounded-md">
                          Connected: {walletAddress.slice(0, 10)}…
                          {walletAddress.slice(-6)}
                        </div>
                      )
                    )}

                    {authError && (
                      <div className="text-xs text-center text-destructive p-2 bg-destructive/10 rounded-md">
                        {authError}
                      </div>
                    )}

                    {!isInWorldApp && (
                      <div className="text-xs text-center text-amber-600 dark:text-amber-400 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                        ⚠️ For full functionality, open this app in World App
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {step === "verified" && (
                <div className="flex justify-center">
                  <VerifiedPill />
                </div>
              )}
            </div>
          </section>

          {/* Features Section */}
          <section className="mx-auto w-full max-w-6xl px-4 py-16">
            <div className="text-center space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Why HustlersHub?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Built on Worldcoin's human verification technology to ensure
                  every participant is a real person
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover-glow-primary group">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <span className="text-2xl">🛡️</span>
                    </div>
                    <CardTitle className="text-xl">
                      Bot-Proof Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      World ID verification ensures every user is a unique
                      human, eliminating bots and fake accounts from the
                      marketplace.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover-glow-primary group">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <span className="text-2xl">💰</span>
                    </div>
                    <CardTitle className="text-xl">
                      Instant USDC Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      Complete micro-tasks and earn USDC rewards instantly. From
                      simple ratings to data transcription - every task counts.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover-glow-primary group">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <CardTitle className="text-xl">Lightning Fast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      Most tasks take just 1-3 minutes to complete. Perfect for
                      earning during coffee breaks or commute time.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="mx-auto w-full max-w-6xl px-4 py-16">
            <div className="text-center space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join as a Worker to earn or as a Client to post tasks
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Worker Flow */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-primary">
                    👷 As a Worker
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 text-left">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold">Connect & Verify</h4>
                        <p className="text-muted-foreground text-sm">
                          Connect your wallet and complete World ID verification
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 text-left">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold">Browse Tasks</h4>
                        <p className="text-muted-foreground text-sm">
                          Explore available micro-tasks with clear USDC rewards
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 text-left">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold">Complete & Earn</h4>
                        <p className="text-muted-foreground text-sm">
                          Submit your work and receive instant USDC payments
                          upon approval
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Flow */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-primary">
                    💼 As a Client
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 text-left">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold">Connect & Verify</h4>
                        <p className="text-muted-foreground text-sm">
                          Secure your account with wallet connection and World
                          ID
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 text-left">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold">Post Tasks</h4>
                        <p className="text-muted-foreground text-sm">
                          Create micro-tasks with clear instructions and fair
                          rewards
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 text-left">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold">Review & Pay</h4>
                        <p className="text-muted-foreground text-sm">
                          Review submissions and approve quality work for
                          automatic payment
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Example Tasks Section */}
          <section className="mx-auto w-full max-w-6xl px-4 py-16">
            <div className="text-center space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Popular Task Types
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  From simple ratings to data entry - find tasks that match your
                  skills
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-card to-secondary/10 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      ⭐ Rate AI Summary
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                        $0.50
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Read AI-generated summaries and provide ratings with brief
                      feedback. Takes ~1 minute.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-secondary/10 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      🔍 Find Broken Links
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                        $0.75
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Browse web pages and identify broken or invalid links.
                      Takes ~2 minutes.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-secondary/10 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      🎧 Transcribe Audio
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                        $1.20
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Listen to short audio clips and provide accurate
                      transcriptions. Takes ~3 minutes.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mx-auto w-full max-w-6xl px-4 py-16">
            <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
              <CardContent className="text-center py-12 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Ready to Start Earning?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of verified humans earning USDC through
                  meaningful micro-tasks
                </p>
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
                  onClick={onPrimaryAction}
                  disabled={step === "connecting" || step === "verifying"}
                >
                  {step === "idle" && "🚀 Get Started Now"}
                  {step === "connecting" && "🔄 Connecting..."}
                  {step === "connected" && "🌍 Complete Verification"}
                  {step === "verifying" && "✨ Verifying..."}
                  {step === "verified" && "✅ Welcome to HustlersHub!"}
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Footer */}
          <footer className="border-t border-border/50 mt-20">
            <div className="mx-auto w-full max-w-6xl px-4 py-12">
              <div className="grid md:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-primary">
                    HustlersHub
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    The bot-proof marketplace for human micro-tasks, powered by
                    Worldcoin verification.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Platform</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>🌍 World ID Verified</p>
                    <p>⛓️ Blockchain Secured</p>
                    <p>💰 USDC Rewards</p>
                    <p>🛡️ Bot-Proof</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Task Types</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Data Entry</p>
                    <p>Content Rating</p>
                    <p>Audio Transcription</p>
                    <p>Link Verification</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Getting Started</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Download World App</p>
                    <p>Connect Wallet</p>
                    <p>Verify Identity</p>
                    <p>Start Earning</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/50 mt-8 pt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Built with ❤️ using Worldcoin MiniKit • Ensuring every
                  participant is human
                </p>
              </div>
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
              newTaskMax={newTaskMax}
              setNewTaskMax={setNewTaskMax}
              escrowTotal={escrowTotal}
              addTask={() => {
                const nt: Task = {
                  id: "t_" + crypto.randomUUID().slice(0, 8),
                  title: newTaskTitle || "Untitled Task",
                  reward: Math.max(0, Number(newTaskReward) || 0),
                  slots: {
                    taken: 0,
                    max: Math.max(1, Math.floor(Number(newTaskMax) || 1)),
                  },
                  description: newTaskDesc || "No description.",
                };
                setTasks((prev) => [nt, ...prev]);
                setNewTaskTitle("");
                setNewTaskDesc("");
                setNewTaskReward(0.5);
                setNewTaskMax(10);
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

                  <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
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
                      className="cursor-pointer flex flex-col items-center gap-2 text-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xl">📁</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Click to upload files
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Or drag and drop your files here
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Uploaded Files:</p>
                      <div className="space-y-1">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-secondary/50 rounded-md"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-sm">📎</span>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
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
  newTaskMax: number;
  setNewTaskMax: (v: number) => void;
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
    newTaskMax,
    setNewTaskMax,
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
            <CardTitle className="text-lg">Create Task</CardTitle>
            <CardDescription>Minimal fields for fast posting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="t-title">
                Task Title
              </label>
              <Input
                id="t-title"
                placeholder="e.g., Rate an AI summary"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-0"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="t-desc">
                Description / Instructions
              </label>
              <Textarea
                id="t-desc"
                className="min-h-28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-0"
                placeholder="Describe the micro-task with clear instructions..."
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="t-reward">
                  Reward per Worker (USDC)
                </label>
                <Input
                  id="t-reward"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newTaskReward}
                  onChange={(e) =>
                    setNewTaskReward(Number.parseFloat(e.target.value || "0"))
                  }
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="t-max">
                  Max Workers
                </label>
                <Input
                  id="t-max"
                  type="number"
                  step="1"
                  min="1"
                  value={newTaskMax}
                  onChange={(e) =>
                    setNewTaskMax(Number.parseInt(e.target.value || "1", 10))
                  }
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <div className="rounded-md bg-secondary/60 border border-border/60 p-3 text-sm flex items-center justify-between">
              <span>Total Escrow Amount</span>
              <span
                className="font-semibold"
                style={{ color: "var(--primary)" }}
              >
                ${escrowTotal.toFixed(2)} USDC
              </span>
            </div>

            <Button
              className="w-full rounded-md"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
              onClick={addTask}
            >
              Lock Funds in Escrow and Post Task
            </Button>
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
