import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const layout = await prisma.layout.findUnique({
    where: { id },
    include: {
      objects: true,
      versions: { orderBy: { version: "desc" }, take: 10 },
      creator: { select: { id: true, name: true } },
    },
  });

  if (!layout) {
    return NextResponse.json({ error: "Layout not found" }, { status: 404 });
  }

  return NextResponse.json(layout);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { objects, creatorId, label } = body;

  const layout = await prisma.layout.findUnique({
    where: { id },
    include: { objects: true, versions: { orderBy: { version: "desc" }, take: 1 } },
  });

  if (!layout) {
    return NextResponse.json({ error: "Layout not found" }, { status: 404 });
  }

  const nextVersion = (layout.versions[0]?.version ?? 0) + 1;

  const updated = await prisma.$transaction(async (tx) => {
    await tx.layoutObject.deleteMany({ where: { layoutId: id } });

    if (objects?.length) {
      await tx.layoutObject.createMany({
        data: objects.map((obj: Record<string, unknown>) => ({
          layoutId: id,
          itemName: obj.itemName as string,
          itemType: obj.itemType as string,
          category: obj.category as string,
          x: obj.x as number,
          y: obj.y as number,
          width: obj.width as number,
          height: obj.height as number,
          rotation: (obj.rotation as number) ?? 0,
          locked: (obj.locked as boolean) ?? false,
          color: (obj.color as string) ?? "#6366f1",
          capacity: obj.capacity as number | undefined,
        })),
      });
    }

    await tx.layoutVersion.create({
      data: {
        layoutId: id,
        version: nextVersion,
        label: label ?? `Version ${nextVersion}`,
        snapshot: JSON.stringify(objects),
        creatorId: creatorId ?? layout.creatorId,
      },
    });

    return tx.layout.findUnique({
      where: { id },
      include: { objects: true, versions: { orderBy: { version: "desc" }, take: 5 } },
    });
  });

  return NextResponse.json(updated);
}
