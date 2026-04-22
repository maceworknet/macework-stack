import { MoveRight } from "lucide-react";
import { SubPageHeader } from "@/components/subpage-header";
import Link from "next/link";
import { WorkList } from "@/components/work-list";
import { getProjectCategories, getProjects, getProjectsPageSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "İşlerimiz | Macework",
  description: "Dijitalde iz bırakan, problem çözen ve binlerce kullanıcıya ulaşan projelerimizden bazıları."
};

export default async function WorksPage() {
  const [projects, categories, pageSettings] = await Promise.all([
    getProjects(),
    getProjectCategories(),
    getProjectsPageSettings()
  ]);

  return (
    <main className="min-h-screen">
      <SubPageHeader 
        badge={pageSettings?.eyebrow || "İşlerimiz"}
        title={pageSettings?.heading || "Neler Yaptık?"}
        description={pageSettings?.description || "Dijitalde iz bırakan, problem çözen ve binlerce kullanıcıya ulaşan projelerimizden bazıları."}
      />

      <section className="py-20 bg-background">
        <div className="container">
          <WorkList works={projects} categories={categories} />

          {/* CTA Section - Normalized with About Page CTA */}
          <div className="mt-32 p-12 md:p-20 rounded-[3rem] bg-card border border-border/60 relative overflow-hidden text-center">
             <div className="absolute top-0 right-0 w-96 h-96 bg-macework/10 blur-[120px] -mr-48 -mt-48"></div>
             <div className="relative z-10 space-y-10">
                 <h2 className="scroll-m-20 text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                    {pageSettings?.cta_heading || "Sizin Projeniz de Burada Olmalı mı?"}
                 </h2>
                 <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                     {pageSettings?.cta_description || "Markanız için en doğru teknoloji stratejisini belirleyelim ve birlikte dijitalin kurallarını yeniden yazalım."}
                 </p>
                 <Link 
                    href={pageSettings?.cta_button_url || "/iletisim"}
                    className="inline-flex items-center gap-2 bg-macework hover:bg-macework-hover text-white px-10 py-5 rounded-full text-lg font-bold transition-all group active:scale-95"
                 >
                    {pageSettings?.cta_button_label || "Proje Başlat"}
                    <MoveRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                 </Link>
             </div>
          </div>
        </div>
      </section>
    </main>
  );
}
