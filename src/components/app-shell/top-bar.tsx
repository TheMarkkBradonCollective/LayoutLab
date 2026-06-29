"use client";

import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Box,
  Play,
  Share2,
  ChevronDown,
  Layers,
} from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { cn } from "@/lib/utils";

export function TopBar() {
  const {
    venue,
    currentLayout,
    zoom,
    setZoom,
    showGrid,
    is3DMode,
    isSimulationMode,
    toggle3DMode,
    toggleSimulationMode,
    undo,
    redo,
    history,
    historyIndex,
    platform,
  } = useEditorStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-surface-200 bg-white px-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-venue-600 text-xs font-bold text-white">
            MV
          </div>
          {platform !== "mobile" && (
            <span className="text-sm font-semibold text-surface-800">MyVenue</span>
          )}
        </div>

        {venue && (
          <>
            <div className="h-4 w-px bg-surface-200" />
            <button className="flex items-center gap-1 text-sm text-surface-700 hover:text-surface-900">
              <span className="font-medium">{venue.name}</span>
              <ChevronDown className="h-3.5 w-3.5 text-surface-400" />
            </button>
          </>
        )}

        {currentLayout && platform !== "mobile" && (
          <>
            <div className="h-4 w-px bg-surface-200" />
            <button className="flex items-center gap-1.5 text-sm text-surface-600 hover:text-surface-900">
              <Layers className="h-3.5 w-3.5" />
              <span>{currentLayout.name}</span>
              <ChevronDown className="h-3.5 w-3.5 text-surface-400" />
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-1">
        <ToolButton icon={Undo2} onClick={undo} disabled={!canUndo} title="Undo" />
        <ToolButton icon={Redo2} onClick={redo} disabled={!canRedo} title="Redo" />

        <div className="mx-1 h-4 w-px bg-surface-200" />

        <ToolButton
          icon={ZoomOut}
          onClick={() => setZoom(zoom - 0.25)}
          disabled={zoom <= 0.25}
          title="Zoom out"
        />
        <span className="min-w-[3rem] text-center text-xs text-surface-500">
          {Math.round(zoom * 100)}%
        </span>
        <ToolButton
          icon={ZoomIn}
          onClick={() => setZoom(zoom + 0.25)}
          disabled={zoom >= 4}
          title="Zoom in"
        />

        <div className="mx-1 h-4 w-px bg-surface-200" />

        <ToolButton
          icon={Grid3x3}
          active={showGrid}
          title="Toggle grid"
        />
        <ToolButton
          icon={Box}
          active={is3DMode}
          onClick={toggle3DMode}
          title="3D walkthrough"
        />
        <ToolButton
          icon={Play}
          active={isSimulationMode}
          onClick={toggleSimulationMode}
          title="Simulation mode"
        />

        {platform !== "mobile" && (
          <>
            <div className="mx-1 h-4 w-px bg-surface-200" />
            <button className="flex items-center gap-1.5 rounded-lg bg-venue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-venue-700">
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
          </>
        )}
      </div>
    </header>
  );
}

function ToolButton({
  icon: Icon,
  onClick,
  active,
  disabled,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
        active
          ? "bg-venue-100 text-venue-700"
          : "text-surface-500 hover:bg-surface-100 hover:text-surface-700",
        disabled && "cursor-not-allowed opacity-40"
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
