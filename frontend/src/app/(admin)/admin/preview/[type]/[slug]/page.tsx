import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminEditChrome } from "@/components/admin/admin-edit-chrome";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { RichContent } from "@/components/rich-content";
import {
  getBlogPosts,
  getProducts,
  getProjects,
  getSolutions,
  getTemplates,
  resolveMediaUrl,
} from "@/lib/cms";
import { richTextToPlainText } from "@/lib/rich-text";

type PreviewType = "products" | "solutions" | "projects" | "templates" | "blog";

const previewConfig: Record<
  PreviewType,
  {
    label: string;
    parentHref: string;
    parentLabel: string;
    publicPrefix: string;
    loader: () => Promise<any[]>;
  }
> = {
  products: {
    label: "Ürün önizleme",
    parentHref: "/admin/products",
    parentLabel: "Ürünler",
    publicPrefix: "/urunler",
    loader: () => getProducts({ includeDrafts: true }),
  },
  solutions: {
    label: "Çözüm önizleme",
    parentHref: "/admin/services",
    parentLabel: "Çözümler",
    publicPrefix: "/cozumler",
    loader: () => getSolutions({ includeDrafts: true }),
  },
  projects: {
    label: "Proje önizleme",
    parentHref: "/admin/projects",
    parentLabel: "Projeler",
    publicPrefix: "/islerimiz",
    loader: () => getProjects({ includeDrafts: true }),
  },
  templates: {
    label: "Şablon önizleme",
    parentHref: "/admin/templates",
    parentLabel: "Şablonlar",
    publicPrefix: "/sablonlar",
    loader: () => getTemplates({ includeDrafts: true }),
  },
  blog: {
    label: "Blog önizleme",
    parentHref: "/admin/blog",
    parentLabel: "Blog",
    publicPrefix: "/blog",
    loader: () => getBlogPosts({ includeDrafts: true }),
  },
};

function isPreviewType(value: string): value is PreviewType {
  return value in previewConfig;
}

function firstText(...values: any[]): string | any[] {
  return values.find((value) => String(value ?? "").trim().length > 0) ?? "";
}

function previewImage(record: any) {
  return (
    record.cover_image?.url ??
    record.preview_image?.url ??
    record.coverImage ??
    record.previewImage ??
    null
  );
}

function previewContent(record: any) {
  return firstText(
    record.content,
    record.longDescription,
    record.long_description,
    record.description,
    record.summary,
    record.short_description,
    record.shortDescription
  );
}

function previewSummary(record: any) {
  return (
    richTextToPlainText(record.summary) ||
    richTextToPlainText(record.short_description) ||
    richTextToPlainText(record.shortDescription) ||
    richTextToPlainText(record.description) ||
    richTextToPlainText(record.longDescription) ||
    "Önizlenecek açıklama bulunmuyor."
  );
}

export default async function AdminContentPreviewPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;
  if (!isPreviewType(type)) return notFound();

  const config = previewConfig[type];
  const decodedSlug = decodeURIComponent(slug);
  const records = await config.loader();
  const record = records.find((item: any) => String(item.slug) === decodedSlug);

  if (!record) return notFound();

  const publicHref = `${config.publicPrefix}/${record.slug}`;
  const image = previewImage(record);
  const content = previewContent(record);

  return (
    <>
      <AdminEditChrome
        parentHref={config.parentHref}
        parentLabel={config.parentLabel}
        currentLabel={config.label}
      />
      <AdminPageHeader
        title={record.title}
        description="Bu önizleme admin içinde taslakları da gösterir. Yayındaki içerikler public sayfadan ayrıca açılabilir."
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${
            record.published
              ? "bg-emerald-500/10 text-emerald-700"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {record.published ? "Yayında" : "Taslak"}
        </span>
        <span className="rounded-full border border-border px-3 py-1 text-xs font-bold text-muted-foreground">
          {publicHref}
        </span>
        {record.published ? (
          <Link
            href={publicHref}
            target="_blank"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-black transition-colors hover:bg-muted"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Canlı sayfayı aç
          </Link>
        ) : null}
      </div>

      <article className="overflow-hidden rounded-lg border border-border bg-card">
        {image ? (
          <div className="aspect-[16/7] bg-muted">
            <img src={resolveMediaUrl(image)} alt={record.title} className="h-full w-full object-cover" />
          </div>
        ) : null}
        <div className="space-y-8 p-6">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm leading-relaxed text-muted-foreground">{previewSummary(record)}</p>
          </div>

          <div className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-macework">
            {content ? <RichContent content={content} /> : <p>Önizlenecek içerik bulunmuyor.</p>}
          </div>
        </div>
      </article>
    </>
  );
}
