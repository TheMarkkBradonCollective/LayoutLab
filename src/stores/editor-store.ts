import { create } from "zustand";
import type {
  FloorObject,
  LiveUser,
  AppPanel,
  Platform,
  SimulationConfig,
  VenueData,
  LayoutData,
  BuildMode,
  CameraTool,
  RoomOrbit,
} from "@/types";
import { DEFAULT_ROOM_ORBIT } from "@/types";
import { generateId } from "@/lib/utils";
import { stockFor, clampToHall } from "@/lib/room-placement";

interface EditorState {
  // Venue context
  venue: VenueData | null;
  currentRoomId: string | null;
  currentLayout: LayoutData | null;

  // Editor state
  objects: FloorObject[];
  selectedObjectId: string | null;
  selectionIds: string[];
  tool: "select" | "pan" | "measure";
  zoom: number;
  panOffset: { x: number; y: number };
  gridSize: number;
  showGrid: boolean;
  snapToGrid: boolean;

  // UI state
  platform: Platform;
  activePanel: AppPanel | null;
  buildMode: BuildMode;
  cameraTool: CameraTool;
  orbit: RoomOrbit;
  is3DMode: boolean;
  isSimulationMode: boolean;

  // Collaboration
  liveUsers: LiveUser[];

  // Simulation
  simulationConfig: SimulationConfig | null;
  isSimulationPlaying: boolean;

  // History for undo/redo
  history: FloorObject[][];
  historyIndex: number;

  // Actions
  setVenue: (venue: VenueData) => void;
  setCurrentRoom: (roomId: string) => void;
  setCurrentLayout: (layout: LayoutData) => void;
  setPlatform: (platform: Platform) => void;
  setActivePanel: (panel: AppPanel | null) => void;
  setTool: (tool: "select" | "pan" | "measure") => void;
  setZoom: (zoom: number) => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  setBuildMode: (mode: BuildMode) => void;
  setCameraTool: (tool: CameraTool) => void;
  setOrbit: (orbit: RoomOrbit) => void;
  resetOrbit: () => void;
  toggleShowGrid: () => void;
  toggle3DMode: () => void;
  toggleSimulationMode: () => void;
  setSimulationConfig: (config: SimulationConfig) => void;
  setSimulationPlaying: (playing: boolean) => void;
  setLiveUsers: (users: LiveUser[]) => void;

  addObject: (template: Omit<FloorObject, "id">) => void;
  updateObject: (id: string, updates: Partial<FloorObject>) => void;
  deleteObject: (id: string) => void;
  selectObject: (id: string | null, options?: { additive?: boolean }) => void;
  translateObjects: (ids: string[], dx: number, dy: number) => void;
  rotateSelected: (delta: number) => void;
  scaleSelected: (factor: number) => void;
  removeSelected: () => void;
  duplicateObject: (id: string) => void;
  toggleLock: (id: string) => void;
  clearObjects: () => void;
  loadObjects: (objects: FloorObject[]) => void;

  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  venue: null,
  currentRoomId: null,
  currentLayout: null,
  objects: [],
  selectedObjectId: null,
  selectionIds: [],
  tool: "select",
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  gridSize: 1,
  showGrid: true,
  snapToGrid: true,
  platform: "tablet",
  activePanel: "items",
  buildMode: "design",
  cameraTool: "orbit",
  orbit: DEFAULT_ROOM_ORBIT,
  is3DMode: false,
  isSimulationMode: false,
  liveUsers: [],
  simulationConfig: null,
  isSimulationPlaying: false,
  history: [[]],
  historyIndex: 0,

