import Link from "next/link";
import { Filter, RotateCcw, Search } from "lucide-react";
import type { SelectOption } from "@/lib/admin-listing";

type FilterField = {
  label: string;
  name: string;
  options: SelectOption[];
  value: string;
};

type ActiveFilter = {
  key: string;
  label: string;
  value: string;
};

export function AdminCollectionToolbar({
  action,
  searchValue,
  searchPlaceholder,
  filters,
  sortValue,
  sortOptions,
  resultCount,
  totalCount,
  activeFilters,
}: {
  action: string;
  searchValue: string;
  searchPlaceholder: string;
  filters: FilterField[];
  sortValue: string;
  sortOptions: SelectOption[];
  resultCount: number;
  totalCount: number;
  activeFilters: ActiveFilter[];
}) {
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <section className="mb-6 rounded-lg border border-border bg-card p-5">
      <form action={action} className="flex flex-col gap-4">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,2fr)_repeat(5,minmax(0,1fr))]">
          <label className="space-y-1.5 xl:col-span-1">
            <span className="text-xs font-bold text-muted-foreground">Arama</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                name="q"
                defaultValue={searchValue}
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-macework"
              />
            </div>
          </label>

          {filters.map((field) => (
            <label key={field.name} className="space-y-1.5">
              <span className="text-xs font-bold text-muted-foreground">{field.label}</span>
              <select
                name={field.name}
                defaultValue={field.value}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-macework"
              >
                {field.options.map((option) => (
                  <option key={`${field.name}-${option.value}`} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ))}

          <label className="space-y-1.5">
            <span className="text-xs font-bold text-muted-foreground">Sıralama</span>
            <select
              name="sort"
              defaultValue={sortValue}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-macework"
            >
              {sortOptions.map((option) => (
                <option key={`sort-${option.value}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 font-medium text-foreground">
              <Filter className="h-3.5 w-3.5" />
              {resultCount === totalCount
                ? `${totalCount} kayıt`
                : `${resultCount} / ${totalCount} kayıt gösteriliyor`}
            </span>

            {hasActiveFilters
              ? activeFilters.map((filter) => (
                  <span
                    key={filter.key}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium"
                  >
                    {filter.label}: {filter.value}
                  </span>
                ))
              : (
                  <span className="text-xs font-medium">Aktif filtre yok</span>
                )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={action}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-bold transition-colors hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4" />
              Sıfırla
            </Link>
            <button className="inline-flex h-10 items-center rounded-md bg-macework px-4 text-sm font-black text-white transition-colors hover:bg-macework-hover">
              Uygula
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
