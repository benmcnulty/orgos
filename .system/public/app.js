const PANEL_ABOUT = "about";
const PANEL_SOURCES = "sources";
const SOURCE_KIND_LOCAL = "local_default";
const SOURCE_KIND_DETECTED = "detected";
const SOURCE_KIND_MANUAL = "manual";
const SOURCE_KIND_SAVED = "saved";

const titleElement = document.querySelector("#app-title");
const desktopHome = document.querySelector("#desktop-home");
const clockPanel = document.querySelector(".clock-panel");
const clockTime = document.querySelector("#clock-time");
const clockDate = document.querySelector("#clock-date");
const fullscreenButton = document.querySelector("#fullscreen-button");
const windowedButton = document.querySelector("#windowed-button");
const modeToggle = document.querySelector("#mode-toggle");
const modeToggleLabel = document.querySelector("#mode-toggle-label");
const aboutIcon = document.querySelector("#about-icon");
const sourcesIcon = document.querySelector("#sources-icon");
const panelHeaderBar = document.querySelector("#panel-header-bar");
const headerTabs = document.querySelector("#header-tabs");
const headerTabsViewport = document.querySelector("#header-tabs-viewport");
const tabScrollLeftButton = document.querySelector("#tab-scroll-left");
const tabScrollRightButton = document.querySelector("#tab-scroll-right");
const workspaceArea = document.querySelector(".workspace-area");
const desktopArea = document.querySelector("#desktop-area");
const panelRegion = document.querySelector("#panel-region");
const aboutPanel = document.querySelector("#about-panel");
const sourcesPanel = document.querySelector("#sources-panel");
const rescanSourcesButton = document.querySelector("#rescan-sources");
const scanState = document.querySelector("#scan-state");
const scanCountNumber = document.querySelector("#scan-count-number");
const scanCountLabel = document.querySelector("#scan-count-label");
const aboutState = document.querySelector("#about-state");
const addSourceButton = document.querySelector("#add-source");
const addOrganizationButton = document.querySelector("#add-organization");
const sourceMenu = document.querySelector("#source-menu");
const sourceDetail = document.querySelector("#source-detail");
const organizationMenu = document.querySelector("#organization-menu");
const organizationDetail = document.querySelector("#organization-detail");
const sourceCardTemplate = document.querySelector("#source-card-template");
const sourceMenuItemTemplate = document.querySelector("#source-menu-item-template");
const organizationCardTemplate = document.querySelector("#organization-card-template");
const organizationMenuItemTemplate = document.querySelector(
  "#organization-menu-item-template",
);
const headerTabTemplate = document.querySelector("#header-tab-template");
const headerCaption = document.querySelector("#header-caption");
const headerCaptionSubtitle = document.querySelector("#header-caption-subtitle");
const sourceIndicatorWrap = document.querySelector("#source-indicator-wrap");
const sourceIndicator = document.querySelector("#source-indicator");
const sourceIndicatorCount = document.querySelector("#source-indicator-count");
const sourceTooltip = document.querySelector("#source-tooltip");
const confirmModal = document.querySelector("#confirm-modal");
const confirmModalTitle = document.querySelector("#confirm-modal-title");
const confirmModalBody = document.querySelector("#confirm-modal-body");
const confirmModalConfirm = document.querySelector("#confirm-modal-confirm");

const telemetry = [];
let wakeLock = null;
let keepAwakeRequested = false;
let discoveryInFlight = false;
let selectedSourceId = null;
let selectedOrganizationId = null;
let activePanelId = null;
let openPanelIds = [];
let verifyingSourceIds = new Set();
let showingDesktop = false;
let tabLayoutFrame = 0;
let tabNavIndex = -1;
let desktopNavIndex = 0;
let navMode = "desktop";
let keyboardNavigationVisible = false;
let savingOrganizationId = null;
let loadingOrganizationId = null;
let savingSourceIds = new Set();
let systemMode = "idle";

let sourceState = [];
let sourceDrafts = new Map();
let detectedSourceMap = new Map();
let organizations = [];
let activeOrganizationId = null;
let organizationDrafts = new Map();
let organizationRecentIds = [];
let pendingConfirmation = null;

const ABOUT_ICON_MARKUP = `
  <svg viewBox="0 0 64 64" focusable="false">
    <circle class="desktop-icon__stroke" cx="32" cy="32" r="19" />
    <path class="desktop-icon__stroke" d="M32 27v13M32 22.5h.01" />
  </svg>
`;

const SOURCES_ICON_MARKUP = `
  <svg viewBox="0 0 64 64" focusable="false">
    <path
      class="desktop-icon__stroke"
      d="M32 12c-8.8 0-16 7.2-16 16 0 5.9 3.2 11.1 8 13.9v4.6c0 .8.7 1.5 1.5 1.5h13c.8 0 1.5-.7 1.5-1.5v-4.6c4.8-2.8 8-8 8-13.9 0-8.8-7.2-16-16-16z"
    />
    <line class="desktop-icon__stroke" x1="25.5" y1="51" x2="38.5" y2="51" />
    <line class="desktop-icon__stroke" x1="28" y1="55" x2="36" y2="55" />
  </svg>
`;

function logEvent(type, detail = {}) {
  telemetry.push({
    detail,
    time: new Date().toISOString(),
    type,
  });
  console.debug(`[orgos] ${type}`, detail);
}

function normalizeTier(value) {
  if (value === "high") {
    return "top";
  }

  if (value === "medium") {
    return "mid";
  }

  return value === "top" || value === "low" ? value : "mid";
}

function createDraftOrganization(overrides = {}) {
  return {
    createdAt: "",
    description: "",
    id: `draft-${crypto.randomUUID()}`,
    industry: "technology",
    industryCustom: "",
    lastActiveAt: "",
    name: "",
    persisted: false,
    updatedAt: "",
    ...overrides,
  };
}

function normalizeOrganization(value) {
  return createDraftOrganization({
    createdAt: value.createdAt ?? "",
    description: value.description ?? "",
    id: value.id ?? `draft-${crypto.randomUUID()}`,
    industry: value.industry ?? "technology",
    industryCustom: value.industryCustom ?? "",
    lastActiveAt: value.lastActiveAt ?? "",
    name: value.name ?? "",
    persisted: true,
    updatedAt: value.updatedAt ?? "",
  });
}

function createSourceRecord(overrides = {}) {
  return {
    active: false,
    address: "",
    availableModels: [],
    detail: "Configure and verify this inference source.",
    hostname: "",
    id: crypto.randomUUID(),
    instructions: [],
    kind: SOURCE_KIND_MANUAL,
    labelCustomized: false,
    model: "",
    name: "Source",
    note: "",
    persisted: false,
    sourceType: "ollama",
    tier: "mid",
    verified: false,
    ...overrides,
  };
}

function cloneSource(source) {
  return {
    ...source,
    availableModels: [...(source.availableModels ?? [])],
    instructions: [...(source.instructions ?? [])],
  };
}

function defaultLocalSourceName() {
  return "Localhost Ollama";
}

function normalizeSavedSource(value) {
  return createSourceRecord({
    active: Boolean(value.active),
    address: value.address ?? "",
    id: value.id ?? crypto.randomUUID(),
    kind: value.kind === SOURCE_KIND_LOCAL ? SOURCE_KIND_LOCAL : SOURCE_KIND_SAVED,
    labelCustomized: Boolean(value.labelCustomized),
    model: value.model ?? "",
    name: value.name ?? "Source",
    persisted: true,
    tier: normalizeTier(value.tier),
  });
}

function setScanState(message) {
  scanState.textContent = message;
}

function setDetectedCount(count) {
  if (!scanCountNumber || !scanCountLabel) {
    return;
  }
  scanCountNumber.textContent = String(count);
  scanCountLabel.textContent = "detected";
}

function setAboutState(message) {
  aboutState.textContent = message;
}

