"use client";

import {
  MousePointer2,
  Hand,
  Ruler,
  Copy,
  Trash2,
  Lock,
  Unlock,
  RotateCw,
} from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { cn } from "@/lib/utils";

export function ToolsPanel() {
  const {
    tool,
    setTool,
    selectedObjectId,
    objects,
    duplicateObject,
    deleteObject,
    toggleLock,
    updateObject,
    pushHistory,
  } = useEditorStore();

  const selected = objects.find((o) => o.id === selectedObjectId);

  const tools = [
    { id: "select" as const, icon: MousePointer2, label: "Select" },
    { id: "pan" as const, icon: Hand, label: "Pan" },
    { id: "measure" as const, icon: Ruler, label: "Measure" },
  ];

  return (
    <div className="p-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-surface-400">
        Tools
      </h3>
      <div className="mb-4 grid grid-cols-3 gap-1">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg p-2 text-[10px] font-medium transition-colors",
              tool === t.id
                ? "bg-venue-100 text-venue-700"
                : "text-surface-500 hover:bg-surface-50"
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {selected && (
        <>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-surface-400">
            Selected: {selected.itemName}
          </h3>
          <div className="grid grid-cols-2 gap-1">
            <ActionButton
              icon={Copy}
              label="Duplicate"
              onClick={() => duplicateObject(selected.id)}
            />
            <ActionButton
              icon={RotateCw}
              label="Rotate"
              onClick={() => {
                pushHistory();
                updateObject(selected.id, { rotation: (selected.rotation + 15) % 360 });
              }}
            />
            <ActionButton
              icon={selected.locked ? Unlock : Lock}
              label={selected.locked ? "Unlock" : "Lock"}
              onClick={() => toggleLock(selected.id)}
            />
            <ActionButton
              icon={Trash2}
              label="Delete"
              onClick={() => deleteObject(selected.id)}
              variant="danger"
            />
          </div>

          <div className="mt-3 space-y-1 text-[10px] text-surface-500">
            <div>Position: {selected.x.toFixed(1)}m, {selected.y.toFixed(1)}m</div>
            <div>Size: {selected.width}m × {selected.height}m</div>
            <div>Rotation: {selected.rotation}°</div>
          </div>
        </>
      )}

      {!selected && (
        <p className="text-xs text-surface-400">
          Select an object on the floor plan to edit it.
        </p>
      )}
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  variant?: "danger";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-colors",
        variant === "danger"
          ? "text-red-600 hover:bg-red-50"
          : "text-surface-600 hover:bg-surface-50"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
