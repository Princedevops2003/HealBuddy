import { useEffect, useRef, useState } from "react";
import { getHealBotReply } from "../lib/healBot.js";

const WELCOME =
  "Hi! Ask about hydration, sleep, exercise, or stress — I’ll share simple wellness tips.";

export function HealBuddyChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "bot", text: WELCOME }]);
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const reply = getHealBotReply(text);
    setMessages((prev) => [...prev, { role: "user", text }, { role: "bot", text: reply }]);
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-2xl text-white shadow-lg shadow-teal-900/40 ring-2 ring-teal-400/30 transition hover:bg-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:bottom-6 sm:right-6"
        aria-expanded={open}
        aria-label={open ? "Close wellness chat" : "Open wellness chat"}
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div
          className="fixed inset-x-3 bottom-20 z-50 flex max-h-[min(520px,70vh)] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl sm:inset-x-auto sm:right-6 sm:w-[380px]"
          role="dialog"
          aria-label="Wellness tips chat"
        >
          <div className="border-b border-slate-700 bg-slate-800/80 px-4 py-3">
            <p className="font-semibold text-teal-300">HealBuddy tips</p>
            <p className="text-xs text-slate-500">Rule-based • general ideas only</p>
          </div>

          <div
            ref={listRef}
            className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 text-sm"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[90%] rounded-2xl px-3 py-2 leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-teal-600 text-white"
                    : "mr-auto border border-slate-600 bg-slate-800 text-slate-200"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-700 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="e.g. tips for sleep…"
                className="min-w-0 flex-1 rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                aria-label="Message"
              />
              <button
                type="button"
                onClick={send}
                className="shrink-0 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] leading-tight text-amber-200/80">
              Not medical advice. For health concerns, talk to a qualified professional.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
