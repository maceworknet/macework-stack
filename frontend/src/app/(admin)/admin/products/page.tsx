import Link from "next/link";
import { ExternalLink, Eye } from "lucide-react";
import { AdminCollectionToolbar } from "@/components/admin/admin-collection-toolbar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductForm } from "@/components/admin/content-forms";
import { deleteProductAction, saveProductAction } from "@/actions/admin/content";
import {
  getAdminListingQuery,
  includesSearch,
  sortCollection,
  uniqueOptions,
  type RawSearchParams,
} from "@/lib/admin-listing";
import { getMediaFiles, getProducts, resolveMediaUrl } from "@/lib/cms";
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

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const query = getAdminListingQuery(await searchParams);

  const [allProducts, mediaFiles] = await Promise.all([
    getProducts({ includeDrafts: true }),
    getMediaFiles(),
  ]);

  const categoryOptions = [
    { label: "Tüm kategoriler", value: "" },
    ...uniqueOptions(allProducts.map((product: any) => product.category ?? product.tag)),
  ];

  const filteredProducts = allProducts.filter((product: any) => {
    const category = product.category ?? product.tag ?? "";
    const matchesStatus =
      query.status === "published"
        ? Boolean(product.published)
        : query.status === "draft"
          ? !product.published
          : true;
    const matchesCategory = query.category ? category === query.category : true;
    const matchesText = includesSearch(
      query.q,
      product.title,
      product.slug,
      category,
      product.version,
      richTextToPlainText(product.short_description),
      richTextToPlainText(product.description)
    );

    return matchesStatus && matchesCategory && matchesText;
  });

  const products = sortCollection(filteredProducts, query.sort, {
    getTitle: (product: any) => product.title,
    getDate: (product: any) => product.updatedAt ?? product.createdAt,
    getManual: (product: any) => product.sortOrder,
    getPublished: (product: any) => product.published,
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
        title="Ürünler"
        description="Ürün kartlarını, detay içeriklerini ve platform bağlantılarını buradan yönetin."
      />

      <AdminCollectionToolbar
        action="/admin/products"
        searchValue={query.q}
        searchPlaceholder="Ürün adı, slug veya açıklama ara"
        filters={[
          { label: "Durum", name: "status", options: statusOptions, value: query.status },
          { label: "Kategori", name: "category", options: categoryOptions, value: query.category },
        ]}
        sortValue={query.sort}
        sortOptions={sortOptions}
        resultCount={products.length}
        totalCount={allProducts.length}
        activeFilters={activeFilters}
      />

      <details className="mb-8 rounded-lg border border-border bg-card p-5" open>
        <summary className="cursor-pointer text-lg font-black">Yeni ürün ekle</summary>
        <div className="mt-5 border-t border-border pt-5">
          <ProductForm action={saveProductAction} submitLabel="Ürünü kaydet" mediaFiles={mediaFiles} />
        </div>
      </details>

      {products.length ? (
        <div className="grid gap-4">
          {products.map((product: any) => (
            <article key={product.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-24 overflow-hidden rounded-lg border border-border bg-muted/40">
                    <img
                      src={resolveMediaUrl(product.cover_image?.url)}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-black">{product.title}</h2>
                    <p className="text-sm text-muted-foreground">/{product.slug}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-macework/10 px-3 py-1 text-xs font-bold text-macework">
                    {product.tag ?? product.category ?? "Ürün"}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      product.published
                        ? "bg-emerald-500/10 text-emerald-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {product.published ? "Yayında" : "Taslak"}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {product.short_description ?? richTextToPlainText(product.description)}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <details className="flex-1 rounded-md border border-border bg-background p-4">
                  <summary className="cursor-pointer text-sm font-black">Düzenle</summary>
                  <div className="mt-4 border-t border-border pt-4">
                    <ProductForm
                      product={product}
                      action={saveProductAction}
                      submitLabel="Güncelle"
                      mediaFiles={mediaFiles}
                      deleteAction={deleteProductAction}
                    />
                  </div>
                </details>
                <Link
                  href={`/admin/preview/products/${product.slug}`}
                  target="_blank"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black transition-colors hover:bg-muted"
                >
                  <Eye className="h-4 w-4" />
                  Önizle
                </Link>
                {product.published ? (
                  <Link
                    href={`/urunler/${product.slug}`}
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
            Bu filtrelerle eşleşen ürün bulunamadı.
          </p>
        </div>
      )}
    </>
  );
}