function updateHeaderCaption() {
  if (!headerCaption) return;
  const activeOrg = organizations.find((org) => org.id === activeOrganizationId && org.persisted);
  headerCaption.textContent = activeOrg?.name?.trim() || "welcome to orgos";
  if (!headerCaptionSubtitle) return;
  headerCaptionSubtitle.textContent = activeOrg?.createdAt
    ? `Founded in ${new Date(activeOrg.createdAt).getFullYear()}`
    : "";
}

function loadSystemMode() {
  try {
    const stored = localStorage.getItem("orgos.systemMode");
    systemMode = stored === "auto" ? "auto" : "idle";
  } catch {
    systemMode = "idle";
  }
}

function persistSystemMode() {
  try {
    localStorage.setItem("orgos.systemMode", systemMode);
  } catch {
    console.debug("[orgos] could not persist system mode");
  }
}

function renderSystemMode() {
  if (!modeToggle || !modeToggleLabel) {
    return;
  }
  const isAuto = systemMode === "auto";
  modeToggle.classList.toggle("is-auto", isAuto);
  modeToggle.setAttribute("aria-pressed", String(isAuto));
  modeToggle.setAttribute("aria-label", `System ${isAuto ? "auto" : "idle"} mode`);
  modeToggle.title = `System ${isAuto ? "auto" : "idle"} mode`;
  modeToggleLabel.textContent = isAuto ? "auto" : "idle";
}

function formatFoundedLabel(organization) {
  if (!organization?.createdAt) {
    return "";
  }

  const year = new Date(organization.createdAt).getFullYear();
  return Number.isFinite(year) ? `Founded in ${year}` : "";
}

function formatLastActiveLabel(organization) {
  const timestamp =
    organization?.lastActiveAt ||
    organization?.updatedAt ||
    organization?.createdAt ||
    "";
  if (!timestamp) {
    return "last active unknown";
  }

  const value = new Date(timestamp);
  if (Number.isNaN(value.getTime())) {
    return "last active unknown";
  }

  const now = new Date();
  const sameDay =
    value.getFullYear() === now.getFullYear() &&
    value.getMonth() === now.getMonth() &&
    value.getDate() === now.getDate();

  return sameDay
    ? `last active ${value.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
    : `last active ${value.toLocaleDateString([], {
      day: "numeric",
      month: "short",
    }).toUpperCase()}`;
}

function updateDesktopAppAvailability() {
  document.querySelectorAll(".desktop-icon").forEach((icon) => {
    const requiresOrganization = icon.dataset.appScope === "organization";
    const isEnabled = !requiresOrganization || Boolean(activeOrganizationId);
    icon.disabled = !isEnabled;

    if (isEnabled) {
      icon.removeAttribute("data-disabled-reason");
      const activeTitle = icon.getAttribute("aria-label") ?? "";
      icon.title = activeTitle;
      return;
    }

    const reason = "An active organization is required for this application";
    icon.dataset.disabledReason = reason;
    icon.title = reason;
  });
}

function syncSourceDrafts() {
  sourceDrafts = new Map(sourceState.map((source) => [source.id, cloneSource(source)]));
}

function isSourceDirty(source) {
  const baseline = sourceDrafts.get(source.id);
  if (!baseline) {
    return !source.persisted;
  }

  return ["name", "address", "tier", "model", "active"].some(
    (key) => source[key] !== baseline[key],
  );
}

function updateSourceIndicator() {
  const activeSources = sourceState.filter((source) => source.active && source.persisted);
  const count = activeSources.length;

  sourceIndicatorWrap.hidden = false;
  sourceIndicator.classList.toggle("is-active", count > 0);

  if (count > 0) {
    sourceIndicatorCount.hidden = false;
    sourceIndicatorCount.textContent = String(count);
  } else {
    sourceIndicatorCount.hidden = true;
  }
}

function buildSourceTooltipContent() {
  const activeSources = sourceState.filter((source) => source.active && source.persisted);
  sourceTooltip.replaceChildren();

  const title = document.createElement("p");
  title.className = "source-tooltip__title";
  title.textContent = "active sources";
  sourceTooltip.append(title);

  if (activeSources.length === 0) {
    const empty = document.createElement("p");
    empty.className = "source-tooltip__empty";
    empty.textContent = "none connected";
    sourceTooltip.append(empty);
    return;
  }

  const list = document.createElement("ul");
  list.className = "source-tooltip__list";
  for (const source of activeSources) {
    const item = document.createElement("li");
    item.className = "source-tooltip__item";
    const name = document.createElement("span");
    name.className = "source-tooltip__name";
    name.textContent = source.name;
    const model = document.createElement("span");
    model.className = "source-tooltip__model";
    model.textContent = source.model || "no model selected";
    item.append(name, model);
    list.append(item);
  }
  sourceTooltip.append(list);
}

function updateClock() {
  const now = new Date();
  const timeParts = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
  }).formatToParts(now);
  const hour = timeParts.find((part) => part.type === "hour")?.value ?? "--";
  const minute = timeParts.find((part) => part.type === "minute")?.value ?? "--";
  const period = (timeParts.find((part) => part.type === "dayPeriod")?.value ?? "")
    .toUpperCase();

  const dateParts = new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    weekday: "short",
    year: "numeric",
  }).formatToParts(now);
  const weekday = (dateParts.find((part) => part.type === "weekday")?.value ?? "")
    .toUpperCase();
  const month = (dateParts.find((part) => part.type === "month")?.value ?? "")
    .toUpperCase();
  const day = dateParts.find((part) => part.type === "day")?.value ?? "";
  const year = dateParts.find((part) => part.type === "year")?.value ?? "";

  clockTime.textContent = `${hour}:${minute} ${period}`.trim();
  clockDate.textContent = `${weekday}, ${month} ${day}, ${year}`;
}

function startClock() {
  updateClock();
  window.setInterval(updateClock, 1000);
}

function syncFullscreenButtons() {
  const fullscreenActive = Boolean(document.fullscreenElement);
  fullscreenButton.hidden = fullscreenActive;
  windowedButton.hidden = !fullscreenActive;
}

async function requestWakeLock() {
  if (!("wakeLock" in navigator) || !keepAwakeRequested) {
    return;
  }

  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => {
      logEvent("wake-lock-released");
    });
  } catch (error) {
    console.error(error);
    logEvent("wake-lock-failed", { message: String(error) });
  }
}

async function toggleFullscreen() {
  keepAwakeRequested = true;

  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      await requestWakeLock();
      syncFullscreenButtons();
      return;
    }

    await document.exitFullscreen();
    syncFullscreenButtons();
    if (wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
    keepAwakeRequested = false;
  } catch (error) {
    console.error(error);
    logEvent("fullscreen-failed", { message: String(error) });
  }
}

async function handleVisibilityChange() {
  if (document.visibilityState === "visible" && document.fullscreenElement) {
    await requestWakeLock();
  }
}

function defaultDetectedName(source, fallbackIndex) {
  return source.hostname || new URL(source.address).hostname || `source ${fallbackIndex}`;
}

function panelLabel(panelId) {
  return panelId === PANEL_ABOUT ? "About" : "Sources";
}

function panelIconMarkup(panelId) {
  return panelId === PANEL_ABOUT ? ABOUT_ICON_MARKUP : SOURCES_ICON_MARKUP;
}

function pickPreferredModel(models) {
  if (models.includes("gemma4:latest")) {
    return { model: "gemma4:latest", warning: "" };
  }

  if (models.includes("gemma4:e2b")) {
    return { model: "gemma4:e2b", warning: "" };
  }

  const gemma4Variant = models.find((model) => model.startsWith("gemma4:"));
  if (gemma4Variant) {
    return { model: gemma4Variant, warning: "" };
  }

  const gemmaFallback = models.find((model) => model.startsWith("gemma"));
  if (gemmaFallback) {
    return {
      model: gemmaFallback,
      warning:
        "Compatibility cannot be guaranteed because this source does not currently expose a gemma4 model.",
    };
  }

  return {
    model: models[0] ?? "",
    warning:
      models.length > 0
        ? "Compatibility cannot be guaranteed because this source does not currently expose a gemma-family model."
        : "",
  };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`${url} failed: ${response.status}`);
  }

  return response.json();
}

async function loadAppContent() {
  const response = await fetch("/data/content/app.json", {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load app content: ${response.status}`);
  }

  return response.json();
}

