import type { TrsFloorSpecs } from "./trs-inventory";
import { TRS_FLOOR_MEASUREMENTS, TRS_MAIN_FLOOR } from "./trs-inventory";

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
 * Entering from main doors at the top of the plan, facing into the hall:
 *   LEFT WALL  (west)  — 90 ft: cleaning closet → back wall / stage
 *   RIGHT WALL (east)  — 84 ft: bar area → greenroom door
 *   Room width         — 35 ft between those walls
 *
 * Left wing (outside main hall): bar, sound, restrooms, cleaning closet
 * Main hall: open performance floor + stage at back (south on plan)
 * Bottom wall: bay door + load-in ramp (per CAD)
 */
export const TRS_LAYOUT = {
  leftWingWidth: 20,
  corridorWidth: 2,
  mainWidth: TRS_FLOOR_MEASUREMENTS.roomWidth,
  rightShadeWidth: 10,
  videoWall: {
    width: TRS_FLOOR_MEASUREMENTS.videoWallWidth,
    height: TRS_FLOOR_MEASUREMENTS.videoWallHeight,
  },
  stageDepth: 8,
  barSoundSpan: TRS_FLOOR_MEASUREMENTS.barSoundSpan,
  soundDepth: TRS_FLOOR_MEASUREMENTS.soundDepth,

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

/** Movable furniture bounds — main hall only, clear of stage */
export function getHallBounds(specs: TrsFloorSpecs = TRS_MAIN_FLOOR) {
  const { mainX, mainRight } = TRS_LAYOUT;
  const margin = 2;
  return {
    minX: mainX + margin,
    maxX: mainRight - margin,
    minY: 16,
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
    barSoundSpan,
    soundDepth,
  } = TRS_LAYOUT;

  const bottomLeftY = specs.lengthLeft;
  const bottomRightY = specs.lengthRight;

  const stageY = bottomLeftY - specs.stageOffsetBack - stageDepth;
  const stageX = mainX + specs.stageOffsetSide;
  const stageW = mainWidth - specs.stageOffsetSide * 2;
  const videoY = stageY - videoWall.height;
  const videoX = mainX + (mainWidth - videoWall.width) / 2;

  // Bay door + ramp on bottom wall (CAD) — ramp footprint inside hall
  const bayX = mainX + mainWidth / 2 - specs.bayDoorWidth / 2;
  const rampX = bayX + (specs.bayDoorWidth - specs.rampWidth) / 2;
  const rampY = bottomLeftY - specs.rampDepth;

  const barWidth = barSoundSpan - soundDepth;

  return [
    // ─── Left wing (outside main hall) — per CAD top-left cluster ──
    {
      id: "cleaning-closet",
      type: "shaded-zone",
      x: 0,
      y: 2,
      width: 8,
      height: 6,
      label: "Cleaning Closet",
    },
    {
      id: "sound-zone",
      type: "sound-zone",
      x: 0,
      y: 10,
      width: soundDepth,
      height: soundDepth,
      label: "Sound (6 ft)",
    },
    {
      id: "bar-zone",
      type: "bar-zone",
      x: soundDepth,
      y: 8,
      width: barWidth,
      height: 10,
      label: "Bar",
    },
    {
      id: "bar-leg",
      type: "bar-zone",
      x: 0,
      y: 18,
      width: 10,
      height: 8,
      label: "",
    },
    {
      id: "restrooms",
      type: "restroom",
      x: 0,
      y: 28,
      width: leftWingWidth,
      height: 22,
      label: "Restrooms",
    },
    {
      id: "wing-stairs",
      type: "stairs",
      x: 1,
      y: 52,
      width: leftWingWidth - 2,
      height: 14,
      label: "UP 14 TREADS",
    },
    {
      id: "vestibule",
      type: "door",
      x: 8,
      y: 0,
      width: leftWingWidth - 8,
      height: 2,
      label: "Vestibule",
      wall: "top",
      doorKind: "vestibule",
    },

    // ─── Corridor between left wing and main hall ──────────────────
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

    // ─── Main entrance — top center of hall (6 ft double doors) ────
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

    // ─── Right wing (outside main hall) — greenroom / utility ──────
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
      label: "Exit Stairs",
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

    // ─── Columns near entrance (CAD dashed) ────────────────────────
    {
      id: "column-1",
      type: "column",
      x: mainX + 5,
      y: 12,
      width: 2,
      height: 2,
      label: "",
    },
    {
      id: "column-2",
      type: "column",
      x: mainX + mainWidth / 2 - 1,
      y: 12,
      width: 2,
      height: 2,
      label: "",
    },
    {
      id: "column-3",
      type: "column",
      x: mainRight - 7,
      y: 12,
      width: 2,
      height: 2,
      label: "",
    },

    // ─── Bay door + ramp on bottom wall (CAD) ──────────────────────
    {
      id: "bay-door",
      type: "door",
      x: bayX,
      y: bottomLeftY - 0.5,
      width: specs.bayDoorWidth,
      height: 1,
      label: "Bay Door (12 ft)",
      wall: "bottom",
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

    // ─── Stage + video wall at back wall ───────────────────────────
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
      y: 30,
      width: 30,
      height: 4,
      label: "PERFORMANCE VENUE · 620+ standing / 350 seated",
    },
    {
      id: "label-rink-floor",
      type: "label",
      x: mainX + 3,
      y: 36,
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
