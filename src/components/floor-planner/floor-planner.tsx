"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { Stage, Layer, Rect, Group, Text, Line } from "react-konva";
import type Konva from "konva";
import { useEditorStore } from "@/stores/editor-store";
import type { FloorObject } from "@/types";
import { PIXELS_PER_FOOT, TRS_FURNITURE, TRS_MAIN_FLOOR } from "@/lib/trs-inventory";
import { TRS_LAYOUT, getCanvasPadLeft, getCanvasPadTop } from "@/lib/trs-floor-plan";
import { getDefaultDropPosition } from "@/lib/demo-data";
import {
  VENUE_ITEM_DRAG_TYPE,
  buildPlacement,
  clampToHall,
  clientToPlanFeet,
} from "@/lib/room-placement";
import { FloorPlanLayer } from "./floor-plan-layer";
import { RoomView3D } from "./room-view-3d";
import { DesignDock, RoomHint, SelectionToolbar } from "./design-chrome";

const PAD_LEFT = getCanvasPadLeft();
const PAD_TOP = getCanvasPadTop();
const PAD_RIGHT = 20;
const PAD_BOTTOM = 28;
const ROOM_WIDTH = TRS_LAYOUT.totalWidth;
const ROOM_HEIGHT = TRS_LAYOUT.totalHeight;

