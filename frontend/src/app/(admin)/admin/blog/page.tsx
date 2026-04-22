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
import { getBlogPosts, resolveMediaUrl } from "@/lib/cms";

const sortOptions = [
  { label: "Yeni - Eski", value: "latest" },
  { label: "Eski - Yeni", value: "oldest" },
  { label: "A - Z", value: "title-asc" },
  { label: "Z - A", value: "title-desc" },
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

function getPostYear(post: any) {
  const value = post.publishedAt ?? post.createdAt;
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return String(date.getFullYear());
}

function formatPostDate(post: any) {
  const value = post.publishedAt ?? post.createdAt;
  if (!value) return "Tarih yok";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tarih yok";

  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const query = getAdminListingQuery(await searchParams);
  const allPosts = await getBlogPosts({ includeDrafts: true });

  const categoryOptions = [
    { label: "Tüm kategoriler", value: "" },
    ...uniqueOptions(allPosts.map((post: any) => post.blog_category?.name ?? post.category)),
  ];

  const yearOptions = [
    { label: "Tüm yıllar", value: "" },
    ...uniqueOptions(allPosts.map((post: any) => getPostYear(post))),
  ];

  const filteredPosts = allPosts.filter((post: any) => {
    const category = post.blog_category?.name ?? post.category ?? "";
    const matchesStatus =
      query.status === "published"
        ? Boolean(post.published)
        : query.status === "draft"
          ? !post.published
          : true;
    const matchesCategory = query.category ? category === query.category : true;
    const matchesFeatured =
      query.featured === "featured"
        ? Boolean(post.featured)
        : query.featured === "regular"
          ? !post.featured
          : true;
    const matchesYear = query.year ? getPostYear(post) === query.year : true;
    const matchesText = includesSearch(
      query.q,
      post.title,
      post.slug,
      post.author,
      category,
      post.summary,
      post.excerpt
    );

    return matchesStatus && matchesCategory && matchesFeatured && matchesYear && matchesText;
  });

  const posts = sortCollection(filteredPosts, query.sort, {
    getTitle: (post: any) => post.title,
    getDate: (post: any) => post.publishedAt ?? post.updatedAt ?? post.createdAt,
    getPublished: (post: any) => post.published,
    getFeatured: (post: any) => post.featured,
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
        title="Blog"
        description="Blog yazılarını, kapak görsellerini ve zengin metin içeriklerini buradan yönetin."
      />

      <AdminCollectionToolbar
        action="/admin/blog"
        searchValue={query.q}
        searchPlaceholder="Yazı adı, yazar, kategori veya özet ara"
        filters={[
          { label: "Durum", name: "status", options: statusOptions, value: query.status },
          { label: "Kategori", name: "category", options: categoryOptions, value: query.category },
          { label: "Yıl", name: "year", options: yearOptions, value: query.year },
          { label: "Öne Çıkan", name: "featured", options: featuredOptions, value: query.featured },
        ]}
        sortValue={query.sort}
        sortOptions={sortOptions}
        resultCount={posts.length}
        totalCount={allPosts.length}
        activeFilters={activeFilters}
      />

      <div className="mb-8 flex justify-end">
        <Link
          href="/admin/blog/new"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-macework px-4 text-sm font-black text-white transition-colors hover:bg-macework-hover"
        >
          <Plus className="h-4 w-4" />
          Yeni blog yazısı ekle
        </Link>
      </div>

      {posts.length ? (
        <div className="grid gap-4">
          {posts.map((post: any) => (
            <article key={post.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-24 overflow-hidden rounded-lg border border-border bg-muted/40">
                    <img
                      src={resolveMediaUrl(post.cover_image?.url)}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-black">{post.title}</h2>
                    <p className="text-sm text-muted-foreground">/{post.slug}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {post.author ?? "Macework"} • {post.read_time ?? post.readTime ?? 5} dk
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {post.featured ? (
                    <span className="rounded-full bg-macework/10 px-3 py-1 text-xs font-bold text-macework">
                      Öne çıkan
                    </span>
                  ) : null}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      post.published
                        ? "bg-emerald-500/10 text-emerald-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {post.published ? "Yayında" : "Taslak"}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {post.summary ?? post.excerpt ?? "Özet bulunmuyor."}
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
                      <span className="block text-xs font-black text-foreground">Kategori</span>
                      {post.blog_category?.name ?? post.category ?? "Blog"}
                    </div>
                    <div>
                      <span className="block text-xs font-black text-foreground">Yayın tarihi</span>
                      {formatPostDate(post)}
                    </div>
                    <div>
                      <span className="block text-xs font-black text-foreground">Yazar</span>
                      {post.author ?? "Macework"}
                    </div>
                  </div>
                </details>
                <Link
                  href={`/admin/blog/${encodeURIComponent(String(post.id ?? post.slug))}`}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black transition-colors hover:bg-muted"
                >
                  <Pencil className="h-4 w-4" />
                  Tam düzenle
                </Link>
                {post.slug ? (
                  <Link
                    href={`/admin/preview/blog/${post.slug}`}
                    target="_blank"
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black transition-colors hover:bg-muted"
                  >
                    <Eye className="h-4 w-4" />
                    Önizle
                  </Link>
                ) : null}
                {post.slug && post.published ? (
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black transition-colors hover:bg-muted"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Canlı sayfa
                  </Link>
                ) : post.slug ? (
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
            Bu filtrelerle eşleşen blog yazısı bulunamadı.
          </p>
        </div>
      )}
    </>
  );
}
