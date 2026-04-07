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
  contextWindow: number;
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
  contextWindow: number;
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
  contextWindow: number;
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
  archetypeId?: string;
  createdAt: string;
  description: string;
  id: string;
  industry: string;
  industryCustom: string;
  lastActiveAt?: string;
  name: string;
  updatedAt: string;
};

type OrganizationRuntimeMode = "auto" | "idle";

type OrganizationAppearanceOverride = {
  accent: AppearanceAccent;
  theme: AppearanceTheme;
};

type OrganizationsIndex = {
  activeOrganizationId: string | null;
  openOrganizationIds: string[];
  organizationAppearanceOverrides: Record<string, OrganizationAppearanceOverride>;
  organizationModes: Record<string, OrganizationRuntimeMode>;
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

type BoardNotificationLevel = "silent" | "unread";

type BoardNotification = {
  createdAt: string;
  id: string;
  level: BoardNotificationLevel;
  organizationId: string | null;
  sourceApp: string;
  summary: string;
  targetId: string;
  targetPanel: string | null;
  title: string;
  unread: boolean;
};

type BoardNotificationsConfig = {
  notifications: BoardNotification[];
  version: number;
};

type OrganizationRuntimeSummary = {
  headline: string;
  id: string;
  mode: OrganizationRuntimeMode;
  name: string;
  open: boolean;
  status: string;
  unread: number;
};

type DatamapEntry = {
  citation: string;
  excerpt: string;
  headings: string[];
  kind: string;
  path: string;
  title: string;
};

type DatamapRecord = {
  entries: DatamapEntry[];
  generatedAt: string;
  organizationId: string;
  version: number;
};

type TelemetryRecord = {
  generatedAt: string;
  inference: {
    events: Array<{
      address: string;
      contextWindow: number;
      model: string;
      timestamp: string;
      type: string;
    }>;
  };
  version: number;
};

type WebFragmentSummary = {
  id: string;
  label: string;
  name: string;
  path: string;
  type: string;
  updatedAt: string;
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
  temperature: number;
  maxTokens: number;
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
  contextRequirement: number;
  id: string;
  name: string;
  cadence: string;
  enabled: boolean;
  createdAt: string;
  dependencyIds: string[];
  evaluationRequired: boolean;
  groupKey: string;
  lastRunAt: string | null;
  notes: string;
  objective: string;
  workstream: string;
  trigger: "auto" | "manual" | "queue_relief" | "reflection" | "consolidation";
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

type StaffDepartment = {
  createdAt: string;
  id: string;
  name: string;
  templateId?: string;
  templateSource?: "system" | "local";
  summary: string;
  updatedAt: string;
};

type StaffTeam = {
  createdAt: string;
  departmentId: string;
  id: string;
  name: string;
  templateId?: string;
  templateSource?: "system" | "local";
  summary: string;
  updatedAt: string;
};

type StaffRole = {
  assigneeLabel: string;
  bundleIds?: string[];
  createdAt: string;
  evaluationFocus?: string;
  identityId: string;
  id: string;
  notes: string;
  requiredSkills?: string[];
  requiredTools?: string[];
  status: "assigned" | "open";
  teamId: string;
  templateId?: string;
  templateName: string;
  templateSource?: "system" | "local";
  tier: TierLevel;
  title: string;
  updatedAt: string;
};

type StaffState = {
  departments: StaffDepartment[];
  identities: IdentityRecord[];
  roles: StaffRole[];
  teams: StaffTeam[];
  updatedAt: string;
  version: number;
};

type IdentityRecord = {
  createdAt: string;
  employeeNumber: number;
  id: string;
  influence: string;
  memoryRoot: string;
  name: string;
  personaSummary: string;
  promptFile: string;
  roleId: string;
  roleTitle: string;
  systemRole: boolean;
  templateName: string;
  updatedAt: string;
};

type MemoryIndexRecord = {
  createdAt: string;
  id: string;
  memoryRoot: string;
  name: string;
  personaSummary: string;
  roleId: string;
  roleTitle: string;
  sections: Array<{ file: string; key: string; label: string }>;
  updatedAt: string;
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

type WorkflowStatus = "draft" | "running" | "done" | "failed" | "cancelled";

type Workflow = {
  createdAt: string;
  createdBy: string;
  id: string;
  objective: string;
  organizationId: string;
  status: WorkflowStatus;
  taskIds: string[];
  title: string;
  updatedAt: string;
};

type AgentTemplateSummary = {
  bundles?: string[];
  description: string;
  domain?: string;
  effectiveSkills?: string[];
  effectiveTools?: string[];
  file: string;
  maxTokens: number;
  model: string;
  name: string;
  promptFile: string;
  role: string;
  skills: string[];
  temperature: number;
  thinking: boolean;
  tier: TierLevel;
  tools: string[];
};

type TemplateBundle = {
  category: string;
  id: string;
  name: string;
  scope: string;
  skills: string[];
  summary: string;
  tools: string[];
};

type RoleTemplateAsset = {
  authority: string;
  bundles: string[];
  defaultTier: TierLevel;
  dependencies: string[];
  domain: string;
  evaluationFocus: string;
  id: string;
  name: string;
  outputs: string[];
  requiredSkills: string[];
  requiredTools: string[];
  summary: string;
  templateAgentName: string;
};

type TeamTemplateAsset = {
  id: string;
  name: string;
  roleTemplateIds: string[];
  summary: string;
};

type DepartmentTemplateAsset = {
  id: string;
  name: string;
  summary: string;
  teamTemplateIds: string[];
};

type OrganizationArchetypeAsset = {
  departmentTemplateIds: string[];
  id: string;
  name: string;
  processTemplateIds: string[];
  summary: string;
};

type ProcessTemplateAsset = {
  id: string;
  kind: string;
  name: string;
  summary: string;
};

type TemplateCatalog = {
  bundles: TemplateBundle[];
  departmentTemplates: DepartmentTemplateAsset[];
  organizationArchetypes: OrganizationArchetypeAsset[];
  processTemplates: ProcessTemplateAsset[];
  roleTemplates: RoleTemplateAsset[];
  teamTemplates: TeamTemplateAsset[];
  version: number;
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
  const base = baseDir.endsWith(path.sep) ? baseDir : baseDir + path.sep;
  if (!resolved.startsWith(base) && resolved !== baseDir) {
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
    contextWindow: 128000,
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
        contextWindow: availableModels.includes("gemma4:26b") ? 256000 : 128000,
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
      contextWindow: availableModels.includes("gemma4:26b") ? 256000 : 128000,
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
      contextWindow: localhost.contextWindow,
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
        contextWindow: result.contextWindow,
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
  const notificationsConfigPath = path.join(systemDir, "notifications.json");
  const telemetryConfigPath = path.join(systemDir, "telemetry.json");
  const deletedDir = path.join(systemDir, "deleted");
  const agentsDir = path.join(rootDir, ".agents");
  const skillsDir = path.join(rootDir, ".skills");
  const promptsDir = path.join(rootDir, "prompts");
  const templatesDir = path.join(rootDir, ".system", "templates");
  const templateCatalogPath = path.join(templatesDir, "catalog.json");
  const watchDirs = [
    publicDir,
    dataDir,
    templatesDir,
    path.join(rootDir, ".system", "server"),
  ];

  function resolveSourceContextWindow(source: Partial<StoredSource>) {
    const model = source.model ?? "";
    const tier = source.tier;
    if (typeof source.contextWindow === "number" && Number.isFinite(source.contextWindow)) {
      return source.contextWindow;
    }
    if (tier === "top" && model === "gemma4:26b") {
      return 256000;
    }
    return 128000;
  }

  function createDefaultStoredSource(): StoredSource {
    return {
      active: true,
      address: "http://127.0.0.1:11434",
      contextWindow: 128000,
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

  async function readTemplateCatalog(): Promise<TemplateCatalog> {
    const fallback: TemplateCatalog = {
      bundles: [],
      departmentTemplates: [],
      organizationArchetypes: [],
      processTemplates: [],
      roleTemplates: [],
      teamTemplates: [],
      version: 1,
    };
    const catalog = await readJsonOrDefault(templateCatalogPath, fallback);
    return {
      bundles: Array.isArray(catalog.bundles) ? catalog.bundles : [],
      departmentTemplates: Array.isArray(catalog.departmentTemplates) ? catalog.departmentTemplates : [],
      organizationArchetypes: Array.isArray(catalog.organizationArchetypes) ? catalog.organizationArchetypes : [],
      processTemplates: Array.isArray(catalog.processTemplates) ? catalog.processTemplates : [],
      roleTemplates: Array.isArray(catalog.roleTemplates) ? catalog.roleTemplates : [],
      teamTemplates: Array.isArray(catalog.teamTemplates) ? catalog.teamTemplates : [],
      version: typeof catalog.version === "number" ? catalog.version : 1,
    };
  }

  function defaultWorkerBundle(catalog: TemplateCatalog): TemplateBundle | null {
    return catalog.bundles.find((bundle) => bundle.id === "default-worker") ?? null;
  }

  function roleTemplateByAgentName(catalog: TemplateCatalog, agentName: string) {
    const normalized = agentName.replace(/\.md$/i, "");
    return catalog.roleTemplates.find((template) =>
      template.templateAgentName.toLowerCase() === normalized.toLowerCase()
      || template.name.toLowerCase() === normalized.toLowerCase()
      || template.id.toLowerCase() === normalized.toLowerCase()
    ) ?? null;
  }

  function findRoleTemplate(catalog: TemplateCatalog, templateId: string | undefined) {
    if (!templateId) return null;
    return catalog.roleTemplates.find((template) => template.id === templateId) ?? null;
  }

  function findDepartmentTemplate(catalog: TemplateCatalog, templateId: string | undefined) {
    if (!templateId) return null;
    return catalog.departmentTemplates.find((template) => template.id === templateId) ?? null;
  }

  function findTeamTemplate(catalog: TemplateCatalog, templateId: string | undefined) {
    if (!templateId) return null;
    return catalog.teamTemplates.find((template) => template.id === templateId) ?? null;
  }

  function roleTemplateSummary(template: RoleTemplateAsset) {
    return {
      authority: template.authority,
      bundles: template.bundles,
      defaultTier: template.defaultTier,
      domain: template.domain,
      evaluationFocus: template.evaluationFocus,
      id: template.id,
      name: template.name,
      summary: template.summary,
      templateAgentName: template.templateAgentName,
    };
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

    config.sources = config.sources.map((source) => ({
      ...source,
      contextWindow: resolveSourceContextWindow(source),
    }));

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
        contextWindow: resolveSourceContextWindow(source),
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
        .filter((source): source is StoredSource => Boolean(source))
        .map((source) => ({
          ...source,
          contextWindow: resolveSourceContextWindow(source),
        })),
      version: 1,
    };

    await writeJsonFile(sourcesConfigPath, payload);
    return payload;
  }

  async function readOrganizationsIndex(): Promise<OrganizationsIndex> {
    const fallback: OrganizationsIndex = {
      activeOrganizationId: null,
      openOrganizationIds: [],
      organizationAppearanceOverrides: {},
      organizationModes: {},
      version: 2,
    };
    const raw = await readJsonOrDefault<Partial<OrganizationsIndex>>(organizationsIndexPath, fallback);
    const activeOrganizationId =
      typeof raw.activeOrganizationId === "string" && raw.activeOrganizationId
        ? raw.activeOrganizationId
        : null;
    const openOrganizationIds = Array.isArray(raw.openOrganizationIds)
      ? raw.openOrganizationIds.filter((id): id is string => typeof id === "string" && Boolean(id))
      : activeOrganizationId
        ? [activeOrganizationId]
        : [];
    const organizationModes = Object.fromEntries(
      Object.entries(raw.organizationModes ?? {}).filter((entry): entry is [string, OrganizationRuntimeMode] =>
        typeof entry[0] === "string" && (entry[1] === "auto" || entry[1] === "idle")
      ),
    );
    const organizationAppearanceOverrides = Object.fromEntries(
      Object.entries(raw.organizationAppearanceOverrides ?? {}).flatMap(([id, value]) => {
        if (!value || typeof id !== "string") {
          return [];
        }
        const normalizedOverride: OrganizationAppearanceOverride = {
          accent: normalizeAppearanceAccent((value as Partial<OrganizationAppearanceOverride>).accent),
          theme: normalizeAppearanceTheme((value as Partial<OrganizationAppearanceOverride>).theme),
        };
        return [[id, normalizedOverride]];
      }),
    );
    const normalized: OrganizationsIndex = {
      activeOrganizationId,
      openOrganizationIds: [...new Set(activeOrganizationId ? [activeOrganizationId, ...openOrganizationIds] : openOrganizationIds)],
      organizationAppearanceOverrides,
      organizationModes,
      version: 2,
    };
    if (JSON.stringify(raw) !== JSON.stringify(normalized)) {
      await writeJsonFile(organizationsIndexPath, normalized);
    }
    return normalized;
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

  async function readNotificationsConfig(): Promise<BoardNotificationsConfig> {
    const fallback: BoardNotificationsConfig = {
      notifications: [],
      version: 1,
    };
    const raw = await readJsonOrDefault<Partial<BoardNotificationsConfig>>(notificationsConfigPath, fallback);
    const normalized: BoardNotificationsConfig = {
      notifications: Array.isArray(raw.notifications)
        ? raw.notifications
          .filter((notification): notification is BoardNotification => Boolean(notification?.id))
          .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
        : [],
      version: 1,
    };
    if (JSON.stringify(raw) !== JSON.stringify(normalized)) {
      await writeJsonFile(notificationsConfigPath, normalized);
    }
    return normalized;
  }

  async function writeNotificationsConfig(config: BoardNotificationsConfig) {
    const normalized: BoardNotificationsConfig = {
      notifications: [...config.notifications]
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
        .slice(0, 200),
      version: 1,
    };
    await writeJsonFile(notificationsConfigPath, normalized);
    return normalized;
  }

  async function createBoardNotification(
    payload: Omit<BoardNotification, "createdAt" | "id" | "unread"> & { unread?: boolean },
  ) {
    const config = await readNotificationsConfig();

    // Deduplicate: suppress if an identical (sourceApp, targetPanel, targetId, title) notification
    // was created within the last hour to prevent repeated auto-bootstrap entries.
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const duplicate = config.notifications.find(
      (n) =>
        n.sourceApp === payload.sourceApp &&
        n.targetPanel === payload.targetPanel &&
        n.targetId === payload.targetId &&
        n.title === payload.title &&
        new Date(n.createdAt).getTime() > oneHourAgo,
    );
    if (duplicate) return duplicate;

    const notification: BoardNotification = {
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID(),
      level: payload.level,
      organizationId: payload.organizationId ?? null,
      sourceApp: payload.sourceApp,
      summary: payload.summary,
      targetId: payload.targetId,
      targetPanel: payload.targetPanel,
      title: payload.title,
      unread: payload.level === "unread" ? payload.unread !== false : false,
    };
    config.notifications.unshift(notification);
    await writeNotificationsConfig(config);
    return notification;
  }

  async function markBoardNotificationRead(id: string, unread: boolean) {
    const config = await readNotificationsConfig();
    const notification = config.notifications.find((entry) => entry.id === id);
    if (!notification) {
      return null;
    }
    notification.unread = unread;
    await writeNotificationsConfig(config);
    return notification;
  }

  async function readTelemetryConfig(): Promise<TelemetryRecord> {
    const fallback: TelemetryRecord = {
      generatedAt: new Date().toISOString(),
      inference: { events: [] },
      version: 1,
    };
    const raw = await readJsonOrDefault<Partial<TelemetryRecord>>(telemetryConfigPath, fallback);
    return {
      generatedAt: raw.generatedAt ?? fallback.generatedAt,
      inference: {
        events: Array.isArray(raw.inference?.events) ? raw.inference.events.slice(-200) : [],
      },
      version: 1,
    };
  }

  async function recordInferenceTelemetry(type: string, payload: Partial<InferenceStatus> & { address?: string }) {
    const config = await readTelemetryConfig();
    config.generatedAt = new Date().toISOString();
    config.inference.events.push({
      address: payload.address ?? "",
      contextWindow: typeof payload.contextWindow === "number" ? payload.contextWindow : 128000,
      model: payload.model ?? "",
      timestamp: new Date().toISOString(),
      type,
    });
    config.inference.events = config.inference.events.slice(-500);
    await writeJsonFile(telemetryConfigPath, config);
    return config;
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
      openOrganizationIds: index.openOrganizationIds,
      organizationAppearanceOverrides: index.organizationAppearanceOverrides,
      organizationModes: index.organizationModes,
      organizations,
    };
  }

  function organizationDataPath(orgId: string, fileName: string) {
    return path.join(organizationsDir, orgId, fileName);
  }

  async function readOrganizationScopedJson<T>(orgId: string, fileName: string, fallback: T) {
    return readJsonOrDefault<T>(organizationDataPath(orgId, fileName), fallback);
  }

  async function readOrganizationScopedJsonWithFallbacks<T>(
    orgId: string,
    fileNames: string[],
    fallback: T,
  ) {
    for (const fileName of fileNames) {
      const filePath = organizationDataPath(orgId, fileName);
      if (existsSync(filePath)) {
        return readJsonOrDefault<T>(filePath, fallback);
      }
    }
    return fallback;
  }

  async function writeOrganizationScopedJson<T>(orgId: string, fileName: string, value: T) {
    await mkdir(path.join(organizationsDir, orgId), { recursive: true });
    await writeJsonFile(organizationDataPath(orgId, fileName), value);
  }

  async function ensureOrganizationWebScaffold(orgId: string, organizationName: string) {
    const webRoot = path.join(organizationsDir, orgId, "web");
    const fragmentsDir = path.join(webRoot, "fragments");
    await mkdir(fragmentsDir, { recursive: true });
    await ensureMemoryFile(
      path.join(webRoot, "manifest.json"),
      `${JSON.stringify({
        createdAt: new Date().toISOString(),
        description: `Intranet fragments for ${organizationName}`,
        fragments: [
          { file: "home.htm", label: "homepage" },
          { file: "landing.htm", label: "landing page" },
        ],
        version: 1,
      }, null, 2)}\n`,
    );
    await ensureMemoryFile(
      path.join(fragmentsDir, "home.htm"),
      `<section>\n  <h1>${organizationName}</h1>\n  <p>Welcome to the organization intranet homepage.</p>\n</section>\n`,
    );
    await ensureMemoryFile(
      path.join(fragmentsDir, "landing.htm"),
      `<section>\n  <h1>Landing page</h1>\n  <p>Connected internal destination for projects, meetings, and operating context.</p>\n</section>\n`,
    );
  }

  async function listWebFragments(orgId: string): Promise<WebFragmentSummary[]> {
    const about = await readOrganizationAbout(orgId);
    if (!about) return [];
    await ensureOrganizationWebScaffold(orgId, about.name);
    const fragmentsDir = path.join(organizationsDir, orgId, "web", "fragments");
    const entries = await readdir(fragmentsDir, { withFileTypes: true });
    const fragments: WebFragmentSummary[] = [];
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".htm")) continue;
      const stats = await lstat(path.join(fragmentsDir, entry.name));
      fragments.push({
        id: entry.name,
        label: entry.name.replace(/\.htm$/i, "").replace(/[-_]+/g, " "),
        name: entry.name,
        path: path.join("web", "fragments", entry.name).replaceAll("\\", "/"),
        type: "fragment",
        updatedAt: stats.mtime.toISOString(),
      });
    }
    return fragments.sort((left, right) => left.name.localeCompare(right.name));
  }

  async function renderWebPreview(orgId: string, fragmentPath?: string) {
    const about = await readOrganizationAbout(orgId);
    if (!about) {
      return "<!doctype html><html><body><p>Organization not found.</p></body></html>";
    }
    await ensureOrganizationWebScaffold(orgId, about.name);
    const fragments = await listWebFragments(orgId);
    const target = fragmentPath
      ? fragments.find((entry) => entry.path === fragmentPath)
      : fragments[0];
    if (!target) {
      return "<!doctype html><html><body><p>No fragments found.</p></body></html>";
    }
    const content = await readFile(path.join(organizationsDir, orgId, target.path), "utf8");
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${about.name} intranet</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; padding: 2rem; background: #f4f4f4; color: #161616; }
      main { max-width: 56rem; margin: 0 auto; background: white; border-radius: 1rem; padding: 2rem; box-shadow: 0 1rem 2rem rgba(0,0,0,0.08); }
      h1,h2,h3 { margin-top: 0; }
    </style>
  </head>
  <body>
    <main>${content}</main>
  </body>
</html>`;
  }

  async function writeWebFragment(orgId: string, file: string, content: string) {
    const about = await readOrganizationAbout(orgId);
    if (!about) return null;
    await ensureOrganizationWebScaffold(orgId, about.name);
    const safeFile = path.basename(file).replace(/[^a-z0-9._-]/gi, "");
    if (!safeFile.endsWith(".htm")) {
      return null;
    }
    const fragmentPath = path.join(organizationsDir, orgId, "web", "fragments", safeFile);
    await writeFile(fragmentPath, content, "utf8");
    return {
      file: safeFile,
      path: path.join("web", "fragments", safeFile).replaceAll("\\", "/"),
    };
  }

  async function ensureMemoryFile(filePath: string, content: string) {
    if (existsSync(filePath)) {
      return;
    }
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, content, "utf8");
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
      maxTokens: parseInt(fields.get("max_tokens") || "8192", 10) || 8192,
      model: fields.get("model") || "",
      name,
      promptFile: fields.get("prompt_file") || "",
      role: fields.get("role") || "",
      skills: parseBulletList(fields.get("skills") || ""),
      temperature: parseFloat(fields.get("temperature") || "0.7") || 0.7,
      thinking: fields.get("thinking") === "true",
      tier: normalizedTier,
      tools: parseBulletList(fields.get("tools") || ""),
    };
  }

  function applyAgentTemplateBundles(
    summary: AgentTemplateSummary,
    catalog: TemplateCatalog,
  ): AgentTemplateSummary {
    const workerBundle = defaultWorkerBundle(catalog);
    const matchedTemplate = roleTemplateByAgentName(catalog, summary.file || summary.name);
    const bundles = [
      ...(workerBundle ? [workerBundle.id] : []),
      ...((matchedTemplate?.bundles ?? []).filter((bundleId) => bundleId !== workerBundle?.id)),
    ];
    const bundleRecords = bundles
      .map((bundleId) => catalog.bundles.find((bundle) => bundle.id === bundleId))
      .filter(Boolean) as TemplateBundle[];
    const effectiveSkills = [...new Set([
      ...summary.skills,
      ...bundleRecords.flatMap((bundle) => bundle.skills),
    ])].sort();
    const effectiveTools = [...new Set([
      ...summary.tools,
      ...bundleRecords.flatMap((bundle) => bundle.tools),
    ])].sort();
    return {
      ...summary,
      bundles,
      domain: matchedTemplate?.domain ?? "general",
      effectiveSkills,
      effectiveTools,
    };
  }

  function normalizeTierLevel(value: string | null | undefined): TierLevel {
    return value === "top" || value === "low" ? value : "mid";
  }

  // ── Agent file CRUD ──────────────────────────────────────────────────────

  async function listAgentFiles() {
    await mkdir(agentsDir, { recursive: true });
    const entries = await readdir(agentsDir, { withFileTypes: true });
    const catalog = await readTemplateCatalog();
    const agents: AgentTemplateSummary[] = [];
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
      const file = entry.name;
      const content = await readFile(path.join(agentsDir, file), "utf8");
      agents.push(applyAgentTemplateBundles(parseAgentTemplate(content, file), catalog));
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

  async function readFlow(orgId: string): Promise<ScheduledTask[]> {
    const tasks = await readOrganizationScopedJsonWithFallbacks<ScheduledTask[]>(
      orgId,
      ["flow.json", "schedule.json"],
      [],
    );
    return Array.isArray(tasks)
      ? tasks.map((task) => ({
        agentId: task.agentId ?? "",
        assigneeType: task.assigneeType === "role_assignment" ? "role_assignment" : "agent_template",
        assigneeValue: task.assigneeValue ?? "",
        cadence: task.cadence ?? (task as ScheduledTask & { cronExpression?: string }).cronExpression ?? "continuous",
        contextRequirement: Number.isFinite(task.contextRequirement) ? Number(task.contextRequirement) : 128000,
        createdAt: task.createdAt ?? new Date().toISOString(),
        dependencyIds: Array.isArray(task.dependencyIds)
          ? task.dependencyIds.filter((id): id is string => typeof id === "string" && Boolean(id))
          : [],
        enabled: task.enabled ?? true,
        evaluationRequired: typeof task.evaluationRequired === "boolean" ? task.evaluationRequired : false,
        groupKey: task.groupKey ?? "",
        id: task.id ?? crypto.randomUUID(),
        lastRunAt: task.lastRunAt ?? null,
        name: task.name ?? "",
        notes: task.notes ?? "",
        objective: task.objective ?? "",
        trigger: task.trigger ?? "auto",
        workstream: task.workstream ?? "",
      }))
      : [];
  }

  async function writeFlowTask(orgId: string, task: Partial<ScheduledTask>) {
    const tasks = await readFlow(orgId);
    const now = new Date().toISOString();
    const existing = task.id ? tasks.find((t) => t.id === task.id) : null;
    const updated: ScheduledTask = {
      agentId: task.agentId ?? existing?.agentId ?? "",
      assigneeType: task.assigneeType ?? existing?.assigneeType ?? "agent_template",
      assigneeValue: task.assigneeValue ?? existing?.assigneeValue ?? "",
      cadence: task.cadence ?? task.cronExpression ?? existing?.cadence ?? existing?.cronExpression ?? "continuous",
      contextRequirement: Number.isFinite(task.contextRequirement)
        ? Number(task.contextRequirement)
        : existing?.contextRequirement ?? 128000,
      createdAt: existing?.createdAt ?? now,
      dependencyIds: Array.isArray(task.dependencyIds)
        ? task.dependencyIds.filter((id): id is string => typeof id === "string" && Boolean(id))
        : existing?.dependencyIds ?? [],
      enabled: task.enabled ?? existing?.enabled ?? true,
      evaluationRequired: typeof task.evaluationRequired === "boolean"
        ? task.evaluationRequired
        : existing?.evaluationRequired ?? false,
      groupKey: task.groupKey ?? existing?.groupKey ?? "",
      id: task.id ?? crypto.randomUUID(),
      lastRunAt: existing?.lastRunAt ?? null,
      name: task.name ?? existing?.name ?? "",
      notes: task.notes ?? existing?.notes ?? "",
      objective: task.objective ?? existing?.objective ?? "",
      trigger: task.trigger ?? existing?.trigger ?? "auto",
      workstream: task.workstream ?? existing?.workstream ?? "",
    };
    const rest = tasks.filter((t) => t.id !== updated.id);
    await writeOrganizationScopedJson(orgId, "flow.json", [...rest, updated]);
    return updated;
  }

  async function deleteFlowTask(orgId: string, id: string) {
    const tasks = await readFlow(orgId);
    const filtered = tasks.filter((t) => t.id !== id);
    if (filtered.length === tasks.length) return false;
    await writeOrganizationScopedJson(orgId, "flow.json", filtered);
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
    await createBoardNotification({
      level: "unread",
      organizationId: orgId,
      sourceApp: "meet",
      summary: `${meeting.title} is ready for review.`,
      targetId: meeting.id,
      targetPanel: "meet",
      title: "Meeting planned",
    });
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
    if (/\b(board|human)\b/i.test(message.to)) {
      await createBoardNotification({
        level: "unread",
        organizationId: orgId,
        sourceApp: "mail",
        summary: message.subject,
        targetId: message.id,
        targetPanel: "mail",
        title: "Board message",
      });
    }
    return message;
  }

  // ── Staff / Projects / Evals CRUD ────────────────────────────────────────

  async function readStaffState(orgId: string): Promise<StaffState> {
    const state = await readOrganizationScopedJsonWithFallbacks<StaffState>(orgId, ["staff.json", "hire.json"], {
      departments: [],
      identities: [],
      roles: [],
      teams: [],
      updatedAt: "",
      version: 1,
    });
    return {
      departments: Array.isArray(state.departments)
        ? state.departments.map((department) => ({
          createdAt: department.createdAt ?? "",
          id: department.id ?? crypto.randomUUID(),
          name: department.name ?? "",
          summary: department.summary ?? "",
          templateId: department.templateId ?? "",
          templateSource: department.templateSource === "local" ? "local" : "system",
          updatedAt: department.updatedAt ?? "",
        }))
        : [],
      identities: Array.isArray(state.identities) ? state.identities : [],
      roles: Array.isArray(state.roles)
        ? state.roles.map((role) => ({
          assigneeLabel: role.assigneeLabel ?? "",
          bundleIds: Array.isArray(role.bundleIds) ? role.bundleIds : [],
          createdAt: role.createdAt ?? "",
          evaluationFocus: role.evaluationFocus ?? "",
          identityId: role.identityId ?? "",
          id: role.id ?? crypto.randomUUID(),
          notes: role.notes ?? "",
          requiredSkills: Array.isArray(role.requiredSkills) ? role.requiredSkills : [],
          requiredTools: Array.isArray(role.requiredTools) ? role.requiredTools : [],
          status: role.status === "assigned" ? "assigned" : "open",
          teamId: role.teamId ?? "",
          templateId: role.templateId ?? "",
          templateName: role.templateName ?? "",
          templateSource: role.templateSource === "local" ? "local" : "system",
          tier: normalizeTierLevel(role.tier),
          title: role.title ?? "",
          updatedAt: role.updatedAt ?? "",
        }))
        : [],
      teams: Array.isArray(state.teams)
        ? state.teams.map((team) => ({
          createdAt: team.createdAt ?? "",
          departmentId: team.departmentId ?? "",
          id: team.id ?? crypto.randomUUID(),
          name: team.name ?? "",
          summary: team.summary ?? "",
          templateId: team.templateId ?? "",
          templateSource: team.templateSource === "local" ? "local" : "system",
          updatedAt: team.updatedAt ?? "",
        }))
        : [],
      updatedAt: state.updatedAt ?? "",
      version: 1,
    };
  }

  async function writeStaffState(orgId: string, nextState: Partial<StaffState>) {
    const current = await readStaffState(orgId);
    const merged: StaffState = {
      departments: Array.isArray(nextState.departments) ? nextState.departments : current.departments,
      identities: Array.isArray(nextState.identities) ? nextState.identities : current.identities,
      roles: Array.isArray(nextState.roles) ? nextState.roles : current.roles,
      teams: Array.isArray(nextState.teams) ? nextState.teams : current.teams,
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    await writeOrganizationScopedJson(orgId, "staff.json", merged);
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
    if (record.status === "failed" || record.status === "failing") {
      await createBoardNotification({
        level: "unread",
        organizationId: orgId,
        sourceApp: "evals",
        summary: record.resultSummary || record.criteria || "Evaluation needs attention.",
        targetId: record.id,
        targetPanel: "evals",
        title: `${record.name} failed`,
      });
    }
    return record;
  }

  async function deleteEval(orgId: string, id: string) {
    const current = await readEvals(orgId);
    const next = current.filter((item) => item.id !== id);
    if (next.length === current.length) return false;
    await writeOrganizationScopedJson(orgId, "evals.json", next);
    return true;
  }

  async function readWorkflows(orgId: string): Promise<Workflow[]> {
    const workflows = await readOrganizationScopedJson<Workflow[]>(orgId, "workflows.json", []);
    return Array.isArray(workflows) ? workflows : [];
  }

  async function writeWorkflow(orgId: string, payload: Partial<Workflow>): Promise<Workflow> {
    const current = await readWorkflows(orgId);
    const now = new Date().toISOString();
    const existing = payload.id ? current.find((w) => w.id === payload.id) : null;
    const workflow: Workflow = {
      createdAt: existing?.createdAt ?? now,
      createdBy: payload.createdBy ?? existing?.createdBy ?? "user",
      id: payload.id ?? crypto.randomUUID(),
      objective: payload.objective ?? existing?.objective ?? "",
      organizationId: orgId,
      status: payload.status ?? existing?.status ?? "draft",
      taskIds: payload.taskIds ?? existing?.taskIds ?? [],
      title: payload.title ?? existing?.title ?? "Untitled Workflow",
      updatedAt: now,
    };
    const next = [...current.filter((w) => w.id !== workflow.id), workflow]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    await writeOrganizationScopedJson(orgId, "workflows.json", next);
    return workflow;
  }

  async function deleteWorkflow(orgId: string, id: string) {
    const current = await readWorkflows(orgId);
    const next = current.filter((w) => w.id !== id);
    if (next.length === current.length) return false;
    await writeOrganizationScopedJson(orgId, "workflows.json", next);
    return true;
  }

  async function buildOrganizationRuntimeSummary(
    organization: OrganizationAbout,
    index: OrganizationsIndex,
    notifications: BoardNotification[],
  ): Promise<OrganizationRuntimeSummary> {
    const open = index.openOrganizationIds.includes(organization.id);
    const mode = index.organizationModes[organization.id] ?? "idle";
    const unread = notifications.filter((notification) => notification.organizationId === organization.id && notification.unread).length;
    const [projects, meetings, evals] = await Promise.all([
      readProjects(organization.id),
      listMeetings(organization.id),
      readEvals(organization.id),
    ]);
    const failingEval = evals.find((record) => record.status === "failing");
    const activeProject = projects.find((project) => project.status === "active" || project.status === "blocked");
    const pendingMeeting = meetings.find((meeting) => meeting.status !== "complete");
    const headline = failingEval
      ? `${failingEval.name} needs review`
      : activeProject
        ? `${activeProject.name} is ${activeProject.status}`
        : pendingMeeting
          ? `Meeting: ${pendingMeeting.title}`
          : mode === "auto"
            ? "Autonomous work in progress"
            : "Standing by in idle mode";
    return {
      headline,
      id: organization.id,
      mode,
      name: organization.name,
      open,
      status: `${open ? "open" : "closed"} · ${mode}`,
      unread,
    };
  }

  function buildIdentityName(roleTitle: string, employeeNumber: number) {
    const prefixes = ["Aster", "Meridian", "Lattice", "Harbor", "Signal", "North", "Cinder"];
    const suffixes = ["Vale", "Forge", "Quill", "Bridge", "Field", "Frame", "Works"];
    const hash = [...roleTitle].reduce((total, char) => total + char.charCodeAt(0), employeeNumber);
    return `${prefixes[hash % prefixes.length]} ${suffixes[(hash * 3) % suffixes.length]}`;
  }

  function buildIdentitySummary(roleTitle: string, organizationName: string) {
    const summaries: Record<string, string> = {
      CEO: `Strategic executive identity for ${organizationName}, optimized for synthesis, prioritization, and decisive organizational framing.`,
      COO: `Operational executive identity for ${organizationName}, optimized for sequencing, coordination, and throughput discipline.`,
      CTO: `Technical executive identity for ${organizationName}, optimized for tooling, JavaScript systems, and bespoke capability creation.`,
      Orgos: `Organization-scoped orgos identity for ${organizationName}, optimized for facilitation, orchestration, evaluation, and deterministic systems stewardship.`,
      Facilitator: `Facilitation identity for ${organizationName}, optimized for agenda shaping, scope discipline, and consensus hygiene.`,
    };
    return summaries[roleTitle] ?? `Role identity for ${organizationName}, shaped to execute ${roleTitle} work with disciplined judgment.`;
  }

  function buildIdentityInfluence(roleTitle: string) {
    const influences: Record<string, string> = {
      CEO: "Outside-work-optimal influence: calm board-level judgment, selective ambition, and disciplined synthesis under ambiguity.",
      COO: "Outside-work-optimal influence: logistics instinct, process clarity, and a bias toward smooth operational handoffs.",
      CTO: "Outside-work-optimal influence: curious builder energy, code craftsmanship, and controlled experimentation.",
      Orgos: "Outside-work-optimal influence: facilitative systems thinking, procedural rigor, and measured stewardship of shared infrastructure.",
      Facilitator: "Outside-work-optimal influence: moderator poise, agenda stewardship, and active listening discipline.",
    };
    return influences[roleTitle] ?? "Outside-work-optimal influence: role-shaped judgment with creative variability and measured restraint.";
  }

  async function ensureIdentityMemory(orgId: string, identity: IdentityRecord) {
    const memoryRoot = path.join(organizationsDir, orgId, "memory", identity.id);
    const sections = [
      { file: "PROFILE.md", key: "profile", label: "Profile" },
      { file: "working/WORKING_MEMORY.md", key: "working", label: "Working memory" },
      { file: "long-term/LONG_TERM_MEMORY.md", key: "longTerm", label: "Long-term memory" },
      { file: "reflections/RETROSPECTIVE.md", key: "reflections", label: "Reflections" },
    ];

    await ensureMemoryFile(
      path.join(memoryRoot, "identity.json"),
      `${JSON.stringify(identity, null, 2)}\n`,
    );
    await ensureMemoryFile(
      path.join(memoryRoot, "PROFILE.md"),
      `# ${identity.name}\n\n- Role: ${identity.roleTitle}\n- Persona: ${identity.personaSummary}\n- Influence: ${identity.influence}\n`,
    );
    await ensureMemoryFile(
      path.join(memoryRoot, "working", "WORKING_MEMORY.md"),
      `# Working Memory\n\nCurrent priorities, open threads, and live coordination notes for ${identity.name}.\n`,
    );
    await ensureMemoryFile(
      path.join(memoryRoot, "long-term", "LONG_TERM_MEMORY.md"),
      `# Long-Term Memory\n\nDurable knowledge, decisions, and reusable patterns for ${identity.name}.\n`,
    );
    await ensureMemoryFile(
      path.join(memoryRoot, "reflections", "RETROSPECTIVE.md"),
      `# Retrospective\n\nOngoing self-observation and improvement notes for ${identity.name}.\n`,
    );

    const index: MemoryIndexRecord = {
      createdAt: identity.createdAt,
      id: identity.id,
      memoryRoot: identity.memoryRoot,
      name: identity.name,
      personaSummary: identity.personaSummary,
      roleId: identity.roleId,
      roleTitle: identity.roleTitle,
      sections,
      updatedAt: new Date().toISOString(),
    };
    await ensureMemoryFile(
      path.join(memoryRoot, "index.json"),
      `${JSON.stringify(index, null, 2)}\n`,
    );
    return index;
  }

  async function collectDatamapEntries(baseDir: string, relativePath = ""): Promise<DatamapEntry[]> {
    const targetDir = safeJoin(baseDir, relativePath);
    if (!targetDir || !existsSync(targetDir)) {
      return [];
    }
    const entries = await readdir(targetDir, { withFileTypes: true });
    const results: DatamapEntry[] = [];
    for (const entry of entries) {
      const entryRelative = path.join(relativePath, entry.name).replaceAll("\\", "/");
      if (entry.isDirectory()) {
        results.push(...await collectDatamapEntries(baseDir, entryRelative));
        continue;
      }
      const extension = path.extname(entry.name).toLowerCase();
      if (![".md", ".txt", ".json", ".htm"].includes(extension)) {
        continue;
      }
      const content = await readFile(path.join(baseDir, entryRelative), "utf8");
      const headings = content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => /^#{1,6}\s+/.test(line))
        .map((line) => line.replace(/^#{1,6}\s+/, ""));
      const excerpt = content
        .split("\n")
        .map((line) => line.trim())
        .find(Boolean) ?? "";
      results.push({
        citation: entryRelative,
        excerpt: excerpt.slice(0, 220),
        headings,
        kind: extension.slice(1),
        path: entryRelative,
        title: headings[0] ?? entry.name.replace(extension, ""),
      });
    }
    return results;
  }

  async function rebuildOrganizationDatamap(orgId: string) {
    const organizationRoot = path.join(organizationsDir, orgId);
    if (!existsSync(organizationRoot)) {
      return null;
    }
    const datamap: DatamapRecord = {
      entries: await collectDatamapEntries(organizationRoot),
      generatedAt: new Date().toISOString(),
      organizationId: orgId,
      version: 1,
    };
    await writeOrganizationScopedJson(orgId, path.join("memory", "datamap.json"), datamap);
    return datamap;
  }

  async function readOrganizationDatamap(orgId: string) {
    const fallback: DatamapRecord = {
      entries: [],
      generatedAt: new Date().toISOString(),
      organizationId: orgId,
      version: 1,
    };
    return readOrganizationScopedJsonWithFallbacks(orgId, [path.join("memory", "datamap.json")], fallback);
  }

  async function ensureAutoBootstrap(orgId: string) {
    const organization = await readOrganizationAbout(orgId);
    if (!organization) return null;
    const catalog = await readTemplateCatalog();
    const archetype = catalog.organizationArchetypes.find((entry) => entry.id === organization.archetypeId) ?? null;

    let staff = await readStaffState(orgId);
    const now = new Date().toISOString();
    const departmentName = "Executive";
    let department = staff.departments.find((entry) => entry.name === departmentName);
    if (!department) {
      department = {
        createdAt: now,
        id: crypto.randomUUID(),
        name: departmentName,
        summary: "Core executive leadership for orgos autonomous operation.",
        updatedAt: now,
      };
      staff.departments.unshift(department);
    }

    const teamName = "Leadership";
    let team = staff.teams.find((entry) => entry.name === teamName);
    if (!team) {
      team = {
        createdAt: now,
        departmentId: department.id,
        id: crypto.randomUUID(),
        name: teamName,
        summary: "Executive decision-making and organizational guidance.",
        updatedAt: now,
      };
      staff.teams.unshift(team);
    }

    const defaults = [
      { employeeNumber: 0, roleTitle: "CEO", templateName: "CEO", tier: "top" as TierLevel, systemRole: false },
      { employeeNumber: 1, roleTitle: "COO", templateName: "COO", tier: "mid" as TierLevel, systemRole: false },
      { employeeNumber: 2, roleTitle: "CTO", templateName: "CTO", tier: "top" as TierLevel, systemRole: false },
      { employeeNumber: 3, roleTitle: "Orgos", templateName: "orgos", tier: "mid" as TierLevel, systemRole: true },
      { employeeNumber: 4, roleTitle: "Facilitator", templateName: "Facilitator", tier: "mid" as TierLevel, systemRole: true },
    ];

    for (const entry of defaults) {
      let role = staff.roles.find((item) => item.title === entry.roleTitle);
      if (!role) {
        role = {
          assigneeLabel: "",
          createdAt: now,
          id: crypto.randomUUID(),
          identityId: "",
          notes: `${entry.roleTitle} role for autonomous org bootstrap.`,
          requiredSkills: findRoleTemplate(catalog, `${entry.roleTitle.toLowerCase()}-executive`)?.requiredSkills ?? [],
          requiredTools: findRoleTemplate(catalog, `${entry.roleTitle.toLowerCase()}-executive`)?.requiredTools ?? [],
          status: "assigned",
          teamId: team.id,
          templateId: findRoleTemplate(catalog, `${entry.roleTitle.toLowerCase()}-executive`)?.id
            ?? findRoleTemplate(catalog, `${entry.roleTitle.toLowerCase()}-runtime`)?.id
            ?? "",
          templateName: entry.templateName,
          templateSource: "system",
          tier: entry.tier,
          title: entry.roleTitle,
          updatedAt: now,
        };
        staff.roles.push(role);
      }
      let identity = staff.identities.find((item) => item.roleId === role.id);
      if (!identity) {
        identity = {
          createdAt: now,
          employeeNumber: entry.employeeNumber,
          id: crypto.randomUUID(),
          influence: buildIdentityInfluence(entry.roleTitle),
          memoryRoot: `memory/${role.id}`,
          name: buildIdentityName(entry.roleTitle, entry.employeeNumber),
          personaSummary: buildIdentitySummary(entry.roleTitle, organization.name),
          promptFile: `prompts/agents/${entry.roleTitle.toLowerCase()}-system.txt`,
          roleId: role.id,
          roleTitle: entry.roleTitle,
          systemRole: entry.systemRole,
          templateName: entry.templateName,
          updatedAt: now,
        };
        staff.identities.push(identity);
      }
      role.identityId = identity.id;
      role.assigneeLabel = identity.name;
      role.bundleIds = role.bundleIds ?? findRoleTemplate(catalog, role.templateId)?.bundles ?? ["default-worker"];
      role.evaluationFocus = role.evaluationFocus ?? findRoleTemplate(catalog, role.templateId)?.evaluationFocus ?? "";
      role.status = "assigned";
      await ensureIdentityMemory(orgId, identity);
    }

    staff = await writeStaffState(orgId, staff);
    await ensureOrganizationWebScaffold(orgId, organization.name);
    const flow = await readFlow(orgId);
    if (flow.length === 0) {
      await writeOrganizationScopedJson(orgId, "flow.json", [
        {
          agentId: "",
          assigneeType: "role_assignment",
          assigneeValue: "CEO",
          cadence: "continuous",
          createdAt: now,
          enabled: true,
          id: crypto.randomUUID(),
          lastRunAt: null,
          name: "Executive bootstrap",
          notes: "Review the organization, define next capability steps, and dispatch initial objectives.",
          objective: "Initialize the autonomous executive operating cadence for orgos.",
          trigger: "auto",
        },
        {
          agentId: "",
          assigneeType: "role_assignment",
          assigneeValue: "Orgos",
          cadence: "continuous",
          createdAt: now,
          enabled: true,
          id: crypto.randomUUID(),
          lastRunAt: null,
          name: "Intranet and tooling bootstrap",
          notes: "Coordinate homepage, landing pages, and bespoke tool-test scaffolding for the organization intranet.",
          objective: "Establish the organization intranet and initial tool surfaces.",
          trigger: "auto",
        },
        {
          agentId: "",
          assigneeType: "role_assignment",
          assigneeValue: "Facilitator",
          cadence: "cycle",
          createdAt: now,
          enabled: true,
          id: crypto.randomUUID(),
          lastRunAt: null,
          name: "Facilitated reflection cycle",
          notes: "Keep meeting scope, retrospectives, and memory consolidation bounded and productive.",
          objective: "Run a bounded facilitation and reflection cycle for active work.",
          trigger: "reflection",
        },
        {
          agentId: "",
          assigneeType: "role_assignment",
          assigneeValue: "Orgos",
          cadence: "continuous",
          contextRequirement: 128000,
          createdAt: now,
          dependencyIds: [],
          enabled: true,
          evaluationRequired: true,
          groupKey: "memory-kernel",
          id: crypto.randomUUID(),
          lastRunAt: null,
          name: "Memory datamap maintenance",
          notes: "Refresh memory datamaps, compact low-value working memory, and preserve citations into durable context views.",
          objective: "Keep organization memory compact, queryable, and reliable for downstream agent context management.",
          trigger: "consolidation",
          workstream: "memory",
        },
      ]);
    }

    if (archetype) {
      const existingFlow = await readFlow(orgId);
      if (!existingFlow.some((task) => task.name === "Archetype expansion review")) {
        await writeFlowTask(orgId, {
          assigneeType: "role_assignment",
          assigneeValue: "Orgos",
          cadence: "cycle",
          contextRequirement: 128000,
          dependencyIds: [],
          enabled: true,
          evaluationRequired: true,
          groupKey: "org-growth",
          name: "Archetype expansion review",
          notes: `Review the ${archetype.name} template pack and recommend the next department, team, and role expansions only when justified by concrete work.`,
          objective: `Grow ${organization.name} using the ${archetype.name} archetype without overstaffing or introducing unnecessary complexity.`,
          trigger: "reflection",
          workstream: "staffing",
        });
      }
    }

    const existingProjects = await readProjects(orgId);
    if (!existingProjects.some((project) => project.name === "Founding roadmap")) {
      await writeProject(orgId, {
        name: "Founding roadmap",
        outputs: "Executive plan, staffing expansion, intranet structure, initial tooling backlog.",
        status: "active",
        summary: "Initial planning and implementation roadmap for autonomous organization growth.",
      });
    }

    const existingMeetings = await listMeetings(orgId);
    if (!existingMeetings.some((meeting) => meeting.title === "Founding alignment")) {
      await createMeeting(orgId, {
        agenda: [
          "Review organization purpose and immediate needs",
          "Assign initial executive responsibilities",
          "Plan intranet and tooling foundations",
        ],
        participants: ["CEO", "COO", "CTO", "Orgos", "Facilitator"],
        summary: "Kickoff meeting for founding alignment and growth planning.",
        title: "Founding alignment",
      });
    }

    const memoryIndex = {
      generatedAt: now,
      identities: staff.identities.map((identity) => ({
        id: identity.id,
        memoryRoot: identity.memoryRoot,
        name: identity.name,
        roleTitle: identity.roleTitle,
      })),
      organizationId: orgId,
      version: 1,
    };
    await writeOrganizationScopedJson(orgId, path.join("memory", "index.json"), memoryIndex);
    const datamap = await rebuildOrganizationDatamap(orgId);
    await writeOrganizationScopedJson(orgId, "orgos-runtime.json", {
      bootstrappedAt: now,
      mode: "auto",
      organizationId: orgId,
      primaryRoles: ["CEO", "COO", "CTO", "Orgos", "Facilitator"],
      version: 1,
    });
    await createBoardNotification({
      level: "silent",
      organizationId: orgId,
      sourceApp: "staff",
      summary: "Executive staffing, flow scaffolding, and memory silos are ready.",
      targetId: orgId,
      targetPanel: "staff",
      title: "Autonomy bootstrap ready",
    });
    return {
      flow: await readFlow(orgId),
      datamap,
      memoryIndex,
      staff,
    };
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

  // ── Prompt assembly ───────────────────────────────────────────────────────

  async function assembleAgentPrompt(
    promptFile: string,
    variables: Record<string, string>,
  ): Promise<{ systemPrompt: string; warnings: string[] }> {
    const warnings: string[] = [];
    if (!promptFile) {
      return { systemPrompt: "", warnings: ["No prompt_file specified for this agent."] };
    }
    const resolved = safeJoin(promptsDir, promptFile.replace(/^prompts\//, ""));
    if (!resolved || !existsSync(resolved)) {
      return {
        systemPrompt: "",
        warnings: [`Prompt file not found: ${promptFile}`],
      };
    }
    let raw = await readFile(resolved, "utf-8") as string;
    // Strip header comment block (lines starting with # before the first blank line)
    const lines = raw.split("\n");
    let bodyStart = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("#")) {
        bodyStart = i + 1;
      } else if (lines[i].trim() === "" && bodyStart > 0) {
        break;
      }
    }
    raw = lines.slice(bodyStart).join("\n").trimStart();

    // Substitute {{VARIABLE}} placeholders
    const result = raw.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => {
      if (key in variables) return variables[key];
      warnings.push(`Missing variable: ${key}`);
      return match;
    });

    return { systemPrompt: result, warnings };
  }

  // ── Inference dispatch ────────────────────────────────────────────────────

  const dispatchingNodes = new Set<string>();

  async function dispatchToNode(item: QueueItem, nodeAddress: string) {
    const node = nodeTelemetry.get(nodeAddress);
    if (!node) return;

    item.status = "dispatching";
    item.dispatchedAt = Date.now();
    item.nodeAddress = nodeAddress;
    node.activeRequests++;
    emitQueueEvent("queue:update", { id: item.id, status: item.status, nodeAddress });
    dispatchingNodes.add(nodeAddress);

    try {
      item.status = "running";
      emitQueueEvent("queue:update", { id: item.id, status: item.status });

      const controller = new AbortController();
      const timeoutMs = item.estimatedDurationMs * 4;
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(`${nodeAddress}/api/chat`, {
        body: JSON.stringify({
          messages: item.promptMessages,
          model: item.model,
          options: {
            num_ctx: 8192,
            num_predict: item.maxTokens,
            temperature: item.temperature,
          },
          stream: false,
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Ollama ${response.status}: ${await response.text()}`);
      }

      const chat = (await response.json()) as {
        message?: { content?: string };
      };
      const result = chat.message?.content ?? "";

      item.status = "done";
      item.result = result;
      item.completedAt = Date.now();
      item.actualDurationMs = item.completedAt - (item.dispatchedAt ?? item.completedAt);
      emitQueueEvent("queue:done", { id: item.id, result, status: "done" });

      // Check if this item belongs to a workflow and all its tasks are now done
      if (item.workflowId) {
        onQueueItemDone(item).catch(() => {});
      }

      await recordInferenceTelemetry("queue:done", {
        address: nodeAddress,
        contextWindow: 8192,
        model: item.model,
      });
    } catch (err) {
      item.retryCount++;
      if (item.retryCount < item.maxRetries) {
        item.status = "retrying";
        item.error = String(err);
        emitQueueEvent("queue:update", { error: item.error, id: item.id, status: item.status });
        setTimeout(() => {
          item.status = "pending";
          item.error = null;
          emitQueueEvent("queue:update", { id: item.id, status: item.status });
        }, 2000 * item.retryCount);
      } else {
        item.status = "failed";
        item.error = String(err);
        item.completedAt = Date.now();
        emitQueueEvent("queue:failed", { error: item.error, id: item.id, status: "failed" });
      }
    } finally {
      node.activeRequests = Math.max(0, node.activeRequests - 1);
      dispatchingNodes.delete(nodeAddress);
    }
  }

  async function onQueueItemDone(item: QueueItem) {
    if (!item.workflowId) return;
    // Find the org that owns this workflow — scan open organizations
    const index = await readOrganizationsIndex();
    for (const orgId of index.openOrganizationIds) {
      const workflows = await readWorkflows(orgId);
      const wf = workflows.find((w) => w.id === item.workflowId);
      if (!wf) continue;
      const allDone = wf.taskIds.every((tid) => {
        const qi = inferenceQueue.find((q) => q.id === tid);
        return !qi || qi.status === "done";
      });
      const anyFailed = wf.taskIds.some((tid) => {
        const qi = inferenceQueue.find((q) => q.id === tid);
        return qi?.status === "failed";
      });
      const nextStatus: WorkflowStatus = anyFailed ? "failed" : allDone ? "done" : "running";
      if (nextStatus !== wf.status) {
        await writeWorkflow(orgId, { ...wf, status: nextStatus });
        if (nextStatus === "done" || nextStatus === "failed") {
          await createBoardNotification({
            organizationId: orgId,
            sourceApp: "queue",
            summary: `Workflow "${wf.title}" ${nextStatus}.`,
            targetId: wf.id,
            targetPanel: "queue",
            title: `Workflow ${nextStatus === "done" ? "complete" : "failed"}`,
          });
        }
      }
      break;
    }
  }

  function tickDispatchLoop() {
    const next = dequeueNext();
    if (!next) return;
    const nodeAddress = selectNodeForTier(next.tier, next.model);
    if (!nodeAddress) {
      // Emit blocked if we have active nodes but none match
      if (nodeTelemetry.size > 0) {
        emitQueueEvent("queue:blocked", { id: next.id, reason: "no_matching_node" });
      }
      return;
    }
    // Avoid re-dispatching to a node that is already handling a dispatch this tick
    if (dispatchingNodes.has(nodeAddress)) return;
    // Fire-and-forget: do not await, so the ticker can continue
    dispatchToNode(next, nodeAddress).catch((err) => {
      console.error("[orgos] dispatchToNode error", err);
    });
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
      archetypeId: payload.archetypeId ?? existing?.archetypeId ?? "",
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
    index.openOrganizationIds = [...new Set([id, ...index.openOrganizationIds.filter((value) => value !== previousId)])];
    if (!index.organizationModes[id]) {
      index.organizationModes[id] = "idle";
    }
    if (previousId && previousId !== id) {
      delete index.organizationModes[previousId];
      if (index.organizationAppearanceOverrides[previousId]) {
        index.organizationAppearanceOverrides[id] = index.organizationAppearanceOverrides[previousId];
        delete index.organizationAppearanceOverrides[previousId];
      }
      index.openOrganizationIds = index.openOrganizationIds.map((value) => value === previousId ? id : value);
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
    index.openOrganizationIds = [...new Set([id, ...index.openOrganizationIds])];
    if (!index.organizationModes[id]) {
      index.organizationModes[id] = "idle";
    }
    await writeJsonFile(organizationsIndexPath, index);
    return readOrganizations();
  }

  async function updateOrganizationRuntime(payload: {
    active?: boolean;
    id: string;
    mode?: OrganizationRuntimeMode;
    open?: boolean;
  }) {
    const organization = await readOrganizationAbout(payload.id);
    if (!organization) {
      return null;
    }

    const index = await readOrganizationsIndex();
    if (typeof payload.open === "boolean") {
      if (payload.open) {
        index.openOrganizationIds = [...new Set([payload.id, ...index.openOrganizationIds])];
      } else {
        index.openOrganizationIds = index.openOrganizationIds.filter((value) => value !== payload.id);
        if (index.activeOrganizationId === payload.id) {
          index.activeOrganizationId = null;
        }
      }
    }
    if (payload.active) {
      organization.lastActiveAt = new Date().toISOString();
      await writeOrganizationAbout(organization);
      index.activeOrganizationId = payload.id;
      index.openOrganizationIds = [...new Set([payload.id, ...index.openOrganizationIds])];
    }
    if (payload.mode) {
      const previousMode = index.organizationModes[payload.id] ?? "idle";
      index.organizationModes[payload.id] = payload.mode;
      if (previousMode === "auto" && payload.mode === "idle") {
        await writeFlowTask(payload.id, {
          assigneeType: "role_assignment",
          assigneeValue: "Orgos",
          cadence: "handoff",
          enabled: true,
          name: "Idle handoff",
          notes: "Finish active work, write handoff notes, and settle the organization into idle.",
          objective: "Checkpoint active work before going idle.",
          trigger: "consolidation",
        });
        await createMailMessage(payload.id, {
          body: "Auto mode was turned off. Please complete in-flight work, capture handoff notes, and settle into idle.",
          folder: "outbox",
          from: "orgos",
          subject: "Idle transition handoff",
          to: "board",
        });
      }
    } else if (!index.organizationModes[payload.id]) {
      index.organizationModes[payload.id] = "idle";
    }

    await writeJsonFile(organizationsIndexPath, index);
    return readOrganizations();
  }

  async function updateOrganizationAppearanceOverride(
    id: string,
    payload: Partial<OrganizationAppearanceOverride>,
  ) {
    const organization = await readOrganizationAbout(id);
    if (!organization) {
      return null;
    }
    const index = await readOrganizationsIndex();
    index.organizationAppearanceOverrides[id] = {
      accent: normalizeAppearanceAccent(payload.accent),
      theme: normalizeAppearanceTheme(payload.theme),
    };
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
    }
    index.openOrganizationIds = index.openOrganizationIds.filter((value) => value !== id);
    delete index.organizationModes[id];
    delete index.organizationAppearanceOverrides[id];
    await writeJsonFile(organizationsIndexPath, index);

    return readOrganizations();
  }

  async function readWorkspaceBootstrap() {
    const [sourcesConfig, organizationsState, appearance, agents, skills, notifications, templates] =
      await Promise.all([
        readSourcesConfig(),
        readOrganizations(),
        readAppearanceConfig(),
        listAgentFiles(),
        listSkillFiles(),
        readNotificationsConfig(),
        readTemplateCatalog(),
      ]);
    const activeOrganization = organizationsState.activeOrganizationId
      ? organizationsState.organizations.find(
        (organization) => organization.id === organizationsState.activeOrganizationId,
      ) ?? null
      : null;
    const orgId = organizationsState.activeOrganizationId;
    const orgIndexSnapshot: OrganizationsIndex = {
      activeOrganizationId: organizationsState.activeOrganizationId,
      openOrganizationIds: organizationsState.openOrganizationIds,
      organizationAppearanceOverrides: organizationsState.organizationAppearanceOverrides,
      organizationModes: organizationsState.organizationModes,
      version: 2,
    };
    const organizationRuntime = await Promise.all(
      organizationsState.organizations.map((organization) =>
        buildOrganizationRuntimeSummary(organization, orgIndexSnapshot, notifications.notifications),
      ),
    );
    const telemetry = await readTelemetryConfig();
    const [flow, meetings, mailInbox, staff, projects, evals, workflows, datamap, web] = orgId
      ? await Promise.all([
        readFlow(orgId),
        listMeetings(orgId),
        listMail(orgId, "inbox"),
        readStaffState(orgId),
        readProjects(orgId),
        readEvals(orgId),
        readWorkflows(orgId),
        readOrganizationDatamap(orgId),
        (async () => {
          const fragments = await listWebFragments(orgId);
          return {
            fragments,
            preview: await renderWebPreview(orgId, fragments[0]?.path),
            tools: [{ file: path.join("tools", "README.txt"), name: "custom js tools" }],
          };
        })(),
      ])
      : [
        [],
        [],
        [],
        null,
        [],
        [],
        [],
        { entries: [], generatedAt: new Date().toISOString(), organizationId: "", version: 1 },
        { fragments: [], preview: "", tools: [] },
      ];

    return {
      agents,
      appearance,
      datamap,
      evals,
      filesystem: {
        roots: buildFilesystemRoots(activeOrganization),
      },
      flow,
      memory: orgId ? await readOrganizationScopedJsonWithFallbacks(orgId, [path.join("memory", "index.json")], { identities: [], version: 1 }) : { identities: [], version: 1 },
      mailInbox,
      meetings,
      organizations: organizationsState.organizations,
      activeOrganizationId: organizationsState.activeOrganizationId,
      openOrganizationIds: organizationsState.openOrganizationIds,
      organizationAppearanceOverrides: organizationsState.organizationAppearanceOverrides,
      organizationModes: organizationsState.organizationModes,
      organizationRuntime,
      notifications: notifications.notifications,
      orgosAgent: agents.some((agent) => agent.name === "orgos.md" || agent.name === "orgos")
        ? { id: "orgos", name: "orgos", scope: "system" }
        : null,
      projects,
      workflows,
      nodeTelemetry: [...nodeTelemetry.values()],
      queue: getQueueSnapshot(),
      staff,
      skills,
      sources: sourcesConfig.sources,
      telemetry,
      templates,
      web,
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
    // Dispatch loop: check for ready queue items every second
    setInterval(tickDispatchLoop, 1000);
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
      await recordInferenceTelemetry("probe", status);
      return Response.json(status);
    }

    if (url.pathname === "/api/inference/discover") {
      const sources = await discoverInferenceSources();
      for (const source of sources) {
        await recordInferenceTelemetry("discover", source);
      }
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

    if (url.pathname === "/api/system/auto-bootstrap" && request.method === "POST") {
      const payload = (await request.json()) as { orgId?: string };
      if (!payload.orgId) return new Response("Bad Request", { status: 400 });
      const result = await ensureAutoBootstrap(payload.orgId);
      if (!result) return new Response("Not Found", { status: 404 });
      // Auto-bootstrap events are surfaced via board notifications, not inference telemetry.
      return Response.json(result);
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

    if (url.pathname === "/api/web/list") {
      const orgId = url.searchParams.get("orgId") ?? "";
      if (!orgId) {
        return new Response("Bad Request", { status: 400 });
      }
      const fragments = await listWebFragments(orgId);
      return Response.json({
        fragments,
        preview: await renderWebPreview(orgId, fragments[0]?.path),
        tools: [{ file: path.join("tools", "README.txt"), name: "custom js tools" }],
      });
    }

    if (url.pathname === "/api/web/write" && request.method === "POST") {
      const payload = (await request.json()) as { content?: string; file?: string; orgId?: string };
      if (!payload.orgId || typeof payload.file !== "string" || typeof payload.content !== "string") {
        return new Response("Bad Request", { status: 400 });
      }
      const result = await writeWebFragment(payload.orgId, payload.file, payload.content);
      if (!result) {
        return new Response("Bad Request", { status: 400 });
      }
      await rebuildOrganizationDatamap(payload.orgId);
      return Response.json(result);
    }

    if (url.pathname === "/api/datamap/read") {
      const orgId = url.searchParams.get("orgId") ?? "";
      if (!orgId) {
        return new Response("Bad Request", { status: 400 });
      }
      const datamap = await readOrganizationDatamap(orgId);
      return Response.json(datamap);
    }

    if (url.pathname === "/api/datamap/rebuild" && request.method === "POST") {
      const payload = (await request.json()) as { orgId?: string };
      if (!payload.orgId) {
        return new Response("Bad Request", { status: 400 });
      }
      const datamap = await rebuildOrganizationDatamap(payload.orgId);
      if (!datamap) {
        return new Response("Not Found", { status: 404 });
      }
      return Response.json(datamap);
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
      const rawId = payload.id ?? "";
      const safeId = slugifyOrganizationName(rawId);
      if (!safeId || safeId !== rawId) {
        return new Response("Bad Request", { status: 400 });
      }
      const organizations = await activateOrganization(safeId);

      if (!organizations) {
        return new Response("Not Found", { status: 404 });
      }

      return Response.json(organizations);
    }

    if (url.pathname === "/api/organizations/runtime" && request.method === "POST") {
      const payload = (await request.json()) as {
        active?: boolean;
        id?: string;
        mode?: OrganizationRuntimeMode;
        open?: boolean;
      };
      const rawId = payload.id ?? "";
      const safeId = slugifyOrganizationName(rawId);
      if (!safeId || safeId !== rawId) {
        return new Response("Bad Request", { status: 400 });
      }
      const organizations = await updateOrganizationRuntime({
        active: payload.active,
        id: safeId,
        mode: payload.mode === "auto" ? "auto" : payload.mode === "idle" ? "idle" : undefined,
        open: typeof payload.open === "boolean" ? payload.open : undefined,
      });
      if (!organizations) {
        return new Response("Not Found", { status: 404 });
      }
      return Response.json(organizations);
    }

    if (url.pathname === "/api/organizations/appearance" && request.method === "POST") {
      const payload = (await request.json()) as {
        accent?: AppearanceAccent;
        id?: string;
        theme?: AppearanceTheme;
      };
      if (!payload.id) {
        return new Response("Bad Request", { status: 400 });
      }
      const organizations = await updateOrganizationAppearanceOverride(payload.id, payload);
      if (!organizations) {
        return new Response("Not Found", { status: 404 });
      }
      return Response.json(organizations);
    }

    if (url.pathname === "/api/organizations/delete" && request.method === "POST") {
      const payload = (await request.json()) as { id?: string };
      const rawId = payload.id ?? "";
      const safeId = slugifyOrganizationName(rawId);
      if (!safeId || safeId !== rawId) {
        return new Response("Bad Request", { status: 400 });
      }
      const organizations = await deleteOrganization(safeId);

      if (!organizations) {
        return new Response("Not Found", { status: 404 });
      }

      return Response.json(organizations);
    }

    if (url.pathname === "/api/notifications/list") {
      const config = await readNotificationsConfig();
      return Response.json(config);
    }

    if (url.pathname === "/api/notifications/read" && request.method === "POST") {
      const payload = (await request.json()) as { id?: string; unread?: boolean };
      if (!payload.id) {
        return new Response("Bad Request", { status: 400 });
      }
      const notification = await markBoardNotificationRead(payload.id, Boolean(payload.unread));
      if (!notification) {
        return new Response("Not Found", { status: 404 });
      }
      return Response.json(notification);
    }

    if (url.pathname === "/api/notifications/create" && request.method === "POST") {
      const payload = (await request.json()) as Partial<BoardNotification>;
      if (!payload.title || !payload.summary || !payload.sourceApp) {
        return new Response("Bad Request", { status: 400 });
      }
      const notification = await createBoardNotification({
        level: payload.level === "silent" ? "silent" : "unread",
        organizationId: payload.organizationId ?? null,
        sourceApp: payload.sourceApp,
        summary: payload.summary,
        targetId: payload.targetId ?? "",
        targetPanel: payload.targetPanel ?? null,
        title: payload.title,
        unread: payload.unread,
      });
      return Response.json(notification);
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
      const payload = (await request.json()) as {
        agentId?: string;
        taskDescription?: string;
        variables?: Record<string, string>;
        priority?: QueuePriority;
        dependencies?: string[];
        workflowId?: string;
        // Legacy direct-message form
        promptMessages?: { role: string; content: string }[];
        tier?: TierLevel;
        model?: string;
      };
      if (!payload.agentId) {
        return new Response("Bad Request: agentId required", { status: 400 });
      }

      let promptMessages: { role: string; content: string }[];
      let tier: TierLevel = "mid";
      let model = payload.model ?? "";
      let temperature = 0.7;
      let maxTokens = 8192;

      if (payload.promptMessages) {
        // Legacy form: caller supplies raw messages
        promptMessages = payload.promptMessages;
        tier = payload.tier ?? "mid";
      } else {
        // Preferred form: server assembles from agent template
        if (!payload.taskDescription) {
          return new Response("Bad Request: taskDescription required", { status: 400 });
        }
        const agents = await listAgentFiles();
        const agent = agents.find(
          (a) => a.name === payload.agentId || a.file === payload.agentId + ".md",
        );
        if (!agent) {
          return new Response(`Not Found: agent '${payload.agentId}'`, { status: 404 });
        }
        tier = agent.tier;
        model = agent.model || model;
        temperature = agent.temperature;
        maxTokens = agent.maxTokens;
        const variables: Record<string, string> = {
          TASK: payload.taskDescription,
          ...payload.variables,
        };
        const assembled = await assembleAgentPrompt(agent.promptFile, variables);
        const systemContent = assembled.systemPrompt || `You are ${agent.name}. ${agent.description}`;
        promptMessages = [
          { role: "system", content: systemContent },
          { role: "user", content: payload.taskDescription },
        ];
      }

      const item: QueueItem = {
        agentId: payload.agentId,
        actualDurationMs: null,
        completedAt: null,
        dependencies: payload.dependencies ?? [],
        dispatchedAt: null,
        enqueuedAt: Date.now(),
        error: null,
        estimatedDurationMs: 30000,
        id: crypto.randomUUID(),
        maxRetries: 2,
        maxTokens,
        model,
        nodeAddress: null,
        priority: payload.priority ?? "normal",
        promptMessages,
        result: null,
        retryCount: 0,
        status: "pending",
        taskId: crypto.randomUUID(),
        temperature,
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

    if (url.pathname === "/api/prompts/preview" && request.method === "POST") {
      const payload = (await request.json()) as {
        agentId?: string;
        variables?: Record<string, string>;
      };
      if (!payload.agentId) return new Response("Bad Request", { status: 400 });
      const agents = await listAgentFiles();
      const agent = agents.find((a) => a.name === payload.agentId);
      if (!agent) return new Response("Not Found", { status: 404 });
      const assembled = await assembleAgentPrompt(agent.promptFile, payload.variables ?? {});
      return Response.json(assembled);
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

    if (url.pathname === "/api/templates/list") {
      const templates = await readTemplateCatalog();
      return Response.json({ templates });
    }

    // ── Tools API ────────────────────────────────────────────────────────────

    if (url.pathname === "/api/tools/list") {
      const skills = await listSkillFiles();
      const tools = [
        { name: "sources.inspect", file: "/api/inference/discover", scope: "system" },
        { name: "sources.save", file: "/api/system/sources", scope: "system" },
        { name: "organizations.runtime", file: "/api/organizations/runtime", scope: "system" },
        { name: "organizations.appearance", file: "/api/organizations/appearance", scope: "system" },
        { name: "notifications.list", file: "/api/notifications/list", scope: "system" },
        { name: "notifications.write", file: "/api/notifications/create", scope: "system" },
        { name: "templates.list", file: "/api/templates/list", scope: "system" },
        { name: "files.list", file: "/api/files/list", scope: "system|organization" },
        { name: "files.write", file: "/api/text/write", scope: "system|organization" },
        { name: "web.list", file: "/api/web/list", scope: "organization" },
        { name: "web.write", file: "/api/web/write", scope: "organization" },
        { name: "datamap.read", file: "/api/datamap/read", scope: "organization" },
        { name: "datamap.rebuild", file: "/api/datamap/rebuild", scope: "organization" },
        { name: "telemetry.read", file: ".data/system/telemetry.json", scope: "system" },
        { name: "memory.bootstrap", file: "/api/system/auto-bootstrap", scope: "organization" },
        { name: "staff.write", file: "/api/staff/write", scope: "organization" },
        { name: "flow.write", file: "/api/flow/create", scope: "organization" },
        { name: "mail.write", file: "/api/mail/write", scope: "organization" },
        { name: "meet.write", file: "/api/meet/write", scope: "organization" },
        { name: "projects.write", file: "/api/projects/write", scope: "organization" },
        { name: "evals.write", file: "/api/evals/write", scope: "organization" },
        { name: "workflows.create", file: "/api/workflows/create", scope: "organization" },
        { name: "workflows.run", file: "/api/workflows/run", scope: "organization" },
        { name: "skills.registry", file: ".skills/", scope: "system" },
      ];
      return Response.json({ tools, skills });
    }

    // ── Flow API ─────────────────────────────────────────────────────────────

    if (url.pathname === "/api/flow/list" || url.pathname === "/api/schedule/list") {
      const orgId = url.searchParams.get("orgId");
      if (!orgId) return new Response("Bad Request", { status: 400 });
      const tasks = await readFlow(orgId);
      return Response.json({ tasks });
    }

    if (url.pathname === "/api/flow/create" && request.method === "POST") {
      const payload = (await request.json()) as { orgId?: string } & Partial<ScheduledTask>;
      if (!payload.orgId) return new Response("Bad Request", { status: 400 });
      const task = await writeFlowTask(payload.orgId, payload);
      return Response.json(task);
    }

    if (url.pathname === "/api/flow/delete" && request.method === "POST") {
      const payload = (await request.json()) as { id?: string; orgId?: string };
      if (!payload.id || !payload.orgId) return new Response("Bad Request", { status: 400 });
      const ok = await deleteFlowTask(payload.orgId, payload.id);
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

    if (url.pathname === "/api/staff/read") {
      const orgId = url.searchParams.get("orgId");
      if (!orgId) return new Response("Bad Request", { status: 400 });
      const staff = await readStaffState(orgId);
      return Response.json(staff);
    }

    if (url.pathname === "/api/staff/write" && request.method === "POST") {
      const payload = (await request.json()) as { orgId?: string } & Partial<StaffState>;
      if (!payload.orgId) return new Response("Bad Request", { status: 400 });
      const staff = await writeStaffState(payload.orgId, payload);
      return Response.json(staff);
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

    // Workflow routes
    if (url.pathname === "/api/workflows/list") {
      const orgId = url.searchParams.get("orgId");
      if (!orgId) return new Response("Bad Request", { status: 400 });
      const workflows = await readWorkflows(orgId);
      return Response.json({ workflows });
    }

    if (url.pathname === "/api/workflows/create" && request.method === "POST") {
      const payload = (await request.json()) as {
        objective?: string;
        orgId?: string;
        title?: string;
      };
      if (!payload.orgId) return new Response("Bad Request", { status: 400 });
      const workflow = await writeWorkflow(payload.orgId, {
        createdBy: "user",
        objective: payload.objective ?? "",
        status: "draft",
        taskIds: [],
        title: payload.title ?? "Untitled Workflow",
      });
      return Response.json(workflow);
    }

    if (url.pathname === "/api/workflows/run" && request.method === "POST") {
      const payload = (await request.json()) as { id?: string; orgId?: string };
      if (!payload.id || !payload.orgId) return new Response("Bad Request", { status: 400 });
      const workflows = await readWorkflows(payload.orgId);
      const wf = workflows.find((w) => w.id === payload.id);
      if (!wf) return new Response("Not Found", { status: 404 });
      const updated = await writeWorkflow(payload.orgId, { ...wf, status: "running" });
      return Response.json(updated);
    }

    if (url.pathname === "/api/workflows/cancel" && request.method === "POST") {
      const payload = (await request.json()) as { id?: string; orgId?: string };
      if (!payload.id || !payload.orgId) return new Response("Bad Request", { status: 400 });
      const workflows = await readWorkflows(payload.orgId);
      const wf = workflows.find((w) => w.id === payload.id);
      if (!wf) return new Response("Not Found", { status: 404 });
      // Cancel any pending queue items belonging to this workflow
      for (const tid of wf.taskIds) {
        const qi = inferenceQueue.find((q) => q.id === tid && q.status === "pending");
        if (qi) qi.status = "failed";
      }
      const updated = await writeWorkflow(payload.orgId, { ...wf, status: "cancelled" });
      return Response.json(updated);
    }

    if (url.pathname === "/api/workflows/delete" && request.method === "POST") {
      const payload = (await request.json()) as { id?: string; orgId?: string };
      if (!payload.id || !payload.orgId) return new Response("Bad Request", { status: 400 });
      const ok = await deleteWorkflow(payload.orgId, payload.id);
      if (!ok) return new Response("Not Found", { status: 404 });
      return Response.json({ ok: true });
    }

    if (url.pathname === "/api/workflows/read") {
      const orgId = url.searchParams.get("orgId");
      const id = url.searchParams.get("id");
      if (!orgId || !id) return new Response("Bad Request", { status: 400 });
      const workflows = await readWorkflows(orgId);
      const wf = workflows.find((w) => w.id === id);
      if (!wf) return new Response("Not Found", { status: 404 });
      return Response.json(wf);
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
