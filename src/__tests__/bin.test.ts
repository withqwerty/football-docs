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
    tools?: Array<{
      name: string;
      description?: string;
      inputSchema?: {
        properties?: Record<string, { description?: string }>;
      };
    }>;
    content?: Array<{
      type: "text";
      text: string;
    }>;
    isError?: boolean;
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

  it("exposes current provider guidance in the MCP tool schema", async () => {
    const child = spawn("node", ["bin/serve.js"], {
      cwd: ROOT,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stderr = "";
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf-8");
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
      const initResponse = await Promise.race([
        readJsonLine(child.stdout),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`timed out waiting for initialize; stderr=${stderr}`)), 5_000);
        }),
      ]);
      expect(initResponse.error).toBeUndefined();

      child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized", params: {} })}\n`);
      child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} })}\n`);

      const toolsResponse = await Promise.race([
        readJsonLine(child.stdout),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`timed out waiting for tools/list; stderr=${stderr}`)), 5_000);
        }),
      ]);

      const searchTool = toolsResponse.result?.tools?.find((tool) => tool.name === "search_docs");
      const resolveProviderTool = toolsResponse.result?.tools?.find((tool) => tool.name === "resolve_provider_id");
      const getProviderDocsTool = toolsResponse.result?.tools?.find((tool) => tool.name === "get_provider_docs");
      const compareTool = toolsResponse.result?.tools?.find((tool) => tool.name === "compare_providers");

      expect(searchTool?.inputSchema?.properties?.provider?.description).toContain("list_providers");
      expect(searchTool?.inputSchema?.properties?.provider?.description).toContain("Common aliases");
      expect(searchTool?.inputSchema?.properties?.provider?.description).toContain("FMDB");
      expect(searchTool?.inputSchema?.properties?.provider?.description).toContain("Sofascore");
      expect(searchTool?.inputSchema?.properties?.provider?.description).toContain("WhoScored");
      expect(searchTool?.inputSchema?.properties?.provider?.description).toContain("ClubElo");
      expect(searchTool?.inputSchema?.properties?.provider?.description).toContain("football-data.co.uk");
      expect(searchTool?.inputSchema?.properties?.provider?.description).toContain("engsoccerdata");
      expect(searchTool?.inputSchema?.properties?.provider?.description).toContain("Metrica");
      expect(searchTool?.inputSchema?.properties?.provider?.description).toContain("Second Spectrum");
      expect(searchTool?.inputSchema?.properties?.provider?.description).toContain("SportRadar API");
      expect(searchTool?.inputSchema?.properties?.provider?.description).toContain("Soccer Extended");
      expect(searchTool?.inputSchema?.properties?.provider?.description).toContain("TheSportsDB");
      expect(searchTool?.inputSchema?.properties?.provider?.description).toContain("TSDB");
      expect(resolveProviderTool?.inputSchema?.properties?.query?.description).toContain("Provider name");
      expect(getProviderDocsTool?.inputSchema?.properties?.provider?.description).toContain("Provider key or alias");
      expect(getProviderDocsTool?.inputSchema?.properties?.topic?.description).toContain("Optional topic");
      expect(compareTool?.inputSchema?.properties?.providers?.description).toContain("common aliases");
      expect(compareTool?.inputSchema?.properties?.providers?.description).toContain("Sofascore");
      expect(compareTool?.inputSchema?.properties?.providers?.description).toContain("WhoScored");
      expect(compareTool?.inputSchema?.properties?.providers?.description).toContain("ClubElo");
      expect(compareTool?.inputSchema?.properties?.providers?.description).toContain("football-data.co.uk");
      expect(compareTool?.inputSchema?.properties?.providers?.description).toContain("Sportec");
      expect(compareTool?.inputSchema?.properties?.providers?.description).toContain("Second Spectrum");
      expect(compareTool?.inputSchema?.properties?.providers?.description).toContain("SportRadar API");
      expect(compareTool?.inputSchema?.properties?.providers?.description).toContain("TheSportsDB");
    } finally {
      child.kill();
    }
  });

  it("answers search_docs over the stdio tools/call transport", async () => {
    const child = spawn("node", ["bin/serve.js"], {
      cwd: ROOT,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stderr = "";
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf-8");
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
      const initResponse = await Promise.race([
        readJsonLine(child.stdout),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`timed out waiting for initialize; stderr=${stderr}`)), 5_000);
        }),
      ]);
      expect(initResponse.error).toBeUndefined();

      child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized", params: {} })}\n`);
      child.stdin.write(
        `${JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "tools/call",
          params: {
            name: "search_docs",
            arguments: {
              query: "soccerdata public data pipeline cache directory no_cache no_store proxy retries FBref rate limits",
              provider: "soccerdata",
              max_results: 4,
            },
          },
        })}\n`,
      );

      const searchResponse = await Promise.race([
        readJsonLine(child.stdout),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`timed out waiting for tools/call; stderr=${stderr}`)), 5_000);
        }),
      ]);

      const text = searchResponse.result?.content?.map((entry) => entry.text).join("\n") ?? "";

      expect(searchResponse.error).toBeUndefined();
      expect(searchResponse.result?.isError).not.toBe(true);
      expect(searchResponse.id).toBe(2);
      expect(text).toContain("Rate Limits and Retries");
      expect(text).toContain("soccerdata");
      expect(text).toContain("no_cache=True");
    } finally {
      child.kill();
    }
  });

  it("answers Context7-style provider tools over the stdio tools/call transport", async () => {
    const child = spawn("node", ["bin/serve.js"], {
      cwd: ROOT,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stderr = "";
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf-8");
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
      const initResponse = await Promise.race([
        readJsonLine(child.stdout),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`timed out waiting for initialize; stderr=${stderr}`)), 5_000);
        }),
      ]);
      expect(initResponse.error).toBeUndefined();

      child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized", params: {} })}\n`);
      child.stdin.write(
        `${JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "tools/call",
          params: {
            name: "resolve_provider_id",
            arguments: { query: "Stats Perform" },
          },
        })}\n`,
      );

      const resolveResponse = await Promise.race([
        readJsonLine(child.stdout),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`timed out waiting for resolve_provider_id; stderr=${stderr}`)), 5_000);
        }),
      ]);
      const resolveText = resolveResponse.result?.content?.map((entry) => entry.text).join("\n") ?? "";

      expect(resolveResponse.error).toBeUndefined();
      expect(resolveResponse.result?.isError).not.toBe(true);
      expect(resolveResponse.id).toBe(2);
      expect(resolveText).toContain("provider ID: **opta**");
      expect(resolveText).toContain("**Indexed:** yes");

      child.stdin.write(
        `${JSON.stringify({
          jsonrpc: "2.0",
          id: 3,
          method: "tools/call",
          params: {
            name: "get_provider_docs",
            arguments: {
              provider: "Transfer Room",
              topic: "bearer token apiprod",
              max_results: 3,
            },
          },
        })}\n`,
      );

      const docsResponse = await Promise.race([
        readJsonLine(child.stdout),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`timed out waiting for get_provider_docs; stderr=${stderr}`)), 5_000);
        }),
      ]);
      const docsText = docsResponse.result?.content?.map((entry) => entry.text).join("\n") ?? "";

      expect(docsResponse.error).toBeUndefined();
      expect(docsResponse.result?.isError).not.toBe(true);
      expect(docsResponse.id).toBe(3);
      expect(docsText).toContain("Provider docs for **transferroom**");
      expect(docsText).toContain("Bearer");
      expect(docsText).toContain("apiprod.transferroom.com");
    } finally {
      child.kill();
    }
  });

  it("answers compare_providers over the stdio tools/call transport with aliases", async () => {
    const child = spawn("node", ["bin/serve.js"], {
      cwd: ROOT,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stderr = "";
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf-8");
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
      const initResponse = await Promise.race([
        readJsonLine(child.stdout),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`timed out waiting for initialize; stderr=${stderr}`)), 5_000);
        }),
      ]);
      expect(initResponse.error).toBeUndefined();

      child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized", params: {} })}\n`);
      child.stdin.write(
        `${JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "tools/call",
          params: {
            name: "compare_providers",
            arguments: {
              topic: "tracking pitch length width physical data",
              providers: ["Second Spectrum", "TRACAB", "SkillCorner"],
            },
          },
        })}\n`,
      );

      const compareResponse = await Promise.race([
        readJsonLine(child.stdout),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`timed out waiting for tools/call; stderr=${stderr}`)), 5_000);
        }),
      ]);

      const text = compareResponse.result?.content?.map((entry) => entry.text).join("\n") ?? "";

      expect(compareResponse.error).toBeUndefined();
      expect(compareResponse.result?.isError).not.toBe(true);
      expect(compareResponse.id).toBe(2);
      expect(text).toContain('Comparison for "tracking pitch length width physical data" across 3 provider(s)');
      expect(text).toContain("## kloppy");
      expect(text).toContain("## databallpy");
      expect(text).toContain("## skillcorner");
    } finally {
      child.kill();
    }
  });
});
