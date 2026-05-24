const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

export function normalizeCmsHref(href: string | undefined, fallback: string): string {
  const value = href?.trim();
  if (!value) return fallback;

  try {
    const parsed = new URL(value);
    if (LOCAL_HOSTNAMES.has(parsed.hostname) && parsed.hash && (parsed.pathname === '/' || parsed.pathname === '')) {
      return parsed.hash;
    }
  } catch {
    return value;
  }

  return value;
}
