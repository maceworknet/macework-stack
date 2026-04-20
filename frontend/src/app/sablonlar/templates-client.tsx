"use client";

﻿import { getStrapiMedia } from '@/lib/strapi';

import { useState } from "react";
import { siteContent } from "@/content/site-content";
import { ArrowRight, MoveRight, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SubPageHeader } from "@/components/subpage-header";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function TemplatesClient({ 
  strapiTemplates = [], 
  categories = [],
  globalSettings = {}
}: { 
  strapiTemplates?: any[], 
  categories?: any[],
  globalSettings?: any
}) {
  const [activeCategory, setActiveCategory] = useState("Hepsi");

  const categoryNames = ["Hepsi", ...categories.map(c => c.name)];

  const filteredTemplates = strapiTemplates.filter(item => 
    activeCategory === "Hepsi" ? true : item.template_category?.name === activeCategory
  );

  return (
    <main className="min-h-screen">
      <SubPageHeader 
        badge="Şablon Kütüphanesi"
        title={globalSettings?.templates_page_title || "Hazır Şablonlarımızı Keşfedin"}
        description={globalSettings?.templates_page_desc || "İşletmeniz için özelleştirilebilir, modern ve yüksek performanslı hazır web altyapıları. Sektörünüze en uygun çözümü seçin ve dijital dönüşümünüzü hızlandırın."}
      />

      <section className="py-20 bg-background">
        <div className="container">
          {/* Filter Bar */}
          <div className="flex justify-center mb-16 px-4">
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
                        layoutId="active-pill-templates"
                        className="absolute inset-0 bg-background border border-border/50 rounded-xl shadow-sm"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{category === "Hepsi" ? "Tüm Şablonlar" : category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <motion.div 
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template) => (
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
                    className="group flex flex-col h-full bg-card border border-border rounded-3xl hover:border-macework/50 transition-all duration-500 overflow-hidden shadow-none hover:shadow-xl hover:shadow-macework/5"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                       <img 
                        src={template.preview_image?.url ? getStrapiMedia(template.preview_image.url) : (template.cover_image?.url ? getStrapiMedia(template.cover_image.url) : template.image)} 
                        alt={template.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                          <span className="text-macework font-bold text-[10px] uppercase tracking-[0.2em]">{template.template_category?.name || "Şablon"}</span>
                          <h4 className="text-white font-bold text-xl tracking-tight mt-1">{template.title}</h4>
                       </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-macework animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{template.template_category?.name || "Şablon"}</span>
                        </div>
                      
                        <h3 className="text-xl font-bold tracking-tight text-foreground mb-3 group-hover:text-macework transition-colors">
                            {template.title}
                        </h3>
                      
                        <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                            Modern tasarımı ve güçlü altyapısıyla markanızı bir adım öne çıkaracak profesyonel {template.template_category?.name ? template.template_category.name.toLowerCase() : "şablon"} çözümü.
                        </p>
    
                        <div className="flex items-center justify-between pt-6 border-t border-border/40 group/link">
                            <span className="text-xs font-bold text-foreground group-hover/link:text-macework transition-colors uppercase tracking-widest">Canlı Demo</span>
                            <div className="w-9 h-9 rounded-full bg-muted/60 border border-border flex items-center justify-center group-hover/link:bg-macework group-hover/link:text-white transition-all">
                               <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Contact Section */}
          <div className="mt-32 p-12 md:p-20 rounded-[3rem] bg-card border border-border/60 relative overflow-hidden text-center">
             <div className="absolute top-0 right-0 w-96 h-96 bg-macework/10 blur-[120px] -mr-48 -mt-48"></div>
             <div className="relative z-10 space-y-8">
                 <div className="w-16 h-16 rounded-2xl bg-macework/10 flex items-center justify-center text-macework mx-auto mb-6">
                    <Layers className="w-8 h-8" />
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">Size Özel Bir Şablona mı İhtiyacınız Var?</h2>
                 <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                     Şablonlarımızı projenize özel olarak özelleştirebilir veya sıfırdan markanıza uygun bir yapı inşa edebiliriz.
                 </p>
                 <Link 
                    href="/iletisim"
                    className="inline-flex items-center gap-2 bg-macework hover:bg-macework-hover text-white px-10 py-5 rounded-full text-lg font-bold transition-all group active:scale-95"
                 >
                    Bizimle İletişime Geçin
                    <MoveRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                 </Link>
             </div>
          </div>
        </div>
      </section>
    </main>
  );
}

