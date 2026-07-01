import type { ItemCategory } from "@/types";

/** All TRS floor-plan dimensions are stored in feet. */
export const TRS_UNIT = "ft" as const;
export const PIXELS_PER_FOOT = 8;

/** Official TRS floor measurements (plan view, entering from main doors at top). */
export const TRS_FLOOR_MEASUREMENTS = {
  roomWidth: 35,
  leftWallLength: 90, // cleaning closet → back wall / stage
  rightWallLength: 84, // bar area → greenroom door
  bayDoorWidth: 12,
  rampWidth: 11,
  rampDepth: 13,
  emergencyExitWidth: 4,
  doubleExitWidth: 6,
  stageOffsetBack: 3,
  stageOffsetSide: 3.5, // 3 ft 6 in
  barSoundSpan: 24,
  soundDepth: 6,
  videoWallWidth: 20,
  videoWallHeight: 10,
} as const;

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
  width: TRS_FLOOR_MEASUREMENTS.roomWidth,
  lengthLeft: TRS_FLOOR_MEASUREMENTS.leftWallLength,
  lengthRight: TRS_FLOOR_MEASUREMENTS.rightWallLength,
  bayDoorWidth: TRS_FLOOR_MEASUREMENTS.bayDoorWidth,
  rampWidth: TRS_FLOOR_MEASUREMENTS.rampWidth,
  rampDepth: TRS_FLOOR_MEASUREMENTS.rampDepth,
  emergencyExitWidth: TRS_FLOOR_MEASUREMENTS.emergencyExitWidth,
  doubleExitWidth: TRS_FLOOR_MEASUREMENTS.doubleExitWidth,
  stageOffsetBack: TRS_FLOOR_MEASUREMENTS.stageOffsetBack,
  stageOffsetSide: TRS_FLOOR_MEASUREMENTS.stageOffsetSide,
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
  notes?: string;
}

/**
 * Complete TRS furniture inventory — official asset list.
 * Rectangles: width × height in feet. Circles: diameter stored as width & height.
 */
export const TRS_FURNITURE: TrsFurnitureItem[] = [
  // Tables — cocktail
  {
    id: "cocktail-short",
    name: "Short Round Cocktail Table",
    category: "TABLES",
    width: 2,
    height: 2,
    quantity: 21,
    color: "#A0826D",
    shape: "circle",
    notes: "2 ft diameter",
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
    notes: "2 ft diameter",
  },
  // Tables — merch
  {
    id: "merch-8ft",
    name: "Merch Table (8 ft)",
    category: "TABLES",
    width: 8,
    height: 2.5,
    quantity: 8,
    color: "#6B7280",
    shape: "rectangle",
    notes: "8 ft L × 2 ft 6 in W",
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
    notes: "6 ft L × 2 ft 6 in W",
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
    notes: "6 ft L × 1 ft 6 in W",
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
    notes: "5 ft L × 2 ft 6 in W",
  },
  // Seating — stools
  {
    id: "stool-tall-square",
    name: "Tall Square Stool",
    category: "SEATING",
    width: 1,
    height: 1,
    quantity: 11,
    color: "#4A5568",
    shape: "rectangle",
    notes: "1 ft × 1 ft",
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
    notes: "14 in diameter",
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
    notes: "1 ft 4 in diameter",
  },
  // Seating — chairs & benches
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
    notes: "1 ft 8 in W × 1 ft 6 in L",
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
    notes: "12 ft L × 2 ft W",
  },
  // Seating — couches & ottomans
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
    notes: "4 ft L × 2 ft 6 in W",
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
    notes: "5 ft 6 in L × 3 ft W",
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
    notes: "6 ft L × 2 ft 6 in W",
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
    notes: "8 ft L × 2 ft 6 in W",
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
    notes: "6 ft L × 2 ft 6 in W",
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
    notes: "8 ft L × 4 ft W",
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
    notes: "1 ft diameter",
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

export const TRS_INVENTORY_SUMMARY = {
  totalFurniturePieces: TRS_FURNITURE.reduce((sum, item) => sum + item.quantity, 0),
  itemTypes: TRS_FURNITURE.length,
  byCategory: {
    TABLES: TRS_FURNITURE.filter((i) => i.category === "TABLES").reduce((s, i) => s + i.quantity, 0),
    SEATING: TRS_FURNITURE.filter((i) => i.category === "SEATING").reduce((s, i) => s + i.quantity, 0),
    EQUIPMENT: TRS_FURNITURE.filter((i) => i.category === "EQUIPMENT").reduce((s, i) => s + i.quantity, 0),
  },
};
