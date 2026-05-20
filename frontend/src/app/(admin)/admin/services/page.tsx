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
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


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
          className={buttonVariants({
            className: "gap-2 bg-macework text-white hover:bg-macework/90 font-bold"
          })}
        >
          <Plus className="h-4 w-4" />
          Yeni çözüm ekle
        </Link>
      </div>

      {services.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service: any) => (
            <Card key={service.id} className="overflow-hidden border-border bg-card shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-border bg-muted/40">
                    <img
                      src={resolveMediaUrl(service.cover_image?.url)}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold tracking-tight text-foreground">{service.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">/{service.slug}</p>
                      </div>
                      <Badge
                        variant={service.published ? "default" : "secondary"}
                        className={
                          service.published
                            ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/15"
                            : "bg-muted text-muted-foreground hover:bg-muted"
                        }
                      >
                        {service.published ? "Yayında" : "Taslak"}
                      </Badge>
                    </div>
                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {service.short_description ?? richTextToPlainText(service.description)}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-stretch gap-3">
                  <details className="min-w-[220px] flex-1 rounded-md border border-border bg-muted/20 p-4 transition-all duration-200 open:bg-muted/30">
                    <summary className="cursor-pointer text-sm font-bold text-foreground hover:text-primary transition-colors select-none">
                      <span className="inline-flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Hızlı görüntüle
                      </span>
                    </summary>
                    <div className="mt-4 grid gap-3 border-t border-border pt-4 text-sm text-muted-foreground md:grid-cols-3">
                      <div>
                        <span className="block text-xs font-semibold text-foreground">Kategori</span>
                        {service.category ?? "Genel"}
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-foreground">İkon</span>
                        {service.icon ?? "Belirtilmedi"}
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-foreground">Sıra</span>
                        {service.sortOrder ?? 0}
                      </div>
                    </div>
                  </details>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/admin/services/${encodeURIComponent(String(service.id ?? service.slug))}`}
                      className={buttonVariants({
                        variant: "outline",
                        className: "gap-2 h-full hover:bg-muted text-sm font-semibold"
                      })}
                    >
                      <Pencil className="h-4 w-4" />
                      Tam düzenle
                    </Link>
                    <Link
                      href={`/admin/preview/solutions/${service.slug}`}
                      target="_blank"
                      className={buttonVariants({
                        variant: "outline",
                        className: "gap-2 h-full hover:bg-muted text-sm font-semibold"
                      })}
                    >
                      <Eye className="h-4 w-4" />
                      Önizle
                    </Link>
                    {service.published ? (
                      <Link
                        href={`/cozumler/${service.slug}`}
                        target="_blank"
                        className={buttonVariants({
                          variant: "outline",
                          className: "gap-2 h-full hover:bg-muted text-sm font-semibold"
                        })}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Canlı
                      </Link>
                    ) : (
                      <span
                        title="Taslaklar public sayfada görünmez; önizlemeyi kullanın."
                        className={buttonVariants({
                          variant: "outline",
                          className: "gap-2 h-full cursor-not-allowed opacity-50 text-sm font-semibold"
                        })}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Canlı
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Bu filtrelerle eşleşen çözüm bulunamadı.
          </p>
        </Card>
      )}
    </>
  );
}
