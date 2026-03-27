/** Shared HTTP utilities for crawling and discovery. */

/** Check if a URL returns a successful response. */
export async function urlExists(url: string): Promise<{ ok: boolean; contentType?: string }> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    return {
      ok: response.ok,
      contentType: response.headers.get("content-type") ?? undefined,
    };
  } catch {
    return { ok: false };
  }
}

/** Fetch text content from a URL, returning null on failure. */
export async function fetchText(url: string, timeoutMs = 15000): Promise<string | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}