function buildSourceMap() {
  return new Map(sourceState.map((source) => [source.address, source]));
}

function sortSources(list) {
  const order = new Map([
    [SOURCE_KIND_LOCAL, 0],
    [SOURCE_KIND_SAVED, 1],
    [SOURCE_KIND_DETECTED, 2],
    [SOURCE_KIND_MANUAL, 3],
  ]);

  return [...list].sort((left, right) => {
    const leftOrder = order.get(left.kind) ?? 99;
    const rightOrder = order.get(right.kind) ?? 99;
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.name.localeCompare(right.name);
  });
}

function ensureSourceSelection() {
  if (selectedSourceId && sourceState.some((source) => source.id === selectedSourceId)) {
    return;
  }

  selectedSourceId = sourceState[0]?.id ?? null;
}

function ensureOrganizationSelection() {
  if (
    selectedOrganizationId &&
    organizations.some((organization) => organization.id === selectedOrganizationId)
  ) {
    return;
  }

  selectedOrganizationId = organizations[0]?.id ?? null;
}

function touchOrganizationRecent(id) {
  organizationRecentIds = [id, ...organizationRecentIds.filter((value) => value !== id)];
}

function getDesktopIcons() {
  return [aboutIcon, sourcesIcon].filter((icon) => icon && !icon.disabled);
}

function updateDesktopNavHighlight() {
  const icons = getDesktopIcons();
  icons.forEach((icon, index) => {
    icon.classList.toggle(
      "is-nav-highlighted",
      keyboardNavigationVisible && navMode === "desktop" && index === desktopNavIndex,
    );
  });
}

function getInactiveOpenPanelIds() {
  return openPanelIds.filter((panelId) => panelId !== activePanelId);
}

function getHeaderNavigablePanelIds() {
  return [...openPanelIds];
}

function isDesktopVisible() {
  return activePanelId === null || showingDesktop;
}

function updateNavigationHighlights() {
  updateDesktopNavHighlight();
  applyTabNavHighlight();
}

function setNavMode(mode) {
  navMode = mode;
  if (mode !== "header") {
    tabNavIndex = -1;
  }
  updateNavigationHighlights();
}

function showKeyboardNavigation() {
  keyboardNavigationVisible = true;
  updateNavigationHighlights();
}

function hideKeyboardNavigation() {
  keyboardNavigationVisible = false;
  updateNavigationHighlights();
}

function findOrganization(id) {
  return organizations.find((organization) => organization.id === id) ?? null;
}

function findSourceById(id) {
  return sourceState.find((source) => source.id === id) ?? null;
}

function sortOrganizations(list) {
  const recentRank = new Map(organizationRecentIds.map((id, index) => [id, index]));
  return [...list].sort((left, right) => {
    if (left.id === activeOrganizationId) return -1;
    if (right.id === activeOrganizationId) return 1;

    const leftRecent = recentRank.get(left.id);
    const rightRecent = recentRank.get(right.id);
    if (leftRecent !== undefined || rightRecent !== undefined) {
      if (leftRecent === undefined) return 1;
      if (rightRecent === undefined) return -1;
      return leftRecent - rightRecent;
    }

    return left.name.localeCompare(right.name);
  });
}

function openConfirmation(options) {
  pendingConfirmation = options;
  confirmModalTitle.textContent = options.title;
  confirmModalBody.textContent = options.body;
  confirmModalConfirm.textContent = options.confirmLabel ?? "delete";
  confirmModal.hidden = false;
  confirmModal.setAttribute("aria-hidden", "false");
}

function closeConfirmation() {
  pendingConfirmation = null;
  confirmModal.hidden = true;
  confirmModal.setAttribute("aria-hidden", "true");
}

function isOrganizationDirty(organization) {
  if (!organization.persisted) {
    return true;
  }

  const baseline = organizationDrafts.get(organization.id);
  if (!baseline) {
    return false;
  }

  return ["name", "industry", "industryCustom", "description"].some(
    (key) => organization[key] !== baseline[key],
  );
}

