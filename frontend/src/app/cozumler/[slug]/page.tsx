import { notFound } from "next/navigation";
import Link from "next/link";
import { SubPageHeader } from "@/components/subpage-header";
import { ArrowRight, CheckCircle2, MoveRight } from "lucide-react";
import { fetchStrapi, getStrapiMedia } from "@/lib/strapi";


export default async function SolutionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [solutions, homePage, templates] = await Promise.all([
    fetchStrapi<any[]>("solutions", { populate: '*', filters: { slug } }),
    fetchStrapi<any>("home-page", { populate: '*' }),
    fetchStrapi<any[]>("templates", { populate: '*' })
  ]);

  const solution = solutions?.[0];

  if (!solution) {
    return notFound();
  }

  const solutionImage = solution.cover_image?.url 
    ? getStrapiMedia(solution.cover_image.url) 
    : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600";
    
  // Assuming short_description for header, description mapped to features etc.
  const shortDesc = solution.short_description || solution.description || "";

  return (
    <main className="min-h-screen" suppressHydrationWarning>
      <SubPageHeader 
        badge={solution.badge_text || "Çözümlerimiz"}
        title={solution.title}
        description={shortDesc}
      >
          <div className="flex items-center gap-6 mt-4">
             <Link 
              href="/#solutions"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-muted/60 border border-border text-[11px] font-bold hover:bg-muted transition-all"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              Çözümlere Dön
            </Link>
          </div>
      </SubPageHeader>

      <section className="py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* Left Column - SEO Rich Content */}
            <div className="lg:col-span-8 space-y-16">
               <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-border/60 bg-muted/20">
                  <img src={solutionImage} alt={solution.title} className="w-full h-full object-cover" />
               </div>

               <div className="space-y-12">
                  <div className="space-y-6">
                    <h2 className="scroll-m-20 text-2xl font-bold tracking-tight flex items-center gap-3">
                        <span className="w-1.5 h-7 rounded-full bg-macework" />
                        Hizmet Hakkında
                    </h2>
                    <p className="text-base text-muted-foreground leading-relaxed font-medium">
                        {solution.description || shortDesc} 
                        Macework olarak sunduğumuz bu çözümde, markanızın dijital dünyadaki varlığını en üst seviyeye taşımak için modern teknolojileri ve kullanıcı odaklı tasarım prensiplerini birleştiriyoruz. 
                        Ölçeklenebilir, güvenli ve performans odaklı yapılarla işinizi büyütmenize yardımcı oluyoruz.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {solution.features?.map((feature: any, idx: number) => (
                      <div key={feature.documentId || feature.id || idx} className="flex items-center gap-3.5 p-4 rounded-xl bg-card border border-border/50 group hover:border-macework/20 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-macework/5 flex items-center justify-center text-macework shrink-0">
                           <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-xs tracking-tight">{feature.title || feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-8 pt-8">
                     <h3 className="text-xl font-bold tracking-tight">Neden Bu Çözümü Seçmelisiniz?</h3>
                     <p className="text-base text-muted-foreground leading-relaxed">
                        Pazardaki standart çözümlerin aksine, biz her projeyi bir "ürün" vizyonuyla ele alıyoruz. Bu çözümle birlikte sadece bir teknik hizmet değil, aynı zamanda uzun vadeli bir teknoloji partnerliği kazanırsınız. 
                        Sürekli güncel tutulan altyapılarımız ve veri odaklı yaklaşımımızla rakiplerinizin bir adım önünde olmanızı sağlıyoruz.
                     </p>
                     <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200" alt="Hizmet Detay" className="rounded-2xl border border-border/40" />
                  </div>
               </div>
            </div>

            {/* Right Sticky Sidebar - Process Card */}
            <div className="lg:col-span-4 select-none">
               <div className="p-8 rounded-[2.5rem] bg-card border border-border sticky top-32 space-y-8 shadow-sm shadow-black/5">
                  <div className="space-y-1">
                     <h3 className="scroll-m-20 text-lg font-bold tracking-tight">Nasıl Çalışırız?</h3>
                     <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">İşleyiş Süreci</p>
                  </div>

                  <div className="space-y-6">
                     {(solution.process_steps?.length > 0 ? solution.process_steps : (homePage?.process_steps || [])).map((step: any, i: number) => {
                        return (
                           <div key={step.documentId || step.id || i} className="flex gap-4 group">
                              <div className="w-9 h-9 rounded-full border border-border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 text-foreground bg-background text-[13px] font-bold">
                                 {step.step_number || (i + 1).toString().padStart(2, '0')}
                              </div>
                              <div className="space-y-0.5 pt-0.5">
                                 <h4 className="text-[13px] font-bold tracking-tight leading-tight text-foreground">{step.title}</h4>
                                 <p className="text-[11px] text-muted-foreground leading-snug">{step.description}</p>
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  <div className="pt-6 border-t border-border/40">
                    <Link 
                        href="/contact"
                        className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-foreground text-background font-bold hover:scale-[1.02] active:scale-95 transition-all text-[11px] uppercase tracking-widest"
                    >
                        Hemen Başlayalım
                        <MoveRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Conditionally show Template Browsing for Web/E-comm/Design */}
      {slug && ['web-yazilim', 'web-tasarim', 'e-ticaret'].includes(slug.toString()) && (
        <section className="py-24 border-t border-border/40 bg-muted/10">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="max-w-2xl space-y-4">
                <span className="text-macework text-xs font-bold uppercase tracking-[0.2em]">Özelleştirilebilir Yapılar</span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Demo Şablonlarımıza Göz Atın</h2>
                <p className="text-lg text-muted-foreground font-normal">
                   İşletmenizin ihtiyaçlarına göre uyarlanabilen, modern ve test edilmiş hazır altyapılarımızı inceleyin.
                </p>
              </div>
              <Link 
                href="/sablonlar" 
                className="group inline-flex items-center gap-2 text-sm font-semibold text-macework hover:underline transition-all"
              >
                Tümünü Gör
                <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {templates?.slice(0, 3).map((template, idx) => (
                <Link 
                    key={template.documentId || template.id || idx} 
                    href={`/sablonlar/${template.slug}`}
                    className="group space-y-4"
                >
                   <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden border border-border bg-muted">
                      <img 
                        src={getStrapiMedia(template.preview_image?.url)} 
                        alt={template.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                         <span className="text-white font-bold text-xs uppercase tracking-widest">{template.category}</span>
                         <h4 className="text-white font-bold text-xl tracking-tight mt-1">{template.title}</h4>
                      </div>
                   </div>
                   <div className="flex items-center justify-between px-2">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-foreground">{template.title}</h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{template.category}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-macework group-hover:text-white transition-all">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                   </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
