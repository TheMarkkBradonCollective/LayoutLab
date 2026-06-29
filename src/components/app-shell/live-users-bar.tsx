"use client";

import { useEditorStore } from "@/stores/editor-store";

const STATUS_COLORS = {
  editing: "bg-emerald-500",
  viewing: "bg-blue-400",
};

export function LiveUsersBar() {
  const { liveUsers } = useEditorStore();

  if (liveUsers.length === 0) return null;

  return (
    <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
      <span className="text-[10px] font-medium uppercase tracking-wide text-surface-400">
        Live
      </span>
      <div className="flex items-center gap-2">
        {liveUsers.map((user) => (
          <div key={user.id} className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${STATUS_COLORS[user.status]}`} />
            <span className="text-xs text-surface-700">
              {user.name}
              <span className="text-surface-400">
                {user.status === "editing" ? " editing" : " viewing"}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
