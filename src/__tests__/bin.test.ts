import { execFileSync, spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");

type JsonRpcResponse = {
  jsonrpc: "2.0";
  id: number;
  result?: {
    serverInfo?: {
      name?: string;
      version?: string;
    };
    capabilities?: {
      tools?: unknown;
    };
  };
  error?: unknown;
};

function readJsonLine(stream: NodeJS.ReadableStream): Promise<JsonRpcResponse> {
  return new Promise((resolveLine, rejectLine) => {
    let buffer = "";

    const cleanup = () => {
      stream.off("data", onData);
      stream.off("error", onError);
    };

    const onError = (error: Error) => {
      cleanup();
      rejectLine(error);
    };

    const onData = (chunk: Buffer) => {
      buffer += chunk.toString("utf-8");
      const newlineIndex = buffer.indexOf("\n");
      if (newlineIndex === -1) return;

      const line = buffer.slice(0, newlineIndex);
      cleanup();
      resolveLine(JSON.parse(line) as JsonRpcResponse);
    };

    stream.on("data", onData);
    stream.on("error", onError);
  });
}

describe("npm bin entrypoint", () => {
  beforeAll(() => {
    execFileSync("pnpm", ["build"], {
      cwd: ROOT,
      encoding: "utf-8",
      stdio: "pipe",
      timeout: 30_000,
    });
  }, 35_000);

  it("starts the MCP server and answers initialize", async () => {
    const child = spawn("node", ["bin/serve.js"], {
      cwd: ROOT,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stderr = "";
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf-8");
    });

    const responsePromise = readJsonLine(child.stdout);
    const exitPromise = new Promise<never>((_, reject) => {
      child.once("exit", (code, signal) => {
        reject(new Error(`bin/serve.js exited before initialize response: code=${code} signal=${signal} stderr=${stderr}`));
      });
    });
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`timed out waiting for initialize response; stderr=${stderr}`));
      }, 5_000);
    });

    try {
      child.stdin.write(
        `${JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: {
            protocolVersion: "2025-06-18",
            capabilities: {},
            clientInfo: { name: "football-docs-test", version: "0.0.0" },
          },
        })}\n`,
      );

      const response = await Promise.race([responsePromise, exitPromise, timeout]);

      expect(response.error).toBeUndefined();
      expect(response.id).toBe(1);
      expect(response.result?.serverInfo?.name).toBe("nutmeg-football-docs");
      expect(response.result?.serverInfo?.version).toMatch(/^\d+\.\d+\.\d+/);
      expect(response.result?.capabilities?.tools).toBeDefined();
    } finally {
      child.kill();
    }
  });
});
