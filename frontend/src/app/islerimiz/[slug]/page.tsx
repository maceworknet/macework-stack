import { ArrowLeft, Calendar, CheckCircle2, Globe, Tag } from "lucide-react";
import { SubPageHeader } from "@/components/subpage-header";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichContent } from "@/components/rich-content";
import { getProjectBySlug, resolveMediaUrl } from "@/lib/cms";
import { WorkGallery } from "@/components/work-gallery";
import { ShareButtons } from "@/components/share-buttons";
import { richTextToPlainText } from "@/lib/rich-text";

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = await getProjectBySlug(slug);

  if (!work) {
    return notFound();
  }

  const images = work.gallery?.map((img: any) => resolveMediaUrl(img.url)) || [
    resolveMediaUrl(work.cover_image?.url),
  ];

  const description =
    richTextToPlainText(work.description) || richTextToPlainText(work.longDescription) || work.description;

  const storyContent = work.longDescription ?? work.long_description ?? work.description;

  return (
    <main className="min-h-screen" suppressHydrationWarning>
      <SubPageHeader badge={`Proje / ${work.year}`} title={work.title} description={description}>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 font-bold text-muted-foreground">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider">
            <Calendar className="h-4 w-4 text-macework" /> {work.year}
          </div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider">
            <Tag className="h-4 w-4 text-macework" /> {work.project_category?.name || "Proje"}
          </div>
          {work.live_url ? (
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider">
              <Globe className="h-4 w-4 text-macework" /> Yayında
            </div>
          ) : null}
        </div>
      </SubPageHeader>

      <section className="bg-background py-24">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="space-y-16 lg:col-span-8">
              <WorkGallery images={images} title={work.title} />

              <div className="space-y-6">
                <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-foreground">
                  <span className="h-7 w-1.5 rounded-full bg-macework" />
                  Proje Hikayesi
                </h2>
                <RichContent
                  content={storyContent}
                  className="prose prose-sm max-w-none leading-7 text-muted-foreground prose-headings:font-bold prose-p:my-3 prose-a:text-macework prose-li:my-1"
                />
              </div>

              {work.tags?.length ? (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">Teknoloji Yığını</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {work.tags.map((tech: string) => (
                      <div
                        key={tech}
                        className="flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-macework/20"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-macework/5 text-macework">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold tracking-tight text-foreground">
                          {tech}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="select-none lg:col-span-4">
              <div className="sticky top-32 space-y-10 rounded-[2.5rem] border border-border bg-card p-10 shadow-sm shadow-black/5">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">Proje Bilgileri</h3>
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Temel Bilgiler
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border/40 pb-4 text-foreground">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Müşteri
                    </span>
                    <span className="text-sm font-bold tracking-tight">{work.client || "Gizli"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/40 pb-4 text-foreground">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Süre
                    </span>
                    <span className="text-sm font-bold tracking-tight">4-6 Ay</span>
                  </div>
                  <div className="flex items-center justify-between text-foreground">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Yıl
                    </span>
                    <span className="text-sm font-bold tracking-tight">{work.year}</span>
                  </div>
                </div>

                <Link
                  href={work.cta_button_url || "/iletisim"}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-5 text-sm font-bold uppercase tracking-widest text-background transition-all hover:scale-[1.02] active:scale-95"
                >
                  {work.cta_button_label || "Teklif Al"}
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>

                <ShareButtons />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
