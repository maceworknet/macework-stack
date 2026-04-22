"use client";

import type { ButtonHTMLAttributes, ChangeEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronsDown,
  ChevronsUp,
  GripVertical,
  ImageIcon,
  Library,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";

type MediaItem = {
  id: string;
  url: string;
  mimeType: string;
  originalName: string;
};

function isImage(item?: MediaItem | null) {
  return Boolean(item?.mimeType?.startsWith("image/"));
}

function ActionButton({
  children,
  danger = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-bold transition-colors ${
        danger
          ? "border-red-200 bg-background text-red-600 hover:bg-red-50"
          : "border-border bg-background hover:bg-muted"
      } ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

function PreviewFrame({
  item,
  className,
  emptyText = "Henüz görsel seçilmedi",
}: {
  item?: MediaItem | null;
  className?: string;
  emptyText?: string;
}) {
  if (!item) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-muted-foreground ${className ?? ""}`}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <ImageIcon className="h-5 w-5" />
          <span className="text-xs font-medium">{emptyText}</span>
        </div>
      </div>
    );
  }

  if (!isImage(item)) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground ${className ?? ""}`}
      >
        <ImageIcon className="h-5 w-5" />
        <span className="mt-2 max-w-[90%] truncate text-xs font-medium">{item.originalName}</span>
      </div>
    );
  }

  return (
    <img
      src={item.url}
      alt={item.originalName}
      className={`rounded-lg border border-border object-cover ${className ?? ""}`}
    />
  );
}

function LibraryModal({
  title,
  description,
  children,
  onClose,
}: {
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-5xl rounded-xl border border-border bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-lg font-black">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border"
            aria-label="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

export function MediaPickerField({
  name,
  label,
  mediaFiles,
  value,
}: {
  name: string;
  label: string;
  mediaFiles: MediaItem[];
  value?: string | null;
}) {
  const [library, setLibrary] = useState(mediaFiles);
  const [selectedUrl, setSelectedUrl] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const didMountRef = useRef(false);

  const selectedItem = useMemo(
    () => library.find((item) => item.url === selectedUrl) ?? null,
    [library, selectedUrl]
  );

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    hiddenInputRef.current?.dispatchEvent(new Event("change", { bubbles: true }));
  }, [selectedUrl]);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const body = await response.json().catch(() => null);
    setUploading(false);
    event.target.value = "";

    if (!response.ok || !body?.file) return;

    const newItem = {
      id: body.file.id ?? crypto.randomUUID(),
      url: body.file.url,
      mimeType: body.file.mimeType,
      originalName: body.file.originalName ?? body.file.filename,
    };

    setLibrary((current) => [newItem, ...current.filter((item) => item.url !== newItem.url)]);
    setSelectedUrl(newItem.url);
    setOpen(false);
  }

  return (
    <div className="space-y-1.5 md:col-span-2">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <input ref={hiddenInputRef} type="hidden" name={name} value={selectedUrl} />

      <div className="rounded-lg border border-input bg-card p-4">
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
          <PreviewFrame item={selectedItem} className="h-36 w-full lg:h-32" />

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                  {selectedItem ? "Seçili görsel" : "Boş"}
                </span>
                {selectedItem?.mimeType ? (
                  <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    {selectedItem.mimeType}
                  </span>
                ) : null}
              </div>
              <div>
                <p className="truncate text-sm font-bold">
                  {selectedItem?.originalName ?? "Henüz görsel seçilmedi"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Kapak görselini kütüphaneden seçebilir veya yeni dosya yükleyebilirsiniz.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <ActionButton onClick={() => setOpen(true)}>
                <Library className="h-4 w-4" />
                Medya kütüphanesinden seç
              </ActionButton>
              <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-bold transition-colors hover:bg-muted">
                <Upload className="h-4 w-4" />
                {uploading ? "Yükleniyor" : "Yeni görsel yükle"}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
              {selectedUrl ? (
                <ActionButton danger onClick={() => setSelectedUrl("")}>
                  <X className="h-4 w-4" />
                  Seçimi kaldır
                </ActionButton>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {open ? (
        <LibraryModal
          title="Medya kütüphanesi"
          description="Görsel seçin veya yeni dosya yükleyin."
          onClose={() => setOpen(false)}
        >
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
            {library.map((item) => {
              const active = selectedUrl === item.url;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedUrl(item.url);
                    setOpen(false);
                  }}
                  className={`overflow-hidden rounded-lg border text-left transition-colors ${
                    active
                      ? "border-macework ring-2 ring-macework/20"
                      : "border-border hover:border-macework/40"
                  }`}
                >
                  <div className="relative">
                    {isImage(item) ? (
                      <img
                        src={item.url}
                        alt={item.originalName}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center bg-muted/30">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    {active ? (
                      <span className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-macework text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    ) : null}
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-bold">{item.originalName}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{item.mimeType}</p>
                  </div>
                </button>
              );
            })}
            {library.length === 0 ? (
              <div className="col-span-full rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Henüz medya bulunmuyor.
              </div>
            ) : null}
          </div>
        </LibraryModal>
      ) : null}
    </div>
  );
}

