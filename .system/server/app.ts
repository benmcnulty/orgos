import { existsSync, watch } from "node:fs";
import { mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import net from "node:net";
import os from "node:os";
import path from "node:path";

export type OrgosApp = {
  dataDir: string;
  fetch: (request: Request) => Promise<Response>;
  publicDir: string;
  rootDir: string;
  startWatchers: () => void;
};

export type InferenceStatus = {
  address: string;
  available: boolean;
  checkedAt: string;
  detail: string;
  hostname: string;
  instructions: string[];
  models: string[];
  model: string;
  note: string;
  sourceType: string;
  service: string;
};

export type DiscoveredInferenceSource = {
  address: string;
  available: boolean;
  detail: string;
  hostname: string;
  models: string[];
  note: string;
  sourceType: string;
  service: string;
};

type StoredSource = {
  active: boolean;
  address: string;
  id: string;
  kind: "local_default" | "saved";
  labelCustomized: boolean;
  model: string;
  name: string;
  tier: "top" | "mid" | "low";
};

type SourcesConfig = {
  sources: StoredSource[];
  version: number;
};

type OrganizationAbout = {
  createdAt: string;
  description: string;
  id: string;
  industry: string;
  industryCustom: string;
  lastActiveAt?: string;
  name: string;
  updatedAt: string;
};

type OrganizationsIndex = {
  activeOrganizationId: string | null;
  version: number;
};

type OrganizationSaveResult =
  | { ok: true; state: Awaited<ReturnType<typeof readOrganizations>> }
  | { ok: false; reason: "duplicate_name" | "invalid_name" };

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".ico", "image/x-icon"],
]);

export function resolveContentType(filePath: string) {
  const extension = path.extname(filePath);
  return contentTypes.get(extension) ?? "application/octet-stream";
}

function slugifyOrganizationName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function safeJoin(baseDir: string, requestPath: string) {
  const resolved = path.normalize(path.join(baseDir, requestPath));
  if (!resolved.startsWith(baseDir)) {
    return null;
  }

  return resolved;
}

async function serveFile(filePath: string) {
  const file = await readFile(filePath);

  return new Response(file, {
    headers: {
      "content-type": resolveContentType(filePath),
    },
  });
}

async function fetchJsonWithTimeout(
  url: string,
  timeoutMs: number,
  fetchImpl: typeof fetch = fetch,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, {
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    return response;
  } finally {
    clearTimeout(timeout);
  }
}

async function isTcpPortOpen(
  host: string,
  port: number,
  timeoutMs: number,
): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;

    function finish(result: boolean) {
      if (settled) {
        return;
      }

      settled = true;
      socket.destroy();
      resolve(result);
    }

    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
    socket.once("close", () => finish(false));
    socket.connect(port, host);
  });
}

export function normalizeInferenceAddress(address: string) {
  try {
    const value = new URL(address);
    if (!["http:", "https:"].includes(value.protocol)) {
      return null;
    }

    return value.origin;
  } catch {
    return null;
  }
}

export function privateIpv4Subnets() {
  const interfaces = os.networkInterfaces();
  const subnets = new Set<string>();

  for (const entries of Object.values(interfaces)) {
    for (const net of entries ?? []) {
      if (net.family !== "IPv4" || net.internal) {
        continue;
      }

      const ip = net.address;
      if (
        ip.startsWith("192.168.") ||
        ip.startsWith("10.") ||
        /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
      ) {
        const [a, b, c] = ip.split(".");
        subnets.add(`${a}.${b}.${c}.0/24`);
      }
    }
  }

  return [...subnets];
}

export function localPrivateIpv4Addresses() {
  const interfaces = os.networkInterfaces();
  const addresses = new Set<string>();

  for (const entries of Object.values(interfaces)) {
    for (const net of entries ?? []) {
      if (net.family !== "IPv4" || net.internal) {
        continue;
      }

      const ip = net.address;
      if (
        ip.startsWith("192.168.") ||
        ip.startsWith("10.") ||
        /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
      ) {
        addresses.add(ip);
      }
    }
  }

  return [...addresses];
}

export function hostsFrom24(cidr: string) {
  const [base] = cidr.split("/");
  const [a, b, c] = base.split(".");
  const hosts: string[] = [];

  for (let index = 1; index <= 254; index += 1) {
    hosts.push(`${a}.${b}.${c}.${index}`);
  }

  return hosts;
}

