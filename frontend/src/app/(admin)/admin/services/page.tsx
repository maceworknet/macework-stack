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
import { getSolutions, resolveMediaUrl } from "@/lib/cms";
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

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const query = getAdminListingQuery(await searchParams);

  const allServices = await getSolutions({ includeDrafts: true });

  const categoryOptions = [
    { label: "Tüm kategoriler", value: "" },
    ...uniqueOptions(allServices.map((service: any) => service.category)),
  ];

  const filteredServices = allServices.filter((service: any) => {
    const matchesStatus =
      query.status === "published"
        ? Boolean(service.published)
        : query.status === "draft"
          ? !service.published
          : true;
    const matchesCategory = query.category ? service.category === query.category : true;
    const matchesText = includesSearch(
      query.q,
      service.title,
      service.slug,
      service.icon,
      service.category,
      richTextToPlainText(service.short_description),
      richTextToPlainText(service.description)
    );

    return matchesStatus && matchesCategory && matchesText;
  });

  const services = sortCollection(filteredServices, query.sort, {
    getTitle: (service: any) => service.title,
    getDate: (service: any) => service.updatedAt ?? service.createdAt,
    getManual: (service: any) => service.sortOrder,
    getPublished: (service: any) => service.published,
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
        title="Çözümler"
        description="Hizmet ve çözüm sayfalarını buradan ekleyin, düzenleyin veya yayından kaldırın."
      />

      <AdminCollectionToolbar
        action="/admin/services"
        searchValue={query.q}
        searchPlaceholder="Çözüm adı, ikon veya açıklama ara"
        filters={[
          { label: "Durum", name: "status", options: statusOptions, value: query.status },
          { label: "Kategori", name: "category", options: categoryOptions, value: query.category },
        ]}
        sortValue={query.sort}
        sortOptions={sortOptions}
        resultCount={services.length}
        totalCount={allServices.length}
        activeFilters={activeFilters}
      />

      <div className="mb-8 flex justify-end">
        <Link
          href="/admin/services/new"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-macework px-4 text-sm font-black text-white transition-colors hover:bg-macework-hover"
        >
          <Plus className="h-4 w-4" />
          Yeni çözüm ekle
        </Link>
      </div>

      {services.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service: any) => (
            <article key={service.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-lg border border-border bg-muted/40">
                  <img
                    src={resolveMediaUrl(service.cover_image?.url)}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-black">{service.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">/{service.slug}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        service.published
                          ? "bg-emerald-500/10 text-emerald-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {service.published ? "Yayında" : "Taslak"}
                    </span>
                  </div>
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {service.short_description ?? richTextToPlainText(service.description)}
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
                  <div className="mt-4 grid gap-3 border-t border-border pt-4 text-sm text-muted-foreground md:grid-cols-3">
                    <div>
                      <span className="block text-xs font-black text-foreground">Kategori</span>
                      {service.category ?? "Genel"}
                    </div>
                    <div>
                      <span className="block text-xs font-black text-foreground">İkon</span>
                      {service.icon ?? "Belirtilmedi"}
                    </div>
                    <div>
                      <span className="block text-xs font-black text-foreground">Sıra</span>
                      {service.sortOrder ?? 0}
                    </div>
                  </div>
                </details>
                <Link
                  href={`/admin/services/${encodeURIComponent(String(service.id ?? service.slug))}`}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black transition-colors hover:bg-muted"
                >
                  <Pencil className="h-4 w-4" />
                  Tam düzenle
                </Link>
                <Link
                  href={`/admin/preview/solutions/${service.slug}`}
                  target="_blank"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black transition-colors hover:bg-muted"
                >
                  <Eye className="h-4 w-4" />
                  Önizle
                </Link>
                {service.published ? (
                  <Link
                    href={`/cozumler/${service.slug}`}
                    target="_blank"
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black transition-colors hover:bg-muted"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Canlı
                  </Link>
                ) : (
                  <span
                    title="Taslaklar public sayfada görünmez; önizlemeyi kullanın."
                    className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black text-muted-foreground opacity-60"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Canlı
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Bu filtrelerle eşleşen çözüm bulunamadı.
          </p>
        </div>
      )}
    </>
  );
}