  setVenue: (venue) => set({ venue }),
  setCurrentRoom: (roomId) => set({ currentRoomId: roomId }),
  setCurrentLayout: (layout) =>
    set({
      currentLayout: layout,
      objects: layout.objects,
      history: [layout.objects],
      historyIndex: 0,
      selectedObjectId: null,
      selectionIds: [],
    }),
  setPlatform: (platform) => set({ platform }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setTool: (tool) => set({ tool }),
  setZoom: (zoom) => set({ zoom: Math.max(0.08, Math.min(4, zoom)) }),
  setPanOffset: (offset) => set({ panOffset: offset }),
  setBuildMode: (buildMode) => set({ buildMode }),
  setCameraTool: (cameraTool) => set({ cameraTool }),
  setOrbit: (orbit) => set({ orbit }),
  resetOrbit: () => set({ orbit: DEFAULT_ROOM_ORBIT, cameraTool: "orbit" }),
  toggleShowGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggle3DMode: () => set((s) => ({ is3DMode: !s.is3DMode, isSimulationMode: false })),
  toggleSimulationMode: () =>
    set((s) => ({ isSimulationMode: !s.isSimulationMode, is3DMode: s.isSimulationMode ? s.is3DMode : false })),
  setSimulationConfig: (config) => set({ simulationConfig: config }),
  setSimulationPlaying: (playing) => set({ isSimulationPlaying: playing }),
  setLiveUsers: (users) => set({ liveUsers: users }),

  addObject: (template) => {
    const { objects, gridSize, snapToGrid, pushHistory } = get();
    const stock = stockFor(template.itemType);
    if (stock && objects.filter((object) => object.itemType === template.itemType).length >= stock.quantity) {
      return;
    }
    pushHistory();
    const snapped = {
      x: snapToGrid ? Math.round(template.x / gridSize) * gridSize : template.x,
      y: snapToGrid ? Math.round(template.y / gridSize) * gridSize : template.y,
    };
    const parked = clampToHall(snapped.x, snapped.y, template.width, template.height);
    const newObject: FloorObject = {
      ...template,
      ...parked,
      id: generateId(),
    };
    set({
      objects: [...objects, newObject],
      selectedObjectId: newObject.id,
      selectionIds: [newObject.id],
      buildMode: "design",
    });
  },

  updateObject: (id, updates) => {
    const { objects, gridSize, snapToGrid } = get();
    set({
      objects: objects.map((obj) => {
        if (obj.id !== id || obj.locked) return obj;
        const updated = { ...obj, ...updates };
        if (snapToGrid && (updates.x !== undefined || updates.y !== undefined)) {
          updated.x = Math.round(updated.x / gridSize) * gridSize;
          updated.y = Math.round(updated.y / gridSize) * gridSize;
        }
        return updated;
      }),
    });
  },

  deleteObject: (id) => {
    const { objects, pushHistory } = get();
    pushHistory();
    set({
      objects: objects.filter((obj) => obj.id !== id),
      selectedObjectId: null,
      selectionIds: [],
    });
  },

  selectObject: (id, options) => {
    if (!id) {
      set({ selectedObjectId: null, selectionIds: [] });
      return;
    }
    if (options?.additive) {
      const { selectionIds } = get();
      const next = selectionIds.includes(id)
        ? selectionIds.filter((existing) => existing !== id)
        : [...selectionIds, id];
      set({
        selectionIds: next,
        selectedObjectId: next.includes(id) ? id : (next[next.length - 1] ?? null),
      });
      return;
    }
    set({ selectedObjectId: id, selectionIds: [id] });
  },

  translateObjects: (ids, dx, dy) => {
    const { objects, gridSize, snapToGrid } = get();
    const moving = new Set(ids);
    set({
      objects: objects.map((obj) => {
        if (!moving.has(obj.id) || obj.locked) return obj;
        let x = obj.x + dx;
        let y = obj.y + dy;
        if (snapToGrid) {
          x = Math.round(x / gridSize) * gridSize;
          y = Math.round(y / gridSize) * gridSize;
        }
        return { ...obj, ...clampToHall(x, y, obj.width, obj.height) };
      }),
    });
  },

  rotateSelected: (delta) => {
    const { objects, selectionIds, pushHistory } = get();
    if (selectionIds.length === 0) return;
    pushHistory();
    const moving = new Set(selectionIds);
    set({
      objects: objects.map((obj) =>
        moving.has(obj.id) && !obj.locked
          ? { ...obj, rotation: (obj.rotation + delta + 360) % 360 }
          : obj
      ),
    });
  },

  scaleSelected: (factor) => {
    const { objects, selectionIds, pushHistory } = get();
    if (selectionIds.length === 0) return;
    pushHistory();
    const moving = new Set(selectionIds);
    set({
      objects: objects.map((obj) => {
        if (!moving.has(obj.id) || obj.locked) return obj;
        const stock = stockFor(obj.itemType);
        const baseW = stock?.width ?? obj.width;
        const baseH = stock?.height ?? obj.height;
        const width = clampDimension(obj.width * factor, baseW * 0.5, baseW * 2);
        const height = clampDimension(obj.height * factor, baseH * 0.5, baseH * 2);
        return { ...obj, width, height, ...clampToHall(obj.x, obj.y, width, height) };
      }),
    });
  },

  removeSelected: () => {
    const { objects, selectionIds, pushHistory } = get();
    const removable = new Set(
      objects.filter((obj) => selectionIds.includes(obj.id) && !obj.locked).map((obj) => obj.id)
    );
    if (removable.size === 0) return;
    pushHistory();
    const nextSelection = selectionIds.filter((id) => !removable.has(id));
    set({
      objects: objects.filter((obj) => !removable.has(obj.id)),
      selectionIds: nextSelection,
      selectedObjectId: nextSelection[0] ?? null,
    });
  },

  duplicateObject: (id) => {
    const { objects, pushHistory } = get();
    const source = objects.find((o) => o.id === id);
    if (!source) return;
    const stock = stockFor(source.itemType);
    if (stock && objects.filter((object) => object.itemType === source.itemType).length >= stock.quantity) {
      return;
    }
    pushHistory();
    const parked = clampToHall(source.x + 0.5, source.y + 0.5, source.width, source.height);
    const duplicate: FloorObject = {
      ...source,
      ...parked,
      id: generateId(),
    };
    set({ objects: [...objects, duplicate], selectedObjectId: duplicate.id, selectionIds: [duplicate.id] });
  },

  toggleLock: (id) => {
    const { objects } = get();
    set({
      objects: objects.map((obj) =>
        obj.id === id ? { ...obj, locked: !obj.locked } : obj
      ),
    });
  },

  clearObjects: () => {
    const { pushHistory } = get();
    pushHistory();
    set({ objects: [], selectedObjectId: null, selectionIds: [] });
  },

  loadObjects: (objects) => set({ objects, history: [objects], historyIndex: 0 }),

  pushHistory: () => {
    const { objects, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...objects]);
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    set({
      objects: [...history[newIndex]],
      historyIndex: newIndex,
      selectedObjectId: null,
      selectionIds: [],
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    set({
      objects: [...history[newIndex]],
      historyIndex: newIndex,
      selectedObjectId: null,
      selectionIds: [],
    });
  },
}));

function clampDimension(value: number, min: number, max: number): number {
  const clamped = Math.min(max, Math.max(min, value));
  return Math.round(clamped * 100) / 100;
}
