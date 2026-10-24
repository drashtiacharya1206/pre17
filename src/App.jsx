
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GraduationCap,
  Users,
  Building2,
  Search,
  RefreshCw,
  Mail,
  MapPin,
  Globe,
  ArrowUpRight,
  Database,
  AlertCircle,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const departments = [
  "Computer Science",
  "Information Technology",
  "Business Management",
  "Data Science",
];

const avatarColors = [
  "from-violet-500 to-indigo-600",
  "from-cyan-500 to-blue-600",
  "from-pink-500 to-rose-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-fuchsia-500 to-purple-600",
];

function getDepartment(id) {
  return departments[(id - 1) % departments.length];
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

// Reusable student card component
function StudentCard({ student }) {
  const color = avatarColors[(student.id - 1) % avatarColors.length];

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#11182A] transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:shadow-xl hover:shadow-violet-950/20">
      <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400" />

      <div className="p-5">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-lg font-black text-white shadow-lg`}
            >
              {getInitials(student.name)}
            </div>

            <div className="min-w-0">
              <h3 className="break-words font-bold text-white transition group-hover:text-violet-300">
                {student.name}
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Student ID: STU-{String(student.id).padStart(3, "0")}
              </p>
            </div>
          </div>

          <span className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
            Active
          </span>
        </div>

        <div className="mb-4 flex items-start gap-3 text-sm">
          <Mail size={17} className="mt-0.5 shrink-0 text-violet-300" />
          <a
            href={`mailto:${student.email}`}
            className="break-all text-slate-300 hover:text-white"
          >
            {student.email}
          </a>
        </div>

        <div className="mb-4 flex items-start gap-3 text-sm">
          <Building2
            size={17}
            className="mt-0.5 shrink-0 text-cyan-300"
          />
          <span className="text-slate-300">{student.department}</span>
        </div>

        <div className="mb-5 flex items-start gap-3 text-sm">
          <MapPin size={17} className="mt-0.5 shrink-0 text-pink-300" />
          <span className="text-slate-400">
            {student.city}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-xs text-slate-500">
            {student.company}
          </span>
          <a
            href={`https://${student.website}`}
            target="_blank"
            rel="noreferrer"
            aria-label={`Visit ${student.name}'s sample website`}
            className="rounded-lg bg-white/5 p-2 text-slate-400 transition hover:bg-violet-500/20 hover:text-violet-300"
          >
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </article>
  );
}

// Reusable statistics component
function StatCard({ icon, label, value, color }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#11182A] p-5 transition hover:border-white/20">
      <div className={`mb-4 inline-flex rounded-xl bg-white/5 p-3 ${color}`}>
        {icon}
      </div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-white">
        {value}
      </p>
    </div>
  );
}

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected data received from the API.");
      }

      const formattedStudents = data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        department: getDepartment(user.id),
        city: user.address?.city || "Not available",
        company: user.company?.name || "Sample Institution",
        website: user.website || "example.com",
      }));

      setStudents(formattedStudents);
    } catch (err) {
      setError(
        "Unable to load student records. Check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch API records when the component first mounts
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Search and department filters
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        `${student.name} ${student.email} ${student.company}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "All" ||
        student.department === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [students, search, selectedDepartment]);

  const departmentCount = new Set(
    students.map((student) => student.department)
  ).size;

  return (
    <div className="min-h-screen bg-[#090D18] text-slate-100">
      {/* Navbar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#090D18]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 p-2.5 shadow-lg shadow-violet-500/20">
              <GraduationCap size={25} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wide">
                STUDORA<span className="text-violet-400">.</span>
              </h1>
              <p className="text-[10px] tracking-[0.2em] text-slate-400">
                STUDENT INTELLIGENCE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300 sm:px-4">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            API Connected
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
        {/* Hero section */}
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950 via-[#191B42] to-[#0E2037] p-7 sm:p-10">
          <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-violet-200">
                <Sparkles size={14} />
                DISCOVER YOUR CAMPUS
              </div>

              <h2 className="text-3xl font-black leading-tight sm:text-5xl">
                Every student.
                <br />
                <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  One smart dashboard.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Explore student profiles, discover departments, and retrieve
                records in real time using the Fetch API.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                  <Database size={15} className="text-cyan-300" />
                  JSONPlaceholder API
                </span>
                <span className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                  <RefreshCw size={15} className="text-violet-300" />
                  Fetch + useEffect
                </span>
              </div>
            </div>

            <div className="hidden h-36 w-36 shrink-0 items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl md:flex">
              <Users size={76} strokeWidth={1.2} className="text-violet-200" />
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Users size={22} />}
            label="Total Students"
            value={loading ? "—" : students.length}
            color="text-violet-300"
          />
          <StatCard
            icon={<Building2 size={22} />}
            label="Departments"
            value={loading ? "—" : departmentCount}
            color="text-cyan-300"
          />
          <StatCard
            icon={<Database size={22} />}
            label="Records Displayed"
            value={loading ? "—" : filteredStudents.length}
            color="text-emerald-300"
          />
        </section>

        {/* Student directory */}
        <section>
          <div className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-violet-300">
                The directory
              </p>
              <h3 className="text-2xl font-black sm:text-3xl">
                Student Directory
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Student records retrieved from a dummy REST API.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchStudents}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#11182A] px-4 py-3 text-sm font-semibold transition hover:border-violet-400/40 hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              {loading ? "Loading..." : "Refresh Records"}
            </button>
          </div>

          {/* Search and filter controls */}
          <div className="mb-6 grid gap-3 md:grid-cols-[1fr_250px]">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#11182A] px-4 py-3 focus-within:border-violet-400/50">
              <Search size={19} className="shrink-0 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name, email, or company..."
                aria-label="Search students"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              aria-label="Filter by department"
              className="rounded-xl border border-white/10 bg-[#11182A] px-4 py-3 text-sm text-slate-200 outline-none focus:border-violet-400/50"
            >
              <option value="All">All Departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-white/10 bg-[#11182A] p-5"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-slate-700/60" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-slate-700/60" />
                      <div className="h-3 w-1/2 rounded bg-slate-800" />
                    </div>
                  </div>
                  <div className="mb-3 h-3 rounded bg-slate-800" />
                  <div className="mb-3 h-3 w-4/5 rounded bg-slate-800" />
                  <div className="h-3 w-3/5 rounded bg-slate-800" />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div
              role="alert"
              className="rounded-2xl border border-rose-400/20 bg-rose-500/5 p-8 text-center"
            >
              <AlertCircle size={38} className="mx-auto mb-3 text-rose-300" />
              <h4 className="font-bold text-white">Couldn't load records</h4>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                {error}
              </p>
              <button
                onClick={fetchStudents}
                className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold hover:bg-violet-500"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredStudents.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/15 bg-[#11182A] px-5 py-14 text-center">
              <Search size={38} className="mx-auto mb-4 text-slate-500" />
              <h4 className="font-bold">No students found</h4>
              <p className="mt-2 text-sm text-slate-400">
                Change your search or select another department.
              </p>
            </div>
          )}

          {/* Render student cards using map() */}
          {!loading && !error && filteredStudents.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}
        </section>

        <footer className="mt-12 border-t border-white/10 py-6 text-center">
          <p className="text-xs text-slate-500">
            STUDORA © 2026 · React Components · Fetch API · Tailwind CSS
          </p>
        </footer>
      </main>
    </div>
  );
}
