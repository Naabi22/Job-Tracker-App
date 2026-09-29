import Logo from "./Logo";

function Sidebar({ view, setView, user, onLogout }) {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "⌂",
    },
    {
      id: "applications",
      label: "Applications",
      icon: "▣",
    },
    {
      id: "reminders",
      label: "Reminders",
      icon: "◷",
    },
  ];

  return (
    <aside className="flex min-h-screen w-52 shrink-0 flex-col bg-[#1b1f29] px-2 py-4 text-white">
      {/* Logo */}
      <Logo />

      {/* Navigation */}
      <nav className="mt-10 flex flex-col gap-2">
        {navItems.map((item) => {
          const active = view === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                active
                  ? "bg-[#30343e] text-white"
                  : "text-slate-300 hover:bg-[#272b35] hover:text-white"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center text-base ${
                  active ? "text-white" : "text-slate-400"
                }`}
              >
                {item.icon}
              </span>

              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto pt-8">
        {/* User */}
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#252a34] p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4f46e5] text-sm font-semibold text-white">
            {(user?.[0] || "U").toUpperCase()}
          </span>

          <div className="min-w-0">
            <strong className="block truncate text-sm font-semibold text-white">
              {user?.split("@")[0] || "User"}
            </strong>

            <span className="block truncate text-xs text-slate-400">
              {user || "demo@example.com"}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-[#272b35] hover:text-white"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
