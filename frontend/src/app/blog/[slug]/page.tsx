import { ArrowLeft, Clock, Calendar, Tag, User } from "lucide-react";
import { SubPageHeader } from "@/components/subpage-header";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchStrapi, getStrapiMedia } from "@/lib/strapi";
// import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { ShareButtons } from "@/components/share-buttons";



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

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  console.log("Requested slug:", slug);
  const posts = await fetchStrapi<any[]>("blog-posts", {
    populate: ['blog_category', 'tags', 'cover_image', 'seo'],
    filters: { slug },
  });

  const post = posts?.[0];
  console.log("Found post:", post?.slug || "NOT FOUND");


  if (!post) {
    return notFound();
  }

  const featuredImage = post.cover_image?.url 
    ? getStrapiMedia(post.cover_image.url)
    : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000";

  const categoryName = post.blog_category?.name || post.blog_category?.data?.attributes?.name || post.category || "Haber";
  
  return (
    <main className="min-h-screen" suppressHydrationWarning>
      <SubPageHeader 
        badge={`${categoryName} / Blog`}
        title={post.title}
        description={post.summary || post.excerpt || ""}
      >
          <div className="flex items-center gap-6 mt-4">
             <Link 
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-muted/60 border border-border text-[11px] font-bold hover:bg-muted transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Blog'a Dön
            </Link>
          </div>
      </SubPageHeader>

      <section className="py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-16">
            
            <div className="lg:col-span-8 space-y-16">
               <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-border/60 bg-muted/20">
                  <img src={featuredImage} alt={post.title} className="w-full h-full object-cover" />
               </div>

               <article className="prose prose-zinc dark:prose-invert max-w-none font-sans text-base leading-relaxed">
                  <div className="text-muted-foreground space-y-8">
                     {post.content ? (
                        <StrapiBlocks content={post.content} />
                     ) : (
                        <p>{post.summary || "İçerik yüklenemedi."}</p>
                     )}
                  </div>
               </article>

               <div className="pt-10 border-t border-border/40 flex items-center flex-wrap gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1">Etiketler:</span>
                  <span className="text-[10px] px-3 py-1 bg-muted/50 border border-border/50 rounded-full font-bold">#MACEWORK</span>
                  {post.tags && post.tags.length > 0 ? (
                    post.tags.map((tag: any) => (
                      <span key={tag.id} className="text-[10px] px-3 py-1 bg-muted/50 border border-border/50 rounded-full font-bold">#{(tag.name || tag.attributes?.name || "").toUpperCase()}</span>
                    ))
                  ) : (
                    <span className="text-[10px] px-3 py-1 bg-muted/50 border border-border/50 rounded-full font-bold">#{categoryName.toUpperCase()}</span>
                  )}
               </div>
            </div>

            <div className="lg:col-span-4 select-none">
               <div className="p-10 rounded-[2.5rem] bg-card border border-border sticky top-32 space-y-10 shadow-sm shadow-black/5">
                  <div className="space-y-2">
                     <h3 className="scroll-m-20 text-xl font-bold tracking-tight text-foreground">Yazı Bilgileri</h3>
                     <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Yazar & Yayın Detayları</p>
                  </div>

                  <div className="space-y-6">
                     <div className="flex justify-between items-center pb-4 border-b border-border/40 text-foreground">
                        <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"><User className="w-3.5 h-3.5" /> Yazar</span>
                        <span className="font-bold text-sm tracking-tight">{post.author || "Macework Ekibi"}</span>
                     </div>
                     <div className="flex justify-between items-center pb-4 border-b border-border/40 text-foreground">
                        <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Tarih</span>
                        <span className="font-bold text-sm tracking-tight">
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric'}) : (post.date || "Bugün")}
                        </span>
                     </div>
                     <div className="flex justify-between items-center pb-4 border-b border-border/40 text-foreground">
                        <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Süre</span>
                        <span className="font-bold text-sm tracking-tight">{post.read_time || post.readTime || 5} Dk</span>
                     </div>
                     <div className="flex justify-between items-center text-foreground">
                        <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"><Tag className="w-3.5 h-3.5" /> Kategori</span>
                        <span className="font-bold text-sm text-macework tracking-tight">{categoryName}</span>
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