export function FloorPlanner() {
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const planWrapRef = useRef<HTMLDivElement>(null);
  const panDrag = useRef<{ x: number; y: number; ox: number; oy: number; moved: boolean } | null>(null);
  const suppressClear = useRef(false);
  const zoomRef = useRef(1);
  const [mounted, setMounted] = useState(false);
  const {
    objects,
    selectionIds,
    zoom,
    panOffset,
    showGrid,
    gridSize,
    buildMode,
    is3DMode,
    isSimulationMode,
    selectObject,
    pushHistory,
    translateObjects,
    removeSelected,
    rotateSelected,
    venue,
    setZoom,
    setPanOffset,
    setBuildMode,
    addObject,
    setOrbit,
    orbit,
    platform,
  } = useEditorStore();

  zoomRef.current = zoom;

  const room = venue?.rooms[0];
  const roomWidth = room?.width ?? ROOM_WIDTH;
  const roomHeight = room?.height ?? ROOM_HEIGHT;
  const stageWidth = roomWidth * PIXELS_PER_FOOT;
  const stageHeight = roomHeight * PIXELS_PER_FOOT;
  const canvasWidth = stageWidth + PAD_LEFT + PAD_RIGHT;
  const canvasHeight = stageHeight + PAD_TOP + PAD_BOTTOM;
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fitToView = () => {
      const container = containerRef.current;
      if (!container) return;

      const padding = platform === "mobile" ? 16 : 32;
      const availableW = container.clientWidth - padding;
      const availableH = container.clientHeight - padding;
      const fitZoom = Math.min(availableW / canvasWidth, availableH / canvasHeight) * 0.98;
      setZoom(Math.max(0.12, Math.min(1, fitZoom)));
    };

    fitToView();
    window.addEventListener("resize", fitToView);
    return () => window.removeEventListener("resize", fitToView);
  }, [mounted, canvasWidth, canvasHeight, platform, setZoom, room]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if (e.key === "Escape") {
        selectObject(null);
        return;
      }
      if (buildMode !== "design" || selectionIds.length === 0) return;

      const step = gridSize;
      const nudge = (dx: number, dy: number) => {
        pushHistory();
        translateObjects(selectionIds, dx, dy);
      };

      switch (e.key) {
        case "Delete":
        case "Backspace":
          removeSelected();
          break;
        case "ArrowLeft":
          nudge(-step, 0);
          break;
        case "ArrowRight":
          nudge(step, 0);
          break;
        case "ArrowUp":
          nudge(0, -step);
          break;
        case "ArrowDown":
          nudge(0, step);
          break;
        case "r":
        case "R":
          rotateSelected(45);
          break;
        default:
          return;
      }
      e.preventDefault();
    },
    [
      buildMode,
      selectionIds,
      gridSize,
      removeSelected,
      translateObjects,
      rotateSelected,
      pushHistory,
      selectObject,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const moveRoom = (clientX: number, clientY: number) => {
    const drag = panDrag.current;
    if (!drag || is3DMode) return;
    const dx = clientX - drag.x;
    const dy = clientY - drag.y;
    if (Math.hypot(dx, dy) > 3) drag.moved = true;
    setPanOffset({
      x: drag.ox + dx / zoomRef.current,
      y: drag.oy + dy / zoomRef.current,
    });
  };

  const placeDroppedItem = (event: React.DragEvent) => {
    if ((event.target as HTMLElement).closest("[data-design-dock], [data-selection-toolbar]")) return;
    const itemId =
      event.dataTransfer.getData(VENUE_ITEM_DRAG_TYPE) || event.dataTransfer.getData("text/plain");
    const item = TRS_FURNITURE.find((entry) => entry.id === itemId);
    if (!item) return;
    event.preventDefault();
    setBuildMode("design");

    if (is3DMode || !planWrapRef.current) {
      addObject(buildPlacement(item, getDefaultDropPosition()));
      return;
    }

    const rect = planWrapRef.current.getBoundingClientRect();
    const feet = clientToPlanFeet(
      event.clientX,
      event.clientY,
      rect,
      canvasWidth,
      canvasHeight,
      PAD_LEFT,
      PAD_TOP,
      PIXELS_PER_FOOT
    );
    addObject(buildPlacement(item, feet));
  };

  if (!mounted) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-surface-200">
        <p className="text-sm text-surface-500">Loading floor plan…</p>
      </div>
    );
  }

  const gridX = PAD_LEFT + TRS_LAYOUT.mainX * PIXELS_PER_FOOT;
  const gridY = PAD_TOP;
  const gridW = TRS_MAIN_FLOOR.width * PIXELS_PER_FOOT;
  const gridH = TRS_MAIN_FLOOR.lengthLeft * PIXELS_PER_FOOT;
  const designing = buildMode === "design" && !isSimulationMode;
  const hintMode = is3DMode
    ? buildMode === "design"
      ? "3d"
      : "preview-3d"
    : buildMode === "design"
      ? "plan"
      : "preview-plan";

  return (
    <div
      ref={containerRef}
      className="relative min-h-0 w-full flex-1 overflow-hidden bg-surface-200"
      onWheel={(event) => {
        if (isSimulationMode) return;
        if (is3DMode) {
          const next = orbit.zoom * (event.deltaY > 0 ? 0.92 : 1.08);
          setOrbit({ ...orbit, zoom: Math.min(2.6, Math.max(0.45, next)) });
          return;
        }
        setZoom(zoom * (event.deltaY > 0 ? 0.92 : 1.08));
      }}
      onDragOver={(event) => {
        if (isSimulationMode) return;
        event.preventDefault();
      }}
      onDrop={placeDroppedItem}
    >
      {isSimulationMode ? (
        <SimulationView roomWidth={roomWidth} roomHeight={roomHeight} objects={objects} />
      ) : is3DMode ? (
        <RoomView3D />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          onPointerDown={(event) => {
            if (event.target !== event.currentTarget) return;
            panDrag.current = {
              x: event.clientX,
              y: event.clientY,
              ox: panOffset.x,
              oy: panOffset.y,
              moved: false,
            };
          }}
          onPointerMove={(event) => moveRoom(event.clientX, event.clientY)}
          onPointerUp={() => {
            panDrag.current = null;
          }}
        >
        <div
          ref={planWrapRef}
          className="shadow-lg"
          style={{
            transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: "center center",
          }}
        >
          <Stage
            ref={stageRef}
            width={canvasWidth}
            height={canvasHeight}
            onMouseDown={(event) => {
              const stage = event.target.getStage();
              if (!stage || event.target !== stage) return;
              panDrag.current = {
                x: event.evt.clientX,
                y: event.evt.clientY,
                ox: panOffset.x,
                oy: panOffset.y,
                moved: false,
              };
            }}
            onMouseMove={(event) => moveRoom(event.evt.clientX, event.evt.clientY)}
            onMouseUp={() => {
              if (panDrag.current?.moved) suppressClear.current = true;
              panDrag.current = null;
            }}
            onClick={(event) => {
              if (suppressClear.current) {
                suppressClear.current = false;
                return;
              }
              if (event.target === event.target.getStage()) selectObject(null);
            }}
            onTap={(event) => {
              if (event.target === event.target.getStage()) selectObject(null);
            }}
          >
            <Layer>
              <FloorPlanLayer offsetX={PAD_LEFT} offsetY={PAD_TOP} />

              {showGrid && (
                <GridLines
                  x={gridX}
                  y={gridY}
                  width={gridW}
                  height={gridH}
                  gridSize={gridSize}
                />
              )}

              <Text
                x={PAD_LEFT + 4}
                y={4}
                text={room?.name ?? "Performance Venue"}
                fontSize={11}
                fill="#78716c"
                listening={false}
              />
              {room?.notes && (
                <Text
                  x={PAD_LEFT + 120}
                  y={4}
                  text={room.notes}
                  fontSize={9}
                  fill="#a8a29e"
                  listening={false}
                />
              )}

              {objects.map((obj) => (
                <FloorObjectShape
                  key={obj.id}
                  object={obj}
                  isSelected={selectionIds.includes(obj.id)}
                  pixelsPerFoot={PIXELS_PER_FOOT}
                  offsetX={PAD_LEFT}
                  offsetY={PAD_TOP}
                />
              ))}
            </Layer>
          </Stage>
        </div>
        </div>
      )}

      {!isSimulationMode && (is3DMode || !designing) && (
        <RoomHint
          mode={hintMode}
          className={is3DMode ? "top-3 right-3 left-auto" : "bottom-3"}
        />
      )}
      {designing && <SelectionToolbar />}
      {designing && <DesignDock />}

      {!is3DMode && !isSimulationMode && (
        <div className="pointer-events-none absolute right-3 top-3 z-20 rounded bg-white/80 px-2 py-1 text-[10px] text-surface-500 backdrop-blur-sm">
          Plan view · drag the floor to move the room · 1 grid = {gridSize} ft
        </div>
      )}
    </div>
  );
}

