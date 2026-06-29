import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_FURNITURE = [
  { name: "Round Table (60\")", category: "TABLES" as const, width: 1.5, height: 1.5, depth: 0.75, capacity: 8, color: "#8B7355" },
  { name: "Chair", category: "SEATING" as const, width: 0.5, height: 0.5, depth: 0.9, color: "#4A5568" },
  { name: "Stage", category: "EQUIPMENT" as const, width: 4, height: 2.5, depth: 1.2, color: "#2D3748" },
  { name: "Plant", category: "DECOR" as const, width: 0.6, height: 0.6, depth: 1.2, color: "#276749" },
];

async function main() {
  console.log("Seeding database...");

  const user = await prisma.user.upsert({
    where: { email: "sarah@grandballroom.com" },
    update: {},
    create: {
      email: "sarah@grandballroom.com",
      name: "Sarah Chen",
    },
  });

  const mike = await prisma.user.upsert({
    where: { email: "mike@grandballroom.com" },
    update: {},
    create: {
      email: "mike@grandballroom.com",
      name: "Mike Johnson",
    },
  });

  const venue = await prisma.venue.upsert({
    where: { id: "venue-grand-ballroom" },
    update: {},
    create: {
      id: "venue-grand-ballroom",
      name: "Grand Ballroom",
      address: "123 Event Plaza, San Francisco, CA",
      capacity: 500,
      ownerId: user.id,
      rooms: {
        create: [
          { id: "room-main-hall", name: "Main Hall", width: 20, height: 15, capacity: 300 },
          { id: "room-patio", name: "Patio", width: 12, height: 8, capacity: 80 },
          { id: "room-vip", name: "VIP Room", width: 8, height: 6, capacity: 40 },
          { id: "room-lobby", name: "Lobby", width: 10, height: 6, capacity: 80 },
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

  const mainHall = venue.rooms.find((r) => r.name === "Main Hall")!;

  const layout = await prisma.layout.upsert({
    where: { id: "layout-wedding" },
    update: {},
    create: {
      id: "layout-wedding",
      name: "Wedding Setup",
      description: "Standard wedding reception layout",
      venueId: venue.id,
      roomId: mainHall.id,
      creatorId: user.id,
      objects: {
        create: [
          { itemName: "Stage", itemType: "stage", category: "EQUIPMENT", x: 7, y: 1, width: 4, height: 2.5, color: "#2D3748" },
          { itemName: "Dance Floor", itemType: "dance-floor", category: "EQUIPMENT", x: 6, y: 5, width: 4, height: 4, color: "#2B6CB0" },
          { itemName: "Bar", itemType: "bar", category: "EQUIPMENT", x: 16, y: 2, width: 3, height: 0.8, color: "#744210" },
          { itemName: "Round Table (60\")", itemType: "round-table-60", category: "TABLES", x: 2, y: 4, width: 1.5, height: 1.5, color: "#8B7355", capacity: 8 },
          { itemName: "Round Table (60\")", itemType: "round-table-60", category: "TABLES", x: 2, y: 8, width: 1.5, height: 1.5, color: "#8B7355", capacity: 8 },
          { itemName: "DJ Booth", itemType: "dj-booth", category: "EQUIPMENT", x: 12, y: 1.5, width: 2, height: 1, color: "#1A202C" },
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
