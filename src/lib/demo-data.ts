import type { VenueData, LayoutData, FloorObject, LiveUser } from "@/types";
import { TRS_MAIN_FLOOR, TRS_UNIT } from "@/lib/trs-inventory";
import { TRS_LAYOUT, getHallBounds } from "@/lib/trs-floor-plan";

export const TRS_VENUE_ID = "venue-the-rink-studios";

const HALL = getHallBounds();

export const DEMO_VENUE: VenueData = {
  id: TRS_VENUE_ID,
  name: "The Rink Studios",
  address: "The Rink Studios",
  capacity: 620,
  unit: TRS_UNIT,
  rooms: [
    {
      id: "room-main-floor",
      name: "Performance Venue",
      width: TRS_LAYOUT.totalWidth,
      height: TRS_LAYOUT.totalHeight,
      capacity: 620,
      unit: TRS_UNIT,
      notes: `Plan view · ${TRS_MAIN_FLOOR.width}×${TRS_MAIN_FLOOR.lengthLeft} ft hall · L wall 90 ft · R wall 84 ft (entering from top)`,
    },
  ],
};

const MX = TRS_LAYOUT.mainX;

/** Movable furniture — placed on the main performance hall only. */
export const DEMO_EVENT_OBJECTS: FloorObject[] = [
  {
    id: "obj-merch-1",
    itemName: "Merch Table (8 ft)",
    itemType: "merch-8ft",
    category: "TABLES",
    x: MX + 4,
    y: 42,
    width: 8,
    height: 2.5,
    rotation: 0,
    locked: false,
    color: "#6B7280",
  },
  {
    id: "obj-merch-2",
    itemName: "Merch Table (8 ft)",
    itemType: "merch-8ft",
    category: "TABLES",
    x: MX + 16,
    y: 42,
    width: 8,
    height: 2.5,
    rotation: 0,
    locked: false,
    color: "#6B7280",
  },
  {
    id: "obj-cocktail-1",
    itemName: "Tall Round Cocktail Table",
    itemType: "cocktail-tall",
    category: "TABLES",
    x: MX + 8,
    y: 52,
    width: 2,
    height: 2,
    rotation: 0,
    locked: false,
    color: "#8B7355",
  },
  {
    id: "obj-cocktail-2",
    itemName: "Short Round Cocktail Table",
    itemType: "cocktail-short",
    category: "TABLES",
    x: MX + 14,
    y: 52,
    width: 2,
    height: 2,
    rotation: 0,
    locked: false,
    color: "#A0826D",
  },
  {
    id: "obj-couch-green",
    itemName: "Green Couch",
    itemType: "couch-green",
    category: "SEATING",
    x: MX + 20,
    y: 58,
    width: 6,
    height: 2.5,
    rotation: 0,
    locked: false,
    color: "#166534",
    capacity: 3,
  },
  {
    id: "obj-stanchion-1",
    itemName: "Round Stanchion",
    itemType: "stanchion-round",
    category: "EQUIPMENT",
    x: MX + 3,
    y: 20,
    width: 1,
    height: 1,
    rotation: 0,
    locked: false,
    color: "#D4D4D8",
  },
  {
    id: "obj-stanchion-2",
    itemName: "Round Stanchion",
    itemType: "stanchion-round",
    category: "EQUIPMENT",
    x: MX + 30,
    y: 20,
    width: 1,
    height: 1,
    rotation: 0,
    locked: false,
    color: "#D4D4D8",
  },
];

export const DEMO_EMPTY_OBJECTS: FloorObject[] = [];

export const DEMO_LAYOUT: LayoutData = {
  id: "layout-concert-on-ice",
  name: "Concert on Ice",
  description: "Performance venue with sample furniture placement",
  roomId: "room-main-floor",
  venueId: TRS_VENUE_ID,
  objects: DEMO_EVENT_OBJECTS,
  version: 1,
};

export const DEMO_LIVE_USERS: LiveUser[] = [
  { id: "user-sarah", name: "Sarah", status: "editing", color: "#4c6ef5" },
  { id: "user-mike", name: "Mike", status: "editing", color: "#22c55e" },
  { id: "user-john", name: "John", status: "viewing", color: "#f59e0b" },
];

/** Center of main hall for dropping new items */
export function getDefaultDropPosition() {
  return {
    x: (HALL.minX + HALL.maxX) / 2,
    y: (HALL.minY + HALL.maxY) / 2,
  };
}
