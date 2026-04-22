import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MoveRight } from "lucide-react";
import { SubPageHeader } from "@/components/subpage-header";
import { RichContent } from "@/components/rich-content";
import { getHomePage, getSolutionBySlug, getTemplates, resolveMediaUrl } from "@/lib/cms";
import { richTextToPlainText } from "@/lib/rich-text";

export default async function SolutionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [solution, homePage, templates] = await Promise.all([
    getSolutionBySlug(slug),
    getHomePage(),
    getTemplates(),
  ]);

  if (!solution) {
    return notFound();
  }

  const solutionImage = solution.cover_image?.url
    ? resolveMediaUrl(solution.cover_image.url)
    : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600";

  const shortDescription =
    richTextToPlainText(solution.short_description || solution.description) ||
    solution.short_description ||
    solution.description ||
    "";

  return (
    <main className="min-h-screen" suppressHydrationWarning>
      <SubPageHeader badge={solution.badge_text || "Cozumlerimiz"} title={solution.title} description={shortDescription}>
        <div className="mt-4 flex items-center gap-6">
          <Link
            href="/#solutions"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-6 py-2.5 text-[11px] font-bold transition-all hover:bg-muted"
          >
            <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            Cozumlere Don
          </Link>
        </div>
      </SubPageHeader>

      <section className="bg-background py-24">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="space-y-16 lg:col-span-8">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[2.5rem] border border-border/60 bg-muted/20">
                <img src={solutionImage} alt={solution.title} className="h-full w-full object-cover" />
              </div>

              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight">
                    <span className="h-7 w-1.5 rounded-full bg-macework" />
                    Hizmet Hakkinda
                  </h2>
                  <RichContent
                    content={solution.description}
                    className="prose prose-sm max-w-none leading-7 text-muted-foreground prose-headings:font-bold prose-p:my-3 prose-a:text-macework prose-li:my-1"
                  />
                </div>

                {solution.features?.length ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {solution.features.map((feature: any, idx: number) => (
                      <div
                        key={feature.documentId || feature.id || idx}
                        className="group flex items-center gap-3.5 rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-macework/20"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-macework/5 text-macework">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-semibold tracking-tight">
                          {feature.title || feature}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="select-none lg:col-span-4">
              <div className="sticky top-32 space-y-8 rounded-[2.5rem] border border-border bg-card p-8 shadow-sm shadow-black/5">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold tracking-tight">Nasil Calisiriz?</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Isleyis Sureci
                  </p>
                </div>

                <div className="space-y-6">
                  {(solution.process_steps?.length > 0 ? solution.process_steps : homePage?.process_steps || []).map(
                    (step: any, index: number) => (
                      <div key={step.documentId || step.id || index} className="group flex gap-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[13px] font-bold text-foreground transition-transform group-hover:scale-105">
                          {step.step_number || (index + 1).toString().padStart(2, "0")}
                        </div>
                        <div className="space-y-0.5 pt-0.5">
                          <h4 className="text-[13px] font-bold leading-tight tracking-tight text-foreground">
                            {step.title}
                          </h4>
                          <p className="text-[11px] leading-snug text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="border-t border-border/40 pt-6">
                  <Link
                    href="/iletisim"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-4 text-[11px] font-bold uppercase tracking-widest text-background transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Hemen Baslayalim
                    <MoveRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {["web-yazilim", "web-tasarim", "e-ticaret"].includes(slug) ? (
        <section className="border-t border-border/40 bg-muted/10 py-24">
          <div className="container">
            <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-2xl space-y-4">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-macework">
                  Ozellestirilebilir Yapilar
                </span>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Demo Sablonlarimiza Goz Atin
                </h2>
                <p className="text-lg font-normal text-muted-foreground">
                  Isletmenizin ihtiyaclarina gore uyarlanabilen, modern ve test edilmis hazir altyapilarimizi inceleyin.
                </p>
              </div>
              <Link
                href="/sablonlar"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-macework transition-all hover:underline"
              >
                Tumunu Gor
                <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {templates?.slice(0, 3).map((template, idx) => (
                <Link
                  key={template.documentId || template.id || idx}
                  href={`/sablonlar/${template.slug}`}
                  className="group space-y-4"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-border bg-muted">
                    <img
                      src={resolveMediaUrl(template.preview_image?.url)}
                      alt={template.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="text-xs font-bold uppercase tracking-widest text-white">
                        {template.category}
                      </span>
                      <h4 className="mt-1 text-xl font-bold tracking-tight text-white">
                        {template.title}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-2">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-foreground">{template.title}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {template.category}
                      </p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-all group-hover:bg-macework group-hover:text-white">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
