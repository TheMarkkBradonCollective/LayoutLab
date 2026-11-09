"use client";

import { RoomInventory } from "@/components/floor-planner/room-inventory";
import { buildPlacement } from "@/lib/room-placement";
import { getDefaultDropPosition } from "@/lib/demo-data";
import { useEditorStore } from "@/stores/editor-store";

export function ItemsPanel() {
  const addObject = useEditorStore((state) => state.addObject);

  return (
    <div className="flex flex-col">
      <div className="border-b border-surface-100 px-3 py-2">
        <p className="text-[10px] text-surface-500">
          Venue inventory · drag onto the room or tap to place
        </p>
      </div>
      <RoomInventory
        layout="panel"
        onPlace={(item) => addObject(buildPlacement(item, getDefaultDropPosition()))}
      />
    </div>
  );
}
