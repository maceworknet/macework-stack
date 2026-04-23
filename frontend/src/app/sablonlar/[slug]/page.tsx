import { ArrowLeft, ExternalLink, Tag, Zap } from "lucide-react";
import { SubPageHeader } from "@/components/subpage-header";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichContent } from "@/components/rich-content";
import { getTemplateBySlug, resolveMediaUrl } from "@/lib/cms";
import { richTextToPlainText } from "@/lib/rich-text";

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template) return notFound();

  const previewImage = template.preview_image?.url
    ? resolveMediaUrl(template.preview_image.url)
    : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600";

  const description =
    richTextToPlainText(template.description) ||
    "İşletmeniz için yüksek performanslı dijital altyapı.";

  return (
    <main className="min-h-screen bg-background">
      <SubPageHeader badge="Hazır Şablon" title={template.title} description={description}>
        <div className="mt-6 flex items-center gap-4">
          <Link
            href="/sablonlar"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-6 py-2.5 text-[11px] font-bold transition-all hover:bg-muted"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Tüm Şablonlara Dön
          </Link>
        </div>
      </SubPageHeader>

      <section className="py-24">
        <div className="container">
          <div className="grid gap-20 lg:grid-cols-12">
            <div className="space-y-12 lg:col-span-8">
              <div className="group relative aspect-[16/10] overflow-hidden rounded-[2.5rem] border border-border/80 bg-muted/20 shadow-2xl shadow-black/5">
                <img
                  src={previewImage}
                  alt={template.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <RichContent
                content={template.description}
                className="prose prose-sm max-w-none leading-7 text-muted-foreground prose-headings:font-bold prose-p:my-3 prose-a:text-macework prose-li:my-1"
              />

              <div className="grid gap-6 sm:grid-cols-2">
                {(template.features || ["Yüksek Performans", "Mobil Uyumlu", "SEO Odaklı"]).map(
                  (feature: any, index: number) => (
                    <div
                      key={index}
                      className="group rounded-3xl border border-border/60 bg-card p-6 transition-all hover:border-macework/30"
                    >
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-macework/5 text-macework transition-transform group-hover:scale-110">
                        <Zap className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-bold">{feature.title || feature}</h4>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="select-none lg:col-span-4">
              <div className="sticky top-32 space-y-10 rounded-[2.5rem] border border-border bg-card p-10 shadow-sm shadow-black/5">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border/40 pb-4 font-medium">
                    <span className="flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      <Tag className="h-3.5 w-3.5" /> Kategori
                    </span>
                    <span className="font-sans text-sm font-bold">
                      {template.template_category?.name || "Web App"}
                    </span>
                  </div>
                </div>
                {template.demo_url ? (
                  <a
                    href={template.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-5 text-xs font-bold uppercase tracking-widest text-background shadow-lg shadow-black/10 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Canlı Demoyu Gör
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
