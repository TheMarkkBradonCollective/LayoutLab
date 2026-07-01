import type { VenueData, LayoutData, FloorObject, LiveUser } from "@/types";
import {
  TRS_MAIN_FLOOR,
  TRS_UNIT,
  buildTrsStructuralFixtures,
} from "@/lib/trs-inventory";
import { generateId } from "@/lib/utils";

export const TRS_VENUE_ID = "venue-the-rink-studios";

export const DEMO_VENUE: VenueData = {
  id: TRS_VENUE_ID,
  name: "The Rink Studios",
  address: "The Rink Studios",
  capacity: 400,
  unit: TRS_UNIT,
  rooms: [
    {
      id: "room-main-floor",
      name: "Main Floor",
      width: TRS_MAIN_FLOOR.width,
      height: TRS_MAIN_FLOOR.lengthLeft,
      capacity: 400,
      unit: TRS_UNIT,
      notes: `Left wall: ${TRS_MAIN_FLOOR.lengthLeft} ft · Right wall: ${TRS_MAIN_FLOOR.lengthRight} ft`,
    },
  ],
};

function fixturesToObjects(): FloorObject[] {
  return buildTrsStructuralFixtures().map((fixture) => ({
    id: generateId(),
    itemName: fixture.itemName,
    itemType: fixture.itemType,
    category: fixture.category,
    x: fixture.x,
    y: fixture.y,
    width: fixture.width,
    height: fixture.height,
    rotation: 0,
    locked: fixture.locked,
    color: fixture.color,
  }));
}

/** Sample concert layout: structural fixtures + representative furniture. */
export const DEMO_EVENT_OBJECTS: FloorObject[] = [
  ...fixturesToObjects(),
  {
    id: "obj-merch-1",
    itemName: "Merch Table (8 ft)",
    itemType: "merch-8ft",
    category: "TABLES",
    x: 4,
    y: 25,
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
    x: 14,
    y: 25,
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
    x: 6,
    y: 40,
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
    x: 10,
    y: 40,
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
    x: 20,
    y: 50,
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
    x: 20,
    y: 55,
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
    x: 3,
    y: 12,
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
    x: 31,
    y: 12,
    width: 1,
    height: 1,
    rotation: 0,
    locked: false,
    color: "#D4D4D8",
  },
];

export const DEMO_EMPTY_OBJECTS: FloorObject[] = fixturesToObjects();

export const DEMO_LAYOUT: LayoutData = {
  id: "layout-concert-on-ice",
  name: "Concert on Ice",
  description: "Main floor with stage, exits, bay door, and sample furniture",
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
