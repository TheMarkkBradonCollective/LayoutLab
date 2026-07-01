import type { ItemCategory } from "@/types";

/** All TRS floor-plan dimensions are stored in feet. */
export const TRS_UNIT = "ft" as const;
export const PIXELS_PER_FOOT = 11;

export interface TrsFloorSpecs {
  width: number;
  lengthLeft: number;
  lengthRight: number;
  bayDoorWidth: number;
  rampWidth: number;
  rampDepth: number;
  emergencyExitWidth: number;
  doubleExitWidth: number;
  stageOffsetBack: number;
  stageOffsetSide: number;
}

export const TRS_MAIN_FLOOR: TrsFloorSpecs = {
  width: 35,
  lengthLeft: 90,
  lengthRight: 84,
  bayDoorWidth: 12,
  rampWidth: 11,
  rampDepth: 13,
  emergencyExitWidth: 4,
  doubleExitWidth: 6,
  stageOffsetBack: 3,
  stageOffsetSide: 3.5,
};

export interface TrsFurnitureItem {
  id: string;
  name: string;
  category: ItemCategory;
  width: number;
  height: number;
  quantity: number;
  color: string;
  shape: "circle" | "rectangle";
  capacity?: number;
}

/** Complete TRS furniture inventory — dimensions in feet. */
export const TRS_FURNITURE: TrsFurnitureItem[] = [
  // Tables
  {
    id: "cocktail-short",
    name: "Short Round Cocktail Table",
    category: "TABLES",
    width: 2,
    height: 2,
    quantity: 21,
    color: "#A0826D",
    shape: "circle",
  },
  {
    id: "cocktail-tall",
    name: "Tall Round Cocktail Table",
    category: "TABLES",
    width: 2,
    height: 2,
    quantity: 8,
    color: "#8B7355",
    shape: "circle",
  },
  {
    id: "merch-8ft",
    name: "Merch Table (8 ft)",
    category: "TABLES",
    width: 8,
    height: 2.5,
    quantity: 8,
    color: "#6B7280",
    shape: "rectangle",
  },
  {
    id: "merch-6ft",
    name: "Merch Table (6 ft)",
    category: "TABLES",
    width: 6,
    height: 2.5,
    quantity: 3,
    color: "#6B7280",
    shape: "rectangle",
  },
  {
    id: "merch-6ft-narrow",
    name: "Merch Table (6 ft × 18 in)",
    category: "TABLES",
    width: 6,
    height: 1.5,
    quantity: 5,
    color: "#78716C",
    shape: "rectangle",
  },
  {
    id: "merch-5ft",
    name: "Merch Table (5 ft)",
    category: "TABLES",
    width: 5,
    height: 2.5,
    quantity: 2,
    color: "#78716C",
    shape: "rectangle",
  },

  // Seating
  {
    id: "stool-tall-square",
    name: "Tall Square Stool",
    category: "SEATING",
    width: 1,
    height: 1,
    quantity: 11,
    color: "#4A5568",
    shape: "rectangle",
  },
  {
    id: "stool-tall-round",
    name: "Tall Round Stool",
    category: "SEATING",
    width: 14 / 12,
    height: 14 / 12,
    quantity: 20,
    color: "#4A5568",
    shape: "circle",
  },
  {
    id: "stool-small-round",
    name: "Small Round Stool",
    category: "SEATING",
    width: 16 / 12,
    height: 16 / 12,
    quantity: 21,
    color: "#718096",
    shape: "circle",
  },
  {
    id: "chair-gray",
    name: "Gray Chair",
    category: "SEATING",
    width: 20 / 12,
    height: 18 / 12,
    quantity: 350,
    color: "#9CA3AF",
    shape: "rectangle",
    capacity: 1,
  },
  {
    id: "bench-ada",
    name: "ADA Bench",
    category: "SEATING",
    width: 12,
    height: 2,
    quantity: 1,
    color: "#2563EB",
    shape: "rectangle",
    capacity: 4,
  },
  {
    id: "couch-small",
    name: "Small Couch",
    category: "SEATING",
    width: 4,
    height: 2.5,
    quantity: 9,
    color: "#6366F1",
    shape: "rectangle",
    capacity: 3,
  },
  {
    id: "couch-curved-silver",
    name: "Curved Silver Couch",
    category: "SEATING",
    width: 5.5,
    height: 3,
    quantity: 2,
    color: "#C0C0C0",
    shape: "rectangle",
    capacity: 4,
  },
  {
    id: "ottoman-curved-leather",
    name: "Curved Leather Ottoman",
    category: "SEATING",
    width: 6,
    height: 2.5,
    quantity: 2,
    color: "#92400E",
    shape: "rectangle",
    capacity: 3,
  },
  {
    id: "couch-white-leather",
    name: "White Leather Couch",
    category: "SEATING",
    width: 8,
    height: 2.5,
    quantity: 1,
    color: "#F3F4F6",
    shape: "rectangle",
    capacity: 4,
  },
  {
    id: "couch-green",
    name: "Green Couch",
    category: "SEATING",
    width: 6,
    height: 2.5,
    quantity: 1,
    color: "#166534",
    shape: "rectangle",
    capacity: 3,
  },

  // Equipment
  {
    id: "stage-platform",
    name: "Stage Platform",
    category: "EQUIPMENT",
    width: 8,
    height: 4,
    quantity: 15,
    color: "#1E293B",
    shape: "rectangle",
  },
  {
    id: "stanchion-round",
    name: "Round Stanchion",
    category: "EQUIPMENT",
    width: 1,
    height: 1,
    quantity: 8,
    color: "#D4D4D8",
    shape: "circle",
  },

  // Structural / fixed (quantity 1 each — placed as room fixtures)
  {
    id: "fixture-bay-door",
    name: "Bay Door",
    category: "DECOR",
    width: 12,
    height: 1,
    quantity: 1,
    color: "#57534E",
    shape: "rectangle",
  },
  {
    id: "fixture-ramp",
    name: "Bay Door Ramp",
    category: "DECOR",
    width: 11,
    height: 13,
    quantity: 1,
    color: "#A8A29E",
    shape: "rectangle",
  },
  {
    id: "fixture-emergency-exit",
    name: "Emergency Exit",
    category: "DECOR",
    width: 4,
    height: 1,
    quantity: 1,
    color: "#DC2626",
    shape: "rectangle",
  },
  {
    id: "fixture-double-exit",
    name: "Double Exit Doors",
    category: "DECOR",
    width: 6,
    height: 1,
    quantity: 1,
    color: "#DC2626",
    shape: "rectangle",
  },
];

