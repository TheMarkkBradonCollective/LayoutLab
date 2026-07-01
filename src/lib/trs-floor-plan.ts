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
  | "label";

export type DoorKind = "roller" | "exit" | "double" | "vestibule" | "greenroom" | "service";

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

/** Layout constants from TRS performance venue drawings */
export const TRS_LAYOUT = {
  leftWingWidth: 10,
  mainWidth: 35,
  barDepth: 24,
  soundWidth: 6,
  get totalWidth() {
    return this.leftWingWidth + this.mainWidth;
  },
  get totalHeight() {
    return this.barDepth + TRS_MAIN_FLOOR.lengthLeft;
  },
  performanceTop: 24,
  videoWall: { width: 20, height: 10 },
  stageDepth: 8,
};

/**
 * Coordinate system matches the annotated venue plan:
 * - Origin (0,0) = top-left of left service wing
 * - y increases downward (entrance at top, stage at bottom)
 * - Main performance hall starts at x = leftWingWidth
 */
export interface TrsRoomGeometry {
  /** Main hall performance floor — trapezoid */
  performanceTopLeft: { x: number; y: number };
  performanceTopRight: { x: number; y: number };
  performanceBottomRight: { x: number; y: number };
  performanceBottomLeft: { x: number; y: number };
  totalWidth: number;
  totalHeight: number;
}

export function getTrsRoomGeometry(
  specs: TrsFloorSpecs = TRS_MAIN_FLOOR
): TrsRoomGeometry {
  const { leftWingWidth, barDepth, mainWidth } = TRS_LAYOUT;
  const perfTop = barDepth;
  const bottomLeft = perfTop + specs.lengthLeft;
  const bottomRight = perfTop + specs.lengthRight;

  return {
    performanceTopLeft: { x: leftWingWidth, y: perfTop },
    performanceTopRight: { x: leftWingWidth + mainWidth, y: perfTop },
    performanceBottomRight: { x: leftWingWidth + mainWidth, y: bottomRight },
    performanceBottomLeft: { x: leftWingWidth, y: bottomLeft },
    totalWidth: TRS_LAYOUT.totalWidth,
    totalHeight: TRS_LAYOUT.totalHeight,
  };
}

/** Full venue outline including left service wing */
export function getVenueOutlinePoints(
  specs: TrsFloorSpecs = TRS_MAIN_FLOOR
): number[] {
  const g = getTrsRoomGeometry(specs);
  const lw = TRS_LAYOUT.leftWingWidth;

  return [
    0, 0,
    g.totalWidth, 0,
    g.performanceTopRight.x, g.performanceTopRight.y,
    g.performanceBottomRight.x, g.performanceBottomRight.y,
    g.performanceBottomLeft.x, g.performanceBottomLeft.y,
    g.performanceTopLeft.x, g.performanceTopLeft.y,
    0, g.performanceTopLeft.y,
  ];
}

/** Main performance floor only (where furniture is placed) */
export function getPerformanceFloorPoints(
  specs: TrsFloorSpecs = TRS_MAIN_FLOOR
): number[] {
  const g = getTrsRoomGeometry(specs);
  return [
    g.performanceTopLeft.x, g.performanceTopLeft.y,
    g.performanceTopRight.x, g.performanceTopRight.y,
    g.performanceBottomRight.x, g.performanceBottomRight.y,
    g.performanceBottomLeft.x, g.performanceBottomLeft.y,
  ];
}

