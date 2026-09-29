import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Logo from "./components/Logo";
import Sidebar from "./components/Sidebar";

const STATUSES = ["applied", "interview", "offer", "rejected"];
const STATUS_META = {
  applied: { label: "Applied", tone: "blue" },
  interview: { label: "Interview", tone: "amber" },
  offer: { label: "Offer", tone: "green" },
  rejected: { label: "Rejected", tone: "red" },
};

const SEED = [
  {
    id: 1,
    company: "Flutterwave",
    role: "Product Designer",
    date_applied: "2026-09-22",
    job_link: "https://flutterwave.com",
    contact_person: "Amina Yusuf",
    status: "interview",
    notes: [
      {
        id: 11,
        content: "Recruiter screen scheduled for Friday.",
        created_at: "2026-09-23T09:10:00",
      },
    ],
    created_at: "2026-09-22T08:00:00",
    updated_at: "2026-09-23T09:10:00",
  },
  {
    id: 2,
    company: "Andela",
    role: "Frontend Engineer",
    date_applied: "2026-09-18",
    job_link: "https://andela.com",
    contact_person: "David Obi",
    status: "applied",
    notes: [
      {
        id: 21,
        content: "Application submitted through careers portal.",
        created_at: "2026-09-18T12:20:00",
      },
    ],
    created_at: "2026-09-18T12:20:00",
    updated_at: "2026-09-18T12:20:00",
  },
  {
    id: 3,
    company: "Paystack",
    role: "Product Manager",
    date_applied: "2026-09-15",
    job_link: "https://paystack.com",
    contact_person: "Tomi Adeyemi",
    status: "offer",
    notes: [
      {
        id: 31,
        content: "Offer received. Reviewing compensation package.",
        created_at: "2026-09-24T16:45:00",
      },
    ],
    created_at: "2026-09-15T10:30:00",
    updated_at: "2026-09-24T16:45:00",
  },
  {
    id: 4,
    company: "Moniepoint",
    role: "UX Researcher",
    date_applied: "2026-09-12",
    job_link: "https://moniepoint.com",
    contact_person: "",
    status: "rejected",
    notes: [],
    created_at: "2026-09-12T14:00:00",
    updated_at: "2026-09-20T11:00:00",
  },
  {
    id: 5,
    company: "Interswitch",
    role: "Design Lead",
    date_applied: "2026-09-08",
    job_link: "https://interswitchgroup.com",
    contact_person: "Chioma Eze",
    status: "applied",
    notes: [],
    created_at: "2026-09-08T09:30:00",
    updated_at: "2026-09-08T09:30:00",
  },
  {
    id: 6,
    company: "Kora",
    role: "Product Designer",
    date_applied: "2026-09-05",
    job_link: "https://korapay.com",
    contact_person: "",
    status: "interview",
    notes: [
      {
        id: 61,
        content: "Panel interview next week.",
        created_at: "2026-09-21T13:15:00",
      },
    ],
    created_at: "2026-09-05T08:00:00",
    updated_at: "2026-09-21T13:15:00",
  },
];

function makeNoteId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value + (value.length === 10 ? "T00:00:00" : "")));
}
function daysAgo(value) {
  const diff = Math.floor((new Date() - new Date(value)) / 86400000);
  return diff <= 0 ? "today" : `${diff}d ago`;
}

function Toast({ toast }) {
  if (!toast) return null;

  const tone =
    toast.type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-slate-200 bg-slate-900 text-white";

  return (
    <div
      className={`fixed bottom-5 right-5 z-60 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${tone}`}
    >
      {toast.message}
    </div>
  );
}

