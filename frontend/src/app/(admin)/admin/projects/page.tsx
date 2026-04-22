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
import { getProjects, resolveMediaUrl } from "@/lib/cms";
import { richTextToPlainText } from "@/lib/rich-text";

const sortOptions = [
  { label: "Yeni - Eski", value: "latest" },
  { label: "Eski - Yeni", value: "oldest" },
  { label: "A - Z", value: "title-asc" },
  { label: "Z - A", value: "title-desc" },
  { label: "Sıra No", value: "manual" },
  { label: "Yayındakiler Önce", value: "status" },
  { label: "Öne Çıkanlar Önce", value: "featured" },
];

const statusOptions = [
  { label: "Tüm durumlar", value: "" },
  { label: "Yayında", value: "published" },
  { label: "Taslak", value: "draft" },
];

const featuredOptions = [
  { label: "Tümü", value: "" },
  { label: "Öne çıkanlar", value: "featured" },
  { label: "Diğerleri", value: "regular" },
];

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const query = getAdminListingQuery(await searchParams);
  const allProjects = await getProjects({ includeDrafts: true });

  const categoryOptions = [
    { label: "Tüm kategoriler", value: "" },
    ...uniqueOptions(
      allProjects.map((project: any) => project.project_category?.name ?? project.category)
    ),
  ];

  const yearOptions = [
    { label: "Tüm yıllar", value: "" },
    ...uniqueOptions(allProjects.map((project: any) => project.year)),
  ];

  const filteredProjects = allProjects.filter((project: any) => {
    const category = project.project_category?.name ?? project.category ?? "";
    const matchesStatus =
      query.status === "published"
        ? Boolean(project.published)
        : query.status === "draft"
          ? !project.published
          : true;
    const matchesCategory = query.category ? category === query.category : true;
    const matchesFeatured =
      query.featured === "featured"
        ? Boolean(project.featured)
        : query.featured === "regular"
          ? !project.featured
          : true;
    const matchesYear = query.year ? String(project.year ?? "") === query.year : true;
    const matchesText = includesSearch(
      query.q,
      project.title,
      project.slug,
      project.client,
      project.year,
      category,
      richTextToPlainText(project.description),
      richTextToPlainText(project.longDescription),
      ...(Array.isArray(project.tags) ? project.tags : [])
    );

    return matchesStatus && matchesCategory && matchesFeatured && matchesYear && matchesText;
  });

  const projects = sortCollection(filteredProjects, query.sort, {
    getTitle: (project: any) => project.title,
    getDate: (project: any) => project.updatedAt ?? project.createdAt,
    getManual: (project: any) => project.sortOrder,
    getPublished: (project: any) => project.published,
    getFeatured: (project: any) => project.featured,
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
    query.year ? { key: "year", label: "Yıl", value: query.year } : null,
    query.featured
      ? {
          key: "featured",
          label: "Öne Çıkan",
          value: query.featured === "featured" ? "Evet" : "Hayır",
        }
      : null,
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
        title="Projeler"
        description="İşlerimiz sayfasındaki proje koleksiyonunu buradan yönetin."
      />

      <AdminCollectionToolbar
        action="/admin/projects"
        searchValue={query.q}
        searchPlaceholder="Proje adı, müşteri, etiket veya açıklama ara"
        filters={[
          { label: "Durum", name: "status", options: statusOptions, value: query.status },
          { label: "Kategori", name: "category", options: categoryOptions, value: query.category },
          { label: "Yıl", name: "year", options: yearOptions, value: query.year },
          { label: "Öne Çıkan", name: "featured", options: featuredOptions, value: query.featured },
        ]}
        sortValue={query.sort}
        sortOptions={sortOptions}
        resultCount={projects.length}
        totalCount={allProjects.length}
        activeFilters={activeFilters}
      />

      <div className="mb-8 flex justify-end">
        <Link
          href="/admin/projects/new"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-macework px-4 text-sm font-black text-white transition-colors hover:bg-macework-hover"
        >
          <Plus className="h-4 w-4" />
          Yeni proje ekle
        </Link>
      </div>

      {projects.length ? (
        <div className="grid gap-4">
          {projects.map((project: any) => (
            <article key={project.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-24 overflow-hidden rounded-lg border border-border bg-muted/40">
                    <img
                      src={resolveMediaUrl(project.cover_image?.url)}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-black">{project.title}</h2>
                    <p className="text-sm text-muted-foreground">/{project.slug}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">
                    {project.year ?? "Yıl"}
                  </span>
                  {project.featured ? (
                    <span className="rounded-full bg-macework/10 px-3 py-1 text-xs font-bold text-macework">
                      Öne çıkan
                    </span>
                  ) : null}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      project.published
                        ? "bg-emerald-500/10 text-emerald-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {project.published ? "Yayında" : "Taslak"}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {richTextToPlainText(project.description)}
              </p>
              <div className="mt-5 flex flex-wrap items-start gap-3">
                <details className="min-w-[240px] flex-1 rounded-md border border-border bg-background p-4">
                  <summary className="cursor-pointer text-sm font-black">
                    <span className="inline-flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Hızlı görüntüle
                    </span>
                  </summary>
                  <div className="mt-4 grid gap-3 border-t border-border pt-4 text-sm text-muted-foreground md:grid-cols-3">
                    <div>
                      <span className="block text-xs font-black text-foreground">Müşteri</span>
                      {project.client ?? "Belirtilmedi"}
                    </div>
                    <div>
                      <span className="block text-xs font-black text-foreground">Kategori</span>
                      {project.project_category?.name ?? project.category ?? "Genel"}
                    </div>
                    <div>
                      <span className="block text-xs font-black text-foreground">Teknoloji</span>
                      {Array.isArray(project.tags) && project.tags.length
                        ? project.tags.slice(0, 3).join(", ")
                        : "Etiket yok"}
                    </div>
                  </div>
                </details>
                <Link
                  href={`/admin/projects/${encodeURIComponent(String(project.id ?? project.slug))}`}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black transition-colors hover:bg-muted"
                >
                  <Pencil className="h-4 w-4" />
                  Tam düzenle
                </Link>
                {project.slug ? (
                  <Link
                    href={`/admin/preview/projects/${project.slug}`}
                    target="_blank"
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black transition-colors hover:bg-muted"
                  >
                    <Eye className="h-4 w-4" />
                    Önizle
                  </Link>
                ) : null}
                {project.slug && project.published ? (
                  <Link
                    href={`/islerimiz/${project.slug}`}
                    target="_blank"
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black transition-colors hover:bg-muted"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Canlı sayfa
                  </Link>
                ) : project.slug ? (
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
            Bu filtrelerle eşleşen proje bulunamadı.
          </p>
        </div>
      )}
    </>
  );
}
