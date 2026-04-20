"use client";

import { SubPageHeader } from "@/components/subpage-header";
import { motion } from "framer-motion";
import { Users, Target, Rocket, Heart } from "lucide-react";
import Link from "next/link";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { getStrapiMedia } from "@/lib/strapi";

export default function AboutClient({ strapiData, strapiTeam }: { strapiData?: any, strapiTeam?: any[] }) {
  // Turbopack AST Bug Fix: Pulling complex inline ternaries out of JSX brackets 
  const statsArray = strapiData?.stats || [
    {label: "Mutlu Müşteri", value: "50+"}, 
    {label: "Proje", value: "100+"}, 
    {label: "Ödül", value: "5"}
  ];
  
  const teamArray = (strapiTeam && strapiTeam.length > 0) ? strapiTeam : [
    {name: "Yaser", role: "Kurucu"}, 
    {name: "Ekip", role: "Geliştirici"}
  ];

  return (
    <main className="min-h-screen">
      <SubPageHeader 
        badge="Hakkımızda"
        title={strapiData?.heading || "Yenilikçi Teknoloji ve Tasarım Tutkusu"}
        description={strapiData?.about_description || "Macework Creativ olarak biz, dijital dünyayı şekillendiren fikirlerin ve bu fikirleri hayata geçiren teknolojinin gücüne inanıyoruz."}
      />

      <section className="py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{strapiData?.heading || "Sınırları Zorlayan Dijital Çözümler"}</h2>
                <div className="h-1.5 w-12 bg-macework rounded-full" />
              </div>
              
              <div className="prose prose-lg dark:prose-invert text-muted-foreground leading-relaxed max-w-none">
                {strapiData?.story ? (
                  <BlocksRenderer content={strapiData.story} />
                ) : (
                  <>
                    <p>Ekibimiz, her projeyi bir ürün gibi ele alan vizyoner tasarımcılar ve yetkin geliştiricilerden oluşur.</p>
                    <p>Amacımız sadece bir web sitesi veya uygulama yapmak değil; markanızın dijital dünyadaki kalıcı izini oluşturmaktır.</p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border/50">
                 <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-macework/10 flex items-center justify-center text-macework">
                       <Target className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold">Misyonumuz</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{strapiData?.mission || "Dijital alanda inovasyonu sürekli kılmak."}</p>
                 </div>
                 <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                       <Rocket className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold">Vizyonumuz</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{strapiData?.vision || "Küresel ölçekte iz bırakan bir marka yaratmak."}</p>
                 </div>
              </div>
            </div>

            <div className="relative">
               <div className="aspect-square rounded-[3rem] bg-muted overflow-hidden border border-border/50 relative shadow-2xl flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-macework/20 to-primary/20 blur-[100px] opacity-30" />
                  {strapiData?.about_image ? (
                    <img 
                      src={getStrapiMedia(strapiData.about_image.url)} 
                      alt={strapiData.heading} 
                      className="w-full h-full object-cover relative z-10"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Heart className="w-32 h-32 text-macework animate-pulse opacity-20" />
                    </div>
                  )}
               </div>
               
               <div className="absolute -bottom-10 -left-10 grid grid-cols-2 gap-4">
                  {statsArray.slice(0, 4).map((stat: any, idx: number) => (
                    <motion.div 
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-6 rounded-3xl bg-card border border-border shadow-xl backdrop-blur-md"
                    >
                      <div className="text-2xl font-black text-macework">{stat.value}</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                    </motion.div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30 border-t border-border/50">
         <div className="container">
            <div className="text-center mb-16 space-y-4">
               <h2 className="text-3xl font-bold tracking-tight">Uzman Kadromuz</h2>
               <p className="text-muted-foreground max-w-xl mx-auto">Modern teknolojileri kullanan, yaratıcı ve enerjik ekibimizle tanışın.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {teamArray.map((member: any, idx: number) => (
                 <motion.div 
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 rounded-[2.5rem] bg-card border border-border group hover:border-macework/50 transition-all text-center"
                 >
                    <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden ring-4 ring-muted group-hover:ring-macework/20 transition-all relative">
                        <div className="w-full h-full bg-muted flex items-center justify-center text-2xl font-black">
                            {member.name.charAt(0)}
                        </div>
                    </div>
                    <h4 className="text-lg font-bold group-hover:text-macework transition-colors">{member.name}</h4>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-6">{member.role}</p>
                    
                    <div className="flex justify-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-macework hover:text-white transition-colors cursor-pointer">
                            <span className="sr-only">Social</span>
                            <Users className="w-3.5 h-3.5" />
                        </div>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      <section className="py-24">
         <div className="container">
            <div className="p-12 md:p-20 rounded-[3rem] bg-card text-card-foreground border border-border/60 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-96 h-96 bg-macework/10 blur-[120px] -mr-48 -mt-48"></div>
                <h2 className="text-3xl md:text-4xl font-bold mb-8 relative z-10">Birlikte Değer Yaratalım</h2>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 relative z-10">Vizyonunuzu teknik mükemmeliyetle buluşturmak için buradayiz.</p>
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link 
                    href="/iletisim"
                    className="bg-macework hover:bg-macework-hover text-white px-10 py-4 rounded-full font-bold text-lg transition-all active:scale-95"
                  >
                    Hemen Başlayalım
                  </Link>
                </div>
            </div>
         </div>
      </section>
    </main>
  );
}
