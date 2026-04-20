"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
interface ProductCardProps {
  title: string;
  description: string;
  badge: string;
  href: string;
  category: string;
  slug: string;
}

export function ProductCard({ title, description, badge, href, category, slug }: ProductCardProps) {
  return (
    <Link 
      href={`/urunler/${slug}`} 
      className="group h-full"
    >
      <Card className="relative border bg-card text-card-foreground h-full border-border/60 hover:border-macework/50 transition-all duration-300 rounded-xl overflow-hidden flex flex-col shadow-none hover:shadow-md">
        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="w-5 h-5 text-macework" />
        </div>

        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="bg-macework/10 text-macework border-none text-[10px] uppercase tracking-widest px-2 shadow-none">
              {badge}
            </Badge>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider group-hover:opacity-0 transition-opacity">
              {category}
            </span>
          </div>
          <CardTitle className="text-xl font-bold tracking-tight group-hover:text-macework transition-colors leading-tight">
            {title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </CardContent>

        <CardFooter className="pt-0 pb-6 mt-auto">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground w-full">
            <span className="text-xs">Platformu İncele</span>
            <div className="h-px flex-1 bg-border group-hover:bg-macework/20 transition-colors" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export function ProductsSection({ products, heading }: { products: any[], heading?: string }) {
  return (
    <section id="urunler" className="py-24 bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto mb-16 space-y-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {heading || "Kendi Ürünlerimiz"}
          </h2>
          <p className="text-lg text-muted-foreground font-normal leading-relaxed">
            Macework imzasıyla geliştirdiğimiz ve aktif olarak büyüyen dijital ürün ekosistemimizi keşfedin.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product, i) => (
            <ProductCard 
              key={product.documentId || product.id || i}
              title={product.title}
              description={product.description}
              badge="ÜRÜN"
              href={product.platform_url || `#`}
              category={product.tag}
              slug={product.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


