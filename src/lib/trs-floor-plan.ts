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
 * Layout derived from TRS CAD floor plan + annotated performance venue drawing.
 *
 * Coordinate system (feet):
 *   Origin (0,0) = top-left of building
 *   y increases downward (entrance/top → stage/bottom)
 *
 * User measurements:
 *   Room width .............. 35 ft
 *   Left wall ............... 90 ft (cleaning closet → back wall)
 *   Right wall .............. 84 ft (bar → greenroom door)
 */
export const TRS_LAYOUT = {
  /** Left wing: bar, restrooms, vestibule (per CAD left auxiliary) */
  leftWingWidth: 14,
  /** Dark corridor between wing and main hall */
  corridorWidth: 3,
  /** Main performance hall width */
  mainWidth: 35,
  /** Shaded area on right side of main hall (per CAD) */
  rightShadeWidth: 10,
  soundWidth: 6,
  videoWall: { width: 20, height: 10 },
  stageDepth: 8,
  get mainX() {
    return this.leftWingWidth + this.corridorWidth;
  },
  get mainRight() {
    return this.mainX + this.mainWidth;
  },
  get totalWidth() {
    return this.mainRight + this.rightShadeWidth;
  },
  get totalHeight() {
    return TRS_MAIN_FLOOR.lengthLeft;
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

/** Full building outline */
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

/** Main hall performance floor (trapezoid — left wall 90 ft, right wall 84 ft) */
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
  } = TRS_LAYOUT;

  const bottomLeftY = specs.lengthLeft;
  const bottomRightY = specs.lengthRight;

  const stageY = bottomLeftY - specs.stageOffsetBack - stageDepth;
  const stageX = mainX + specs.stageOffsetSide;
  const stageW = mainWidth - specs.stageOffsetSide * 2;
  const videoY = stageY - videoWall.height;
  const videoX = mainX + (mainWidth - videoWall.width) / 2;

  // Roller door — LEFT wall, mid hall (annotated load-in)
  const rollerY = 38;
  const wedgeX = mainX;
  const wedgeY = rollerY;

  return [
    // ─── Left wing (CAD: bar + restrooms) ─────────────────────────
    {
      id: "bar-zone",
      type: "bar-zone",
      x: 0,
      y: 2,
      width: leftWingWidth,
      height: 18,
      label: "Bar",
    },
    {
      id: "restrooms",
      type: "restroom",
      x: 0,
      y: 22,
      width: leftWingWidth,
      height: 24,
      label: "Restrooms",
    },
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
      y: 48,
      width: leftWingWidth - 2,
      height: 12,
      label: "UP 14 TREADS",
    },

    // ─── Corridor between wing and main hall (CAD shaded strip) ──
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
      y: 10,
      width: 1,
      height: 6,
      label: "Double Doors",
      wall: "right",
      doorKind: "double",
    },
    {
      id: "corridor-door-bottom",
      type: "door",
      x: leftWingWidth + corridorWidth - 0.5,
      y: 62,
      width: 1,
      height: 4,
      label: "Service Door",
      wall: "right",
      doorKind: "service",
    },

    // ─── Right shaded zone (CAD right block) ─────────────────────
    {
      id: "right-shade",
      type: "shaded-zone",
      x: mainRight,
      y: 0,
      width: rightShadeWidth,
      height: bottomRightY,
      label: "Greenroom / Utility",
    },
    {
      id: "right-stairs",
      type: "stairs",
      x: mainRight + 1,
      y: 4,
      width: rightShadeWidth - 2,
      height: 10,
      label: "Stairs",
    },

    // ─── Top of main hall — double doors to upper area (CAD) ─────
    {
      id: "top-double-doors",
      type: "door",
      x: mainX + mainWidth / 2 - 3,
      y: 0,
      width: 6,
      height: 1,
      label: "Double Doors (6 ft)",
      wall: "top",
      doorKind: "top",
    },

    // ─── Sound booth — top-right inside main hall ─────────────────
    {
      id: "sound-zone",
      type: "sound-zone",
      x: mainRight - 8,
      y: 2,
      width: 8,
      height: 6,
      label: "Sound (6 ft)",
    },

    // ─── Columns (CAD dashed, near top of main hall) ──────────────
    {
      id: "column-1",
      type: "column",
      x: mainX + 6,
      y: 10,
      width: 2,
      height: 2,
      label: "",
    },
    {
      id: "column-2",
      type: "column",
      x: mainX + mainWidth / 2 - 1,
      y: 10,
      width: 2,
      height: 2,
      label: "",
    },
    {
      id: "column-3",
      type: "column",
      x: mainRight - 8,
      y: 10,
      width: 2,
      height: 2,
      label: "",
    },

    // ─── Roller door + load-in wedge — LEFT wall ──────────────────
    {
      id: "roller-door",
      type: "door",
      x: mainX - 0.5,
      y: rollerY,
      width: 1,
      height: specs.bayDoorWidth,
      label: "Roller Door (12 ft)",
      wall: "left",
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

    // ─── Exits per annotated plan ────────────────────────────────
    {
      id: "exit-right-top",
      type: "door",
      x: mainRight - 0.5,
      y: 14,
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
      y: bottomLeftY - 14,
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

    // ─── Bottom exit with stairs (CAD bottom center-right) ────────
    {
      id: "bottom-stairs",
      type: "stairs",
      x: mainX + mainWidth - 12,
      y: bottomRightY - 8,
      width: 8,
      height: 6,
      label: "Exit Stairs",
    },
    {
      id: "bottom-exit",
      type: "door",
      x: mainX + mainWidth - 10,
      y: bottomRightY - 1,
      width: 6,
      height: 1,
      label: "Public Exit",
      wall: "bottom",
      doorKind: "double",
    },

    // ─── Stage & video wall (bottom / back wall) ───────────────────
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
      x: mainX + 4,
      y: 28,
      width: 28,
      height: 4,
      label: "PERFORMANCE VENUE · 620+ standing / 350 seated",
    },
    {
      id: "label-rink-floor",
      type: "label",
      x: mainX + 4,
      y: 34,
      width: 30,
      height: 3,
      label: "Original 1926 Roller Skating Rink Floor",
    },
  ];
}

export function getPerformanceFloorOffset(): number {
  return 0;
}