export function getStageArea(specs: TrsFloorSpecs = TRS_MAIN_FLOOR) {
  return {
    x: specs.stageOffsetSide,
    y: specs.stageOffsetBack,
    width: specs.width - specs.stageOffsetSide * 2,
    height: 4,
  };
}

/** Locked structural fixtures mapped to the main floor plan. */
export function buildTrsStructuralFixtures(
  specs: TrsFloorSpecs = TRS_MAIN_FLOOR
) {
  const length = specs.lengthLeft;
  const stage = getStageArea(specs);

  return [
    {
      itemType: "fixture-bay-door",
      itemName: "Bay Door",
      category: "DECOR" as ItemCategory,
      x: specs.width - specs.bayDoorWidth,
      y: length - 20,
      width: specs.bayDoorWidth,
      height: 1,
      color: "#57534E",
      locked: true,
    },
    {
      itemType: "fixture-ramp",
      itemName: "Bay Door Ramp",
      category: "DECOR" as ItemCategory,
      x: specs.width - specs.rampWidth - 1,
      y: length - specs.rampDepth - 20,
      width: specs.rampWidth,
      height: specs.rampDepth,
      color: "#A8A29E",
      locked: true,
    },
    {
      itemType: "fixture-double-exit",
      itemName: "Double Exit Doors",
      category: "DECOR" as ItemCategory,
      x: 0,
      y: 40,
      width: 1,
      height: specs.doubleExitWidth,
      color: "#DC2626",
      locked: true,
    },
    {
      itemType: "fixture-emergency-exit",
      itemName: "Emergency Exit",
      category: "DECOR" as ItemCategory,
      x: specs.width - 1,
      y: 15,
      width: 1,
      height: specs.emergencyExitWidth,
      color: "#DC2626",
      locked: true,
    },
    {
      itemType: "stage-platform",
      itemName: "Stage Platform",
      category: "EQUIPMENT" as ItemCategory,
      x: stage.x,
      y: stage.y,
      width: stage.width,
      height: stage.height,
      color: "#1E293B",
      locked: true,
    },
  ];
}

export const TRS_INVENTORY_SUMMARY = {
  totalFurniturePieces: TRS_FURNITURE.reduce((sum, item) => sum + item.quantity, 0),
  itemTypes: TRS_FURNITURE.length,
};
