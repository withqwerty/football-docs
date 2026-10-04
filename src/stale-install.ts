/**
 * Warn when football-docs was updated on disk under a running server.
 *
 * `npx football-docs` keeps one cache folder per package spec and updates it
 * in place. A server that started before the update keeps running its old code
 * against the new files, so a module it loads later, such as a native add-on,
 * may no longer be there. On 2 October 2026 a server started on 30 September
 * failed every call with "Could not locate the bindings file", because its
 * folder now held a version that no longer ships that add-on. Nothing in the
 * error said to reconnect.
 *
 * Each tool call compares the version this process started with against the
 * package.json on disk, rereading the file only when it changes. When they
 * differ, the reply starts with a note saying how to recover.
 */

import { readFileSync, statSync } from "node:fs";

export type TextReply = { isError?: boolean; content: Array<{ type: "text"; text: string }> };

export class InstallWatch {
  private seenMtimeMs = -1;
  private diskVersion: string | null;

  constructor(
    private readonly packageJsonPath: string,
    readonly runningVersion: string,
  ) {
    this.diskVersion = runningVersion;
  }

  /** The version on disk, or null when package.json is gone or unreadable. */
  current(): string | null {
    try {
      const mtimeMs = statSync(this.packageJsonPath).mtimeMs;
      if (mtimeMs !== this.seenMtimeMs) {
        this.seenMtimeMs = mtimeMs;
        this.diskVersion = (JSON.parse(readFileSync(this.packageJsonPath, "utf8")) as { version?: string }).version ?? null;
      }
    } catch {
      this.diskVersion = null;
    }
    return this.diskVersion;
  }

  /** The note to show, or null when the files on disk are the version this server runs. */
  notice(): string | null {
    const onDisk = this.current();
    if (onDisk === this.runningVersion) return null;
    const what = onDisk
      ? `football-docs on disk is now v${onDisk}, but this server is still running v${this.runningVersion}`
      : `the football-docs files this server (v${this.runningVersion}) started from are gone`;
    return `Note: ${what}. Reconnect or restart the football-docs MCP server to use the installed version (in Claude Code: /mcp, then reconnect football-docs). Until then, tools may fail with errors about missing files.`;
  }

  /** Run a tool handler and put the notice first in its reply, also when the handler fails. */
  async wrap(handler: () => Promise<TextReply> | TextReply): Promise<TextReply> {
    let reply: TextReply;
    try {
      reply = await handler();
    } catch (error) {
      const note = this.notice();
      if (!note) throw error;
      return { isError: true, content: [{ type: "text", text: `${note}\n\n${error instanceof Error ? error.message : String(error)}` }] };
    }
    const note = this.notice();
    return note ? { ...reply, content: [{ type: "text", text: note }, ...reply.content] } : reply;
  }
}
