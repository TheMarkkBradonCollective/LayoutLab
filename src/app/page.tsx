import Link from "next/link";
import {
  LayoutGrid,
  Box,
  Users,
  Play,
  Share2,
  Building2,
  Tablet,
  Smartphone,
  Monitor,
} from "lucide-react";

const FEATURES = [
  {
    icon: LayoutGrid,
    title: "2D Floor Planner",
    description: "Drag, drop, rotate, and resize furniture on accurate floor plans.",
  },
  {
    icon: Box,
    title: "3D Walkthrough",
    description: "View layouts from a guest perspective with immersive 3D mode.",
  },
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description: "See who is online and watch changes appear instantly.",
  },
  {
    icon: Play,
    title: "Event Simulation",
    description: "Test crowd flow, bar wait times, and capacity before the event.",
  },
  {
    icon: Share2,
    title: "External Sharing",
    description: "Share layouts with clients via secure links — no account needed.",
  },
  {
    icon: Building2,
    title: "Venue Ownership",
    description: "Your venue, your data, your team, your permissions.",
  },
];

const PLATFORMS = [
  { icon: Tablet, name: "Tablet", description: "Primary on-site experience" },
  { icon: Smartphone, name: "Mobile", description: "Quick viewing and approvals" },
  { icon: Monitor, name: "Desktop", description: "Advanced management" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-50">
      {/* Hero */}
      <header className="border-b border-surface-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-venue-600 text-sm font-bold text-white">
              MV
            </div>
            <span className="text-lg font-bold text-surface-900">MyVenue</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/workspace"
              className="rounded-lg bg-venue-600 px-4 py-2 text-sm font-medium text-white hover:bg-venue-700"
            >
              Open Workspace
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <section className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl">
            The digital operating system
            <br />
            <span className="text-venue-600">for venues</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-surface-600">
            Design floor plans, collaborate in real time, simulate events, and share
            layouts — all from one platform. Built for{" "}
            <span className="font-medium text-surface-800">The Rink Studios</span>.
            The venue stays in control.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/workspace"
              className="rounded-xl bg-venue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-venue-600/25 hover:bg-venue-700"
            >
              Try Demo Workspace
            </Link>
            <Link
              href="/venues"
              className="rounded-xl border border-surface-300 px-6 py-3 text-sm font-semibold text-surface-700 hover:bg-surface-100"
            >
              Manage Venues
            </Link>
          </div>
        </section>

        {/* Platforms */}
        <section className="border-y border-surface-200 bg-white py-12">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-wide text-surface-400">
              Tablet-first, everywhere
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {PLATFORMS.map((p) => (
                <div key={p.name} className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-venue-50 text-venue-600">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-surface-800">{p.name}</h3>
                  <p className="mt-1 text-sm text-surface-500">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="mb-12 text-center text-2xl font-bold text-surface-900">
            Everything venues need
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-surface-200 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-venue-50 text-venue-600">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-surface-800">{f.title}</h3>
                <p className="mt-2 text-sm text-surface-500">{f.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-surface-200 bg-white py-8 text-center text-sm text-surface-400">
        MyVenue — Built for The Rink Studios (TRS)
      </footer>
    </div>
  );
}
