"use client";

import {
  Package,
  Wrench,
  LayoutGrid,
  Settings,
  Users,
  Share2,
  Play,
  X,
} from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { APP_SHELL_CONFIGS, type AppPanel } from "@/types";
import { cn } from "@/lib/utils";
import { ItemsPanel } from "@/components/panels/items-panel";
import { ToolsPanel } from "@/components/panels/tools-panel";
import { LayoutsPanel } from "@/components/panels/layouts-panel";
import { TeamPanel } from "@/components/panels/team-panel";
import { SimulationPanel } from "@/components/panels/simulation-panel";

const PANEL_CONFIG: Record<
  AppPanel,
  { icon: React.ComponentType<{ className?: string }>; label: string }
> = {
  items: { icon: Package, label: "Items" },
  tools: { icon: Wrench, label: "Tools" },
  layouts: { icon: LayoutGrid, label: "Layouts" },
  settings: { icon: Settings, label: "Settings" },
  team: { icon: Users, label: "Team" },
  share: { icon: Share2, label: "Share" },
  simulation: { icon: Play, label: "Simulation" },
};

export function SidePanel() {
  const { platform, activePanel, setActivePanel } = useEditorStore();
  const config = APP_SHELL_CONFIGS[platform];

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-surface-200 bg-white">
      <nav className="flex border-b border-surface-200">
        {config.enabledPanels.slice(0, 4).map((panel) => {
          const { icon: Icon, label } = PANEL_CONFIG[panel];
          return (
            <button
              key={panel}
              onClick={() => setActivePanel(activePanel === panel ? null : panel)}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                activePanel === panel
                  ? "border-b-2 border-venue-600 text-venue-700"
                  : "text-surface-500 hover:text-surface-700"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activePanel === "items" && <ItemsPanel />}
        {activePanel === "tools" && <ToolsPanel />}
        {activePanel === "layouts" && <LayoutsPanel />}
        {activePanel === "team" && <TeamPanel />}
        {activePanel === "simulation" && <SimulationPanel />}
        {activePanel === "settings" && (
          <div className="p-4 text-sm text-surface-500">Venue settings coming soon.</div>
        )}
        {activePanel === "share" && (
          <div className="p-4 text-sm text-surface-500">Share link management coming soon.</div>
        )}
        {!activePanel && (
          <div className="flex h-full items-center justify-center p-4 text-center text-sm text-surface-400">
            Select a panel above
          </div>
        )}
      </div>
    </aside>
  );
}

export function BottomPanel() {
  const { platform, activePanel, setActivePanel } = useEditorStore();
  const config = APP_SHELL_CONFIGS[platform];

  if (platform === "pc") return null;

  const panels = config.enabledPanels;

  return (
    <nav className="flex h-14 shrink-0 items-center justify-around border-t border-surface-200 bg-white px-2">
      {panels.map((panel) => {
        const { icon: Icon, label } = PANEL_CONFIG[panel];
        return (
          <button
            key={panel}
            onClick={() => setActivePanel(activePanel === panel ? null : panel)}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors",
              activePanel === panel
                ? "text-venue-700"
                : "text-surface-500"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        );
      })}
    </nav>
  );
}

export function MobilePanelOverlay() {
  const { activePanel, setActivePanel, platform } = useEditorStore();

  if (platform !== "mobile" || !activePanel) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white">
      <div className="flex h-12 items-center justify-between border-b border-surface-200 px-4">
        <span className="text-sm font-semibold capitalize">{activePanel}</span>
        <button onClick={() => setActivePanel(null)}>
          <X className="h-5 w-5 text-surface-500" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {activePanel === "items" && <ItemsPanel />}
        {activePanel === "layouts" && <LayoutsPanel />}
        {activePanel === "team" && <TeamPanel />}
        {activePanel === "share" && (
          <div className="p-4 text-sm text-surface-500">Share link management coming soon.</div>
        )}
      </div>
    </div>
  );
}
