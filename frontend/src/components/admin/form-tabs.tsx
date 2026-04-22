"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";

export type AdminFormTab = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  content: ReactNode;
};

export function AdminFormTabs({
  tabs,
  defaultTabId,
}: {
  tabs: AdminFormTab[];
  defaultTabId?: string;
}) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId ?? tabs[0]?.id ?? "");

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId) ?? tabs[0],
    [activeTabId, tabs]
  );

  return (
    <div
      className="space-y-6"
      onInvalidCapture={(event) => {
        const target = event.target as HTMLElement | null;
        const panel = target?.closest<HTMLElement>("[data-tab-panel]");
        const tabId = panel?.dataset.tabPanel;

        if (tabId) {
          setActiveTabId(tabId);
        }
      }}
    >
      <div className="space-y-4 border-b border-border/70 pb-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab?.id === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                className={`inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-bold transition-colors ${
                  isActive
                    ? "border-macework bg-macework text-white"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold text-foreground">{activeTab?.label}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{activeTab?.description}</p>
        </div>
      </div>

      <div className="space-y-8">
        {tabs.map((tab) => (
          <section
            key={tab.id}
            data-tab-panel={tab.id}
            aria-hidden={activeTab?.id !== tab.id}
            className={activeTab?.id === tab.id ? "block" : "sr-only"}
          >
            {tab.content}
          </section>
        ))}
      </div>
    </div>
  );
}
