"use client";

import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "@/stores/editor-store";
import type { FloorObject, ItemCategory } from "@/types";
import { TRS_LAYOUT, getPerformanceFloorPoints, getVenueOutlinePoints } from "@/lib/trs-floor-plan";
import { TRS_MAIN_FLOOR } from "@/lib/trs-inventory";

export function RoomView3D() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    x: number;
    y: number;
    yaw: number;
    pitch: number;
    zoom: number;
    panX: number;
    panY: number;
    moved: boolean;
  } | null>(null);
  const [pxPerFoot, setPxPerFoot] = useState(4);

  const objects = useEditorStore((state) => state.objects);
  const selectionIds = useEditorStore((state) => state.selectionIds);
  const buildMode = useEditorStore((state) => state.buildMode);
  const cameraTool = useEditorStore((state) => state.cameraTool);
  const orbit = useEditorStore((state) => state.orbit);
  const setOrbit = useEditorStore((state) => state.setOrbit);
  const setCameraTool = useEditorStore((state) => state.setCameraTool);
  const resetOrbit = useEditorStore((state) => state.resetOrbit);
  const selectObject = useEditorStore((state) => state.selectObject);

  const floorW = TRS_LAYOUT.totalWidth;
  const floorH = TRS_LAYOUT.totalHeight;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const fit = () => {
      const pad = 72;
      const next = Math.min(
        (viewport.clientWidth - pad) / floorW,
        (viewport.clientHeight - pad) / floorH
      );
      setPxPerFoot(Math.max(1.5, next));
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [floorW, floorH]);

  const scale = pxPerFoot;
  const stageY =
    TRS_MAIN_FLOOR.lengthLeft - TRS_MAIN_FLOOR.stageOffsetBack - TRS_LAYOUT.stageDepth;
  const stageX = TRS_LAYOUT.mainX + TRS_MAIN_FLOOR.stageOffsetSide;
  const stageW = TRS_LAYOUT.mainWidth - TRS_MAIN_FLOOR.stageOffsetSide * 2;

  return (
    <div
      ref={viewportRef}
      className="absolute inset-0 cursor-grab overflow-hidden bg-gradient-to-b from-surface-800 to-surface-950 active:cursor-grabbing"
      style={{ perspective: "1100px", touchAction: "none" }}
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest("[data-furniture], [data-camera-controls]")) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = {
          x: event.clientX,
          y: event.clientY,
          yaw: orbit.yaw,
          pitch: orbit.pitch,
          zoom: orbit.zoom,
          panX: orbit.panX,
          panY: orbit.panY,
          moved: false,
        };
      }}
      onPointerMove={(event) => {
        const drag = dragRef.current;
        if (!drag) return;
        const dx = event.clientX - drag.x;
        const dy = event.clientY - drag.y;
        if (Math.hypot(dx, dy) > 3) drag.moved = true;
        const slide = cameraTool === "slide" || event.shiftKey;
        if (slide) {
          setOrbit({
            yaw: drag.yaw,
            pitch: drag.pitch,
            zoom: drag.zoom,
            panX: drag.panX + dx,
            panY: drag.panY + dy,
          });
          return;
        }
        setOrbit({
          yaw: drag.yaw + dx * 0.35,
          pitch: Math.max(28, Math.min(78, drag.pitch - dy * 0.22)),
          zoom: drag.zoom,
          panX: drag.panX,
          panY: drag.panY,
        });
      }}
      onPointerUp={() => {
        const drag = dragRef.current;
        dragRef.current = null;
        if (drag && !drag.moved && buildMode === "design") selectObject(null);
      }}
    >
      <div
        data-camera-controls
        className="absolute left-3 top-3 z-20 flex items-center gap-1 rounded-full bg-black/50 p-1 text-[10px] text-white backdrop-blur-sm"
      >
        <CameraChip active={cameraTool === "orbit"} onClick={() => setCameraTool("orbit")}>
          Orbit
        </CameraChip>
        <CameraChip active={cameraTool === "slide"} onClick={() => setCameraTool("slide")}>
          Slide
        </CameraChip>
        <button
          type="button"
          onClick={resetOrbit}
          className="rounded-full px-2 py-1 text-white/80 hover:bg-white/10"
        >
          Reset
        </button>
      </div>

      <div
        className="absolute left-1/2 top-[46%]"
        style={{
          transformStyle: "preserve-3d",
          transform: `translate(${orbit.panX}px, ${orbit.panY}px) scale(${orbit.zoom}) rotateX(${orbit.pitch}deg) rotateZ(${orbit.yaw}deg)`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: floorW * scale,
            height: floorH * scale,
            marginLeft: -(floorW * scale) / 2,
            marginTop: -(floorH * scale) / 2,
            transformStyle: "preserve-3d",
          }}
        >
          <FloorSlab
            points={getVenueOutlinePoints()}
            scale={scale}
            color="#d6d3d1"
          />
          <FloorSlab
            points={getPerformanceFloorPoints()}
            scale={scale}
            color="#e7e5e4"
          />
          <div
            style={{
              position: "absolute",
              left: stageX * scale,
              top: stageY * scale,
              width: stageW * scale,
              height: TRS_LAYOUT.stageDepth * scale,
              background: "#44403c",
              transform: "translateZ(10px)",
            }}
          />

          {objects.map((object) => (
            <FurniturePrism
              key={object.id}
              object={object}
              scale={scale}
              selected={selectionIds.includes(object.id)}
              interactive={buildMode === "design"}
              onSelect={(additive) => selectObject(object.id, { additive })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CameraChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-white px-2 py-1 font-medium text-surface-900"
          : "rounded-full px-2 py-1 text-white/80 hover:bg-white/10"
      }
    >
      {children}
    </button>
  );
}

function FloorSlab({
  points,
  scale,
  color,
}: {
  points: number[];
  scale: number;
  color: string;
}) {
  const polygon = [];
  for (let index = 0; index < points.length; index += 2) {
    polygon.push(`${points[index] * scale}px ${points[index + 1] * scale}px`);
  }
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: color,
        clipPath: `polygon(${polygon.join(", ")})`,
      }}
    />
  );
}

