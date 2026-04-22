import { HardDrive, ImageIcon, Search, UploadCloud } from "lucide-react";
import { deleteMediaAction } from "@/actions/admin/content";
import { AdminCollectionToolbar } from "@/components/admin/admin-collection-toolbar";
import { AdminActionForm, ConfirmSubmitButton } from "@/components/admin/admin-feedback";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MediaDimensions } from "@/components/admin/media-dimensions";
import { MediaUploadForm } from "@/components/admin/media-upload-form";
import { includesSearch, type RawSearchParams } from "@/lib/admin-listing";
import { getMediaFiles } from "@/lib/cms";

const typeOptions = [
  { label: "Tüm dosyalar", value: "" },
  { label: "Sadece görseller", value: "images" },
  { label: "Diğer dosyalar", value: "other" },
];

const sortOptions = [
  { label: "Yeni - Eski", value: "latest" },
  { label: "Eski - Yeni", value: "oldest" },
  { label: "Ad A - Z", value: "name-asc" },
  { label: "Ad Z - A", value: "name-desc" },
  { label: "Boyut büyük - küçük", value: "size-desc" },
  { label: "Boyut küçük - büyük", value: "size-asc" },
];

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function isImage(file: any) {
  return String(file.mimeType ?? "").startsWith("image/");
}

function fileTypeLabel(file: any) {
  return isImage(file) ? "Görsel" : "Dosya";
}

function formatBytes(value: unknown) {
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / 1024 ** unitIndex;

  return `${size >= 10 || unitIndex === 0 ? size.toFixed(0) : size.toFixed(1)} ${units[unitIndex]}`;
}

function toTimestamp(value: unknown) {
  if (!value) return 0;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function formatDate(value: unknown) {
  if (!value) return "Tarih yok";
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Tarih yok";

  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function sortMediaFiles(files: any[], sort: string) {
  return [...files].sort((left, right) => {
    const leftName = String(left.originalName ?? left.filename ?? "");
    const rightName = String(right.originalName ?? right.filename ?? "");
    const newest = toTimestamp(right.createdAt) - toTimestamp(left.createdAt);

    switch (sort) {
      case "oldest":
        return toTimestamp(left.createdAt) - toTimestamp(right.createdAt);
      case "name-asc":
        return leftName.localeCompare(rightName, "tr-TR");
      case "name-desc":
        return rightName.localeCompare(leftName, "tr-TR");
      case "size-desc":
        return Number(right.size ?? 0) - Number(left.size ?? 0) || newest;
      case "size-asc":
        return Number(left.size ?? 0) - Number(right.size ?? 0) || newest;
      case "latest":
      default:
        return newest || leftName.localeCompare(rightName, "tr-TR");
    }
  });
}

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const query = {
    q: firstValue(params.q).trim(),
    type: firstValue(params.type).trim(),
    sort: firstValue(params.sort).trim() || "latest",
  };

  const files = await getMediaFiles();
  const totalSize = files.reduce((sum: number, file: any) => sum + Number(file.size ?? 0), 0);
  const imageCount = files.filter(isImage).length;
  const otherCount = files.length - imageCount;

  const filteredFiles = files.filter((file: any) => {
    const matchesType =
      query.type === "images" ? isImage(file) : query.type === "other" ? !isImage(file) : true;
    const matchesSearch = includesSearch(
      query.q,
      file.originalName,
      file.filename,
      file.url,
      file.mimeType
    );

    return matchesType && matchesSearch;
  });

  const visibleFiles = sortMediaFiles(filteredFiles, query.sort);
  const activeFilters = [
    query.q ? { key: "q", label: "Arama", value: query.q } : null,
    query.type
      ? {
          key: "type",
          label: "Tür",
          value: query.type === "images" ? "Sadece görseller" : "Diğer dosyalar",
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
        title="Medya"
        description="Dosyalar local olarak public/uploads altında kaydedilir ve tek deploy içinde servis edilir."
      />

      <MediaUploadForm />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <UploadCloud className="h-5 w-5 text-macework" />
            <span className="text-sm font-bold text-muted-foreground">Toplam dosya</span>
          </div>
          <p className="mt-3 text-2xl font-black">{files.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-5 w-5 text-macework" />
            <span className="text-sm font-bold text-muted-foreground">Görsel / diğer</span>
          </div>
          <p className="mt-3 text-2xl font-black">
            {imageCount} / {otherCount}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <HardDrive className="h-5 w-5 text-macework" />
            <span className="text-sm font-bold text-muted-foreground">Toplam boyut</span>
          </div>
          <p className="mt-3 text-2xl font-black">{formatBytes(totalSize)}</p>
        </div>
      </div>

      <div className="mt-6">
        <AdminCollectionToolbar
          action="/admin/media"
          searchValue={query.q}
          searchPlaceholder="Dosya adı, URL veya mime type ara"
          filters={[{ label: "Dosya türü", name: "type", options: typeOptions, value: query.type }]}
          sortValue={query.sort}
          sortOptions={sortOptions}
          resultCount={visibleFiles.length}
          totalCount={files.length}
          activeFilters={activeFilters}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {visibleFiles.map((file: any) => (
          <article
            key={file.id}
            className="overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-macework/50"
          >
            <div className="aspect-[4/3] bg-muted/30">
              {isImage(file) ? (
                <img
                  src={file.url}
                  alt={file.originalName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-sm font-bold text-muted-foreground">
                  <Search className="h-5 w-5" />
                  Önizleme yok
                </div>
              )}
            </div>
            <div className="space-y-4 p-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <p className="min-w-0 truncate font-bold">{file.originalName}</p>
                  <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                    {fileTypeLabel(file)}
                  </span>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block truncate text-xs font-medium text-macework"
                >
                  {file.url}
                </a>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="font-black text-foreground">Boyut</dt>
                  <dd className="mt-1 text-muted-foreground">{formatBytes(file.size)}</dd>
                </div>
                <div>
                  <dt className="font-black text-foreground">Mime type</dt>
                  <dd className="mt-1 truncate text-muted-foreground">{file.mimeType}</dd>
                </div>
                <div>
                  <dt className="font-black text-foreground">Ölçü</dt>
                  <dd className="mt-1 text-muted-foreground">
                    {isImage(file) ? <MediaDimensions src={file.url} /> : "Uygun değil"}
                  </dd>
                </div>
                <div>
                  <dt className="font-black text-foreground">Yükleme</dt>
                  <dd className="mt-1 text-muted-foreground">{formatDate(file.createdAt)}</dd>
                </div>
              </dl>

              <AdminActionForm action={deleteMediaAction} successMessage="Medya dosyası silindi.">
                <input type="hidden" name="id" value={file.id} />
                <input type="hidden" name="url" value={file.url} />
                <ConfirmSubmitButton
                  title="Medya dosyası silinsin mi?"
                  description="Dosya kaydı ve local uploads dosyası silinir. Bu işlem geri alınamaz."
                  confirmLabel="Sil"
                  pendingChildren="Siliniyor"
                  className="h-9 rounded-md border border-red-200 px-3 text-xs font-black text-red-600 transition-colors hover:bg-red-50"
                >
                  Sil
                </ConfirmSubmitButton>
              </AdminActionForm>
            </div>
          </article>
        ))}
        {visibleFiles.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed border-border bg-card p-8 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Bu filtrelerle eşleşen medya bulunamadı.
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
}
