"use client";

import { useEffect } from "react";
import { AppShell } from "@/components/app-shell/app-shell";
import { MobilePanelOverlay } from "@/components/app-shell/side-panel";
import { useEditorStore } from "@/stores/editor-store";
import { DEMO_VENUE, DEMO_LAYOUT, DEMO_LIVE_USERS } from "@/lib/demo-data";

export function WorkspaceClient() {
  const { setVenue, setCurrentRoom, setCurrentLayout, setLiveUsers } = useEditorStore();

  useEffect(() => {
    setVenue(DEMO_VENUE);
    setCurrentRoom(DEMO_VENUE.rooms[0].id);
    setCurrentLayout(DEMO_LAYOUT);
    setLiveUsers(DEMO_LIVE_USERS);
  }, [setVenue, setCurrentRoom, setCurrentLayout, setLiveUsers]);

  return (
    <AppShell>
      <MobilePanelOverlay />
    </AppShell>
  );
}
