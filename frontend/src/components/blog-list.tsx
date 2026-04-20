"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BlogList({ posts, categories = [] }: { posts: any[], categories?: any[] }) {
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const categoryNames = ["Tümü", ...categories.map(c => c.name)];

  const filteredPosts = posts?.filter((post: any) => 
    activeCategory === "Tümü" ? true : post.blog_category?.name === activeCategory
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
                    layoutId="active-pill-blog"
                    className="absolute inset-0 bg-background border border-border/50 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{category === "Tümü" ? "Tüm Yazılar" : category}</span>
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
          {filteredPosts.map((post: any) => (
            <motion.div
              key={post.documentId || post.id || post.slug}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col h-full bg-card border border-border p-8 rounded-[2.5rem] hover:border-macework/50 transition-all duration-300"
              >
                <div className="mb-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-macework bg-macework/10 px-3 py-1 rounded-full">
                          {post.blog_category?.name || post.blog_category?.data?.attributes?.name || post.category || "Haber"}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">{post.read_time || post.readTime || 5} Dk</span>
                    </div>
                  
                    <h3 className="text-2xl font-semibold tracking-tight text-foreground mb-4 group-hover:text-macework transition-colors leading-tight">
                        {post.title}
                    </h3>
                  
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                        {post.summary || post.excerpt}
                    </p>
                </div>

                <div className="pt-6 border-t border-border/50">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                                {post.author ? post.author.charAt(0).toUpperCase() : 'M'}
                            </div>
                            <div>
                                <div className="text-xs font-bold">{post.author || "Macework"}</div>
                                <div className="text-[10px] text-muted-foreground">
                                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric'}) : (post.date || "Bugün")}
                                </div>
                            </div>
                         </div>
                         <div className="w-10 h-10 rounded-full bg-muted/50 border border-border flex items-center justify-center group-hover:bg-macework group-hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4" />
                         </div>
                    </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredPosts.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 text-center space-y-4"
        >
          <p className="text-xl font-bold text-muted-foreground">Henüz bu kategoride bir yazı bulunmuyor.</p>
          <button 
            onClick={() => setActiveCategory("Tümü")}
            className="text-macework font-bold hover:underline"
          >
            Tüm yazılara geri dön
          </button>
        </motion.div>
      )}
    </>
  );
}
