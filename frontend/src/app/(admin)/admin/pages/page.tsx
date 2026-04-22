import Link from "next/link";
import { ArrowRight, ExternalLink, FileText } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getManagedPagesByGroup, managedPages } from "@/lib/page-settings";

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
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm font-bold text-muted-foreground">Yonetilecek ekran</p>
          <p className="mt-3 text-3xl font-black">{managedPages.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm font-bold text-muted-foreground">Planlanan alan</p>
          <p className="mt-3 text-3xl font-black">{totalSections}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm font-bold text-muted-foreground">Aktif faz</p>
          <p className="mt-3 text-3xl font-black">11A</p>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {groups.map((group) => {
          const pages = getManagedPagesByGroup(group.key);

          return (
            <section key={group.key}>
              <div className="mb-4">
                <h2 className="text-xl font-black">{group.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {pages.map((page) => {
                  const visibleSections = page.sections.slice(0, 4);
                  const hiddenCount = page.sections.length - visibleSections.length;

                  return (
                    <article key={page.id} className="rounded-lg border border-border bg-card p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-macework/10 text-macework">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-black">{page.title}</h3>
                            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
                              {page.phase}
                            </span>
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
                          className="inline-flex h-10 items-center gap-2 rounded-md bg-macework px-4 text-sm font-black text-white transition-colors hover:bg-macework/90"
                        >
                          Duzenle
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        {page.publicHref ? (
                          <Link
                            href={page.publicHref}
                            target="_blank"
                            className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black transition-colors hover:bg-muted"
                          >
                            Sitede gor
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        ) : null}
                      </div>
                    </article>
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
