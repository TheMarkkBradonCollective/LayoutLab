"use client";

import { useEditorStore } from "@/stores/editor-store";

const DEMO_TEAM = [
  { id: "1", name: "Sarah Chen", role: "OWNER", status: "editing" as const, email: "sarah@venue.com" },
  { id: "2", name: "Mike Johnson", role: "MANAGER", status: "editing" as const, email: "mike@venue.com" },
  { id: "3", name: "John Smith", role: "VIEWER", status: "viewing" as const, email: "john@venue.com" },
  { id: "4", name: "Emma Davis", role: "DESIGNER", status: "offline" as const, email: "emma@venue.com" },
];

const ROLE_COLORS: Record<string, string> = {
  OWNER: "bg-amber-100 text-amber-800",
  MANAGER: "bg-purple-100 text-purple-800",
  DESIGNER: "bg-blue-100 text-blue-800",
  STAFF: "bg-green-100 text-green-800",
  VIEWER: "bg-surface-100 text-surface-600",
};

export function TeamPanel() {
  const { liveUsers } = useEditorStore();

  return (
    <div className="p-3">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-surface-400">
        Team Members
      </h3>

      <div className="space-y-2">
        {DEMO_TEAM.map((member) => {
          const isLive = liveUsers.some((u) => u.name === member.name) || member.status !== "offline";
          return (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-surface-50"
            >
              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-venue-100 text-xs font-bold text-venue-700">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                {isLive && (
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                      member.status === "editing" ? "bg-emerald-500" : "bg-blue-400"
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-surface-800">{member.name}</div>
                <div className="text-[10px] text-surface-400">{member.email}</div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${ROLE_COLORS[member.role]}`}
              >
                {member.role}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