function normalizeOrganizationNameKey(name) {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

function hasDuplicateOrganizationName(name, excludeId = null) {
  const target = normalizeOrganizationNameKey(name);
  if (!target) {
    return false;
  }

  return organizations.some((organization) =>
    organization.id !== excludeId &&
    normalizeOrganizationNameKey(organization.name) === target
  );
}

function mergeDetectedSources(detectedSources) {
  detectedSourceMap = new Map(detectedSources.map((source) => [source.address, source]));
  const savedSources = sourceState.filter(
    (source) => source.kind === SOURCE_KIND_LOCAL || source.kind === SOURCE_KIND_SAVED,
  );
  const manualSources = sourceState.filter((source) => source.kind === SOURCE_KIND_MANUAL);
  const nextSources = [];
  const savedByAddress = new Map(savedSources.map((source) => [source.address, source]));

  for (const source of savedSources) {
    const detected = detectedSourceMap.get(source.address);
    if (detected) {
      const preferred = pickPreferredModel(detected.models ?? []);
      source.availableModels = detected.models ?? [];
      source.detail = detected.detail ?? source.detail;
      source.hostname = detected.hostname ?? source.hostname;
      source.instructions = [];
      source.note = detected.note || preferred.warning || source.note;
      source.verified = true;
      source.model =
        source.availableModels.includes(source.model) && source.model
          ? source.model
          : preferred.model;
      if (source.kind === SOURCE_KIND_LOCAL) {
        source.active = true;
        if (!source.labelCustomized) {
          source.name = defaultLocalSourceName();
        }
      } else if (!source.labelCustomized) {
        source.name = defaultDetectedName(detected, nextSources.length + 1);
      }
      savedByAddress.delete(source.address);
    }

    if (source.kind === SOURCE_KIND_LOCAL) {
      source.active = true;
      if (!source.labelCustomized) {
        source.name = defaultLocalSourceName();
      }
    }
    nextSources.push(source);
  }

  for (const [address, detected] of detectedSourceMap) {
    if (savedByAddress.has(address)) {
      continue;
    }

    if (savedSources.some((source) => source.address === address)) {
      continue;
    }

    const preferred = pickPreferredModel(detected.models ?? []);
    nextSources.push(
      createSourceRecord({
        active: false,
        address,
        availableModels: detected.models ?? [],
        detail: detected.detail ?? "Detected compatible source.",
        hostname: detected.hostname ?? "",
        id: crypto.randomUUID(),
        instructions: [],
        kind: address === "http://127.0.0.1:11434" ? SOURCE_KIND_LOCAL : SOURCE_KIND_DETECTED,
        labelCustomized: false,
        model: preferred.model,
        name:
          address === "http://127.0.0.1:11434"
            ? defaultLocalSourceName()
            : defaultDetectedName(detected, nextSources.length + 1),
        note: detected.note || preferred.warning,
        persisted: address === "http://127.0.0.1:11434",
        verified: Boolean(detected.available),
      }),
    );
  }

  for (const source of manualSources) {
    nextSources.push(source);
  }

  sourceState = nextSources;
  syncSourceDrafts();
  ensureSourceSelection();
  renderSources();
}

async function loadWorkspaceBootstrap() {
  const payload = await fetchJson("/api/workspace/bootstrap");

  sourceState = (payload.sources ?? []).map(normalizeSavedSource);
  if (!sourceState.some((source) => source.kind === SOURCE_KIND_LOCAL)) {
    sourceState.unshift(
      normalizeSavedSource({
        active: true,
        address: "http://127.0.0.1:11434",
        id: "source-localhost",
        kind: SOURCE_KIND_LOCAL,
        labelCustomized: false,
        model: "",
        name: defaultLocalSourceName(),
        tier: "mid",
      }),
    );
  }

  organizations = (payload.organizations ?? []).map(normalizeOrganization);
  if (organizations.length === 0) {
    organizations = [createDraftOrganization()];
    activeOrganizationId = null;
    setAboutState("Create your first organization");
  } else {
    activeOrganizationId = payload.activeOrganizationId ?? organizations[0].id;
    setAboutState(activeOrganizationId ? "Organization active" : "Ready");
  }

  organizationDrafts = new Map(
    organizations
      .filter((organization) => organization.persisted)
      .map((organization) => [organization.id, { ...organization }]),
  );

  organizationRecentIds = organizations.map((organization) => organization.id);
  if (activeOrganizationId) {
    touchOrganizationRecent(activeOrganizationId);
    organizations = sortOrganizations(organizations);
  }

  ensureSourceSelection();
  ensureOrganizationSelection();
  syncSourceDrafts();
  renderSources();
  renderOrganizations();
}

async function persistSources() {
  const savedSources = sourceState
    .filter(
      (source) =>
        source.kind === SOURCE_KIND_LOCAL ||
        source.kind === SOURCE_KIND_SAVED ||
        (source.kind === SOURCE_KIND_MANUAL && source.persisted),
    )
    .map((source) => ({
      active: source.kind === SOURCE_KIND_LOCAL ? true : Boolean(source.active),
      address: source.address,
      id: source.id,
      kind: source.kind === SOURCE_KIND_LOCAL ? SOURCE_KIND_LOCAL : SOURCE_KIND_SAVED,
      labelCustomized: Boolean(source.labelCustomized),
      model: source.model,
      name:
        source.kind === SOURCE_KIND_LOCAL && !source.labelCustomized
          ? defaultLocalSourceName()
          : source.name,
      tier: source.tier,
    }));

  const payload = await fetchJson("/api/system/sources", {
    body: JSON.stringify({ sources: savedSources }),
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });

  const savedByAddress = new Map(payload.sources.map((source) => [source.address, source]));
  sourceState = sourceState
    .map((source) => {
      const saved = savedByAddress.get(source.address);
      if (!saved) {
        return source;
      }

      return {
        ...source,
        active: Boolean(saved.active),
        id: saved.id,
        kind: saved.kind === SOURCE_KIND_LOCAL ? SOURCE_KIND_LOCAL : SOURCE_KIND_SAVED,
        labelCustomized: Boolean(saved.labelCustomized),
        model: saved.model ?? source.model,
        name: saved.name ?? source.name,
        persisted: true,
        tier: normalizeTier(saved.tier),
      };
    })
    .map((source) => {
      if (source.kind === SOURCE_KIND_LOCAL) {
        source.active = true;
        if (!source.labelCustomized) {
          source.name = defaultLocalSourceName();
        }
      }
      return source;
    });

  syncSourceDrafts();
  renderSources();
}

async function discoverSources() {
  if (discoveryInFlight) {
    return;
  }

  discoveryInFlight = true;
  rescanSourcesButton.classList.add("is-busy");
  rescanSourcesButton.disabled = true;
  rescanSourcesButton.textContent = "rescanning...";
  setScanState("Scanning...");
  scanState.classList.add("is-busy");
  logEvent("discover-sources");

  try {
    const payload = await fetchJson("/api/inference/discover");
    mergeDetectedSources(payload.sources ?? []);
    setDetectedCount(payload.sources?.length ?? 0);
    setScanState("Ready");
  } catch (error) {
    console.error(error);
    setScanState("Scan failed");
  } finally {
    discoveryInFlight = false;
    rescanSourcesButton.classList.remove("is-busy");
    rescanSourcesButton.disabled = false;
    rescanSourcesButton.textContent = "rescan";
    scanState.classList.remove("is-busy");
  }
}

function populateModelSelect(select, source) {
  const currentValue = source.availableModels.includes(source.model)
    ? source.model
    : "";
  select.replaceChildren();

  if (source.availableModels.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "unavailable";
    select.append(option);
    select.value = "";
    select.disabled = true;
    return;
  }

  for (const model of source.availableModels) {
    const option = document.createElement("option");
    option.value = model;
    option.textContent = model;
    select.append(option);
  }

  select.disabled = false;
  select.value = currentValue || source.availableModels[0];
}

async function verifySource(sourceId) {
  const source = sourceState.find((item) => item.id === sourceId);
  if (!source || verifyingSourceIds.has(sourceId)) {
    return;
  }

  verifyingSourceIds.add(sourceId);
  renderSources();

  try {
    const payload = await fetchJson("/api/inference/probe", {
      body: JSON.stringify({ address: source.address }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });

    source.availableModels = payload.models ?? [];
    source.detail = payload.detail ?? "";
    source.hostname = payload.hostname ?? source.hostname;
    source.instructions = payload.instructions ?? [];
    const preferred = pickPreferredModel(source.availableModels);
    source.model =
      source.availableModels.includes(source.model) && source.model
        ? source.model
        : preferred.model;
    source.note = payload.note || preferred.warning;
    source.verified = Boolean(payload.available);
    if (source.verified) {
      source.persisted = true;
      source.kind = source.kind === SOURCE_KIND_LOCAL ? SOURCE_KIND_LOCAL : SOURCE_KIND_SAVED;
      await persistSources();
    } else {
      renderSources();
    }
  } catch (error) {
    console.error(error);
    source.availableModels = [];
    source.detail =
      "orgos could not reach this inference source. Verify the URL and Ollama availability.";
    source.instructions = [
      "Confirm the source URL",
      "Confirm Ollama is running there",
      "Confirm a desired gemma-family model is installed",
    ];
    source.note = "";
    source.verified = false;
    renderSources();
  } finally {
    verifyingSourceIds.delete(sourceId);
    renderSources();
  }
}

async function saveSource(sourceId) {
  let source = sourceState.find((item) => item.id === sourceId);
  if (!source || savingSourceIds.has(sourceId)) {
    return;
  }

  savingSourceIds.add(sourceId);
  renderSources();

  try {
    source.persisted = true;
    source.kind = source.kind === SOURCE_KIND_LOCAL ? SOURCE_KIND_LOCAL : SOURCE_KIND_SAVED;
    await persistSources();
    source = sourceState.find((item) => item.id === sourceId) ?? source;
    await verifySource(source.id);
  } finally {
    savingSourceIds.delete(sourceId);
    syncSourceDrafts();
    renderSources();
  }
}

function discardSourceChanges(sourceId) {
  const baseline = sourceDrafts.get(sourceId);
  if (!baseline) {
    return;
  }

  sourceState = sourceState.map((source) =>
    source.id === sourceId ? cloneSource(baseline) : source
  );
  renderSources();
}

function updateSourceField(sourceId, field, value, options = {}) {
  const { rerender = true, persist = false } = options;
  const source = sourceState.find((item) => item.id === sourceId);
  if (!source) {
    return;
  }

  source[field] = value;
  if (field === "name") {
    source.labelCustomized = value.trim() !== "" && value.trim() !== defaultLocalSourceName();
  }
  if (field === "address") {
    source.verified = false;
    source.availableModels = [];
    source.model = "";
    source.detail = "Save changes to verify this inference source.";
    source.instructions = [];
    source.note = "";
    if (source.kind !== SOURCE_KIND_LOCAL && source.kind !== SOURCE_KIND_SAVED) {
      source.kind = SOURCE_KIND_MANUAL;
    }
  }

  if (persist && source.persisted && field !== "model") {
    void persistSources();
  }

  if (rerender) {
    renderSources();
  }
}

function moveSource(sourceId, direction) {
  const index = sourceState.findIndex((item) => item.id === sourceId);
  if (index === -1) {
    return;
  }

  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= sourceState.length) {
    return;
  }

  const [source] = sourceState.splice(index, 1);
  sourceState.splice(target, 0, source);
  void persistSources();
  renderSources();
}

function deleteSource(sourceId) {
  const source = sourceState.find((item) => item.id === sourceId);
  if (!source || source.kind === SOURCE_KIND_LOCAL) {
    return;
  }

  sourceState = sourceState.filter((item) => item.id !== sourceId);
  ensureSourceSelection();
  if (source.persisted) {
    void persistSources();
  }
  renderSources();
}

function createSourceMenuItem(source, index) {
  const fragment = sourceMenuItemTemplate.content.cloneNode(true);
  const item = fragment.querySelector(".source-menu-item");
  const selectButton = fragment.querySelector('[data-action="select"]');
  const moveUpButton = fragment.querySelector('[data-action="move-up"]');
  const moveDownButton = fragment.querySelector('[data-action="move-down"]');

  item.dataset.sourceId = source.id;
  fragment.querySelector('[data-role="name"]').textContent = source.name;
  fragment.querySelector('[data-role="meta"]').textContent = source.active
    ? `${source.tier} tier, active`
    : `${source.tier} tier, inactive`;

  if (source.id === selectedSourceId) {
    selectButton.classList.add("is-selected");
  }

  moveUpButton.disabled = index === 0;
  moveDownButton.disabled = index === sourceState.length - 1;
  return fragment;
}

function createSourceDetail(source) {
  const fragment = sourceCardTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".source-card");
  const verifyButton = card.querySelector('[data-action="verify"]');
  const deleteButton = card.querySelector('[data-action="delete"]');
  const badge = card.querySelector('[data-role="detail-badge"]');
  const detail = card.querySelector('[data-role="detail"]');
  const toggle = card.querySelector(".source-card__toggle");
  const editActions = card.querySelector('[data-role="source-edit-actions"]');

  card.dataset.sourceId = source.id;
  card.querySelector('[data-field="name"]').value = source.name;
  card.querySelector('[data-field="address"]').value = source.address;
  card.querySelector('[data-field="tier"]').value = source.tier;
  card.querySelector('[data-field="active"]').checked = source.active;
  card.querySelector('[data-role="status"]').textContent = source.verified
    ? "Connected"
    : "Disconnected";
  if (source.verified && source.persisted) {
    badge.hidden = false;
    badge.textContent = "verified";
    badge.classList.add("source-badge--verified");
    verifyButton.hidden = true;
  } else if (source.kind === SOURCE_KIND_DETECTED) {
    badge.hidden = false;
    badge.textContent = "detected";
    badge.classList.remove("source-badge--verified");
    verifyButton.hidden = false;
  } else {
    badge.hidden = true;
    verifyButton.hidden = false;
  }
  detail.textContent = source.detail;

  const instructions = card.querySelector('[data-role="instructions"]');
  instructions.replaceChildren();
  for (const value of source.instructions) {
    const item = document.createElement("li");
    item.textContent = value;
    instructions.append(item);
  }

  populateModelSelect(card.querySelector('[data-field="model"]'), source);
  verifyButton.disabled = verifyingSourceIds.has(source.id);
  verifyButton.textContent = verifyingSourceIds.has(source.id) ? "verifying..." : "verify";
  verifyButton.classList.toggle("is-busy", verifyingSourceIds.has(source.id));
  card.classList.toggle("is-busy", verifyingSourceIds.has(source.id));
  detail.classList.toggle("is-busy", verifyingSourceIds.has(source.id));
  toggle.classList.toggle("is-busy", verifyingSourceIds.has(source.id));
  deleteButton.hidden = source.kind === SOURCE_KIND_LOCAL;
  renderSourceEditActions(editActions, source);

  return fragment;
}