export function buildTrsFloorPlan(
  specs: TrsFloorSpecs = TRS_MAIN_FLOOR
): FloorPlanElement[] {
  const { leftWingWidth, barDepth, mainWidth, soundWidth, videoWall, stageDepth } =
    TRS_LAYOUT;
  const mainX = leftWingWidth;
  const mainRight = mainX + mainWidth;
  const bottomY = barDepth + specs.lengthLeft;
  const bottomRightY = barDepth + specs.lengthRight;

  const stageY = bottomY - specs.stageOffsetBack - stageDepth;
  const stageX = mainX + specs.stageOffsetSide;
  const stageW = mainWidth - specs.stageOffsetSide * 2;

  const videoY = stageY - videoWall.height;
  const videoX = mainX + (mainWidth - videoWall.width) / 2;

  // Roller door on right wall — mid section per annotated plan
  const rollerY = barDepth + 48;
  const wedgeX = mainRight - specs.rampWidth;
  const wedgeY = rollerY;

  const emergencyY = barDepth + 68;
  const doubleExitY = bottomY - specs.stageOffsetBack - specs.doubleExitWidth - 4;
  const greenroomY = bottomRightY - 8;

  return [
    // ─── Top bar & sound ─────────────────────────────────────────
    {
      id: "bar-zone",
      type: "bar-zone",
      x: mainX,
      y: 0,
      width: mainWidth - soundWidth,
      height: barDepth,
      label: "Bar",
    },
    {
      id: "sound-zone",
      type: "sound-zone",
      x: mainRight - soundWidth,
      y: 0,
      width: soundWidth,
      height: barDepth,
      label: "Sound",
    },

    // ─── Left service wing ───────────────────────────────────────
    {
      id: "vestibule",
      type: "door",
      x: 0,
      y: 0,
      width: leftWingWidth,
      height: 2,
      label: "Vestibule Entrance",
      wall: "top",
      doorKind: "vestibule",
    },
    {
      id: "stairs",
      type: "stairs",
      x: 1,
      y: 3,
      width: leftWingWidth - 2,
      height: 10,
      label: "UP 14 TREADS",
    },
    {
      id: "restrooms",
      type: "restroom",
      x: 0,
      y: barDepth + 4,
      width: leftWingWidth,
      height: 22,
      label: "Restrooms",
    },
    {
      id: "service-door",
      type: "door",
      x: leftWingWidth - 0.5,
      y: barDepth + 14,
      width: 1,
      height: 4,
      label: "Service",
      wall: "right",
      doorKind: "service",
    },

    // ─── Performance floor features ──────────────────────────────
    {
      id: "column-1",
      type: "column",
      x: mainX + 8,
      y: barDepth + 4,
      width: 2,
      height: 2,
      label: "",
    },
    {
      id: "column-2",
      type: "column",
      x: mainX + mainWidth / 2 - 1,
      y: barDepth + 4,
      width: 2,
      height: 2,
      label: "",
    },
    {
      id: "column-3",
      type: "column",
      x: mainRight - 10,
      y: barDepth + 4,
      width: 2,
      height: 2,
      label: "",
    },

    // Shaded end zones (from CAD plan)
    {
      id: "shade-left",
      type: "shaded-zone",
      x: mainX,
      y: bottomY - 18,
      width: 5,
      height: 18,
      label: "",
    },
    {
      id: "shade-right",
      type: "shaded-zone",
      x: mainRight - 5,
      y: bottomRightY - 18,
      width: 5,
      height: 18,
      label: "",
    },

    // ─── Load-in: roller door + wedge ─────────────────────────────
    {
      id: "roller-door",
      type: "door",
      x: mainRight - 0.5,
      y: rollerY,
      width: 1,
      height: specs.bayDoorWidth,
      label: "Roller Door (12 ft)",
      wall: "right",
      doorKind: "roller",
    },
    {
      id: "load-wedge",
      type: "ramp",
      x: wedgeX,
      y: wedgeY,
      width: specs.rampWidth,
      height: specs.rampDepth,
      label: "Load-In Wedge (11 × 13 ft)",
    },

    // ─── Exits ───────────────────────────────────────────────────
    {
      id: "emergency-exit",
      type: "door",
      x: mainRight - 0.5,
      y: emergencyY,
      width: 1,
      height: specs.emergencyExitWidth,
      label: "Emergency Exit (4 ft)",
      wall: "right",
      doorKind: "exit",
    },
    {
      id: "greenroom-door",
      type: "door",
      x: mainRight - 0.5,
      y: greenroomY,
      width: 1,
      height: 4,
      label: "Greenroom",
      wall: "right",
      doorKind: "greenroom",
    },
    {
      id: "double-exit",
      type: "door",
      x: mainX - 0.5,
      y: doubleExitY,
      width: 1,
      height: specs.doubleExitWidth,
      label: "Double Exit (6 ft)",
      wall: "left",
      doorKind: "double",
    },

    // ─── Stage & video wall ──────────────────────────────────────
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

    // ─── Annotations ─────────────────────────────────────────────
    {
      id: "label-performance",
      type: "label",
      x: mainX + 4,
      y: barDepth + 20,
      width: 20,
      height: 4,
      label: "PERFORMANCE VENUE · 620+ standing / 350 seated",
    },
    {
      id: "label-rink-floor",
      type: "label",
      x: mainX + 4,
      y: barDepth + 26,
      width: 24,
      height: 3,
      label: "Original 1926 Roller Skating Rink Floor",
    },
  ];
}

/** y-offset where the performance floor begins (below bar) */
export function getPerformanceFloorOffset(): number {
  return TRS_LAYOUT.performanceTop;
}