export async function probeInferenceSource(
  address: string,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 1500,
): Promise<InferenceStatus> {
  const checkedAt = new Date().toISOString();
  const normalizedAddress = normalizeInferenceAddress(address);
  const service = normalizedAddress ?? address;
  const unavailableStatus: InferenceStatus = {
    address: service,
    available: false,
    checkedAt,
    detail:
      "orgos could not verify an Ollama inference source at the configured address.",
    hostname: normalizedAddress ? new URL(normalizedAddress).hostname : "",
    instructions: [
      "Install Ollama from https://ollama.com/download",
      "Start the Ollama service on this machine",
      "Run `ollama pull gemma4:latest`",
      "Return here and run verification again",
    ],
    models: [],
    model: "gemma4:latest",
    note: "",
    service,
    sourceType: "ollama",
  };

  if (!normalizedAddress) {
    return {
      ...unavailableStatus,
      detail: "orgos could not parse the configured inference source address.",
    };
  }

  try {
    const response = await fetchJsonWithTimeout(
      `${normalizedAddress}/api/tags`,
      timeoutMs,
      fetchImpl,
    );

    if (!response.ok) {
      return unavailableStatus;
    }

    const payload = (await response.json()) as {
      models?: Array<{ model?: string; name?: string }>;
    };
    const models = payload.models ?? [];
    const availableModels = models
      .map((model) => model.model ?? model.name ?? "")
      .filter(Boolean);
    if (availableModels.length === 0) {
      return {
        ...unavailableStatus,
        detail:
          "orgos reached the Ollama source, but no models are currently available there.",
        hostname: new URL(normalizedAddress).hostname,
        models: availableModels,
      };
    }

    const hasGemmaLatest = availableModels.includes("gemma4:latest");
    const hasGemma4Family = availableModels.some((model) =>
      model.startsWith("gemma4:"),
    );
    const hasGemmaFamily = availableModels.some((model) =>
      model.startsWith("gemma"),
    );

    if (!hasGemmaLatest) {
      const detail = hasGemma4Family
        ? "Ollama is available and a compatible gemma4 model is ready for orgos."
        : hasGemmaFamily
          ? "Ollama is available, but only a non-gemma4 gemma model was detected."
          : "Ollama is available, but no gemma-family model was detected.";
      const note = hasGemma4Family
        ? "gemma4:latest is not available here, so orgos will use another detected gemma4 model."
        : hasGemmaFamily
          ? "Compatibility cannot be guaranteed because this source does not currently expose a gemma4 model."
          : "Compatibility cannot be guaranteed because this source does not currently expose a gemma-family model.";

      return {
        address: normalizedAddress,
        available: true,
        checkedAt,
        detail,
        hostname: new URL(normalizedAddress).hostname,
        instructions: [],
        models: availableModels,
        model: hasGemma4Family
          ? availableModels.find((model) => model.startsWith("gemma4:")) ?? ""
          : hasGemmaFamily
            ? availableModels.find((model) => model.startsWith("gemma")) ?? ""
            : availableModels[0] ?? "",
        note,
        service: normalizedAddress,
        sourceType: "ollama",
      };
    }

    return {
      address: normalizedAddress,
      available: true,
      checkedAt,
      detail:
        "Ollama is available and gemma4:latest is ready for orgos.",
      hostname: new URL(normalizedAddress).hostname,
      instructions: [],
      models: availableModels,
      model: "gemma4:latest",
      note:
        "A more advanced setup with multiple and varied inference sources can be configured later through the settings panel.",
      service: normalizedAddress,
      sourceType: "ollama",
    };
  } catch {
    return unavailableStatus;
  }
}

export async function verifyInferenceSource(
  fetchImpl: typeof fetch = fetch,
): Promise<InferenceStatus> {
  return probeInferenceSource("http://127.0.0.1:11434", fetchImpl);
}

