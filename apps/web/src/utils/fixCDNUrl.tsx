export function fixCDNUrl(url?: string | null) {
  if (!url) return "";

  // Leave local preview URLs untouched
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;

  // If not http → invalid
  if (!url.startsWith("http")) return "";

  // Convert old CDN path → new R2 path
  return url.replace(
    "https://cdn.lightningq.com/",
    "https://cdn.lightningq.com/lightningq-storage/"
  );
}
