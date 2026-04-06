import { existsSync, watch } from "node:fs";
import { lstat, mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
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
  tier: TierLevel;
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

type AppearanceTheme = "light" | "dark" | "gray" | "system";
type AppearanceAccent =
  | "neutral"
  | "rose"
  | "orange"
  | "amber"
  | "lime"
  | "emerald"
  | "cyan"
  | "blue"
  | "indigo"
  | "magenta";

type AppearanceConfig = {
  accent: AppearanceAccent;
  theme: AppearanceTheme;
  version: number;
};

type FileRootId = "system" | "organization" | "deleted";

type FilesystemRoot = {
  available: boolean;
  id: FileRootId;
  label: string;
};

type DirectoryEntry = {
  editable: boolean;
  extension: string;
  name: string;
  path: string;
  type: "directory" | "file";
};

type OrganizationSaveResult =
  | { ok: true; state: Awaited<ReturnType<typeof readOrganizations>> }
  | { ok: false; reason: "duplicate_name" | "invalid_name" };

type TierLevel = "top" | "mid" | "low";

type QueuePriority = "critical" | "high" | "normal" | "low" | "background";
type QueueItemStatus =
  | "pending"
  | "dispatching"
  | "loading"
  | "running"
  | "done"
  | "failed"
  | "retrying";

type QueueItem = {
  id: string;
  agentId: string;
  taskId: string;
  workflowId: string;
  priority: QueuePriority;
  tier: TierLevel;
  model: string;
  status: QueueItemStatus;
  nodeAddress: string | null;
  enqueuedAt: number;
  dispatchedAt: number | null;
  completedAt: number | null;
  estimatedDurationMs: number;
  actualDurationMs: number | null;
  retryCount: number;
  maxRetries: number;
  dependencies: string[];
  result: string | null;
  error: string | null;
  promptMessages: { role: string; content: string }[];
};

type NodeTelemetry = {
  address: string;
  tier: TierLevel;
  status: "online" | "degraded" | "offline";
  loadedModel: string | null;
  modelState: "loaded" | "loading" | "cold";
  activeRequests: number;
  lastSeenAt: number;
};

type ScheduledTask = {
  agentId: string;
  assigneeType: "agent_template" | "role_assignment";
  assigneeValue: string;
  id: string;
  name: string;
  cronExpression: string;
  enabled: boolean;
  createdAt: string;
  lastRunAt: string | null;
  nextRunAt: string | null;
  notes: string;
};

type MeetingRecord = {
  agenda: string[];
  completedAt: string | null;
  consensus: string;
  id: string;
  minutes: string | null;
  orgId: string;
  participants: string[];
  summary: string;
  status: "pending" | "active" | "complete";
  createdAt: string;
  startedAt: string | null;
  title: string;
};

type MailMessage = {
  body: string;
  folder: "inbox" | "outbox";
  from: string;
  id: string;
  orgId: string;
  readAt: string | null;
  sentAt: string;
  subject: string;
  to: string;
};

type HireDepartment = {
  createdAt: string;
  id: string;
  name: string;
  summary: string;
  updatedAt: string;
};

type HireTeam = {
  createdAt: string;
  departmentId: string;
  id: string;
  name: string;
  summary: string;
  updatedAt: string;
};

type HireRole = {
  assigneeLabel: string;
  createdAt: string;
  id: string;
  notes: string;
  status: "assigned" | "open";
  teamId: string;
  templateName: string;
  tier: TierLevel;
  title: string;
  updatedAt: string;
};

type HireState = {
  departments: HireDepartment[];
  roles: HireRole[];
  teams: HireTeam[];
  updatedAt: string;
  version: number;
};

type ProjectRecord = {
  createdAt: string;
  id: string;
  name: string;
  outputs: string;
  participantRoleIds: string[];
  status: "active" | "blocked" | "done" | "draft";
  summary: string;
  updatedAt: string;
};

type EvalsRecord = {
  createdAt: string;
  criteria: string;
  id: string;
  name: string;
  prompt: string;
  resultSummary: string;
  score: string;
  status: "draft" | "failing" | "passing";
  targetRef: string;
  targetType: "agent" | "prompt" | "skill" | "tool" | "workflow";
  updatedAt: string;
};

type AgentTemplateSummary = {
  description: string;
  file: string;
  model: string;
  name: string;
  promptFile: string;
  role: string;
  skills: string[];
  tier: TierLevel;
  tools: string[];
};

// Module-level queue state — persists across requests
const inferenceQueue: QueueItem[] = [];
const nodeTelemetry: Map<string, NodeTelemetry> = new Map();
const queueSSEClients: Set<ReadableStreamDefaultController<string>> = new Set();

const PRIORITY_SCORES: Record<QueuePriority, number> = {
  critical: 100,
  high: 75,
  normal: 50,
  low: 25,
  background: 10,
};

function emitQueueEvent(event: string, payload: unknown) {
  const data = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const controller of queueSSEClients) {
    try {
      controller.enqueue(data);
    } catch {
      queueSSEClients.delete(controller);
    }
  }
}

function enqueueInference(item: QueueItem) {
  inferenceQueue.push(item);
  emitQueueEvent("queue:enqueue", item);
}

function getQueueSnapshot() {
  return inferenceQueue.map((item) => ({ ...item }));
}

function dequeueNext(): QueueItem | null {
  const doneIds = new Set(
    inferenceQueue.filter((i) => i.status === "done").map((i) => i.id),
  );
  const eligible = inferenceQueue.filter(
    (item) =>
      item.status === "pending" &&
      item.dependencies.every((dep) => doneIds.has(dep)),
  );
  if (eligible.length === 0) return null;
  eligible.sort(
    (a, b) => PRIORITY_SCORES[b.priority] - PRIORITY_SCORES[a.priority],
  );
  return eligible[0];
}

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

