"use client";

import { Minus, Plus, RotateCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TRS_FURNITURE } from "@/lib/trs-inventory";
import { buildPlacement } from "@/lib/room-placement";
import { getDefaultDropPosition } from "@/lib/demo-data";
import { useEditorStore } from "@/stores/editor-store";
import { RoomInventory } from "./room-inventory";

export function DesignDock() {
  const addObject = useEditorStore((state) => state.addObject);

  return (
    <div
      data-design-dock
      className="pointer-events-auto absolute inset-x-3 bottom-3 z-30 rounded-xl border border-surface-200 bg-white/95 p-1.5 shadow-lg backdrop-blur-sm"
    >
      <RoomInventory
        layout="dock"
        onPlace={(item) => addObject(buildPlacement(item, getDefaultDropPosition()))}
      />
    </div>
  );
}

export function SelectionToolbar() {
  const selectionIds = useEditorStore((state) => state.selectionIds);
  const objects = useEditorStore((state) => state.objects);
  const rotateSelected = useEditorStore((state) => state.rotateSelected);
  const scaleSelected = useEditorStore((state) => state.scaleSelected);
  const removeSelected = useEditorStore((state) => state.removeSelected);

  const selected = objects.filter((object) => selectionIds.includes(object.id));
  if (selected.length === 0) return null;

  const label =
    selected.length === 1
      ? selected[0].itemName
      : `${selected.length} grouped`;

  const atMin = selected.every((object) => {
    const stock = TRS_FURNITURE.find((item) => item.id === object.itemType);
    return stock ? object.width <= stock.width * 0.5 + 0.01 : false;
  });
  const atMax = selected.every((object) => {
    const stock = TRS_FURNITURE.find((item) => item.id === object.itemType);
    return stock ? object.width >= stock.width * 2 - 0.01 : false;
  });

  return (
    <div
      data-selection-toolbar
      className="pointer-events-auto absolute left-1/2 top-3 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full border border-surface-200 bg-white/95 py-1 pl-3 pr-1 shadow-lg backdrop-blur-sm"
    >
      <span className="max-w-40 truncate pr-2 text-[11px] font-medium text-surface-700">{label}</span>
      <ToolbarButton label="Rotate 45°" onClick={() => rotateSelected(45)}>
        <RotateCw className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Scale down" disabled={atMin} onClick={() => scaleSelected(0.9)}>
        <Minus className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Scale up" disabled={atMax} onClick={() => scaleSelected(1.1)}>
        <Plus className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Pick up" onClick={removeSelected} danger>
        <Trash2 className="h-3.5 w-3.5" />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={
        danger
          ? "flex h-7 w-7 items-center justify-center rounded-full text-red-600 hover:bg-red-50 disabled:opacity-40"
          : "flex h-7 w-7 items-center justify-center rounded-full text-surface-600 hover:bg-surface-100 disabled:opacity-40"
      }
    >
      {children}
    </button>
  );
}

export function RoomHint({
  mode,
  className,
}: {
  mode: "plan" | "3d" | "preview-plan" | "preview-3d";
  className?: string;
}) {
  const text = {
    plan: "Drag empty floor to move the room. Drag furniture to place it. Shift-click to group.",
    "preview-plan": "Preview. Drag the floor to move the room. Switch to Design to edit.",
    "3d": "Drag to orbit the room. Slide moves it sideways. Scroll to zoom.",
    "preview-3d": "Preview in 3D. Drag to orbit, or Slide to move the room.",
  }[mode];

  return (
    <div
      className={cn(
        "pointer-events-none absolute left-3 z-20 max-w-xs rounded-lg bg-white/85 px-2.5 py-1.5 text-[10px] leading-snug text-surface-600 shadow-sm backdrop-blur-sm",
        className
      )}
    >
      {text}
    </div>
  );
}
