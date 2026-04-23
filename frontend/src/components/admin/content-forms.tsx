"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  CheckCircle2,
  ExternalLink,
  FilePenLine,
  FileText,
  Eye,
  ImageIcon,
  Loader2,
  Package,
  Rocket,
  Save,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import { AdminFormTabs } from "@/components/admin/form-tabs";
import {
  AdminActionForm,
  ConfirmSubmitButton,
  useAdminToast,
  useUnsavedChangesWarning,
} from "@/components/admin/admin-feedback";
import { MediaGalleryField, MediaPickerField } from "@/components/admin/media-picker-field";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

type ServerAction = (formData: FormData) => Promise<void>;

type MediaItem = {
  id: string;
  url: string;
  mimeType: string;
  originalName: string;
};

type ContentLinkConfig = {
  publicPrefix: string;
  previewType: "products" | "solutions" | "projects" | "templates" | "blog";
  slug?: string | null;
  published?: boolean | null;
  saved?: boolean;
};

function contentLinkState(config?: ContentLinkConfig) {
  const slug = String(config?.slug ?? "").trim();
  const hasSlug = slug.length > 0;
  const saved = Boolean(config?.saved);
  const published = Boolean(config?.published);
  const publicHref = hasSlug && config ? `${config.publicPrefix}/${slug}` : "";
  const previewHref = hasSlug && config ? `/admin/preview/${config.previewType}/${slug}` : "";

  return {
    slug,
    publicHref,
    previewHref,
    canOpenPublic: saved && published && hasSlug,
    canOpenPreview: saved && hasSlug,
    publicDisabledReason: !hasSlug
      ? "Slug girilmeden canlı bağlantı oluşmaz."
      : !saved
        ? "Canlı bağlantı için önce kaydedin."
        : !published
          ? "Taslaklar public sayfada görünmez; önizlemeyi kullanın."
          : "",
    previewDisabledReason: !hasSlug
      ? "Önizleme için slug gerekli."
      : !saved
        ? "Önizleme için önce kaydedin."
        : "",
  };
}

function listToText(value: unknown) {
  if (!Array.isArray(value)) return "";

  return value
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "title" in item) {
        return String(item.title ?? "");
      }
      if (item && typeof item === "object" && "url" in item) {
        return String(item.url ?? "");
      }
      if (item && typeof item === "object" && "name" in item) {
        return String(item.name ?? "");
      }
      return "";
    })
    .filter(Boolean)
    .join("\n");
}

function mediaValue(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "url" in value) {
    return String((value as { url?: string | null }).url ?? "");
  }
  return "";
}

function galleryValue(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "url" in item) {
        return String((item as { url?: string | null }).url ?? "");
      }
      return "";
    })
    .filter(Boolean);
}

