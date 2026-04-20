"use client";

import { useState } from "react";
import { ArrowRight, MoveRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";



export function WorkList({ works, categories = [] }: { works: any[], categories?: any[] }) {
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const categoryNames = ["Tümü", ...categories.map(c => c.name)];

  const filteredWorks = works?.filter((work: any) => 
    activeCategory === "Tümü" ? true : work.project_category?.name === activeCategory
  ) || [];

  return (
    <>
      {/* Filter Bar */}
      <div className="flex justify-center mb-16 px-4 overflow-hidden">
        <div className="inline-flex items-center p-1.5 bg-muted/50 backdrop-blur-sm rounded-2xl border border-border/50 max-w-full overflow-x-auto scrollbar-none">
          <div className="flex items-center min-w-max">
            {categoryNames.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "relative px-6 py-2.5 text-xs font-bold transition-all duration-300 rounded-xl shrink-0 whitespace-nowrap",
                  activeCategory === category 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {activeCategory === category && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-background border border-border/50 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{category === "Tümü" ? "Tüm Projeler" : category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div 
        layout
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredWorks.map((work: any) => (
            <motion.div
              key={work.documentId || work.id || work.slug}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/islerimiz/${work.slug}`}
                className="group relative flex flex-col h-full bg-card border border-border p-8 rounded-3xl hover:border-macework/50 transition-all duration-300 overflow-hidden"
              >
                <div className="mb-auto">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-macework bg-macework/10 px-3 py-1 rounded-full">{work.year}</span>
                        <span className="text-[10px] font-medium text-muted-foreground">{work.project_category?.name || 'Genel'}</span>
                    </div>
                  
                    <h3 className="text-2xl font-semibold tracking-tight text-foreground mb-3 group-hover:text-macework transition-colors">
                        {work.title}
                    </h3>
                  
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2">
                        {work.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                         {(work.tags || []).slice(0, 3).map((tech: string) => (
                             <span key={tech} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/50">{tech}</span>
                         ))}
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 text-sm font-bold text-foreground group/link">
                    <span className="group-hover/link:underline underline-offset-4 decoration-macework/50">Detayları İncele</span>
                    <div className="w-10 h-10 rounded-full bg-muted/50 border border-border flex items-center justify-center group-hover/link:bg-macework group-hover/link:text-white transition-all">
                       <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