const supportedTextExtensions = new Set([".txt", ".md", ".json"]);

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
  const appearanceConfigPath = path.join(systemDir, "appearance.json");
  const deletedDir = path.join(systemDir, "deleted");
  const agentsDir = path.join(rootDir, ".agents");
  const skillsDir = path.join(rootDir, ".skills");
  const scheduleConfigPath = path.join(systemDir, "schedule.json");
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

  function normalizeAppearanceTheme(value: string | undefined): AppearanceTheme {
    return value === "light" || value === "dark" || value === "system" ? value : "gray";
  }

  function normalizeAppearanceAccent(value: string | undefined): AppearanceAccent {
    return value === "rose" ||
      value === "orange" ||
      value === "amber" ||
      value === "lime" ||
      value === "emerald" ||
      value === "cyan" ||
      value === "blue" ||
      value === "indigo" ||
      value === "magenta"
      ? value
      : "neutral";
  }

  async function readAppearanceConfig(): Promise<AppearanceConfig> {
    const fallback: AppearanceConfig = {
      accent: "neutral",
      theme: "gray",
      version: 1,
    };
    const config = await readJsonOrDefault(appearanceConfigPath, fallback);

    const normalized: AppearanceConfig = {
      accent: normalizeAppearanceAccent(config.accent),
      theme: normalizeAppearanceTheme(config.theme),
      version: 1,
    };

    if (
      normalized.accent !== config.accent ||
      normalized.theme !== config.theme ||
      config.version !== 1
    ) {
      await writeJsonFile(appearanceConfigPath, normalized);
    }

    return normalized;
  }

  async function writeAppearanceConfig(
    payload: Partial<AppearanceConfig>,
  ): Promise<AppearanceConfig> {
    const normalized: AppearanceConfig = {
      accent: normalizeAppearanceAccent(payload.accent),
      theme: normalizeAppearanceTheme(payload.theme),
      version: 1,
    };

    await writeJsonFile(appearanceConfigPath, normalized);
    return normalized;
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

  function organizationDataPath(orgId: string, fileName: string) {
    return path.join(organizationsDir, orgId, fileName);
  }

  async function readOrganizationScopedJson<T>(orgId: string, fileName: string, fallback: T) {
    return readJsonOrDefault<T>(organizationDataPath(orgId, fileName), fallback);
  }

  async function writeOrganizationScopedJson<T>(orgId: string, fileName: string, value: T) {
    await mkdir(path.join(organizationsDir, orgId), { recursive: true });
    await writeJsonFile(organizationDataPath(orgId, fileName), value);
  }

  function parseBulletList(value: string) {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => line.slice(2).trim())
      .filter(Boolean);
  }

  function parseAgentTemplate(content: string, file: string): AgentTemplateSummary {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = frontmatterMatch?.[1] ?? "";
    const fields = new Map<string, string>();
    let currentKey = "";
    let currentLines: string[] = [];

    const flushField = () => {
      if (!currentKey) return;
      fields.set(currentKey, currentLines.join("\n").trim());
      currentKey = "";
      currentLines = [];
    };

    for (const line of frontmatter.split("\n")) {
      const keyMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
      if (keyMatch) {
        flushField();
        currentKey = keyMatch[1];
        currentLines = [keyMatch[2]];
        continue;
      }
      if (currentKey) {
        currentLines.push(line);
      }
    }
    flushField();

    const name = fields.get("name") || file.replace(/\.md$/, "");
    const normalizedTier = normalizeTierLevel(fields.get("tier"));
    return {
      description: fields.get("description") || "",
      file,
      model: fields.get("model") || "",
      name,
      promptFile: fields.get("prompt_file") || "",
      role: fields.get("role") || "",
      skills: parseBulletList(fields.get("skills") || ""),
      tier: normalizedTier,
      tools: parseBulletList(fields.get("tools") || ""),
    };
  }

  function normalizeTierLevel(value: string | null | undefined): TierLevel {
    return value === "top" || value === "low" ? value : "mid";
  }

  // ── Agent file CRUD ──────────────────────────────────────────────────────

  async function listAgentFiles() {
    await mkdir(agentsDir, { recursive: true });
    const entries = await readdir(agentsDir, { withFileTypes: true });
    const agents: AgentTemplateSummary[] = [];
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
      const file = entry.name;
      const content = await readFile(path.join(agentsDir, file), "utf8");
      agents.push(parseAgentTemplate(content, file));
    }
    return agents.sort((a, b) => a.name.localeCompare(b.name));
  }

  async function readAgentFile(name: string) {
    const safeName = path.basename(name).replace(/[^a-z0-9-_]/gi, "");
    if (!safeName) return null;
    const filePath = path.join(agentsDir, `${safeName}.md`);
    if (!existsSync(filePath)) return null;
    return readFile(filePath, "utf8");
  }

  async function writeAgentFile(name: string, content: string) {
    const safeName = path.basename(name).replace(/[^a-z0-9-_]/gi, "");
    if (!safeName) return false;
    await mkdir(agentsDir, { recursive: true });
    await writeFile(path.join(agentsDir, `${safeName}.md`), content, "utf8");
    return true;
  }

  async function deleteAgentFile(name: string) {
    const safeName = path.basename(name).replace(/[^a-z0-9-_]/gi, "");
    if (!safeName) return false;
    const filePath = path.join(agentsDir, `${safeName}.md`);
    if (!existsSync(filePath)) return false;
    await rm(filePath);
    return true;
  }

  // ── Skill file read ───────────────────────────────────────────────────────

  async function listSkillFiles() {
    if (!existsSync(skillsDir)) return [];
    const entries = await readdir(skillsDir, { withFileTypes: true });
    const skills = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const skillFile = path.join(skillsDir, entry.name, "SKILL.md");
      if (existsSync(skillFile)) {
        skills.push({ name: entry.name, file: `${entry.name}/SKILL.md` });
      }
    }
    return skills.sort((a, b) => a.name.localeCompare(b.name));
  }

  async function readSkillFile(name: string) {
    const safeName = path.basename(name).replace(/[^a-z0-9-_]/gi, "");
    if (!safeName) return null;
    const filePath = path.join(skillsDir, safeName, "SKILL.md");
    if (!existsSync(filePath)) return null;
    return readFile(filePath, "utf8");
  }

  // ── Schedule CRUD ─────────────────────────────────────────────────────────

  async function readSchedule(orgId: string): Promise<ScheduledTask[]> {
    const tasks = await readOrganizationScopedJson<ScheduledTask[]>(orgId, "schedule.json", []);
    return Array.isArray(tasks) ? tasks : [];
  }

  async function writeScheduleTask(orgId: string, task: Partial<ScheduledTask>) {
    const tasks = await readSchedule(orgId);
    const now = new Date().toISOString();
    const existing = task.id ? tasks.find((t) => t.id === task.id) : null;
    const updated: ScheduledTask = {
      agentId: task.agentId ?? existing?.agentId ?? "",
      assigneeType: task.assigneeType ?? existing?.assigneeType ?? "agent_template",
      assigneeValue: task.assigneeValue ?? existing?.assigneeValue ?? "",
      createdAt: existing?.createdAt ?? now,
      cronExpression: task.cronExpression ?? existing?.cronExpression ?? "",
      enabled: task.enabled ?? existing?.enabled ?? true,
      id: task.id ?? crypto.randomUUID(),
      lastRunAt: existing?.lastRunAt ?? null,
      name: task.name ?? existing?.name ?? "",
      nextRunAt: task.nextRunAt ?? existing?.nextRunAt ?? null,
      notes: task.notes ?? existing?.notes ?? "",
    };
    const rest = tasks.filter((t) => t.id !== updated.id);
    await writeOrganizationScopedJson(orgId, "schedule.json", [...rest, updated]);
    return updated;
  }

  async function deleteScheduleTask(orgId: string, id: string) {
    const tasks = await readSchedule(orgId);
    const filtered = tasks.filter((t) => t.id !== id);
    if (filtered.length === tasks.length) return false;
    await writeOrganizationScopedJson(orgId, "schedule.json", filtered);
    return true;
  }

  // ── Meet CRUD ─────────────────────────────────────────────────────────────

  async function listMeetings(orgId: string) {
    const meetDir = path.join(organizationsDir, orgId, "meetings");
    if (!existsSync(meetDir)) return [];
    const entries = await readdir(meetDir, { withFileTypes: true });
    const meetings: MeetingRecord[] = [];
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
      try {
        const content = await readFile(path.join(meetDir, entry.name), "utf8");
        meetings.push(JSON.parse(content) as MeetingRecord);
      } catch { /* skip malformed */ }
    }
    return meetings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async function createMeeting(orgId: string, payload: Partial<MeetingRecord>) {
    const meetDir = path.join(organizationsDir, orgId, "meetings");
    await mkdir(meetDir, { recursive: true });
    const meeting: MeetingRecord = {
      agenda: payload.agenda ?? [],
      completedAt: null,
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID(),
      minutes: null,
      orgId,
      participants: payload.participants ?? [],
      consensus: payload.consensus ?? "",
      summary: payload.summary ?? "",
      startedAt: null,
      status: "pending",
      title: payload.title ?? "Untitled Meeting",
    };
    await writeFile(
      path.join(meetDir, `${meeting.id}.json`),
      `${JSON.stringify(meeting, null, 2)}\n`,
      "utf8",
    );
    return meeting;
  }

  // ── Mail CRUD ─────────────────────────────────────────────────────────────

  async function listMail(orgId: string, folder: "inbox" | "outbox" = "inbox") {
    const mailDir = path.join(organizationsDir, orgId, "mail");
    if (!existsSync(mailDir)) return [];
    const entries = await readdir(mailDir, { withFileTypes: true });
    const messages: MailMessage[] = [];
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
      try {
        const content = await readFile(path.join(mailDir, entry.name), "utf8");
        const msg = JSON.parse(content) as MailMessage;
        if (msg.folder === folder) messages.push(msg);
      } catch { /* skip malformed */ }
    }
    return messages.sort((a, b) => b.sentAt.localeCompare(a.sentAt));
  }

  async function createMailMessage(orgId: string, payload: Partial<MailMessage>) {
    const mailDir = path.join(organizationsDir, orgId, "mail");
    await mkdir(mailDir, { recursive: true });
    const message: MailMessage = {
      body: payload.body ?? "",
      folder: payload.folder ?? "outbox",
      from: payload.from ?? "system",
      id: crypto.randomUUID(),
      orgId,
      readAt: null,
      sentAt: new Date().toISOString(),
      subject: payload.subject ?? "(no subject)",
      to: payload.to ?? "",
    };
    await writeFile(
      path.join(mailDir, `${message.id}.json`),
      `${JSON.stringify(message, null, 2)}\n`,
      "utf8",
    );
    return message;
  }

  // ── Hire / Projects / Evals CRUD ────────────────────────────────────────

  async function readHireState(orgId: string): Promise<HireState> {
    const state = await readOrganizationScopedJson<HireState>(orgId, "hire.json", {
      departments: [],
      roles: [],
      teams: [],
      updatedAt: "",
      version: 1,
    });
    return {
      departments: Array.isArray(state.departments) ? state.departments : [],
      roles: Array.isArray(state.roles) ? state.roles : [],
      teams: Array.isArray(state.teams) ? state.teams : [],
      updatedAt: state.updatedAt ?? "",
      version: 1,
    };
  }

  async function writeHireState(orgId: string, nextState: Partial<HireState>) {
    const current = await readHireState(orgId);
    const merged: HireState = {
      departments: Array.isArray(nextState.departments) ? nextState.departments : current.departments,
      roles: Array.isArray(nextState.roles) ? nextState.roles : current.roles,
      teams: Array.isArray(nextState.teams) ? nextState.teams : current.teams,
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    await writeOrganizationScopedJson(orgId, "hire.json", merged);
    return merged;
  }

  async function readProjects(orgId: string): Promise<ProjectRecord[]> {
    const projects = await readOrganizationScopedJson<ProjectRecord[]>(orgId, "projects.json", []);
    return Array.isArray(projects) ? projects : [];
  }

  async function writeProject(orgId: string, payload: Partial<ProjectRecord>) {
    const current = await readProjects(orgId);
    const now = new Date().toISOString();
    const existing = payload.id ? current.find((item) => item.id === payload.id) : null;
    const project: ProjectRecord = {
      createdAt: existing?.createdAt ?? now,
      id: payload.id ?? crypto.randomUUID(),
      name: payload.name ?? existing?.name ?? "Untitled Project",
      outputs: payload.outputs ?? existing?.outputs ?? "",
      participantRoleIds: payload.participantRoleIds ?? existing?.participantRoleIds ?? [],
      status: payload.status ?? existing?.status ?? "draft",
      summary: payload.summary ?? existing?.summary ?? "",
      updatedAt: now,
    };
    const next = [...current.filter((item) => item.id !== project.id), project]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    await writeOrganizationScopedJson(orgId, "projects.json", next);
    return project;
  }

  async function deleteProject(orgId: string, id: string) {
    const current = await readProjects(orgId);
    const next = current.filter((item) => item.id !== id);
    if (next.length === current.length) return false;
    await writeOrganizationScopedJson(orgId, "projects.json", next);
    return true;
  }

  async function readEvals(orgId: string): Promise<EvalsRecord[]> {
    const evals = await readOrganizationScopedJson<EvalsRecord[]>(orgId, "evals.json", []);
    return Array.isArray(evals) ? evals : [];
  }

  async function writeEval(orgId: string, payload: Partial<EvalsRecord>) {
    const current = await readEvals(orgId);
    const now = new Date().toISOString();
    const existing = payload.id ? current.find((item) => item.id === payload.id) : null;
    const record: EvalsRecord = {
      createdAt: existing?.createdAt ?? now,
      criteria: payload.criteria ?? existing?.criteria ?? "",
      id: payload.id ?? crypto.randomUUID(),
      name: payload.name ?? existing?.name ?? "Untitled Eval",
      prompt: payload.prompt ?? existing?.prompt ?? "",
      resultSummary: payload.resultSummary ?? existing?.resultSummary ?? "",
      score: payload.score ?? existing?.score ?? "",
      status: payload.status ?? existing?.status ?? "draft",
      targetRef: payload.targetRef ?? existing?.targetRef ?? "",
      targetType: payload.targetType ?? existing?.targetType ?? "workflow",
      updatedAt: now,
    };
    const next = [...current.filter((item) => item.id !== record.id), record]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    await writeOrganizationScopedJson(orgId, "evals.json", next);
    return record;
  }

  async function deleteEval(orgId: string, id: string) {
    const current = await readEvals(orgId);
    const next = current.filter((item) => item.id !== id);
    if (next.length === current.length) return false;
    await writeOrganizationScopedJson(orgId, "evals.json", next);
    return true;
  }

  // ── Node telemetry polling ────────────────────────────────────────────────

  async function pollNodeTelemetry() {
    const config = await readSourcesConfig();
    const activeSources = config.sources.filter((s) => s.active);
    for (const source of activeSources) {
      const address = normalizeInferenceAddress(source.address);
      if (!address) continue;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const response = await fetch(`${address}/api/ps`, {
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (!response.ok) {
          nodeTelemetry.set(address, {
            activeRequests: 0,
            address,
            lastSeenAt: Date.now(),
            loadedModel: null,
            modelState: "cold",
            status: "degraded",
            tier: source.tier,
          });
          continue;
        }
        const ps = (await response.json()) as {
          models?: Array<{ name?: string; model?: string }>;
        };
        const models = ps.models ?? [];
        const loadedModel =
          models[0]?.name ?? models[0]?.model ?? null;
        nodeTelemetry.set(address, {
          activeRequests: models.length,
          address,
          lastSeenAt: Date.now(),
          loadedModel,
          modelState:
            models.length > 0 ? "loaded" : "cold",
          status: "online",
          tier: source.tier,
        });
      } catch {
        const existing = nodeTelemetry.get(address);
        nodeTelemetry.set(address, {
          activeRequests: 0,
          address,
          lastSeenAt: existing?.lastSeenAt ?? Date.now(),
          loadedModel: existing?.loadedModel ?? null,
          modelState: "cold",
          status: "offline",
          tier: source.tier,
        });
      }
    }
  }

  function selectNodeForTier(tier: TierLevel, model: string): string | null {
    const candidates = [...nodeTelemetry.values()].filter(
      (node) => node.status !== "offline" && node.tier === tier,
    );
    if (candidates.length === 0) {
      // Fall back to any online node
      const any = [...nodeTelemetry.values()].filter(
        (node) => node.status !== "offline",
      );
      if (any.length === 0) return null;
      any.sort((a, b) => a.activeRequests - b.activeRequests);
      return any[0].address;
    }
    // Prefer nodes with the model already loaded, then fewest active requests
    candidates.sort((a, b) => {
      const aMatch = a.loadedModel === model ? 0 : 1;
      const bMatch = b.loadedModel === model ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
      return a.activeRequests - b.activeRequests;
    });
    return candidates[0].address;
  }

  function normalizeRelativePath(input: string | null | undefined) {
    const value = (input ?? "").replaceAll("\\", "/").replace(/^\/+/, "");
    if (!value) {
      return "";
    }

    const normalized = path.posix.normalize(value);
    if (normalized === "." || normalized === "/") {
      return "";
    }
    if (normalized.startsWith("../") || normalized === ".." || path.isAbsolute(normalized)) {
      return null;
    }

    return normalized.replace(/^\/+/, "");
  }

  function isEditableTextFile(filePath: string) {
    return supportedTextExtensions.has(path.extname(filePath).toLowerCase());
  }

  async function readActiveOrganization() {
    const organizationsState = await readOrganizations();
    const activeOrganization = organizationsState.activeOrganizationId
      ? organizationsState.organizations.find(
        (organization) => organization.id === organizationsState.activeOrganizationId,
      ) ?? null
      : null;

    return {
      activeOrganization,
      activeOrganizationId: organizationsState.activeOrganizationId,
      organizationsState,
    };
  }

  function buildFilesystemRoots(activeOrganization: OrganizationAbout | null): FilesystemRoot[] {
    return [
      { available: true, id: "system", label: "system" },
      {
        available: Boolean(activeOrganization),
        id: "organization",
        label: activeOrganization?.name ?? "organization",
      },
      {
        available: Boolean(activeOrganization),
        id: "deleted",
        label: "deleted",
      },
    ];
  }

  async function resolveFilesystemRoot(rootId: FileRootId) {
    const { activeOrganization } = await readActiveOrganization();
    if (rootId === "system") {
      await mkdir(systemDir, { recursive: true });
      return {
        available: true,
        baseDir: systemDir,
        label: "system",
      };
    }

    if (!activeOrganization) {
      return {
        available: false,
        baseDir: null,
        label: rootId === "deleted" ? "deleted" : "organization",
      };
    }

    if (rootId === "organization") {
      const baseDir = path.join(organizationsDir, activeOrganization.id);
      await mkdir(baseDir, { recursive: true });
      return {
        available: true,
        baseDir,
        label: activeOrganization.name,
      };
    }

    const baseDir = path.join(deletedDir, activeOrganization.id);
    await mkdir(baseDir, { recursive: true });
    return {
      available: true,
      baseDir,
      label: "deleted",
    };
  }

  async function listFilesystemDirectory(rootId: FileRootId, relativePath = "") {
    const root = await resolveFilesystemRoot(rootId);
    const normalizedPath = normalizeRelativePath(relativePath);
    if (normalizedPath === null) {
      return null;
    }

    if (!root.available || !root.baseDir) {
      return {
        available: false,
        entries: [] as DirectoryEntry[],
        label: root.label,
        path: "",
        root: rootId,
        segments: [] as Array<{ name: string; path: string }>,
      };
    }

    const targetPath = safeJoin(root.baseDir, normalizedPath || ".");
    if (!targetPath || !existsSync(targetPath)) {
      return null;
    }

    const targetStat = await lstat(targetPath);
    if (!targetStat.isDirectory()) {
      return null;
    }

    const entries = await readdir(targetPath, { withFileTypes: true });
    const serializedEntries: DirectoryEntry[] = entries
      .filter((entry) => !entry.name.startsWith("."))
      .map((entry) => {
        const entryPath = normalizedPath
          ? `${normalizedPath}/${entry.name}`
          : entry.name;
        const extension = entry.isFile() ? path.extname(entry.name).toLowerCase() : "";
        return {
          editable: entry.isFile() && isEditableTextFile(entry.name),
          extension,
          name: entry.name,
          path: entryPath,
          type: entry.isDirectory() ? "directory" : "file",
        };
      })
      .sort((left, right) => {
        if (left.type !== right.type) {
          return left.type === "directory" ? -1 : 1;
        }
        return left.name.localeCompare(right.name);
      });

    const parts = normalizedPath ? normalizedPath.split("/") : [];
    const segments = parts.map((part, index) => ({
      name: part,
      path: parts.slice(0, index + 1).join("/"),
    }));

    return {
      available: true,
      entries: serializedEntries,
      label: root.label,
      path: normalizedPath || "",
      root: rootId,
      segments,
    };
  }

  async function moveFileToDeleted(rootId: FileRootId, relativePath: string) {
    if (rootId === "deleted") {
      return false;
    }

    const normalizedPath = normalizeRelativePath(relativePath);
    if (normalizedPath === null) {
      return false;
    }

    const sourceRoot = await resolveFilesystemRoot(rootId);
    const deletedRoot = await resolveFilesystemRoot("deleted");
    if (!sourceRoot.available || !sourceRoot.baseDir || !deletedRoot.available || !deletedRoot.baseDir) {
      return false;
    }

    const sourcePath = safeJoin(sourceRoot.baseDir, normalizedPath || ".");
    if (!sourcePath || !existsSync(sourcePath)) {
      return false;
    }

    const sourceStat = await lstat(sourcePath);
    if (!sourceStat.isFile()) {
      return false;
    }

    const destinationRelative = path.posix.join(rootId, normalizedPath);
    const destinationPath = safeJoin(deletedRoot.baseDir, destinationRelative);
    if (!destinationPath) {
      return false;
    }

    await mkdir(path.dirname(destinationPath), { recursive: true });

    let finalDestination = destinationPath;
    if (existsSync(finalDestination)) {
      const ext = path.extname(destinationPath);
      const base = destinationPath.slice(0, destinationPath.length - ext.length);
      finalDestination = `${base}-${Date.now()}${ext}`;
    }

    await rename(sourcePath, finalDestination);
    return true;
  }

  async function importDeviceFile(
    rootId: FileRootId,
    relativeDirectory: string,
    fileName: string,
    bytes: Uint8Array,
  ) {
    const normalizedPath = normalizeRelativePath(relativeDirectory);
    if (normalizedPath === null) {
      return false;
    }

    const root = await resolveFilesystemRoot(rootId);
    if (!root.available || !root.baseDir) {
      return false;
    }

    const destinationDir = safeJoin(root.baseDir, normalizedPath || ".");
    if (!destinationDir || !existsSync(destinationDir)) {
      return false;
    }

    const directoryStat = await lstat(destinationDir);
    if (!directoryStat.isDirectory()) {
      return false;
    }

    const destinationPath = safeJoin(destinationDir, path.basename(fileName));
    if (!destinationPath) {
      return false;
    }

    await writeFile(destinationPath, bytes);
    return true;
  }

  async function createFilesystemFolder(rootId: FileRootId, relativeDirectory: string, folderName: string) {
    const normalizedPath = normalizeRelativePath(relativeDirectory);
    if (normalizedPath === null) {
      return false;
    }
    const safeName = folderName.trim().replace(/[\\/]+/g, "");
    if (!safeName) {
      return false;
    }

    const root = await resolveFilesystemRoot(rootId);
    if (!root.available || !root.baseDir) {
      return false;
    }

    const parentDir = safeJoin(root.baseDir, normalizedPath || ".");
    if (!parentDir || !existsSync(parentDir)) {
      return false;
    }
    const destination = safeJoin(parentDir, safeName);
    if (!destination || existsSync(destination)) {
      return false;
    }
    await mkdir(destination, { recursive: true });
    return true;
  }

  async function renameFilesystemEntry(rootId: FileRootId, relativePath: string, nextBaseName: string) {
    const normalizedPath = normalizeRelativePath(relativePath);
    if (normalizedPath === null) {
      return { ok: false as const };
    }

    const safeName = nextBaseName.trim().replace(/[\\/]+/g, "");
    if (!safeName) {
      return { ok: false as const };
    }

    const root = await resolveFilesystemRoot(rootId);
    if (!root.available || !root.baseDir) {
      return { ok: false as const };
    }

    const sourcePath = safeJoin(root.baseDir, normalizedPath);
    if (!sourcePath || !existsSync(sourcePath)) {
      return { ok: false as const };
    }

    const stat = await lstat(sourcePath);
    const parentRelative = path.posix.dirname(normalizedPath);
    const parentPath = safeJoin(root.baseDir, parentRelative === "." ? "" : parentRelative);
    if (!parentPath) {
      return { ok: false as const };
    }

    const extension = stat.isFile() ? path.extname(normalizedPath) : "";
    const nextName = stat.isFile() ? `${safeName}${extension}` : safeName;
    const destinationPath = safeJoin(parentPath, nextName);
    if (!destinationPath || existsSync(destinationPath)) {
      return { ok: false as const };
    }

    await rename(sourcePath, destinationPath);
    return {
      ok: true as const,
      path: parentRelative === "." ? nextName : `${parentRelative}/${nextName}`,
    };
  }

  async function readTextDocument(rootId: FileRootId, relativePath: string) {
    const normalizedPath = normalizeRelativePath(relativePath);
    if (normalizedPath === null || !isEditableTextFile(normalizedPath)) {
      return null;
    }

    const root = await resolveFilesystemRoot(rootId);
    if (!root.available || !root.baseDir) {
      return null;
    }

    const targetPath = safeJoin(root.baseDir, normalizedPath);
    if (!targetPath || !existsSync(targetPath)) {
      return null;
    }

    const targetStat = await lstat(targetPath);
    if (!targetStat.isFile()) {
      return null;
    }

    return {
      content: await readFile(targetPath, "utf8"),
      extension: path.extname(normalizedPath).toLowerCase(),
      name: path.basename(normalizedPath),
      path: normalizedPath,
      root: rootId,
    };
  }

  async function writeTextDocument(
    rootId: FileRootId,
    relativePath: string,
    content: string,
    overwrite = true,
  ) {
    const normalizedPath = normalizeRelativePath(relativePath);
    if (normalizedPath === null || !isEditableTextFile(normalizedPath)) {
      return { ok: false as const, reason: "invalid_path" };
    }

    const root = await resolveFilesystemRoot(rootId);
    if (!root.available || !root.baseDir) {
      return { ok: false as const, reason: "unavailable_root" };
    }

    const targetPath = safeJoin(root.baseDir, normalizedPath);
    if (!targetPath) {
      return { ok: false as const, reason: "invalid_path" };
    }

    if (existsSync(targetPath) && !overwrite) {
      return { ok: false as const, reason: "already_exists" };
    }

    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, content, "utf8");
    return {
      ok: true as const,
      file: {
        extension: path.extname(normalizedPath).toLowerCase(),
        name: path.basename(normalizedPath),
        path: normalizedPath,
        root: rootId,
      },
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
    const [sourcesConfig, organizationsState, appearance, agents, skills] =
      await Promise.all([
        readSourcesConfig(),
        readOrganizations(),
        readAppearanceConfig(),
        listAgentFiles(),
        listSkillFiles(),
      ]);
    const activeOrganization = organizationsState.activeOrganizationId
      ? organizationsState.organizations.find(
        (organization) => organization.id === organizationsState.activeOrganizationId,
      ) ?? null
      : null;
    const orgId = organizationsState.activeOrganizationId;
    const [schedule, meetings, mailInbox, hire, projects, evals] = orgId
      ? await Promise.all([
        readSchedule(orgId),
        listMeetings(orgId),
        listMail(orgId, "inbox"),
        readHireState(orgId),
        readProjects(orgId),
        readEvals(orgId),
      ])
      : [[], [], [], null, [], []];

    return {
      agents,
      appearance,
      evals,
      filesystem: {
        roots: buildFilesystemRoots(activeOrganization),
      },
      hire,
      mailInbox,
      meetings,
      organizations: organizationsState.organizations,
      activeOrganizationId: organizationsState.activeOrganizationId,
      projects,
      queue: getQueueSnapshot(),
      schedule,
      skills,
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
    // Poll active Ollama nodes every 5 seconds for telemetry
    setInterval(() => {
      pollNodeTelemetry().catch(() => {});
    }, 5000);
    // Initial poll on startup
    pollNodeTelemetry().catch(() => {});
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

    if (url.pathname === "/api/system/appearance" && request.method === "POST") {
      const payload = (await request.json()) as Partial<AppearanceConfig>;
      const config = await writeAppearanceConfig(payload);
      return Response.json(config);
    }

    if (url.pathname === "/api/files/list") {
      const root = url.searchParams.get("root") as FileRootId | null;
      const relativePath = url.searchParams.get("path") ?? "";
      if (!root || !["system", "organization", "deleted"].includes(root)) {
        return new Response("Bad Request", { status: 400 });
      }

      const listing = await listFilesystemDirectory(root, relativePath);
      if (!listing) {
        return new Response("Not Found", { status: 404 });
      }
      return Response.json(listing);
    }

    if (url.pathname === "/api/files/import" && request.method === "POST") {
      const form = await request.formData();
      const root = form.get("root");
      const relativePath = form.get("path");
      const file = form.get("file");
      if (
        typeof root !== "string" ||
        !["system", "organization", "deleted"].includes(root) ||
        typeof relativePath !== "string" ||
        !(file instanceof File)
      ) {
        return new Response("Bad Request", { status: 400 });
      }

      const bytes = new Uint8Array(await file.arrayBuffer());
      const ok = await importDeviceFile(root as FileRootId, relativePath, file.name, bytes);
      if (!ok) {
        return new Response("Bad Request", { status: 400 });
      }

      return Response.json({ ok: true });
    }

    if (url.pathname === "/api/files/delete" && request.method === "POST") {
      const payload = (await request.json()) as { path?: string; root?: FileRootId };
      if (!payload.root || !payload.path) {
        return new Response("Bad Request", { status: 400 });
      }

      const ok = await moveFileToDeleted(payload.root, payload.path);
      if (!ok) {
        return new Response("Bad Request", { status: 400 });
      }

      return Response.json({ ok: true });
    }

    if (url.pathname === "/api/files/create-folder" && request.method === "POST") {
      const payload = (await request.json()) as {
        name?: string;
        path?: string;
        root?: FileRootId;
      };
      if (!payload.root || typeof payload.path !== "string" || typeof payload.name !== "string") {
        return new Response("Bad Request", { status: 400 });
      }

      const ok = await createFilesystemFolder(payload.root, payload.path, payload.name);
      if (!ok) {
        return new Response("Bad Request", { status: 400 });
      }
      return Response.json({ ok: true });
    }

    if (url.pathname === "/api/files/rename" && request.method === "POST") {
      const payload = (await request.json()) as {
        name?: string;
        path?: string;
        root?: FileRootId;
      };
      if (!payload.root || typeof payload.path !== "string" || typeof payload.name !== "string") {
        return new Response("Bad Request", { status: 400 });
      }

      const result = await renameFilesystemEntry(payload.root, payload.path, payload.name);
      if (!result.ok) {
        return new Response("Bad Request", { status: 400 });
      }
      return Response.json(result);
    }

    if (url.pathname === "/api/text/read") {
      const root = url.searchParams.get("root") as FileRootId | null;
      const relativePath = url.searchParams.get("path") ?? "";
      if (!root || !["system", "organization", "deleted"].includes(root)) {
        return new Response("Bad Request", { status: 400 });
      }

      const file = await readTextDocument(root, relativePath);
      if (!file) {
        return new Response("Not Found", { status: 404 });
      }
      return Response.json(file);
    }

    if (url.pathname === "/api/text/write" && request.method === "POST") {
      const payload = (await request.json()) as {
        content?: string;
        overwrite?: boolean;
        path?: string;
        root?: FileRootId;
      };
      if (
        !payload.root ||
        !["system", "organization", "deleted"].includes(payload.root) ||
        typeof payload.path !== "string" ||
        typeof payload.content !== "string"
      ) {
        return new Response("Bad Request", { status: 400 });
      }

      const result = await writeTextDocument(
        payload.root,
        payload.path,
        payload.content,
        payload.overwrite !== false,
      );
      if (!result.ok) {
        return Response.json({ error: result.reason }, { status: result.reason === "already_exists" ? 409 : 400 });
      }
      return Response.json(result.file);
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

    // ── Queue SSE stream ─────────────────────────────────────────────────────

    if (url.pathname === "/__queue") {
      const stream = new ReadableStream<string>({
        start(controller) {
          queueSSEClients.add(controller);
          controller.enqueue(
            `event: queue:snapshot\ndata: ${JSON.stringify(getQueueSnapshot())}\n\n`,
          );
        },
        cancel(controller) {
          queueSSEClients.delete(controller);
        },
      });
      return new Response(stream, {
        headers: {
          "cache-control": "no-cache",
          connection: "keep-alive",
          "content-type": "text/event-stream",
        },
      });
    }

    // ── Queue API ────────────────────────────────────────────────────────────

    if (url.pathname === "/api/queue/state") {
      return Response.json({ items: getQueueSnapshot(), nodes: [...nodeTelemetry.values()] });
    }

    if (url.pathname === "/api/queue/enqueue" && request.method === "POST") {
      const payload = (await request.json()) as Partial<QueueItem>;
      if (!payload.agentId || !payload.promptMessages) {
        return new Response("Bad Request", { status: 400 });
      }
      const tier: TierLevel =
        payload.tier === "top" || payload.tier === "low" ? payload.tier : "mid";
      const item: QueueItem = {
        agentId: payload.agentId,
        actualDurationMs: null,
        completedAt: null,
        dependencies: payload.dependencies ?? [],
        dispatchedAt: null,
        enqueuedAt: Date.now(),
        error: null,
        estimatedDurationMs: payload.estimatedDurationMs ?? 30000,
        id: crypto.randomUUID(),
        maxRetries: payload.maxRetries ?? 3,
        model: payload.model ?? "",
        nodeAddress: null,
        priority: payload.priority ?? "normal",
        promptMessages: payload.promptMessages,
        result: null,
        retryCount: 0,
        status: "pending",
        taskId: payload.taskId ?? crypto.randomUUID(),
        tier,
        workflowId: payload.workflowId ?? "",
      };
      enqueueInference(item);
      return Response.json(item);
    }

    if (url.pathname === "/api/queue/cancel" && request.method === "POST") {
      const payload = (await request.json()) as { id?: string };
      const item = inferenceQueue.find(
        (i) => i.id === payload.id && i.status === "pending",
      );
      if (!item) return new Response("Not Found", { status: 404 });
      item.status = "failed";
      item.error = "Cancelled by user";
      emitQueueEvent("queue:update", { id: item.id, status: item.status });
      return Response.json({ ok: true });
    }

    // ── Agents API ───────────────────────────────────────────────────────────

    if (url.pathname === "/api/agents/list") {
      const agents = await listAgentFiles();
      return Response.json({ agents });
    }

    if (url.pathname === "/api/agents/read") {
      const name = url.searchParams.get("name");
      if (!name) return new Response("Bad Request", { status: 400 });
      const content = await readAgentFile(name);
      if (content === null) return new Response("Not Found", { status: 404 });
      return Response.json({ content, name });
    }

    if (url.pathname === "/api/agents/write" && request.method === "POST") {
      const payload = (await request.json()) as { content?: string; name?: string };
      if (!payload.name || typeof payload.content !== "string") {
        return new Response("Bad Request", { status: 400 });
      }
      const ok = await writeAgentFile(payload.name, payload.content);
      if (!ok) return new Response("Bad Request", { status: 400 });
      return Response.json({ ok: true });
    }

    if (url.pathname === "/api/agents/delete" && request.method === "POST") {
      const payload = (await request.json()) as { name?: string };
      if (!payload.name) return new Response("Bad Request", { status: 400 });
      const ok = await deleteAgentFile(payload.name);
      if (!ok) return new Response("Not Found", { status: 404 });
      return Response.json({ ok: true });
    }

    // ── Skills API ───────────────────────────────────────────────────────────

    if (url.pathname === "/api/skills/list") {
      const skills = await listSkillFiles();
      return Response.json({ skills });
    }

    if (url.pathname === "/api/skills/read") {
      const name = url.searchParams.get("name");
      if (!name) return new Response("Bad Request", { status: 400 });
      const content = await readSkillFile(name);
      if (content === null) return new Response("Not Found", { status: 404 });
      return Response.json({ content, name });
    }

    // ── Tools API ────────────────────────────────────────────────────────────

    if (url.pathname === "/api/tools/list") {
      // Returns the skill-based tool registry derived from .skills/ directory
      const skills = await listSkillFiles();
      return Response.json({ tools: skills });
    }

    // ── Schedule API ─────────────────────────────────────────────────────────

    if (url.pathname === "/api/schedule/list") {
      const orgId = url.searchParams.get("orgId");
      if (!orgId) return new Response("Bad Request", { status: 400 });
      const tasks = await readSchedule(orgId);
      return Response.json({ tasks });
    }

    if (url.pathname === "/api/schedule/create" && request.method === "POST") {
      const payload = (await request.json()) as { orgId?: string } & Partial<ScheduledTask>;
      if (!payload.orgId) return new Response("Bad Request", { status: 400 });
      const task = await writeScheduleTask(payload.orgId, payload);
      return Response.json(task);
    }

    if (url.pathname === "/api/schedule/delete" && request.method === "POST") {
      const payload = (await request.json()) as { id?: string; orgId?: string };
      if (!payload.id || !payload.orgId) return new Response("Bad Request", { status: 400 });
      const ok = await deleteScheduleTask(payload.orgId, payload.id);
      if (!ok) return new Response("Not Found", { status: 404 });
      return Response.json({ ok: true });
    }

    // ── Meet API ─────────────────────────────────────────────────────────────

    if (url.pathname === "/api/meet/list") {
      const orgId = url.searchParams.get("orgId");
      if (!orgId) return new Response("Bad Request", { status: 400 });
      const meetings = await listMeetings(orgId);
      return Response.json({ meetings });
    }

    if (url.pathname === "/api/meet/create" && request.method === "POST") {
      const payload = (await request.json()) as { orgId?: string } & Partial<MeetingRecord>;
      if (!payload.orgId) return new Response("Bad Request", { status: 400 });
      const meeting = await createMeeting(payload.orgId, payload);
      return Response.json(meeting);
    }

    if (url.pathname === "/api/meet/write" && request.method === "POST") {
      const payload = (await request.json()) as { orgId?: string } & Partial<MeetingRecord>;
      if (!payload.orgId || !payload.id) return new Response("Bad Request", { status: 400 });
      const meetings = await listMeetings(payload.orgId);
      const existing = meetings.find((meeting) => meeting.id === payload.id);
      if (!existing) return new Response("Not Found", { status: 404 });
      const updated: MeetingRecord = {
        ...existing,
        ...payload,
        orgId: payload.orgId,
      };
      await writeOrganizationScopedJson(payload.orgId, path.join("meetings", `${updated.id}.json`), updated);
      return Response.json(updated);
    }

    // ── Mail API ─────────────────────────────────────────────────────────────

    if (url.pathname === "/api/mail/list") {
      const orgId = url.searchParams.get("orgId");
      const folder = (url.searchParams.get("folder") ?? "inbox") as "inbox" | "outbox";
      if (!orgId) return new Response("Bad Request", { status: 400 });
      const messages = await listMail(orgId, folder);
      return Response.json({ messages });
    }

    if (url.pathname === "/api/mail/create" && request.method === "POST") {
      const payload = (await request.json()) as { orgId?: string } & Partial<MailMessage>;
      if (!payload.orgId) return new Response("Bad Request", { status: 400 });
      const message = await createMailMessage(payload.orgId, payload);
      return Response.json(message);
    }

    if (url.pathname === "/api/mail/write" && request.method === "POST") {
      const payload = (await request.json()) as { orgId?: string } & Partial<MailMessage>;
      if (!payload.orgId || !payload.id) return new Response("Bad Request", { status: 400 });
      const folders: Array<"inbox" | "outbox"> = ["inbox", "outbox"];
      let existing: MailMessage | null = null;
      for (const folder of folders) {
        const messages = await listMail(payload.orgId, folder);
        existing = messages.find((message) => message.id === payload.id) ?? null;
        if (existing) break;
      }
      if (!existing) return new Response("Not Found", { status: 404 });
      const updated: MailMessage = {
        ...existing,
        ...payload,
        orgId: payload.orgId,
      };
      await writeOrganizationScopedJson(payload.orgId, path.join("mail", `${updated.id}.json`), updated);
      return Response.json(updated);
    }

    if (url.pathname === "/api/hire/read") {
      const orgId = url.searchParams.get("orgId");
      if (!orgId) return new Response("Bad Request", { status: 400 });
      const hire = await readHireState(orgId);
      return Response.json(hire);
    }

    if (url.pathname === "/api/hire/write" && request.method === "POST") {
      const payload = (await request.json()) as { orgId?: string } & Partial<HireState>;
      if (!payload.orgId) return new Response("Bad Request", { status: 400 });
      const hire = await writeHireState(payload.orgId, payload);
      return Response.json(hire);
    }

    if (url.pathname === "/api/projects/list") {
      const orgId = url.searchParams.get("orgId");
      if (!orgId) return new Response("Bad Request", { status: 400 });
      const projects = await readProjects(orgId);
      return Response.json({ projects });
    }

    if (url.pathname === "/api/projects/write" && request.method === "POST") {
      const payload = (await request.json()) as { orgId?: string } & Partial<ProjectRecord>;
      if (!payload.orgId) return new Response("Bad Request", { status: 400 });
      const project = await writeProject(payload.orgId, payload);
      return Response.json(project);
    }

    if (url.pathname === "/api/projects/delete" && request.method === "POST") {
      const payload = (await request.json()) as { id?: string; orgId?: string };
      if (!payload.id || !payload.orgId) return new Response("Bad Request", { status: 400 });
      const ok = await deleteProject(payload.orgId, payload.id);
      if (!ok) return new Response("Not Found", { status: 404 });
      return Response.json({ ok: true });
    }

    if (url.pathname === "/api/evals/list") {
      const orgId = url.searchParams.get("orgId");
      if (!orgId) return new Response("Bad Request", { status: 400 });
      const evals = await readEvals(orgId);
      return Response.json({ evals });
    }

    if (url.pathname === "/api/evals/write" && request.method === "POST") {
      const payload = (await request.json()) as { orgId?: string } & Partial<EvalsRecord>;
      if (!payload.orgId) return new Response("Bad Request", { status: 400 });
      const evalRecord = await writeEval(payload.orgId, payload);
      return Response.json(evalRecord);
    }

    if (url.pathname === "/api/evals/delete" && request.method === "POST") {
      const payload = (await request.json()) as { id?: string; orgId?: string };
      if (!payload.id || !payload.orgId) return new Response("Bad Request", { status: 400 });
      const ok = await deleteEval(payload.orgId, payload.id);
      if (!ok) return new Response("Not Found", { status: 404 });
      return Response.json({ ok: true });
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
