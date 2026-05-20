"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  return (
    <Tabs
      value={activeTabId}
      onValueChange={setActiveTabId}
      className="space-y-6"
      // Switch to the tab containing the invalid field on validation
      onInvalidCapture={(event) => {
        const target = event.target as HTMLElement | null;
        const panel = target?.closest<HTMLElement>("[data-radix-tabs-content]");
        const tabId = panel?.getAttribute("data-value");
        if (tabId) setActiveTabId(tabId);
      }}
    >
      <div className="space-y-3 border-b border-border/70 pb-4">
        <TabsList className="h-auto flex-wrap gap-1.5 rounded-lg bg-muted p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors data-[state=active]:bg-macework data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {activeTab && (
          <div className="space-y-0.5 px-1">
            <p className="text-sm font-bold text-foreground">{activeTab.label}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {activeTab.description}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {tabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className="mt-0 focus-visible:outline-none"
          >
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
