"use client";

import { useState } from "react";
import { DEFAULT_FURNITURE, type ItemCategory } from "@/types";
import { useEditorStore } from "@/stores/editor-store";
import { cn } from "@/lib/utils";

const CATEGORIES: { key: ItemCategory; label: string }[] = [
  { key: "TABLES", label: "Tables" },
  { key: "SEATING", label: "Seating" },
  { key: "EQUIPMENT", label: "Equipment" },
  { key: "DECOR", label: "Decor" },
];

export function ItemsPanel() {
  const [category, setCategory] = useState<ItemCategory>("TABLES");
  const { addObject, venue } = useEditorStore();

  const items = DEFAULT_FURNITURE.filter((item) => item.category === category);

  const handleAdd = (item: (typeof DEFAULT_FURNITURE)[0]) => {
    const room = venue?.rooms[0];
    const centerX = room ? (room.width - item.width) / 2 : 5;
    const centerY = room ? (room.height - item.height) / 2 : 5;

    addObject({
      itemName: item.name,
      itemType: item.id,
      category: item.category,
      x: centerX + (Math.random() - 0.5) * 2,
      y: centerY + (Math.random() - 0.5) * 2,
      width: item.width,
      height: item.height,
      rotation: 0,
      locked: false,
      color: item.color,
      capacity: item.capacity,
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-1 border-b border-surface-100 p-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={cn(
              "flex-1 rounded-md px-2 py-1.5 text-[10px] font-medium transition-colors",
              category === cat.key
                ? "bg-venue-100 text-venue-700"
                : "text-surface-500 hover:bg-surface-50"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 p-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleAdd(item)}
            className="flex flex-col items-center gap-1.5 rounded-lg border border-surface-200 p-3 transition-colors hover:border-venue-300 hover:bg-venue-50"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-md text-[8px] font-bold text-white"
              style={{
                backgroundColor: item.color,
                borderRadius: item.icon === "circle" ? "50%" : "4px",
              }}
            >
              {item.name.split(" ")[0]}
            </div>
            <span className="text-center text-[10px] leading-tight text-surface-700">
              {item.name}
            </span>
            {item.capacity && (
              <span className="text-[9px] text-surface-400">Seats {item.capacity}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
