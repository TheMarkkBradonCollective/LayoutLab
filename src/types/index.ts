// ─── Platform Types ────────────────────────────────────────────────

export type Platform = "tablet" | "mobile" | "pc";

// ─── Venue Roles ─────────────────────────────────────────────────────

export type VenueRole = "OWNER" | "MANAGER" | "DESIGNER" | "STAFF" | "VIEWER";

export interface PermissionSet {
  view: boolean;
  edit: boolean;
  save: boolean;
  delete: boolean;
  share: boolean;
}

export const ROLE_PERMISSIONS: Record<VenueRole, PermissionSet> = {
  OWNER: { view: true, edit: true, save: true, delete: true, share: true },
  MANAGER: { view: true, edit: true, save: true, delete: true, share: true },
  DESIGNER: { view: true, edit: true, save: true, delete: false, share: false },
  STAFF: { view: true, edit: true, save: false, delete: false, share: false },
  VIEWER: { view: true, edit: false, save: false, delete: false, share: false },
};

// ─── Furniture Library ───────────────────────────────────────────────

export type ItemCategory = "TABLES" | "SEATING" | "EQUIPMENT" | "DECOR";

export interface FurnitureTemplate {
  id: string;
  name: string;
  category: ItemCategory;
  width: number;
  height: number;
  depth: number;
  quantity?: number;
  capacity?: number;
  color: string;
  icon: string;
}

/** @deprecated Use TRS_FURNITURE from @/lib/trs-inventory */
export const DEFAULT_FURNITURE: FurnitureTemplate[] = [];

// ─── Floor Plan Objects ──────────────────────────────────────────────

export interface FloorObject {
  id: string;
  itemName: string;
  itemType: string;
  category: ItemCategory;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  locked: boolean;
  color: string;
  capacity?: number;
}

// ─── Layout ──────────────────────────────────────────────────────────

export interface LayoutData {
  id: string;
  name: string;
  description?: string;
  roomId: string;
  venueId: string;
  objects: FloorObject[];
  version: number;
}

// ─── Venue ─────────────────────────────────────────────────────────

export interface VenueData {
  id: string;
  name: string;
  address?: string;
  capacity?: number;
  imageUrl?: string;
  unit?: "ft" | "m";
  rooms: RoomData[];
}

export interface RoomData {
  id: string;
  name: string;
  width: number;
  height: number;
  capacity?: number;
  unit?: "ft" | "m";
  notes?: string;
}

// ─── Live Collaboration ──────────────────────────────────────────────

export interface LiveUser {
  id: string;
  name: string;
  status: "editing" | "viewing";
  color: string;
}

// ─── Simulation ──────────────────────────────────────────────────────

export type SimulationPreset = "WEDDING" | "CONCERT" | "BINGO" | "NIGHTCLUB" | "CUSTOM";
export type SimulationSpeed = "SLOW" | "NORMAL" | "FAST" | "STRESS";
export type PatronType = "seated" | "roaming" | "dancing" | "bar" | "queue";

export interface SimulationConfig {
  preset: SimulationPreset;
  speed: SimulationSpeed;
  guestCount: number;
  patronMix: Record<PatronType, number>;
}

export const SIMULATION_PRESETS: Record<SimulationPreset, Partial<SimulationConfig>> = {
  WEDDING: { guestCount: 150, patronMix: { seated: 0.6, roaming: 0.15, dancing: 0.15, bar: 0.08, queue: 0.02 } },
  CONCERT: { guestCount: 500, patronMix: { seated: 0.2, roaming: 0.5, dancing: 0.15, bar: 0.1, queue: 0.05 } },
  BINGO: { guestCount: 200, patronMix: { seated: 0.85, roaming: 0.05, dancing: 0, bar: 0.08, queue: 0.02 } },
  NIGHTCLUB: { guestCount: 300, patronMix: { seated: 0.1, roaming: 0.4, dancing: 0.35, bar: 0.12, queue: 0.03 } },
  CUSTOM: { guestCount: 100, patronMix: { seated: 0.4, roaming: 0.3, dancing: 0.1, bar: 0.15, queue: 0.05 } },
};

// ─── Zones ───────────────────────────────────────────────────────────

export type ZoneType = "DANCE_FLOOR" | "BAR" | "SEATING" | "VIP" | "ENTRANCE" | "STAGE" | "CUSTOM";

export interface ZoneData {
  id: string;
  name: string;
  type: ZoneType;
  x: number;
  y: number;
  width: number;
  height: number;
  capacity?: number;
}

// ─── Activity ────────────────────────────────────────────────────────

export interface ActivityEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  before?: string;
  after?: string;
  createdAt: string;
}

// ─── App Shell ───────────────────────────────────────────────────────

export type AppPanel = "items" | "tools" | "layouts" | "settings" | "team" | "share" | "simulation";

export interface AppShellConfig {
  platform: Platform;
  showSidebar: boolean;
  showBottomPanel: boolean;
  showTopBar: boolean;
  enabledPanels: AppPanel[];
}

export const APP_SHELL_CONFIGS: Record<Platform, AppShellConfig> = {
  tablet: {
    platform: "tablet",
    showSidebar: true,
    showBottomPanel: true,
    showTopBar: true,
    enabledPanels: ["items", "tools", "layouts", "settings", "team", "share", "simulation"],
  },
  mobile: {
    platform: "mobile",
    showSidebar: false,
    showBottomPanel: true,
    showTopBar: true,
    enabledPanels: ["layouts", "team", "share"],
  },
  pc: {
    platform: "pc",
    showSidebar: true,
    showBottomPanel: false,
    showTopBar: true,
    enabledPanels: ["items", "tools", "layouts", "settings", "team", "share", "simulation"],
  },
};
