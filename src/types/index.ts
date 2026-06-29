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
  capacity?: number;
  color: string;
  icon: string;
}

export const DEFAULT_FURNITURE: FurnitureTemplate[] = [
  // Tables
  { id: "round-table-60", name: "Round Table (60\")", category: "TABLES", width: 1.5, height: 1.5, depth: 0.75, capacity: 8, color: "#8B7355", icon: "circle" },
  { id: "round-table-72", name: "Round Table (72\")", category: "TABLES", width: 1.8, height: 1.8, depth: 0.75, capacity: 10, color: "#8B7355", icon: "circle" },
  { id: "rect-table-8", name: "Rectangle Table (8ft)", category: "TABLES", width: 2.4, height: 0.9, depth: 0.75, capacity: 8, color: "#A0826D", icon: "rectangle" },
  { id: "cocktail-table", name: "Cocktail Table", category: "TABLES", width: 0.6, height: 0.6, depth: 1.1, capacity: 4, color: "#C4A882", icon: "circle" },
  // Seating
  { id: "chair", name: "Chair", category: "SEATING", width: 0.5, height: 0.5, depth: 0.9, color: "#4A5568", icon: "chair" },
  { id: "bench", name: "Bench (6ft)", category: "SEATING", width: 1.8, height: 0.5, depth: 0.45, capacity: 4, color: "#4A5568", icon: "rectangle" },
  // Equipment
  { id: "stage", name: "Stage", category: "EQUIPMENT", width: 4, height: 2.5, depth: 1.2, color: "#2D3748", icon: "rectangle" },
  { id: "dj-booth", name: "DJ Booth", category: "EQUIPMENT", width: 2, height: 1, depth: 1.2, color: "#1A202C", icon: "rectangle" },
  { id: "bar", name: "Bar", category: "EQUIPMENT", width: 3, height: 0.8, depth: 1.1, color: "#744210", icon: "rectangle" },
  { id: "dance-floor", name: "Dance Floor", category: "EQUIPMENT", width: 4, height: 4, depth: 0.05, color: "#2B6CB0", icon: "rectangle" },
  // Decor
  { id: "plant", name: "Plant", category: "DECOR", width: 0.6, height: 0.6, depth: 1.2, color: "#276749", icon: "circle" },
  { id: "sign", name: "Sign", category: "DECOR", width: 0.8, height: 0.3, depth: 1.5, color: "#E53E3E", icon: "rectangle" },
  { id: "lighting", name: "Lighting Rig", category: "DECOR", width: 1, height: 1, depth: 2, color: "#D69E2E", icon: "circle" },
];

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
  rooms: RoomData[];
}

export interface RoomData {
  id: string;
  name: string;
  width: number;
  height: number;
  capacity?: number;
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
