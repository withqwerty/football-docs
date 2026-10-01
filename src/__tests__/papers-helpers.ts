import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { PaperOptions } from "../papers/core.js";

// The paper tools call public services. Tests answer every request from a
// table of canned replies, keyed by URL prefix, and fail on any request the
// table does not expect, so nothing touches the network.

export type Reply = { status?: number; body?: string; bytes?: Uint8Array; headers?: Record<string, string> };
export type Route = [prefix: string, reply: Reply | ((url: string, init?: RequestInit) => Reply)];

export function fakeFetch(routes: Route[], calls: string[] = []): typeof fetch {
  return (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    calls.push(`${init?.method ?? "GET"} ${url}`);
    const route = routes.find(([prefix]) => url.startsWith(prefix));
    if (!route) throw new Error(`unexpected request: ${url}`);
    const reply = typeof route[1] === "function" ? route[1](url, init) : route[1];
    const body = reply.bytes ? new Uint8Array(reply.bytes) : (reply.body ?? "");
    return new Response(reply.status && [204, 301, 302, 304].includes(reply.status) ? null : body, {
      status: reply.status ?? 200,
      headers: reply.headers,
    });
  }) as typeof fetch;
}

export function options(routes: Route[], calls: string[] = [], extra: PaperOptions = {}): PaperOptions & { lookup: (host: string) => Promise<string[]> } {
  return {
    env: {},
    fetchImpl: fakeFetch(routes, calls),
    cacheDir: mkdtempSync(join(tmpdir(), "fd-papers-")),
    sleep: async () => undefined,
    keychain: async () => null,
    lookup: async () => ["93.184.216.34"],
    ...extra,
  };
}

export const text = (result: { content: Array<{ text: string }> }) => result.content[0].text;
