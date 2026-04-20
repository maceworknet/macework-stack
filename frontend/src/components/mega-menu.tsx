"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Layout, Brush, LineChart, Share2, Code, ShoppingBag, Network, Box, Smartphone, Calculator, Brain } from "lucide-react";
import { siteContent } from "../content/site-content";
import { cn } from "../lib/utils";

const icons: Record<string, React.ElementType> = {
  "layout": Layout,
  "brush": Brush,
  "line-chart": LineChart,
  "share-2": Share2,
  "code": Code,
  "shopping-bag": ShoppingBag,
  "network": Network,
  "box": Box,
  "smartphone": Smartphone,
  "calculator": Calculator,
  "brain": Brain,
  "link": Network
};

export function MegaMenu({ label }: { label: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-4 rounded-full hover:bg-muted/50">
        {label}
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {/* Mega Menu Panel */}
      <div 
        className={cn(
          "absolute left-1/2 -translate-x-1/2 top-full w-[800px] pt-4 transition-all duration-200",
          isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-2 invisible"
        )}
      >
        <div className="bg-background border border-border rounded-xl p-8 shadow-xl grid grid-cols-3 gap-8 relative overflow-hidden backdrop-blur-md">
          {siteContent.solutionsMegaMenu.columns.map((col, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-2">{col.title}</h3>
              <ul className="space-y-1">
                {col.items.map((item, itemIdx) => {
                  const Icon = icons[item.iconName] || Code;
                  return (
                    <li key={itemIdx}>
                      <Link href={item.href} className="group/item flex items-start gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                        <div className="mt-0.5 p-1.5 rounded-md bg-muted group-hover/item:bg-background transition-colors text-macework">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.title}</p>
                          <p className="text-[12px] text-muted-foreground mt-0.5 leading-snug">{item.description}</p>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

