import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { StepsChart } from "../components/charts/StepsChart.jsx";
import { WaterChart } from "../components/charts/WaterChart.jsx";
import {
  IconMood,
  IconSleep,
  IconSteps,
  IconWater,
} from "../components/icons.jsx";
import { Spinner } from "../components/Spinner.jsx";
import { Card, CardTitle, CardValue } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { buildWeekSeries } from "../lib/weekSeries.js";

function hasTodayMetrics(today) {
  if (!today) return false;
  return (
    today.sleep != null ||
    today.water != null ||
    today.steps != null ||
    Boolean(today.mood && String(today.mood).trim())
  );
}

function formatToday(entry) {
  if (!entry) return "—";
  const parts = [];
  if (entry.sleep != null) parts.push(`${entry.sleep} h sleep`);
  if (entry.water != null) parts.push(`${entry.water} L water`);
  if (entry.steps != null) parts.push(`${entry.steps.toLocaleString()} steps`);
  if (entry.mood) parts.push(`Mood: ${entry.mood}`);
  return parts.length ? parts.join(" · ") : "No details logged yet";
}

function StatCard({ icon: Icon, iconClass, title, value, hint, muted, valueClassName = "" }) {
  return (
    <Card
      className={`relative overflow-hidden ${muted ? "border-dashed border-slate-700/80 bg-slate-900/40" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <CardTitle>{title}</CardTitle>
          <CardValue className={[muted ? "text-slate-500" : "", valueClassName].filter(Boolean).join(" ")}>
            {value}
          </CardValue>
          {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
          aria-hidden
        >
          <Icon />
        </div>
      </div>
    </Card>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.dashboard();
      setData(res);
      console.log(data);
    } catch (e) {
      setError(e.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, []);

  const today = data?.today;
  let suggestions = [];

if (today?.water != null && today.water < 2) {
  suggestions.push("💧 Drink more water (at least 2L daily)");
}

if (today?.sleep != null && today.sleep < 6) {
  suggestions.push("😴 Try to get at least 6-8 hours of sleep");
}

if (today?.steps != null && today.steps < 3000) {
  suggestions.push("🚶 Increase your activity (walk more today)");
}
  const summary = data?.summary_last_7_days;
  const weekLen = data?.last_7_days?.length ?? 0;
  const isCompletelyEmpty =
    data && !hasTodayMetrics(today) && weekLen === 0;

  const { labels: waterLabels, values: waterValues } = buildWeekSeries(
    data?.last_7_days || [],
    "water"
  );
  const { labels: stepsLabels, values: stepsValues } = buildWeekSeries(
    data?.last_7_days || [],
    "steps"
  );

  const chartsEmpty =
    !data?.last_7_days?.length ||
    (waterValues.every((v) => v === 0) && stepsValues.every((v) => v === 0));

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label="Loading your dashboard…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-950/30 p-6 text-center">
        <p className="text-red-300">{error}</p>
        <Button type="button" className="mt-4" onClick={load}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Hello, {data?.user?.name || "there"}
          </h1>
          <p className="mt-1 text-slate-500">{formatToday(today)}</p>
        </div>
        <Button type="button" onClick={() => navigate("/add-entry")}>
          Log today&apos;s data
        </Button>
      </div>

      {isCompletelyEmpty && (
        <div className="rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900/90 to-slate-900/50 p-8 text-center sm:p-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 ring-1 ring-slate-700">
            <IconSteps className="h-8 w-8 text-slate-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-100">No data yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Add your first entry to see sleep, water, steps, and mood here — plus trends for the last week.
          </p>
          <Button type="button" className="mt-6" onClick={() => navigate("/add-entry")}>
            Add your first entry
          </Button>
        </div>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-300">Today</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            icon={IconSleep}
            iconClass="bg-violet-500/15 text-violet-300"
            title="Sleep"
            value={today?.sleep != null ? `${today.sleep} h` : "—"}
            hint="Hours last night"
            muted={today?.sleep == null}
          />
          <StatCard
            icon={IconWater}
            iconClass="bg-sky-500/15 text-sky-300"
            title="Water"
            value={today?.water != null ? `${today.water} L` : "—"}
            hint="Liters today"
            muted={today?.water == null}
          />
          <StatCard
            icon={IconSteps}
            iconClass="bg-emerald-500/15 text-emerald-300"
            title="Steps"
            value={today?.steps != null ? today.steps.toLocaleString() : "—"}
            hint="Activity"
            muted={today?.steps == null}
          />
          <StatCard
            icon={IconMood}
            iconClass="bg-amber-500/15 text-amber-300"
            title="Mood"
            value={today?.mood || "—"}
            valueClassName="capitalize"
            hint="How you feel"
            muted={!today?.mood}
          />
          <StatCard
            icon={IconSteps}
            iconClass="bg-red-500/15 text-red-300"
            title="Streak"
            value={data?.user?.streak_count != null ? `${data.user.streak_count} days` : "—"}
            hint="Daily consistency"
            muted={data?.user?.streak_count == null}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-300">Last 7 days</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardTitle>Avg sleep</CardTitle>
            <CardValue>
              {summary?.avg_sleep != null ? `${summary.avg_sleep} h` : "—"}
            </CardValue>
          </Card>
          <Card>
            <CardTitle>Avg water</CardTitle>
            <CardValue>
              {summary?.avg_water != null ? `${summary.avg_water} L` : "—"}
            </CardValue>
          </Card>
          <Card>
            <CardTitle>Total steps</CardTitle>
            <CardValue>
              {summary?.total_steps != null ? summary.total_steps.toLocaleString() : "—"}
            </CardValue>
          </Card>
          <Card>
            <CardTitle>Entries</CardTitle>
            <CardValue>{summary?.entries_count ?? 0}</CardValue>
            <p className="mt-2 text-xs text-slate-500">Days with data</p>
          </Card>
        </div>
      </section>
      {suggestions.length > 0 && (
  <div className="rounded-2xl border border-blue-500/30 bg-blue-950/30 p-4">
    <h2 className="text-blue-300 font-semibold mb-2">
      💡 Health Suggestions
    </h2>
    <ul className="text-sm text-blue-200 space-y-1">
      {suggestions.map((tip, i) => (
        <li key={i}>• {tip}</li>
      ))}
    </ul>
  </div>
)}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="min-h-[320px]">
          {chartsEmpty ? (
            <div className="flex h-64 flex-col items-center justify-center px-4 text-center sm:h-72">
              <p className="text-sm font-medium text-slate-400">No data yet</p>
              <p className="mt-1 max-w-xs text-xs text-slate-600">
                Log water on the Add entry page to see this chart.
              </p>
            </div>
          ) : (
            <WaterChart labels={waterLabels} values={waterValues} />
          )}
        </Card>
        <Card className="min-h-[320px]">
          {chartsEmpty ? (
            <div className="flex h-64 flex-col items-center justify-center px-4 text-center sm:h-72">
              <p className="text-sm font-medium text-slate-400">No data yet</p>
              <p className="mt-1 max-w-xs text-xs text-slate-600">
                Log steps on the Add entry page to see this chart.
              </p>
            </div>
          ) : (
            <StepsChart labels={stepsLabels} values={stepsValues} />
          )}
        </Card>
      </section>
    </div>
  );
}
