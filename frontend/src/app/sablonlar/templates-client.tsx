"use client";

import { useState } from "react";
import { ArrowRight, Layers, MoveRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SubPageHeader } from "@/components/subpage-header";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/lib/media";
import Link from "next/link";
import { richTextToPlainText } from "@/lib/rich-text";

export default function TemplatesClient({
  templates = [],
  categories = [],
  globalSettings = {},
}: {
  templates?: any[];
  categories?: any[];
  globalSettings?: any;
}) {
  const [activeCategory, setActiveCategory] = useState("Hepsi");
  const categoryNames = ["Hepsi", ...categories.map((category) => category.name)];

  const filteredTemplates = templates.filter((item) =>
    activeCategory === "Hepsi" ? true : item.template_category?.name === activeCategory
  );

  return (
    <main className="min-h-screen">
      <SubPageHeader
        badge={globalSettings?.eyebrow || "Şablon Kütüphanesi"}
        title={globalSettings?.heading || "Hazır Şablonlarımızı Keşfedin"}
        description={
          globalSettings?.description ||
          "İşletmeniz için özelleştirilebilir, modern ve yüksek performanslı hazır web altyapıları."
        }
      />

      <section className="bg-background py-20">
        <div className="container">
          <div className="mb-16 flex justify-center px-4">
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
                        layoutId="active-pill-templates"
                        className="absolute inset-0 rounded-xl border border-border/50 bg-background shadow-sm"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">
                      {category === "Hepsi" ? "Tüm Şablonlar" : category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.div layout className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template) => {
                const summary =
                  richTextToPlainText(template.description) ||
                  `Modern tasarımı ve güçlü altyapısıyla markanızı bir adım öne çıkaracak profesyonel ${
                    template.template_category?.name?.toLowerCase() ?? "şablon"
                  } çözümü.`;

                return (
                  <motion.div
                    key={template.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      href={`/sablonlar/${template.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-none transition-all duration-500 hover:border-macework/50 hover:shadow-xl hover:shadow-macework/5"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={resolveMediaUrl(
                            template.preview_image ?? template.cover_image ?? template.image
                          )}
                          alt={template.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-macework">
                            {template.template_category?.name || "Sablon"}
                          </span>
                          <h4 className="mt-1 text-xl font-bold tracking-tight text-white">
                            {template.title}
                          </h4>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-8">
                        <div className="mb-4 flex items-center gap-2">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-macework" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {template.template_category?.name || "Sablon"}
                          </span>
                        </div>

                        <h3 className="mb-3 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-macework">
                          {template.title}
                        </h3>

                        <p className="mb-8 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {summary}
                        </p>

                        <div className="group/link flex items-center justify-between border-t border-border/40 pt-6">
                          <span className="text-xs font-bold uppercase tracking-widest text-foreground transition-colors group-hover/link:text-macework">
                            Canlı Demo
                          </span>
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted/60 transition-all group-hover/link:bg-macework group-hover/link:text-white">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          <div className="relative mt-32 overflow-hidden rounded-[3rem] border border-border/60 bg-card p-12 text-center md:p-20">
            <div className="absolute -right-48 -top-48 h-96 w-96 bg-macework/10 blur-[120px]"></div>
            <div className="relative z-10 space-y-8">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-macework/10 text-macework">
                <Layers className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                {globalSettings?.cta_heading || "Size Özel Bir Şablona mı İhtiyacınız Var?"}
              </h2>
              <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground">
                {globalSettings?.cta_description ||
                  "Şablonlarımızı projenize özel olarak özelleştirebilir veya sıfırdan markanıza uygun bir yapı inşa edebiliriz."}
              </p>
              <Link
                href={globalSettings?.cta_button_url || "/iletisim"}
                className="group inline-flex items-center gap-2 rounded-full bg-macework px-10 py-5 text-lg font-bold text-white transition-all active:scale-95 hover:bg-macework-hover"
              >
                {globalSettings?.cta_button_label || "Bizimle İletişime Geçin"}
                <MoveRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
