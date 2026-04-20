"use client";

import { Layers, Server, Zap, Palette } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { getStrapiMedia } from "@/lib/strapi";

const icons: Record<string, React.ElementType> = {
  "layers": Layers,
  "server": Server,
  "zap": Zap,
  "palette": Palette
};

export function WhyMaceworkSection({ data }: { data?: any }) {
  const heading = data?.why_macework_heading || "Neden Macework?";
  const description = data?.why_macework_description || "Sunduğumuz hizmetlerdeki temel odak noktamız...";
  const features = data?.why_macework_features || [];

  return (
    <section id="about" className="py-24 overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              {heading}
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-xl leading-relaxed">
              {description}
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((reason: any, idx: number) => {
                const Icon = icons[reason.icon || "zap"] || Zap;
                return (
                  <div key={idx} className="space-y-3">
                    <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-macework">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-lg tracking-tight">{reason.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-macework/5 blur-[100px] rounded-full"></div>
            
            {data?.why_macework_image?.url ? (
               <img 
                 src={getStrapiMedia(data.why_macework_image.url)} 
                 alt="Neden Macework" 
                 className="relative z-10 w-full rounded-2xl object-cover shadow-2xl border border-border/50"
               />
            ) : (
                <Card className="relative border-border/60 bg-card/50 backdrop-blur-sm p-8 rounded-xl overflow-hidden shadow-sm">
                  <CardContent className="p-0 space-y-6">
                    <div className="flex items-center gap-4 border-b border-border pb-6">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-macework text-xs">M</div>
                        <div>
                          <div className="font-semibold text-sm">Next-Gen Delivery</div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Standardized Quality</div>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                              <div className="h-2 w-24 bg-muted-foreground/20 rounded-full"></div>
                            </div>
                            <div className="h-2 w-12 bg-macework/20 rounded-full"></div>
                          </div>
                        ))}
                    </div>
                    
                    <div className="pt-4 px-2">
                        <div className="h-32 w-full flex items-end gap-1.5">
                          {[30, 60, 40, 90, 50, 80, 55, 75, 45, 95].map((h, i) => (
                            <div key={i} className="flex-1 bg-macework/10 hover:bg-macework/30 transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
                          ))}
                        </div>
                    </div>
                  </CardContent>
                </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

