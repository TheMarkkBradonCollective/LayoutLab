import type { TrsFloorSpecs } from "./trs-inventory";
import { TRS_MAIN_FLOOR } from "./trs-inventory";

export type FloorPlanElementType =
  | "stage-zone"
  | "door"
  | "ramp"
  | "wall-opening";

export interface FloorPlanElement {
  id: string;
  type: FloorPlanElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  /** Which wall this element sits on */
  wall?: "back" | "front" | "left" | "right";
  /** Offset along the wall in feet from the wall origin */
  alongWall?: number;
}

/**
 * TRS main floor — trapezoid room.
 * Origin (0,0) = back-left corner.
 * Left wall runs 90 ft, right wall runs 84 ft, back wall is 35 ft wide.
 */
export interface TrsRoomGeometry {
  backLeft: { x: number; y: number };
  backRight: { x: number; y: number };
  frontRight: { x: number; y: number };
  frontLeft: { x: number; y: number };
  width: number;
  lengthLeft: number;
  lengthRight: number;
}

export function getTrsRoomGeometry(
  specs: TrsFloorSpecs = TRS_MAIN_FLOOR
): TrsRoomGeometry {
  return {
    backLeft: { x: 0, y: 0 },
    backRight: { x: specs.width, y: 0 },
    frontRight: { x: specs.width, y: specs.lengthRight },
    frontLeft: { x: 0, y: specs.lengthLeft },
    width: specs.width,
    lengthLeft: specs.lengthLeft,
    lengthRight: specs.lengthRight,
  };
}

/**
 * Fixed architectural elements — always rendered as part of the floor plan,
 * never as draggable furniture inventory items.
 */
export function buildTrsFloorPlan(
  specs: TrsFloorSpecs = TRS_MAIN_FLOOR
): FloorPlanElement[] {
  const stageWidth = specs.width - specs.stageOffsetSide * 2;
  const stageHeight = 4;

  // Bay door on front wall near the right (loading area)
  const bayDoorStart = specs.width - specs.bayDoorWidth - 2;

  return [
    {
      id: "stage-zone",
      type: "stage-zone",
      x: specs.stageOffsetSide,
      y: specs.stageOffsetBack,
      width: stageWidth,
      height: stageHeight,
      label: "Stage",
      wall: "back",
    },
    {
      id: "bay-door",
      type: "door",
      x: bayDoorStart,
      y: specs.lengthRight - 0.5,
      width: specs.bayDoorWidth,
      height: 1,
      label: "Bay Door (12 ft)",
      wall: "front",
      alongWall: bayDoorStart,
    },
    {
      id: "bay-ramp",
      type: "ramp",
      x: bayDoorStart - 0.5,
      y: specs.lengthRight - specs.rampDepth - 0.5,
      width: specs.rampWidth,
      height: specs.rampDepth,
      label: "Ramp (11 × 13 ft)",
    },
    {
      id: "double-exit",
      type: "door",
      x: -0.5,
      y: 38,
      width: 1,
      height: specs.doubleExitWidth,
      label: "Double Exit (6 ft)",
      wall: "left",
      alongWall: 38,
    },
    {
      id: "emergency-exit",
      type: "door",
      x: specs.width - 0.5,
      y: 12,
      width: 1,
      height: specs.emergencyExitWidth,
      label: "Emergency Exit (4 ft)",
      wall: "right",
      alongWall: 12,
    },
  ];
}

/** Room outline as polygon points in feet (closed shape). */
export function getRoomOutlinePoints(
  specs: TrsFloorSpecs = TRS_MAIN_FLOOR
): number[] {
  const g = getTrsRoomGeometry(specs);
  return [
    g.backLeft.x,
    g.backLeft.y,
    g.backRight.x,
    g.backRight.y,
    g.frontRight.x,
    g.frontRight.y,
    g.frontLeft.x,
    g.frontLeft.y,
  ];
}