function renderSourceEditActions(target, source) {
  if (!target) {
    return;
  }

  target.replaceChildren();
  if (!isSourceDirty(source)) {
    return;
  }

  const discardButton = document.createElement("button");
  discardButton.className = "chrome-button source-card__button";
  discardButton.dataset.action = "discard-source";
  discardButton.type = "button";
  discardButton.textContent = "discard";
  discardButton.disabled = savingSourceIds.has(source.id) || verifyingSourceIds.has(source.id);
  target.append(discardButton);

  const saveButton = document.createElement("button");
  saveButton.className = "chrome-button source-card__button";
  saveButton.dataset.action = "save-source";
  saveButton.type = "button";
  const isBusy = savingSourceIds.has(source.id);
  saveButton.textContent = isBusy ? "saving..." : "save";
  saveButton.disabled = isBusy || verifyingSourceIds.has(source.id);
  saveButton.classList.toggle("is-busy", isBusy);
  target.append(saveButton);
}

function renderSources() {
  ensureSourceSelection();
  sourceMenu.replaceChildren();
  sourceState.forEach((source, index) => {
    sourceMenu.append(createSourceMenuItem(source, index));
  });
  sourceMenu.append(addSourceButton.parentElement);

  sourceDetail.replaceChildren();
  const selected = sourceState.find((source) => source.id === selectedSourceId);
  if (selected) {
    sourceDetail.append(createSourceDetail(selected));
  }
  updateSourceIndicator();
}

function createOrganizationMenuItem(organization) {
  const fragment = organizationMenuItemTemplate.content.cloneNode(true);
  const item = fragment.querySelector(".source-menu-item");
  const selectButton = fragment.querySelector('[data-action="select"]');
  item.dataset.organizationId = organization.id;
  fragment.querySelector('[data-role="name"]').textContent =
    organization.name || "new organization";
  if (!organization.persisted) {
    fragment.querySelector('[data-role="meta"]').textContent = "draft";
  } else if (organization.id === activeOrganizationId) {
    fragment.querySelector('[data-role="meta"]').textContent = "active";
  } else {
    fragment.querySelector('[data-role="meta"]').textContent = formatLastActiveLabel(organization);
  }

  if (organization.id === selectedOrganizationId) {
    selectButton.classList.add("is-selected");
  }

  return fragment;
}

function renderOrganizationAction(target, organization) {
  target.replaceChildren();
  const hasDuplicateName = hasDuplicateOrganizationName(organization.name, organization.id);
  const hasValidName = Boolean(organization.name.trim());

  if (isOrganizationDirty(organization) || !organization.persisted) {
    const button = document.createElement("button");
    button.className = "chrome-button source-card__button";
    button.dataset.action = "save-organization";
    button.type = "button";
    const isBusy = savingOrganizationId === organization.id;
    button.textContent = isBusy ? "saving..." : "save";
    button.disabled = isBusy || loadingOrganizationId !== null || !hasValidName || hasDuplicateName;
    button.classList.toggle("is-busy", isBusy);
    target.append(button);
    return;
  }

  if (organization.id === activeOrganizationId) {
    const badge = document.createElement("span");
    badge.className = "source-badge source-badge--verified";
    badge.textContent = "active";
    target.append(badge);
    return;
  }

  const button = document.createElement("button");
  button.className = "chrome-button source-card__button";
  button.dataset.action = "load-organization";
  button.type = "button";
  const isBusy = loadingOrganizationId === organization.id;
  button.textContent = isBusy ? "loading..." : "load";
  button.disabled = isBusy || savingOrganizationId !== null;
  button.classList.toggle("is-busy", isBusy);
  target.append(button);
}

function createOrganizationDetail(organization) {
  const fragment = organizationCardTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".source-card");
  const deleteButton = card.querySelector('[data-action="delete-organization"]');
  const nameField = card.querySelector('[data-field="name"]');
  card.dataset.organizationId = organization.id;

  nameField.value = organization.name;
  card.querySelector('[data-field="industry"]').value = organization.industry;
  card.querySelector('[data-field="industryCustom"]').value = organization.industryCustom;
  card.querySelector('[data-field="description"]').value = organization.description;

  const founded = card.querySelector('[data-role="founded"]');
  founded.textContent = formatFoundedLabel(organization);
  founded.hidden = !founded.textContent;

  const customField = card.querySelector('[data-role="industry-custom-field"]');
  customField.hidden = organization.industry !== "custom";
  deleteButton.textContent = organization.persisted ? "delete" : "cancel";
  nameField.setCustomValidity(
    hasDuplicateOrganizationName(organization.name, organization.id)
      ? "Organization name already in use"
      : "",
  );

  renderOrganizationAction(card.querySelector('[data-role="org-action"]'), organization);
  return fragment;
}

