export function hidePublicChrome(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const path = pathname.replace(/\/+$/, "") || "/";
  // Login pages keep main site header/footer
  if (path === "/admin/login" || path === "/partner/login") return false;
  return path.startsWith("/admin") || path.startsWith("/partner") || path.startsWith("/customer");
}
