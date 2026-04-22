"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { richTextToPlainText } from "@/lib/rich-text";

export function WorkList({ works, categories = [] }: { works: any[]; categories?: any[] }) {
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const categoryNames = ["Tümü", ...categories.map((category) => category.name)];

  const filteredWorks =
    works?.filter((work: any) =>
      activeCategory === "Tümü" ? true : work.project_category?.name === activeCategory
    ) || [];

  return (
    <>
      <div className="mb-16 flex justify-center overflow-hidden px-4">
        <div className="scrollbar-none inline-flex max-w-full items-center overflow-x-auto rounded-2xl border border-border/50 bg-muted/50 p-1.5 backdrop-blur-sm">
          <div className="flex min-w-max items-center">
            {categoryNames.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "relative shrink-0 whitespace-nowrap rounded-xl px-6 py-2.5 text-xs font-bold transition-all duration-300",
                  activeCategory === category
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {activeCategory === category && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-xl border border-border/50 bg-background"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{category === "Tümü" ? "Tüm Projeler" : category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div layout className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredWorks.map((work: any) => {
            const summary = richTextToPlainText(work.description) || work.description;

            return (
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
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:border-macework/50"
                >
                  <div className="mb-auto">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded-full bg-macework/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-macework">
                        {work.year}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {work.project_category?.name || "Genel"}
                      </span>
                    </div>

                    <h3 className="mb-3 text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-macework">
                      {work.title}
                    </h3>

                    <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {summary}
                    </p>

                    <div className="mb-8 flex flex-wrap gap-2">
                      {(work.tags || []).slice(0, 3).map((tech: string) => (
                        <span
                          key={tech}
                          className="rounded-md border border-border/50 bg-muted/60 px-2 py-0.5 text-[10px] font-bold text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="group/link mt-4 flex items-center justify-between gap-2 text-sm font-bold text-foreground">
                    <span className="underline-offset-4 decoration-macework/50 group-hover/link:underline">
                      Detayları İncele
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted/50 transition-all group-hover/link:bg-macework group-hover/link:text-white">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
