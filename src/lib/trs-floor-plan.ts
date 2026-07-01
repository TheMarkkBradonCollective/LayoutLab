import type { TrsFloorSpecs } from "./trs-inventory";
import { TRS_MAIN_FLOOR } from "./trs-inventory";

export type FloorPlanElementType =
  | "stage-zone"
  | "video-wall"
  | "bar-zone"
  | "sound-zone"
  | "door"
  | "ramp"
  | "column"
  | "shaded-zone"
  | "stairs"
  | "restroom"
  | "corridor"
  | "label";

export type DoorKind =
  | "roller"
  | "exit"
  | "double"
  | "vestibule"
  | "greenroom"
  | "service"
  | "top";

export interface FloorPlanElement {
  id: string;
  type: FloorPlanElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  wall?: "top" | "bottom" | "left" | "right";
  doorKind?: DoorKind;
}

/**
 * TRS Performance Venue — PLAN VIEW (looking straight down at the floor).
 *
 * All x/y/width/height values are horizontal footprints on the floor plane.
 * This is not an elevation or "facing into the room" perspective.
 *
 * Coordinate system (feet, top-down on screen):
 *   x → east on the plan (screen right)
 *   y → south on the plan (screen down)
 *
 * Main entrance is on the north edge (top of screen). Walking in from there:
 *   LEFT WALL  = west edge  (90 ft: cleaning closet → back wall / stage)
 *   RIGHT WALL = east edge  (84 ft: bar → greenroom door)
 *   Toward stage = south (+y) on the plan
 */
export const TRS_LAYOUT = {
  leftWingWidth: 12,
  corridorWidth: 2,
  /** Main performance floor width (user measurement) */
  mainWidth: 35,
  rightShadeWidth: 10,
  videoWall: { width: 20, height: 10 },
  stageDepth: 8,
  /** Load-in ramp protrudes left of the main hall wall */
  rampProtrusion: 11,

  get mainX(): number {
    return this.leftWingWidth + this.corridorWidth;
  },
  get mainRight(): number {
    return this.mainX + this.mainWidth;
  },
  get totalWidth(): number {
    return this.mainRight + this.rightShadeWidth;
  },
  get totalHeight(): number {
    return TRS_MAIN_FLOOR.lengthLeft;
  },
  get canvasPadLeft(): number {
    return 24;
  },
  get canvasPadTop(): number {
    return 20;
  },
};

export interface TrsRoomGeometry {
  mainTopLeft: { x: number; y: number };
  mainTopRight: { x: number; y: number };
  mainBottomRight: { x: number; y: number };
  mainBottomLeft: { x: number; y: number };
  totalWidth: number;
  totalHeight: number;
}

export function getTrsRoomGeometry(
  specs: TrsFloorSpecs = TRS_MAIN_FLOOR
): TrsRoomGeometry {
  const { mainX, mainRight } = TRS_LAYOUT;
  return {
    mainTopLeft: { x: mainX, y: 0 },
    mainTopRight: { x: mainRight, y: 0 },
    mainBottomRight: { x: mainRight, y: specs.lengthRight },
    mainBottomLeft: { x: mainX, y: specs.lengthLeft },
    totalWidth: TRS_LAYOUT.totalWidth,
    totalHeight: TRS_LAYOUT.totalHeight,
  };
}

/** Full building outline including left wing and right utility block */
export function getVenueOutlinePoints(
  specs: TrsFloorSpecs = TRS_MAIN_FLOOR
): number[] {
  const g = getTrsRoomGeometry(specs);
  const w = TRS_LAYOUT.totalWidth;
  return [
    0, 0,
    w, 0,
    w, specs.lengthRight,
    g.mainBottomRight.x, g.mainBottomRight.y,
    g.mainBottomLeft.x, g.mainBottomLeft.y,
    0, specs.lengthLeft,
  ];
}

/** Main hall performance floor — trapezoid (90 ft left, 84 ft right) */
export function getPerformanceFloorPoints(
  specs: TrsFloorSpecs = TRS_MAIN_FLOOR
): number[] {
  const g = getTrsRoomGeometry(specs);
  return [
    g.mainTopLeft.x, g.mainTopLeft.y,
    g.mainTopRight.x, g.mainTopRight.y,
    g.mainBottomRight.x, g.mainBottomRight.y,
    g.mainBottomLeft.x, g.mainBottomLeft.y,
  ];
}

