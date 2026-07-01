import Link from "next/link";
import { Building2, Plus, MapPin, Users } from "lucide-react";

const DEMO_VENUES = [
  {
    id: "venue-the-rink-studios",
    name: "The Rink Studios",
    address: "TRS — Primary venue",
    rooms: 1,
    capacity: 400,
    members: 8,
  },
];

export const metadata = {
  title: "Venues — MyVenue",
};

export default function VenuesPage() {
  return (
    <div className="min-h-screen bg-surface-50">
      <header className="border-b border-surface-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-venue-600 text-sm font-bold text-white">
              MV
            </div>
            <span className="text-lg font-bold text-surface-900">MyVenue</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Your Venues</h1>
            <p className="mt-1 text-sm text-surface-500">
              The Rink Studios workspace
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-venue-600 px-4 py-2 text-sm font-medium text-white hover:bg-venue-700">
            <Plus className="h-4 w-4" />
            New Venue
          </button>
        </div>

        <div className="space-y-4">
          {DEMO_VENUES.map((venue) => (
            <Link
              key={venue.id}
              href="/workspace"
              className="flex items-center gap-4 rounded-xl border border-surface-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-venue-50 text-venue-600">
                <Building2 className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-surface-800">{venue.name}</h2>
                <div className="mt-1 flex items-center gap-1 text-sm text-surface-400">
                  <MapPin className="h-3.5 w-3.5" />
                  {venue.address}
                </div>
              </div>
              <div className="flex gap-6 text-center text-sm">
                <div>
                  <div className="font-semibold text-surface-800">{venue.rooms}</div>
                  <div className="text-xs text-surface-400">Rooms</div>
                </div>
                <div>
                  <div className="font-semibold text-surface-800">{venue.capacity}</div>
                  <div className="text-xs text-surface-400">Capacity</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 font-semibold text-surface-800">
                    <Users className="h-3.5 w-3.5" />
                    {venue.members}
                  </div>
                  <div className="text-xs text-surface-400">Team</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