function furnitureHeightFt(itemType: string, category: ItemCategory): number {
  if (itemType.includes("stool") || itemType.includes("cocktail")) return 3.5;
  if (itemType.includes("chair")) return 3;
  if (itemType.includes("stanchion")) return 3.2;
  if (itemType.includes("stage")) return 1.5;
  if (itemType.includes("couch") || itemType.includes("ottoman") || itemType.includes("bench")) return 2.4;
  if (category === "TABLES") return 2.5;
  return 2;
}

function FurniturePrism({
  object,
  scale,
  selected,
  interactive,
  onSelect,
}: {
  object: FloorObject;
  scale: number;
  selected: boolean;
  interactive: boolean;
  onSelect: (additive: boolean) => void;
}) {
  const width = object.width * scale;
  const depth = object.height * scale;
  const height = furnitureHeightFt(object.itemType, object.category) * scale;
  const top = mixColor(object.color, 24);
  const side = mixColor(object.color, -28);
  const round =
    object.itemType.includes("round") ||
    object.itemType.includes("cocktail") ||
    object.itemType.includes("stanchion");

  return (
    <div
      data-furniture
      onClick={(event) => {
        event.stopPropagation();
        if (!interactive) return;
        onSelect(event.shiftKey);
      }}
      style={{
        position: "absolute",
        left: object.x * scale,
        top: object.y * scale,
        width,
        height: depth,
        transform: `rotateZ(${object.rotation}deg)`,
        transformStyle: "preserve-3d",
        cursor: interactive ? "pointer" : "default",
      }}
    >
      <Face
        style={{
          inset: 0,
          background: top,
          borderRadius: round ? "50%" : 3,
          transform: `translateZ(${height}px)`,
          outline: selected ? "2px solid #748ffc" : "none",
        }}
      />
      <Face
        style={{
          left: 0,
          top: 0,
          width,
          height,
          background: side,
          transformOrigin: "top",
          transform: "rotateX(90deg)",
        }}
      />
      <Face
        style={{
          left: 0,
          top: depth,
          width,
          height,
          background: side,
          transformOrigin: "top",
          transform: "rotateX(-90deg)",
        }}
      />
      <Face
        style={{
          left: 0,
          top: 0,
          width: height,
          height: depth,
          background: mixColor(object.color, -40),
          transformOrigin: "left",
          transform: "rotateY(-90deg)",
        }}
      />
      <Face
        style={{
          left: width,
          top: 0,
          width: height,
          height: depth,
          background: mixColor(object.color, -16),
          transformOrigin: "left",
          transform: "rotateY(-90deg)",
        }}
      />
    </div>
  );
}

function Face({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: "absolute", transformStyle: "preserve-3d", ...style }} />;
}

function mixColor(hex: string, amount: number): string {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;
  const value = Number.parseInt(full, 16);
  if (Number.isNaN(value)) return hex;
  const channel = (shift: number) =>
    Math.max(0, Math.min(255, ((value >> shift) & 255) + amount));
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
}
