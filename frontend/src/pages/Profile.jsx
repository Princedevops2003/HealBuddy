import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { Card, CardTitle, CardValue } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [historyCount, setHistoryCount] = useState(null);
  const [range, setRange] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const dash = await api.dashboard();
      updateUser(dash.user);
      const hist = await api.history(200);
      setHistoryCount(hist.count);
      setRange(hist.date_range);
    } catch (e) {
      setError(e.message || "Failed to load profile data");
    }
  }, [updateUser]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="mt-1 text-slate-500">Your account and logging overview.</p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <Card>
        <CardTitle>Account</CardTitle>
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Name</p>
            <CardValue className="text-xl">{user?.name || "—"}</CardValue>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
            <p className="mt-1 text-lg text-slate-200">{user?.email || "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">User ID</p>
            <p className="mt-1 font-mono text-sm text-slate-400">{user?.id ?? "—"}</p>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>History</CardTitle>
        <p className="mt-2 text-sm text-slate-500">
          {historyCount != null
            ? `${historyCount} recent entries loaded`
            : "Loading history…"}
        </p>
        {range?.oldest && range?.newest && (
          <p className="mt-2 text-sm text-slate-400">
            From <span className="text-slate-300">{range.oldest}</span> to{" "}
            <span className="text-slate-300">{range.newest}</span>
          </p>
        )}
        <Button type="button" className="mt-4" onClick={() => navigate("/add-entry")}>
          Add new entry
        </Button>
      </Card>

      <Button variant="secondary" onClick={load} className="w-full sm:w-auto">
        Refresh from server
      </Button>
    </div>
  );
}