function GridLines({
  x,
  y,
  width,
  height,
  gridSize,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  gridSize: number;
}) {
  const lines: React.ReactNode[] = [];
  const spacing = gridSize * PIXELS_PER_FOOT;

  for (let gx = 0; gx <= width; gx += spacing) {
    lines.push(
      <Line
        key={`v-${gx}`}
        points={[x + gx, y, x + gx, y + height]}
        stroke="#e7e5e4"
        strokeWidth={gx % (spacing * 2) === 0 ? 1 : 0.5}
        listening={false}
      />
    );
  }
  for (let gy = 0; gy <= height; gy += spacing) {
    lines.push(
      <Line
        key={`h-${gy}`}
        points={[x, y + gy, x + width, y + gy]}
        stroke="#e7e5e4"
        strokeWidth={gy % (spacing * 2) === 0 ? 1 : 0.5}
        listening={false}
      />
    );
  }

  return <>{lines}</>;
}

function FloorObjectShape({
  object,
  isSelected,
  pixelsPerFoot,
  offsetX,
  offsetY,
}: {
  object: FloorObject;
  isSelected: boolean;
  pixelsPerFoot: number;
  offsetX: number;
  offsetY: number;
}) {
  const { tool, buildMode, selectionIds, selectObject, pushHistory, updateObject } =
    useEditorStore();
  const w = object.width * pixelsPerFoot;
  const h = object.height * pixelsPerFoot;
  const x = offsetX + object.x * pixelsPerFoot;
  const y = offsetY + object.y * pixelsPerFoot;
  const isRound =
    object.itemType.includes("round") ||
    object.itemType.includes("cocktail") ||
    object.itemType.includes("stanchion");
  const labelColor =
    object.color === "#F3F4F6" || object.color === "#C0C0C0" ? "#374151" : "white";
  const canEdit = buildMode === "design" && !object.locked && tool !== "pan";

  return (
    <Group
      x={x}
      y={y}
      rotation={object.rotation}
      offsetX={0}
      offsetY={0}
      draggable={canEdit}
      onClick={(event) => selectObject(object.id, { additive: event.evt.shiftKey })}
      onTap={(event) => selectObject(object.id, { additive: event.evt.shiftKey })}
      onDblClick={() => {
        if (!canEdit) return;
        pushHistory();
        updateObject(object.id, { rotation: (object.rotation + 45) % 360 });
      }}
      onDblTap={() => {
        if (!canEdit) return;
        pushHistory();
        updateObject(object.id, { rotation: (object.rotation + 45) % 360 });
      }}
      onMouseDown={(event) => {
        if (!canEdit) return;
        if (!selectionIds.includes(object.id)) {
          selectObject(object.id, { additive: event.evt.shiftKey });
        }
      }}
      onDragEnd={(event) => {
        const rawX = (event.target.x() - offsetX) / pixelsPerFoot;
        const rawY = (event.target.y() - offsetY) / pixelsPerFoot;
        const clamped = clampToHall(rawX, rawY, object.width, object.height);
        const dx = clamped.x - object.x;
        const dy = clamped.y - object.y;
        if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
        const current = useEditorStore.getState();
        const ids = current.selectionIds.includes(object.id) ? current.selectionIds : [object.id];
        current.pushHistory();
        current.translateObjects(ids, dx, dy);
      }}
    >
      <Rect
        width={w}
        height={h}
        fill={object.color}
        opacity={0.85}
        cornerRadius={isRound ? Math.min(w, h) / 2 : 3}
        stroke={isSelected ? "#4c6ef5" : object.locked ? "#ef4444" : "transparent"}
        strokeWidth={isSelected ? 2 : object.locked ? 1 : 0}
        shadowColor="rgba(0,0,0,0.15)"
        shadowBlur={4}
        shadowOffsetY={2}
      />
      <Text
        text={object.itemName}
        width={w}
        height={h}
        align="center"
        verticalAlign="middle"
        fontSize={Math.min(10, w / 4)}
        fill={labelColor}
        fontStyle="bold"
        listening={false}
      />
      {object.capacity && (
        <Text
          x={w - 14}
          y={2}
          text={String(object.capacity)}
          fontSize={8}
          fill={labelColor}
          opacity={0.8}
          listening={false}
        />
      )}
    </Group>
  );
}

