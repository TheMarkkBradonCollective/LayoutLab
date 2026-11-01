import type { FloorObject } from "@/types";
import { getHallBounds } from "@/lib/trs-floor-plan";
import { TRS_FURNITURE, type TrsFurnitureItem } from "@/lib/trs-inventory";

export const VENUE_ITEM_DRAG_TYPE = "application/x-venue-item";

export function stockFor(itemType: string): TrsFurnitureItem | undefined {
  return TRS_FURNITURE.find((item) => item.id === itemType);
}

export function placedCount(objects: FloorObject[], itemType: string): number {
  return objects.filter((object) => object.itemType === itemType).length;
}

export function remainingStock(objects: FloorObject[], item: TrsFurnitureItem): number {
  return Math.max(0, item.quantity - placedCount(objects, item.id));
}

/** Keep a footprint inside the main hall, clear of the stage. */
export function clampToHall(
  x: number,
  y: number,
  width: number,
  height: number
): { x: number; y: number } {
  const bounds = getHallBounds();
  return {
    x: Math.max(bounds.minX, Math.min(bounds.maxX - width, x)),
    y: Math.max(bounds.minY, Math.min(bounds.maxY - height, y)),
  };
}

/** `anchor` is the point under the cursor, in plan feet. The item is centered on it. */
export function buildPlacement(
  item: TrsFurnitureItem,
  anchor: { x: number; y: number }
): Omit<FloorObject, "id"> {
  const parked = clampToHall(
    anchor.x - item.width / 2,
    anchor.y - item.height / 2,
    item.width,
    item.height
  );

  return {
    itemName: item.name,
    itemType: item.id,
    category: item.category,
    x: parked.x,
    y: parked.y,
    width: item.width,
    height: item.height,
    rotation: 0,
    locked: false,
    color: item.color,
    capacity: item.capacity,
  };
}

export function clientToPlanFeet(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  canvasWidth: number,
  canvasHeight: number,
  padLeft: number,
  padTop: number,
  pixelsPerFoot: number
): { x: number; y: number } {
  const u = rect.width > 0 ? (clientX - rect.left) / rect.width : 0.5;
  const v = rect.height > 0 ? (clientY - rect.top) / rect.height : 0.5;
  return {
    x: (u * canvasWidth - padLeft) / pixelsPerFoot,
    y: (v * canvasHeight - padTop) / pixelsPerFoot,
  };
}
