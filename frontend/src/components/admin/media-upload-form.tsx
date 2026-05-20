"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { useAdminToast } from "@/components/admin/admin-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="space-y-1.5">
        <Label htmlFor="upload-file" className="text-sm font-bold">
          Dosya yükle
        </Label>
        <p className="text-xs text-muted-foreground">
          JPEG, PNG, WebP, GIF, SVG, PDF — maks. 10 MB
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Input
          id="upload-file"
          name="file"
          type="file"
          required
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,application/pdf"
          className="min-h-10 flex-1 cursor-pointer"
        />
        <Button
          type="submit"
          disabled={status === "uploading"}
          className="gap-2 bg-macework text-white hover:bg-macework-hover"
        >
          <Upload className="h-4 w-4" />
          {status === "uploading" ? "Yükleniyor…" : "Yükle"}
        </Button>
      </div>

      {message ? (
        <p
          className={`mt-3 break-all text-xs font-medium ${
            status === "error" ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
