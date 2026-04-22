"use client";

import { SubPageHeader } from "@/components/subpage-header";
import { motion } from "framer-motion";
import { Users, Target, Rocket, Heart } from "lucide-react";
import Link from "next/link";
import { resolveMediaUrl } from "@/lib/media";

function RichContent({ content }: { content: any }) {
  if (typeof content === "string") {
    if (content.includes("<")) {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }

    return (
      <>
        {content.split(/\n{2,}/).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </>
    );
  }

  if (Array.isArray(content)) {
    return (
      <>
        {content.map((block: any, index: number) => {
          if (block.type === "paragraph") {
            return (
              <p key={index}>
                {block.children?.map((child: any, childIndex: number) => (
                  <span key={childIndex}>{child.text}</span>
                ))}
              </p>
            );
          }
          return null;
        })}
      </>
    );
  }

  return null;
}

export default function AboutClient({
  data,
  team,
}: {
  data?: any;
  team?: any[];
}) {
  const statsArray = data?.stats || [
    { label: "Tamamlanan Proje", value: "100+" },
    { label: "Mutlu Musteri", value: "50+" },
    { label: "Gelistirilen Urun", value: "12+" },
    { label: "Uzman Ekip", value: "8+" },
  ];
  const aboutImageUrl =
    typeof data?.about_image === "string" ? data.about_image : data?.about_image?.url;
  const visualMode = data?.about_visual_mode || "card";

  const teamArray =
    team && team.length > 0
      ? team
      : [
          { name: "Yaser", role: "Kurucu" },
          { name: "Ekip", role: "Gelistirici" },
        ];

  return (
    <main className="min-h-screen">
      <SubPageHeader
        badge={data?.eyebrow || "Hakkimizda"}
        title={data?.heading || "Yenilikci Teknoloji ve Tasarim Tutkusu"}
        description={
          data?.about_description ||
          "Macework Creativ olarak biz, dijital dunyayi sekillendiren fikirlerin ve bu fikirleri hayata geciren teknolojinin gucune inaniyoruz."
        }
      />

      <section className="py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {data?.story_heading || "Biz Kimiz"}
                </h2>
                <div className="h-1.5 w-12 bg-macework rounded-full" />
              </div>

              <div className="prose prose-lg dark:prose-invert text-muted-foreground leading-relaxed max-w-none">
                {data?.story ? (
                  <RichContent content={data.story} />
                ) : (
                  <>
                    <p>
                      Ekibimiz, her projeyi bir urun gibi ele alan vizyoner
                      tasarimcilar ve yetkin gelistiricilerden olusur.
                    </p>
                    <p>
                      Amacimiz sadece bir web sitesi veya uygulama yapmak degil;
                      markanizin dijital dunyadaki kalici izini olusturmaktir.
                    </p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border/50">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-macework/10 flex items-center justify-center text-macework">
                    <Target className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold">{data?.mission_heading || "Misyonumuz"}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {data?.mission || "Dijital alanda inovasyonu surekli kilmak."}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold">{data?.vision_heading || "Vizyonumuz"}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {data?.vision || "Kuresel olcekte iz birakan bir marka yaratmak."}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-0 aspect-square rounded-[3rem] bg-muted overflow-hidden border border-border/50 shadow-2xl flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-macework/20 to-primary/20 blur-[100px] opacity-30" />
                {visualMode === "image" && aboutImageUrl ? (
                  <img
                    src={resolveMediaUrl(aboutImageUrl)}
                    alt={data.heading}
                    className="w-full h-full object-cover relative z-10"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="w-32 h-32 text-macework animate-pulse opacity-20" />
                  </div>
                )}
              </div>

              <div className="absolute -bottom-10 -left-10 z-20 grid grid-cols-2 gap-4">
                {statsArray.slice(0, 4).map((stat: any, idx: number) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 rounded-3xl bg-card border border-border shadow-xl backdrop-blur-md"
                  >
                    <div className="text-2xl font-black text-macework">
                      {stat.value}
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {stat.label}
                    </div>
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
            <h2 className="text-3xl font-bold tracking-tight">
              {data?.team_heading || "Uzman Kadromuz"}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {data?.team_description ||
                "Modern teknolojileri kullanan, yaratici ve enerjik ekibimizle tanisin."}
            </p>
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
                  {member.image ? (
                    <img
                      src={resolveMediaUrl(member.image)}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-2xl font-black">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h4 className="text-lg font-bold group-hover:text-macework transition-colors">
                  {member.name}
                </h4>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-6">
                  {member.role}
                </p>
                {member.bio ? (
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    {member.bio}
                  </p>
                ) : null}

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
            <h2 className="text-3xl md:text-4xl font-bold mb-8 relative z-10">
              {data?.cta_heading || "Birlikte Deger Yaratalim"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 relative z-10">
              {data?.cta_description ||
                "Vizyonunuzu teknik mukemmeliyetle bulusturmak icin buradayiz."}
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={data?.cta_button_url || "/iletisim"}
                className="bg-macework hover:bg-macework-hover text-white px-10 py-4 rounded-full font-bold text-lg transition-all active:scale-95"
              >
                {data?.cta_button_label || "Hemen Baslayalim"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
