import { ArrowRight, CheckCircle2, Box, Laptop, Rocket, ExternalLink } from "lucide-react";
import { SubPageHeader } from "@/components/subpage-header";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchStrapi, getStrapiMedia } from "@/lib/strapi";
// import { BlocksRenderer } from "@strapi/blocks-react-renderer";



import React from "react";

const StrapiBlocks = ({ content }: { content: any[] | null }) => {
  if (!content || !Array.isArray(content)) return null;
  return content.map((block: any, i: number) => {
    if (block.type === 'paragraph') {
      return <p key={i} className="mb-4">{block.children?.map((c: any, j: number) => <span key={j}>{c.text}</span>)}</p>;
    }
    if (block.type === 'heading') {
      const tag = `h${block.level || 1}` as keyof React.JSX.IntrinsicElements;
      return React.createElement(tag, { key: i, className: "text-2xl font-bold mb-4" }, block.children?.map((c: any, j: number) => <span key={j}>{c.text}</span>));
    }
    if (block.type === 'list') {
      const tag = (block.format === 'ordered' ? 'ol' : 'ul') as keyof React.JSX.IntrinsicElements;
      return React.createElement(tag, { key: i, className: "list-disc pl-6 mb-4" },
        block.children?.map((item: any, j: number) => (
          <li key={j}>{item.children?.map((c: any, k: number) => <span key={k}>{c.text}</span>)}</li>
        ))
      );
    }
    return null;
  });
};

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const products = await fetchStrapi<any[]>("products", {
    populate: '*',
    filters: { slug },
  });

  const product = products?.[0];

  if (!product) {
    return notFound();
  }

  const productImage = product.cover_image?.url 
    ? getStrapiMedia(product.cover_image.url)
    : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600";

  return (
    <main className="min-h-screen" suppressHydrationWarning>
      <SubPageHeader 
        badge={`${product.badge || "Ürünümüz"}`}
        title={product.title}
        description={product.short_description || product.description}
      >
          <div className="flex items-center gap-6 mt-4">
             <Link 
              href="/#ürünler"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-muted/60 border border-border text-[11px] font-bold hover:bg-muted transition-all"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              Ürünlere Dön
            </Link>
          </div>
      </SubPageHeader>

      <section className="py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-16">
               <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-border/60 bg-muted/20">
                  <img src={productImage} alt={product.title} className="w-full h-full object-cover" />
               </div>

               <div className="space-y-12">
                  <div className="space-y-6">
                    <h2 className="scroll-m-20 text-2xl font-bold tracking-tight flex items-center gap-3">
                        <span className="w-1.5 h-7 rounded-full bg-macework" />
                        Ürün Hakkında
                    </h2>
                    <div className="text-base text-muted-foreground leading-relaxed font-medium space-y-6">
                        {product.content_blocks ? (
                            <StrapiBlocks content={product.content_blocks} />
                        ) : (
                            <p>{product.long_description || product.description}</p>
                        )}
                    </div>
                  </div>

                  {product.features && product.features.length > 0 && (
                      <div className="space-y-8">
                        <h3 className="text-xl font-bold tracking-tight">Öne Çikan Özellikler</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {product.features.map((feature: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 group hover:border-macework/20 transition-all">
                                    <div className="w-9 h-9 rounded-lg bg-macework/5 flex items-center justify-center text-macework">
                                    <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-xs tracking-tight">{feature.title || feature}</span>
                                </div>
                            ))}
                        </div>
                      </div>
                  )}
               </div>
            </div>

            {/* Right Sticky Sidebar - Product Info Card */}
            <div className="lg:col-span-4 select-none">
               <div className="p-10 rounded-[2.5rem] bg-card border border-border sticky top-32 space-y-10 shadow-sm shadow-black/5">
                  <div className="space-y-2">
                     <h3 className="scroll-m-20 text-xl font-bold tracking-tight text-foreground">Ürün Bilgileri</h3>
                     <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-none">Proje Bilgilendirme Kartı</p>
                  </div>

                  <div className="space-y-6">
                     <div className="flex justify-between items-center pb-4 border-b border-border/40 text-foreground">
                        <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <Rocket className="w-3.5 h-3.5" /> Sürüm
                        </span>
                        <span className="font-bold text-sm tracking-tight text-foreground">{product.version || "1.0.0"}</span>
                     </div>
                     <div className="flex justify-between items-center pb-4 border-b border-border/40 text-foreground">
                        <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <Box className="w-3.5 h-3.5" /> Kategori
                        </span>
                        <span className="font-bold text-sm tracking-tight text-macework">{product.category || product.tag || "Platform"}</span>
                     </div>
                     <div className="flex justify-between items-center pb-4 border-b border-border/40 text-foreground">
                        <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <Laptop className="w-3.5 h-3.5" /> Erişim
                        </span>
                        <span className="font-bold text-sm tracking-tight text-foreground italic">{product.platform_type || "Bulut (SaaS)"}</span>
                     </div>
                  </div>
                  
                  {product.platform_url && (
                      <div className="pt-4">
                        <a 
                            href={product.platform_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-5 rounded-full bg-foreground text-background font-bold hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-widest"
                        >
                            Platforma Git
                            <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                  )}

                  <div className="p-6 rounded-3xl bg-muted/30 border border-border/50 text-center space-y-3">
                     <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Destek Al</p>
                     <p className="text-[11px] text-muted-foreground leading-snug">Bu platformla ilgili bir sorun mu yaşıyorsunuz?</p>
                     <Link href="/iletisim" className="inline-block text-[11px] font-bold text-macework underline underline-offset-4 decoration-macework/30 hover:decoration-macework transition-all">Müşteri Hizmetlerine Yazın</Link>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}