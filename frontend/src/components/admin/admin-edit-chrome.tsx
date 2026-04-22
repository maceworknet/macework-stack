import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

export function AdminEditChrome({
  parentHref,
  parentLabel,
  currentLabel,
}: {
  parentHref: string;
  parentLabel: string;
  currentLabel: string;
}) {
  return (
    <div className="mb-6 space-y-3">
      <nav className="flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground">
        <Link href="/admin" className="transition-colors hover:text-foreground">
          Admin
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={parentHref} className="transition-colors hover:text-foreground">
          {parentLabel}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{currentLabel}</span>
      </nav>

      <Link
        href={parentHref}
        className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-black transition-colors hover:bg-muted"
      >
        <ArrowLeft className="h-4 w-4" />
        Listeye dön
      </Link>
    </div>
  );
}
