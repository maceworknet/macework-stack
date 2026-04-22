import Link from "next/link";
import { ExternalLink, Eye, Pencil, Plus } from "lucide-react";
import { AdminCollectionToolbar } from "@/components/admin/admin-collection-toolbar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  getAdminListingQuery,
  includesSearch,
  sortCollection,
  uniqueOptions,
  type RawSearchParams,
} from "@/lib/admin-listing";
import { getTemplates, resolveMediaUrl } from "@/lib/cms";
import { richTextToPlainText } from "@/lib/rich-text";

const sortOptions = [
  { label: "Yeni - Eski", value: "latest" },
  { label: "Eski - Yeni", value: "oldest" },
  { label: "A - Z", value: "title-asc" },
  { label: "Z - A", value: "title-desc" },
  { label: "Sıra No", value: "manual" },
  { label: "Yayındakiler Önce", value: "status" },
];

const statusOptions = [
  { label: "Tüm durumlar", value: "" },
  { label: "Yayında", value: "published" },
  { label: "Taslak", value: "draft" },
];

export default async function AdminTemplatesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const query = getAdminListingQuery(await searchParams);
  const allTemplates = await getTemplates({ includeDrafts: true });

  const categoryOptions = [
    { label: "Tüm kategoriler", value: "" },
    ...uniqueOptions(
      allTemplates.map((template: any) => template.template_category?.name ?? template.category)
    ),
  ];

  const filteredTemplates = allTemplates.filter((template: any) => {
    const category = template.template_category?.name ?? template.category ?? "";
    const matchesStatus =
      query.status === "published"
        ? Boolean(template.published)
        : query.status === "draft"
          ? !template.published
          : true;
    const matchesCategory = query.category ? category === query.category : true;
    const matchesText = includesSearch(
      query.q,
      template.title,
      template.slug,
      category,
      template.demo_url,
      richTextToPlainText(template.description)
    );

    return matchesStatus && matchesCategory && matchesText;
  });

  const templates = sortCollection(filteredTemplates, query.sort, {
    getTitle: (template: any) => template.title,
    getDate: (template: any) => template.updatedAt ?? template.createdAt,
    getManual: (template: any) => template.sortOrder,
    getPublished: (template: any) => template.published,
  });

  const activeFilters = [
    query.q ? { key: "q", label: "Arama", value: query.q } : null,
    query.status
      ? {
          key: "status",
          label: "Durum",
          value: query.status === "published" ? "Yayında" : "Taslak",
        }
      : null,
    query.category ? { key: "category", label: "Kategori", value: query.category } : null,
    query.sort !== "latest"
      ? {
          key: "sort",
          label: "Sıralama",
          value: sortOptions.find((option) => option.value === query.sort)?.label ?? query.sort,
        }
      : null,
  ].filter(Boolean) as Array<{ key: string; label: string; value: string }>;

  return (
    <>
      <AdminPageHeader
        title="Şablonlar"
        description="Hazır şablonları, demo bağlantılarını ve detay içeriklerini buradan yönetin."
      />

      <AdminCollectionToolbar
        action="/admin/templates"
        searchValue={query.q}
        searchPlaceholder="Şablon adı, kategori veya demo bağlantısı ara"
        filters={[
          { label: "Durum", name: "status", options: statusOptions, value: query.status },
          { label: "Kategori", name: "category", options: categoryOptions, value: query.category },
        ]}
        sortValue={query.sort}
        sortOptions={sortOptions}
        resultCount={templates.length}
        totalCount={allTemplates.length}
        activeFilters={activeFilters}
      />

      <div className="mb-8 flex justify-end">
        <Link
          href="/admin/templates/new"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-macework px-4 text-sm font-black text-white transition-colors hover:bg-macework-hover"
        >
          <Plus className="h-4 w-4" />
          Yeni şablon ekle
        </Link>
      </div>

      {templates.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {templates.map((template: any) => (
            <article key={template.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start gap-4">
                <div className="h-16 w-24 overflow-hidden rounded-lg border border-border bg-muted/40">
                  <img
                    src={resolveMediaUrl(template.preview_image?.url ?? template.cover_image?.url)}
                    alt={template.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-black">{template.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">/{template.slug}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        template.published
                          ? "bg-emerald-500/10 text-emerald-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {template.published ? "Yayında" : "Taslak"}
                    </span>
                  </div>
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {template.template_category?.name ??
                      template.category ??
                      richTextToPlainText(template.description)}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-start gap-3">
                <details className="min-w-[220px] flex-1 rounded-md border border-border bg-background p-4">
                  <summary className="cursor-pointer text-sm font-black">
                    <span className="inline-flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Hızlı görüntüle
                    </span>
                  </summary>
                  <div className="mt-4 grid gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
                    <div>
                      <span className="block text-xs font-black text-foreground">Kategori</span>
                      {template.template_category?.name ?? template.category ?? "Şablon"}
                    </div>
                    <div>
                      <span className="block text-xs font-black text-foreground">Demo</span>
                      {template.demo_url ?? "Demo bağlantısı yok"}
                    </div>
                  </div>
                </details>
                <Link
                  href={`/admin/templates/${encodeURIComponent(String(template.id ?? template.slug))}`}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black transition-colors hover:bg-muted"
                >
                  <Pencil className="h-4 w-4" />
                  Tam düzenle
                </Link>
                {template.slug ? (
                  <Link
                    href={`/admin/preview/templates/${template.slug}`}
                    target="_blank"
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black transition-colors hover:bg-muted"
                  >
                    <Eye className="h-4 w-4" />
                    Önizle
                  </Link>
                ) : null}
                {template.slug && template.published ? (
                  <Link
                    href={`/sablonlar/${template.slug}`}
                    target="_blank"
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black transition-colors hover:bg-muted"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Canlı sayfa
                  </Link>
                ) : template.slug ? (
                  <span
                    title="Taslaklar public sayfada görünmez; önizlemeyi kullanın."
                    className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black text-muted-foreground opacity-60"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Canlı sayfa
                  </span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Bu filtrelerle eşleşen şablon bulunamadı.
          </p>
        </div>
      )}
    </>
  );
}
