"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/hustlers/header"
import { TaskCard, type Task } from "@/components/hustlers/task-card"
import { SubmissionCard, type Submission } from "@/components/hustlers/submission-card"
import { cn } from "@/lib/utils"

type Step = "idle" | "connecting" | "connected" | "verifying" | "verified"

export default function Page() {
  // Auth/identity simulation
  const [step, setStep] = useState<Step>("idle")
  const [wallet, setWallet] = useState<string | null>(null)
  const [worldIdHash, setWorldIdHash] = useState<string | undefined>(undefined)
  const [userId, setUserId] = useState<string | undefined>(undefined)

  // App state
  const [userType, setUserType] = useState<"worker" | "client">("worker")
  const [claimedTask, setClaimedTask] = useState<Task | null>(null)
  const [proofText, setProofText] = useState("")

  // Demo data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "t1",
      title: "Rate an AI summary (1 min)",
      reward: 0.5,
      slots: { taken: 35, max: 50 },
      description: "Read the summary and rate 1-5 with a short note.",
    },
    {
      id: "t2",
      title: "Find a broken link (2 min)",
      reward: 0.75,
      slots: { taken: 50, max: 50 },
      description: "Browse provided page and paste any broken link.",
    },
    {
      id: "t3",
      title: "Transcribe 30s audio (2-3 min)",
      reward: 1.2,
      slots: { taken: 4, max: 10 },
      description: "Listen and provide accurate transcript.",
    },
  ])
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: "s1",
      taskTitle: "Rate an AI summary (1 min)",
      workerHash: "wid_0x9f2c1ab3d93a7e21fefc4481aa77a6cc4e57f2b9",
      proof: "Rating: 4/5\nFeedback: Coherent but missed one key point about context.",
      status: "pending",
    },
  ])

  // Post Task form
  const [postTab, setPostTab] = useState<"review" | "post">("review")
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDesc, setNewTaskDesc] = useState("")
  const [newTaskReward, setNewTaskReward] = useState<number>(0.5)
  const [newTaskMax, setNewTaskMax] = useState<number>(10)
  const escrowTotal = useMemo(
    () => Math.max(0, newTaskReward) * Math.max(0, Math.floor(newTaskMax || 0)),
    [newTaskReward, newTaskMax],
  )

  const verified = step === "verified"

  function randomHex(len: number) {
    const chars = "abcdef0123456789"
    let s = ""
    for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)]
    return s
  }

  async function onPrimaryAction() {
    if (step === "idle") {
      setStep("connecting")
      await wait(900)
      const addr = "0x" + randomHex(40)
      setWallet(addr)
      setUserId("user_" + addr.slice(2, 8))
      setStep("connected")
      return
    }
    if (step === "connected") {
      setStep("verifying")
      await wait(1000)
      const wid = "wid_0x" + randomHex(40)
      setWorldIdHash(wid)
      setStep("verified")
      return
    }
    if (step === "verified") {
      // no-op or navigate; dashboard shows automatically
    }
  }

  function wait(ms: number) {
    return new Promise((r) => setTimeout(r, ms))
  }

  function handleClaim(task: Task) {
    setClaimedTask(task)
  }

  function submitWork() {
    if (!claimedTask || !worldIdHash) return
    // Simulate taking a slot and creating a pending submission
    setTasks((prev) =>
      prev.map((t) =>
        t.id === claimedTask.id ? { ...t, slots: { ...t.slots, taken: Math.min(t.slots.taken + 1, t.slots.max) } } : t,
      ),
    )
    setSubmissions((prev) => [
      {
        id: "s_" + randomHex(8),
        taskTitle: claimedTask.title,
        workerHash: worldIdHash,
        proof: proofText || "(no proof provided)",
        status: "pending",
      },
      ...prev,
    ])
    setProofText("")
    setClaimedTask(null)
  }

  function approve(id: string) {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "approved" } : s)))
  }
  function reject(id: string) {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "rejected" } : s)))
  }

  return (
    <main className="min-h-dvh">
      {/* Header shows after verification so the Connect screen stays focused */}
      {verified && (
        <Header
          userType={userType}
          onToggle={setUserType}
          worldIdHash={worldIdHash}
          userId={userId}
          verified={verified}
        />
      )}

      {/* Screen 1: Connect & Verify */}
      {!verified && (
        <section className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl px-4 min-h-dvh flex items-center justify-center">
          <div className="w-full flex flex-col items-center text-center gap-8">
            <h1 className="text-3xl font-bold text-balance" style={{ color: "var(--primary)" }}>
              HustlersHub
            </h1>
            <p className="text-muted-foreground text-pretty">The bot-proof marketplace for human micro-tasks.</p>

            <Card className="w-full bg-card border-border transition-all duration-300 hover:shadow-md hover-glow-primary">
              <CardHeader>
                <CardTitle className="text-left text-lg">Get Started</CardTitle>
                <CardDescription className="text-left">
                  Connect your wallet and verify with World ID to continue.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Button
                  className={cn(
                    "w-full h-12 rounded-lg transition-all duration-300 hover:scale-[1.01] active:scale-95",
                    "bg-primary text-primary-foreground",
                  )}
                  onClick={onPrimaryAction}
                  disabled={step === "connecting" || step === "verifying"}
                  aria-busy={step === "connecting" || step === "verifying"}
                >
                  {step === "idle" && "Connect Wallet"}
                  {step === "connecting" && "Connecting..."}
                  {step === "connected" && "Verify with World ID"}
                  {step === "verifying" && "Verifying..."}
                  {step === "verified" && "Verified"}
                </Button>

                {step === "connecting" || step === "verifying" ? (
                  <div className="flex items-center justify-center py-6">
                    <Spinner />
                  </div>
                ) : (
                  wallet && (
                    <div className="text-xs text-left text-muted-foreground">
                      Connected: {wallet.slice(0, 10)}…{wallet.slice(-6)}
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            {step === "verified" && (
              <div className="w-full">
                <VerifiedPill />
              </div>
            )}
          </div>
        </section>
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
                  id: "t_" + Math.random().toString(36).slice(2, 9),
                  title: newTaskTitle || "Untitled Task",
                  reward: Math.max(0, Number(newTaskReward) || 0),
                  slots: { taken: 0, max: Math.max(1, Math.floor(Number(newTaskMax) || 1)) },
                  description: newTaskDesc || "No description.",
                }
                setTasks((prev) => [nt, ...prev])
                setNewTaskTitle("")
                setNewTaskDesc("")
                setNewTaskReward(0.5)
                setNewTaskMax(10)
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
            <div className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">{claimedTask.description}</p>
              <label className="text-sm font-medium" htmlFor="proof">
                Proof of Work
              </label>
              <Textarea
                id="proof"
                className="min-h-32 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-0"
                placeholder="Paste text, links, or notes that prove your work."
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => setClaimedTask(null)} className="rounded-md">
                  Back
                </Button>
                <Button
                  className="rounded-md transition-all duration-300 hover:scale-[1.01] active:scale-95"
                  style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                  onClick={submitWork}
                >
                  Submit Work
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function VerifiedPill() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-sm transition-colors duration-300">
      <CheckIcon className="size-4" style={{ color: "var(--primary)" }} aria-hidden />
      <span>World ID Verified</span>
    </div>
  )
}

function WorkerDashboard({
  tasks,
  onClaim,
}: {
  tasks: Task[]
  onClaim: (t: Task) => void
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
  )
}

function ClientDashboard(props: {
  submissions: Submission[]
  approve: (id: string) => void
  reject: (id: string) => void
  postTab: "review" | "post"
  setPostTab: (t: "review" | "post") => void
  newTaskTitle: string
  setNewTaskTitle: (v: string) => void
  newTaskDesc: string
  setNewTaskDesc: (v: string) => void
  newTaskReward: number
  setNewTaskReward: (v: number) => void
  newTaskMax: number
  setNewTaskMax: (v: number) => void
  escrowTotal: number
  addTask: () => void
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
  } = props

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-secondary p-1 inline-flex">
        <Button
          variant="ghost"
          className={cn("h-9 px-3 rounded-md text-sm", postTab === "review" && "bg-primary text-primary-foreground")}
          onClick={() => setPostTab("review")}
        >
          Review Submissions ({submissions.filter((s) => s.status === "pending").length})
        </Button>
        <Button
          variant="ghost"
          className={cn("h-9 px-3 rounded-md text-sm", postTab === "post" && "bg-primary text-primary-foreground")}
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
                  onChange={(e) => setNewTaskReward(Number.parseFloat(e.target.value || "0"))}
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
                  onChange={(e) => setNewTaskMax(Number.parseInt(e.target.value || "1", 10))}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <div className="rounded-md bg-secondary/60 border border-border/60 p-3 text-sm flex items-center justify-between">
              <span>Total Escrow Amount</span>
              <span className="font-semibold" style={{ color: "var(--primary)" }}>
                ${escrowTotal.toFixed(2)} USDC
              </span>
            </div>

            <Button
              className="w-full rounded-md"
              style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
              onClick={addTask}
            >
              Lock Funds in Escrow and Post Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {submissions.map((s) => (
            <SubmissionCard key={s.id} sub={s} onApprove={approve} onReject={reject} />
          ))}
          {submissions.length === 0 && <p className="text-sm text-muted-foreground">No submissions yet.</p>}
        </div>
      )}
    </div>
  )
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
  )
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
  )
}
