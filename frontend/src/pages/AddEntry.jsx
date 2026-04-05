import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Input, Label } from "../components/ui/Input.jsx";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function AddEntry() {
  const navigate = useNavigate();
  const [date, setDate] = useState(todayIso());
  const [sleep, setSleep] = useState("");
  const [water, setWater] = useState("");
  const [steps, setSteps] = useState("");
  const [mood, setMood] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const payload = { date };
    if (sleep !== "") payload.sleep = Number(sleep);
    if (water !== "") payload.water = Number(water);
    if (steps !== "") {
      const n = parseInt(steps, 10);
      if (Number.isNaN(n)) {
        setError("Steps must be a whole number");
        setLoading(false);
        return;
      }
      payload.steps = n;
    }
    if (mood.trim()) payload.mood = mood.trim();

    if (
      payload.sleep === undefined &&
      payload.water === undefined &&
      payload.steps === undefined &&
      payload.mood === undefined
    ) {
      setError("Enter at least one field");
      setLoading(false);
      return;
    }

    try {
      await api.addEntry(payload);
      setSuccess("Saved successfully.");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setError(err.message || "Could not save entry");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Add health entry</h1>
        <p className="mt-1 text-slate-500">Log sleep, water, steps, and mood for a day.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="sleep">Sleep (hours)</Label>
            <Input
              id="sleep"
              type="number"
              inputMode="decimal"
              step="0.25"
              min="0"
              max="24"
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
              placeholder="e.g. 7.5"
            />
          </div>
          <div>
            <Label htmlFor="water">Water (liters)</Label>
            <Input
              id="water"
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              value={water}
              onChange={(e) => setWater(e.target.value)}
              placeholder="e.g. 2"
            />
          </div>
          <div>
            <Label htmlFor="steps">Steps</Label>
            <Input
              id="steps"
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="e.g. 8000"
            />
          </div>
          <div>
            <Label htmlFor="mood">Mood</Label>
            <Input
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="e.g. calm, energetic"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-lg border border-teal-500/30 bg-teal-950/40 px-3 py-2 text-sm text-teal-200">
              {success}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save entry"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
