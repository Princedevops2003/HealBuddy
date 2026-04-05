function localIsoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Build 7-day labels and values aligned to calendar days (missing entries → 0). */
export function buildWeekSeries(entries, field) {
  const byDate = new Map(entries.map((e) => [e.date, e]));
  const labels = [];
  const values = [];
  const today = new Date();

  for (let offset = 6; offset >= 0; offset -= 1) {
    const d = new Date(today);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - offset);
    const iso = localIsoDate(d);
    labels.push(
      d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
    );
    const row = byDate.get(iso);
    const raw = row?.[field];
    const num = typeof raw === "number" ? raw : raw != null ? Number(raw) : 0;
    values.push(Number.isFinite(num) ? num : 0);
  }

  return { labels, values };
}