function refreshOrganizationDetailCard(card, organization) {
  if (!card || !organization) {
    return;
  }

  const founded = card.querySelector('[data-role="founded"]');
  const customField = card.querySelector('[data-role="industry-custom-field"]');
  const deleteButton = card.querySelector('[data-action="delete-organization"]');
  const nameField = card.querySelector('[data-field="name"]');

  founded.textContent = formatFoundedLabel(organization);
  founded.hidden = !founded.textContent;
  customField.hidden = organization.industry !== "custom";
  deleteButton.textContent = organization.persisted ? "delete" : "cancel";
  nameField.setCustomValidity(
    hasDuplicateOrganizationName(organization.name, organization.id)
      ? "Organization name already in use"
      : "",
  );
  renderOrganizationAction(card.querySelector('[data-role="org-action"]'), organization);
}

function renderOrganizations() {
  organizations = sortOrganizations(organizations);
  ensureOrganizationSelection();
  organizationMenu.replaceChildren();
  organizations.forEach((organization) => {
    organizationMenu.append(createOrganizationMenuItem(organization));
  });
  organizationMenu.append(addOrganizationButton.parentElement);

  organizationDetail.replaceChildren();
  const selected = findOrganization(selectedOrganizationId);
  if (selected) {
    organizationDetail.append(createOrganizationDetail(selected));
  }
  updateHeaderCaption();
  updateDesktopAppAvailability();
}

async function saveOrganization(organizationId) {
  const organization = findOrganization(organizationId);
  if (!organization) {
    return;
  }
  if (hasDuplicateOrganizationName(organization.name, organization.id)) {
    setAboutState("Organization name already in use");
    renderOrganizations();
    return;
  }
  const wasPersisted = organization.persisted;

  savingOrganizationId = organizationId;
  setAboutState("Saving organization...");
  aboutState.classList.add("is-busy");
  renderOrganizations();

  try {
    const organizationsState = await fetchJson("/api/organizations/save", {
      body: JSON.stringify({
        activate: !wasPersisted,
        organization: {
          id: organization.persisted ? organization.id : undefined,
          description: organization.description,
          industry: organization.industry,
          industryCustom: organization.industryCustom,
          name: organization.name,
        },
      }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });

    organizations = organizationsState.organizations.map(normalizeOrganization);
    activeOrganizationId = organizationsState.activeOrganizationId;
    organizationDrafts = new Map(
      organizations.map((entry) => [entry.id, { ...entry }]),
    );
    const match =
      organizations.find((entry) => entry.id === organization.id) ??
      organizations.find((entry) => entry.name === organization.name);
    if (match) {
      selectedOrganizationId = match.id;
      touchOrganizationRecent(match.id);
    }
    organizations = sortOrganizations(organizations);
    openPanel(PANEL_ABOUT);
    setAboutState("Organization saved");
  } catch (error) {
    console.error(error);
    if (String(error).includes("409")) {
      setAboutState("Organization name already in use");
    } else {
      setAboutState("Organization save failed");
    }
  } finally {
    savingOrganizationId = null;
    aboutState.classList.remove("is-busy");
    renderOrganizations();
  }
}

async function loadOrganization(organizationId) {
  loadingOrganizationId = organizationId;
  setAboutState("Loading organization...");
  aboutState.classList.add("is-busy");
  renderOrganizations();

  try {
    const organizationsState = await fetchJson("/api/organizations/activate", {
      body: JSON.stringify({ id: organizationId }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });

    organizations = organizationsState.organizations.map(normalizeOrganization);
    activeOrganizationId = organizationsState.activeOrganizationId;
    touchOrganizationRecent(organizationId);
    organizations = sortOrganizations(organizations);
    organizationDrafts = new Map(
      organizations.map((entry) => [entry.id, { ...entry }]),
    );
    selectedOrganizationId = organizationId;
    openPanel(PANEL_ABOUT);
    setAboutState("Organization active");
  } finally {
    loadingOrganizationId = null;
    aboutState.classList.remove("is-busy");
    renderOrganizations();
  }
}

async function deleteOrganization(organizationId) {
  const deletedWasActive = organizationId === activeOrganizationId;
  const organizationsState = await fetchJson("/api/organizations/delete", {
    body: JSON.stringify({ id: organizationId }),
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });

  organizations = organizationsState.organizations.map(normalizeOrganization);
  activeOrganizationId = organizationsState.activeOrganizationId;
  organizationDrafts = new Map(
    organizations.map((entry) => [entry.id, { ...entry }]),
  );
  organizationRecentIds = organizationRecentIds.filter((id) => id !== organizationId);

  if (activeOrganizationId) {
    touchOrganizationRecent(activeOrganizationId);
    organizations = sortOrganizations(organizations);
    const selectedExists = organizations.some((organization) => organization.id === selectedOrganizationId);
    selectedOrganizationId = selectedExists ? selectedOrganizationId : activeOrganizationId;
    setAboutState("Organization deleted");
    openPanel(PANEL_ABOUT);
  } else if (organizations.length > 0) {
    organizations = sortOrganizations(organizations);
    selectedOrganizationId = organizations[0].id;
    setAboutState("Welcome to orgos");
    if (deletedWasActive) {
      openPanel(PANEL_ABOUT);
      showingDesktop = false;
    }
  } else {
    const draft = createDraftOrganization();
    organizations = [draft];
    selectedOrganizationId = draft.id;
    activeOrganizationId = null;
    organizationRecentIds = [draft.id];
    setAboutState("Create your first organization");
    if (deletedWasActive) {
      openPanel(PANEL_ABOUT);
      showingDesktop = false;
    }
  }

  renderOrganizations();
}

function cancelDraftOrganization(organizationId) {
  organizations = organizations.filter((organization) => organization.id !== organizationId);
  organizationRecentIds = organizationRecentIds.filter((id) => id !== organizationId);

  if (organizations.length === 0) {
    const draft = createDraftOrganization();
    organizations = [draft];
    selectedOrganizationId = draft.id;
    activeOrganizationId = null;
    organizationRecentIds = [draft.id];
    setAboutState("Create your first organization");
  } else {
    const nextSelection = organizations.find((organization) => organization.id === activeOrganizationId)
      ?? organizations[0];
    selectedOrganizationId = nextSelection?.id ?? null;
    setAboutState(activeOrganizationId ? "Organization active" : "Ready");
  }

  renderOrganizations();
}

function openPanel(panelId) {
  tabNavIndex = -1;
  openPanelIds = [panelId, ...openPanelIds.filter((item) => item !== panelId)];
  activePanelId = panelId;
  showingDesktop = false;
  renderPanels();
}

function closePanel(panelId) {
  tabNavIndex = -1;
  openPanelIds = openPanelIds.filter((item) => item !== panelId);
  if (activePanelId === panelId) {
    activePanelId = openPanelIds.at(-1) ?? null;
  }
  if (openPanelIds.length === 0) {
    showingDesktop = false;
  }
  renderPanels();
}

function renderPanels() {
  panelHeaderBar.hidden = openPanelIds.length === 0;
  panelRegion.hidden = activePanelId === null || showingDesktop;
  desktopArea.hidden = !isDesktopVisible();
  aboutPanel.hidden = activePanelId !== PANEL_ABOUT || showingDesktop;
  sourcesPanel.hidden = activePanelId !== PANEL_SOURCES || showingDesktop;
  workspaceArea.classList.toggle("has-open-panels", openPanelIds.length > 0);

  headerTabs.replaceChildren();
  const tabCount = openPanelIds.length || 1;
  headerTabs.style.setProperty("--tab-count", String(tabCount));
  for (const panelId of openPanelIds) {
    const fragment = headerTabTemplate.content.cloneNode(true);
    const tab = fragment.querySelector(".header-tab");
    const activateButton = fragment.querySelector('[data-action="activate-tab"]');
    const closeButton = fragment.querySelector('[data-action="close-tab"]');

    tab.dataset.panelId = panelId;
    activateButton.dataset.panelId = panelId;
    closeButton.dataset.panelId = panelId;
    fragment.querySelector('[data-role="label"]').textContent = panelLabel(panelId);
    fragment.querySelector('[data-role="icon"]').innerHTML = panelIconMarkup(panelId);
    if (panelId === activePanelId && !showingDesktop) {
      tab.classList.add("is-active");
    }
    headerTabs.append(fragment);
  }

  window.cancelAnimationFrame(tabLayoutFrame);
  tabLayoutFrame = window.requestAnimationFrame(() => {
    applyTabWidths();
    updateTabScrollButtons();
    updateNavigationHighlights();
  });
}

function applyTabWidths() {
  const tabs = headerTabs.querySelectorAll(".header-tab");
  if (tabs.length === 0) return;

  headerTabs.style.removeProperty("display");
  headerTabs.style.removeProperty("grid-template-columns");
  headerTabs.style.removeProperty("width");
  for (const tab of tabs) {
    tab.style.removeProperty("flex");
  }

  const available = headerTabsViewport.clientWidth;
  if (available === 0) return;
  const minTabWidth = 176;
  const needsOverflow = tabs.length > 2 && available / tabs.length < minTabWidth;
  headerTabs.classList.toggle("is-overflowing", needsOverflow);
}

function updateTabScrollButtons() {
  if (openPanelIds.length <= 2) {
    tabScrollLeftButton.hidden = true;
    tabScrollRightButton.hidden = true;
    tabScrollLeftButton.disabled = true;
    tabScrollRightButton.disabled = true;
    return;
  }

  const hasOverflow =
    headerTabsViewport.scrollWidth > headerTabsViewport.clientWidth + 4;
  const atStart = headerTabsViewport.scrollLeft <= 4;
  const atEnd =
    headerTabsViewport.scrollLeft + headerTabsViewport.clientWidth >=
    headerTabsViewport.scrollWidth - 4;

  tabScrollLeftButton.hidden = !hasOverflow;
  tabScrollRightButton.hidden = !hasOverflow;
  tabScrollLeftButton.disabled = !hasOverflow || atStart;
  tabScrollRightButton.disabled = !hasOverflow || atEnd;
}

function scrollTabs(direction) {
  const step = Math.max(headerTabsViewport.clientWidth * 0.72, 180);
  headerTabsViewport.scrollBy({
    behavior: "smooth",
    left: direction === "left" ? -step : step,
  });
}

function connectLiveReload() {
  const source = new EventSource("/__live");
  source.addEventListener("reload", () => {
    window.location.reload();
  });
  source.onerror = () => {
    source.close();
    window.setTimeout(connectLiveReload, 1000);
  };
}

fullscreenButton.addEventListener("click", async () => {
  await toggleFullscreen();
});

windowedButton.addEventListener("click", async () => {
  await toggleFullscreen();
});

modeToggle?.addEventListener("click", () => {
  systemMode = systemMode === "auto" ? "idle" : "auto";
  persistSystemMode();
  renderSystemMode();
});

document.addEventListener("fullscreenchange", async () => {
  syncFullscreenButtons();
  if (document.fullscreenElement) {
    await requestWakeLock();
    return;
  }
  if (wakeLock) {
    await wakeLock.release();
    wakeLock = null;
  }
});

document.addEventListener("visibilitychange", async () => {
  await handleVisibilityChange();
});

desktopHome.addEventListener("click", () => {
  if (openPanelIds.length === 0) {
    activePanelId = null;
    showingDesktop = false;
  } else {
    showingDesktop = true;
  }
  renderPanels();
});

aboutIcon.addEventListener("click", () => {
  openPanel(PANEL_ABOUT);
});

sourcesIcon.addEventListener("click", () => {
  openPanel(PANEL_SOURCES);
});

headerCaption.addEventListener("click", () => {
  openPanel(PANEL_ABOUT);
});

sourceIndicator.addEventListener("click", () => {
  openPanel(PANEL_SOURCES);
});

headerTabs.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const panelId = button.dataset.panelId;
  if (!panelId) {
    return;
  }

  if (button.dataset.action === "close-tab") {
    closePanel(panelId);
    return;
  }

  showingDesktop = false;
  openPanel(panelId);
});

