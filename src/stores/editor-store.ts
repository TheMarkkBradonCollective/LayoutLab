import { create } from "zustand";
import type {
  FloorObject,
  LiveUser,
  AppPanel,
  Platform,
  SimulationConfig,
  VenueData,
  LayoutData,
} from "@/types";
import { generateId } from "@/lib/utils";

interface EditorState {
  // Venue context
  venue: VenueData | null;
  currentRoomId: string | null;
  currentLayout: LayoutData | null;

  // Editor state
  objects: FloorObject[];
  selectedObjectId: string | null;
  tool: "select" | "pan" | "measure";
  zoom: number;
  panOffset: { x: number; y: number };
  gridSize: number;
  showGrid: boolean;
  snapToGrid: boolean;

  // UI state
  platform: Platform;
  activePanel: AppPanel | null;
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
  toggle3DMode: () => void;
  toggleSimulationMode: () => void;
  setSimulationConfig: (config: SimulationConfig) => void;
  setSimulationPlaying: (playing: boolean) => void;
  setLiveUsers: (users: LiveUser[]) => void;

  addObject: (template: Omit<FloorObject, "id">) => void;
  updateObject: (id: string, updates: Partial<FloorObject>) => void;
  deleteObject: (id: string) => void;
  selectObject: (id: string | null) => void;
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
  tool: "select",
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  gridSize: 1,
  showGrid: true,
  snapToGrid: true,
  platform: "tablet",
  activePanel: "items",
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
    }),
  setPlatform: (platform) => set({ platform }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setTool: (tool) => set({ tool }),
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(4, zoom)) }),
  setPanOffset: (offset) => set({ panOffset: offset }),
  toggle3DMode: () => set((s) => ({ is3DMode: !s.is3DMode })),
  toggleSimulationMode: () => set((s) => ({ isSimulationMode: !s.isSimulationMode })),
  setSimulationConfig: (config) => set({ simulationConfig: config }),
  setSimulationPlaying: (playing) => set({ isSimulationPlaying: playing }),
  setLiveUsers: (users) => set({ liveUsers: users }),

  addObject: (template) => {
    const { objects, gridSize, snapToGrid, pushHistory } = get();
    pushHistory();
    const newObject: FloorObject = {
      ...template,
      id: generateId(),
      x: snapToGrid ? Math.round(template.x / gridSize) * gridSize : template.x,
      y: snapToGrid ? Math.round(template.y / gridSize) * gridSize : template.y,
    };
    set({ objects: [...objects, newObject], selectedObjectId: newObject.id });
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
    });
  },

  selectObject: (id) => set({ selectedObjectId: id }),

  duplicateObject: (id) => {
    const { objects, pushHistory } = get();
    const source = objects.find((o) => o.id === id);
    if (!source) return;
    pushHistory();
    const duplicate: FloorObject = {
      ...source,
      id: generateId(),
      x: source.x + 0.5,
      y: source.y + 0.5,
    };
    set({ objects: [...objects, duplicate], selectedObjectId: duplicate.id });
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
    set({ objects: [], selectedObjectId: null });
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
    set({ objects: [...history[newIndex]], historyIndex: newIndex, selectedObjectId: null });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    set({ objects: [...history[newIndex]], historyIndex: newIndex, selectedObjectId: null });
  },
}));
