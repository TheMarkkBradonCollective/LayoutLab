"use client";

import { useState } from "react";
import { TRS_FURNITURE } from "@/lib/trs-inventory";
import { getDefaultDropPosition } from "@/lib/demo-data";
import type { ItemCategory } from "@/types";
import { useEditorStore } from "@/stores/editor-store";
import { cn } from "@/lib/utils";

const CATEGORIES: { key: ItemCategory; label: string }[] = [
  { key: "TABLES", label: "Tables" },
  { key: "SEATING", label: "Seating" },
  { key: "EQUIPMENT", label: "Equipment" },
];

export function ItemsPanel() {
  const [category, setCategory] = useState<ItemCategory>("TABLES");
  const { addObject, venue } = useEditorStore();

  const items = TRS_FURNITURE.filter((item) => item.category === category);

  const handleAdd = (item: (typeof TRS_FURNITURE)[0]) => {
    const { x: centerX, y: centerY } = getDefaultDropPosition();

    addObject({
      itemName: item.name,
      itemType: item.id,
      category: item.category,
      x: centerX + (Math.random() - 0.5) * 4,
      y: centerY + (Math.random() - 0.5) * 4,
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
      <div className="border-b border-surface-100 px-3 py-2">
        <p className="text-[10px] text-surface-500">
          TRS inventory · dimensions in feet
        </p>
      </div>

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
                borderRadius: item.shape === "circle" ? "50%" : "4px",
                color: item.color === "#F3F4F6" ? "#374151" : "white",
              }}
            >
              {item.name.split(" ")[0]}
            </div>
            <span className="text-center text-[10px] leading-tight text-surface-700">
              {item.name}
            </span>
            <span className="text-[9px] text-surface-400">
              {item.notes ?? `${formatDim(item.width)} × ${formatDim(item.height)} ft`}
            </span>
            <span className="text-[9px] font-medium text-venue-600">
              Qty {item.quantity}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function formatDim(value: number): string {
  const inches = Math.round(value * 12);
  if (inches % 12 === 0) return String(inches / 12);
  const ft = Math.floor(inches / 12);
  const rem = inches % 12;
  return ft > 0 ? `${ft}'${rem}"` : `${rem}"`;
}
