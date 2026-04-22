import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getManagedPage, pageSettingKey } from "@/lib/page-settings";

export default async function AdminManagedPageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = getManagedPage(id);

  if (!page) {
    notFound();
  }

  return (
    <>
      <Link
        href="/admin/pages"
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Sayfalara don
      </Link>

      <AdminPageHeader
        title={`${page.title} Yonetimi`}
        description={`${page.phase} kapsaminda panelden yonetilecek bolumler.`}
      />

      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-macework/10 px-3 py-1 text-xs font-bold text-macework">
            {page.phase}
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
            {page.group === "layout" ? "Global alan" : "Sayfa"}
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
            {pageSettingKey(page.id)}
          </span>
        </div>

        <h2 className="mt-6 text-lg font-black">Yonetilecek alanlar</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {page.sections.map((section) => (
            <div key={section} className="flex gap-3 rounded-md border border-border bg-background p-4">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-macework" />
              <p className="text-sm leading-relaxed text-muted-foreground">{section}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-black">Sonraki adim</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Bu ekran siradaki Faz 11 alt basliginda form alanlari, kayit aksiyonlari ve frontend
          baglantilariyla acilacak.
        </p>
      </section>
    </>
  );
}
