"use client";
import { ArrowLeft, ExternalLink, Tag, Globe, Layers, Zap } from "lucide-react";
import { SubPageHeader } from "@/components/subpage-header";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchStrapi, getStrapiMedia } from "@/lib/strapi";
import { useEffect, useState, use } from "react";

export default function TemplateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
        fetchStrapi("templates", { populate: "*", filters: { slug: slug } })
            .then(res => {
            if (res && res.length > 0) setTemplate(res[0]);
            setLoading(false);
            })
            .catch(() => setLoading(false));
    }
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Yükleniyor...</div>;
  if (!template) return notFound();

  const previewImage = template.preview_image?.url 
    ? getStrapiMedia(template.preview_image.url) 
    : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600";

  return (
    <main className="min-h-screen bg-background">
      <SubPageHeader 
        badge="Hazır Şablon"
        title={template.title}
        description={template.description || "İşletmeniz için yüksek performanslı dijital altyapı."}
      >
          <div className="flex items-center gap-4 mt-6">
             <Link 
              href="/sablonlar"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-muted/60 border border-border text-[11px] font-bold hover:bg-muted transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Tüm Şablonlara Dön
            </Link>
          </div>
      </SubPageHeader>

      <section className="py-24">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-20">
            <div className="lg:col-span-8 space-y-12">
               <div className="group relative aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-border/80 bg-muted/20 shadow-2xl shadow-black/5">
                  <img src={previewImage} alt={template.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               </div>

               <div className="grid sm:grid-cols-2 gap-6">
                  {(template.features || ["Yüksek Performans", "Mobil Uyumlu", "SEO Odaklı"]).map((f, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-card border border-border/60 hover:border-macework/30 transition-all group">
                       <div className="w-10 h-10 rounded-2xl bg-macework/5 flex items-center justify-center text-macework mb-4 group-hover:scale-110 transition-transform">
                          <Zap className="w-5 h-5" />
                       </div>
                       <h4 className="font-bold text-sm mb-2">{f.title || f}</h4>
                    </div>
                  ))}
               </div>
            </div>

            <div className="lg:col-span-4 select-none">
               <div className="p-10 rounded-[2.5rem] bg-card border border-border sticky top-32 space-y-10 shadow-sm shadow-black/5">
                  <div className="space-y-6">
                     <div className="flex justify-between items-center pb-4 border-b border-border/40 font-medium">
                        <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 font-sans"><Tag className="w-3.5 h-3.5" /> Kategori</span>
                        <span className="text-sm font-bold font-sans">{template.template_category?.name || "Web App"}</span>
                     </div>
                  </div>
                  {template.demo_url && (
                    <a href={template.demo_url} target="_blank" className="flex items-center justify-center gap-2 w-full py-5 rounded-full bg-foreground text-background font-bold hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-widest shadow-lg shadow-black/10 font-sans">
                      Canlı Demoyu Gör
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
               </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
