/** Rule-based wellness tips — not medical advice. */

const HYDRATION = [
  "Aim for steady sips across the day rather than chugging all at once.",
  "If plain water feels boring, try herbal tea or fruit-infused water.",
  "Urine that’s pale yellow usually means you’re doing fine on fluids.",
];

const SLEEP = [
  "Keep a similar wake time every day — it anchors your body clock.",
  "Dim screens and bright lights 1 hour before bed when you can.",
  "A short wind-down routine (stretching, reading) signals sleep mode.",
];

const EXERCISE = [
  "Even 10-minute walks add up — consistency beats perfection.",
  "If you’re new, start small and build so it stays enjoyable.",
  "Mix easy days with harder ones to reduce injury risk.",
];

const STRESS = [
  "Try box breathing: 4 counts in, hold 4, out 4, hold 4 — repeat a few rounds.",
  "Name what you can control today vs. what you can’t — focus on the first.",
  "Short breaks away from the screen can reset tension more than you expect.",
];

const RULES = [
  {
    test: (t) =>
      /\b(hydrat|water|drink|fluid|thirst|dehydrat|litre|liter|cup|glass)\b/i.test(t),
    title: "Hydration",
    lines: HYDRATION,
  },
  {
    test: (t) =>
      /\b(sleep|rest|insomnia|tired|fatigue|nap|bedtime|wake|insomni)\b/i.test(t),
    title: "Sleep",
    lines: SLEEP,
  },
  {
    test: (t) =>
      /\b(exercise|workout|steps|walk|run|cardio|gym|jog|active|movement|fitness)\b/i.test(
        t
      ),
    title: "Exercise",
    lines: EXERCISE,
  },
  {
    test: (t) =>
      /\b(stress|anxious|anxiety|overwhelm|worry|panic|calm|mental|burnout|relax)\b/i.test(t),
    title: "Stress",
    lines: STRESS,
  },
];

function pickLine(lines) {
  return lines[Math.floor(Math.random() * lines.length)];
}

export function getHealBotReply(userText) {
  const t = (userText || "").trim();
  if (!t) {
    return "Ask me about hydration, sleep, exercise, or stress — I’ll share general wellness ideas.";
  }

  if (/^(hi|hello|hey|good\s*(morning|afternoon|evening))\b/i.test(t)) {
    return "Hi! I’m HealBuddy’s tips bot. Try asking about hydration, sleep, exercise, or stress.";
  }

  if (/\b(help|what\s*can\s*you|how\s*do\s*you\s*work)\b/i.test(t)) {
    return "I match keywords and share simple habit ideas. Topics: hydration, sleep, exercise, stress. I’m not a doctor.";
  }

  const matches = RULES.filter((r) => r.test(t));
  if (matches.length === 0) {
    return "I’m focused on hydration, sleep, exercise, and stress. Rephrase with one of those words, or type “help”.";
  }

  if (matches.length === 1) {
    const m = matches[0];
    return `${m.title}: ${pickLine(m.lines)}`;
  }

  const parts = matches.map((m) => `${m.title}: ${pickLine(m.lines)}`);
  return parts.join(" ");
}
