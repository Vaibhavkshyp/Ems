import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ChartNoAxesCombined,
  Settings,
  Search,
  Bell,
  Plus,
  ArrowUpRight,
  Building2,
  UserRoundPlus,
  BriefcaseBusiness,
  ChevronDown,
  MoreHorizontal,
  SlidersHorizontal,
  Download,
  Menu,
  X,
  Clock3,
  CircleCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import api from "./api";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Employees", icon: Users },
  { label: "Attendance", icon: CalendarDays },
  { label: "Reports", icon: ChartNoAxesCombined },
];

const colors = [
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
];

function initials(employee) {
  return `${employee.first_name?.[0] ?? ""}${employee.last_name?.[0] ?? ""}`.toUpperCase();
}

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function fetchEmployees() {
    try {
      setError("");
      const response = await api.get("/employees");
      setEmployees(response.data.data ?? []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't connect to Laravel. Check that the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  const departments = useMemo(
    () =>
      [...new Set(employees.map((e) => e.department).filter(Boolean))].sort(),
    [employees],
  );

  const filteredEmployees = useMemo(() => {
    const term = search.toLowerCase().trim();

    return employees.filter((employee) => {
      const name =
        `${employee.first_name ?? ""} ${employee.last_name ?? ""}`.toLowerCase();
      const matchesSearch =
        !term ||
        name.includes(term) ||
        (employee.email ?? "").toLowerCase().includes(term) ||
        (employee.designation ?? "").toLowerCase().includes(term);

      const matchesDepartment =
        department === "All departments" || employee.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, department]);

  const stats = [
    {
      label: "Total employees",
      value: employees.length,
      note: "People in your directory",
      icon: Users,
      iconStyle: "bg-violet-100 text-violet-700",
      trendIcon: ArrowUpRight,
      trend: "Directory",
      trendStyle: "text-violet-700 bg-violet-50",
    },
    {
      label: "Departments",
      value: departments.length,
      note: "Across your organization",
      icon: Building2,
      iconStyle: "bg-sky-100 text-sky-700",
      trendIcon: BriefcaseBusiness,
      trend: "Teams",
      trendStyle: "text-sky-700 bg-sky-50",
    },
    {
      label: "Search results",
      value: filteredEmployees.length,
      note: "Matching your filters",
      icon: UserRoundPlus,
      iconStyle: "bg-emerald-100 text-emerald-700",
      trendIcon: CircleCheck,
      trend: "Filtered",
      trendStyle: "text-emerald-700 bg-emerald-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7fb] text-slate-800">
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#17172d] text-white transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-6">
          <a href="#" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 shadow-lg shadow-violet-900/30">
              <Sparkles size={22} />
            </span>
            <span>
              <span className="block text-lg font-bold tracking-tight">
                orbit<span className="text-violet-400">HR</span>
              </span>
              <span className="text-[10px] tracking-[0.2em] text-slate-400">
                PEOPLE PLATFORM
              </span>
            </span>
          </a>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-8">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.2em] text-slate-500">
            WORKSPACE
          </p>
          <nav className="space-y-1">
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => {
                  setActiveNav(label);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  activeNav === label
                    ? "bg-violet-500/20 font-semibold text-violet-200 ring-1 ring-inset ring-violet-400/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={19} />
                {label}
                {label === "Employees" && (
                  <span className="ml-auto rounded-md bg-white/10 px-2 py-0.5 text-xs">
                    {employees.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 px-4">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.2em] text-slate-500">
            PREFERENCES
          </p>
          <button
            onClick={() => setActiveNav("Settings")}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
              activeNav === "Settings"
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings size={19} /> Settings
          </button>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-300/15 text-amber-300">
              <Sparkles size={19} />
            </div>
            <p className="text-sm font-semibold">People first, always.</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Keep your team organized and your workplace thriving.
            </p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-3/4 rounded-full bg-violet-400" />
            </div>
            <p className="mt-2 text-[10px] text-slate-500">
              YOUR PEOPLE WORKSPACE
            </p>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl p-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-300 to-fuchsia-300 text-sm font-bold text-violet-950">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Admin User</p>
              <p className="text-xs text-slate-400">Workspace admin</p>
            </div>
            <MoreHorizontal size={19} className="text-slate-400" />
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200 p-2 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-xs text-slate-400">Workspace / {activeNav}</p>
              <h1 className="text-lg font-bold tracking-tight sm:text-xl">
                {activeNav}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 sm:flex">
              <Clock3 size={15} />
              Local workspace
            </div>
            <button
              aria-label="Notifications"
              className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-500 ring-2 ring-white" />
            </button>
            <div className="hidden h-9 w-px bg-slate-200 sm:block" />
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                AD
              </div>
              <ChevronDown size={15} className="text-slate-400" />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] space-y-7 p-4 sm:p-8">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5140a8] via-[#6d55d9] to-[#9a72ed] p-6 text-white shadow-xl shadow-violet-200/60 sm:p-9">
            <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full border-[40px] border-white/[0.08]" />
            <div className="pointer-events-none absolute right-28 top-24 h-28 w-28 rounded-full bg-fuchsia-300/20 blur-3xl" />
            <div className="relative max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-violet-50">
                <Sparkles size={14} /> YOUR PEOPLE, YOUR IMPACT
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Great teams start with great people.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-violet-100 sm:text-base">
                Your people overview, all in one place. Find your team, explore
                departments, and keep your employee directory up to date.
              </p>
              <button
                onClick={() => {
                  setActiveNav("Employees");
                  document
                    .getElementById("employee-directory")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-violet-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-50"
              >
                Explore employees <ArrowUpRight size={17} />
              </button>
            </div>
            <div className="relative mt-7 flex gap-5 border-t border-white/20 pt-5 sm:absolute sm:bottom-8 sm:right-8 sm:mt-0 sm:border-0 sm:pt-0">
              <div>
                <p className="text-2xl font-bold">{employees.length}</p>
                <p className="mt-1 text-xs text-violet-100">Team members</p>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <p className="text-2xl font-bold">{departments.length}</p>
                <p className="mt-1 text-xs text-violet-100">Departments</p>
              </div>
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
            >
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-semibold">Couldn't load employees</p>
                <p className="mt-1">{error}</p>
              </div>
              <button
                onClick={fetchEmployees}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map(
              ({
                label,
                value,
                note,
                icon: Icon,
                iconStyle,
                trendIcon: TrendIcon,
                trend,
                trendStyle,
              }) => (
                <div
                  key={label}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconStyle}`}
                    >
                      <Icon size={23} />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${trendStyle}`}
                    >
                      <TrendIcon size={13} /> {trend}
                    </span>
                  </div>
                  <p className="mt-5 text-sm font-medium text-slate-500">
                    {label}
                  </p>
                  <div className="mt-1 flex items-end justify-between gap-3">
                    <p className="text-3xl font-bold tracking-tight text-slate-900">
                      {loading ? "—" : value}
                    </p>
                    <p className="pb-1 text-right text-xs text-slate-400">
                      {note}
                    </p>
                  </div>
                </div>
              ),
            )}
          </section>

          <section
            id="employee-directory"
            className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
          >
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">
                    Employee directory
                  </h2>
                  <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                    {filteredEmployees.length}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Manage and find people across your organization.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveNav("Employees");
                  alert(
                    "Next lesson: we'll build the Add Employee form and connect it to Laravel.",
                  );
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
              >
                <Plus size={18} /> Add employee
              </button>
            </div>

            <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/60 p-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, email or designation..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={17} className="text-slate-400" />
                <select
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 sm:flex-none"
                >
                  <option>All departments</option>
                  {departments.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const csv = [
                      [
                        "ID",
                        "First Name",
                        "Last Name",
                        "Email",
                        "Department",
                        "Designation",
                      ],
                      ...filteredEmployees.map((e) => [
                        e.id,
                        e.first_name,
                        e.last_name,
                        e.email,
                        e.department,
                        e.designation,
                      ]),
                    ]
                      .map((row) =>
                        row
                          .map(
                            (value) =>
                              `"${String(value ?? "").replaceAll('"', '""')}"`,
                          )
                          .join(","),
                      )
                      .join("\r\n");
                    const url = URL.createObjectURL(
                      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
                    );
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "employees.csv";
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                  <Download size={17} />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="bg-white text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-5 py-4">Department</th>
                    <th className="px-5 py-4">Designation</th>
                    <th className="px-5 py-4">Joining date</th>
                    <th className="px-5 py-4">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-14 text-center text-sm text-slate-500"
                      >
                        Loading your people...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-14 text-center text-sm text-slate-500"
                      >
                        Retry the request to load employees.
                      </td>
                    </tr>
                  ) : filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                          <Users size={23} />
                        </div>
                        <p className="mt-3 font-semibold text-slate-700">
                          No employees found
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          {search || department !== "All departments"
                            ? "Try changing your search or department filter."
                            : "Add an employee through your API to see them here."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee, index) => (
                      <tr
                        key={employee.id}
                        className="transition hover:bg-violet-50/40"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${colors[index % colors.length]}`}
                            >
                              {initials(employee)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {employee.first_name} {employee.last_name}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-400">
                                ID #{employee.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {employee.department ? (
                            <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                              {employee.department}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-300">
                              Not assigned
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {employee.designation || "—"}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-500">
                          {employee.joining_date
                            ? new Date(
                                `${employee.joining_date}T00:00:00`,
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-600">
                            {employee.email}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {employee.phone || "No phone number"}
                          </p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {filteredEmployees.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {employees.length}
                </span>{" "}
                employees
              </p>
              <button
                onClick={fetchEmployees}
                className="inline-flex items-center gap-1.5 self-start font-semibold text-violet-700 hover:text-violet-900 sm:self-auto"
              >
                Refresh directory <ArrowUpRight size={14} />
              </button>
            </div>
          </section>

          <footer className="flex flex-col items-center justify-between gap-2 pb-2 text-xs text-slate-400 sm:flex-row">
            <p>
              © {new Date().getFullYear()} orbitHR · Built for people who build.
            </p>
            <p className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Employee
              directory workspace
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