function dateValue(value: unknown) {
  if (!value) return "";

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

function serializeForm(form: HTMLFormElement) {
  const data = new FormData(form);
  const entries = Array.from(data.entries()).map(([key, entry]) => {
    if (typeof File !== "undefined" && entry instanceof File) {
      return [key, `${entry.name}:${entry.size}:${entry.lastModified}`];
    }

    return [key, String(entry)];
  });

  return JSON.stringify(entries);
}

function FormStatusBridge({ onPendingChange }: { onPendingChange: (pending: boolean) => void }) {
  const { pending } = useFormStatus();

  useEffect(() => {
    onPendingChange(pending);
  }, [onPendingChange, pending]);

  return null;
}

function StickyFormActions({
  submitLabel = "Kaydet",
  isDirty,
  isSaved,
  canDelete,
  deleteAction,
  linkConfig,
}: {
  submitLabel?: string;
  isDirty: boolean;
  isSaved: boolean;
  canDelete?: boolean;
  deleteAction?: ServerAction;
  linkConfig?: ContentLinkConfig;
}) {
  const { data, pending } = useFormStatus();
  const links = contentLinkState(linkConfig);
  const publishIntent = String(data?.get("publishIntent") ?? "");
  const formIntent = String(data?.get("formIntent") ?? "");
  const isDeleting = pending && formIntent === "delete";
  const isDrafting = pending && publishIntent === "draft";
  const isPublishing = pending && publishIntent === "publish";
  const isSaving = pending && !isDeleting && !isDrafting && !isPublishing;

  const status = pending
    ? isDeleting
      ? "Siliniyor"
      : isPublishing
        ? "Yayınlanıyor"
        : isDrafting
          ? "Taslak kaydediliyor"
          : "Kaydediliyor"
    : isDirty
      ? "Kaydedilmemiş değişiklikler"
      : isSaved
        ? "Kaydedildi"
        : "Güncel";

  return (
    <div className="sticky bottom-4 z-30 rounded-lg border border-border bg-background/95 p-3 shadow-lg backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin text-macework" />
          ) : isSaved ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isDirty ? "bg-amber-500" : "bg-emerald-500"
              }`}
            />
          )}
          <span>{status}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {linkConfig ? (
            <>
              {links.canOpenPreview ? (
                <a
                  href={links.previewHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black text-foreground transition-colors hover:bg-muted"
                >
                  <Eye className="h-4 w-4" />
                  Önizle
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  title={links.previewDisabledReason}
                  className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black text-muted-foreground opacity-60"
                >
                  <Eye className="h-4 w-4" />
                  Önizle
                </button>
              )}
              {links.canOpenPublic ? (
                <a
                  href={links.publicHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black text-foreground transition-colors hover:bg-muted"
                >
                  <ExternalLink className="h-4 w-4" />
                  Canlı
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  title={links.publicDisabledReason}
                  className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black text-muted-foreground opacity-60"
                >
                  <ExternalLink className="h-4 w-4" />
                  Canlı
                </button>
              )}
            </>
          ) : null}
          <button
            type="submit"
            name="publishIntent"
            value="draft"
            formNoValidate
            disabled={pending}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FilePenLine className="h-4 w-4" />
            {isDrafting ? "Kaydediliyor" : "Taslak"}
          </button>
          <button
            type="submit"
            name="publishIntent"
            value="save"
            disabled={pending}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-macework px-4 text-sm font-black text-white transition-colors hover:bg-macework-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Kaydediliyor" : submitLabel}
          </button>
          <button
            type="submit"
            name="publishIntent"
            value="publish"
            disabled={pending}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 text-sm font-black text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPublishing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isPublishing ? "Yayınlanıyor" : "Yayınla"}
          </button>
          {canDelete && deleteAction ? (
            <ConfirmSubmitButton
              name="formIntent"
              value="delete"
              formAction={deleteAction}
              formNoValidate
              title="İçerik silinsin mi?"
              description="Bu kayıt silindikten sonra listelerden ve public sayfalardan kaldırılır. Bu işlem geri alınamaz."
              confirmLabel="Sil"
              pendingChildren="Siliniyor"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-red-200 bg-background px-4 text-sm font-black text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              Sil
            </ConfirmSubmitButton>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ContentFormShell({
  action,
  children,
  submitLabel,
  canDelete,
  deleteAction,
  linkConfig,
}: {
  action: ServerAction;
  children: ReactNode;
  submitLabel?: string;
  canDelete?: boolean;
  deleteAction?: ServerAction;
  linkConfig?: ContentLinkConfig;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const initialSnapshotRef = useRef("");
  const submittedRef = useRef(false);
  const previousPendingRef = useRef(false);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const lastIntentRef = useRef<"delete" | "draft" | "publish" | "save">("save");
  const { notify } = useAdminToast();

  const updateSnapshot = useCallback(() => {
    if (!formRef.current) return;
    initialSnapshotRef.current = serializeForm(formRef.current);
  }, []);

  const checkDirty = useCallback(() => {
    if (!formRef.current || !initialSnapshotRef.current) return;
    setIsDirty(serializeForm(formRef.current) !== initialSnapshotRef.current);
    setIsSaved(false);
  }, []);

  const scheduleDirtyCheck = useCallback(() => {
    window.setTimeout(checkDirty, 0);
  }, [checkDirty]);

  useEffect(() => {
    updateSnapshot();
  }, [updateSnapshot]);

  useEffect(() => {
    if (isPending) {
      previousPendingRef.current = true;
      setIsSaved(false);
      return;
    }

    if (previousPendingRef.current && submittedRef.current) {
      updateSnapshot();
      setIsDirty(false);
      setIsSaved(true);

      if (savedTimerRef.current) {
        clearTimeout(savedTimerRef.current);
      }

      savedTimerRef.current = setTimeout(() => setIsSaved(false), 3000);

      const intent = lastIntentRef.current;
      notify({
        type: "success",
        title:
          intent === "delete"
            ? "İçerik silindi."
            : intent === "publish"
              ? "İçerik yayınlandı."
              : intent === "draft"
                ? "Taslak kaydedildi."
                : "İçerik kaydedildi.",
      });
    }

    previousPendingRef.current = false;
    submittedRef.current = false;
  }, [isPending, notify, updateSnapshot]);

  useUnsavedChangesWarning(
    isDirty && !isPending,
    "Bu formda kaydedilmemiş değişiklikler var."
  );

  useEffect(
    () => () => {
      if (savedTimerRef.current) {
        clearTimeout(savedTimerRef.current);
      }
    },
    []
  );

  return (
    <form
      ref={formRef}
      action={action}
      className="space-y-6 pb-2"
      onSubmitCapture={(event) => {
        const submitter = (event.nativeEvent as SubmitEvent).submitter as
          | HTMLButtonElement
          | null;
        const name = submitter?.name;
        const value = submitter?.value;

        if (name === "formIntent" && value === "delete") {
          lastIntentRef.current = "delete";
        } else if (name === "publishIntent" && value === "draft") {
          lastIntentRef.current = "draft";
        } else if (name === "publishIntent" && value === "publish") {
          lastIntentRef.current = "publish";
        } else {
          lastIntentRef.current = "save";
        }

        submittedRef.current = true;
        setIsSaved(false);
      }}
      onInputCapture={scheduleDirtyCheck}
      onChangeCapture={scheduleDirtyCheck}
      onClickCapture={scheduleDirtyCheck}
      onKeyUpCapture={scheduleDirtyCheck}
    >
      <FormStatusBridge onPendingChange={setIsPending} />
      {children}
      <StickyFormActions
        submitLabel={submitLabel}
        isDirty={isDirty}
        isSaved={isSaved}
        canDelete={canDelete}
        deleteAction={deleteAction}
        linkConfig={linkConfig}
      />
    </form>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="max-w-2xl space-y-1">
        <h3 className="text-base font-black text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function SecondaryBlock({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4 border-l-2 border-border pl-4 md:col-span-2">
      <div className="max-w-2xl space-y-1">
        <h4 className="text-sm font-black text-foreground">{title}</h4>
        <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

function ContentUrlPreview({
  config,
}: {
  config: ContentLinkConfig;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [slug, setSlug] = useState(String(config.slug ?? ""));
  const state = contentLinkState({ ...config, slug });
  const publicDisplay = state.slug ? state.publicHref : `${config.publicPrefix}/:slug`;

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    const input = form?.elements.namedItem("slug") as HTMLInputElement | null;
    if (!input) return;

    const syncSlug = () => setSlug(input.value.trim());
    syncSlug();
    input.addEventListener("input", syncSlug);
    input.addEventListener("change", syncSlug);

    return () => {
      input.removeEventListener("input", syncSlug);
      input.removeEventListener("change", syncSlug);
    };
  }, []);

  return (
    <div ref={rootRef} className="space-y-3 rounded-lg border border-border bg-muted/30 p-4 md:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-foreground">Public URL</p>
          <p className="mt-1 break-all text-xs font-medium text-muted-foreground">{publicDisplay}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${
            config.published
              ? "bg-emerald-500/10 text-emerald-700"
              : "bg-background text-muted-foreground"
          }`}
        >
          {config.published ? "Yayında" : "Taslak"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {state.canOpenPreview ? (
          <a
            href={state.previewHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-black transition-colors hover:bg-muted"
          >
            <Eye className="h-3.5 w-3.5" />
            Önizlemeyi aç
          </a>
        ) : (
          <button
            type="button"
            disabled
            title={state.previewDisabledReason}
            className="inline-flex h-9 cursor-not-allowed items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-black text-muted-foreground opacity-60"
          >
            <Eye className="h-3.5 w-3.5" />
            Önizlemeyi aç
          </button>
        )}
        {state.canOpenPublic ? (
          <a
            href={state.publicHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-black transition-colors hover:bg-muted"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Canlı sayfayı aç
          </a>
        ) : (
          <button
            type="button"
            disabled
            title={state.publicDisabledReason}
            className="inline-flex h-9 cursor-not-allowed items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-black text-muted-foreground opacity-60"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Canlı sayfayı aç
          </button>
        )}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Taslak içerikler public sayfada görünmez; admin önizleme bağlantısı yeni sekmede açılır.
      </p>
    </div>
  );
}

function FormField({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  type = "text",
  min,
  step,
  helperText,
  fullWidth,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "number" | "url" | "date";
  min?: number;
  step?: number;
  helperText?: string;
  fullWidth?: boolean;
}) {
  return (
    <label className={`space-y-1.5 ${fullWidth ? "md:col-span-2" : ""}`}>
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <input
        type={type}
        min={min}
        step={step}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-macework"
      />
      {helperText ? (
        <span className="block text-xs leading-relaxed text-muted-foreground">{helperText}</span>
      ) : null}
    </label>
  );
}

function TextAreaField({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  rows = 4,
  fullWidth = true,
  helperText,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  fullWidth?: boolean;
  helperText?: string;
}) {
  return (
    <label className={`space-y-1.5 ${fullWidth ? "md:col-span-2" : ""}`}>
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-macework"
      />
      {helperText ? (
        <span className="block text-xs leading-relaxed text-muted-foreground">{helperText}</span>
      ) : null}
    </label>
  );
}

function Checkbox({
  label,
  name,
  defaultChecked = true,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm font-bold">
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-macework"
      />
      {label}
    </label>
  );
}

function HiddenId({ id }: { id?: string | null }) {
  if (!id) return null;
  return <input type="hidden" name="id" value={id} />;
}

export function ProductForm({
  product,
  action,
  submitLabel,
  mediaFiles,
  deleteAction,
}: {
  product?: any;
  action: ServerAction;
  submitLabel?: string;
  mediaFiles: MediaItem[];
  deleteAction?: ServerAction;
}) {
  const linkConfig: ContentLinkConfig = {
    publicPrefix: "/urunler",
    previewType: "products",
    slug: product?.slug,
    published: product?.published ?? true,
    saved: Boolean(product?.id),
  };

  return (
    <ContentFormShell
      action={action}
      submitLabel={submitLabel}
      canDelete={Boolean(product?.id)}
      deleteAction={deleteAction}
      linkConfig={linkConfig}
    >
      <HiddenId id={product?.id} />
      <AdminFormTabs
        tabs={[
          {
            id: "general",
            label: "Genel",
            description: "Ürün kartında görünen temel bilgileri buradan düzenleyin.",
            icon: Package,
            content: (
              <FormSection
                title="Temel bilgiler"
                description="Başlık ve kısa açıklamalar ürünün listelerde nasıl algılanacağını belirler."
              >
                <FormField label="Başlık" name="title" defaultValue={product?.title} required />
                <TextAreaField
                  label="Kart açıklaması"
                  name="description"
                  defaultValue={product?.description}
                  required
                  rows={4}
                  helperText="Liste kartlarında ve kısa tanıtımlarda kullanılır."
                />
                <TextAreaField
                  label="Kısa açıklama"
                  name="shortDescription"
                  defaultValue={product?.short_description ?? product?.shortDescription}
                  rows={4}
                  helperText="Detay sayfasının üst bölümünde daha sakin bir açıklama olarak gösterilir."
                />
                <SecondaryBlock
                  title="Platform detayları"
                  description="Sürüm ve bağlantı bilgileri sadece ilgili ürünlerde doldurulabilir."
                >
                  <FormField label="Sürüm" name="version" defaultValue={product?.version} />
                  <FormField
                    label="Platform tipi"
                    name="platformType"
                    defaultValue={product?.platform_type ?? product?.platformType}
                  />
                  <FormField
                    label="Platform URL"
                    name="platformUrl"
                    type="url"
                    defaultValue={product?.platform_url ?? product?.platformUrl}
                    fullWidth
                  />
                </SecondaryBlock>
              </FormSection>
            ),
          },
          {
            id: "media",
            label: "Medya",
            description: "Kapak görselini yükleyin veya medya kütüphanesinden seçin.",
            icon: ImageIcon,
            content: (
              <FormSection
                title="Görsel seçimleri"
                description="Kapak görseli ürün detayında ve admin listelerinde ana görsel olarak kullanılır."
              >
                <MediaPickerField
                  name="coverImage"
                  label="Kapak görseli"
                  mediaFiles={mediaFiles}
                  value={mediaValue(product?.cover_image ?? product?.coverImage)}
                />
              </FormSection>
            ),
          },
          {
            id: "content",
            label: "İçerik",
            description: "Detay sayfasında okunan zengin içerik ve özellik listesini hazırlayın.",
            icon: FileText,
            content: (
              <FormSection
                title="Detay içeriği"
                description="Uzun metinler editörle, maddeli bilgiler satır satır yönetilir."
              >
                <RichTextEditor
                  name="longDescription"
                  label="Detay içeriği"
                  value={product?.long_description ?? product?.longDescription}
                  placeholder="Ürünün detaylı hikayesini, kullanım senaryolarını ve güçlü yanlarını yazın."
                />
                <TextAreaField
                  label="Özellikler"
                  name="features"
                  defaultValue={listToText(product?.features)}
                  placeholder="Her satıra bir özellik"
                  rows={5}
                  helperText="Her satır ayrı bir özellik olarak kaydedilir."
                />
              </FormSection>
            ),
          },
          {
            id: "publish",
            label: "Yayın",
            description: "Yayın durumu ve liste sıralamasını kontrol edin.",
            icon: Rocket,
            content: (
              <FormSection
                title="Yayın ayarları"
                description="Sıra değeri düşük olan içerikler listelerde daha önce görünebilir."
              >
                <FormField
                  label="Sıra"
                  name="sortOrder"
                  type="number"
                  min={0}
                  step={1}
                  defaultValue={product?.sortOrder ?? 0}
                />
                <div className="flex items-center pt-6">
                  <Checkbox
                    label="Yayında"
                    name="published"
                    defaultChecked={product?.published ?? true}
                  />
                </div>
              </FormSection>
            ),
          },
          {
            id: "seo",
            label: "SEO",
            description: "URL, kategori ve rozet gibi keşfedilebilirlik alanlarını düzenleyin.",
            icon: Search,
            content: (
              <FormSection
                title="SEO ve sınıflandırma"
                description="Slug public URL için kullanılır; kategori ve etiketler listeleme deneyimini besler."
              >
                <FormField
                  label="Slug"
                  name="slug"
                  defaultValue={product?.slug}
                  placeholder="qrgetir"
                  helperText="Boş bırakılırsa başlıktan üretilebilir."
                />
                <ContentUrlPreview config={linkConfig} />
                <FormField label="Kategori" name="category" defaultValue={product?.category} />
                <FormField label="Rozet" name="badge" defaultValue={product?.badge ?? "Ürün"} />
                <FormField label="Etiket" name="tag" defaultValue={product?.tag ?? product?.category} />
              </FormSection>
            ),
          },
        ]}
      />
    </ContentFormShell>
  );
}

export function SolutionForm({
  solution,
  action,
  submitLabel,
  mediaFiles,
  deleteAction,
}: {
  solution?: any;
  action: ServerAction;
  submitLabel?: string;
  mediaFiles: MediaItem[];
  deleteAction?: ServerAction;
}) {
  const linkConfig: ContentLinkConfig = {
    publicPrefix: "/cozumler",
    previewType: "solutions",
    slug: solution?.slug,
    published: solution?.published ?? true,
    saved: Boolean(solution?.id),
  };

  return (
    <ContentFormShell
      action={action}
      submitLabel={submitLabel}
      canDelete={Boolean(solution?.id)}
      deleteAction={deleteAction}
      linkConfig={linkConfig}
    >
      <HiddenId id={solution?.id} />
      <AdminFormTabs
        tabs={[
          {
            id: "general",
            label: "Genel",
            description: "Çözümün kartlarda ve detay sayfasında kullanılan temel metinlerini girin.",
            icon: Package,
            content: (
              <FormSection
                title="Temel bilgiler"
                description="Başlık, kısa açıklama ve rozet alanları çözümün ilk izlenimini oluşturur."
              >
                <FormField label="Başlık" name="title" defaultValue={solution?.title} required />
                <TextAreaField
                  label="Kısa açıklama"
                  name="shortDescription"
                  defaultValue={solution?.short_description ?? solution?.shortDescription}
                  rows={4}
                  helperText="Liste kartlarında kısa değer önerisi olarak gösterilir."
                />
                <SecondaryBlock
                  title="Görsel kimlik"
                  description="İkon ve rozet metni kartlarda hızlı ayrıştırma sağlar."
                >
                  <FormField
                    label="Kısa rozet metni"
                    name="badgeText"
                    defaultValue={solution?.badge_text ?? solution?.badgeText}
                  />
                  <FormField label="İkon" name="icon" defaultValue={solution?.icon ?? "Code"} />
                </SecondaryBlock>
              </FormSection>
            ),
          },
          {
            id: "media",
            label: "Medya",
            description: "Çözüm sayfasında kullanılacak kapak görselini yönetin.",
            icon: ImageIcon,
            content: (
              <FormSection
                title="Kapak görseli"
                description="Görsel çözüm detayında ve bazı listeleme alanlarında kullanılır."
              >
                <MediaPickerField
                  name="coverImage"
                  label="Kapak görseli"
                  mediaFiles={mediaFiles}
                  value={mediaValue(solution?.cover_image ?? solution?.coverImage)}
                />
              </FormSection>
            ),
          },
          {
            id: "content",
            label: "İçerik",
            description: "Çözümün kapsamını ve öne çıkan maddelerini hazırlayın.",
            icon: FileText,
            content: (
              <FormSection
                title="Detay içeriği"
                description="Uzun açıklamalar zengin metin editörüyle, maddeler satır satır yönetilir."
              >
                <RichTextEditor
                  name="description"
                  label="Detay içeriği"
                  value={solution?.description}
                  placeholder="Çözümün kapsamını, yaklaşımı ve sağladığı faydaları anlatın."
                  required
                />
                <TextAreaField
                  label="Öne çıkan maddeler"
                  name="features"
                  defaultValue={listToText(solution?.features)}
                  placeholder="Her satıra bir özellik"
                  rows={5}
                  helperText="Her satır ayrı bir madde olarak kaydedilir."
                />
              </FormSection>
            ),
          },
          {
            id: "publish",
            label: "Yayın",
            description: "Yayına alma ve sıralama kontrollerini burada tutun.",
            icon: Rocket,
            content: (
              <FormSection
                title="Yayın ayarları"
                description="Sıra değeri çözüm listesindeki yerleşimi belirlemeye yardımcı olur."
              >
                <FormField
                  label="Sıra"
                  name="sortOrder"
                  type="number"
                  min={0}
                  step={1}
                  defaultValue={solution?.sortOrder ?? 0}
                />
                <div className="flex items-center pt-6">
                  <Checkbox
                    label="Yayında"
                    name="published"
                    defaultChecked={solution?.published ?? true}
                  />
                </div>
              </FormSection>
            ),
          },
          {
            id: "seo",
            label: "SEO",
            description: "URL ve kategori bilgisini düzenleyin.",
            icon: Search,
            content: (
              <FormSection
                title="SEO ve kategori"
                description="Slug sayfa adresini, kategori ise listeleme filtrelerini besler."
              >
                <FormField
                  label="Slug"
                  name="slug"
                  defaultValue={solution?.slug}
                  placeholder="web-tasarim"
                  helperText="Boş bırakılırsa başlıktan üretilebilir."
                />
                <ContentUrlPreview config={linkConfig} />
                <FormField label="Kategori" name="category" defaultValue={solution?.category} />
              </FormSection>
            ),
          },
        ]}
      />
    </ContentFormShell>
  );
}

export function ProjectForm({
  project,
  action,
  submitLabel,
  mediaFiles,
  deleteAction,
}: {
  project?: any;
  action: ServerAction;
  submitLabel?: string;
  mediaFiles: MediaItem[];
  deleteAction?: ServerAction;
}) {
  const linkConfig: ContentLinkConfig = {
    publicPrefix: "/islerimiz",
    previewType: "projects",
    slug: project?.slug,
    published: project?.published ?? true,
    saved: Boolean(project?.id),
  };

  return (
    <ContentFormShell
      action={action}
      submitLabel={submitLabel}
      canDelete={Boolean(project?.id)}
      deleteAction={deleteAction}
      linkConfig={linkConfig}
    >
      <HiddenId id={project?.id} />
      <AdminFormTabs
        tabs={[
          {
            id: "general",
            label: "Genel",
            description: "Proje kartı ve detay üst bölümü için temel bilgileri girin.",
            icon: Package,
            content: (
              <FormSection
                title="Temel bilgiler"
                description="Başlık, müşteri ve kısa açıklama projenin ana anlatısını kurar."
              >
                <FormField label="Başlık" name="title" defaultValue={project?.title} required />
                <FormField label="Müşteri" name="client" defaultValue={project?.client} />
                <FormField
                  label="Canlı URL"
                  name="liveUrl"
                  type="url"
                  defaultValue={project?.live_url ?? project?.liveUrl}
                  fullWidth
                />
                <FormField
                  label="CTA Buton Metni"
                  name="ctaButtonLabel"
                  defaultValue={project?.cta_button_label ?? project?.ctaButtonLabel}
                  placeholder="Teklif Al"
                  helperText="Proje detay sayfasındaki buton yazısı. Boş bırakılırsa 'Teklif Al' gösterilir."
                />
                <FormField
                  label="CTA Buton Linki"
                  name="ctaButtonUrl"
                  type="url"
                  defaultValue={project?.cta_button_url ?? project?.ctaButtonUrl}
                  placeholder="/iletisim"
                  helperText="Butonun yönlendireceği URL. Boş bırakılırsa iletişim sayfasına yönlendirir."
                />
                <TextAreaField
                  label="Kart açıklaması"
                  name="description"
                  defaultValue={project?.description}
                  required
                  rows={4}
                  helperText="Liste kartında kısa proje özeti olarak görünür."
                />
              </FormSection>
            ),
          },
          {
            id: "media",
            label: "Medya",
            description: "Kapak ve galeri görsellerini tek yerde yönetin.",
            icon: ImageIcon,
            content: (
              <FormSection
                title="Proje görselleri"
                description="Kapak görseli listelerde, galeri ise detay sayfasında kullanılır."
              >
                <MediaPickerField
                  name="coverImage"
                  label="Kapak görseli"
                  mediaFiles={mediaFiles}
                  value={mediaValue(project?.cover_image ?? project?.coverImage)}
                />
                <MediaGalleryField
                  name="gallery"
                  label="Proje galerisi"
                  mediaFiles={mediaFiles}
                  value={galleryValue(project?.gallery)}
                />
              </FormSection>
            ),
          },
          {
            id: "content",
            label: "İçerik",
            description: "Proje hikayesi ve teknoloji listesini hazırlayın.",
            icon: FileText,
            content: (
              <FormSection
                title="Detay anlatımı"
                description="Uzun proje metni editörle, teknolojiler satır satır yönetilir."
              >
                <RichTextEditor
                  name="longDescription"
                  label="Proje hikayesi"
                  value={project?.longDescription ?? project?.long_description}
                  placeholder="Projenin hedefini, sürecini ve çıktısını detaylı olarak anlatın."
                />
                <TextAreaField
                  label="Teknolojiler"
                  name="tags"
                  defaultValue={listToText(project?.tags)}
                  placeholder="Her satıra bir teknoloji"
                  rows={5}
                  helperText="Her satır ayrı bir teknoloji/etiket olarak kaydedilir."
                />
              </FormSection>
            ),
          },
          {
            id: "publish",
            label: "Yayın",
            description: "Yayın durumu, öne çıkarma ve tarih/sıra alanlarını yönetin.",
            icon: Rocket,
            content: (
              <FormSection
                title="Yayın ayarları"
                description="Yıl, sıralama ve öne çıkan durumu proje listeleme deneyimini etkiler."
              >
                <FormField label="Yıl" name="year" defaultValue={project?.year} />
                <FormField
                  label="Sıra"
                  name="sortOrder"
                  type="number"
                  min={0}
                  step={1}
                  defaultValue={project?.sortOrder ?? 0}
                />
                <div className="flex flex-wrap items-center gap-4 pt-2 md:col-span-2">
                  <Checkbox
                    label="Yayında"
                    name="published"
                    defaultChecked={project?.published ?? true}
                  />
                  <Checkbox
                    label="Öne çıkan"
                    name="featured"
                    defaultChecked={project?.featured ?? false}
                  />
                </div>
              </FormSection>
            ),
          },
          {
            id: "seo",
            label: "SEO",
            description: "Public URL ve kategori sınıflandırmasını düzenleyin.",
            icon: Search,
            content: (
              <FormSection
                title="SEO ve kategori"
                description="Slug proje detay adresini, kategori de liste filtrelerini besler."
              >
                <FormField
                  label="Slug"
                  name="slug"
                  defaultValue={project?.slug}
                  placeholder="ornek-proje"
                  helperText="Boş bırakılırsa başlıktan üretilebilir."
                />
                <ContentUrlPreview config={linkConfig} />
                <FormField
                  label="Kategori"
                  name="category"
                  defaultValue={project?.project_category?.name ?? project?.category}
                />
              </FormSection>
            ),
          },
        ]}
      />
    </ContentFormShell>
  );
}

export function TemplateForm({
  template,
  action,
  submitLabel,
  mediaFiles,
  deleteAction,
}: {
  template?: any;
  action: ServerAction;
  submitLabel?: string;
  mediaFiles: MediaItem[];
  deleteAction?: ServerAction;
}) {
  const linkConfig: ContentLinkConfig = {
    publicPrefix: "/sablonlar",
    previewType: "templates",
    slug: template?.slug,
    published: template?.published ?? true,
    saved: Boolean(template?.id),
  };

  return (
    <ContentFormShell
      action={action}
      submitLabel={submitLabel}
      canDelete={Boolean(template?.id)}
      deleteAction={deleteAction}
      linkConfig={linkConfig}
    >
      <HiddenId id={template?.id} />
      <AdminFormTabs
        tabs={[
          {
            id: "general",
            label: "Genel",
            description: "Şablonun temel bilgilerini ve demo bağlantısını düzenleyin.",
            icon: Package,
            content: (
              <FormSection
                title="Temel bilgiler"
                description="Başlık ve demo bağlantısı şablonun seçilebilirliğini doğrudan etkiler."
              >
                <FormField label="Başlık" name="title" defaultValue={template?.title} required />
                <FormField
                  label="Demo URL"
                  name="demoUrl"
                  type="url"
                  defaultValue={template?.demo_url ?? template?.demoUrl}
                  fullWidth
                />
              </FormSection>
            ),
          },
          {
            id: "media",
            label: "Medya",
            description: "Liste ve detay görsellerini ayrı ayrı seçin.",
            icon: ImageIcon,
            content: (
              <FormSection
                title="Şablon görselleri"
                description="Liste görseli kartlarda, detay görseli şablon sayfasında kullanılır."
              >
                <MediaPickerField
                  name="previewImage"
                  label="Liste görseli"
                  mediaFiles={mediaFiles}
                  value={mediaValue(template?.preview_image ?? template?.previewImage)}
                />
                <MediaPickerField
                  name="coverImage"
                  label="Detay görseli"
                  mediaFiles={mediaFiles}
                  value={mediaValue(template?.cover_image ?? template?.coverImage)}
                />
              </FormSection>
            ),
          },
          {
            id: "content",
            label: "İçerik",
            description: "Şablon açıklaması ve öne çıkan özellikleri hazırlayın.",
            icon: FileText,
            content: (
              <FormSection
                title="Detay içeriği"
                description="Kullanım senaryoları ve özellikler bu alanda yönetilir."
              >
                <RichTextEditor
                  name="description"
                  label="Detay içeriği"
                  value={template?.description}
                  placeholder="Şablonun kullanım senaryolarını, avantajlarını ve içerdiği yapıları anlatın."
                />
                <TextAreaField
                  label="Öne çıkan özellikler"
                  name="features"
                  defaultValue={listToText(template?.features)}
                  placeholder="Her satıra bir özellik"
                  rows={5}
                  helperText="Her satır ayrı bir özellik olarak kaydedilir."
                />
              </FormSection>
            ),
          },
          {
            id: "publish",
            label: "Yayın",
            description: "Şablonun yayında olup olmadığını ve sırasını belirleyin.",
            icon: Rocket,
            content: (
              <FormSection
                title="Yayın ayarları"
                description="Sıra değeri şablon listelerindeki yerleşimi belirlemeye yardımcı olur."
              >
                <FormField
                  label="Sıra"
                  name="sortOrder"
                  type="number"
                  min={0}
                  step={1}
                  defaultValue={template?.sortOrder ?? 0}
                />
                <div className="flex items-center pt-6">
                  <Checkbox
                    label="Yayında"
                    name="published"
                    defaultChecked={template?.published ?? true}
                  />
                </div>
              </FormSection>
            ),
          },
          {
            id: "seo",
            label: "SEO",
            description: "URL ve kategori bilgilerini düzenleyin.",
            icon: Search,
            content: (
              <FormSection
                title="SEO ve kategori"
                description="Slug public sayfa adresini, kategori ise listeleme filtrelerini besler."
              >
                <FormField
                  label="Slug"
                  name="slug"
                  defaultValue={template?.slug}
                  placeholder="kurumsal-site"
                  helperText="Boş bırakılırsa başlıktan üretilebilir."
                />
                <ContentUrlPreview config={linkConfig} />
                <FormField
                  label="Kategori"
                  name="category"
                  defaultValue={template?.template_category?.name ?? template?.category}
                />
              </FormSection>
            ),
          },
        ]}
      />
    </ContentFormShell>
  );
}

export function BlogForm({
  post,
  action,
  submitLabel,
  mediaFiles,
  deleteAction,
}: {
  post?: any;
  action: ServerAction;
  submitLabel?: string;
  mediaFiles: MediaItem[];
  deleteAction?: ServerAction;
}) {
  const linkConfig: ContentLinkConfig = {
    publicPrefix: "/blog",
    previewType: "blog",
    slug: post?.slug,
    published: post?.published ?? true,
    saved: Boolean(post?.id),
  };

  return (
    <ContentFormShell
      action={action}
      submitLabel={submitLabel}
      canDelete={Boolean(post?.id)}
      deleteAction={deleteAction}
      linkConfig={linkConfig}
    >
      <HiddenId id={post?.id} />
      <AdminFormTabs
        tabs={[
          {
            id: "general",
            label: "Genel",
            description: "Blog yazısının başlık, özet ve yazar bilgilerini girin.",
            icon: Package,
            content: (
              <FormSection
                title="Temel bilgiler"
                description="Başlık ve özet yazının listelerde nasıl görüneceğini belirler."
              >
                <FormField label="Başlık" name="title" defaultValue={post?.title} required />
                <FormField label="Yazar" name="author" defaultValue={post?.author} />
                <FormField
                  label="Okuma süresi"
                  name="readTime"
                  type="number"
                  min={1}
                  step={1}
                  defaultValue={post?.read_time ?? post?.readTime ?? 5}
                  helperText="Dakika cinsinden girin."
                />
                <TextAreaField
                  label="Özet"
                  name="summary"
                  defaultValue={post?.summary ?? post?.excerpt}
                  rows={4}
                  required
                  helperText="Liste kartında ve yazı girişinde kullanılır."
                />
              </FormSection>
            ),
          },
          {
            id: "media",
            label: "Medya",
            description: "Blog yazısı için kapak görselini yönetin.",
            icon: ImageIcon,
            content: (
              <FormSection
                title="Kapak görseli"
                description="Kapak görseli blog listesinde ve yazı detayında ana görsel olarak kullanılır."
              >
                <MediaPickerField
                  name="coverImage"
                  label="Kapak görseli"
                  mediaFiles={mediaFiles}
                  value={mediaValue(post?.cover_image ?? post?.coverImage)}
                />
              </FormSection>
            ),
          },
          {
            id: "content",
            label: "İçerik",
            description: "Yazı içeriğini ve etiketleri hazırlayın.",
            icon: FileText,
            content: (
              <FormSection
                title="Yazı içeriği"
                description="Ana içerik zengin metin editörüyle, etiketler satır satır yönetilir."
              >
                <RichTextEditor
                  name="content"
                  label="Yazı içeriği"
                  value={typeof post?.content === "string" ? post.content : ""}
                  placeholder="Blog içeriğini burada zengin metin olarak hazırlayın."
                  required
                />
                <TextAreaField
                  label="Etiketler"
                  name="tags"
                  defaultValue={listToText(post?.tags)}
                  placeholder="Her satıra bir etiket"
                  rows={5}
                  helperText="Her satır ayrı bir etiket olarak kaydedilir."
                />
              </FormSection>
            ),
          },
          {
            id: "publish",
            label: "Yayın",
            description: "Yayın tarihi, yayın durumu ve öne çıkarma ayarlarını yönetin.",
            icon: Rocket,
            content: (
              <FormSection
                title="Yayın ayarları"
                description="Yayın tarihi boş bırakılırsa sistem varsayılan kayıt tarihini kullanabilir."
              >
                <FormField
                  label="Yayın tarihi"
                  name="publishedAt"
                  type="date"
                  defaultValue={dateValue(post?.publishedAt)}
                />
                <div className="flex flex-wrap items-center gap-4 pt-2 md:col-span-2">
                  <Checkbox
                    label="Yayında"
                    name="published"
                    defaultChecked={post?.published ?? true}
                  />
                  <Checkbox
                    label="Öne çıkan"
                    name="featured"
                    defaultChecked={post?.featured ?? false}
                  />
                </div>
              </FormSection>
            ),
          },
          {
            id: "seo",
            label: "SEO",
            description: "Yazının URL ve kategori bilgisini düzenleyin.",
            icon: Search,
            content: (
              <FormSection
                title="SEO ve kategori"
                description="Slug blog detay adresini, kategori ise listeleme ve filtrelemeyi besler."
              >
                <FormField
                  label="Slug"
                  name="slug"
                  defaultValue={post?.slug}
                  placeholder="yeni-yazi"
                  helperText="Boş bırakılırsa başlıktan üretilebilir."
                />
                <ContentUrlPreview config={linkConfig} />
                <FormField label="Kategori" name="category" defaultValue={post?.category} />
              </FormSection>
            ),
          },
        ]}
      />
    </ContentFormShell>
  );
}

export function DeleteButton({
  id,
  slug,
  action,
}: {
  id?: string | null;
  slug?: string | null;
  action: ServerAction;
}) {
  return (
    <AdminActionForm action={action} successMessage="Kayıt silindi.">
      {id ? <input type="hidden" name="id" value={id} /> : null}
      {slug ? <input type="hidden" name="slug" value={slug} /> : null}
      <ConfirmSubmitButton
        title="Kayıt silinsin mi?"
        description="Bu işlem geri alınamaz ve ilgili kayıt listelerden kaldırılır."
        confirmLabel="Sil"
        pendingChildren="Siliniyor"
        className="h-9 rounded-md border border-red-200 px-3 py-2 text-xs font-black text-red-600 transition-colors hover:bg-red-50"
      >
        Sil
      </ConfirmSubmitButton>
    </AdminActionForm>
  );
}