/** Usable bounds for placing movable furniture inside the main hall */
export function getHallBounds(specs: TrsFloorSpecs = TRS_MAIN_FLOOR) {
  const { mainX, mainRight } = TRS_LAYOUT;
  const margin = 2;
  return {
    minX: mainX + margin,
    maxX: mainRight - margin,
    minY: 22,
    maxY: specs.lengthLeft - specs.stageOffsetBack - TRS_LAYOUT.stageDepth - margin,
  };
}

export function buildTrsFloorPlan(
  specs: TrsFloorSpecs = TRS_MAIN_FLOOR
): FloorPlanElement[] {
  const {
    leftWingWidth,
    corridorWidth,
    mainWidth,
    mainX,
    mainRight,
    videoWall,
    stageDepth,
    rightShadeWidth,
    rampProtrusion,
  } = TRS_LAYOUT;

  const bottomLeftY = specs.lengthLeft;
  const bottomRightY = specs.lengthRight;

  // Stage at back wall (bottom) — 3 ft from wall, 3'6" from sides
  const stageY = bottomLeftY - specs.stageOffsetBack - stageDepth;
  const stageX = mainX + specs.stageOffsetSide;
  const stageW = mainWidth - specs.stageOffsetSide * 2;
  const videoY = stageY - videoWall.height;
  const videoX = mainX + (mainWidth - videoWall.width) / 2;

  // Bay door on LEFT wall — load-in mid-hall per annotated drawing
  const rollerY = 36;
  const rampX = mainX - rampProtrusion;
  const rampY = rollerY;

  return [
    // ─── Left wing (outside main hall): cleaning closet + stairs ───
    {
      id: "cleaning-closet",
      type: "shaded-zone",
      x: 0,
      y: 2,
      width: leftWingWidth,
      height: 8,
      label: "Cleaning Closet",
    },
    {
      id: "wing-stairs",
      type: "stairs",
      x: 1,
      y: 14,
      width: leftWingWidth - 2,
      height: 16,
      label: "UP 14 TREADS",
    },

    // ─── Main entrance (top center of hall) ────────────────────────
    {
      id: "top-double-doors",
      type: "door",
      x: mainX + mainWidth / 2 - specs.doubleExitWidth / 2,
      y: -0.5,
      width: specs.doubleExitWidth,
      height: 1,
      label: "Main Entrance (6 ft)",
      wall: "top",
      doorKind: "top",
    },

    // ─── Side vestibule off left wing (auxiliary entry) ─────────────
    {
      id: "vestibule",
      type: "door",
      x: 0,
      y: 0,
      width: leftWingWidth,
      height: 2,
      label: "Vestibule",
      wall: "top",
      doorKind: "vestibule",
    },

    // ─── Corridor between wing and main hall ───────────────────────
    {
      id: "corridor",
      type: "corridor",
      x: leftWingWidth,
      y: 0,
      width: corridorWidth,
      height: bottomLeftY,
      label: "",
    },
    {
      id: "corridor-door-top",
      type: "door",
      x: leftWingWidth + corridorWidth - 0.5,
      y: 8,
      width: 1,
      height: specs.doubleExitWidth,
      label: "Double Doors (6 ft)",
      wall: "right",
      doorKind: "double",
    },
    {
      id: "corridor-door-bottom",
      type: "door",
      x: leftWingWidth + corridorWidth - 0.5,
      y: bottomLeftY - 18,
      width: 1,
      height: 4,
      label: "Service Door",
      wall: "right",
      doorKind: "service",
    },

    // ─── Right wing (outside main hall): restrooms + greenroom ─────
    {
      id: "restrooms",
      type: "restroom",
      x: mainRight + 1,
      y: 2,
      width: rightShadeWidth - 2,
      height: 20,
      label: "Restrooms",
    },
    {
      id: "restroom-door",
      type: "door",
      x: mainRight - 0.5,
      y: 8,
      width: 1,
      height: 4,
      label: "Restrooms",
      wall: "right",
      doorKind: "service",
    },
    {
      id: "right-shade",
      type: "shaded-zone",
      x: mainRight,
      y: 24,
      width: rightShadeWidth,
      height: bottomRightY - 24,
      label: "Greenroom / Utility",
    },
    {
      id: "right-stairs",
      type: "stairs",
      x: mainRight + 1,
      y: 28,
      width: rightShadeWidth - 2,
      height: 10,
      label: "Stairs",
    },

    // ─── Bar + sound (plan footprints, top-right inside main hall) ─
    {
      id: "bar-zone",
      type: "bar-zone",
      x: mainRight - 12,
      y: 4,
      width: 12,
      height: 16,
      label: "Bar",
    },
    {
      id: "sound-zone",
      type: "sound-zone",
      x: mainRight - 20,
      y: 4,
      width: 8,
      height: 6,
      label: "Sound",
    },

    // ─── Columns near entrance ─────────────────────────────────────
    {
      id: "column-1",
      type: "column",
      x: mainX + 5,
      y: 14,
      width: 2,
      height: 2,
      label: "",
    },
    {
      id: "column-2",
      type: "column",
      x: mainX + mainWidth / 2 - 1,
      y: 14,
      width: 2,
      height: 2,
      label: "",
    },
    {
      id: "column-3",
      type: "column",
      x: mainRight - 7,
      y: 14,
      width: 2,
      height: 2,
      label: "",
    },

    // ─── Bay door + ramp on YOUR LEFT wall (load-in) ───────────────
    {
      id: "roller-door",
      type: "door",
      x: mainX - 0.5,
      y: rollerY,
      width: 1,
      height: specs.bayDoorWidth,
      label: "Bay Door (12 ft)",
      wall: "left",
      doorKind: "roller",
    },
    {
      id: "load-ramp",
      type: "ramp",
      x: rampX,
      y: rampY,
      width: specs.rampWidth,
      height: specs.rampDepth,
      label: "Ramp (11 × 13 ft)",
    },

    // ─── Exits (your right wall + back corners) ────────────────────
    {
      id: "exit-right-top",
      type: "door",
      x: mainRight - 0.5,
      y: 12,
      width: 1,
      height: specs.doubleExitWidth,
      label: "Exit (6 ft)",
      wall: "right",
      doorKind: "double",
    },
    {
      id: "exit-left-stage",
      type: "door",
      x: mainX - 0.5,
      y: bottomLeftY - 12,
      width: 1,
      height: specs.emergencyExitWidth,
      label: "Emergency Exit (4 ft)",
      wall: "left",
      doorKind: "exit",
    },
    {
      id: "greenroom-door",
      type: "door",
      x: mainRight - 0.5,
      y: bottomRightY - 10,
      width: 1,
      height: 4,
      label: "Greenroom Door",
      wall: "right",
      doorKind: "greenroom",
    },
    {
      id: "bottom-stairs",
      type: "stairs",
      x: mainX + mainWidth - 14,
      y: bottomRightY - 8,
      width: 10,
      height: 6,
      label: "Exit Stairs",
    },
    {
      id: "bottom-exit",
      type: "door",
      x: mainX + mainWidth - 12,
      y: bottomRightY - 0.5,
      width: specs.doubleExitWidth,
      height: 1,
      label: "Public Exit (6 ft)",
      wall: "bottom",
      doorKind: "double",
    },

    // ─── Stage + video wall at back wall (bottom) ──────────────────
    {
      id: "video-wall",
      type: "video-wall",
      x: videoX,
      y: videoY,
      width: videoWall.width,
      height: videoWall.height,
      label: "20 × 10 Video Wall",
    },
    {
      id: "stage-zone",
      type: "stage-zone",
      x: stageX,
      y: stageY,
      width: stageW,
      height: stageDepth,
      label: "Stage",
    },

    // ─── Labels ────────────────────────────────────────────────────
    {
      id: "label-performance",
      type: "label",
      x: mainX + 3,
      y: 26,
      width: 30,
      height: 4,
      label: "PERFORMANCE VENUE · 620+ standing / 350 seated",
    },
    {
      id: "label-rink-floor",
      type: "label",
      x: mainX + 3,
      y: 32,
      width: 30,
      height: 3,
      label: "Original 1926 Roller Skating Rink Floor",
    },
  ];
}

export function getCanvasPadLeft(): number {
  return TRS_LAYOUT.canvasPadLeft;
}

export function getCanvasPadTop(): number {
  return TRS_LAYOUT.canvasPadTop;
}

export function getPerformanceFloorOffset(): number {
  return 0;
}
