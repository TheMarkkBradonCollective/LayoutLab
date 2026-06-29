"use client";

import { useEffect } from "react";
import type { Platform } from "@/types";
import { APP_SHELL_CONFIGS } from "@/types";
import { useEditorStore } from "@/stores/editor-store";
import { TopBar } from "./top-bar";
import { SidePanel, BottomPanel } from "./side-panel";
import { FloorPlanner } from "@/components/floor-planner/floor-planner";
import { LiveUsersBar } from "./live-users-bar";

interface AppShellProps {
  platform?: Platform;
  children?: React.ReactNode;
}

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "tablet";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "pc";
}

export function AppShell({ platform: forcedPlatform, children }: AppShellProps) {
  const { platform, setPlatform } = useEditorStore();

  useEffect(() => {
    if (forcedPlatform) {
      setPlatform(forcedPlatform);
      return;
    }
    const update = () => setPlatform(detectPlatform());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [forcedPlatform, setPlatform]);

  const config = APP_SHELL_CONFIGS[platform];

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-100">
      {config.showTopBar && <TopBar />}

      <div className="flex flex-1 overflow-hidden">
        {config.showSidebar && config.platform !== "mobile" && <SidePanel />}

        <main className="relative flex flex-1 flex-col overflow-hidden">
          <LiveUsersBar />
          {children ?? <FloorPlanner />}
        </main>
      </div>

      {config.showBottomPanel && <BottomPanel />}
    </div>
  );
}
