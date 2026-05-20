import Link from "next/link";
import { Filter, RotateCcw, Search } from "lucide-react";
import type { SelectOption } from "@/lib/admin-listing";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

/**
 * shadcn Select doesn't work with native form serialization — we use a hidden
 * input pattern so the value is included in FormData on submit.
 */
function FilterSelect({
  field,
}: {
  field: FilterField;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold text-muted-foreground">{field.label}</Label>
      <div className="relative">
        {/* Hidden native select for form submission */}
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
      </div>
    </div>
  );
}

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
    <section className="mb-6 rounded-xl border border-border bg-card p-5 shadow-sm">
      <form action={action} className="flex flex-col gap-4">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,2fr)_repeat(5,minmax(0,1fr))]">
          {/* Search */}
          <div className="space-y-1.5 xl:col-span-1">
            <Label htmlFor="toolbar-search" className="text-xs font-bold text-muted-foreground">
              Arama
            </Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="toolbar-search"
                type="search"
                name="q"
                defaultValue={searchValue}
                placeholder={searchPlaceholder}
                className="pl-9 focus-visible:ring-macework/30"
              />
            </div>
          </div>

          {/* Filters */}
          {filters.map((field) => (
            <FilterSelect key={field.name} field={field} />
          ))}

          {/* Sort */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-muted-foreground">Sıralama</Label>
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
          </div>
        </div>

        <Separator />

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Result count & active filter badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1.5 font-medium">
              <Filter className="h-3 w-3" />
              {resultCount === totalCount
                ? `${totalCount} kayıt`
                : `${resultCount} / ${totalCount} gösteriliyor`}
            </Badge>

            {hasActiveFilters
              ? activeFilters.map((filter) => (
                  <Badge
                    key={filter.key}
                    variant="outline"
                    className="text-xs font-medium"
                  >
                    {filter.label}: {filter.value}
                  </Badge>
                ))
              : (
                  <span className="text-xs text-muted-foreground">Aktif filtre yok</span>
                )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href={action}
              className={buttonVariants({ variant: "outline", size: "sm", className: "gap-2" })}
            >
              <RotateCcw className="h-4 w-4" />
              Sıfırla
            </Link>
            <Button
              size="sm"
              className="bg-macework text-white hover:bg-macework-hover"
            >
              Uygula
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
