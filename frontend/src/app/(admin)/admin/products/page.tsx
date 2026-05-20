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

      <details className="mb-8 rounded-lg border border-border bg-muted/20 p-5 transition-all duration-200 open:bg-muted/30" open>
        <summary className="cursor-pointer text-lg font-bold tracking-tight text-foreground select-none">Yeni ürün ekle</summary>
        <div className="mt-5 border-t border-border pt-5">
          <ProductForm action={saveProductAction} submitLabel="Ürünü kaydet" mediaFiles={mediaFiles} />
        </div>
      </details>

      {products.length ? (
        <div className="grid gap-4">
          {products.map((product: any) => (
            <Card key={product.id} className="overflow-hidden border-border bg-card shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border bg-muted/40">
                      <img
                        src={resolveMediaUrl(product.cover_image?.url)}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold tracking-tight text-foreground">{product.title}</h2>
                      <p className="text-sm text-muted-foreground">/{product.slug}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-macework text-white hover:bg-macework/90">
                      {product.tag ?? product.category ?? "Ürün"}
                    </Badge>
                    <Badge
                      variant={product.published ? "default" : "secondary"}
                      className={
                        product.published
                          ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/15"
                          : "bg-muted text-muted-foreground hover:bg-muted"
                      }
                    >
                      {product.published ? "Yayında" : "Taslak"}
                    </Badge>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {product.short_description ?? richTextToPlainText(product.description)}
                </p>
                <div className="mt-5 flex flex-wrap items-stretch gap-3">
                  <details className="flex-1 rounded-md border border-border bg-muted/20 p-4 transition-all duration-200 open:bg-muted/30">
                    <summary className="cursor-pointer text-sm font-bold text-foreground hover:text-primary transition-colors select-none">Düzenle</summary>
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/admin/preview/products/${product.slug}`}
                      target="_blank"
                      className={buttonVariants({
                        variant: "outline",
                        className: "gap-2 h-full hover:bg-muted text-sm font-semibold"
                      })}
                    >
                      <Eye className="h-4 w-4" />
                      Önizle
                    </Link>
                    {product.published ? (
                      <Link
                        href={`/urunler/${product.slug}`}
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
            Bu filtrelerle eşleşen ürün bulunamadı.
          </p>
        </Card>
      )}
    </>
  );
}
