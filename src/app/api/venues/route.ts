import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const venues = await prisma.venue.findMany({
    include: {
      rooms: true,
      members: { include: { user: true } },
      _count: { select: { layouts: true, items: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(venues);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, address, capacity, ownerId } = body;

  if (!name || !ownerId) {
    return NextResponse.json({ error: "Name and ownerId are required" }, { status: 400 });
  }

  const venue = await prisma.venue.create({
    data: {
      name,
      address,
      capacity,
      ownerId,
      members: {
        create: { userId: ownerId, role: "OWNER", canEdit: true, canSave: true, canDelete: true, canShare: true },
      },
      rooms: {
        create: { name: "Main Rink", width: 30, height: 20 },
      },
    },
    include: { rooms: true, members: true },
  });

  return NextResponse.json(venue, { status: 201 });
}
