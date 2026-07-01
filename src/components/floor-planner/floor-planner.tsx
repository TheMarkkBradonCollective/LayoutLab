"use client";

import { useRef, useEffect, useCallback } from "react";
import { Stage, Layer, Rect, Group, Text, Line } from "react-konva";
import type Konva from "konva";
import { useEditorStore } from "@/stores/editor-store";
import type { FloorObject } from "@/types";
import { PIXELS_PER_FOOT } from "@/lib/trs-inventory";
import { TRS_LAYOUT } from "@/lib/trs-floor-plan";
import { FloorPlanLayer } from "./floor-plan-layer";

const ROOM_WIDTH = TRS_LAYOUT.totalWidth;
const ROOM_HEIGHT = TRS_LAYOUT.totalHeight;

export function FloorPlanner() {
  const stageRef = useRef<Konva.Stage>(null);
  const {
    objects,
    selectedObjectId,
    zoom,
    panOffset,
    showGrid,
    gridSize,
    tool,
    is3DMode,
    isSimulationMode,
    selectObject,
    updateObject,
    deleteObject,
    pushHistory,
    venue,
  } = useEditorStore();

  const room = venue?.rooms[0];
  const roomWidth = room?.width ?? ROOM_WIDTH;
  const roomHeight = room?.height ?? ROOM_HEIGHT;
  const stageWidth = roomWidth * PIXELS_PER_FOOT;
  const stageHeight = roomHeight * PIXELS_PER_FOOT;
  const unit = room?.unit ?? "ft";

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedObjectId) return;
      const obj = objects.find((o) => o.id === selectedObjectId);
      if (!obj || obj.locked) return;

      const step = gridSize;
      switch (e.key) {
        case "Delete":
        case "Backspace":
          deleteObject(selectedObjectId);
          break;
        case "ArrowLeft":
          updateObject(selectedObjectId, { x: obj.x - step });
          break;
        case "ArrowRight":
          updateObject(selectedObjectId, { x: obj.x + step });
          break;
        case "ArrowUp":
          updateObject(selectedObjectId, { y: obj.y - step });
          break;
        case "ArrowDown":
          updateObject(selectedObjectId, { y: obj.y + step });
          break;
        case "r":
        case "R":
          updateObject(selectedObjectId, { rotation: (obj.rotation + 15) % 360 });
          break;
        case "Escape":
          selectObject(null);
          break;
      }
    },
    [selectedObjectId, objects, gridSize, deleteObject, updateObject, selectObject]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleStageClick = () => {
    selectObject(null);
  };

  if (is3DMode) {
    return <Walkthrough3D roomWidth={roomWidth} roomHeight={roomHeight} objects={objects} />;
  }

  if (isSimulationMode) {
    return <SimulationView roomWidth={roomWidth} roomHeight={roomHeight} objects={objects} />;
  }

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-surface-200">
      <div
        className="shadow-lg"
        style={{
          transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          transformOrigin: "center center",
        }}
      >
        <Stage
          ref={stageRef}
          width={stageWidth + 40}
          height={stageHeight + 40}
          onClick={(e) => {
            if (e.target === e.target.getStage()) handleStageClick();
          }}
          onTap={(e) => {
            if (e.target === e.target.getStage()) handleStageClick();
          }}
        >
          <Layer>
            {/* Fixed floor plan: walls, doors, stage zone, ramp */}
            <FloorPlanLayer offsetX={20} offsetY={20} />

            {/* Grid over floor area */}
            {showGrid && <GridLines width={stageWidth} height={stageHeight} gridSize={gridSize} />}

            {/* Room label */}
            <Text
              x={20}
              y={4}
              text={room?.name ?? "Main Floor"}
              fontSize={11}
              fill="#78716c"
            />
            {room?.notes && (
              <Text
                x={20 + 80}
                y={4}
                text={room.notes}
                fontSize={9}
                fill="#a8a29e"
              />
            )}

            {/* Dimension labels */}
            <Text
              x={20 + stageWidth / 2 - 20}
              y={stageHeight + 24}
              text={`${roomWidth} ${unit}`}
              fontSize={10}
              fill="#a8a29e"
            />
            <Text
              x={4}
              y={20 + stageHeight / 2}
              text={`${roomHeight} ${unit}`}
              fontSize={10}
              fill="#a8a29e"
              rotation={-90}
            />

            {/* Floor objects */}
            {objects.map((obj) => (
              <FloorObjectShape
                key={obj.id}
                object={obj}
                isSelected={obj.id === selectedObjectId}
                pixelsPerFoot={PIXELS_PER_FOOT}
                offsetX={20}
                offsetY={20}
                onSelect={() => selectObject(obj.id)}
                onDragEnd={(x, y) => {
                  pushHistory();
                  updateObject(obj.id, { x, y });
                }}
                onRotate={() => {
                  pushHistory();
                  updateObject(obj.id, { rotation: (obj.rotation + 15) % 360 });
                }}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-3 right-3 rounded bg-white/80 px-2 py-1 text-[10px] text-surface-500 backdrop-blur-sm">
        1 grid = {gridSize} ft
      </div>
    </div>
  );
}

function GridLines({
  width,
  height,
  gridSize,
}: {
  width: number;
  height: number;
  gridSize: number;
}) {
  const lines: React.ReactNode[] = [];
  const spacing = gridSize * PIXELS_PER_FOOT;
  const offset = 20;

  for (let x = 0; x <= width; x += spacing) {
    lines.push(
      <Line
        key={`v-${x}`}
        points={[offset + x, offset, offset + x, offset + height]}
        stroke="#e7e5e4"
        strokeWidth={x % (spacing * 2) === 0 ? 1 : 0.5}
      />
    );
  }
  for (let y = 0; y <= height; y += spacing) {
    lines.push(
      <Line
        key={`h-${y}`}
        points={[offset, offset + y, offset + width, offset + y]}
        stroke="#e7e5e4"
        strokeWidth={y % (spacing * 2) === 0 ? 1 : 0.5}
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
  onSelect,
  onDragEnd,
  onRotate,
}: {
  object: FloorObject;
  isSelected: boolean;
  pixelsPerFoot: number;
  offsetX: number;
  offsetY: number;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onRotate: () => void;
}) {
  const { tool } = useEditorStore();
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

  return (
    <Group
      x={x}
      y={y}
      rotation={object.rotation}
      offsetX={0}
      offsetY={0}
      draggable={!object.locked && tool !== "pan"}
      onClick={onSelect}
      onTap={onSelect}
      onDblClick={onRotate}
      onDblTap={onRotate}
      onDragEnd={(e) => {
        const newX = (e.target.x() - offsetX) / pixelsPerFoot;
        const newY = (e.target.y() - offsetY) / pixelsPerFoot;
        onDragEnd(newX, newY);
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

function Walkthrough3D({
  roomWidth,
  roomHeight,
  objects,
}: {
  roomWidth: number;
  roomHeight: number;
  objects: FloorObject[];
}) {
  const scale = 8;
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-surface-800 to-surface-900 p-8">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-white">3D Walkthrough</h3>
        <p className="text-sm text-surface-400">
          Isometric preview — full 3D engine coming soon
        </p>
      </div>
      <div
        className="relative border border-surface-600 bg-surface-700/50"
        style={{
          width: roomWidth * scale,
          height: roomHeight * scale,
          transform: "perspective(600px) rotateX(45deg)",
          transformOrigin: "center center",
        }}
      >
        {objects.map((obj) => (
          <div
            key={obj.id}
            className="absolute flex items-center justify-center text-[8px] font-bold text-white"
            style={{
              left: obj.x * scale,
              top: obj.y * scale,
              width: obj.width * scale,
              height: obj.height * scale,
              backgroundColor: obj.color,
              opacity: 0.9,
              borderRadius: obj.category === "TABLES" ? "50%" : "2px",
              transform: `rotate(${obj.rotation}deg)`,
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
          >
            {obj.itemName.split(" ")[0]}
          </div>
        ))}
      </div>
    </div>
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
    <div className="relative flex flex-1 items-center justify-center bg-surface-900">
      <div
        className="relative border border-surface-600"
        style={{ width: roomWidth * scale, height: roomHeight * scale }}
      >
        {/* Room floor */}
        <div className="absolute inset-0 bg-surface-800" />

        {/* Static objects */}
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

        {/* Simulated patrons */}
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
