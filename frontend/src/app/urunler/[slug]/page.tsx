import { ArrowRight, Box, CheckCircle2, ExternalLink, Laptop, Rocket } from "lucide-react";
import { SubPageHeader } from "@/components/subpage-header";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichContent } from "@/components/rich-content";
import { getProductBySlug, resolveMediaUrl } from "@/lib/cms";
import { richTextToPlainText } from "@/lib/rich-text";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  const productImage = product.cover_image?.url
    ? resolveMediaUrl(product.cover_image.url)
    : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600";

  const headerDescription =
    richTextToPlainText(product.short_description || product.description) ||
    product.short_description ||
    product.description;

  const detailContent = product.content_blocks ?? product.long_description ?? product.description;

  return (
    <main className="min-h-screen" suppressHydrationWarning>
      <SubPageHeader
        badge={product.badge || "Ürünümüz"}
        title={product.title}
        description={headerDescription}
      >
        <div className="mt-4 flex items-center gap-6">
          <Link
            href="/#urunler"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-6 py-2.5 text-[11px] font-bold transition-all hover:bg-muted"
          >
            <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            Ürünlere Dön
          </Link>
        </div>
      </SubPageHeader>

      <section className="bg-background py-24">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="space-y-16 lg:col-span-8">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[2.5rem] border border-border/60 bg-muted/20">
                <img src={productImage} alt={product.title} className="h-full w-full object-cover" />
              </div>

              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight">
                    <span className="h-7 w-1.5 rounded-full bg-macework" />
                    Ürün Hakkında
                  </h2>
                  <RichContent
                    content={detailContent}
                    className="prose prose-sm max-w-none leading-7 text-muted-foreground prose-headings:font-bold prose-p:my-3 prose-a:text-macework prose-li:my-1"
                  />
                </div>

                {product.features && product.features.length > 0 ? (
                  <div className="space-y-8">
                    <h3 className="text-xl font-bold tracking-tight">Öne Çıkan Özellikler</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {product.features.map((feature: any, idx: number) => (
                        <div
                          key={idx}
                          className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-macework/20"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-macework/5 text-macework">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-semibold tracking-tight">
                            {feature.title || feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="select-none lg:col-span-4">
              <div className="sticky top-32 space-y-10 rounded-[2.5rem] border border-border bg-card p-10 shadow-sm shadow-black/5">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">Ürün Bilgileri</h3>
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Temel Bilgiler
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border/40 pb-4 text-foreground">
                    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      <Rocket className="h-3.5 w-3.5" /> Sürüm
                    </span>
                    <span className="text-sm font-bold tracking-tight">{product.version || "1.0.0"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/40 pb-4 text-foreground">
                    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      <Box className="h-3.5 w-3.5" /> Kategori
                    </span>
                    <span className="text-sm font-bold tracking-tight text-macework">
                      {product.category || product.tag || "Platform"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/40 pb-4 text-foreground">
                    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      <Laptop className="h-3.5 w-3.5" /> Erişim
                    </span>
                    <span className="text-sm italic tracking-tight text-foreground">
                      {product.platform_type || "Bulut (SaaS)"}
                    </span>
                  </div>
                </div>

                {product.platform_url ? (
                  <div className="pt-4">
                    <a
                      href={product.platform_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-5 text-xs font-bold uppercase tracking-widest text-background transition-all hover:scale-[1.02] active:scale-95"
                    >
                      Platforma Git
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ) : null}

                <div className="space-y-3 rounded-3xl border border-border/50 bg-muted/30 p-6 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Destek Al
                  </p>
                  <p className="text-[11px] leading-snug text-muted-foreground">
                    Bu platformla ilgili bir sorun mu yaşıyorsunuz?
                  </p>
                  <Link
                    href="/iletisim"
                    className="inline-block text-[11px] font-bold text-macework underline decoration-macework/30 underline-offset-4 transition-all hover:decoration-macework"
                  >
                    Müşteri Hizmetlerine Yazın
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