tabScrollLeftButton.addEventListener("click", () => {
  scrollTabs("left");
});

tabScrollRightButton.addEventListener("click", () => {
  scrollTabs("right");
});

headerTabsViewport.addEventListener("scroll", () => {
  updateTabScrollButtons();
});

window.addEventListener("resize", () => {
  applyTabWidths();
  updateTabScrollButtons();
});

function isTextInput(element) {
  if (!element) return false;
  const tag = element.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (element.isContentEditable) return true;
  return false;
}

function clearTabNavHighlight() {
  setNavMode("desktop");
}

function applyTabNavHighlight() {
  headerTabs.querySelectorAll(".is-nav-highlighted").forEach((tab) => {
    tab.classList.remove("is-nav-highlighted");
  });
  if (!keyboardNavigationVisible || navMode !== "header") {
    return;
  }
  const headerPanelIds = getHeaderNavigablePanelIds();
  const targetPanelId = headerPanelIds[tabNavIndex];
  const tab = [...headerTabs.querySelectorAll(".header-tab")].find(
    (item) => item.dataset.panelId === targetPanelId,
  );
  if (tab) {
    tab.classList.add("is-nav-highlighted");
  }
}

document.addEventListener("keydown", (event) => {
  if (isTextInput(event.target) || isTextInput(document.activeElement)) return;
  const icons = getDesktopIcons();
  const headerPanelIds = getHeaderNavigablePanelIds();
  const desktopVisible = isDesktopVisible();

  if (event.key === " " || event.code === "Space") {
    event.preventDefault();
    hideKeyboardNavigation();
    setNavMode("desktop");
    if (openPanelIds.length === 0) {
      showingDesktop = true;
      activePanelId = null;
    } else {
      showingDesktop = !showingDesktop;
    }
    renderPanels();
    return;
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    const delta = event.key === "ArrowRight" ? 1 : -1;
    showKeyboardNavigation();
    if (navMode === "desktop") {
      if (icons.length < 2 || !desktopVisible) return;
      event.preventDefault();
      desktopNavIndex = (desktopNavIndex + delta + icons.length) % icons.length;
      updateNavigationHighlights();
      return;
    }

    if (navMode === "header") {
      if (headerPanelIds.length < 2) return;
      event.preventDefault();
      tabNavIndex = (tabNavIndex + delta + headerPanelIds.length) % headerPanelIds.length;
      updateNavigationHighlights();
    }
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    const wasKeyboardNavigationVisible = keyboardNavigationVisible;
    showKeyboardNavigation();
    if (navMode === "desktop") {
      if (desktopVisible && !wasKeyboardNavigationVisible) {
        updateNavigationHighlights();
        return;
      }
      if (!desktopVisible) {
        return;
      }
      const panelId = desktopNavIndex === 0 ? PANEL_ABOUT : PANEL_SOURCES;
      openPanel(panelId);
      setNavMode("desktop");
      return;
    }

    if (navMode === "header") {
      const targetPanelId = headerPanelIds[tabNavIndex];
      if (targetPanelId) {
        openPanel(targetPanelId);
        setNavMode("desktop");
      }
    }
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    showKeyboardNavigation();
    if (navMode === "desktop" && headerPanelIds.length > 0) {
      tabNavIndex = desktopVisible
        ? 0
        : Math.max(0, headerPanelIds.indexOf(activePanelId ?? headerPanelIds[0]));
      setNavMode("header");
      headerTabsViewport.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    if (navMode === "header") {
      setNavMode("desktop");
    }
    return;
  }

  if (event.key === "Escape") {
    hideKeyboardNavigation();
    setNavMode("desktop");
  }
});

sourceIndicator.addEventListener("mouseenter", () => {
  buildSourceTooltipContent();
  sourceTooltip.hidden = false;
});

sourceIndicator.addEventListener("mouseleave", () => {
  sourceTooltip.hidden = true;
});

sourceIndicator.addEventListener("touchstart", (event) => {
  event.preventDefault();
  buildSourceTooltipContent();
  sourceTooltip.hidden = !sourceTooltip.hidden;
});

document.addEventListener("click", (event) => {
  if (!sourceIndicatorWrap.contains(event.target)) {
    sourceTooltip.hidden = true;
  }
  hideKeyboardNavigation();
});

rescanSourcesButton.addEventListener("click", () => {
  void discoverSources();
});

addSourceButton.addEventListener("click", () => {
  const source = createSourceRecord({
    detail: "Configure an additional Ollama source and verify it.",
    kind: SOURCE_KIND_MANUAL,
    name: `Source ${sourceState.length + 1}`,
  });
  sourceState.push(source);
  selectedSourceId = source.id;
  renderSources();
});

addOrganizationButton.addEventListener("click", () => {
  const organization = createDraftOrganization();
  organizations.push(organization);
  selectedOrganizationId = organization.id;
  touchOrganizationRecent(organization.id);
  renderOrganizations();
  setAboutState("Draft organization");
});

sourceMenu.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) {
    return;
  }

  const item = target.closest(".source-menu-item");
  if (!item) {
    return;
  }

  const sourceId = item.dataset.sourceId;
  const action = target.dataset.action;
  if (!sourceId || !action) {
    return;
  }

  if (action === "select") {
    selectedSourceId = sourceId;
    renderSources();
    return;
  }

  if (action === "move-up") {
    moveSource(sourceId, "up");
    return;
  }

  if (action === "move-down") {
    moveSource(sourceId, "down");
  }
});

