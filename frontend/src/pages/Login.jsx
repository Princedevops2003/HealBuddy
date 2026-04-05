import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { Input, Label } from "../components/ui/Input.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export function Login() {
  const { login, register, isAuthenticated } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold text-teal-400">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/20 text-2xl">
            ✦
          </span>
          HealBuddy
        </Link>
        <p className="mt-2 text-sm text-slate-500">Your daily health companion</p>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/30 backdrop-blur-md sm:p-8">
        <div className="mb-6 flex rounded-xl bg-slate-950/80 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              mode === "login"
                ? "bg-teal-600 text-white shadow"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError("");
            }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              mode === "signup"
                ? "bg-teal-600 text-white shadow"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required={mode === "signup"}
              />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={mode === "signup" ? 6 : undefined}
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
