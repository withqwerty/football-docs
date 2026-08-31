/** Shared HTTP utilities for crawling and discovery. */

const MAX_RESPONSE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Check if a URL returns a successful response.
 *
 * HEAD first, because it is cheap, then a one-byte ranged GET when HEAD fails.
 * Some hosts serve a document happily on GET and answer HEAD with a 404 -
 * api.fmdb.pro does exactly that for its OpenAPI document - and reporting those
 * as missing sends a maintainer chasing a source that was never gone.
 */
export async function urlExists(url: string): Promise<{ ok: boolean; contentType?: string }> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      return {
        ok: true,
        contentType: response.headers.get("content-type") ?? undefined,
      };
    }
  } catch {
    // Fall through to the GET probe below.
  }

  try {
    const response = await fetch(url, {
      headers: { Range: "bytes=0-0" },
      signal: AbortSignal.timeout(10000),
    });
    return {
      ok: response.ok,
      contentType: response.headers.get("content-type") ?? undefined,
    };
  } catch {
    return { ok: false };
  }
}

/** Fetch text content from a URL, returning null on failure. Rejects responses over 10MB. */
export async function fetchText(url: string, timeoutMs = 15000): Promise<string | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) return null;

    // Reject obviously oversized responses early via Content-Length
    const contentLength = response.headers.get("content-length");
    if (contentLength && Number(contentLength) > MAX_RESPONSE_BYTES) return null;

    return await response.text();
  } catch {
    return null;
  }
}