function SimulationView({
  roomWidth,
  roomHeight,
  objects,
}: {
  roomWidth: number;
  roomHeight: number;
  objects: FloorObject[];
}) {
  const { isSimulationPlaying, simulationConfig } = useEditorStore();
  const scale = 8;
  const guestCount = simulationConfig?.guestCount ?? 50;

  const patrons = Array.from({ length: Math.min(guestCount, 100) }, (_, i) => ({
    id: i,
    x: Math.random() * roomWidth,
    y: Math.random() * roomHeight,
    color: ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7"][i % 5],
  }));

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-surface-900">
      <div
        className="relative border border-surface-600"
        style={{ width: roomWidth * scale, height: roomHeight * scale }}
      >
        <div className="absolute inset-0 bg-surface-800" />

        {objects.map((obj) => (
          <div
            key={obj.id}
            className="absolute opacity-40"
            style={{
              left: obj.x * scale,
              top: obj.y * scale,
              width: obj.width * scale,
              height: obj.height * scale,
              backgroundColor: obj.color,
              borderRadius: obj.category === "TABLES" ? "50%" : "2px",
            }}
          />
        ))}

        {isSimulationPlaying &&
          patrons.map((p) => (
            <div
              key={p.id}
              className="absolute h-1.5 w-1.5 rounded-full animate-pulse"
              style={{
                left: p.x * scale,
                top: p.y * scale,
                backgroundColor: p.color,
              }}
            />
          ))}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-black/60 px-4 py-2 text-center text-sm text-white backdrop-blur-sm">
        {isSimulationPlaying ? "Simulation running..." : "Press play to start simulation"}
      </div>
    </div>
  );
}
