import type { VenueData, LayoutData, FloorObject, LiveUser } from "@/types";
import { TRS_MAIN_FLOOR, TRS_UNIT } from "@/lib/trs-inventory";
import { TRS_LAYOUT, getPerformanceFloorOffset } from "@/lib/trs-floor-plan";

export const TRS_VENUE_ID = "venue-the-rink-studios";

const FLOOR_Y = getPerformanceFloorOffset();

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
      notes: `Performance floor ${TRS_MAIN_FLOOR.width}×${TRS_MAIN_FLOOR.lengthLeft} ft · 350 seated`,
    },
  ],
};

/** Movable furniture only — architecture is on the floor plan layer. */
export const DEMO_EVENT_OBJECTS: FloorObject[] = [
  {
    id: "obj-merch-1",
    itemName: "Merch Table (8 ft)",
    itemType: "merch-8ft",
    category: "TABLES",
    x: 14,
    y: FLOOR_Y + 30,
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
    x: 24,
    y: FLOOR_Y + 30,
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
    x: 16,
    y: FLOOR_Y + 45,
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
    x: 20,
    y: FLOOR_Y + 45,
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
    x: 30,
    y: FLOOR_Y + 55,
    width: 6,
    height: 2.5,
    rotation: 0,
    locked: false,
    color: "#166534",
    capacity: 3,
  },
  {
    id: "obj-couch-white",
    itemName: "White Leather Couch",
    itemType: "couch-white-leather",
    category: "SEATING",
    x: 30,
    y: FLOOR_Y + 60,
    width: 8,
    height: 2.5,
    rotation: 0,
    locked: false,
    color: "#F3F4F6",
    capacity: 4,
  },
  {
    id: "obj-stanchion-1",
    itemName: "Round Stanchion",
    itemType: "stanchion-round",
    category: "EQUIPMENT",
    x: 13,
    y: FLOOR_Y + 15,
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
    x: 41,
    y: FLOOR_Y + 15,
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
