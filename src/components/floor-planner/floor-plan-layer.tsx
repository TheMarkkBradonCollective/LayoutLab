"use client";

import { Line, Rect, Text, Group, Arc } from "react-konva";
import {
  buildTrsFloorPlan,
  getVenueOutlinePoints,
  getPerformanceFloorPoints,
  TRS_LAYOUT,
  type FloorPlanElement,
} from "@/lib/trs-floor-plan";
import { PIXELS_PER_FOOT } from "@/lib/trs-inventory";

interface FloorPlanLayerProps {
  offsetX: number;
  offsetY: number;
}

export function FloorPlanLayer({ offsetX, offsetY }: FloorPlanLayerProps) {
  const elements = buildTrsFloorPlan();
  const venueOutline = getVenueOutlinePoints();
  const performanceFloor = getPerformanceFloorPoints();
  const px = (v: number) => v * PIXELS_PER_FOOT;

  const scalePoints = (pts: number[]) =>
    pts.map((v, i) => (i % 2 === 0 ? offsetX + px(v) : offsetY + px(v)));

  return (
    <Group listening={false}>
      {/* Full venue outline */}
      <Line
        points={scalePoints(venueOutline)}
        closed
        fill="#fafaf9"
        stroke="#57534e"
        strokeWidth={2.5}
      />

      {/* Performance floor — slightly different fill */}
      <Line
        points={scalePoints(performanceFloor)}
        closed
        fill="#f5f5f4"
        stroke="#a8a29e"
        strokeWidth={1}
      />

      {/* Corridor between wing and main hall */}
      <Line
        points={scalePoints([
          TRS_LAYOUT.leftWingWidth + TRS_LAYOUT.corridorWidth,
          0,
          TRS_LAYOUT.leftWingWidth + TRS_LAYOUT.corridorWidth,
          TRS_LAYOUT.totalHeight,
        ])}
        stroke="#d6d3d1"
        strokeWidth={1}
      />

      {elements.map((el) => (
        <FloorPlanElementShape
          key={el.id}
          element={el}
          offsetX={offsetX}
          offsetY={offsetY}
        />
      ))}

      {/* Dimension annotations */}
      <Text
        x={offsetX + px(TRS_LAYOUT.mainX + TRS_LAYOUT.mainWidth / 2) - 14}
        y={offsetY - 14}
        text="ENTRANCE / TOP"
        fontSize={8}
        fill="#a8a29e"
        fontStyle="bold"
      />
      <Text
        x={offsetX - 58}
        y={offsetY + px(50)}
        text="LEFT 90 ft"
        fontSize={8}
        fill="#a8a29e"
        rotation={-90}
      />
      <Text
        x={offsetX + px(TRS_LAYOUT.mainRight) + 6}
        y={offsetY + px(48)}
        text="RIGHT 84 ft"
        fontSize={8}
        fill="#a8a29e"
        rotation={90}
      />
      <Text
        x={offsetX + px(TRS_LAYOUT.mainX + TRS_LAYOUT.mainWidth / 2) - 10}
        y={offsetY + px(TRS_LAYOUT.totalHeight) + 8}
        text="STAGE"
        fontSize={8}
        fill="#a8a29e"
        fontStyle="bold"
      />
      <Text
        x={offsetX + px(TRS_LAYOUT.totalWidth / 2) - 12}
        y={offsetY + px(TRS_LAYOUT.totalHeight) + 20}
        text={`${TRS_LAYOUT.mainWidth} ft wide`}
        fontSize={9}
        fill="#a8a29e"
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
    case "bar-zone":
      return (
        <Group>
          <Rect x={x} y={y} width={w} height={h} fill="#fef08a" opacity={0.55} stroke="#ca8a04" strokeWidth={1.5} />
          <Text x={x} y={y + h / 2 - 10} width={w} align="center" text={element.label} fontSize={11} fill="#713f12" fontStyle="bold" />
          <Text x={x} y={y + h / 2 + 2} width={w} align="center" text="24 ft" fontSize={8} fill="#92400e" />
        </Group>
      );

    case "sound-zone":
      return (
        <Group>
          <Rect x={x} y={y} width={w} height={h} fill="#fde68a" opacity={0.7} stroke="#ca8a04" strokeWidth={1.5} />
          <Text x={x} y={y + h / 2 - 4} width={w} align="center" text={element.label} fontSize={9} fill="#713f12" fontStyle="bold" />
          <Text x={x} y={y + h / 2 + 8} width={w} align="center" text="6 ft" fontSize={7} fill="#92400e" />
        </Group>
      );

    case "stage-zone":
      return (
        <Group>
          <Rect x={x} y={y} width={w} height={h} fill="#fef08a" opacity={0.5} stroke="#1e293b" strokeWidth={2} />
          <Text x={x} y={y + h / 2 - 8} width={w} align="center" text={element.label} fontSize={11} fill="#1e293b" fontStyle="bold" />
          <Text x={x} y={y + h / 2 + 4} width={w} align="center" text={'3 ft from wall · 3\'6" sides'} fontSize={7} fill="#64748b" />
        </Group>
      );

    case "video-wall":
      return (
        <Group>
          <Rect x={x} y={y} width={w} height={h} fill="#3b82f6" opacity={0.2} stroke="#2563eb" strokeWidth={1.5} dash={[4, 3]} />
          <Text x={x} y={y + h / 2 - 4} width={w} align="center" text={element.label} fontSize={8} fill="#1d4ed8" fontStyle="bold" />
        </Group>
      );

    case "column":
      return (
        <Rect x={x} y={y} width={w} height={h} fill="#d6d3d1" stroke="#a8a29e" strokeWidth={1} dash={[2, 2]} />
      );

    case "shaded-zone":
      return (
        <Group>
          <Rect x={x} y={y} width={w} height={h} fill="#78716c" opacity={0.22} />
          {element.label && (
            <Text x={x + 2} y={y + 4} width={w - 4} text={element.label} fontSize={7} fill="#57534e" />
          )}
        </Group>
      );

    case "corridor":
      return (
        <Rect x={x} y={y} width={w} height={h} fill="#78716c" opacity={0.12} stroke="#a8a29e" strokeWidth={0.5} />
      );

    case "stairs":
      return (
        <Group>
          <Rect x={x} y={y} width={w} height={h} fill="#e7e5e4" stroke="#a8a29e" strokeWidth={1} />
          {Array.from({ length: 6 }, (_, i) => (
            <Line
              key={i}
              points={[x, y + (i * h) / 6, x + w, y + (i * h) / 6]}
              stroke="#a8a29e"
              strokeWidth={0.75}
            />
          ))}
          <Text x={x} y={y + h + 2} width={w} align="center" text={element.label} fontSize={6} fill="#78716c" />
        </Group>
      );

    case "restroom":
      return (
        <Group>
          <Rect x={x} y={y} width={w} height={h} fill="#e0f2fe" opacity={0.5} stroke="#7dd3fc" strokeWidth={1} />
          <Text x={x} y={y + 4} width={w} align="center" text={element.label} fontSize={7} fill="#0369a1" />
          {[0, 1, 2].map((i) => (
            <Rect
              key={i}
              x={x + px(2 + i * 3)}
              y={y + px(10)}
              width={px(2.5)}
              height={px(3)}
              fill="#bae6fd"
              stroke="#38bdf8"
              strokeWidth={0.5}
            />
          ))}
        </Group>
      );

    case "label":
      return (
        <Text x={x} y={y} width={px(element.width)} text={element.label} fontSize={8} fill="#78716c" fontStyle="italic" />
      );

    case "ramp":
      return (
        <Group>
          <Rect x={x} y={y} width={w} height={h} fill="#d6d3d1" opacity={0.65} stroke="#78716c" strokeWidth={1.5} />
          {Array.from({ length: Math.min(8, Math.floor(element.width)) }, (_, i) => (
            <Line
              key={i}
              points={[x + (i * w) / 8, y, x + ((i + 1) * w) / 8, y + h]}
              stroke="#a8a29e"
              strokeWidth={0.5}
            />
          ))}
          <Text x={x + 2} y={y + 4} width={w - 4} text={element.label} fontSize={6} fill="#44403c" />
        </Group>
      );

    case "door":
      return <DoorSymbol element={element} x={x} y={y} w={w} h={h} />;

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
  const pxf = (v: number) => v * PIXELS_PER_FOOT;
  const isVertical = element.wall === "left" || element.wall === "right";
  const isExit = element.doorKind === "exit" || element.doorKind === "double";
  const doorColor = isExit ? "#dc2626" : element.doorKind === "roller" ? "#57534e" : "#78716c";
  const openingColor = "#fafaf9";

  if (element.doorKind === "vestibule") {
    return (
      <Group>
        <Rect x={x} y={y} width={w} height={pxf(3)} fill={openingColor} stroke={doorColor} strokeWidth={2} />
        <Text x={x} y={y + pxf(3) + 2} width={w} align="center" text={element.label} fontSize={6} fill="#57534e" />
      </Group>
    );
  }

  if (isVertical) {
    const doorW = Math.max(h, 6);
    const doorH = Math.max(w, 3);

    return (
      <Group>
        <Rect
          x={element.wall === "left" ? x - 1 : x}
          y={y}
          width={doorH + 2}
          height={doorW}
          fill={openingColor}
          stroke={doorColor}
          strokeWidth={2}
        />
        {element.doorKind === "roller" &&
          Array.from({ length: 4 }, (_, i) => (
            <Line
              key={i}
              points={[
                element.wall === "left" ? x + doorH : x,
                y + 2 + i * (doorW / 4),
                element.wall === "left" ? x : x + doorH,
                y + 2 + i * (doorW / 4),
              ]}
              stroke="#57534e"
              strokeWidth={0.75}
            />
          ))}
        {element.doorKind !== "roller" && (
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
        )}
        <Text
          x={element.wall === "left" ? x + doorH + 3 : x - pxf(8)}
          y={y + doorW / 2 - 6}
          text={element.label}
          fontSize={6}
          fill={doorColor}
          width={pxf(8)}
        />
      </Group>
    );
  }

  const doorW = Math.max(w, 8);
  const doorH = Math.max(h, 3);

  return (
    <Group>
      <Rect x={x} y={y - 1} width={doorW} height={doorH + 2} fill={openingColor} stroke={doorColor} strokeWidth={2} />
      <Text x={x} y={y + doorH + 2} width={doorW} align="center" text={element.label} fontSize={6} fill={doorColor} />
    </Group>
  );
}
