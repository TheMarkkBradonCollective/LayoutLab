import { PrismaClient } from "@prisma/client";
import { TRS_FURNITURE, TRS_MAIN_FLOOR } from "../src/lib/trs-inventory";
import { TRS_LAYOUT } from "../src/lib/trs-floor-plan";

const prisma = new PrismaClient();

const VENUE_ID = "venue-the-rink-studios";

async function main() {
  console.log("Seeding The Rink Studios inventory...");

  const user = await prisma.user.upsert({
    where: { email: "sarah@therinkstudios.com" },
    update: {},
    create: {
      email: "sarah@therinkstudios.com",
      name: "Sarah Chen",
    },
  });

  const mike = await prisma.user.upsert({
    where: { email: "mike@therinkstudios.com" },
    update: {},
    create: {
      email: "mike@therinkstudios.com",
      name: "Mike Johnson",
    },
  });

  const venue = await prisma.venue.upsert({
    where: { id: VENUE_ID },
    update: {
      name: "The Rink Studios",
      capacity: 620,
    },
    create: {
      id: VENUE_ID,
      name: "The Rink Studios",
      address: "The Rink Studios",
      capacity: 620,
      ownerId: user.id,
      rooms: {
        create: [
          {
            id: "room-main-floor",
            name: "Performance Venue",
            width: TRS_LAYOUT.totalWidth,
            height: TRS_LAYOUT.totalHeight,
            capacity: 620,
          },
        ],
      },
      members: {
        create: [
          { userId: user.id, role: "OWNER", canEdit: true, canSave: true, canDelete: true, canShare: true },
          { userId: mike.id, role: "MANAGER", canEdit: true, canSave: true, canDelete: true, canShare: true },
        ],
      },
        items: {
        create: TRS_FURNITURE.map((item) => ({
          name: item.name,
          category: item.category,
          width: item.width,
          height: item.height,
          quantity: item.quantity,
          capacity: item.capacity,
          color: item.color,
        })),
      },
    },
    include: { rooms: true },
  });

  const mainFloor = venue.rooms.find((r) => r.name === "Performance Venue")!;

  const layout = await prisma.layout.upsert({
    where: { id: "layout-concert-on-ice" },
    update: { name: "Concert on Ice" },
    create: {
      id: "layout-concert-on-ice",
      name: "Concert on Ice",
      description: "Main floor with stage, exits, bay door, and sample furniture",
      venueId: venue.id,
      roomId: mainFloor.id,
      creatorId: user.id,
      objects: {
        create: [
          { itemName: "Merch Table (8 ft)", itemType: "merch-8ft", category: "TABLES", x: 4, y: 25, width: 8, height: 2.5, color: "#6B7280" },
          { itemName: "Green Couch", itemType: "couch-green", category: "SEATING", x: 20, y: 50, width: 6, height: 2.5, color: "#166534", capacity: 3 },
        ],
      },
      versions: {
        create: {
          version: 1,
          label: "Initial TRS inventory layout",
          snapshot: "[]",
          creatorId: user.id,
        },
      },
    },
  });

  console.log(`Seeded venue: ${venue.name}`);
  console.log(`Seeded ${TRS_FURNITURE.length} item types`);
  console.log(`Seeded layout: ${layout.name}`);
  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
