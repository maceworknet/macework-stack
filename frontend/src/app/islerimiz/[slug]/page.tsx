import { ArrowLeft, CheckCircle2, Globe, Calendar, Tag } from "lucide-react";
import { SubPageHeader } from "@/components/subpage-header";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchStrapi, getStrapiMedia } from "@/lib/strapi";
import { WorkGallery } from "@/components/work-gallery";
import { ShareButtons } from "@/components/share-buttons";


export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projects = await fetchStrapi<any[]>("projects", {
    populate: '*',
    filters: { slug },
  });
  const work = projects?.[0];

  if (!work) {
    return notFound();
  }

  const images = work.gallery?.map((img: any) => getStrapiMedia(img.url)) || [
    getStrapiMedia(work.cover_image?.url)
  ];

  return (
    <main className="min-h-screen" suppressHydrationWarning>
      <SubPageHeader 
        badge={`Proje / ${work.year}`}
        title={work.title}
        description={work.description}
      >
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-muted-foreground font-bold">
             <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider"><Calendar className="w-4 h-4 text-macework" /> {work.year}</div>
             <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider"><Tag className="w-4 h-4 text-macework" /> {work.project_category?.name || "Proje"}</div>
             {work.live_url && <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider"><Globe className="w-4 h-4 text-macework" /> Yayında</div>}
          </div>
      </SubPageHeader>

      <section className="py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-16">
            
            <div className="lg:col-span-8 space-y-16">
               <WorkGallery images={images} title={work.title} />

               <div className="space-y-6">
                  <h2 className="scroll-m-20 text-2xl font-bold tracking-tight flex items-center gap-3 text-foreground">
                     <span className="w-1.5 h-7 rounded-full bg-macework" />
                     Proje Hikayesi
                   </h2>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium whitespace-pre-line">
                    {work.description}
                  </p>
               </div>

               <div className="space-y-6">
                  <h2 className="scroll-m-20 text-xl font-bold tracking-tight text-foreground">
                    Teknoloji Yığını
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                     {work.tags?.map((tech: string) => (
                       <div key={tech} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-macework/20 transition-all">
                         <div className="w-9 h-9 rounded-lg bg-macework/5 flex items-center justify-center text-macework">
                            <CheckCircle2 className="w-4 h-4" />
                         </div>
                         <span className="font-semibold text-sm tracking-tight text-foreground">{tech}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="lg:col-span-4 select-none">
               <div className="p-10 rounded-[2.5rem] bg-card border border-border sticky top-32 space-y-10 shadow-sm shadow-black/5">
                  <div className="space-y-2">
                     <h3 className="scroll-m-20 text-xl font-bold tracking-tight text-foreground">Proje Bilgileri</h3>
                     <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-none">Temel Bilgiler & Detaylar</p>
                  </div>

                  <div className="space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-border/40 text-foreground">
                        <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest">Müşteri</span>
                        <span className="font-bold text-sm tracking-tight">{work.client || "Gizlilik Kaydı"}</span>
                     </div>
                     <div className="flex justify-between items-center pb-4 border-b border-border/40 text-foreground">
                        <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest">Süre</span>
                        <span className="font-bold text-sm tracking-tight">4-6 Ay</span>
                     </div>
                     <div className="flex justify-between items-center text-foreground">
                        <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest">Yıl</span>
                        <span className="font-bold text-sm tracking-tight">{work.year}</span>
                     </div>
                  </div>
                  
                  <Link 
                    href="/contact"
                    className="flex items-center justify-center gap-2 w-full py-5 rounded-full bg-foreground text-background font-bold hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest"
                  >
                    Teklif Al
                    <ArrowLeft className="w-4 h-4 rotate-180" />
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
