export function resolveMediaUrl(input?: string | { url?: string | null } | null) {
  const url = typeof input === "string" ? input : input?.url;
  if (!url) return "/file.svg";
  if (url.startsWith("http") || url.startsWith("/") || url.startsWith("data:")) {
    return url;
  }
  return `/${url.replace(/^\/+/, "")}`;
}