sourceDetail.addEventListener("input", (event) => {
  const target = event.target;
  const card = target.closest(".source-card");
  if (!card) {
    return;
  }

  const sourceId = card.dataset.sourceId;
  const field = target.dataset.field;
  if (!sourceId || !field || target.type === "checkbox" || target.tagName === "SELECT") {
    return;
  }

  updateSourceField(sourceId, field, target.value, { persist: false, rerender: false });
  renderSourceEditActions(card.querySelector('[data-role="source-edit-actions"]'), findSourceById(sourceId));
});

sourceDetail.addEventListener("mousedown", (event) => {
  const target = event.target.closest("button");
  if (!target) {
    return;
  }

  const action = target.dataset.action;
  if (!action) {
    return;
  }

  if (
    action === "save-source" ||
    action === "discard-source" ||
    action === "verify" ||
    action === "delete"
  ) {
    // Keep focus on the current field so blur/change handlers do not
    // mutate the card before the button click is processed.
    event.preventDefault();
  }
});

sourceDetail.addEventListener("change", (event) => {
  const target = event.target;
  const card = target.closest(".source-card");
  if (!card) {
    return;
  }

  const sourceId = card.dataset.sourceId;
  const field = target.dataset.field;
  if (!sourceId || !field) {
    return;
  }

  if (target.type === "checkbox") {
    updateSourceField(sourceId, field, target.checked, { persist: false, rerender: false });
    renderSourceEditActions(card.querySelector('[data-role="source-edit-actions"]'), findSourceById(sourceId));
    return;
  }

  updateSourceField(sourceId, field, target.value, { persist: false, rerender: false });
  if (target.tagName === "SELECT") {
    renderSourceEditActions(card.querySelector('[data-role="source-edit-actions"]'), findSourceById(sourceId));
  }
});

sourceDetail.addEventListener("click", async (event) => {
  const target = event.target.closest("button");
  if (!target) {
    return;
  }

  const card = target.closest(".source-card");
  if (!card) {
    return;
  }

  const sourceId = card.dataset.sourceId;
  const action = target.dataset.action;
  if (!sourceId || !action) {
    return;
  }

  if (action === "verify") {
    await verifySource(sourceId);
    return;
  }

  if (action === "save-source") {
    await saveSource(sourceId);
    return;
  }

  if (action === "discard-source") {
    discardSourceChanges(sourceId);
    return;
  }

  if (action === "delete") {
    deleteSource(sourceId);
  }
});

organizationMenu.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="select"]');
  if (!button) {
    return;
  }

  const item = button.closest(".source-menu-item");
  if (!item) {
    return;
  }

  selectedOrganizationId = item.dataset.organizationId;
  touchOrganizationRecent(selectedOrganizationId);
  renderOrganizations();
});

organizationDetail.addEventListener("input", (event) => {
  const target = event.target;
  const card = target.closest(".source-card");
  if (!card) {
    return;
  }

  const organization = findOrganization(card.dataset.organizationId);
  const field = target.dataset.field;
  if (!organization || !field) {
    return;
  }

  organization[field] = target.value;
  refreshOrganizationDetailCard(card, organization);
});

organizationDetail.addEventListener("change", (event) => {
  const target = event.target;
  const card = target.closest(".source-card");
  if (!card) {
    return;
  }

  const organization = findOrganization(card.dataset.organizationId);
  const field = target.dataset.field;
  if (!organization || !field) {
    return;
  }

  organization[field] = target.value;
  if (field === "industry") {
    refreshOrganizationDetailCard(card, organization);
  }
});

organizationDetail.addEventListener("click", async (event) => {
  const target = event.target.closest("button");
  if (!target) {
    return;
  }

  const card = target.closest(".source-card");
  if (!card) {
    return;
  }

  const organizationId = card.dataset.organizationId;
  const action = target.dataset.action;
  if (!organizationId || !action) {
    return;
  }

  if (action === "save-organization") {
    await saveOrganization(organizationId);
    return;
  }

  if (action === "load-organization") {
    await loadOrganization(organizationId);
    return;
  }

  if (action === "delete-organization") {
    const organization = findOrganization(organizationId);
    if (!organization) {
      return;
    }

    if (!organization.persisted) {
      cancelDraftOrganization(organizationId);
      return;
    }

    openConfirmation({
      body: "This permanently deletes the organization and its stored orgos data. This action cannot be undone.",
      confirmLabel: "delete",
      onConfirm: async () => {
        await deleteOrganization(organizationId);
      },
      title: "Delete organization?",
    });
  }
});

confirmModal.addEventListener("click", async (event) => {
  const target = event.target.closest("button, [data-action=\"cancel-modal\"]");
  if (!target) {
    return;
  }

  const action = target.dataset.action;
  if (action === "cancel-modal") {
    closeConfirmation();
    return;
  }

  if (action === "confirm-modal" && pendingConfirmation) {
    const { onConfirm } = pendingConfirmation;
    closeConfirmation();
    await onConfirm();
  }
});

async function initialize() {
  loadSystemMode();
  renderSystemMode();
  try {
    const appContent = await loadAppContent();
    titleElement.textContent = (appContent.title ?? "orgos").replaceAll(/\s+/g, " ");
  } catch (error) {
    console.error(error);
    titleElement.textContent = "orgos";
  }

  await loadWorkspaceBootstrap();
  setDetectedCount(sourceState.length);
  updateNavigationHighlights();
  const hasSavedOrg = activeOrganizationId !== null &&
    organizations.some((org) => org.persisted && org.id === activeOrganizationId);
  if (!hasSavedOrg) {
    openPanel(PANEL_ABOUT);
  }
  await discoverSources();
}

startClock();
syncFullscreenButtons();
void initialize();
connectLiveReload();
