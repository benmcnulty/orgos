import { describe, expect, test } from "bun:test";
import path from "node:path";

import {
  discoverInferenceSources,
  hostsFrom24,
  localPrivateIpv4Addresses,
  normalizeInferenceAddress,
  probeInferenceSource,
  privateIpv4Subnets,
  resolveContentType,
  safeJoin,
  verifyInferenceSource,
} from "../server/app";

describe("server helpers", () => {
  test("safeJoin keeps requests inside the intended base directory", () => {
    const baseDir = "/workspace/orgos/.data";

    expect(safeJoin(baseDir, "content/app.json")).toBe(
      path.join(baseDir, "content/app.json"),
    );
    expect(safeJoin(baseDir, "../package.json")).toBeNull();
  });

  test("resolveContentType returns explicit types for supported assets", () => {
    expect(resolveContentType("index.html")).toBe("text/html; charset=utf-8");
    expect(resolveContentType("styles.css")).toBe("text/css; charset=utf-8");
    expect(resolveContentType("app.json")).toBe(
      "application/json; charset=utf-8",
    );
    expect(resolveContentType("blob.bin")).toBe("application/octet-stream");
  });

  test("normalizeInferenceAddress accepts http inference origins", () => {
    expect(normalizeInferenceAddress("http://127.0.0.1:11434/api/tags")).toBe(
      "http://127.0.0.1:11434",
    );
    expect(normalizeInferenceAddress("https://example.com/path")).toBe(
      "https://example.com",
    );
    expect(normalizeInferenceAddress("ftp://example.com")).toBeNull();
  });

  test("hostsFrom24 expands a /24 into usable host addresses", () => {
    const hosts = hostsFrom24("192.168.1.0/24");

    expect(hosts[0]).toBe("192.168.1.1");
    expect(hosts.at(-1)).toBe("192.168.1.254");
    expect(hosts.length).toBe(254);
  });

  test("privateIpv4Subnets returns an array of local private cidrs", () => {
    expect(Array.isArray(privateIpv4Subnets())).toBe(true);
  });

  test("localPrivateIpv4Addresses returns local private interface addresses", () => {
    expect(Array.isArray(localPrivateIpv4Addresses())).toBe(true);
  });

  test("verifyInferenceSource reports an available localhost gemma4 setup", async () => {
    const status = await verifyInferenceSource(async () =>
      Response.json({
        models: [{ name: "gemma4:latest" }],
      }),
    );

    expect(status.available).toBe(true);
    expect(status.model).toBe("gemma4:latest");
    expect(status.instructions).toEqual([]);
    expect(status.note).toContain("settings panel");
  });

  test("verifyInferenceSource reports install guidance when unavailable", async () => {
    const status = await verifyInferenceSource(async () => {
      throw new Error("offline");
    });

    expect(status.available).toBe(false);
    expect(status.instructions.length).toBeGreaterThan(0);
    expect(status.instructions.join(" ")).toContain("Ollama");
  });

  test("probeInferenceSource returns model inventory for reachable sources", async () => {
    const status = await probeInferenceSource("http://localhost:11434", async () =>
      Response.json({
        models: [{ name: "gemma4:latest" }, { name: "qwen3-coder:latest" }],
      }),
    );

    expect(status.available).toBe(true);
    expect(status.address).toBe("http://localhost:11434");
    expect(status.models).toEqual(["gemma4:latest", "qwen3-coder:latest"]);
  });

  test("probeInferenceSource accepts compatible gemma4 variants when latest is unavailable", async () => {
    const status = await probeInferenceSource("http://localhost:11434", async () =>
      Response.json({
        models: [{ name: "gemma4:e2b" }, { name: "granite4:3b" }],
      }),
    );

    expect(status.available).toBe(true);
    expect(status.model).toBe("gemma4:e2b");
    expect(status.note).toContain("gemma4:latest is not available");
  });

  test("discoverInferenceSources includes localhost when available", async () => {
    const sources = await discoverInferenceSources(async (url) => {
      if (String(url).includes("127.0.0.1")) {
        return Response.json({
          models: [{ name: "gemma4:latest" }],
        });
      }

      throw new Error("offline");
    });

    expect(sources.length).toBeGreaterThan(0);
    expect(sources[0]?.address).toBe("http://127.0.0.1:11434");
  });
});
