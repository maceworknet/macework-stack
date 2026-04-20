"use client";

import { motion } from "framer-motion";
import { InfiniteGrid } from "./ui/the-infinite-grid";
import { cn } from "@/lib/utils";

interface SubPageHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SubPageHeader({ badge, title, description, children, className }: SubPageHeaderProps) {
  return (
    <section className={cn("relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-border/60", className)}>
      <div className="absolute inset-0 z-0">
        <InfiniteGrid className="h-full w-full" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent z-10" />
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {badge && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-macework/10 border border-macework/20 text-[11px] font-medium text-macework uppercase tracking-widest mb-6">
                {badge}
              </span>
            )}
            
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-gradient leading-[1.35] pb-4">
              {title}
            </h1>
            
            {description && (
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
            )}

            {children && (
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {children}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

