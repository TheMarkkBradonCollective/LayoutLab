import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const VENUE_ID = "venue-the-rink-studios";

const DEFAULT_FURNITURE = [
  { name: "Round Table (60\")", category: "TABLES" as const, width: 1.5, height: 1.5, depth: 0.75, capacity: 8, color: "#8B7355" },
  { name: "Chair", category: "SEATING" as const, width: 0.5, height: 0.5, depth: 0.9, color: "#4A5568" },
  { name: "Stage", category: "EQUIPMENT" as const, width: 4, height: 2.5, depth: 1.2, color: "#2D3748" },
  { name: "Plant", category: "DECOR" as const, width: 0.6, height: 0.6, depth: 1.2, color: "#276749" },
];

async function main() {
  console.log("Seeding database for The Rink Studios...");

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
    update: { name: "The Rink Studios" },
    create: {
      id: VENUE_ID,
      name: "The Rink Studios",
      address: "The Rink Studios",
      capacity: 400,
      ownerId: user.id,
      rooms: {
        create: [
          { id: "room-main-rink", name: "Main Rink", width: 30, height: 20, capacity: 250 },
          { id: "room-studio-floor", name: "Studio Floor", width: 15, height: 12, capacity: 80 },
          { id: "room-concessions", name: "Concessions", width: 10, height: 6, capacity: 40 },
          { id: "room-party-room", name: "Party Room", width: 8, height: 6, capacity: 30 },
        ],
      },
      members: {
        create: [
          { userId: user.id, role: "OWNER", canEdit: true, canSave: true, canDelete: true, canShare: true },
          { userId: mike.id, role: "MANAGER", canEdit: true, canSave: true, canDelete: true, canShare: true },
        ],
      },
      items: {
        create: DEFAULT_FURNITURE.map((item) => ({
          name: item.name,
          category: item.category,
          width: item.width,
          height: item.height,
          depth: item.depth,
          capacity: item.capacity,
          color: item.color,
        })),
      },
    },
    include: { rooms: true },
  });

  const mainRink = venue.rooms.find((r) => r.name === "Main Rink")!;

  const layout = await prisma.layout.upsert({
    where: { id: "layout-concert-on-ice" },
    update: { name: "Concert on Ice" },
    create: {
      id: "layout-concert-on-ice",
      name: "Concert on Ice",
      description: "Stage, dance floor, and concessions layout for Main Rink",
      venueId: venue.id,
      roomId: mainRink.id,
      creatorId: user.id,
      objects: {
        create: [
          { itemName: "Stage", itemType: "stage", category: "EQUIPMENT", x: 10, y: 1, width: 6, height: 3, color: "#2D3748" },
          { itemName: "Dance Floor", itemType: "dance-floor", category: "EQUIPMENT", x: 9, y: 8, width: 8, height: 6, color: "#2B6CB0" },
          { itemName: "Bar", itemType: "bar", category: "EQUIPMENT", x: 24, y: 2, width: 4, height: 0.8, color: "#744210" },
          { itemName: "Round Table (60\")", itemType: "round-table-60", category: "TABLES", x: 2, y: 5, width: 1.5, height: 1.5, color: "#8B7355", capacity: 8 },
          { itemName: "DJ Booth", itemType: "dj-booth", category: "EQUIPMENT", x: 18, y: 1.5, width: 2, height: 1, color: "#1A202C" },
        ],
      },
      versions: {
        create: {
          version: 1,
          label: "Initial setup",
          snapshot: "[]",
          creatorId: user.id,
        },
      },
    },
  });

  console.log(`Seeded venue: ${venue.name}`);
  console.log(`Seeded layout: ${layout.name}`);
  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
