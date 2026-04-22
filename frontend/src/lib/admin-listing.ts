export type RawSearchParams = Record<string, string | string[] | undefined>;

export type AdminListingQuery = {
  q: string;
  status: string;
  category: string;
  featured: string;
  year: string;
  sort: string;
};

export type SelectOption = {
  label: string;
  value: string;
};

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export function getAdminListingQuery(searchParams: RawSearchParams): AdminListingQuery {
  return {
    q: firstValue(searchParams.q).trim(),
    status: firstValue(searchParams.status).trim(),
    category: firstValue(searchParams.category).trim(),
    featured: firstValue(searchParams.featured).trim(),
    year: firstValue(searchParams.year).trim(),
    sort: firstValue(searchParams.sort).trim() || "latest",
  };
}

export function includesSearch(query: string, ...values: unknown[]) {
  if (!query) return true;

  const normalizedQuery = query.toLocaleLowerCase("tr-TR");

  return values.some((value) =>
    String(value ?? "")
      .toLocaleLowerCase("tr-TR")
      .includes(normalizedQuery)
  );
}

export function uniqueOptions(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.map((value) => value?.trim()).filter(Boolean) as string[]))
    .sort((left, right) => left.localeCompare(right, "tr-TR"))
    .map((value) => ({ label: value, value }));
}

function toTimestamp(value: unknown) {
  if (!value) return 0;

  if (value instanceof Date) {
    return value.getTime();
  }

  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

function compareText(left: string, right: string) {
  return left.localeCompare(right, "tr-TR");
}

export function sortCollection<T>(
  items: T[],
  sort: string,
  config: {
    getTitle: (item: T) => string;
    getDate: (item: T) => unknown;
    getManual?: (item: T) => number | null | undefined;
    getPublished?: (item: T) => boolean | null | undefined;
    getFeatured?: (item: T) => boolean | null | undefined;
  }
) {
  const sorted = [...items];

  sorted.sort((left, right) => {
    const leftTitle = config.getTitle(left) ?? "";
    const rightTitle = config.getTitle(right) ?? "";
    const newest = toTimestamp(config.getDate(right)) - toTimestamp(config.getDate(left));

    switch (sort) {
      case "oldest":
        return toTimestamp(config.getDate(left)) - toTimestamp(config.getDate(right));
      case "title-asc":
        return compareText(leftTitle, rightTitle);
      case "title-desc":
        return compareText(rightTitle, leftTitle);
      case "manual": {
        const leftManual = config.getManual?.(left) ?? Number.MAX_SAFE_INTEGER;
        const rightManual = config.getManual?.(right) ?? Number.MAX_SAFE_INTEGER;
        return leftManual - rightManual || compareText(leftTitle, rightTitle);
      }
      case "status": {
        const publishedDiff =
          Number(Boolean(config.getPublished?.(right))) -
          Number(Boolean(config.getPublished?.(left)));
        return publishedDiff || newest || compareText(leftTitle, rightTitle);
      }
      case "featured": {
        const featuredDiff =
          Number(Boolean(config.getFeatured?.(right))) -
          Number(Boolean(config.getFeatured?.(left)));
        return featuredDiff || newest || compareText(leftTitle, rightTitle);
      }
      case "latest":
      default:
        return newest || compareText(leftTitle, rightTitle);
    }
  });

  return sorted;
}
