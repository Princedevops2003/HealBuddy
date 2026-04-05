import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { IconHistory } from "../components/icons.jsx";
import { Spinner } from "../components/Spinner.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function History() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.history(100);
      setData(res);
    } catch (e) {
      setError(e.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label="Loading history…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-950/30 p-8 text-center">
        <p className="text-red-300">{error}</p>
        <Button type="button" className="mt-4" onClick={load}>
          Retry
        </Button>
      </div>
    );
  }

  const entries = data?.entries || [];
  const empty = entries.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">History</h1>
        <p className="mt-1 text-slate-500">Your logged health entries, newest first.</p>
      </div>

      {empty ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-500 ring-1 ring-slate-700">
            <IconHistory className="h-9 w-9" />
          </div>
          <h2 className="text-lg font-semibold text-slate-200">No data yet</h2>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Start tracking sleep, water, steps, and mood by adding your first entry.
          </p>
          <Button type="button" className="mt-6" onClick={() => navigate("/add-entry")}>
            Add entry
          </Button>
        </Card>
      ) : (
        <>
          <p className="text-sm text-slate-500">
            Showing <span className="text-slate-400">{entries.length}</span> entries
            {data?.date_range?.oldest && data?.date_range?.newest && (
              <span className="text-slate-600">
                {" "}
                · {data.date_range.oldest} → {data.date_range.newest}
              </span>
            )}
          </p>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-800 md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Sleep</th>
                  <th className="px-4 py-3 font-medium">Water</th>
                  <th className="px-4 py-3 font-medium">Steps</th>
                  <th className="px-4 py-3 font-medium">Mood</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                {entries.map((e) => (
                  <tr key={e.id} className="text-slate-300 hover:bg-slate-800/40">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-200">
                      {formatDate(e.date)}
                    </td>
                    <td className="px-4 py-3">{e.sleep != null ? `${e.sleep} h` : "—"}</td>
                    <td className="px-4 py-3">{e.water != null ? `${e.water} L` : "—"}</td>
                    <td className="px-4 py-3">
                      {e.steps != null ? e.steps.toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3 capitalize">{e.mood || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {entries.map((e) => (
              <li key={e.id}>
                <Card className="p-4">
                  <p className="font-semibold text-slate-200">{formatDate(e.date)}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <dt className="text-slate-500">Sleep</dt>
                      <dd className="text-slate-300">{e.sleep != null ? `${e.sleep} h` : "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Water</dt>
                      <dd className="text-slate-300">{e.water != null ? `${e.water} L` : "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Steps</dt>
                      <dd className="text-slate-300">
                        {e.steps != null ? e.steps.toLocaleString() : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Mood</dt>
                      <dd className="capitalize text-slate-300">{e.mood || "—"}</dd>
                    </div>
                  </dl>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