function Auth() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl">
        <div className="mb-8 flex items-center gap-3">
          <Logo />

          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Job Tracker
            </h1>
            <p className="text-xs text-slate-400">
              Track every application in one place.
            </p>
          </div>
        </div>

        {!sent ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Enter your email and we'll send you a magic sign-in link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Email address
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send magic link"}
              </button>
            </form>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-lg text-emerald-600">
              ✓
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              Check your email
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              We sent a sign-in link to{" "}
              <strong className="text-slate-700">{email}</strong>.
            </p>

            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Use another email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>

        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-600">
          {icon}
        </span>
      </div>

      <strong className="mt-5 block text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </strong>

      <span className="mt-1 block text-xs text-slate-500">{sub}</span>
    </div>
  );
}
function StatusPill({ status }) {
  const m = STATUS_META[status];

  const tone = {
    blue: "bg-slate-100 text-slate-600",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
  }[m.tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone}`}
    >
      <i className="h-1.5 w-1.5 rounded-full bg-current" />
      {m.label}
    </span>
  );
}
function Dashboard({ apps, onAdd, onEdit, onStatus, onViewApplications }) {
  const counts = Object.fromEntries(
    STATUSES.map((s) => [s, apps.filter((a) => a.status === s).length]),
  );

  const responseRate = apps.length
    ? Math.round(((counts.interview + counts.offer) / apps.length) * 100)
    : 0;

  const statusTotal = apps.length || 1;

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-6 lg:px-8 lg:py-8">
      <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Overview
          </span>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            A quiet view of where every application stands.
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          onClick={onAdd}
        >
          ＋ Add application
        </button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total applied"
          value={apps.length}
          sub="All tracked applications"
          icon="↗"
        />

        <StatCard
          label="Response rate"
          value={`${responseRate}%`}
          sub="Interview + offer"
          icon="◎"
        />

        <StatCard
          label="Interviews this week"
          value={counts.interview}
          sub="Current pipeline"
          icon="◷"
        />

        <StatCard
          label="Offers"
          value={counts.offer}
          sub="Active offers"
          icon="✦"
        />
      </section>

      {/* Status breakdown */}
      <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">
            Status breakdown
          </h2>
        </div>

        <div className="mt-1 flex h-3.5 w-full overflow-hidden rounded-full bg-slate-100">
          {STATUSES.map((status) => {
            const percentage =
              apps.length > 0 ? (counts[status] / statusTotal) * 100 : 0;

            return (
              <div
                key={status}
                className={`h-full min-w-0 ${
                  status === "applied"
                    ? "bg-slate-500"
                    : status === "interview"
                      ? "bg-amber-600"
                      : status === "offer"
                        ? "bg-green-600"
                        : "bg-red-600"
                }`}
                style={{ width: `${percentage}%` }}
              />
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
          {STATUSES.map((status) => (
            <div
              className="flex items-center gap-2 text-xs font-medium text-slate-500"
              key={status}
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  status === "applied"
                    ? "bg-slate-500"
                    : status === "interview"
                      ? "bg-amber-600"
                      : status === "offer"
                        ? "bg-green-600"
                        : "bg-red-600"
                }`}
              />

              <span>
                {STATUS_META[status].label}{" "}
                <strong className="ml-0.5 font-bold text-slate-700">
                  {counts[status]}
                </strong>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Application pipeline
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Move an application by changing its status.
              </p>
            </div>

            <button
              type="button"
              className="text-xs font-semibold text-slate-600 transition hover:text-slate-900"
              onClick={onViewApplications}
            >
              View all
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {STATUSES.map((status) => (
              <div className="min-w-0 rounded-xl bg-slate-50 p-3" key={status}>
                <div className="mb-3 flex items-center justify-between">
                  <StatusPill status={status} />
                  <b className="text-xs font-semibold text-slate-500">
                    {counts[status]}
                  </b>
                </div>

                <div className="flex flex-col gap-2">
                  {apps
                    .filter((a) => a.status === status)
                    .slice(0, 3)
                    .map((app) => (
                      <ApplicationMini
                        key={app.id}
                        app={app}
                        onEdit={onEdit}
                        onStatus={onStatus}
                      />
                    ))}

                  {apps.filter((a) => a.status === status).length === 0 && (
                    <div className="rounded-lg border border-dashed border-slate-200 px-3 py-5 text-center text-xs text-slate-400">
                      Nothing here yet.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-900">
              Reminders
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Applications needing a nudge.
            </p>
          </div>

          <div className="flex flex-col">
            {apps
              .filter(
                (a) => a.status === "applied" && (a.notes?.length || 0) === 0,
              )
              .slice(0, 4)
              .map((a) => (
                <div
                  className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0"
                  key={a.id}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />

                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-sm font-semibold text-slate-800">
                      {a.company}
                    </strong>
                    <span className="block truncate text-xs text-slate-500">
                      {a.role}
                    </span>
                  </div>

                  <small className="shrink-0 text-xs text-slate-400">
                    {daysAgo(a.date_applied)}
                  </small>
                </div>
              ))}

            {apps.filter(
              (a) => a.status === "applied" && (a.notes?.length || 0) === 0,
            ).length === 0 && (
              <div className="rounded-xl bg-slate-50 px-4 py-8 text-center text-xs text-slate-400">
                No reminders right now.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-slate-900">
            Recent activity
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Your latest application updates.
          </p>
        </div>

        <div className="flex flex-col">
          {apps
            .slice()
            .sort(
              (a, b) =>
                new Date(b.updated_at || b.created_at || b.date_applied) -
                new Date(a.updated_at || a.created_at || a.date_applied),
            )
            .slice(0, 6)
            .map((a) => (
              <div
                key={a.id}
                className="flex flex-col gap-2 border-b border-slate-100 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <strong className="block truncate text-sm font-semibold text-slate-800">
                    {a.company}
                  </strong>

                  <span className="mt-0.5 block truncate text-xs text-slate-500">
                    {a.role}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <StatusPill status={a.status} />

                  <span className="text-xs text-slate-400">
                    {a.date_applied || "—"}
                  </span>
                </div>
              </div>
            ))}

          {apps.length === 0 && (
            <div className="rounded-xl bg-slate-50 px-4 py-8 text-center text-xs text-slate-400">
              No recent activity yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ApplicationMini({ app, onEdit, onStatus }) {
  return (
    <article
      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
      onClick={() => onEdit(app)}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
          {app.company[0]}
        </span>

        <div className="min-w-0 flex-1">
          <strong className="block truncate text-sm font-semibold text-slate-900">
            {app.company}
          </strong>
          <span className="mt-0.5 block truncate text-xs text-slate-500">
            {app.role}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-400">
          {formatDate(app.date_applied)}
        </span>

        <select
          className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-600 outline-none focus:border-slate-400"
          value={app.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onStatus(app.id, e.target.value)}
          aria-label="Change status"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </select>
      </div>
    </article>
  );
}

function Applications({ apps, onAdd, onEdit, onStatus, onExport }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [view, setView] = useState("kanban");

  const filtered = useMemo(
    () =>
      apps.filter(
        (a) =>
          (status === "all" || a.status === status) &&
          `${a.company} ${a.role} ${a.contact_person}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [apps, search, status],
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-6 lg:px-8 lg:py-8">
      <header className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Your pipeline
          </span>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Applications
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Drag mentally from one stage to the next; use the status control on
            each card.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                view === "kanban"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
              onClick={() => setView("kanban")}
            >
              Kanban
            </button>

            <button
              type="button"
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                view === "list"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
              onClick={() => setView("list")}
            >
              List
            </button>
          </div>

          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            onClick={onExport}
          >
            Export CSV
          </button>

          <button
            type="button"
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            onClick={onAdd}
          >
            ＋ Add application
          </button>
        </div>
      </header>

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
          <span className="text-base text-slate-400">⌕</span>

          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, role, contact…"
          />
        </div>

        <select
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-slate-400"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All statuses</option>

          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </select>

        <span className="px-2 text-xs font-medium text-slate-400">
          {filtered.length} application
          {filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {view === "kanban" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STATUSES.map((stage) => {
            const stageApps = filtered.filter((a) => a.status === stage);

            return (
              <section
                className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                key={stage}
              >
                <div className="mb-4 flex items-center justify-between">
                  <StatusPill status={stage} />

                  <span className="text-xs font-semibold text-slate-400">
                    {stageApps.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {stageApps.map((a) => (
                    <article
                      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      key={a.id}
                      onClick={() => onEdit(a)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
                          {a.company[0]}
                        </span>

                        <div className="min-w-0">
                          <strong className="block truncate text-sm font-semibold text-slate-900">
                            {a.company}
                          </strong>

                          <span className="mt-0.5 block truncate text-xs text-slate-500">
                            {a.role}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-1 text-xs text-slate-400">
                        <span>{formatDate(a.date_applied)}</span>

                        {a.contact_person && (
                          <>
                            <span>·</span>
                            <span className="truncate">{a.contact_person}</span>
                          </>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <select
                          className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-600 outline-none"
                          value={a.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => onStatus(a.id, e.target.value)}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_META[s].label}
                            </option>
                          ))}
                        </select>

                        {a.job_link ? (
                          <a
                            className="shrink-0 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
                            href={a.job_link}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Job link ↗
                          </a>
                        ) : (
                          <span className="shrink-0 text-xs text-slate-400">
                            No link
                          </span>
                        )}
                      </div>
                    </article>
                  ))}

                  {stageApps.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-200 px-3 py-8 text-center text-xs text-slate-400">
                      No applications
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((a) => (
            <article
              className="grid cursor-pointer grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[minmax(0,1fr)_7rem_auto_auto] sm:items-center"
              key={a.id}
              onClick={() => onEdit(a)}
            >
              {/* Company */}
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
                  {a.company[0]}
                </span>

                <div className="min-w-0">
                  <strong className="block truncate text-sm font-semibold text-slate-900">
                    {a.company}
                  </strong>

                  <span className="mt-0.5 block truncate text-xs text-slate-500">
                    {a.role}
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="whitespace-nowrap text-xs text-slate-400">
                {formatDate(a.date_applied)}
              </div>

              {/* Status */}
              <div className="shrink-0">
                <StatusPill status={a.status} />
              </div>

              {/* Change status */}
              <select
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-600 outline-none sm:w-auto"
                value={a.status}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onStatus(a.id, e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_META[s].label}
                  </option>
                ))}
              </select>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-xs text-slate-400">
              No applications found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
function Reminders({ apps, onEdit }) {
  const reminders = [...apps]
    .filter((app) => app.status === "interview" || app.status === "offer")
    .sort(
      (a, b) =>
        new Date(a.date_applied || a.created_at) -
        new Date(b.date_applied || b.created_at),
    );

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-6 lg:px-8 lg:py-8">
      <header className="mb-7">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Follow up
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Reminders
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Keep track of applications that need your attention.
        </p>
      </header>

      <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-sm">
            !
          </span>

          <div>
            <strong className="block text-sm font-semibold text-amber-900">
              Follow-up reminders
            </strong>

            <p className="mt-1 text-xs leading-5 text-amber-700">
              Review your interviews and offers and follow up when needed.
            </p>
          </div>
        </div>
      </div>

      {reminders.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reminders.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => onEdit(app)}
              className="text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
                    {app.company[0]}
                  </span>

                  <div className="min-w-0">
                    <strong className="block truncate text-sm font-semibold text-slate-900">
                      {app.company}
                    </strong>

                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {app.role}
                    </span>
                  </div>
                </div>

                <StatusPill status={app.status} />
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-400">
                  Applied {formatDate(app.date_applied)}
                </span>

                <span className="text-sm font-medium text-slate-500">→</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center">
          <p className="text-sm font-medium text-slate-600">
            No reminders right now.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Interviews and offers will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

function Modal({ app, onClose, onSave, onDelete, onNote }) {
  const [form, setForm] = useState(
    app || {
      company: "",
      role: "",
      date_applied: new Date().toISOString().slice(0, 10),
      job_link: "",
      contact_person: "",
      status: "applied",
      notes: [],
    },
  );

  const [note, setNote] = useState("");
  const [tab, setTab] = useState("details");

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) return;
    onSave(form);
  };

  const addNote = () => {
    if (note.trim()) {
      onNote(form.id, {
        id: makeNoteId(),
        content: note.trim(),
        created_at: new Date().toISOString(),
      });
      setNote("");
      setTab("notes");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {app ? "Application detail" : "New application"}
            </span>

            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {app ? form.company : "Add application"}
            </h2>
          </div>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        {app && (
          <div className="flex border-b border-slate-200 px-6">
            <button
              type="button"
              className={`border-b-2 px-1 py-3 mr-5 text-sm font-semibold transition ${
                tab === "details"
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
              onClick={() => setTab("details")}
            >
              Details
            </button>

            <button
              type="button"
              className={`border-b-2 px-1 py-3 text-sm font-semibold transition ${
                tab === "notes"
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
              onClick={() => setTab("notes")}
            >
              Notes{" "}
              <span className="ml-1 text-xs text-slate-400">
                {form.notes?.length || 0}
              </span>
            </button>
          </div>
        )}

        {/* Details */}
        {tab === "details" ? (
          <form onSubmit={submit}>
            <div className="grid gap-5 overflow-y-auto px-6 py-6 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                Company
                <input
                  autoFocus
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  placeholder="e.g. Acme Inc."
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                Role
                <input
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  value={form.role}
                  onChange={(e) => update("role", e.target.value)}
                  placeholder="e.g. Product Designer"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                Date applied
                <input
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  type="date"
                  value={form.date_applied}
                  onChange={(e) => update("date_applied", e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                Status
                <select
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  value={form.status}
                  onChange={(e) => update("status", e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_META[s].label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                Job link
                <input
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  type="url"
                  value={form.job_link}
                  onChange={(e) => update("job_link", e.target.value)}
                  placeholder="https://…"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                Contact person
                <input
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  value={form.contact_person}
                  onChange={(e) => update("contact_person", e.target.value)}
                  placeholder="Optional"
                />
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 border-t border-slate-200 px-6 py-4">
              {app && (
                <button
                  type="button"
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  onClick={() => onDelete(app.id)}
                >
                  Delete
                </button>
              )}

              <span className="flex-1" />

              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                type="submit"
              >
                {app ? "Save changes" : "Add application"}
              </button>
            </div>
          </form>
        ) : (
          /* Notes */
          <div className="flex max-h-[70vh] flex-col">
            <div className="border-b border-slate-100 p-6">
              <textarea
                className="min-h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note about this application…"
              />

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  onClick={addNote}
                >
                  Add note
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto p-6">
              {(form.notes || [])
                .slice()
                .reverse()
                .map((n) => (
                  <div
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    key={n.id}
                  >
                    <strong className="block text-xs font-semibold text-slate-400">
                      {new Intl.DateTimeFormat("en", {
                        month: "short",
                        day: "numeric",
                      }).format(new Date(n.created_at))}
                    </strong>

                    <span className="mt-2 block text-sm leading-6 text-slate-700">
                      {n.content}
                    </span>
                  </div>
                ))}

              {!(form.notes || []).length && (
                <div className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
                  No notes yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [view, setView] = useState("dashboard");
  const [apps, setApps] = useState([]);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user?.email ?? null);
      setAuthLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user.email);
      }

      if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadApplications = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) return;

      const { data: existingApps, error } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error loading applications:", error);
        return;
      }

      if (existingApps && existingApps.length > 0) {
        setApps(existingApps);
        return;
      }

      const saved = localStorage.getItem("job-tracker-applications");

      let oldApps = [];

      try {
        oldApps = saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error("Error reading saved applications:", error);
      }

      const appsToMigrate =
        Array.isArray(oldApps) && oldApps.length > 0 ? oldApps : SEED;

      const rows = appsToMigrate.map((app) => ({
        user_id: currentUser.id,
        company: app.company,
        role: app.role,
        status: app.status || "applied",
        date_applied: app.date_applied || null,
        job_link: app.job_link || null,
        contact_person: app.contact_person || null,
        notes: Array.isArray(app.notes) ? app.notes : [],
        created_at: app.created_at || new Date().toISOString(),
        updated_at: app.updated_at || new Date().toISOString(),
      }));

      const { data: migratedApps, error: migrationError } = await supabase
        .from("applications")
        .insert(rows)
        .select("*");

      if (migrationError) {
        console.error("Error migrating applications:", migrationError);
        return;
      }

      setApps(migratedApps || []);
      localStorage.removeItem("job-tracker-applications");
    };

    loadApplications();
  }, [user]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2600);
      return () => clearTimeout(t);
    }
  }, [toast]);
  const notify = (message, type = "success") => setToast({ message, type });
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  const add = () => setModal({ type: "edit", app: null });
  const edit = (app) => setModal({ type: "edit", app });
  const save = async (form) => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      notify("Please sign in again.", "error");
      return;
    }

    const now = new Date().toISOString();

    if (form.id) {
      const { data, error } = await supabase
        .from("applications")
        .update({
          company: form.company,
          role: form.role,
          status: form.status,
          date_applied: form.date_applied || null,
          job_link: form.job_link || null,
          contact_person: form.contact_person || null,
          notes: Array.isArray(form.notes) ? form.notes : [],
          updated_at: now,
        })
        .eq("id", form.id)
        .eq("user_id", currentUser.id)
        .select("*")
        .single();

      if (error) {
        console.error("Error updating application:", error);
        notify("Could not update application.", "error");
        return;
      }

      setApps((prev) => prev.map((a) => (a.id === form.id ? data : a)));
      notify("Application updated.");
    } else {
      const { data, error } = await supabase
        .from("applications")
        .insert({
          user_id: currentUser.id,
          company: form.company,
          role: form.role,
          status: form.status || "applied",
          date_applied: form.date_applied || null,
          job_link: form.job_link || null,
          contact_person: form.contact_person || null,
          notes: [],
          created_at: now,
          updated_at: now,
        })
        .select("*")
        .single();

      if (error) {
        console.error("Error adding application:", error);
        notify("Could not add application.", "error");
        return;
      }

      setApps((prev) => [data, ...prev]);
      notify("Application added.");
    }

    setModal(null);
  };

  const status = async (id, value) => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      notify("Please sign in again.", "error");
      return;
    }

    const updatedAt = new Date().toISOString();

    const { data, error } = await supabase
      .from("applications")
      .update({
        status: value,
        updated_at: updatedAt,
      })
      .eq("id", id)
      .eq("user_id", currentUser.id)
      .select("*")
      .single();

    if (error) {
      console.error("Error changing status:", error);
      notify("Could not change application status.", "error");
      return;
    }

    setApps((prev) => prev.map((a) => (a.id === id ? data : a)));
    notify(`Status changed to ${STATUS_META[value].label}.`);
  };

  const del = async (id) => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      notify("Please sign in again.", "error");
      return;
    }

    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id)
      .eq("user_id", currentUser.id);

    if (error) {
      console.error("Error deleting application:", error);
      notify("Could not delete application.", "error");
      return;
    }

    setApps((prev) => prev.filter((a) => a.id !== id));
    setModal(null);
    notify("Application deleted.", "info");
  };

  const note = async (appId, newNote) => {
    const app = apps.find((a) => a.id === appId);

    if (!app) return;

    const updatedNotes = [...(app.notes || []), newNote];
    const updatedAt = new Date().toISOString();

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      notify("Please sign in again.", "error");
      return;
    }

    const { data, error } = await supabase
      .from("applications")
      .update({
        notes: updatedNotes,
        updated_at: updatedAt,
      })
      .eq("id", appId)
      .eq("user_id", currentUser.id)
      .select("*")
      .single();

    if (error) {
      console.error("Error adding note:", error);
      notify("Could not add note.", "error");
      return;
    }

    setApps((prev) => prev.map((a) => (a.id === appId ? data : a)));

    setModal((m) => (m ? { ...m, app: data } : m));

    notify("Note added.");
  };
  const exportCsv = () => {
    const head = [
      "company",
      "role",
      "date_applied",
      "job_link",
      "contact_person",
      "status",
    ];
    const csv = [
      head,
      ...apps.map((a) =>
        head.map((k) => `"${String(a[k] ?? "").replaceAll('"', '""')}"`),
      ),
    ]
      .map((r) => r.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "job-applications.csv";
    a.click();
    URL.revokeObjectURL(url);
    notify("CSV exported.");
  };
  if (authLoading) {
    return <div className="auth-page">Loading...</div>;
  }

  if (!user) {
    return <Auth />;
  }
  <Toast toast={toast} />;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar view={view} setView={setView} user={user} onLogout={logout} />

      <main className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 lg:hidden">
          <Logo small />

          <button
            type="button"
            onClick={logout}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Log out
          </button>
        </div>
        {view === "dashboard" && (
          <Dashboard
            apps={apps}
            onAdd={add}
            onEdit={edit}
            onStatus={status}
            onDelete={del}
            onViewApplications={() => setView("applications")}
          />
        )}{" "}
        {view === "applications" && (
          <Applications
            apps={apps}
            onAdd={add}
            onEdit={edit}
            onStatus={status}
            onDelete={del}
            onExport={exportCsv}
          />
        )}{" "}
        {view === "reminders" && <Reminders apps={apps} onEdit={edit} />}
        <footer className="flex items-center justify-between border-t border-slate-200 px-6 py-5 text-xs text-slate-400">
          <span>Job Tracker · calm by design</span>

          <button
            type="button"
            onClick={exportCsv}
            className="font-medium text-slate-500 transition hover:text-slate-900"
          >
            Export CSV
          </button>
        </footer>
      </main>
      {modal && (
        <Modal
          app={modal.app}
          onClose={() => setModal(null)}
          onSave={save}
          onDelete={del}
          onNote={note}
        />
      )}
      <Toast toast={toast} />
    </div>
  );
}

export default App;
