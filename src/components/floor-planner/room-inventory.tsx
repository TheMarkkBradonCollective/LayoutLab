"use client";

import { useRef, useState } from "react";
import { Armchair, Lamp, Search, Sofa, Table2 } from "lucide-react";
import { TRS_FURNITURE, type TrsFurnitureItem } from "@/lib/trs-inventory";
import { remainingStock, VENUE_ITEM_DRAG_TYPE } from "@/lib/room-placement";
import type { ItemCategory } from "@/types";
import { useEditorStore } from "@/stores/editor-store";
import { cn } from "@/lib/utils";

const FILTERS: { key: ItemCategory | "ALL"; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "ALL", label: "All", icon: Sofa },
  { key: "TABLES", label: "Tables", icon: Table2 },
  { key: "SEATING", label: "Seating", icon: Armchair },
  { key: "EQUIPMENT", label: "Equipment", icon: Lamp },
];

interface RoomInventoryProps {
  layout: "dock" | "panel";
  onPlace: (item: TrsFurnitureItem) => void;
}

export function RoomInventory({ layout, onPlace }: RoomInventoryProps) {
  const objects = useEditorStore((state) => state.objects);
  const [category, setCategory] = useState<ItemCategory | "ALL">("ALL");
  const [query, setQuery] = useState("");

  const items = TRS_FURNITURE.filter((item) => {
    if (category !== "ALL" && item.category !== category) return false;
    if (!query.trim()) return true;
    return item.name.toLowerCase().includes(query.trim().toLowerCase());
  });

  return (
    <div className={cn("flex min-w-0", layout === "dock" ? "items-center gap-2" : "flex-col")}>
      {layout === "panel" && (
        <label className="relative mx-3 mt-3 block">
          <span className="sr-only">Search inventory</span>
          <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-surface-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search furniture"
            className="w-full rounded-lg border border-surface-200 bg-surface-50 py-1.5 pr-2 pl-8 text-xs text-surface-800 outline-none placeholder:text-surface-400 focus:border-venue-400"
          />
        </label>
      )}

      <div
        className={cn(
          "flex gap-1",
          layout === "panel" ? "border-b border-surface-100 p-2" : "shrink-0"
        )}
        role="tablist"
        aria-label="Inventory categories"
      >
        {FILTERS.map((filter) => {
          const Icon = filter.icon;
          const active = category === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              role="tab"
              aria-selected={active}
              title={filter.label}
              onClick={() => setCategory(filter.key)}
              className={cn(
                "flex items-center justify-center gap-1 rounded-md text-[10px] font-medium transition-colors",
                layout === "dock" ? "h-8 w-8" : "flex-1 px-2 py-1.5",
                active ? "bg-venue-100 text-venue-700" : "text-surface-500 hover:bg-surface-50"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {layout === "panel" && filter.label}
            </button>
          );
        })}
      </div>

      <div
        className={cn(
          layout === "dock"
            ? "flex min-w-0 flex-1 gap-1.5 overflow-x-auto scrollbar-thin"
            : "grid grid-cols-2 gap-2 p-3"
        )}
      >
        {items.map((item) => (
          <InventoryChip
            key={item.id}
            item={item}
            remaining={remainingStock(objects, item)}
            layout={layout}
            onPlace={onPlace}
          />
        ))}
        {items.length === 0 && (
          <p className="px-2 py-4 text-xs text-surface-400">No furniture matches that search.</p>
        )}
      </div>
    </div>
  );
}

function InventoryChip({
  item,
  remaining,
  layout,
  onPlace,
}: {
  item: TrsFurnitureItem;
  remaining: number;
  layout: "dock" | "panel";
  onPlace: (item: TrsFurnitureItem) => void;
}) {
  const out = remaining <= 0;
  const dragged = useRef(false);

  return (
    <button
      type="button"
      draggable={!out}
      disabled={out}
      title={out ? `${item.name} is all placed` : `Drag ${item.name} into the room`}
      onDragStart={(event) => {
        dragged.current = true;
        event.dataTransfer.setData(VENUE_ITEM_DRAG_TYPE, item.id);
        event.dataTransfer.setData("text/plain", item.id);
        event.dataTransfer.effectAllowed = "copy";
      }}
      onDragEnd={() => {
        window.setTimeout(() => {
          dragged.current = false;
        }, 0);
      }}
      onClick={() => {
        if (dragged.current) {
          dragged.current = false;
          return;
        }
        onPlace(item);
      }}
      className={cn(
        "flex shrink-0 flex-col items-center gap-1 rounded-lg border border-surface-200 bg-white text-left transition-colors",
        layout === "dock" ? "w-[4.5rem] px-1.5 py-1" : "p-3",
        out
          ? "cursor-not-allowed opacity-40"
          : "hover:border-venue-300 hover:bg-venue-50"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-md text-[8px] font-bold",
          layout === "dock" ? "h-7 w-7" : "h-9 w-9"
        )}
        style={{
          backgroundColor: item.color,
          borderRadius: item.shape === "circle" ? "50%" : "4px",
          color: item.color === "#F3F4F6" || item.color === "#C0C0C0" ? "#374151" : "white",
        }}
      >
        {item.name.split(" ")[0]}
      </div>
      <span className="line-clamp-2 w-full text-center text-[10px] leading-tight text-surface-700">
        {item.name}
      </span>
      {layout === "panel" && (
        <span className="text-[9px] text-surface-400">
          {item.notes ?? `${formatDim(item.width)} × ${formatDim(item.height)} ft`}
        </span>
      )}
      <span className={cn("text-[9px] font-medium", out ? "text-surface-400" : "text-venue-600")}>
        {remaining} left
      </span>
    </button>
  );
}

function formatDim(value: number): string {
  const inches = Math.round(value * 12);
  if (inches % 12 === 0) return String(inches / 12);
  const feet = Math.floor(inches / 12);
  const remainder = inches % 12;
  return feet > 0 ? `${feet}'${remainder}"` : `${remainder}"`;
}
