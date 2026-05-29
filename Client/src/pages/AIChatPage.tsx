import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Seo } from "@/components/common/Seo";
import { useAuth } from "@/context/AuthContext";
import { fadeUp, staggerContainer } from "@/utils/animations";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: number;
  role: ChatRole;
  content: string;
};

const quickPrompts = [
  "Best beaches in Goa",
  "Budget trip ideas for Bali",
  "Hidden places in Manali",
  "Food spots in Tokyo",
];

const starterMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hi, I’m Trip AI Assistant. Ask me about hidden spots, food, budgets, weather, or destination ideas and I’ll help you plan smarter.",
  },
];

function Avatar() {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.14)] bg-[linear-gradient(135deg,rgba(8,15,35,0.95),rgba(12,24,54,0.78))] shadow-[0_0_30px_rgba(34,211,238,0.12)]">
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.35),transparent_52%),radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.35),transparent_55%)] opacity-90" />
      <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-[rgba(255,255,255,0.08)] text-lg font-semibold text-white ring-1 ring-[rgba(255,255,255,0.12)]">
        AI
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 rounded-[28px] border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[var(--accent-cyan)] [animation-delay:-0.18s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[rgba(139,92,246,0.85)] [animation-delay:-0.06s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[rgba(255,255,255,0.78)]" />
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">Trip AI is thinking...</p>
        <p className="text-xs text-[var(--text-tertiary)]">Searching for the best travel answer</p>
      </div>
    </div>
  );
}

export default function AIChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const nextId = useRef(2);

  const greetingName = useMemo(() => user?.name?.split(" ")[0] || "Traveler", [user?.name]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  useEffect(() => {
    document.title = "Trip AI Assistant · Trip AI";
  }, []);

  const sendMessage = async (messageText: string) => {
    const normalized = messageText.trim();

    if (!normalized || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: "user",
      content: normalized,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await api.post("/ai/chat", { message: normalized });
      const reply = response.data?.reply || "I couldn’t generate a response right now. Try rephrasing your travel question.";

      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (error: any) {
      const fallback = error?.response?.data?.message || "Trip AI could not reply right now. Please try again.";

      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "assistant",
          content: fallback,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Seo title="Trip AI Assistant" />
      <div className="relative flex min-h-[calc(100vh-var(--nav-height))] overflow-hidden text-[var(--text-primary)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.20),transparent_26%),linear-gradient(180deg,rgba(3,8,20,0.96),rgba(7,12,28,1))]" />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-5rem] top-20 h-96 w-96 rounded-full bg-[rgba(34,211,238,0.12)] blur-3xl"
          animate={{ x: [0, 18, 0], y: [0, -14, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-7rem] top-28 h-[28rem] w-[28rem] rounded-full bg-[rgba(139,92,246,0.14)] blur-3xl"
          animate={{ x: [0, -16, 0], y: [0, 12, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />

        <main className="relative z-10 flex w-full flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mx-auto w-full max-w-6xl overflow-hidden rounded-[32px] border border-[rgba(255,255,255,0.10)] bg-[rgba(9,14,30,0.72)] shadow-[0_28px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
          >
            <div className="border-b border-[rgba(255,255,255,0.08)] bg-[linear-gradient(135deg,rgba(9,14,30,0.92),rgba(12,20,42,0.74))] px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar />
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="font-display text-3xl tracking-[-0.05em] text-white sm:text-4xl">Trip AI Assistant</h1>
                      <span className="h-3 w-3 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_18px_rgba(34,211,238,0.8)]" />
                    </div>
                    <p className="mt-1 text-sm text-[rgba(226,232,240,0.72)]">Your intelligent travel companion</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.28em] text-[rgba(148,163,184,0.72)]">Ask for places, food, budgets, weather, and local tips</p>
                  </div>
                </div>
                <div className="rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm text-[rgba(226,232,240,0.78)]">
                  Welcome back, <span className="text-white">{greetingName}</span>
                </div>
              </div>
            </div>

            <div className="grid min-h-[calc(100vh-var(--nav-height)-7rem)] grid-rows-[auto_1fr_auto]">
              <div className="border-b border-[rgba(255,255,255,0.06)] px-5 py-4 sm:px-6">
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(prompt)}
                      className="rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm text-[rgba(226,232,240,0.84)] transition-all duration-[var(--dur-fast)] hover:-translate-y-0.5 hover:border-[rgba(34,211,238,0.28)] hover:bg-[rgba(34,211,238,0.10)]"
                      disabled={isSending}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="chat-scroll relative overflow-y-auto px-4 py-5 sm:px-6">
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="mx-auto flex w-full max-w-4xl flex-col gap-4">
                  <AnimatePresence initial={false}>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        layout
                        initial={{ opacity: 0, y: 14, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[92%] rounded-[28px] px-4 py-3 text-sm leading-7 sm:max-w-[78%] sm:px-5 sm:py-4 ${
                            message.role === "user"
                              ? "border border-[rgba(34,211,238,0.25)] bg-[linear-gradient(135deg,rgba(14,165,233,0.38),rgba(139,92,246,0.42))] text-white shadow-[0_18px_40px_rgba(8,15,35,0.45)]"
                              : "border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.05)] text-[rgba(226,232,240,0.90)] shadow-[0_16px_36px_rgba(0,0,0,0.24)] backdrop-blur-xl"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isSending ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="flex justify-start">
                      <TypingIndicator />
                    </motion.div>
                  ) : null}
                  <div ref={bottomRef} />
                </motion.div>
              </div>

              <div className="border-t border-[rgba(255,255,255,0.08)] bg-[rgba(6,10,20,0.75)] px-4 py-4 sm:px-6">
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void sendMessage(input);
                  }}
                  className="mx-auto flex w-full max-w-4xl items-end gap-3"
                >
                  <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.12),transparent_30%)] opacity-100" />
                    <textarea
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          void sendMessage(input);
                        }
                      }}
                      placeholder="Ask your AI travel assistant..."
                      rows={1}
                      className="relative min-h-[72px] w-full resize-none rounded-[28px] border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.05)] px-5 py-4 pr-14 text-[15px] leading-7 text-white outline-none transition-all duration-[var(--dur-fast)] placeholder:text-[rgba(226,232,240,0.40)] focus:border-[rgba(34,211,238,0.42)] focus:bg-[rgba(255,255,255,0.07)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.22),0_0_0_8px_rgba(34,211,238,0.06)]"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSending || !input.trim()}
                    whileHover={{ scale: isSending || !input.trim() ? 1 : 1.03 }}
                    whileTap={{ scale: isSending || !input.trim() ? 1 : 0.98 }}
                    className="inline-flex h-[72px] w-[72px] items-center justify-center rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[linear-gradient(135deg,rgba(34,211,238,0.86),rgba(59,130,246,0.88),rgba(139,92,246,0.88))] text-white shadow-[0_18px_40px_rgba(34,211,238,0.20)] transition-opacity duration-[var(--dur-fast)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <svg viewBox="0 0 24 24" className={`h-5 w-5 transition-transform duration-[var(--dur-fast)] ${isSending ? "translate-x-0.5" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2L11 13" />
                      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </motion.button>
                </form>

                <div className="mx-auto mt-3 flex w-full max-w-4xl items-center justify-between gap-4 text-xs text-[rgba(148,163,184,0.78)]">
                  <p>Press Enter to send. Shift + Enter for a new line.</p>
                  <Link to="/app/dashboard" className="text-[var(--accent-cyan)] transition-colors hover:text-white">
                    Back to dashboard
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        </main>
      </div>
    </>
  );
}