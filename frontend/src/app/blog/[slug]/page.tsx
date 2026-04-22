import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";
import { SubPageHeader } from "@/components/subpage-header";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichContent } from "@/components/rich-content";
import { getBlogPostBySlug, resolveMediaUrl } from "@/lib/cms";
import { ShareButtons } from "@/components/share-buttons";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  const featuredImage = post.cover_image?.url
    ? resolveMediaUrl(post.cover_image.url)
    : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000";

  const categoryName =
    post.blog_category?.name || post.blog_category?.data?.attributes?.name || post.category || "Haber";

  return (
    <main className="min-h-screen" suppressHydrationWarning>
      <SubPageHeader badge={`${categoryName} / Blog`} title={post.title} description={post.summary || post.excerpt || ""}>
        <div className="mt-4 flex items-center gap-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-6 py-2.5 text-[11px] font-bold transition-all hover:bg-muted"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Blog&apos;a Don
          </Link>
        </div>
      </SubPageHeader>

      <section className="bg-background py-24">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="space-y-16 lg:col-span-8">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] border border-border/60 bg-muted/20">
                <img src={featuredImage} alt={post.title} className="h-full w-full object-cover" />
              </div>

              <article className="prose prose-zinc max-w-none font-sans text-base leading-relaxed dark:prose-invert">
                <div className="space-y-8 text-muted-foreground">
                  {post.content ? (
                    <RichContent content={post.content} />
                  ) : (
                    <p>{post.summary || "Icerik yuklenemedi."}</p>
                  )}
                </div>
              </article>

              <div className="flex flex-wrap items-center gap-2 border-t border-border/40 pt-10">
                <span className="mr-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Etiketler:
                </span>
                <span className="rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-[10px] font-bold">
                  #MACEWORK
                </span>
                {post.tags && post.tags.length > 0 ? (
                  post.tags.map((tag: any) => (
                    <span
                      key={tag.id}
                      className="rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-[10px] font-bold"
                    >
                      #{(tag.name || tag.attributes?.name || "").toUpperCase()}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-[10px] font-bold">
                    #{categoryName.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            <div className="select-none lg:col-span-4">
              <div className="sticky top-32 space-y-10 rounded-[2.5rem] border border-border bg-card p-10 shadow-sm shadow-black/5">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">Yazi Bilgileri</h3>
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Yazar ve yayin detaylari
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border/40 pb-4 text-foreground">
                    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      <User className="h-3.5 w-3.5" /> Yazar
                    </span>
                    <span className="text-sm font-bold tracking-tight">{post.author || "Macework Ekibi"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/40 pb-4 text-foreground">
                    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" /> Tarih
                    </span>
                    <span className="text-sm font-bold tracking-tight">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("tr-TR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : post.date || "Bugun"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/40 pb-4 text-foreground">
                    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> Sure
                    </span>
                    <span className="text-sm font-bold tracking-tight">
                      {post.read_time || post.readTime || 5} Dk
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-foreground">
                    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      <Tag className="h-3.5 w-3.5" /> Kategori
                    </span>
                    <span className="text-sm font-bold tracking-tight text-macework">{categoryName}</span>
                  </div>
                </div>

                <ShareButtons />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
