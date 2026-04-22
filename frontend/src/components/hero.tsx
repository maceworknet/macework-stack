"use client";


import Link from "next/link";
import { ArrowRight, MoveRight, ChevronRight } from "lucide-react";
import { InfiniteGrid } from "./ui/the-infinite-grid";
import { resolveMediaUrl } from "@/lib/media";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.4,
    },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
} as const;

export function Hero({ data }: { data: any }) {
  return (
    <InfiniteGrid className="pt-52 pb-16 lg:pt-64 lg:pb-24 w-full flex flex-col justify-center">
      <div className="container relative z-10">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center max-w-5xl mx-auto relative -top-20"
        >
          {/* Badge */}
          <motion.div variants={item} className="mb-10">
            <Link 
              href="#products" 
              className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-[13px] font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all backdrop-blur-sm group"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-macework animate-pulse" />
              {data.hero_badge || "Yaratıcı Teknoloji Stüdyosu"}
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
          
          {/* Title */}
          <motion.h1 
            variants={item}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-8 whitespace-pre-line leading-[1.2] text-gradient pb-2"
          >
            {(data.hero_heading || "").replace(/\n/g, ' ')}
          </motion.h1>
          
          {/* Description */}
          <motion.p 
            variants={item}
            className="text-base md:text-lg text-muted-foreground mb-12 leading-relaxed max-w-3xl font-medium"
          >
            {data.hero_subheading}
          </motion.p>
          
          {/* CTAs */}
          <motion.div 
            variants={item}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Button asChild size="lg" className="h-12 px-8 rounded-full bg-macework hover:bg-macework-hover text-white shadow-[0_10px_30px_-10px_rgba(225,29,72,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Link href={data.hero_cta_primary_url || "#"}>
                {data.hero_cta_primary_label || "İncele"}
                <MoveRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="h-12 px-8 rounded-full border-border/50 backdrop-blur-sm bg-background/50 hover:bg-muted/50 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Link href={data.hero_cta_secondary_url || "#"}>
                {data.hero_cta_secondary_label || "Ürünler"}
                <ArrowRight className="ml-2 w-4 h-4 text-muted-foreground" />
              </Link>
            </Button>
          </motion.div>

          {/* Brands Slider */}
          <motion.div 
             variants={item}
             className="mt-12 w-full max-w-4xl mx-auto overflow-hidden pause-marquee"
          >
             <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50 mb-10 text-center">
               {data.trusted_brands_heading || "REFERANSLARIMIZ & ÜRÜNLERİMİZ"}
             </p>
             <div className="relative group/slider [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
                <div className="flex w-fit gap-16 items-center animate-marquee whitespace-nowrap">
                   {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex gap-16 items-center">
                         {data.trusted_brands_logos?.length > 0 ? (
                            data.trusted_brands_logos.map((logo: any, j: number) => {
                               const image = (
                                 <img
                                   src={resolveMediaUrl(logo.url)}
                                   alt={logo.alternativeText || `Brand ${j}`}
                                   className="h-8 max-w-[140px] object-contain opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                                 />
                               );

                               return logo.href ? (
                                 <Link key={`${i}-${j}`} href={logo.href} target="_blank">
                                   {image}
                                 </Link>
                               ) : (
                                 <span key={`${i}-${j}`}>{image}</span>
                               );
                            })
                         ) : (
                            ["Qrgetir", "Carigetir", "SociaMind", "byoo.pro"].map((p, j) => (
                                <span key={`${i}-${j}`} className="text-xl md:text-2xl font-bold tracking-tight text-foreground/40 hover:text-foreground transition-colors cursor-default select-none">
                                   {p}
                                </span>
                            ))
                         )}
                      </div>
                   ))}
                </div>
             </div>
          </motion.div>
        </motion.div>
      </div>
    </InfiniteGrid>
  );
}
