"use client";

import { Line, Rect, Text, Group, Arc } from "react-konva";
import {
  buildTrsFloorPlan,
  getRoomOutlinePoints,
  type FloorPlanElement,
} from "@/lib/trs-floor-plan";
import { PIXELS_PER_FOOT } from "@/lib/trs-inventory";

interface FloorPlanLayerProps {
  offsetX: number;
  offsetY: number;
}

export function FloorPlanLayer({ offsetX, offsetY }: FloorPlanLayerProps) {
  const elements = buildTrsFloorPlan();
  const outline = getRoomOutlinePoints();
  const px = (v: number) => v * PIXELS_PER_FOOT;

  const scaledOutline = outline.map((v, i) =>
    i % 2 === 0 ? offsetX + px(v) : offsetY + px(v)
  );

  return (
    <Group listening={false}>
      {/* Room fill — trapezoid */}
      <Line
        points={scaledOutline}
        closed
        fill="#f5f5f4"
        stroke="#78716c"
        strokeWidth={3}
      />

      {/* Architectural elements */}
      {elements.map((el) => (
        <FloorPlanElementShape
          key={el.id}
          element={el}
          offsetX={offsetX}
          offsetY={offsetY}
        />
      ))}

      {/* Wall labels */}
      <Text
        x={offsetX + px(35 / 2) - 20}
        y={offsetY - 14}
        text="BACK WALL"
        fontSize={8}
        fill="#a8a29e"
        fontStyle="bold"
      />
      <Text
        x={offsetX - 52}
        y={offsetY + px(45)}
        text="LEFT (90 ft)"
        fontSize={8}
        fill="#a8a29e"
        rotation={-90}
      />
      <Text
        x={offsetX + px(35) + 6}
        y={offsetY + px(42)}
        text="RIGHT (84 ft)"
        fontSize={8}
        fill="#a8a29e"
        rotation={90}
      />
    </Group>
  );
}

function FloorPlanElementShape({
  element,
  offsetX,
  offsetY,
}: {
  element: FloorPlanElement;
  offsetX: number;
  offsetY: number;
}) {
  const px = (v: number) => v * PIXELS_PER_FOOT;
  const x = offsetX + px(element.x);
  const y = offsetY + px(element.y);
  const w = px(element.width);
  const h = px(element.height);

  switch (element.type) {
    case "stage-zone":
      return (
        <Group>
          <Rect
            x={x}
            y={y}
            width={w}
            height={h}
            fill="#1e293b"
            opacity={0.15}
            stroke="#1e293b"
            strokeWidth={1.5}
            dash={[6, 4]}
          />
          <Text
            x={x}
            y={y + h / 2 - 5}
            width={w}
            align="center"
            text={element.label}
            fontSize={10}
            fill="#1e293b"
            fontStyle="bold"
          />
          <Text
            x={x}
            y={y + h / 2 + 6}
            width={w}
            align="center"
            text={'3 ft from back · 3\'6" from sides'}
            fontSize={7}
            fill="#64748b"
          />
        </Group>
      );

    case "ramp":
      return (
        <Group>
          <Rect
            x={x}
            y={y}
            width={w}
            height={h}
            fill="#d6d3d1"
            opacity={0.6}
            stroke="#78716c"
            strokeWidth={1}
          />
          {/* Hatch lines */}
          {Array.from({ length: Math.floor(element.width) }, (_, i) => (
            <Line
              key={i}
              points={[x + (i * w) / element.width, y, x + ((i + 1) * w) / element.width, y + h]}
              stroke="#a8a29e"
              strokeWidth={0.5}
            />
          ))}
          <Text
            x={x + 2}
            y={y + h / 2 - 4}
            text={element.label}
            fontSize={7}
            fill="#57534e"
          />
        </Group>
      );

    case "door":
      return (
        <DoorSymbol
          element={element}
          x={x}
          y={y}
          w={w}
          h={h}
        />
      );

    default:
      return null;
  }
}

function DoorSymbol({
  element,
  x,
  y,
  w,
  h,
}: {
  element: FloorPlanElement;
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  const isVertical = element.wall === "left" || element.wall === "right";
  const doorColor = "#dc2626";
  const openingColor = "#fafaf9";

  if (isVertical) {
    const doorW = Math.max(h, 8);
    const doorH = Math.max(w, 4);

    return (
      <Group>
        {/* Wall opening cut */}
        <Rect
          x={element.wall === "left" ? x - 1 : x}
          y={y}
          width={doorH + 2}
          height={doorW}
          fill={openingColor}
          stroke={doorColor}
          strokeWidth={2}
        />
        {/* Door swing arc */}
        <Arc
          x={element.wall === "left" ? x + doorH : x}
          y={y}
          innerRadius={0}
          outerRadius={doorW}
          angle={90}
          rotation={element.wall === "left" ? 0 : 180}
          stroke={doorColor}
          strokeWidth={1}
          dash={[3, 3]}
        />
        <Text
          x={element.wall === "left" ? x + doorH + 4 : x - 60}
          y={y + doorW / 2 - 4}
          text={element.label}
          fontSize={7}
          fill={doorColor}
          width={58}
        />
      </Group>
    );
  }

  // Horizontal door (bay door on front wall)
  const doorW = Math.max(w, 12);
  const doorH = Math.max(h, 4);

  return (
    <Group>
      <Rect
        x={x}
        y={y - 1}
        width={doorW}
        height={doorH + 2}
        fill={openingColor}
        stroke="#57534e"
        strokeWidth={2}
      />
      {/* Roll-up bay door lines */}
      {Array.from({ length: 5 }, (_, i) => (
        <Line
          key={i}
          points={[x + 4 + i * (doorW / 5), y, x + 4 + i * (doorW / 5), y + doorH]}
          stroke="#57534e"
          strokeWidth={0.75}
        />
      ))}
      <Text
        x={x}
        y={y + doorH + 3}
        width={doorW}
        align="center"
        text={element.label}
        fontSize={7}
        fill="#57534e"
      />
    </Group>
  );
}
