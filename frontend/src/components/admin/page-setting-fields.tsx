import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { AdminSubmitButton } from "@/components/admin/admin-feedback";

export function PageBackLink() {
  return (
    <Link
      href="/admin/pages"
      className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      Sayfalara don
    </Link>
  );
}

export function PageSettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-black">{title}</h2>
        {description ? (
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

export function PageTextField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-macework"
      />
    </label>
  );
}

export function PageTextArea({
  label,
  name,
  defaultValue,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
}) {
  return (
    <label className="space-y-1.5 md:col-span-2">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-macework"
      />
    </label>
  );
}

export function PageSaveBar({ label = "Kaydet" }: { label?: string }) {
  return (
    <div className="sticky bottom-4 z-30 rounded-lg border border-border bg-background/95 p-3 shadow-lg backdrop-blur">
      <AdminSubmitButton pendingChildren="Kaydediliyor">
        <Save className="h-4 w-4" />
        {label}
      </AdminSubmitButton>
    </div>
  );
}