export async function discoverInferenceSources(
  fetchImpl: typeof fetch = fetch,
): Promise<DiscoveredInferenceSource[]> {
  const localhost = await verifyInferenceSource(fetchImpl);
  const seen = new Set<string>([localhost.address]);
  const localAddresses = new Set(localPrivateIpv4Addresses());
  const discovered: DiscoveredInferenceSource[] = [
    {
      address: localhost.address,
      available: localhost.available,
      detail: localhost.detail,
      hostname: localhost.hostname || "localhost",
      models: localhost.models,
      note: localhost.note,
      service: localhost.service,
      sourceType: localhost.sourceType,
    },
  ];

  const candidateHosts = privateIpv4Subnets().flatMap((cidr) => hostsFrom24(cidr));
  const tcpConcurrency = 64;
  const httpConcurrency = 8;
  const tcpTimeoutMs = 250;
  const discoveryTimeoutMs = 2500;
  let cursor = 0;
  const reachableHosts: string[] = [];

  async function scanPortsWorker() {
    while (cursor < candidateHosts.length) {
      const host = candidateHosts[cursor];
      cursor += 1;

      if (localAddresses.has(host)) {
        continue;
      }

      const current = `http://${host}:11434`;
      if (seen.has(current)) {
        continue;
      }

      const open = await isTcpPortOpen(host, 11434, tcpTimeoutMs);
      if (open) {
        reachableHosts.push(host);
      }
    }
  }

  await Promise.all(Array.from({ length: tcpConcurrency }, () => scanPortsWorker()));

  let reachableCursor = 0;
  async function probeReachableWorker() {
    while (reachableCursor < reachableHosts.length) {
      const host = reachableHosts[reachableCursor];
      reachableCursor += 1;

      const current = `http://${host}:11434`;
      let result = await probeInferenceSource(current, fetchImpl, discoveryTimeoutMs);

      if (!result.available) {
        result = await probeInferenceSource(current, fetchImpl, discoveryTimeoutMs);
      }

      if (!result.available) {
        continue;
      }

      const resultHost = new URL(result.address).hostname;
      if (localAddresses.has(resultHost)) {
        continue;
      }

      seen.add(result.address);
      discovered.push({
        address: result.address,
        available: result.available,
        detail: result.detail,
        hostname: result.hostname || new URL(result.address).hostname,
        models: result.models,
        note: result.note,
        service: result.service,
        sourceType: result.sourceType,
      });
    }
  }

  await Promise.all(
    Array.from({ length: httpConcurrency }, () => probeReachableWorker()),
  );

  return discovered;
}

