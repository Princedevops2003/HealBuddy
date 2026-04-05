import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  IconHistory,
  IconLayoutDashboard,
  IconMenu,
  IconPlus,
  IconUser,
} from "./icons.jsx";
import { HealBuddyChat } from "./HealBuddyChat.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const sidebarLink =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors";

function sidebarLinkClass({ isActive }) {
  return [
    sidebarLink,
    isActive
      ? "bg-teal-500/15 text-teal-300 ring-1 ring-teal-500/25"
      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200",
  ].join(" ");
}

export function Layout() {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-slate-950">
      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] flex-col border-r border-slate-800/80 bg-slate-900/95 shadow-xl backdrop-blur-md transition-transform duration-200 ease-out lg:translate-x-0",
          menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-800/80 px-4 lg:h-[4.25rem]">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-lg text-teal-300">
            ✦
          </span>
          <div>
            <p className="font-semibold text-slate-100">HealBuddy</p>
            <p className="text-xs text-slate-500">Wellness tracker</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          <NavLink to="/" className={sidebarLinkClass} end onClick={closeMenu}>
            <IconLayoutDashboard className="text-teal-400/90" />
            Dashboard
          </NavLink>
          <NavLink to="/history" className={sidebarLinkClass} onClick={closeMenu}>
            <IconHistory className="text-teal-400/90" />
            History
          </NavLink>
          <NavLink to="/profile" className={sidebarLinkClass} onClick={closeMenu}>
            <IconUser className="text-teal-400/90" />
            Profile
          </NavLink>

          <div className="mt-auto border-t border-slate-800/80 pt-3">
            <NavLink
              to="/add-entry"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/30 transition hover:bg-teal-500"
            >
              <IconPlus className="h-5 w-5 text-white" />
              Add entry
            </NavLink>
          </div>
        </nav>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="inline-flex rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 lg:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label="Open menu"
            >
              <IconMenu className="h-6 w-6" />
            </button>
            <NavLink
              to="/"
              className="truncate text-lg font-semibold tracking-tight text-teal-400 transition hover:text-teal-300"
            >
              HealBuddy
            </NavLink>
          </div>

          <button
            type="button"
            onClick={logout}
            className="shrink-0 rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-red-500/40 hover:bg-red-950/25 hover:text-red-200"
          >
            Log out
          </button>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-600">
          HealBuddy — track sleep, hydration, steps, and mood.
        </footer>
      </div>

      <HealBuddyChat />
    </div>
  );
}
