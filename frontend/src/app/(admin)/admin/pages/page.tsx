import Link from "next/link";
import { ArrowRight, ExternalLink, FileText } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getManagedPagesByGroup, managedPages } from "@/lib/page-settings";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


const groups = [
  {
    key: "page",
    title: "Sayfalar",
    description: "Ana sayfa ve ziyaretciye acik icerik sayfalari.",
  },
  {
    key: "layout",
    title: "Header / Footer",
    description: "Tum sitede ortak kullanilan global alanlar.",
  },
] as const;

export default function AdminPagesPage() {
  const totalSections = managedPages.reduce((total, page) => total + page.sections.length, 0);

  return (
    <>
      <AdminPageHeader
        title="Sayfalar"
        description="Site bolumlerini kademeli olarak panelden yonetilebilir hale getirmek icin Faz 11 kapsamindaki alanlar."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-muted-foreground">Yonetilecek ekran</p>
            <p className="mt-3 text-3xl font-bold text-foreground">{managedPages.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-muted-foreground">Planlanan alan</p>
            <p className="mt-3 text-3xl font-bold text-foreground">{totalSections}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-muted-foreground">Aktif faz</p>
            <p className="mt-3 text-3xl font-bold text-foreground">11A</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 space-y-8">
        {groups.map((group) => {
          const pages = getManagedPagesByGroup(group.key);

          return (
            <section key={group.key}>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-foreground">{group.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {pages.map((page) => {
                  const visibleSections = page.sections.slice(0, 4);
                  const hiddenCount = page.sections.length - visibleSections.length;

                  return (
                    <Card key={page.id} className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-macework/10 text-macework">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-bold text-foreground">{page.title}</h3>
                              <Badge variant="secondary" className="bg-muted text-muted-foreground border-none font-bold">
                                {page.phase}
                              </Badge>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                              {page.description}
                            </p>
                          </div>
                        </div>

                        <ul className="mt-5 grid gap-2 text-sm text-muted-foreground">
                          {visibleSections.map((section) => (
                            <li key={section} className="rounded-md bg-muted/40 px-3 py-2">
                              {section}
                            </li>
                          ))}
                          {hiddenCount > 0 ? (
                            <li className="rounded-md bg-muted/40 px-3 py-2 font-bold text-foreground">
                              +{hiddenCount} alan daha
                            </li>
                          ) : null}
                        </ul>

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                          <Link
                            href={page.adminHref}
                            className={buttonVariants({
                              className: "gap-2 h-10 px-4 text-sm font-bold bg-macework hover:bg-macework/90 text-white"
                            })}
                          >
                            Duzenle
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                          {page.publicHref ? (
                            <Link
                              href={page.publicHref}
                              target="_blank"
                              className={buttonVariants({
                                variant: "outline",
                                className: "gap-2 h-10 px-4 text-sm font-bold bg-background hover:bg-muted text-muted-foreground hover:text-foreground"
                              })}
                            >
                              Sitede gor
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
