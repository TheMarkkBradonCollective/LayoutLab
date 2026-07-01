"use client";

import { Plus, Clock, FileText } from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { cn } from "@/lib/utils";

const DEMO_LAYOUTS = [
  { id: "concert-on-ice", name: "Concert on Ice", version: 3, updated: "2 hours ago" },
  { id: "hockey-night", name: "Hockey Night", version: 2, updated: "Yesterday" },
  { id: "birthday-party", name: "Birthday Party", version: 1, updated: "3 days ago" },
  { id: "figure-skating", name: "Figure Skating Showcase", version: 2, updated: "1 week ago" },
  { id: "empty-rink", name: "Empty Rink", version: 1, updated: "2 weeks ago" },
];

export function LayoutsPanel() {
  const { currentLayout, setCurrentLayout, venue } = useEditorStore();

  const handleSelect = (layout: (typeof DEMO_LAYOUTS)[0]) => {
    setCurrentLayout({
      id: layout.id,
      name: layout.name,
      roomId: venue?.rooms[0]?.id ?? "room-main-rink",
      venueId: venue?.id ?? "venue-the-rink-studios",
      objects: currentLayout?.objects ?? [],
      version: layout.version,
    });
  };

  return (
    <div className="p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-surface-400">
          Layouts
        </h3>
        <button className="flex items-center gap-1 rounded-md bg-venue-600 px-2 py-1 text-[10px] font-medium text-white hover:bg-venue-700">
          <Plus className="h-3 w-3" />
          New
        </button>
      </div>

      <div className="space-y-1">
        {DEMO_LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            onClick={() => handleSelect(layout)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
              currentLayout?.id === layout.id
                ? "bg-venue-50 ring-1 ring-venue-200"
                : "hover:bg-surface-50"
            )}
          >
            <FileText className="h-4 w-4 shrink-0 text-surface-400" />
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-medium text-surface-800">
                {layout.name}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-surface-400">
                <span>v{layout.version}</span>
                <span>·</span>
                <Clock className="h-2.5 w-2.5" />
                <span>{layout.updated}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
