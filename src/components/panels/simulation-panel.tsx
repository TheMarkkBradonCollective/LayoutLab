"use client";

import { Play, Pause, RotateCcw } from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import {
  SIMULATION_PRESETS,
  type SimulationPreset,
  type SimulationSpeed,
} from "@/types";
import { cn } from "@/lib/utils";

const PRESETS: { key: SimulationPreset; label: string; description: string }[] = [
  { key: "WEDDING", label: "Wedding", description: "Seating focused, dinner & dancing" },
  { key: "CONCERT", label: "Concert", description: "Stage focused, high movement" },
  { key: "BINGO", label: "Bingo", description: "Fixed seating, low movement" },
  { key: "NIGHTCLUB", label: "Nightclub", description: "High roaming, bar traffic" },
];

const SPEEDS: { key: SimulationSpeed; label: string }[] = [
  { key: "SLOW", label: "Slow" },
  { key: "NORMAL", label: "Normal" },
  { key: "FAST", label: "Fast" },
  { key: "STRESS", label: "Stress" },
];

export function SimulationPanel() {
  const {
    simulationConfig,
    setSimulationConfig,
    isSimulationPlaying,
    setSimulationPlaying,
    toggleSimulationMode,
  } = useEditorStore();

  const config = simulationConfig ?? {
    preset: "WEDDING" as SimulationPreset,
    speed: "NORMAL" as SimulationSpeed,
    guestCount: 150,
    patronMix: SIMULATION_PRESETS.WEDDING.patronMix!,
  };

  const selectPreset = (preset: SimulationPreset) => {
    const presetConfig = SIMULATION_PRESETS[preset];
    setSimulationConfig({
      preset,
      speed: config.speed,
      guestCount: presetConfig.guestCount ?? 100,
      patronMix: presetConfig.patronMix ?? SIMULATION_PRESETS.CUSTOM.patronMix!,
    });
  };

  return (
    <div className="p-3">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-surface-400">
        Event Simulation
      </h3>

      <div className="mb-4 space-y-1">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => selectPreset(p.key)}
            className={cn(
              "flex w-full flex-col rounded-lg px-3 py-2 text-left transition-colors",
              config.preset === p.key
                ? "bg-venue-50 ring-1 ring-venue-200"
                : "hover:bg-surface-50"
            )}
          >
            <span className="text-sm font-medium text-surface-800">{p.label}</span>
            <span className="text-[10px] text-surface-400">{p.description}</span>
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-[10px] font-medium text-surface-500">
          Guest Count: {config.guestCount}
        </label>
        <input
          type="range"
          min={10}
          max={500}
          step={10}
          value={config.guestCount}
          onChange={(e) =>
            setSimulationConfig({ ...config, guestCount: Number(e.target.value) })
          }
          className="w-full accent-venue-600"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-[10px] font-medium text-surface-500">Speed</label>
        <div className="grid grid-cols-4 gap-1">
          {SPEEDS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSimulationConfig({ ...config, speed: s.key })}
              className={cn(
                "rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
                config.speed === s.key
                  ? "bg-venue-600 text-white"
                  : "bg-surface-100 text-surface-600 hover:bg-surface-200"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            if (!simulationConfig) setSimulationConfig(config);
            toggleSimulationMode();
            setSimulationPlaying(true);
          }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-venue-600 py-2 text-xs font-medium text-white hover:bg-venue-700"
        >
          <Play className="h-3.5 w-3.5" />
          Run Simulation
        </button>
        {isSimulationPlaying && (
          <button
            onClick={() => setSimulationPlaying(false)}
            className="flex items-center justify-center rounded-lg bg-surface-200 px-3 py-2 text-surface-600 hover:bg-surface-300"
          >
            <Pause className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={() => setSimulationPlaying(false)}
          className="flex items-center justify-center rounded-lg bg-surface-200 px-3 py-2 text-surface-600 hover:bg-surface-300"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
