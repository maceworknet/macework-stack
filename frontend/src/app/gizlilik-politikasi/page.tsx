"use client";

import { SubPageHeader } from "@/components/subpage-header";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  const lastUpdate = "29 Mart 2026";

  return (
    <main className="min-h-screen">
      <SubPageHeader 
        badge="Yasal"
        title="Gizlilik Politikası"
        description={`Macework Creative olarak verilerinizin güvenliği ve gizliliğine en az sizin kadar önem veriyoruz.`}
      />

      <section className="py-24 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="p-8 rounded-3xl bg-muted/30 border border-border/50 text-xs text-muted-foreground font-medium uppercase tracking-widest flex items-center justify-between">
               <span>Son Güncelleme: {lastUpdate}</span>
               <span className="text-macework">Versiyon 1.2</span>
            </div>

            <article className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
               <section className="space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">1. Veri Toplama</h2>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    Hizmetlerimizi kullanırken, size daha iyi bir deneyim sunabilmek adına belirli kişisel verileri topluyoruz. Bu veriler; adınız, e-posta adresiniz, kullanım alışkanlıklarınız ve teknik cihaz bilgilerinizi kapsayabilir.
                  </p>
               </section>

               <section className="space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">2. Verilerin Kullanımı</h2>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    Topladığımız verileri; hizmetlerimizi optimize etmek, size özel içerikler sunmak ve teknik destek süreçlerini yürütmek amacıyla kullanıyoruz. Verileriniz asla üçüncü taraflarla ticari bir amaçla paylaşılmaz.
                  </p>
               </section>

               <section className="space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">3. Çerezler (Cookies)</h2>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    Web sitemizde kullanıcı deneyimini artırmak için çerezler kullanılmaktadır. Tarayıcı ayarlarınız üzerinden çerez kullanımını kısıtlayabilirsiniz ancak bu durum sitemizin bazı özelliklerinin çalışmasını etkileyebilir.
                  </p>
               </section>

               <section className="space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">4. Güvenlik</h2>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    Macework, verilerinizi korumak için endüstri standardı şifreleme ve güvenlik protokollerini kullanır. Sistemlerimiz düzenli olarak güvenlik açıklarına karşı taranmaktadır.
                  </p>
               </section>
            </article>

            <div className="pt-16 border-t border-border/40">
               <div className="p-10 rounded-[2.5rem] bg-card border border-border text-center space-y-8">
                  <h3 className="text-xl font-bold tracking-tight">Kafanıza Takılan Bir Şey mi Var?</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">Veri gizliliği süreçlerimizle ilgili daha detaylı bilgi almak isterseniz bizimle iletişime geçebilirsiniz.</p>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-[1.02] transition-all"
                  >
                    Bize Ulaşın
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
