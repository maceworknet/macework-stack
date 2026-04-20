"use client";

import { SubPageHeader } from "@/components/subpage-header";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  const lastUpdate = "29 Mart 2026";

  return (
    <main className="min-h-screen font-sans">
      <SubPageHeader 
        badge="Yasal"
        title="Kullanım Koşulları"
        description={`Macework Creative hizmetlerini kullanırken tabi olduğunuz kural ve şartları inceleyin.`}
      />

      <section className="py-24 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="p-8 rounded-3xl bg-muted/30 border border-border/50 text-xs text-muted-foreground font-medium uppercase tracking-widest flex items-center justify-between">
               <span>Son Güncelleme: {lastUpdate}</span>
               <span className="text-macework">Versiyon 1.1</span>
            </div>

            <article className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
               <section className="space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground m-0">1. Kabul ve Kapsam</h2>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    Web sitemize ve sunduğumuz hizmetlere erişerek, bu kullanım koşullarını kabul etmiş sayılırsınız. Macework Creative, bu koşulları dilediği zaman güncelleme hakkını saklı tutar.
                  </p>
               </section>

               <section className="space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground m-0">2. Fikri Mülkiyet</h2>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    Sitede yer alan tüm içerik, tasarım, logo ve yazılımlar Macework Creative'e aittir. Yazılı izin alınmaksızın bunların kopyalanması, çoğaltılması veya ticari amaçla kullanılması yasaktır.
                  </p>
               </section>

               <section className="space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground m-0">3. Sorumluluk Sınırları</h2>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    Macework, sunduğu hizmetlerin kesintisiz veya hatasız olacağını garanti etmez. Sistemsel hatalar sonucunda oluşabilecek dolaylı zararlardan sorumlu tutulamaz.
                  </p>
               </section>

               <section className="space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">4. Hizmet Değişiklikleri</h2>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    Macework Creative, sunduğu platformların özelliklerini veya bu platformlara erişim şartlarını önceden bildirim yapmaksızın kısmen veya tamamen değiştirebilir ya da sonlandırabilir.
                  </p>
               </section>
            </article>

            <div className="pt-16 border-t border-border/40">
               <div className="p-10 rounded-[2.5rem] bg-card border border-border text-center space-y-8">
                  <h3 className="text-xl font-bold tracking-tight">Kullanım Şartlarını Kabul Ediyorsanız</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">Hizmetlerimizden hemen yararlanmaya başlamak için projelerimize göz atabilirsiniz.</p>
                  <Link 
                    href="/work"
                    className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-[1.02] transition-all"
                  >
                    Projelere Göz At
                    <MoveRight className="w-4 h-4" />
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
