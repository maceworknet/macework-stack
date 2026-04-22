"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { useAdminToast } from "@/components/admin/admin-feedback";

export function MediaUploadForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const { notify } = useAdminToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("uploading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setStatus("error");
      setMessage(body?.error ?? "Yükleme başarısız oldu");
      notify({
        type: "error",
        title: "Yükleme başarısız oldu.",
        description: body?.error ?? "Dosya kaydedilemedi.",
      });
      return;
    }

    const body = await response.json();
    setStatus("done");
    setMessage(body.file?.url ?? "Yükleme tamamlandı");
    notify({
      type: "success",
      title: "Medya yüklendi.",
      description: body.file?.url ?? undefined,
    });
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6">
      <label className="block text-sm font-bold" htmlFor="file">
        Dosya yükle
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          id="file"
          name="file"
          type="file"
          required
          className="min-h-11 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <button
          disabled={status === "uploading"}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-macework px-5 text-sm font-bold text-white transition-colors hover:bg-macework-hover disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />
          {status === "uploading" ? "Yükleniyor" : "Yükle"}
        </button>
      </div>
      {message ? <p className="mt-3 text-xs font-medium text-muted-foreground">{message}</p> : null}
    </form>
  );
}