export function MediaGalleryField({
  name,
  label,
  mediaFiles,
  value,
}: {
  name: string;
  label: string;
  mediaFiles: MediaItem[];
  value?: string[];
}) {
  const [library, setLibrary] = useState(mediaFiles);
  const [selectedUrls, setSelectedUrls] = useState<string[]>(value ?? []);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draggedUrl, setDraggedUrl] = useState<string | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    hiddenInputRef.current?.dispatchEvent(new Event("change", { bubbles: true }));
  }, [selectedUrls]);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const body = await response.json().catch(() => null);
    setUploading(false);
    event.target.value = "";

    if (!response.ok || !body?.file) return;

    const newItem = {
      id: body.file.id ?? crypto.randomUUID(),
      url: body.file.url,
      mimeType: body.file.mimeType,
      originalName: body.file.originalName ?? body.file.filename,
    };

    setLibrary((current) => [newItem, ...current.filter((item) => item.url !== newItem.url)]);
    setSelectedUrls((current) => Array.from(new Set([...current, newItem.url])));
  }

  function toggleUrl(url: string) {
    setSelectedUrls((current) =>
      current.includes(url) ? current.filter((item) => item !== url) : [...current, url]
    );
  }

  function moveUrl(url: string, targetIndex: number) {
    setSelectedUrls((current) => {
      const fromIndex = current.indexOf(url);
      if (fromIndex === -1) return current;

      const next = [...current];
      next.splice(fromIndex, 1);
      const safeIndex = Math.max(0, Math.min(targetIndex, next.length));
      next.splice(safeIndex, 0, url);

      return next;
    });
  }

  function moveByStep(url: string, step: -1 | 1) {
    setSelectedUrls((current) => {
      const fromIndex = current.indexOf(url);
      if (fromIndex === -1) return current;

      const targetIndex = fromIndex + step;
      if (targetIndex < 0 || targetIndex >= current.length) return current;

      const next = [...current];
      const [item] = next.splice(fromIndex, 1);
      next.splice(targetIndex, 0, item);

      return next;
    });
  }

  function removeUrl(url: string) {
    setSelectedUrls((current) => current.filter((item) => item !== url));
  }

  function dropOnUrl(targetUrl: string) {
    if (!draggedUrl || draggedUrl === targetUrl) return;

    setSelectedUrls((current) => {
      const fromIndex = current.indexOf(draggedUrl);
      const targetIndex = current.indexOf(targetUrl);
      if (fromIndex === -1 || targetIndex === -1) return current;

      const next = [...current];
      const [item] = next.splice(fromIndex, 1);
      next.splice(targetIndex, 0, item);

      return next;
    });
  }

  return (
    <div className="space-y-1.5 md:col-span-2">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <input ref={hiddenInputRef} type="hidden" name={name} value={selectedUrls.join("\n")} />

      <div className="rounded-lg border border-input bg-card p-4">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
            {selectedUrls.length} görsel seçildi
          </span>
          {selectedUrls.length ? (
            <span className="rounded-full border border-macework/20 bg-macework/5 px-2.5 py-1 text-[11px] font-bold text-macework">
              İlk görsel kapak adayı
            </span>
          ) : null}
          <span className="text-xs text-muted-foreground">
            Görselleri sürükleyerek sıralayabilir veya mobilde hızlı taşıma butonlarını kullanabilirsiniz.
          </span>
        </div>

        {selectedUrls.length ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {selectedUrls.map((url, index) => {
              const item = library.find((entry) => entry.url === url) ?? null;
              const isFirst = index === 0;
              const isLast = index === selectedUrls.length - 1;
              const isDragging = draggedUrl === url;

              return (
                <div
                  key={url}
                  draggable
                  onDragStart={(event) => {
                    setDraggedUrl(url);
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", url);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    dropOnUrl(url);
                    setDraggedUrl(null);
                  }}
                  onDragEnd={() => setDraggedUrl(null)}
                  className={`overflow-hidden rounded-lg border bg-background transition-colors ${
                    isDragging
                      ? "border-macework opacity-60 ring-2 ring-macework/20"
                      : "border-border hover:border-macework/40"
                  }`}
                >
                  <div className="relative">
                    <PreviewFrame
                      item={item}
                      className="h-28 w-full rounded-none border-0"
                      emptyText="Görsel yok"
                    />
                    <span className="absolute left-2 top-2 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-background/90 px-2 text-xs font-black shadow-sm">
                      {index + 1}
                    </span>
                    {isFirst ? (
                      <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-macework px-2 py-1 text-[10px] font-black text-white shadow-sm">
                        <Star className="h-3 w-3" />
                        Kapak
                      </span>
                    ) : null}
                  </div>

                  <div className="space-y-3 p-3">
                    <div className="flex items-start gap-2">
                      <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <p className="min-w-0 truncate text-xs font-bold text-foreground">
                        {item?.originalName ?? url}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => moveUrl(url, 0)}
                        disabled={isFirst}
                        title="Başa al"
                        className="inline-flex h-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronsUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveUrl(url, selectedUrls.length - 1)}
                        disabled={isLast}
                        title="Sona al"
                        className="inline-flex h-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronsDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveByStep(url, -1)}
                        disabled={isFirst}
                        title="Yukarı taşı"
                        className="inline-flex h-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveByStep(url, 1)}
                        disabled={isLast}
                        title="Aşağı taşı"
                        className="inline-flex h-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeUrl(url)}
                      className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-red-200 text-xs font-black text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Kaldır
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <PreviewFrame className="h-28 w-full" emptyText="Henüz galeri görseli seçilmedi" />
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <ActionButton onClick={() => setOpen(true)}>
            <Library className="h-4 w-4" />
            Galeriden seç
          </ActionButton>
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-bold transition-colors hover:bg-muted">
            <Upload className="h-4 w-4" />
            {uploading ? "Yükleniyor" : "Yeni görsel yükle"}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
          {selectedUrls.length ? (
            <ActionButton danger onClick={() => setSelectedUrls([])}>
              <X className="h-4 w-4" />
              Tümünü kaldır
            </ActionButton>
          ) : null}
        </div>
      </div>

      {open ? (
        <LibraryModal
          title="Galeri seç"
          description="Birden fazla görsel seçebilir veya seçimi temizleyebilirsiniz."
          onClose={() => setOpen(false)}
        >
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
            {library.map((item) => {
              const active = selectedUrls.includes(item.url);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleUrl(item.url)}
                  className={`overflow-hidden rounded-lg border text-left transition-colors ${
                    active
                      ? "border-macework ring-2 ring-macework/20"
                      : "border-border hover:border-macework/40"
                  }`}
                >
                  <div className="relative">
                    {isImage(item) ? (
                      <img
                        src={item.url}
                        alt={item.originalName}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center bg-muted/30">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    {active ? (
                      <span className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-macework text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    ) : null}
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-bold">{item.originalName}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{item.mimeType}</p>
                  </div>
                </button>
              );
            })}
            {library.length === 0 ? (
              <div className="col-span-full rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Henüz medya bulunmuyor.
              </div>
            ) : null}
          </div>
        </LibraryModal>
      ) : null}
    </div>
  );
}
