export function isValidGlbUrl(value: string | null | undefined): value is string {
  if (!value) return false;

  const trimmed = value.trim();
  if (!trimmed) return false;

  try {
    const url = new URL(trimmed, "https://stylixai.com");
    const allowedProtocol = url.protocol === "http:" || url.protocol === "https:";
    return allowedProtocol && url.pathname.toLowerCase().endsWith(".glb");
  } catch {
    return false;
  }
}