export function createOrgosApp(rootDir: string): OrgosApp {
  const publicDir = path.join(rootDir, ".system", "public");
  const dataDir = path.join(rootDir, ".data");
  const systemDir = path.join(dataDir, "system");
  const organizationsDir = path.join(dataDir, "organizations");
  const sourcesConfigPath = path.join(systemDir, "sources.json");
  const organizationsIndexPath = path.join(systemDir, "organizations.json");
  const watchDirs = [
    publicDir,
    dataDir,
    path.join(rootDir, ".system", "server"),
  ];

  function createDefaultStoredSource(): StoredSource {
    return {
      active: true,
      address: "http://127.0.0.1:11434",
      id: "source-localhost",
      kind: "local_default",
      labelCustomized: false,
      model: "",
      name: "Localhost Ollama",
      tier: "mid",
    };
  }

  async function writeJsonFile(filePath: string, payload: unknown) {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  }

  async function readJsonOrDefault<T>(filePath: string, fallback: T): Promise<T> {
    if (!existsSync(filePath)) {
      await writeJsonFile(filePath, fallback);
      return fallback;
    }

    try {
      const file = await readFile(filePath, "utf8");
      return JSON.parse(file) as T;
    } catch {
      await writeJsonFile(filePath, fallback);
      return fallback;
    }
  }

  async function readSourcesConfig(): Promise<SourcesConfig> {
    const fallback: SourcesConfig = {
      sources: [createDefaultStoredSource()],
      version: 1,
    };
    const config = await readJsonOrDefault(sourcesConfigPath, fallback);

    if (!Array.isArray(config.sources) || config.sources.length === 0) {
      await writeJsonFile(sourcesConfigPath, fallback);
      return fallback;
    }

    if (!config.sources.some((source) => source.kind === "local_default")) {
      config.sources.unshift(createDefaultStoredSource());
      await writeJsonFile(sourcesConfigPath, config);
    }

    return config;
  }

  async function writeSourcesConfig(sources: StoredSource[]) {
    const deduped = new Map<string, StoredSource>();
    const orderedAddresses: string[] = [];

    for (const source of sources) {
      const normalizedAddress = normalizeInferenceAddress(source.address);
      if (!normalizedAddress) {
        continue;
      }

      if (!deduped.has(normalizedAddress)) {
        orderedAddresses.push(normalizedAddress);
      }

      deduped.set(normalizedAddress, {
        active: Boolean(source.active),
        address: normalizedAddress,
        id: source.id || crypto.randomUUID(),
        kind: source.kind === "local_default" ? "local_default" : "saved",
        labelCustomized: Boolean(source.labelCustomized),
        model: source.model ?? "",
        name:
          source.kind === "local_default"
            ? (source.labelCustomized && source.name ? source.name : "Localhost Ollama")
            : (source.name || new URL(normalizedAddress).hostname),
        tier:
          source.tier === "top" || source.tier === "low" ? source.tier : "mid",
      });
    }

    if (!deduped.has("http://127.0.0.1:11434")) {
      orderedAddresses.unshift("http://127.0.0.1:11434");
      deduped.set("http://127.0.0.1:11434", createDefaultStoredSource());
    }

    const payload: SourcesConfig = {
      sources: orderedAddresses
        .filter((address, index, list) => list.indexOf(address) === index)
        .map((address) => deduped.get(address))
        .filter((source): source is StoredSource => Boolean(source)),
      version: 1,
    };

    await writeJsonFile(sourcesConfigPath, payload);
    return payload;
  }

  async function readOrganizationsIndex(): Promise<OrganizationsIndex> {
    return readJsonOrDefault(organizationsIndexPath, {
      activeOrganizationId: null,
      version: 1,
    });
  }

  async function readOrganizationAbout(id: string): Promise<OrganizationAbout | null> {
    const aboutPath = path.join(organizationsDir, id, "about.json");
    if (!existsSync(aboutPath)) {
      return null;
    }

    try {
      const file = await readFile(aboutPath, "utf8");
      return JSON.parse(file) as OrganizationAbout;
    } catch {
      return null;
    }
  }

  async function writeOrganizationAbout(organization: OrganizationAbout) {
    await writeJsonFile(
      path.join(organizationsDir, organization.id, "about.json"),
      organization,
    );
  }

  async function readOrganizations() {
    await mkdir(organizationsDir, { recursive: true });
    const index = await readOrganizationsIndex();
    const entries = await readdir(organizationsDir, { withFileTypes: true });
    const organizations: OrganizationAbout[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const about = await readOrganizationAbout(entry.name);
      if (about) {
        organizations.push(about);
      }
    }

    organizations.sort((left, right) => left.name.localeCompare(right.name));

    return {
      activeOrganizationId: index.activeOrganizationId,
      organizations,
    };
  }

  async function saveOrganization(payload: Partial<OrganizationAbout>, activate = false): Promise<OrganizationSaveResult> {
    const now = new Date().toISOString();
    const normalizedName = (payload.name ?? "").trim();
    const desiredId = slugifyOrganizationName(normalizedName);
    if (!desiredId) {
      return { ok: false, reason: "invalid_name" };
    }

    const previousId = payload.id ?? null;
    const id = desiredId;
    const existing = previousId ? await readOrganizationAbout(previousId) : null;
    const conflicting = id !== previousId ? await readOrganizationAbout(id) : null;
    if (conflicting) {
      return { ok: false, reason: "duplicate_name" };
    }

    const organization: OrganizationAbout = {
      createdAt: existing?.createdAt ?? now,
      description: payload.description ?? existing?.description ?? "",
      id,
      industry: payload.industry ?? existing?.industry ?? "custom",
      industryCustom: payload.industryCustom ?? existing?.industryCustom ?? "",
      lastActiveAt: activate
        ? now
        : existing?.lastActiveAt ?? "",
      name: normalizedName,
      updatedAt: now,
    };

    if (existing && previousId && previousId !== id) {
      await rename(path.join(organizationsDir, previousId), path.join(organizationsDir, id));
    }
    await writeOrganizationAbout(organization);
    const index = await readOrganizationsIndex();
    if (activate || !index.activeOrganizationId || index.activeOrganizationId === previousId) {
      index.activeOrganizationId = id;
    }
    await writeJsonFile(organizationsIndexPath, index);

    return { ok: true, state: await readOrganizations() };
  }

  async function activateOrganization(id: string) {
    const organization = await readOrganizationAbout(id);
    if (!organization) {
      return null;
    }

    organization.lastActiveAt = new Date().toISOString();
    organization.updatedAt = organization.updatedAt || organization.lastActiveAt;
    await writeOrganizationAbout(organization);

    const index = await readOrganizationsIndex();
    index.activeOrganizationId = id;
    await writeJsonFile(organizationsIndexPath, index);
    return readOrganizations();
  }

  async function deleteOrganization(id: string) {
    const organization = await readOrganizationAbout(id);
    if (!organization) {
      return null;
    }

    await rm(path.join(organizationsDir, id), {
      force: true,
      recursive: true,
    });

    const organizationsState = await readOrganizations();
    const index = await readOrganizationsIndex();
    if (index.activeOrganizationId === id) {
      index.activeOrganizationId = null;
      await writeJsonFile(organizationsIndexPath, index);
    }

    return readOrganizations();
  }

  async function readWorkspaceBootstrap() {
    const [sourcesConfig, organizationsState] = await Promise.all([
      readSourcesConfig(),
      readOrganizations(),
    ]);

    return {
      organizations: organizationsState.organizations,
      activeOrganizationId: organizationsState.activeOrganizationId,
      sources: sourcesConfig.sources,
    };
  }

  const liveClients = new Set<ReadableStreamDefaultController<string>>();

  function createLiveReloadStream() {
    return new ReadableStream<string>({
      start(controller) {
        liveClients.add(controller);
        controller.enqueue(": connected\n\n");
      },
      cancel(controller) {
        liveClients.delete(controller);
      },
    });
  }

  function broadcastReload() {
    for (const controller of liveClients) {
      try {
        controller.enqueue("event: reload\ndata: now\n\n");
      } catch {
        liveClients.delete(controller);
      }
    }
  }

  function startWatcher(targetDir: string) {
    if (!existsSync(targetDir)) {
      return;
    }

    watch(targetDir, { recursive: true }, (_eventType, filename) => {
      if (!filename || filename.startsWith(".")) {
        return;
      }

      const normalizedFilename = filename.replaceAll("\\", "/");
      const isManagedDataWrite =
        targetDir === dataDir &&
        (
          normalizedFilename.startsWith("system/") ||
          normalizedFilename.startsWith("organizations/")
        );
      if (isManagedDataWrite) {
        return;
      }

      console.log(`reload ${normalizedFilename}`);
      broadcastReload();
    });
  }

  function startWatchers() {
    for (const targetDir of watchDirs) {
      startWatcher(targetDir);
    }
  }

  async function fetchHandler(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === "/__live") {
      return new Response(createLiveReloadStream(), {
        headers: {
          "cache-control": "no-cache",
          connection: "keep-alive",
          "content-type": "text/event-stream",
        },
      });
    }

    if (url.pathname === "/") {
      return serveFile(path.join(publicDir, "index.html"));
    }

    if (url.pathname === "/api/workspace/bootstrap") {
      const bootstrap = await readWorkspaceBootstrap();
      return Response.json(bootstrap);
    }

    if (url.pathname === "/api/inference/status") {
      const status = await verifyInferenceSource();
      return Response.json(status);
    }

    if (url.pathname === "/api/inference/probe" && request.method === "POST") {
      const payload = (await request.json()) as { address?: string };
      const status = await probeInferenceSource(payload.address ?? "");
      return Response.json(status);
    }

    if (url.pathname === "/api/inference/discover") {
      const sources = await discoverInferenceSources();
      return Response.json({ sources });
    }

    if (url.pathname === "/api/system/sources" && request.method === "POST") {
      const payload = (await request.json()) as { sources?: StoredSource[] };
      const config = await writeSourcesConfig(payload.sources ?? []);
      return Response.json(config);
    }

    if (url.pathname === "/api/organizations/save" && request.method === "POST") {
      const payload = (await request.json()) as {
        activate?: boolean;
        organization?: Partial<OrganizationAbout>;
      };
      const result = await saveOrganization(
        payload.organization ?? {},
        Boolean(payload.activate),
      );
      if (!result.ok) {
        return Response.json(
          { error: result.reason },
          { status: result.reason === "duplicate_name" ? 409 : 400 },
        );
      }
      return Response.json(result.state);
    }

    if (url.pathname === "/api/organizations/activate" && request.method === "POST") {
      const payload = (await request.json()) as { id?: string };
      const organizations = payload.id
        ? await activateOrganization(payload.id)
        : null;

      if (!organizations) {
        return new Response("Not Found", { status: 404 });
      }

      return Response.json(organizations);
    }

    if (url.pathname === "/api/organizations/delete" && request.method === "POST") {
      const payload = (await request.json()) as { id?: string };
      const organizations = payload.id
        ? await deleteOrganization(payload.id)
        : null;

      if (!organizations) {
        return new Response("Not Found", { status: 404 });
      }

      return Response.json(organizations);
    }

    if (url.pathname.startsWith("/assets/")) {
      const assetPath = safeJoin(
        publicDir,
        url.pathname.replace("/assets/", ""),
      );
      if (assetPath && existsSync(assetPath)) {
        return serveFile(assetPath);
      }
    }

    if (url.pathname.startsWith("/data/")) {
      const dataPath = safeJoin(dataDir, url.pathname.replace("/data/", ""));
      if (dataPath && existsSync(dataPath)) {
        return serveFile(dataPath);
      }
    }

    return new Response("Not Found", { status: 404 });
  }

  return {
    dataDir,
    fetch: fetchHandler,
    publicDir,
    rootDir,
    startWatchers,
  };
}
