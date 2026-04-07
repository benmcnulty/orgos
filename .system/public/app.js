const PANEL_ABOUT = "about";
const PANEL_STATUS = "status";
const PANEL_SOURCES = "sources";
const PANEL_COLOR = "color";
const PANEL_FILES = "files";
const PANEL_TEXT = "text";
const PANEL_WEB = "web";
const PANEL_AGENTS = "agents";
const PANEL_SKILLS = "skills";
const PANEL_TOOLS = "tools";
const PANEL_SCHEDULE = "schedule";
const PANEL_MEET = "meet";
const PANEL_MAIL = "mail";
const PANEL_QUEUE = "queue";
const PANEL_HIRE = "hire";
const PANEL_PROJECTS = "projects";
const PANEL_EVALS = "evals";
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
const statusIcon = document.querySelector("#status-icon");
const statusLaunch = document.querySelector("#status-launch");
const sourcesIcon = document.querySelector("#sources-icon");
const colorIcon = document.querySelector("#color-icon");
const filesIcon = document.querySelector("#files-icon");
const textIcon = document.querySelector("#text-icon");
const webIcon = document.querySelector("#web-icon");
const agentsIcon = document.querySelector("#agents-icon");
const skillsIcon = document.querySelector("#skills-icon");
const toolsIcon = document.querySelector("#tools-icon");
const scheduleIcon = document.querySelector("#schedule-icon");
const meetIcon = document.querySelector("#meet-icon");
const mailIcon = document.querySelector("#mail-icon");
const queueIcon = document.querySelector("#queue-icon");
const hireIcon = document.querySelector("#hire-icon");
const projectsIcon = document.querySelector("#projects-icon");
const evalsIcon = document.querySelector("#evals-icon");
const panelHeaderBar = document.querySelector("#panel-header-bar");
const headerTabActiveSlot = document.querySelector("#header-tab-active-slot");
const headerTabs = document.querySelector("#header-tabs");
const headerTabsViewport = document.querySelector("#header-tabs-viewport");
const tabScrollLeftButton = document.querySelector("#tab-scroll-left");
const tabScrollRightButton = document.querySelector("#tab-scroll-right");
const workspaceArea = document.querySelector(".workspace-area");
const desktopArea = document.querySelector("#desktop-area");
const panelRegion = document.querySelector("#panel-region");
const aboutPanel = document.querySelector("#about-panel");
const statusPanel = document.querySelector("#status-panel");
const sourcesPanel = document.querySelector("#sources-panel");
const colorPanel = document.querySelector("#color-panel");
const filesPanel = document.querySelector("#files-panel");
const textPanel = document.querySelector("#text-panel");
const webPanel = document.querySelector("#web-panel");
const agentsPanel = document.querySelector("#agents-panel");
const skillsPanel = document.querySelector("#skills-panel");
const toolsPanel = document.querySelector("#tools-panel");
const schedulePanel = document.querySelector("#schedule-panel");
const meetPanel = document.querySelector("#meet-panel");
const mailPanel = document.querySelector("#mail-panel");
const queuePanel = document.querySelector("#queue-panel");
const hirePanel = document.querySelector("#hire-panel");
const projectsPanel = document.querySelector("#projects-panel");
const evalsPanel = document.querySelector("#evals-panel");
const agentMenu = document.querySelector("#agent-menu");
const agentDetail = document.querySelector("#agent-detail");
const skillMenu = document.querySelector("#skill-menu");
const skillDetail = document.querySelector("#skill-detail");
const toolRegistry = document.querySelector("#tool-registry");
const scheduleList = document.querySelector("#schedule-list");
const meetingMenu = document.querySelector("#meeting-menu");
const meetDetail = document.querySelector("#meet-detail");
const mailFolderMenu = document.querySelector("#mail-folder-menu");
const mailDetail = document.querySelector("#mail-detail");
const queueMetrics = document.querySelector("#queue-metrics");
const queueNodes = document.querySelector("#queue-nodes");
const queueItems = document.querySelector("#queue-items");
const queueEnqueueButton = document.querySelector("#queue-enqueue-button");
const queueEnqueueForm = document.querySelector("#queue-enqueue-form");
const queueEnqueueAgent = document.querySelector("#queue-enqueue-agent");
const queueEnqueuePriority = document.querySelector("#queue-enqueue-priority");
const queueEnqueueTask = document.querySelector("#queue-enqueue-task");
const queueEnqueueSubmit = document.querySelector("#queue-enqueue-submit");
const queueEnqueueCancel = document.querySelector("#queue-enqueue-cancel");
const scheduleDetail = document.querySelector("#schedule-detail");
const hireMenu = document.querySelector("#hire-menu");
const hireDetail = document.querySelector("#hire-detail");
const projectsMenu = document.querySelector("#projects-menu");
const projectsDetail = document.querySelector("#projects-detail");
const evalsMenu = document.querySelector("#evals-menu");
const evalsDetail = document.querySelector("#evals-detail");
const agentsState = document.querySelector("#agents-state");
const statusState = document.querySelector("#status-state");
const skillsState = document.querySelector("#skills-state");
const toolsState = document.querySelector("#tools-state");
const scheduleState = document.querySelector("#schedule-state");
const meetState = document.querySelector("#meet-state");
const mailState = document.querySelector("#mail-state");
const queueStateLabel = document.querySelector("#queue-state");
const hireStateLabel = document.querySelector("#hire-state");
const projectsStateLabel = document.querySelector("#projects-state");
const evalsStateLabel = document.querySelector("#evals-state");
const addAgentButton = document.querySelector("#add-agent");
const addScheduleTaskButton = document.querySelector("#add-schedule-task");
const createMeetingButton = document.querySelector("#create-meeting");
const addHireDepartmentButton = document.querySelector("#add-hire-department");
const addHireTeamButton = document.querySelector("#add-hire-team");
const addHireRoleButton = document.querySelector("#add-hire-role");
const addProjectButton = document.querySelector("#add-project");
const addEvalButton = document.querySelector("#add-eval");
const rescanSourcesButton = document.querySelector("#rescan-sources");
const scanState = document.querySelector("#scan-state");
const colorState = document.querySelector("#color-state");
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
const notificationIndicatorWrap = document.querySelector("#notification-indicator-wrap");
const notificationIndicator = document.querySelector("#notification-indicator");
const notificationIndicatorCount = document.querySelector("#notification-indicator-count");
const notificationPopover = document.querySelector("#notification-popover");
const notificationPopoverList = document.querySelector("#notification-popover-list");
const notificationSummary = document.querySelector("#notification-summary");
const confirmModal = document.querySelector("#confirm-modal");
const confirmModalTitle = document.querySelector("#confirm-modal-title");
const confirmModalBody = document.querySelector("#confirm-modal-body");
const confirmModalConfirm = document.querySelector("#confirm-modal-confirm");
const appearanceThemeGrid = document.querySelector("#appearance-theme-grid");
const accentRail = document.querySelector("#accent-rail");
const refreshFilesButton = document.querySelector("#refresh-files");
const addFolderButton = document.querySelector("#add-folder-button");
const addFileButton = document.querySelector("#add-file-button");
const filesStateLabel = document.querySelector("#files-state");
const filesRootMenu = document.querySelector("#files-root-menu");
const filesFolderMenu = document.querySelector("#files-folder-menu");
const filesDetail = document.querySelector("#files-detail");
const filesImportInput = document.querySelector("#files-import-input");
const textState = document.querySelector("#text-state");
const textDocumentMenu = document.querySelector("#text-document-menu");
const textDetail = document.querySelector("#text-detail");
const addTextDocumentButton = document.querySelector("#add-text-document");
const openTextDocumentButton = document.querySelector("#open-text-document");
const refreshWebButton = document.querySelector("#refresh-web");
const addWebFragmentButton = document.querySelector("#add-web-fragment");
const webStateLabel = document.querySelector("#web-state");
const webMenu = document.querySelector("#web-menu");
const webDetail = document.querySelector("#web-detail");
const textFilePicker = document.querySelector("#text-file-picker");
const filePickerModeLabel = document.querySelector("#file-picker-mode-label");
const filePickerTitle = document.querySelector("#file-picker-title");
const filePickerRootMenu = document.querySelector("#file-picker-root-menu");
const filePickerPath = document.querySelector("#file-picker-path");
const filePickerEntries = document.querySelector("#file-picker-entries");
const filePickerSaveFields = document.querySelector("#file-picker-save-fields");
const filePickerFilename = document.querySelector("#file-picker-filename");
const filePickerExtension = document.querySelector("#file-picker-extension");
const filePickerState = document.querySelector("#file-picker-state");
const filePickerConfirm = document.querySelector("#file-picker-confirm");
const fileActionModal = document.querySelector("#file-action-modal");
const fileActionModeLabel = document.querySelector("#file-action-mode-label");
const fileActionTitle = document.querySelector("#file-action-title");
const fileActionPath = document.querySelector("#file-action-path");
const fileActionLabel = document.querySelector("#file-action-label");
const fileActionInput = document.querySelector("#file-action-input");
const fileActionState = document.querySelector("#file-action-state");
const fileActionConfirm = document.querySelector("#file-action-confirm");
const rootMenuItemTemplate = document.querySelector("#root-menu-item-template");
const folderMenuItemTemplate = document.querySelector("#folder-menu-item-template");
const fileEntryTemplate = document.querySelector("#file-entry-template");
const textDocumentCardTemplate = document.querySelector("#text-document-card-template");
const desktopSystemGrid = document.querySelector("#desktop-system-grid");
const desktopOrganizationGrid = document.querySelector("#desktop-organization-grid");
const desktopIconReservoir = document.querySelector("#desktop-icon-reservoir");
const desktopOrgSidebar = document.querySelector("#desktop-org-sidebar");
const desktopSidebarToggle = document.querySelector("#desktop-sidebar-toggle");
const desktopOrgList = document.querySelector("#desktop-org-list");
const desktopAddOrganizationButton = document.querySelector("#desktop-add-organization");
const desktopOpenAboutButton = document.querySelector("#desktop-open-about");
const dashboardActiveName = document.querySelector("#dashboard-active-name");
const dashboardActiveSummary = document.querySelector("#dashboard-active-summary");
const dashboardQueueMetric = document.querySelector("#dashboard-queue-metric");
const dashboardQueueSummary = document.querySelector("#dashboard-queue-summary");
const dashboardNotificationMetric = document.querySelector("#dashboard-notification-metric");
const dashboardNotificationSummary = document.querySelector("#dashboard-notification-summary");
const desktopDashboardFeed = document.querySelector("#desktop-dashboard-feed");
const systemTray = document.querySelector("#system-tray");
const systemTrayToggle = document.querySelector("#system-tray-toggle");
const systemTrayClose = document.querySelector("#system-tray-close");
const statusMenu = document.querySelector("#status-menu");
const statusDetail = document.querySelector("#status-detail");

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
let appearanceState = {
  accent: "neutral",
  theme: "gray",
};
let openOrganizationIds = [];
let organizationModes = {};
let organizationAppearanceOverrides = {};
let boardNotifications = [];
let notificationsOpen = false;
let desktopSidebarCollapsed = false;
let systemTrayOpen = false;
let selectedStatusScope = "organization";
let savingAppearance = false;
let appearanceSaveQueued = false;
let systemColorMediaQuery = null;

let sourceState = [];
let sourceDrafts = new Map();
let detectedSourceMap = new Map();
let organizations = [];
let activeOrganizationId = null;
let organizationDrafts = new Map();
let organizationRecentIds = [];
let pendingConfirmation = null;
let filesystemRoots = [];
let filesView = {
  entries: [],
  loading: false,
  path: "",
  root: "system",
};
let textDocuments = [];
let selectedTextDocumentId = null;
let savingTextDocumentIds = new Set();
let openingTextDocument = false;
let filePickerSession = {
  entries: [],
  mode: "open",
  path: "",
  root: "system",
  targetDocumentId: null,
};
let fileActionSession = null;
let queueState = [];
let queueNodeState = [];
let queueSSE = null;
let agentFiles = [];
let skillFiles = [];
let selectedAgentName = null;
let selectedSkillName = null;
let scheduleTasks = [];
let selectedScheduleId = null;
let meetings = [];
let selectedMeetingId = null;
let mailFolder = "inbox";
let mailMessages = [];
let selectedMailId = null;
let hireState = null;
let selectedHireKey = null;
let projects = [];
let selectedProjectId = null;
let evals = [];
let runtimeOrganizations = [];
let webState = {
  fragments: [],
  orgId: null,
  preview: "",
  selectedFragmentId: null,
  tools: [],
};
let selectedEvalId = null;
let templateCatalog = {
  bundles: [],
  departmentTemplates: [],
  organizationArchetypes: [],
  processTemplates: [],
  roleTemplates: [],
  teamTemplates: [],
  version: 1,
};
let textViewSettings = {
  plainBold: false,
  plainCenter: false,
  plainItalic: false,
};

const ABOUT_ICON_MARKUP = `
  <svg viewBox="0 0 64 64" focusable="false">
    <circle class="desktop-icon__stroke" cx="32" cy="32" r="19" />
    <path class="desktop-icon__stroke" d="M32 27v13M32 22.5h.01" />
  </svg>
`;

const STATUS_ICON_MARKUP = `
  <svg viewBox="0 0 64 64" focusable="false">
    <path class="desktop-icon__stroke" d="M14 46V18h36v28" />
    <path class="desktop-icon__stroke" d="M22 38l8-10 7 6 9-12" />
    <path class="desktop-icon__stroke" d="M14 46h36" />
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

const COLOR_ICON_MARKUP = `
  <svg viewBox="0 0 64 64" focusable="false">
    <path
      class="desktop-icon__stroke"
      d="M32 10c-12.2 0-22 9.1-22 20.4 0 10.3 7.7 18.6 17.4 20.1 1.7.3 3-1.1 2.8-2.8-.2-1.7.9-3.1 2.6-3.3h4.7c8.9 0 16.1-6.3 16.1-15C53.6 18.7 44 10 32 10z"
    />
    <circle class="desktop-icon__stroke" cx="23" cy="24" r="1.8" />
    <circle class="desktop-icon__stroke" cx="33" cy="19.5" r="1.8" />
    <circle class="desktop-icon__stroke" cx="42" cy="25" r="1.8" />
    <circle class="desktop-icon__stroke" cx="38" cy="35" r="1.8" />
  </svg>
`;

const FILES_ICON_MARKUP = `
  <svg viewBox="0 0 64 64" focusable="false">
    <path class="desktop-icon__stroke" d="M11 20.5h18l4.5 5H53c2.8 0 5 2.2 5 5v18c0 2.8-2.2 5-5 5H11c-2.8 0-5-2.2-5-5v-23c0-2.8 2.2-5 5-5z" />
    <path class="desktop-icon__stroke" d="M6 30.5h52" />
  </svg>
`;

const TEXT_ICON_MARKUP = `
  <svg viewBox="0 0 64 64" focusable="false">
    <path class="desktop-icon__stroke" d="M18 8h21l11 11v33c0 2.2-1.8 4-4 4H18c-2.2 0-4-1.8-4-4V12c0-2.2 1.8-4 4-4z" />
    <path class="desktop-icon__stroke" d="M39 8v11h11" />
    <path class="desktop-icon__stroke" d="M22 28h20M22 36h20M22 44h14" />
  </svg>
`;

const WEB_ICON_MARKUP = `
  <svg viewBox="0 0 64 64" focusable="false">
    <rect class="desktop-icon__stroke" x="8" y="10" width="48" height="44" rx="5" />
    <path class="desktop-icon__stroke" d="M8 22h48" />
    <path class="desktop-icon__stroke" d="M23 34h18M23 42h12" />
    <circle class="desktop-icon__stroke" cx="18" cy="17" r="1.5" />
    <circle class="desktop-icon__stroke" cx="24" cy="17" r="1.5" />
    <circle class="desktop-icon__stroke" cx="30" cy="17" r="1.5" />
  </svg>
`;

const AGENTS_ICON_MARKUP = `
  <svg viewBox="0 0 64 64" focusable="false">
    <circle class="desktop-icon__stroke" cx="32" cy="21" r="10" />
    <path class="desktop-icon__stroke" d="M10 54c0-12.2 9.8-22 22-22s22 9.8 22 22" />
  </svg>
`;

const SKILLS_ICON_MARKUP = `
  <svg viewBox="0 0 64 64" focusable="false">
    <circle class="desktop-icon__stroke" cx="32" cy="32" r="8" />
    <path class="desktop-icon__stroke" d="M32 9v8M32 47v8M9 32h8M47 32h8M16.5 16.5l5.7 5.7M41.8 41.8l5.7 5.7M47.5 16.5l-5.7 5.7M22.2 41.8l-5.7 5.7" />
  </svg>
`;

const TOOLS_ICON_MARKUP = `
  <svg viewBox="0 0 64 64" focusable="false">
    <path class="desktop-icon__stroke" d="M40.5 12.5c-5.8-5.8-15.2-5.8-21 0-4.8 4.8-5.6 12.1-2.3 17.7L8.5 38.8c-2.3 2.3-2.3 6 0 8.3l.9.9c2.3 2.3 6 2.3 8.3 0L26.3 39c5.6 3.3 12.9 2.5 17.7-2.3 5.8-5.8 5.8-15.2 0-21z" />
    <circle class="desktop-icon__stroke" cx="40.5" cy="23.5" r="3.5" />
  </svg>
`;

const SCHEDULE_ICON_MARKUP = `
  <svg viewBox="0 0 64 64" focusable="false">
    <rect class="desktop-icon__stroke" x="9" y="14" width="46" height="40" rx="5" />
    <path class="desktop-icon__stroke" d="M9 27h46M22 9v10M42 9v10" />
    <path class="desktop-icon__stroke" d="M21 38h5M31 38h5M41 38h5M21 47h5M31 47h5" />
  </svg>
`;

const MEET_ICON_MARKUP = `
  <svg viewBox="0 0 64 64" focusable="false">
    <circle class="desktop-icon__stroke" cx="22" cy="21" r="7.5" />
    <circle class="desktop-icon__stroke" cx="42" cy="21" r="7.5" />
    <path class="desktop-icon__stroke" d="M7 52c0-9.9 6.7-18 15-18" />
    <path class="desktop-icon__stroke" d="M57 52c0-9.9-6.7-18-15-18" />
    <path class="desktop-icon__stroke" d="M32 34c4.4 0 8 3.6 8 8v10H24V42c0-4.4 3.6-8 8-8z" />
  </svg>
`;

const MAIL_ICON_MARKUP = `
  <svg viewBox="0 0 64 64" focusable="false">
    <rect class="desktop-icon__stroke" x="7" y="15" width="50" height="36" rx="5" />
    <path class="desktop-icon__stroke" d="M7 20l25 17 25-17" />
  </svg>
`;

const QUEUE_ICON_MARKUP = `
  <svg viewBox="0 0 64 64" focusable="false">
    <rect class="desktop-icon__stroke" x="11" y="13" width="42" height="9" rx="3" />
    <rect class="desktop-icon__stroke" x="11" y="27.5" width="42" height="9" rx="3" />
    <rect class="desktop-icon__stroke" x="11" y="42" width="42" height="9" rx="3" />
  </svg>
`;

const HIRE_ICON_MARKUP = `
  <svg viewBox="0 0 64 64" focusable="false">
    <circle class="desktop-icon__stroke" cx="24" cy="20" r="7" />
    <path class="desktop-icon__stroke" d="M12 43c0-8 5.4-14 12-14s12 6 12 14" />
    <path class="desktop-icon__stroke" d="M43 18h13M49.5 11.5v13" />
  </svg>
`;

const PROJECTS_ICON_MARKUP = `
  <svg viewBox="0 0 64 64" focusable="false">
    <rect class="desktop-icon__stroke" x="9" y="13" width="18" height="18" rx="3" />
    <rect class="desktop-icon__stroke" x="37" y="13" width="18" height="18" rx="3" />
    <rect class="desktop-icon__stroke" x="23" y="35" width="18" height="18" rx="3" />
    <path class="desktop-icon__stroke" d="M27 22h10M32 31v4" />
  </svg>
`;

const EVALS_ICON_MARKUP = `
  <svg viewBox="0 0 64 64" focusable="false">
    <path class="desktop-icon__stroke" d="M14 44l10-10 8 8 18-18" />
    <path class="desktop-icon__stroke" d="M50 30V20H40" />
    <path class="desktop-icon__stroke" d="M10 52h44" />
  </svg>
`;

const APPEARANCE_THEMES = ["light", "dark", "gray", "system"];
const ACCENT_OPTIONS = [
  { id: "neutral", hue: 0, label: "neutral" },
  { id: "rose", hue: 350, label: "rose" },
  { id: "orange", hue: 24, label: "orange" },
  { id: "amber", hue: 42, label: "amber" },
  { id: "lime", hue: 92, label: "lime" },
  { id: "emerald", hue: 148, label: "emerald" },
  { id: "cyan", hue: 188, label: "cyan" },
  { id: "blue", hue: 222, label: "blue" },
  { id: "indigo", hue: 248, label: "indigo" },
  { id: "magenta", hue: 316, label: "magenta" },
];

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
    archetypeId: "",
    appearanceAccent: "neutral",
    appearanceTheme: "gray",
    createdAt: "",
    description: "",
    id: `draft-${crypto.randomUUID()}`,
    industry: "technology",
    industryCustom: "",
    lastActiveAt: "",
    mode: "idle",
    name: "",
    open: false,
    persisted: false,
    updatedAt: "",
    ...overrides,
  };
}

function normalizeOrganization(value) {
  return createDraftOrganization({
    archetypeId: value.archetypeId ?? "",
    appearanceAccent: normalizeAppearanceAccent(value.appearanceAccent),
    appearanceTheme: normalizeAppearanceTheme(value.appearanceTheme),
    createdAt: value.createdAt ?? "",
    description: value.description ?? "",
    id: value.id ?? `draft-${crypto.randomUUID()}`,
    industry: value.industry ?? "technology",
    industryCustom: value.industryCustom ?? "",
    lastActiveAt: value.lastActiveAt ?? "",
    mode: value.mode === "auto" ? "auto" : "idle",
    name: value.name ?? "",
    open: Boolean(value.open),
    persisted: true,
    updatedAt: value.updatedAt ?? "",
  });
}

function getOrganizationArchetypes() {
  return templateCatalog.organizationArchetypes ?? [];
}

function findOrganizationArchetype(archetypeId) {
  return getOrganizationArchetypes().find((entry) => entry.id === archetypeId) ?? null;
}

function getRoleTemplates() {
  return templateCatalog.roleTemplates ?? [];
}

function findRoleTemplateSummary(templateId) {
  return getRoleTemplates().find((entry) => entry.id === templateId) ?? null;
}

function getDepartmentTemplates() {
  return templateCatalog.departmentTemplates ?? [];
}

function findDepartmentTemplateSummary(templateId) {
  return getDepartmentTemplates().find((entry) => entry.id === templateId) ?? null;
}

function getTeamTemplates() {
  return templateCatalog.teamTemplates ?? [];
}

function findTeamTemplateSummary(templateId) {
  return getTeamTemplates().find((entry) => entry.id === templateId) ?? null;
}

function getBundleSummaries(bundleIds = []) {
  const all = templateCatalog.bundles ?? [];
  return bundleIds
    .map((bundleId) => all.find((entry) => entry.id === bundleId))
    .filter(Boolean);
}

function createTextDocument(overrides = {}) {
  return {
    content: "",
    dirty: true,
    extension: "txt",
    id: `text-${crypto.randomUUID()}`,
    name: "untitled",
    path: "",
    persisted: false,
    root: null,
    savedContent: "",
    status: "unsaved",
    viewMode: "raw",
    ...overrides,
  };
}

function textDocumentType(documentRecord) {
  const extension = `.${(documentRecord.extension || "txt").replace(/^\./, "").toLowerCase()}`;
  if (extension === ".json") {
    return "json";
  }
  if (extension === ".md") {
    return "markdown";
  }
  return "text";
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatInlineMarkdown(text) {
  let value = escapeHtml(text);
  value = value.replace(/`([^`]+)`/g, "<code>$1</code>");
  value = value.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  value = value.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  value = value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return value;
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let inList = false;
  let inCode = false;

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCode) {
        html.push("</code></pre>");
      } else {
        html.push("<pre><code>");
      }
      inCode = !inCode;
      continue;
    }

    if (inCode) {
      html.push(`${escapeHtml(line)}\n`);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      const level = heading[1].length;
      html.push(`<h${level}>${formatInlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    const listItem = line.match(/^[-*]\s+(.*)$/);
    if (listItem) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${formatInlineMarkdown(listItem[1])}</li>`);
      continue;
    }

    if (inList) {
      html.push("</ul>");
      inList = false;
    }

    if (!line.trim()) {
      html.push("<p><br></p>");
      continue;
    }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      html.push(`<blockquote>${formatInlineMarkdown(quote[1])}</blockquote>`);
      continue;
    }

    html.push(`<p>${formatInlineMarkdown(line)}</p>`);
  }

  if (inList) {
    html.push("</ul>");
  }
  if (inCode) {
    html.push("</code></pre>");
  }

  return html.join("");
}

function inlineHtmlToMarkdown(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? "";
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }
  const tag = node.tagName.toLowerCase();
  const content = Array.from(node.childNodes).map(inlineHtmlToMarkdown).join("");
  if (tag === "strong" || tag === "b") return `**${content}**`;
  if (tag === "em" || tag === "i") return `*${content}*`;
  if (tag === "code") return `\`${content}\``;
  if (tag === "a") return `[${content}](${node.getAttribute("href") ?? ""})`;
  if (tag === "br") return "\n";
  return content;
}

function htmlToMarkdown(root) {
  const blocks = [];
  for (const node of root.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        blocks.push(text);
      }
      continue;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      continue;
    }
    const tag = node.tagName.toLowerCase();
    const content = Array.from(node.childNodes).map(inlineHtmlToMarkdown).join("").trimEnd();
    if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6") {
      const level = Number(tag.slice(1));
      blocks.push(`${"#".repeat(level)} ${content}`.trim());
      continue;
    }
    if (tag === "blockquote") {
      blocks.push(`> ${content}`.trim());
      continue;
    }
    if (tag === "ul") {
      const items = Array.from(node.children).map((item) => `- ${Array.from(item.childNodes).map(inlineHtmlToMarkdown).join("").trim()}`);
      blocks.push(items.join("\n"));
      continue;
    }
    if (tag === "pre") {
      const code = node.textContent ?? "";
      blocks.push(`\`\`\`\n${code.replace(/\n$/, "")}\n\`\`\``);
      continue;
    }
    blocks.push(content);
  }
  return blocks.join("\n\n").replace(/\n{3,}/g, "\n\n");
}

function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function setJsonPathValue(target, pathSegments, nextValue) {
  if (pathSegments.length === 0) {
    return nextValue;
  }
  const [head, ...tail] = pathSegments;
  const key = /^\d+$/.test(head) ? Number(head) : head;
  const clone = Array.isArray(target) ? [...target] : { ...target };
  clone[key] = setJsonPathValue(target?.[key], tail, nextValue);
  return clone;
}

function applyPlainParsedClasses(element) {
  element.classList.toggle("is-bold", textViewSettings.plainBold);
  element.classList.toggle("is-italic", textViewSettings.plainItalic);
  element.classList.toggle("is-centered", textViewSettings.plainCenter);
}

function createTextViewToggle(documentRecord) {
  const type = textDocumentType(documentRecord);
  const wrap = document.createElement("div");
  wrap.className = "text-card__view-toggle";

  const rawButton = document.createElement("button");
  rawButton.className = "chrome-button text-card__toggle-button";
  rawButton.dataset.action = "set-text-view";
  rawButton.dataset.viewMode = "raw";
  rawButton.type = "button";
  rawButton.textContent = "raw";
  rawButton.classList.toggle("is-selected", documentRecord.viewMode !== "parsed");
  wrap.append(rawButton);

  const parsedButton = document.createElement("button");
  parsedButton.className = "chrome-button text-card__toggle-button";
  parsedButton.dataset.action = "set-text-view";
  parsedButton.dataset.viewMode = "parsed";
  parsedButton.type = "button";
  parsedButton.textContent = "parsed";
  parsedButton.disabled = type === "json" ? safeParseJson(documentRecord.content) === null : false;
  parsedButton.classList.toggle("is-selected", documentRecord.viewMode === "parsed");
  wrap.append(parsedButton);
  return wrap;
}

function createMarkdownToolbar() {
  const toolbar = document.createElement("div");
  toolbar.className = "text-toolbar";
  const actions = [
    ["md-bold", "bold"],
    ["md-italic", "italic"],
    ["md-h1", "h1"],
    ["md-h2", "h2"],
    ["md-quote", "quote"],
    ["md-list", "list"],
  ];
  actions.forEach(([action, label]) => {
    const button = document.createElement("button");
    button.className = "chrome-button text-toolbar__button";
    button.dataset.action = action;
    button.type = "button";
    button.textContent = label;
    toolbar.append(button);
  });
  return toolbar;
}

function createPlainToolbar() {
  const toolbar = document.createElement("div");
  toolbar.className = "text-toolbar";
  const actions = [
    ["txt-bold", "bold", textViewSettings.plainBold],
    ["txt-italic", "italic", textViewSettings.plainItalic],
    ["txt-center", "center", textViewSettings.plainCenter],
  ];
  actions.forEach(([action, label, selected]) => {
    const button = document.createElement("button");
    button.className = "chrome-button text-toolbar__button";
    button.dataset.action = action;
    button.type = "button";
    button.textContent = label;
    button.classList.toggle("is-selected", Boolean(selected));
    toolbar.append(button);
  });
  return toolbar;
}

function renderJsonNode(key, value, pathSegments = []) {
  const pathKey = pathSegments.join(".");
  if (value && typeof value === "object") {
    const details = document.createElement("details");
    details.className = "json-node";
    if (pathSegments.length === 0) {
      details.classList.add("json-node--root");
    }
    details.open = pathSegments.length < 2;
    const summary = document.createElement("summary");
    summary.className = "json-node__summary";
    summary.textContent = key === null
      ? (Array.isArray(value) ? `root [${value.length}]` : "root")
      : `${key} ${Array.isArray(value) ? `[${value.length}]` : ""}`.trim();
    details.append(summary);
    const body = document.createElement("div");
    body.className = "json-node__body";
    if (Array.isArray(value)) {
      value.forEach((entry, index) => {
        body.append(renderJsonNode(String(index), entry, [...pathSegments, String(index)]));
      });
    } else {
      Object.entries(value).forEach(([childKey, childValue]) => {
        body.append(renderJsonNode(childKey, childValue, [...pathSegments, childKey]));
      });
    }
    details.append(body);
    return details;
  }

  const row = document.createElement("label");
  row.className = "json-leaf";
  const label = document.createElement("span");
  label.className = "json-leaf__key";
  label.textContent = key ?? "value";
  row.append(label);

  if (typeof value === "boolean") {
    const input = document.createElement("input");
    input.className = "field__control json-leaf__checkbox";
    input.dataset.action = "json-leaf";
    input.dataset.path = pathKey;
    input.type = "checkbox";
    input.checked = value;
    row.append(input);
    return row;
  }

  const input = document.createElement(
    typeof value === "string" && value.length > 80 ? "textarea" : "input",
  );
  input.className = "field__control";
  input.dataset.action = "json-leaf";
  input.dataset.path = pathKey;
  input.dataset.valueType = value === null ? "null" : typeof value;
  if (input.tagName === "TEXTAREA") {
    input.rows = 3;
    input.value = value === null ? "null" : String(value);
  } else {
    input.type = "text";
    input.value = value === null ? "null" : String(value);
  }
  row.append(input);
  return row;
}

function createParsedEditor(documentRecord) {
  const type = textDocumentType(documentRecord);
  const shell = document.createElement("div");
  shell.className = "text-card__parsed-shell";

  if (type === "markdown") {
    shell.append(createMarkdownToolbar());
    const editor = document.createElement("div");
    editor.className = "field__control text-card__parsed text-card__parsed--markdown";
    editor.contentEditable = "true";
    editor.dataset.action = "parsed-markdown";
    editor.innerHTML = markdownToHtml(documentRecord.content);
    shell.append(editor);
    return shell;
  }

  if (type === "json") {
    const parsed = safeParseJson(documentRecord.content);
    if (parsed === null) {
      const note = document.createElement("p");
      note.className = "source-card__note";
      note.textContent = "The JSON is invalid, so parsed view is unavailable until the raw text is valid.";
      shell.append(note);
      return shell;
    }
    documentRecord.parsedJson = parsed;
    const tree = renderJsonNode(null, parsed, []);
    tree.classList.add("json-tree");
    shell.append(tree);
    return shell;
  }

  shell.append(createPlainToolbar());
  const editor = document.createElement("div");
  editor.className = "field__control text-card__parsed text-card__parsed--plain";
  editor.contentEditable = "true";
  editor.dataset.action = "parsed-plain";
  editor.textContent = documentRecord.content;
  applyPlainParsedClasses(editor);
  shell.append(editor);
  return shell;
}

function createSourceRecord(overrides = {}) {
  return {
    active: false,
    address: "",
    availableModels: [],
    contextWindow: 128000,
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

function createIconButton({
  action,
  ariaLabel,
  className = "",
  pathMarkup,
  title,
  dataset = {},
}) {
  const button = document.createElement("button");
  button.className = `icon-button ${className}`.trim();
  button.dataset.action = action;
  button.type = "button";
  button.setAttribute("aria-label", ariaLabel);
  button.title = title ?? ariaLabel;
  Object.entries(dataset).forEach(([key, value]) => {
    button.dataset[key] = value;
  });
  button.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      ${pathMarkup}
    </svg>
  `;
  return button;
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

function resolveSourceContextWindow(source) {
  if (typeof source.contextWindow === "number" && Number.isFinite(source.contextWindow)) {
    return source.contextWindow;
  }
  if (source.tier === "top" && source.model === "gemma4:26b") {
    return 256000;
  }
  return 128000;
}

function normalizeSavedSource(value) {
  return createSourceRecord({
    active: Boolean(value.active),
    address: value.address ?? "",
    contextWindow: resolveSourceContextWindow(value),
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

function unreadNotificationsForOrganization(organizationId) {
  return boardNotifications.filter((notification) =>
    notification.organizationId === organizationId && notification.unread
  ).length;
}

function formatOrganizationRuntimeLabel(organization) {
  if (!organization.persisted) {
    return "draft";
  }
  const parts = [];
  if (organization.id === activeOrganizationId) {
    parts.push("active");
  } else if (organization.open) {
    parts.push("open");
  } else {
    parts.push("closed");
  }
  parts.push(organization.mode === "auto" ? "auto" : "idle");
  const unread = unreadNotificationsForOrganization(organization.id);
  if (unread > 0) {
    parts.push(`${unread} unread`);
  } else if (organization.id !== activeOrganizationId) {
    parts.push(formatLastActiveLabel(organization));
  }
  return parts.join(" · ");
}

function getEffectiveAppearance() {
  const activeOverride = activeOrganizationId
    ? organizationAppearanceOverrides[activeOrganizationId] ?? null
    : null;
  return {
    accent: normalizeAppearanceAccent(activeOverride?.accent ?? appearanceState.accent),
    theme: normalizeAppearanceTheme(activeOverride?.theme ?? appearanceState.theme),
  };
}

function updateHeaderCaption() {
  if (!headerCaption) return;
  const activeOrg = organizations.find((org) => org.id === activeOrganizationId && org.persisted);
  headerCaption.textContent = activeOrg?.name?.trim() || "welcome to orgos";
  if (!headerCaptionSubtitle) return;
  headerCaptionSubtitle.textContent = activeOrg?.createdAt
    ? `Founded in ${new Date(activeOrg.createdAt).getFullYear()}`
    : "";
  document.documentElement.dataset.orgState = activeOrg?.mode === "auto" ? "auto" : "idle";
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

function loadTextViewSettings() {
  try {
    const raw = localStorage.getItem("orgos.textViewSettings");
    if (!raw) {
      return;
    }
    const parsed = JSON.parse(raw);
    textViewSettings = {
      plainBold: Boolean(parsed.plainBold),
      plainCenter: Boolean(parsed.plainCenter),
      plainItalic: Boolean(parsed.plainItalic),
    };
  } catch {
    textViewSettings = {
      plainBold: false,
      plainCenter: false,
      plainItalic: false,
    };
  }
}

function persistTextViewSettings() {
  try {
    localStorage.setItem("orgos.textViewSettings", JSON.stringify(textViewSettings));
  } catch {
    console.debug("[orgos] could not persist text view settings");
  }
}

function renderSystemMode() {
  if (!modeToggle || !modeToggleLabel) {
    return;
  }
  const activeMode = activeOrganizationId
    ? organizations.find((organization) => organization.id === activeOrganizationId)?.mode ?? "idle"
    : "idle";
  systemMode = activeMode;
  const isAuto = activeMode === "auto";
  modeToggle.classList.toggle("is-auto", isAuto);
  modeToggle.setAttribute("aria-pressed", String(isAuto));
  modeToggle.setAttribute("aria-label", `Organization ${isAuto ? "auto" : "idle"} mode`);
  modeToggle.title = `Organization ${isAuto ? "auto" : "idle"} mode`;
  modeToggleLabel.textContent = isAuto ? "auto" : "idle";
}

async function bootstrapAutoMode(orgId = activeOrganizationId) {
  const runtimeMode = orgId
    ? organizations.find((organization) => organization.id === orgId)?.mode ?? "idle"
    : "idle";
  if (runtimeMode !== "auto" || !orgId) {
    return;
  }

  try {
    await fetchJson("/api/system/auto-bootstrap", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ orgId }),
    });
    await Promise.all([
      loadSchedulePanelData(),
      loadHirePanelData(),
      loadProjectsPanelData(),
      loadEvalsPanelData(),
      loadMailPanelData(),
      loadMeetPanelData(),
    ]);
    setAboutState("Auto bootstrap ready");
  } catch (error) {
    console.error(error);
    setAboutState("Auto bootstrap failed");
  }
}

function setColorState(message, busy = false) {
  if (!colorState) {
    return;
  }

  colorState.textContent = message;
  colorState.hidden = !message;
  colorState.classList.toggle("is-busy", busy);
}

function normalizeAppearanceTheme(value) {
  return APPEARANCE_THEMES.includes(value) ? value : "gray";
}

function normalizeAppearanceAccent(value) {
  return ACCENT_OPTIONS.some((accent) => accent.id === value) ? value : "neutral";
}

function resolveThemeMode(theme) {
  if (theme !== "system") {
    return theme;
  }

  return systemColorMediaQuery?.matches ? "dark" : "light";
}

function accentTokens(themeMode, accentId) {
  if (accentId === "neutral") {
    return themeMode === "dark"
      ? {
          accent: "hsl(0 0% 92%)",
          accentMuted: "hsl(0 0% 84% / 0.28)",
          accentContrast: "hsl(0 0% 8%)",
          accentSoft: "hsl(0 0% 95% / 0.14)",
        }
      : {
          accent: "hsl(0 0% 15%)",
          accentMuted: "hsl(0 0% 12% / 0.12)",
          accentContrast: "hsl(0 0% 98%)",
          accentSoft: "hsl(0 0% 8% / 0.08)",
        };
  }

  const hue = ACCENT_OPTIONS.find((accent) => accent.id === accentId)?.hue ?? 222;
  return themeMode === "dark"
    ? {
        accent: `hsl(${hue} 92% 72%)`,
        accentMuted: `hsl(${hue} 92% 72% / 0.26)`,
        accentContrast: "hsl(0 0% 8%)",
        accentSoft: `hsl(${hue} 92% 72% / 0.14)`,
      }
    : {
        accent: `hsl(${hue} 84% 40%)`,
        accentMuted: `hsl(${hue} 84% 40% / 0.12)`,
        accentContrast: "hsl(0 0% 100%)",
        accentSoft: `hsl(${hue} 84% 40% / 0.08)`,
      };
}

function themeTokens(themeMode) {
  if (themeMode === "dark") {
    return {
      pageBackground: "hsl(0 0% 12%)",
      surface: "hsl(0 0% 17%)",
      surfaceMuted: "hsl(0 0% 17% / 0.9)",
      surfaceRaised: "hsl(0 0% 21% / 0.9)",
      surfaceTranslucent: "hsl(0 0% 100% / 0.06)",
      ink: "hsl(0 0% 96%)",
      inkMuted: "hsl(0 0% 78%)",
      structure: "hsl(0 0% 70%)",
      line: "hsl(0 0% 88%)",
      lineSoft: "hsl(0 0% 100% / 0.14)",
      lineStrong: "hsl(0 0% 100% / 0.28)",
      textOutline: "hsl(0 0% 10%)",
      embossHighlight: "rgba(255, 255, 255, 0.18)",
      embossShadow: "rgba(0, 0, 0, 0.32)",
      liftShadow: "rgba(0, 0, 0, 0.28)",
      scrim: "rgba(18, 18, 18, 0.62)",
    };
  }

  if (themeMode === "light") {
    return {
      pageBackground: "hsl(0 0% 92%)",
      surface: "hsl(0 0% 100%)",
      surfaceMuted: "hsl(0 0% 100% / 0.9)",
      surfaceRaised: "hsl(0 0% 100% / 0.82)",
      surfaceTranslucent: "hsl(0 0% 100% / 0.72)",
      ink: "hsl(0 0% 8%)",
      inkMuted: "hsl(0 0% 22%)",
      structure: "hsl(0 0% 38%)",
      line: "hsl(0 0% 7%)",
      lineSoft: "hsl(0 0% 7% / 0.14)",
      lineStrong: "hsl(0 0% 7% / 0.24)",
      textOutline: "hsl(0 0% 96%)",
      embossHighlight: "rgba(255, 255, 255, 0.82)",
      embossShadow: "rgba(96, 96, 96, 0.18)",
      liftShadow: "rgba(96, 96, 96, 0.14)",
      scrim: "rgba(245, 245, 245, 0.52)",
    };
  }

  return {
    pageBackground: "hsl(0 0% 75%)",
    surface: "hsl(0 0% 100%)",
    surfaceMuted: "hsl(0 0% 100% / 0.84)",
    surfaceRaised: "hsl(0 0% 100% / 0.78)",
    surfaceTranslucent: "hsl(0 0% 100% / 0.46)",
    ink: "hsl(0 0% 0%)",
    inkMuted: "hsl(0 0% 14%)",
    structure: "hsl(0 0% 38%)",
    line: "hsl(0 0% 7%)",
    lineSoft: "hsl(0 0% 7% / 0.14)",
    lineStrong: "hsl(0 0% 7% / 0.24)",
    textOutline: "hsl(0 0% 95%)",
    embossHighlight: "rgba(255, 255, 255, 0.8)",
    embossShadow: "rgba(96, 96, 96, 0.22)",
    liftShadow: "rgba(96, 96, 96, 0.18)",
    scrim: "rgba(191, 191, 191, 0.52)",
  };
}

function applyAppearance() {
  const root = document.documentElement;
  const effectiveAppearance = getEffectiveAppearance();
  const resolvedTheme = resolveThemeMode(effectiveAppearance.theme);
  const base = themeTokens(resolvedTheme);
  const accent = accentTokens(resolvedTheme, effectiveAppearance.accent);

  root.dataset.theme = effectiveAppearance.theme;
  root.dataset.resolvedTheme = resolvedTheme;
  root.dataset.orgAccent = effectiveAppearance.accent;
  root.style.setProperty("--page-background", base.pageBackground);
  root.style.setProperty("--surface", base.surface);
  root.style.setProperty("--surface-muted", base.surfaceMuted);
  root.style.setProperty("--surface-raised", base.surfaceRaised);
  root.style.setProperty("--surface-translucent", base.surfaceTranslucent);
  root.style.setProperty("--ink", base.ink);
  root.style.setProperty("--ink-muted", base.inkMuted);
  root.style.setProperty("--structure", base.structure);
  root.style.setProperty("--line", base.line);
  root.style.setProperty("--line-soft", base.lineSoft);
  root.style.setProperty("--line-strong", base.lineStrong);
  root.style.setProperty("--text-outline", base.textOutline);
  root.style.setProperty("--emboss-highlight", base.embossHighlight);
  root.style.setProperty("--emboss-shadow", base.embossShadow);
  root.style.setProperty("--lift-shadow", base.liftShadow);
  root.style.setProperty("--scrim", base.scrim);
  root.style.setProperty("--accent", accent.accent);
  root.style.setProperty("--accent-muted", accent.accentMuted);
  root.style.setProperty("--accent-contrast", accent.accentContrast);
  root.style.setProperty("--accent-soft", accent.accentSoft);
  root.style.colorScheme = resolvedTheme === "dark" ? "dark" : "light";
}

function renderAppearanceControls() {
  if (appearanceThemeGrid) {
    appearanceThemeGrid.querySelectorAll("[data-theme-option]").forEach((button) => {
      const selected = button.dataset.themeOption === appearanceState.theme;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  if (accentRail) {
    accentRail.querySelectorAll("[data-accent-option]").forEach((button) => {
      const selected = button.dataset.accentOption === appearanceState.accent;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }
}

async function persistAppearance() {
  if (savingAppearance) {
    appearanceSaveQueued = true;
    return;
  }

  savingAppearance = true;
  try {
    do {
      appearanceSaveQueued = false;
      setColorState("Saving...", true);
      try {
        const payload = await fetchJson("/api/system/appearance", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(appearanceState),
        });
        appearanceState = {
          accent: normalizeAppearanceAccent(payload.accent),
          theme: normalizeAppearanceTheme(payload.theme),
        };
        applyAppearance();
        renderAppearanceControls();
        setColorState("Saved");
      } catch (error) {
        console.error(error);
        setColorState("Save failed");
      }
    } while (appearanceSaveQueued);
  } finally {
    savingAppearance = false;
    window.setTimeout(() => {
      if (!savingAppearance) {
        setColorState("");
      }
    }, 900);
  }
}

function setAppearance(nextAppearance) {
  appearanceState = {
    accent: normalizeAppearanceAccent(nextAppearance.accent ?? appearanceState.accent),
    theme: normalizeAppearanceTheme(nextAppearance.theme ?? appearanceState.theme),
  };
  applyAppearance();
  renderAppearanceControls();
  void persistAppearance();
}

function renderAccentOptions() {
  if (!accentRail || accentRail.childElementCount > 0) {
    return;
  }

  for (const accent of ACCENT_OPTIONS) {
    const button = document.createElement("button");
    button.className = "accent-swatch";
    button.type = "button";
    button.dataset.accentOption = accent.id;
    button.setAttribute("aria-label", `${accent.label} accent`);
    button.title = `${accent.label} accent`;
    button.style.setProperty("--swatch", accent.id === "neutral"
      ? "linear-gradient(135deg, hsl(0 0% 18%), hsl(0 0% 88%))"
      : `hsl(${accent.hue} 82% 48%)`);
    accentRail.append(button);
  }
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

function initializeDesktopGroups() {
  if (!desktopSystemGrid || !desktopOrganizationGrid || !desktopIconReservoir) {
    return;
  }
  const icons = [...desktopIconReservoir.querySelectorAll(".desktop-icon")];
  for (const icon of icons) {
    if (icon.id === "status-icon") {
      continue;
    }
    icon.classList.add("desktop-icon--grouped");
    const scope = icon.dataset.appScope === "organization" ? desktopOrganizationGrid : desktopSystemGrid;
    scope.append(icon);
  }
}

function renderNotifications() {
  if (!notificationIndicatorCount || !notificationPopoverList || !notificationSummary) {
    return;
  }
  if (notificationPopover) {
    notificationPopover.hidden = !notificationsOpen;
  }
  const unreadCount = boardNotifications.filter((notification) => notification.unread).length;
  notificationIndicatorCount.hidden = unreadCount === 0;
  notificationIndicatorCount.textContent = String(unreadCount);
  notificationIndicator?.classList.toggle("is-active", unreadCount > 0);
  notificationSummary.textContent = unreadCount > 0 ? `${unreadCount} unread` : "No unread";
  notificationPopoverList.replaceChildren();
  if (boardNotifications.length === 0) {
    const empty = document.createElement("p");
    empty.className = "notification-popover__empty";
    empty.textContent = "No board updates yet.";
    notificationPopoverList.append(empty);
    return;
  }
  for (const notification of boardNotifications.slice(0, 12)) {
    const button = document.createElement("button");
    button.className = "notification-item";
    button.type = "button";
    button.dataset.notificationId = notification.id;
    const org = notification.organizationId
      ? organizations.find((entry) => entry.id === notification.organizationId)?.name ?? notification.organizationId
      : "system";
    button.innerHTML = `
      <span class="notification-item__title">${escapeHtml(notification.title)}</span>
      <span class="notification-item__meta">${escapeHtml(org)} · ${escapeHtml(notification.sourceApp)}</span>
      <span class="notification-item__summary">${escapeHtml(notification.summary)}</span>
    `;
    if (notification.unread) {
      button.classList.add("is-unread");
    }
    notificationPopoverList.append(button);
  }
  renderDesktopSidebar();
  renderDesktopDashboard();
}

function loadDesktopSidebarState() {
  try {
    desktopSidebarCollapsed = localStorage.getItem("orgos.desktopSidebarCollapsed") === "true";
  } catch {
    desktopSidebarCollapsed = false;
  }
}

function persistDesktopSidebarState() {
  try {
    localStorage.setItem("orgos.desktopSidebarCollapsed", String(desktopSidebarCollapsed));
  } catch {
    console.debug("[orgos] could not persist desktop sidebar state");
  }
}

function applyDesktopSidebarState() {
  desktopArea?.classList.toggle("is-sidebar-collapsed", desktopSidebarCollapsed);
  if (desktopSidebarToggle) {
    desktopSidebarToggle.setAttribute(
      "aria-label",
      desktopSidebarCollapsed ? "Expand organization sidebar" : "Collapse organization sidebar",
    );
    desktopSidebarToggle.title = desktopSidebarCollapsed
      ? "Expand organization sidebar"
      : "Collapse organization sidebar";
    desktopSidebarToggle.innerHTML = desktopSidebarCollapsed
      ? '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6" /></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 6l-6 6 6 6" /></svg>';
  }
}

function renderSystemTray() {
  if (!systemTray || !systemTrayToggle) {
    return;
  }
  systemTray.hidden = !systemTrayOpen;
  systemTrayToggle.classList.toggle("is-active", systemTrayOpen);
  systemTrayToggle.setAttribute("aria-expanded", String(systemTrayOpen));
}

function summarizeOrganizationActivity(organization) {
  const runtimeSummary = runtimeOrganizations.find((entry) => entry.id === organization.id);
  if (runtimeSummary?.headline) {
    return runtimeSummary.headline;
  }
  const unread = unreadNotificationsForOrganization(organization.id);
  if (unread > 0) {
    return `${unread} board update${unread === 1 ? "" : "s"}`;
  }
  return organization.mode === "auto"
    ? "running autonomous work"
    : "idle and waiting";
}

function createDesktopOrganizationCard(organization) {
  const card = document.createElement("article");
  card.className = "desktop-org-card";
  if (organization.id === activeOrganizationId) {
    card.classList.add("is-active");
  }

  const unread = unreadNotificationsForOrganization(organization.id);
  const runtimeSummary = runtimeOrganizations.find((entry) => entry.id === organization.id);

  const trigger = document.createElement("button");
  trigger.className = "desktop-org-card__trigger";
  trigger.type = "button";
  trigger.dataset.organizationId = organization.id;
  trigger.dataset.action = "activate-desktop-organization";
  trigger.innerHTML = `
    <span class="desktop-org-card__title">${escapeHtml(organization.name || "new organization")}</span>
    <span class="desktop-org-card__meta">${escapeHtml(runtimeSummary?.status || formatOrganizationRuntimeLabel(organization))}</span>
  `;

  const badges = document.createElement("div");
  badges.className = "desktop-org-card__badges";
  if (organization.id === activeOrganizationId) {
    badges.append(createRuntimeBadge("active", "active"));
  } else if (organization.open) {
    badges.append(createRuntimeBadge("open", "open"));
  }
  const notificationLabel = unread > 0 ? `${unread} unread` : "board clear";
  badges.append(createRuntimeBadge(notificationLabel, unread > 0 ? "unread" : ""));

  const actions = document.createElement("div");
  actions.className = "desktop-org-card__actions";
  actions.append(
    createDesktopOrgAction(organization.id === activeOrganizationId ? "view" : "focus", "activate-desktop-organization", organization.id),
    createDesktopOrgModeToggle(organization),
    createDesktopOrgAction(
      organization.open ? "close" : "open",
      "toggle-open-desktop-organization",
      organization.id,
      false,
    ),
  );

  card.append(trigger, badges, actions);
  return card;
}

function createRuntimeBadge(label, modifier = "") {
  const badge = document.createElement("span");
  badge.className = `organization-runtime-badge${modifier ? ` organization-runtime-badge--${modifier}` : ""}`;
  badge.textContent = label;
  return badge;
}

function createDesktopOrgAction(label, action, organizationId, disabled = false) {
  const button = document.createElement("button");
  button.className = "chrome-button";
  button.type = "button";
  button.dataset.action = action;
  button.dataset.organizationId = organizationId;
  button.textContent = label;
  button.disabled = disabled;
  return button;
}

function createDesktopOrgModeToggle(organization) {
  const button = document.createElement("button");
  button.className = `mode-toggle desktop-org-card__mode-toggle${organization.mode === "auto" ? " is-auto" : ""}`;
  button.dataset.action = "toggle-mode-desktop-organization";
  button.dataset.organizationId = organization.id;
  button.type = "button";
  button.setAttribute("aria-pressed", String(organization.mode === "auto"));
  button.setAttribute("aria-label", `${organization.name || "organization"} ${organization.mode === "auto" ? "auto" : "idle"} mode`);
  button.title = `${organization.mode === "auto" ? "set idle" : "set auto"}`;
  button.innerHTML = `
    <span class="mode-toggle__track">
      <span class="mode-toggle__thumb"></span>
    </span>
    <span class="mode-toggle__label">${organization.mode === "auto" ? "auto" : "idle"}</span>
  `;
  return button;
}

function renderDesktopSidebar() {
  if (!desktopOrgList) {
    return;
  }
  desktopOrgList.replaceChildren();
  const list = sortOrganizations(organizations).filter((organization) => organization.persisted);
  if (list.length === 0) {
    const empty = document.createElement("p");
    empty.className = "panel-copy";
    empty.textContent = "Create an organization in About to begin.";
    desktopOrgList.append(empty);
  } else {
    for (const organization of list) {
      desktopOrgList.append(createDesktopOrganizationCard(organization));
    }
  }
}

function renderDesktopDashboard() {
  const activeOrg = organizations.find((organization) => organization.id === activeOrganizationId) ?? null;
  if (dashboardActiveName) {
    dashboardActiveName.textContent = activeOrg?.name || "welcome to orgos";
  }
  if (dashboardActiveSummary) {
    dashboardActiveSummary.textContent = activeOrg
      ? summarizeOrganizationActivity(activeOrg)
      : "Verify a source, create an organization, and set it to auto to begin.";
  }
  if (dashboardQueueMetric) {
    const pending = queueState.filter((item) => item.status === "pending" || item.status === "running").length;
    dashboardQueueMetric.textContent = String(pending);
  }
  if (dashboardQueueSummary) {
    const pending = queueState.filter((item) => item.status === "pending").length;
    const running = queueState.filter((item) => item.status === "running").length;
    dashboardQueueSummary.textContent = pending || running
      ? `${running} running · ${pending} pending`
      : "No queued work yet.";
  }
  const unread = boardNotifications.filter((notification) => notification.unread).length;
  if (dashboardNotificationMetric) {
    dashboardNotificationMetric.textContent = String(unread);
  }
  if (dashboardNotificationSummary) {
    dashboardNotificationSummary.textContent = unread > 0
      ? `${unread} unread board notifications`
      : "No unread notifications.";
  }
  if (!desktopDashboardFeed) {
    return;
  }
  desktopDashboardFeed.replaceChildren();
  const feedItems = (runtimeOrganizations.length > 0 ? runtimeOrganizations : organizations
    .filter((organization) => organization.persisted)
    .map((organization) => ({
      headline: summarizeOrganizationActivity(organization),
      id: organization.id,
      name: organization.name,
      status: organization.mode,
      summary: formatOrganizationRuntimeLabel(organization),
    }))).slice(0, 6);
  if (feedItems.length === 0) {
    const empty = document.createElement("p");
    empty.className = "panel-copy";
    empty.textContent = "Open organizations will report their current activity here.";
    desktopDashboardFeed.append(empty);
    return;
  }
  for (const item of feedItems) {
    const node = document.createElement("article");
    node.className = "desktop-feed-item";
    node.innerHTML = `
      <span class="desktop-feed-item__title">${escapeHtml(item.name)}</span>
      <span class="desktop-feed-item__meta">${escapeHtml(item.status || "idle")}</span>
      <span class="desktop-dashboard__summary">${escapeHtml(item.headline || item.summary || "No recent activity.")}</span>
    `;
    desktopDashboardFeed.append(node);
  }
}

function setStatusState(message, busy = false) {
  setPanelState(statusState, message, busy);
}

function createStatusMetricCard(eyebrow, value, summary) {
  const card = document.createElement("article");
  card.className = "desktop-dashboard__card";
  card.innerHTML = `
    <p class="desktop-dashboard__eyebrow">${escapeHtml(eyebrow)}</p>
    <p class="desktop-dashboard__metric">${escapeHtml(String(value))}</p>
    <p class="desktop-dashboard__summary">${escapeHtml(summary)}</p>
  `;
  return card;
}

function createStatusFeedCard(title, items, emptyMessage) {
  const card = document.createElement("article");
  card.className = "desktop-dashboard__card desktop-dashboard__card--feed";
  const heading = document.createElement("p");
  heading.className = "desktop-dashboard__eyebrow";
  heading.textContent = title;
  card.append(heading);

  const feed = document.createElement("div");
  feed.className = "desktop-dashboard__feed";
  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "panel-copy";
    empty.textContent = emptyMessage;
    feed.append(empty);
  } else {
    for (const item of items) {
      const node = document.createElement("article");
      node.className = "desktop-feed-item";
      node.innerHTML = `
        <span class="desktop-feed-item__title">${escapeHtml(item.title)}</span>
        <span class="desktop-feed-item__meta">${escapeHtml(item.meta)}</span>
        <span class="desktop-dashboard__summary">${escapeHtml(item.summary)}</span>
      `;
      feed.append(node);
    }
  }
  card.append(feed);
  return card;
}

function renderStatusPanel() {
  if (!statusDetail) {
    return;
  }
  statusDetail.replaceChildren();
  const scope = selectedStatusScope === "system" ? "system" : "organization";
  statusMenu?.querySelectorAll("[data-status-scope]").forEach((button) => {
    button.classList.toggle("source-item--active", button.dataset.statusScope === scope);
  });

  if (scope === "organization") {
    const activeOrg = organizations.find((organization) => organization.id === activeOrganizationId) ?? null;
    const activeCard = document.createElement("article");
    activeCard.className = "desktop-dashboard__card desktop-dashboard__card--hero";
    activeCard.innerHTML = `
      <p class="desktop-dashboard__eyebrow">active organization</p>
      <h2 class="desktop-dashboard__title">${escapeHtml(activeOrg?.name || "welcome to orgos")}</h2>
      <p class="desktop-dashboard__summary">${escapeHtml(activeOrg ? summarizeOrganizationActivity(activeOrg) : "No active organization selected.")}</p>
    `;
    statusDetail.append(activeCard);

    const unread = activeOrg ? unreadNotificationsForOrganization(activeOrg.id) : 0;
    statusDetail.append(
      createStatusMetricCard("mode", activeOrg?.mode || "idle", activeOrg ? formatOrganizationRuntimeLabel(activeOrg) : "Select or open an organization."),
      createStatusMetricCard("board", unread, unread ? `${unread} unread updates for this organization.` : "No unread updates for this organization."),
    );

    const items = (runtimeOrganizations.length > 0 ? runtimeOrganizations : organizations
      .filter((organization) => organization.persisted)
      .map((organization) => ({
        headline: summarizeOrganizationActivity(organization),
        id: organization.id,
        name: organization.name,
        status: formatOrganizationRuntimeLabel(organization),
        summary: organization.mode === "auto" ? "autonomous work enabled" : "waiting for activation",
      })))
      .map((item) => ({
        title: item.name,
        meta: item.status,
        summary: item.headline || item.summary,
      }));
    statusDetail.append(createStatusFeedCard("open organizations", items, "No open organizations yet."));
    return;
  }

  const pending = queueState.filter((item) => item.status === "pending").length;
  const running = queueState.filter((item) => item.status === "running").length;
  const sourceCount = sourceState.filter((source) => source.active && source.persisted).length;
  statusDetail.append(
    createStatusMetricCard("queue pressure", running + pending, running || pending ? `${running} running · ${pending} pending` : "System queue is clear."),
    createStatusMetricCard("verified sources", sourceCount, sourceCount ? "Shared inference is available for autonomous work." : "Verify a source to enable auto mode."),
  );

  const systemItems = boardNotifications.slice(0, 8).map((notification) => ({
    title: notification.title,
    meta: `${notification.organizationId ? organizations.find((entry) => entry.id === notification.organizationId)?.name ?? notification.organizationId : "system"} · ${notification.sourceApp}`,
    summary: notification.summary,
  }));
  statusDetail.append(createStatusFeedCard("board notifications", systemItems, "No Board notifications yet."));
}

function getFilesystemRootMeta(rootId) {
  return filesystemRoots.find((root) => root.id === rootId) ?? null;
}

function syncFilesystemState() {
  const currentRoot = getFilesystemRootMeta(filesView.root);
  if (!currentRoot || !currentRoot.available) {
    filesView.root = getFilesystemRootMeta("organization")?.available ? "organization" : "system";
    filesView.path = "";
  }

  textDocuments = textDocuments.filter((document) => {
    if (!document.root) {
      return true;
    }
    const root = getFilesystemRootMeta(document.root);
    return Boolean(root?.available);
  });
  if (
    selectedTextDocumentId &&
    !textDocuments.some((document) => document.id === selectedTextDocumentId)
  ) {
    selectedTextDocumentId = textDocuments[0]?.id ?? null;
  }
}

function getDesktopPanelIds() {
  return getDesktopIcons().map((icon) => icon.dataset.panelId).filter(Boolean);
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
  const labels = {
    [PANEL_ABOUT]: "About",
    [PANEL_STATUS]: "Status",
    [PANEL_SOURCES]: "Sources",
    [PANEL_COLOR]: "Color",
    [PANEL_FILES]: "Files",
    [PANEL_TEXT]: "Text",
    [PANEL_WEB]: "Web",
    [PANEL_AGENTS]: "Agents",
    [PANEL_SKILLS]: "Skills",
    [PANEL_TOOLS]: "Tools",
    [PANEL_SCHEDULE]: "Flow",
    [PANEL_MEET]: "Meet",
    [PANEL_MAIL]: "Mail",
    [PANEL_QUEUE]: "Queue",
    [PANEL_HIRE]: "Staff",
    [PANEL_PROJECTS]: "Projects",
    [PANEL_EVALS]: "Evals",
  };
  return labels[panelId] ?? panelId;
}

function getPanelScope(panelId) {
  return [PANEL_STATUS, PANEL_SOURCES, PANEL_COLOR, PANEL_FILES, PANEL_TEXT, PANEL_AGENTS, PANEL_SKILLS, PANEL_TOOLS, PANEL_QUEUE]
    .includes(panelId)
    ? "system"
    : "organization";
}

function formatContextWindowLabel(value) {
  if (!Number.isFinite(value)) {
    return "128k";
  }
  return `${Math.round(value / 1000)}k`;
}

function panelIconMarkup(panelId) {
  const icons = {
    [PANEL_ABOUT]: ABOUT_ICON_MARKUP,
    [PANEL_STATUS]: STATUS_ICON_MARKUP,
    [PANEL_SOURCES]: SOURCES_ICON_MARKUP,
    [PANEL_COLOR]: COLOR_ICON_MARKUP,
    [PANEL_FILES]: FILES_ICON_MARKUP,
    [PANEL_TEXT]: TEXT_ICON_MARKUP,
    [PANEL_WEB]: WEB_ICON_MARKUP,
    [PANEL_AGENTS]: AGENTS_ICON_MARKUP,
    [PANEL_SKILLS]: SKILLS_ICON_MARKUP,
    [PANEL_TOOLS]: TOOLS_ICON_MARKUP,
    [PANEL_SCHEDULE]: SCHEDULE_ICON_MARKUP,
    [PANEL_MEET]: MEET_ICON_MARKUP,
    [PANEL_MAIL]: MAIL_ICON_MARKUP,
    [PANEL_QUEUE]: QUEUE_ICON_MARKUP,
    [PANEL_HIRE]: HIRE_ICON_MARKUP,
    [PANEL_PROJECTS]: PROJECTS_ICON_MARKUP,
    [PANEL_EVALS]: EVALS_ICON_MARKUP,
  };
  return icons[panelId] ?? ABOUT_ICON_MARKUP;
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
  return [...desktopArea.querySelectorAll(".desktop-icon")]
    .filter((icon) => !icon.hidden && !icon.disabled && !icon.closest("[hidden]"));
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
  return activePanelId ? [activePanelId, ...getInactiveOpenPanelIds()] : [...openPanelIds];
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
    if (left.open && !right.open) return -1;
    if (right.open && !left.open) return 1;

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

  return ["name", "industry", "industryCustom", "description", "archetypeId"].some(
    (key) => organization[key] !== baseline[key],
  );
}

function populateSelectOptions(select, entries, { includeBlank = null, valueKey = "id", labelKey = "name" } = {}) {
  if (!select) {
    return;
  }

  const currentValue = select.value;
  select.replaceChildren();

  if (includeBlank !== null) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = includeBlank;
    select.append(option);
  }

  for (const entry of entries) {
    const option = document.createElement("option");
    option.value = entry[valueKey] ?? "";
    option.textContent = entry[labelKey] ?? entry[valueKey] ?? "";
    select.append(option);
  }

  if ([...select.options].some((option) => option.value === currentValue)) {
    select.value = currentValue;
  }
}

function summarizeTemplateProvenance(templateId, templateSource, fallbackLabel = "custom") {
  if (!templateId) {
    return fallbackLabel;
  }

  const template = findRoleTemplateSummary(templateId)
    ?? findDepartmentTemplateSummary(templateId)
    ?? findTeamTemplateSummary(templateId);
  return template
    ? `${templateSource === "local" ? "local" : "system"} template · ${template.name}`
    : `${templateSource === "local" ? "local" : "system"} template`;
}

function renderBundleChips(bundleIds = []) {
  const summaries = getBundleSummaries(bundleIds);
  if (summaries.length === 0) {
    return '<p class="source-card__note">No shared bundles attached.</p>';
  }

  return `
    <div class="template-chip-row">
      ${summaries.map((bundle) => `<span class="template-chip">${escapeHtml(bundle.name)}</span>`).join("")}
    </div>
  `;
}

function formatListForTextarea(values = []) {
  return (values ?? []).filter(Boolean).join("\n");
}

function applyDepartmentTemplate(item, templateId) {
  const template = findDepartmentTemplateSummary(templateId);
  item.templateId = templateId || "";
  item.templateSource = templateId ? "system" : "";
  if (!template) {
    return;
  }
  item.name = template.name;
  item.summary = template.summary ?? item.summary ?? "";
}

function applyTeamTemplate(item, templateId) {
  const template = findTeamTemplateSummary(templateId);
  item.templateId = templateId || "";
  item.templateSource = templateId ? "system" : "";
  if (!template) {
    return;
  }
  item.name = template.name;
  item.summary = template.summary ?? item.summary ?? "";
}

function applyRoleTemplate(item, templateId) {
  const template = findRoleTemplateSummary(templateId);
  item.templateId = templateId || "";
  item.templateSource = templateId ? "system" : "";
  if (!template) {
    return;
  }
  item.title = template.name;
  item.templateName = template.agentTemplate ?? item.templateName ?? "";
  item.requiredSkills = [...(template.defaultSkills ?? [])];
  item.requiredTools = [...(template.defaultTools ?? [])];
  item.bundleIds = [...(template.bundleIds ?? [])];
  item.evaluationFocus = template.evaluationFocus ?? "";
  item.notes = template.summary ?? item.notes ?? "";
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
      source.contextWindow = resolveSourceContextWindow({
        contextWindow: detected.contextWindow,
        model: source.model || preferred.model,
        tier: source.tier,
      });
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
        contextWindow: resolveSourceContextWindow({
          contextWindow: detected.contextWindow,
          model: preferred.model,
          tier: address === "http://127.0.0.1:11434" ? "mid" : "mid",
        }),
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
  templateCatalog = payload.templates ?? templateCatalog;
  appearanceState = {
    accent: normalizeAppearanceAccent(payload.appearance?.accent),
    theme: normalizeAppearanceTheme(payload.appearance?.theme),
  };
  filesystemRoots = payload.filesystem?.roots ?? [];

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

  openOrganizationIds = Array.isArray(payload.openOrganizationIds) ? payload.openOrganizationIds : [];
  organizationModes = payload.organizationModes ?? {};
  organizationAppearanceOverrides = payload.organizationAppearanceOverrides ?? {};
  boardNotifications = payload.notifications ?? [];
  runtimeOrganizations = payload.organizationRuntime ?? [];
  organizations = (payload.organizations ?? []).map((organization) =>
    normalizeOrganization({
      ...organization,
      appearanceAccent: organizationAppearanceOverrides[organization.id]?.accent,
      appearanceTheme: organizationAppearanceOverrides[organization.id]?.theme,
      mode: organizationModes[organization.id] ?? "idle",
      open: openOrganizationIds.includes(organization.id),
    })
  );
  if (organizations.length === 0) {
    organizations = [createDraftOrganization()];
    activeOrganizationId = null;
    setAboutState("Create your first organization");
  } else {
    activeOrganizationId = payload.activeOrganizationId ?? organizations[0].id;
    setAboutState(activeOrganizationId ? "Organization active" : "Ready");
  }
  applyAppearance();
  renderAppearanceControls();
  renderSystemTray();
  renderNotifications();
  renderStatusPanel();

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
  syncFilesystemState();
  agentFiles = payload.agents ?? [];
  skillFiles = payload.skills ?? [];
  queueState = payload.queue ?? [];
  queueNodeState = payload.nodeTelemetry ?? [];
  webState.orgId = activeOrganizationId;
  webState.fragments = payload.web?.fragments ?? [];
  webState.selectedFragmentId = payload.web?.fragments?.[0]?.id ?? null;
  webState.preview = payload.web?.preview ?? "";
  webState.tools = payload.web?.tools ?? [];
  scheduleTasks = payload.flow ?? payload.schedule ?? [];
  meetings = payload.meetings ?? [];
  mailMessages = (payload.mailInbox ?? []).map((message) => ({ ...message, persisted: true }));
  hireState = payload.staff ?? payload.hire ?? createEmptyHireState();
  projects = payload.projects ?? [];
  evals = payload.evals ?? [];
  ensureScheduleSelection();
  ensureMeetingSelection();
  ensureMailSelection();
  ensureHireSelection();
  ensureProjectSelection();
  ensureEvalSelection();
  renderSources();
  renderOrganizations();
  renderFilesPanel();
  renderTextPanel();
  renderAgentsPanel();
  renderSkillsPanel();
  renderWebPanel();
  renderQueuePanel();
  renderSchedulePanel();
  renderMeetPanel();
  renderMailPanel();
  renderHirePanel();
  renderProjectsPanel();
  renderEvalsPanel();
  renderNotifications();
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
      contextWindow: resolveSourceContextWindow(source),
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
        contextWindow: resolveSourceContextWindow(saved),
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
    source.contextWindow = resolveSourceContextWindow({
      contextWindow: payload.contextWindow,
      model: source.model,
      tier: source.tier,
    });
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
    ? `${source.tier} tier · ${Math.round(resolveSourceContextWindow(source) / 1000)}k · active`
    : `${source.tier} tier · ${Math.round(resolveSourceContextWindow(source) / 1000)}k · inactive`;

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
  card.querySelector('[data-role="context-window"]').textContent = `${Math.round(resolveSourceContextWindow(source) / 1000)}k`;
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
  const badges = fragment.querySelector('[data-role="badges"]');
  item.dataset.organizationId = organization.id;
  fragment.querySelector('[data-role="name"]').textContent =
    organization.name || "new organization";
  fragment.querySelector('[data-role="meta"]').textContent = formatOrganizationRuntimeLabel(organization);

  badges.replaceChildren();
  if (organization.persisted) {
    const addBadge = (label, modifier) => {
      const badge = document.createElement("span");
      badge.className = `organization-runtime-badge${modifier ? ` organization-runtime-badge--${modifier}` : ""}`;
      badge.textContent = label;
      badges.append(badge);
    };
    if (organization.id === activeOrganizationId) addBadge("active", "active");
    else if (organization.open) addBadge("open", "open");
    if (organization.mode === "auto") addBadge("auto", "auto");
    const unread = unreadNotificationsForOrganization(organization.id);
    if (unread > 0) addBadge(String(unread), "unread");
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
  const archetypeSelect = card.querySelector('[data-field="archetypeId"]');
  populateSelectOptions(archetypeSelect, getOrganizationArchetypes(), { includeBlank: "custom organization" });
  archetypeSelect.value = organization.archetypeId ?? "";

  const founded = card.querySelector('[data-role="founded"]');
  const archetype = findOrganizationArchetype(organization.archetypeId);
  founded.textContent = [formatFoundedLabel(organization), archetype?.name ? `Archetype: ${archetype.name}` : ""]
    .filter(Boolean)
    .join(" · ");
  founded.hidden = !founded.textContent;
  card.querySelector('[data-field="appearanceTheme"]').value = organization.appearanceTheme || "gray";
  card.querySelector('[data-field="appearanceAccent"]').value = organization.appearanceAccent || "neutral";

  const customField = card.querySelector('[data-role="industry-custom-field"]');
  customField.hidden = organization.industry !== "custom";
  deleteButton.textContent = organization.persisted ? "delete" : "cancel";
  nameField.setCustomValidity(
    hasDuplicateOrganizationName(organization.name, organization.id)
      ? "Organization name already in use"
      : "",
  );

  renderOrganizationAction(card.querySelector('[data-role="org-action"]'), organization);
  const openButton = card.querySelector('[data-action="toggle-open-organization"]');
  const activeButton = card.querySelector('[data-action="activate-organization"]');
  const modeButton = card.querySelector('[data-action="toggle-mode-organization"]');
  openButton.textContent = organization.open ? "close" : "open";
  activeButton.textContent = organization.id === activeOrganizationId ? "active" : "make active";
  activeButton.disabled = !organization.persisted || organization.id === activeOrganizationId;
  modeButton.textContent = organization.mode === "auto" ? "set idle" : "set auto";
  modeButton.disabled = !organization.persisted || !organization.open;
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

  const archetype = findOrganizationArchetype(organization.archetypeId);
  founded.textContent = [formatFoundedLabel(organization), archetype?.name ? `Archetype: ${archetype.name}` : ""]
    .filter(Boolean)
    .join(" · ");
  founded.hidden = !founded.textContent;
  customField.hidden = organization.industry !== "custom";
  deleteButton.textContent = organization.persisted ? "delete" : "cancel";
  card.querySelector('[data-field="appearanceTheme"]').value = organization.appearanceTheme || "gray";
  card.querySelector('[data-field="appearanceAccent"]').value = organization.appearanceAccent || "neutral";
  const archetypeSelect = card.querySelector('[data-field="archetypeId"]');
  populateSelectOptions(archetypeSelect, getOrganizationArchetypes(), { includeBlank: "custom organization" });
  archetypeSelect.value = organization.archetypeId ?? "";
  nameField.setCustomValidity(
    hasDuplicateOrganizationName(organization.name, organization.id)
      ? "Organization name already in use"
      : "",
  );
  renderOrganizationAction(card.querySelector('[data-role="org-action"]'), organization);
  const openButton = card.querySelector('[data-action="toggle-open-organization"]');
  const activeButton = card.querySelector('[data-action="activate-organization"]');
  const modeButton = card.querySelector('[data-action="toggle-mode-organization"]');
  openButton.textContent = organization.open ? "close" : "open";
  activeButton.textContent = organization.id === activeOrganizationId ? "active" : "make active";
  activeButton.disabled = !organization.persisted || organization.id === activeOrganizationId;
  modeButton.textContent = organization.mode === "auto" ? "set idle" : "set auto";
  modeButton.disabled = !organization.persisted || !organization.open;
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
  renderDesktopSidebar();
  renderDesktopDashboard();
  renderStatusPanel();
}

function setFilesState(message, busy = false) {
  if (!filesStateLabel) {
    return;
  }
  filesStateLabel.textContent = message;
  filesStateLabel.hidden = !message;
  filesStateLabel.classList.toggle("is-busy", busy);
}

function setTextState(message, busy = false) {
  if (!textState) {
    return;
  }
  textState.textContent = message;
  textState.hidden = !message;
  textState.classList.toggle("is-busy", busy);
}

function setPanelState(target, message, busy = false) {
  if (!target) {
    return;
  }
  target.textContent = message;
  target.hidden = !message;
  target.classList.toggle("is-busy", busy);
}

function setPanelScanState(panelId, message, busy = false) {
  const el = document.querySelector(`#${panelId}-state`);
  setPanelState(el, message, busy);
}

function renderEmptyDetail(target, message) {
  target?.replaceChildren(emptyDetailCard(message));
}

function requireActiveOrganization(target, message = "Activate an organization to use this application.") {
  target?.replaceChildren();
  const empty = document.createElement("div");
  empty.className = "text-empty-state";
  const note = document.createElement("p");
  note.className = "panel-copy";
  note.textContent = message;
  empty.append(note);
  target?.append(empty);
}

function createMenuCard({
  id,
  meta = "",
  name,
  selected = false,
  type = "item",
}) {
  const fragment = organizationMenuItemTemplate.content.cloneNode(true);
  const item = fragment.querySelector(".source-menu-item");
  const button = fragment.querySelector('[data-action="select"]');
  item.dataset.recordId = id;
  item.dataset.recordType = type;
  button.dataset.action = "select-record";
  button.dataset.recordId = id;
  button.dataset.recordType = type;
  button.querySelector('[data-role="name"]').textContent = name;
  button.querySelector('[data-role="meta"]').textContent = meta;
  button.classList.toggle("is-selected", selected);
  return fragment;
}

function setSelectedIdIfMissing(list, currentId, fallbackKey = "id") {
  if (currentId && list.some((item) => item?.[fallbackKey] === currentId)) {
    return currentId;
  }
  return list[0]?.[fallbackKey] ?? null;
}

function formatPathLabel(rootId, relativePath) {
  const root = getFilesystemRootMeta(rootId);
  const rootLabel = root?.label ?? rootId;
  return relativePath ? `${rootLabel}/${relativePath}` : rootLabel;
}

function parentRelativePath(relativePath) {
  if (!relativePath) {
    return "";
  }
  const parts = relativePath.split("/").filter(Boolean);
  parts.pop();
  return parts.join("/");
}

function createRootMenuItem(rootMeta, selected, action = "select-root") {
  const fragment = rootMenuItemTemplate.content.cloneNode(true);
  const button = fragment.querySelector(".root-menu__item");
  button.dataset.rootId = rootMeta.id;
  button.dataset.action = action;
  button.querySelector('[data-role="name"]').textContent = rootMeta.label;
  button.querySelector('[data-role="meta"]').textContent = rootMeta.available ? "" : "requires active organization";
  button.classList.toggle("is-selected", selected);
  button.disabled = !rootMeta.available;
  return fragment;
}

function createFolderMenuItem(name, relativePath, meta, kind = "folder") {
  const fragment = folderMenuItemTemplate.content.cloneNode(true);
  const button = fragment.querySelector(".folder-menu__item");
  button.dataset.path = relativePath;
  button.dataset.kind = kind;
  button.querySelector('[data-role="name"]').textContent = name;
  button.querySelector('[data-role="meta"]').textContent = meta;
  return fragment;
}

function createFileEntry(entry, mode = "files") {
  const fragment = fileEntryTemplate.content.cloneNode(true);
  const node = fragment.querySelector(".file-entry");
  const main = fragment.querySelector(".file-entry__main");
  const actions = fragment.querySelector('[data-role="actions"]');

  node.dataset.path = entry.path;
  main.dataset.path = entry.path;
  main.dataset.type = entry.type;
  main.querySelector('[data-role="name"]').textContent = entry.name;
  main.querySelector('[data-role="meta"]').textContent =
    entry.type === "directory"
      ? "folder"
      : entry.extension.replace(".", "") || "file";

  if (entry.type === "directory") {
    main.dataset.action = "open-folder";
    actions.append(
      createIconButton({
        action: "open-folder",
        ariaLabel: `Open folder ${entry.name}`,
        className: "file-entry__icon-button",
        dataset: { path: entry.path },
        pathMarkup: '<path d="M4 7h7l2 2h7v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" /><path d="M10 13h7" /><path d="M14 10l3 3-3 3" />',
      }),
    );
    if (mode === "files") {
      actions.append(
        createIconButton({
          action: "rename-entry",
          ariaLabel: `Rename folder ${entry.name}`,
          className: "file-entry__icon-button",
          dataset: { path: entry.path, entryType: entry.type },
          pathMarkup: '<path d="M4 17.5V20h2.5L18 8.5 15.5 6 4 17.5z" /><path d="M14.5 7l2.5 2.5" />',
        }),
      );
    }
    return fragment;
  }

  if (entry.editable) {
    actions.append(
      createIconButton({
        action: mode === "picker-open" ? "open-text-from-picker" : "open-text-file",
        ariaLabel: `Open file ${entry.name}`,
        className: "file-entry__icon-button",
        dataset: { path: entry.path },
        pathMarkup: '<path d="M5 12h11" /><path d="M12 5l7 7-7 7" />',
      }),
    );
  }

  if (mode === "files" && filesView.root !== "deleted") {
    actions.append(
      createIconButton({
        action: "rename-entry",
        ariaLabel: `Rename file ${entry.name}`,
        className: "file-entry__icon-button",
        dataset: { path: entry.path, entryType: entry.type },
        pathMarkup: '<path d="M4 17.5V20h2.5L18 8.5 15.5 6 4 17.5z" /><path d="M14.5 7l2.5 2.5" />',
      }),
    );

    actions.append(
      createIconButton({
        action: "delete-file",
        ariaLabel: `Delete file ${entry.name}`,
        className: "file-entry__icon-button file-entry__icon-button--danger",
        dataset: { path: entry.path },
        pathMarkup: '<path d="M6 7h12" /><path d="M9 7V5h6v2" /><path d="M8 7l1 12h6l1-12" />',
      }),
    );
  }

  return fragment;
}

async function loadFilesDirectory(rootId = filesView.root, relativePath = filesView.path) {
  filesView.loading = true;
  setFilesState("Loading...", true);
  renderFilesPanel();
  try {
    const params = new URLSearchParams({
      path: relativePath ?? "",
      root: rootId,
    });
    const payload = await fetchJson(`/api/files/list?${params.toString()}`);
    filesView = {
      entries: payload.entries ?? [],
      loading: false,
      path: payload.path ?? "",
      root: payload.root ?? rootId,
    };
    setFilesState("");
  } catch (error) {
    console.error(error);
    filesView.loading = false;
    setFilesState("Load failed");
  }
  renderFilesPanel();
}

function renderFilesPanel() {
  if (!filesRootMenu || !filesFolderMenu || !filesDetail) {
    return;
  }

  filesRootMenu.replaceChildren();
  filesystemRoots.forEach((rootMeta) => {
    filesRootMenu.append(createRootMenuItem(rootMeta, rootMeta.id === filesView.root));
  });

  filesFolderMenu.replaceChildren();
  const currentRoot = getFilesystemRootMeta(filesView.root);
  if (!currentRoot?.available) {
    const message = document.createElement("p");
    message.className = "panel-copy";
    message.textContent = "Activate an organization to browse organization files.";
    filesFolderMenu.append(message);
  } else {
    const rootButton = createFolderMenuItem(currentRoot.label, "", "root", "root");
    rootButton.querySelector(".folder-menu__item")?.classList.add("is-selected");
    filesFolderMenu.append(rootButton);
    if (filesView.path) {
      filesFolderMenu.append(
        createFolderMenuItem("up one level", parentRelativePath(filesView.path), "parent", "parent"),
      );
    }
    filesView.entries
      .filter((entry) => entry.type === "directory")
      .forEach((entry) => {
        filesFolderMenu.append(createFolderMenuItem(entry.name, entry.path, "folder", "folder"));
      });
  }

  filesDetail.replaceChildren();
  const shell = document.createElement("div");
  shell.className = "file-browser";

  const header = document.createElement("div");
  header.className = "file-browser__header";
  const title = document.createElement("p");
  title.className = "source-card__status";
  title.textContent = formatPathLabel(filesView.root, filesView.path);
  const meta = document.createElement("p");
  meta.className = "source-card__meta-detail";
  meta.textContent = `${filesView.entries.length} items`;
  header.append(title, meta);
  shell.append(header);

  const breadcrumbs = document.createElement("div");
  breadcrumbs.className = "file-browser__breadcrumbs";
  const rootCrumb = document.createElement("button");
  rootCrumb.className = "file-browser__crumb";
  rootCrumb.dataset.action = "open-folder";
  rootCrumb.dataset.path = "";
  rootCrumb.type = "button";
  rootCrumb.textContent = currentRoot?.label ?? filesView.root;
  breadcrumbs.append(rootCrumb);
  const parts = filesView.path ? filesView.path.split("/").filter(Boolean) : [];
  parts.forEach((part, index) => {
    const separator = document.createElement("span");
    separator.className = "file-browser__crumb-separator";
    separator.textContent = "/";
    const crumb = document.createElement("button");
    crumb.className = "file-browser__crumb";
    crumb.dataset.action = "open-folder";
    crumb.dataset.path = parts.slice(0, index + 1).join("/");
    crumb.type = "button";
    crumb.textContent = part;
    breadcrumbs.append(separator, crumb);
  });
  shell.append(breadcrumbs);

  const entries = document.createElement("div");
  entries.className = "file-browser__entries";
  if (!currentRoot?.available) {
    const empty = document.createElement("p");
    empty.className = "source-card__note";
    empty.textContent = "This area becomes available when an organization is active.";
    entries.append(empty);
  } else if (filesView.entries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "source-card__note";
    empty.textContent = "This folder is empty.";
    entries.append(empty);
  } else {
    filesView.entries.forEach((entry) => {
      entries.append(createFileEntry(entry));
    });
  }
  shell.append(entries);
  filesDetail.append(shell);
}

function documentDisplayName(documentRecord) {
  if (documentRecord.path) {
    return documentRecord.name || documentRecord.path.split("/").at(-1) || "untitled";
  }
  return documentRecord.name || "untitled";
}

function isTextDocumentDirty(documentRecord) {
  return documentRecord.content !== documentRecord.savedContent;
}

function textDocumentStatusLabel(documentRecord) {
  const type = textDocumentType(documentRecord);
  const parsedPrefix = documentRecord.viewMode === "parsed" ? `${type} parsed` : null;
  const dirtyLabel = isTextDocumentDirty(documentRecord)
    ? "unsaved changes"
    : (documentRecord.persisted ? "saved" : "unsaved");
  return parsedPrefix ? `${parsedPrefix} • ${dirtyLabel}` : dirtyLabel;
}

function findIdentityForRole(roleId) {
  return hireState?.identities?.find((identity) => identity.roleId === roleId) ?? null;
}

function describeFlowMeta(task) {
  const parts = [];
  if (task.enabled === false) {
    parts.push("disabled");
  } else {
    parts.push(task.trigger ?? "auto");
  }
  if (task.cadence) {
    parts.push(task.cadence);
  }
  if (task.workstream) {
    parts.push(task.workstream);
  }
  if (task.contextRequirement) {
    parts.push(formatContextWindowLabel(task.contextRequirement));
  }
  if (task.evaluationRequired) {
    parts.push("eval");
  }
  return parts.join(" · ");
}

function refreshTextCardState(card, documentRecord) {
  if (!card || !documentRecord) {
    return;
  }
  const status = card.querySelector('[data-role="status"]');
  if (status) {
    status.textContent = textDocumentStatusLabel(documentRecord);
  }
  renderTextEditorSaveActions(card.querySelector('[data-role="text-edit-actions"]'), documentRecord);
}

function ensureTextDocumentSelection() {
  if (
    selectedTextDocumentId &&
    textDocuments.some((document) => document.id === selectedTextDocumentId)
  ) {
    return;
  }
  selectedTextDocumentId = textDocuments[0]?.id ?? null;
}

function createTextMenuItem(documentRecord) {
  const fragment = organizationMenuItemTemplate.content.cloneNode(true);
  const item = fragment.querySelector(".source-menu-item");
  const button = fragment.querySelector('[data-action="select"]');
  item.dataset.documentId = documentRecord.id;
  button.dataset.action = "select-text-document";
  button.querySelector('[data-role="name"]').textContent = documentDisplayName(documentRecord);
  button.querySelector('[data-role="meta"]').textContent = isTextDocumentDirty(documentRecord)
    ? "unsaved changes"
    : (documentRecord.persisted ? "saved" : "unsaved");
  button.classList.toggle("is-selected", documentRecord.id === selectedTextDocumentId);
  return fragment;
}

function renderTextEditorActions(target, documentRecord) {
  target.replaceChildren();
  const closeButton = document.createElement("button");
  closeButton.className = "icon-button source-card__button";
  closeButton.dataset.action = "close-text-document";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close file");
  closeButton.title = "Close file";
  closeButton.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 7h7l3 3v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
      <path d="M14 7v3h3" />
      <path d="M8 8l8 8M16 8l-8 8" />
    </svg>
  `;
  target.append(closeButton);
  target.append(createTextViewToggle(documentRecord));
}

function renderTextEditorSaveActions(target, documentRecord) {
  target.replaceChildren();

  if (isTextDocumentDirty(documentRecord) || !documentRecord.persisted) {
    const discardButton = document.createElement("button");
    discardButton.className = "chrome-button source-card__button";
    discardButton.dataset.action = "discard-text-document";
    discardButton.type = "button";
    discardButton.textContent = "discard";
    discardButton.disabled = savingTextDocumentIds.has(documentRecord.id);
    target.append(discardButton);

    const saveButton = document.createElement("button");
    saveButton.className = "chrome-button source-card__button";
    saveButton.dataset.action = "save-text-document";
    saveButton.type = "button";
    const busy = savingTextDocumentIds.has(documentRecord.id);
    saveButton.textContent = busy ? "saving..." : "save";
    saveButton.disabled = busy;
    saveButton.classList.toggle("is-busy", busy);
    target.append(saveButton);
  }
}

function createTextDetail(documentRecord) {
  const fragment = textDocumentCardTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".text-card");
  card.dataset.documentId = documentRecord.id;
  card.querySelector('[data-role="status"]').textContent = textDocumentStatusLabel(documentRecord);
  card.querySelector('[data-role="text-path"]').textContent = documentRecord.path
    ? formatPathLabel(documentRecord.root, documentRecord.path)
    : "New text document";
  const rawEditor = card.querySelector('[data-field="content"]');
  rawEditor.value = documentRecord.content;
  if (!documentRecord.persisted) {
    const field = document.createElement("label");
    field.className = "field";
    field.innerHTML = `
      <span class="field__label">type</span>
      <select class="field__control" data-field="extension">
        <option value="txt">plaintext</option>
        <option value="md">markdown</option>
        <option value="json">json</option>
      </select>
    `;
    field.querySelector('[data-field="extension"]').value = documentRecord.extension || "txt";
    card.querySelector(".text-card__meta")?.after(field);
  }
  renderTextEditorActions(card.querySelector('[data-role="text-actions"]'), documentRecord);
  renderTextEditorSaveActions(card.querySelector('[data-role="text-edit-actions"]'), documentRecord);
  const type = textDocumentType(documentRecord);
  const shouldShowParsed = documentRecord.viewMode === "parsed";
  rawEditor.hidden = shouldShowParsed;
  rawEditor.closest(".field").querySelector(".field__label").textContent =
    shouldShowParsed ? "raw source" : "contents";
  if (shouldShowParsed) {
    card.querySelector(".field").append(createParsedEditor(documentRecord));
  }
  return fragment;
}

function renderTextPanel() {
  if (!textDocumentMenu || !textDetail) {
    return;
  }
  ensureTextDocumentSelection();
  textDocumentMenu.replaceChildren();
  textDocuments.forEach((documentRecord) => {
    textDocumentMenu.append(createTextMenuItem(documentRecord));
  });
  textDocumentMenu.append(addTextDocumentButton.parentElement);

  textDetail.replaceChildren();
  const selected = textDocuments.find((documentRecord) => documentRecord.id === selectedTextDocumentId);
  if (selected) {
    textDetail.append(createTextDetail(selected));
  } else {
    const empty = document.createElement("div");
    empty.className = "text-empty-state";
    const message = document.createElement("p");
    message.className = "panel-copy";
    message.textContent = "Open a text file or create a new document.";
    const actions = document.createElement("div");
    actions.className = "source-card__actions";
    const newButton = document.createElement("button");
    newButton.className = "chrome-button source-card__button";
    newButton.dataset.action = "new-text-document";
    newButton.type = "button";
    newButton.textContent = "new";
    const openButton = document.createElement("button");
    openButton.className = "chrome-button source-card__button";
    openButton.dataset.action = "open-text-file";
    openButton.type = "button";
    openButton.textContent = "open";
    actions.append(openButton, newButton);
    empty.append(message, actions);
    textDetail.append(empty);
  }
}

function setWebState(message, busy = false) {
  if (!webStateLabel) {
    return;
  }
  webStateLabel.textContent = message;
  webStateLabel.hidden = !message;
  webStateLabel.classList.toggle("is-busy", busy);
}

async function loadWebPanelData() {
  if (!activeOrganizationId) {
    webState = {
      fragments: [],
      orgId: null,
      preview: "",
      selectedFragmentId: null,
      tools: [],
    };
    renderWebPanel();
    return;
  }
  setWebState("Loading...", true);
  try {
    const payload = await fetchJson(`/api/web/list?orgId=${encodeURIComponent(activeOrganizationId)}`);
    webState = {
      fragments: payload.fragments ?? [],
      orgId: activeOrganizationId,
      preview: payload.preview ?? "",
      selectedFragmentId: payload.fragments?.find((entry) => entry.id === webState.selectedFragmentId)?.id
        ?? payload.fragments?.[0]?.id
        ?? null,
      tools: payload.tools ?? [],
    };
    setWebState("");
  } catch (error) {
    console.error(error);
    setWebState("Load failed");
  }
  renderWebPanel();
}

function renderWebPanel() {
  if (!webMenu || !webDetail) {
    return;
  }
  if (!activeOrganizationId) {
    webMenu.replaceChildren();
    requireActiveOrganization(webDetail, "Activate an organization to shape its intranet.");
    return;
  }

  webMenu.replaceChildren();
  for (const fragment of webState.fragments) {
    webMenu.append(
      createMenuCard({
        id: fragment.id,
        meta: fragment.type || "fragment",
        name: fragment.label || fragment.name || "untitled fragment",
        selected: fragment.id === webState.selectedFragmentId,
        type: "web-fragment",
      }),
    );
  }

  webDetail.replaceChildren();
  const selected = webState.fragments.find((entry) => entry.id === webState.selectedFragmentId) ?? null;
  const shell = document.createElement("div");
  shell.className = "web-workspace";
  shell.innerHTML = `
    <div class="web-workspace__column">
      <article class="web-fragment-card">
        <p class="source-card__status">${selected?.label || "Intranet fragment"}</p>
        <p class="source-card__note">${selected?.path ? formatPathLabel("organization", selected.path) : "Open or create a fragment to begin."}</p>
        <div class="source-card__actions">
          <button class="chrome-button source-card__button" data-action="open-web-fragment-text" type="button" ${selected ? "" : "disabled"}>edit in text</button>
        </div>
      </article>
      <article class="web-tool-test-card">
        <p class="source-card__status">custom js tools</p>
        <div class="web-tool-test-list">
          ${(webState.tools ?? []).map((tool) => `
            <div class="web-tool-test-item">
              <div>
                <p class="source-card__meta-detail">${escapeHtml(tool.name)}</p>
                <p class="source-card__note">${escapeHtml(tool.file || "")}</p>
              </div>
              <button class="chrome-button source-card__button" data-action="open-tool-registry" type="button">view</button>
            </div>
          `).join("") || '<p class="source-card__note">No organization custom tools detected yet.</p>'}
        </div>
      </article>
    </div>
    <div class="web-workspace__column">
      <article class="web-preview-card">
        <p class="source-card__status">preview</p>
        <iframe class="web-preview-frame" title="Organization intranet preview"></iframe>
      </article>
    </div>
  `;
  const frame = shell.querySelector(".web-preview-frame");
  if (frame) {
    frame.srcdoc = webState.preview || "<!doctype html><html><body><p>No preview available.</p></body></html>";
  }
  webDetail.append(shell);
}

function renderTextDocumentMenuOnly() {
  if (!textDocumentMenu) {
    return;
  }
  textDocumentMenu.replaceChildren();
  textDocuments.forEach((documentRecord) => {
    textDocumentMenu.append(createTextMenuItem(documentRecord));
  });
  textDocumentMenu.append(addTextDocumentButton.parentElement);
}

async function openTextDocument(rootId, relativePath) {
  const existing = textDocuments.find(
    (documentRecord) => documentRecord.root === rootId && documentRecord.path === relativePath,
  );
  if (existing) {
    selectedTextDocumentId = existing.id;
    openPanel(PANEL_TEXT);
    renderTextPanel();
    return;
  }

  openingTextDocument = true;
  setTextState("Opening...", true);
  try {
    const params = new URLSearchParams({ path: relativePath, root: rootId });
    const payload = await fetchJson(`/api/text/read?${params.toString()}`);
    const documentRecord = createTextDocument({
      content: payload.content ?? "",
      dirty: false,
      extension: (payload.extension ?? ".txt").replace(".", ""),
      name: payload.name ?? relativePath.split("/").at(-1) ?? "untitled",
      path: payload.path ?? relativePath,
      persisted: true,
      root: payload.root ?? rootId,
      savedContent: payload.content ?? "",
      status: "saved",
    });
    textDocuments = [documentRecord, ...textDocuments];
    selectedTextDocumentId = documentRecord.id;
    openPanel(PANEL_TEXT);
    setTextState("");
  } catch (error) {
    console.error(error);
    setTextState("Open failed");
  } finally {
    openingTextDocument = false;
    renderTextPanel();
  }
}

function createNewTextDocument() {
  const count = textDocuments.filter((documentRecord) => !documentRecord.persisted).length + 1;
  const documentRecord = createTextDocument({
    extension: "txt",
    name: `untitled ${count}`,
  });
  textDocuments = [documentRecord, ...textDocuments];
  selectedTextDocumentId = documentRecord.id;
  openPanel(PANEL_TEXT);
  renderTextPanel();
}

function updateTextDocumentField(documentId, value) {
  const documentRecord = textDocuments.find((entry) => entry.id === documentId);
  if (!documentRecord) {
    return;
  }
  documentRecord.content = value;
  renderTextDocumentMenuOnly();
  const card = textDetail?.querySelector(`.text-card[data-document-id="${documentId}"]`);
  refreshTextCardState(card, documentRecord);
}

function discardTextDocumentChanges(documentId) {
  const documentRecord = textDocuments.find((entry) => entry.id === documentId);
  if (!documentRecord) {
    return;
  }
  if (!documentRecord.persisted) {
    textDocuments = textDocuments.filter((entry) => entry.id !== documentId);
  } else {
    documentRecord.content = documentRecord.savedContent;
  }
  ensureTextDocumentSelection();
  renderTextPanel();
}

function closeTextDocument(documentId) {
  textDocuments = textDocuments.filter((entry) => entry.id !== documentId);
  if (selectedTextDocumentId === documentId) {
    selectedTextDocumentId = textDocuments[0]?.id ?? null;
  }
  ensureTextDocumentSelection();
  renderTextPanel();
}

async function saveTextDocument(documentId) {
  const documentRecord = textDocuments.find((entry) => entry.id === documentId);
  if (!documentRecord || savingTextDocumentIds.has(documentId)) {
    return;
  }
  if (!documentRecord.persisted) {
    await openFilePicker("save", documentRecord.id);
    return;
  }

  savingTextDocumentIds.add(documentId);
  setTextState("Saving...", true);
  renderTextPanel();
  try {
    await fetchJson("/api/text/write", {
      body: JSON.stringify({
        content: documentRecord.content,
        overwrite: true,
        path: documentRecord.path,
        root: documentRecord.root,
      }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });
    documentRecord.savedContent = documentRecord.content;
    documentRecord.persisted = true;
    setTextState("Saved");
  } catch (error) {
    console.error(error);
    setTextState("Save failed");
  } finally {
    savingTextDocumentIds.delete(documentId);
    renderTextPanel();
  }
}

async function openFilePicker(mode, targetDocumentId = null) {
  const defaultSaveRoot = getFilesystemRootMeta("organization")?.available ? "organization" : "system";
  filePickerSession = {
    entries: [],
    mode,
    path: "",
    root: mode === "save" ? defaultSaveRoot : defaultSaveRoot,
    targetDocumentId,
  };
  textFilePicker.hidden = false;
  textFilePicker.setAttribute("aria-hidden", "false");
  filePickerModeLabel.textContent = mode === "save" ? "save file" : "open file";
  filePickerTitle.textContent = mode === "save" ? "Save document" : "Open text file";
  filePickerConfirm.textContent = mode === "save" ? "save" : "open";
  filePickerSaveFields.hidden = mode !== "save";
  if (mode === "save") {
    const documentRecord = textDocuments.find((entry) => entry.id === targetDocumentId);
    filePickerFilename.value = documentRecord?.name?.replace(/\.(txt|md|json)$/i, "") ?? "untitled";
    filePickerExtension.value = documentRecord?.extension ?? "txt";
  }
  await loadFilePickerDirectory(filePickerSession.root, filePickerSession.path);
}

function closeFilePicker() {
  textFilePicker.hidden = true;
  textFilePicker.setAttribute("aria-hidden", "true");
  filePickerState.textContent = "";
  filePickerState.hidden = true;
}

function openFileActionModal(mode, entry = null) {
  fileActionSession = {
    entry,
    mode,
    path: filesView.path,
    root: filesView.root,
  };
  fileActionModal.hidden = false;
  fileActionModal.setAttribute("aria-hidden", "false");
  fileActionModeLabel.textContent = mode === "rename" ? "rename item" : "create folder";
  fileActionTitle.textContent = mode === "rename" ? "Rename item" : "New folder";
  fileActionLabel.textContent = mode === "rename" ? "new name" : "folder name";
  fileActionConfirm.textContent = mode === "rename" ? "rename" : "create";
  fileActionPath.textContent = formatPathLabel(filesView.root, filesView.path);
  fileActionInput.value = mode === "rename"
    ? (() => {
      const base = entry?.path?.split("/").at(-1) ?? "";
      const extension = entry?.type === "file" ? (entry?.extension ?? "") : "";
      return extension && base.toLowerCase().endsWith(extension.toLowerCase())
        ? base.slice(0, -extension.length)
        : base;
    })()
    : "";
  fileActionState.hidden = true;
  fileActionState.textContent = "";
}

function closeFileActionModal() {
  fileActionSession = null;
  fileActionModal.hidden = true;
  fileActionModal.setAttribute("aria-hidden", "true");
}

async function confirmFileAction() {
  if (!fileActionSession) {
    return;
  }

  const name = fileActionInput.value.trim();
  if (!name) {
    fileActionState.hidden = false;
    fileActionState.textContent = "Name required";
    return;
  }

  fileActionState.hidden = false;
  fileActionState.textContent = fileActionSession.mode === "rename" ? "Renaming..." : "Creating...";
  fileActionState.classList.add("is-busy");

  try {
    if (fileActionSession.mode === "rename") {
      await fetchJson("/api/files/rename", {
        body: JSON.stringify({
          name,
          path: fileActionSession.entry.path,
          root: fileActionSession.root,
        }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      });
    } else {
      await fetchJson("/api/files/create-folder", {
        body: JSON.stringify({
          name,
          path: fileActionSession.path,
          root: fileActionSession.root,
        }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      });
    }
    closeFileActionModal();
    await loadFilesDirectory(filesView.root, filesView.path);
  } catch (error) {
    console.error(error);
    fileActionState.textContent =
      fileActionSession.mode === "rename" ? "Rename failed" : "Folder create failed";
  } finally {
    fileActionState.classList.remove("is-busy");
  }
}

async function loadFilePickerDirectory(rootId, relativePath = "") {
  filePickerState.hidden = false;
  filePickerState.textContent = "Loading...";
  filePickerState.classList.add("is-busy");
  try {
    const params = new URLSearchParams({ path: relativePath, root: rootId });
    const payload = await fetchJson(`/api/files/list?${params.toString()}`);
    filePickerSession.root = payload.root ?? rootId;
    filePickerSession.path = payload.path ?? relativePath;
    filePickerSession.entries = payload.entries ?? [];
    renderFilePicker();
    filePickerState.textContent = "";
    filePickerState.hidden = true;
  } catch (error) {
    console.error(error);
    filePickerState.textContent = "Load failed";
  } finally {
    filePickerState.classList.remove("is-busy");
  }
}

// ── Agents panel render ───────────────────────────────────────────────────

function renderAgentsPanel() {
  if (!agentMenu || !agentDetail) return;
  agentMenu.replaceChildren();
  for (const agent of agentFiles) {
    agentMenu.append(
      createMenuCard({
        id: agent.name,
        meta: [agent.domain, ...(agent.bundles ?? []).slice(0, 2)].filter(Boolean).join(" · ") || "template",
        name: agent.name,
        selected: agent.name === selectedAgentName,
        type: "agent",
      }),
    );
  }
  if (agentFiles.length === 0) {
    renderEmptyDetail(agentDetail, "No agents defined yet. Create an agent to get started.");
  }
}

async function loadAgentDetail(name) {
  setPanelScanState(PANEL_AGENTS, "Loading...", true);
  try {
    const data = await fetchJson(`/api/agents/read?name=${encodeURIComponent(name)}`);
    if (!agentDetail) return;
    const summary = agentFiles.find((entry) => entry.name === name) ?? null;

    const card = document.createElement("article");
    card.className = "source-card";
    card.dataset.agentName = name;

    const header = document.createElement("div");
    header.className = "source-card__header";
    const identity = document.createElement("div");
    identity.className = "source-card__identity";
    const title = document.createElement("p");
    title.className = "source-card__status";
    title.textContent = summary?.name ?? name;
    const meta = document.createElement("p");
    meta.className = "source-card__meta-detail";
    meta.textContent = [summary?.tier, summary?.role, summary?.model].filter(Boolean).join(" · ");
    identity.append(title, meta);
    const headerActions = document.createElement("div");
    headerActions.className = "source-card__actions";
    const saveBtn = document.createElement("button");
    saveBtn.className = "chrome-button source-card__button";
    saveBtn.type = "button";
    saveBtn.textContent = "save";
    saveBtn.addEventListener("click", async () => {
      setPanelScanState(PANEL_AGENTS, "Saving...", true);
      try {
        await fetchJson("/api/agents/write", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name, content: editor.value }),
        });
        setPanelScanState(PANEL_AGENTS, "Saved");
      } catch {
        setPanelScanState(PANEL_AGENTS, "Save failed");
      }
    });
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "chrome-button source-card__button";
    deleteBtn.type = "button";
    deleteBtn.textContent = "delete";
    deleteBtn.addEventListener("click", async () => {
      setPanelScanState(PANEL_AGENTS, "Deleting...", true);
      try {
        await fetchJson("/api/agents/delete", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name }),
        });
        const data2 = await fetchJson("/api/agents/list");
        agentFiles = data2.agents ?? [];
        selectedAgentName = null;
        setPanelScanState(PANEL_AGENTS, "");
        renderAgentsPanel();
      } catch {
        setPanelScanState(PANEL_AGENTS, "Delete failed");
      }
    });
    headerActions.append(saveBtn, deleteBtn);
    header.append(identity, headerActions);
    card.append(header);

    if (summary) {
      const frontmatter = document.createElement("div");
      frontmatter.className = "agent-frontmatter";
      for (const [label, value] of [
        ["tier", summary.tier ?? ""],
        ["role", summary.role ?? ""],
        ["model", summary.model ?? ""],
        ["skills", (summary.skills ?? []).join(", ") || "none"],
        ["tools", (summary.tools ?? []).join(", ") || "none"],
      ]) {
        const field = document.createElement("div");
        field.className = "agent-frontmatter__field";
        const lbl = document.createElement("span");
        lbl.className = "agent-frontmatter__label";
        lbl.textContent = label;
        const val = document.createElement("span");
        val.className = "agent-frontmatter__value";
        val.textContent = value;
        field.append(lbl, val);
        frontmatter.append(field);
      }
      card.append(frontmatter);
    }

    const editor = document.createElement("textarea");
    editor.className = "agent-editor";
    editor.value = data.content ?? "";
    editor.setAttribute("aria-label", `Agent definition for ${name}`);
    card.append(editor);

    agentDetail.replaceChildren(card);
    setPanelScanState(PANEL_AGENTS, "");
  } catch (error) {
    console.error("[orgos] loadAgentDetail", error);
    setPanelScanState(PANEL_AGENTS, "Load failed");
  }
}

// ── Skills panel render ───────────────────────────────────────────────────

function renderSkillsPanel() {
  if (!skillMenu || !skillDetail) return;
  skillMenu.replaceChildren();
  for (const skill of skillFiles) {
    skillMenu.append(
      createMenuCard({
        id: skill.name,
        meta: skill.context ? `${Math.round(skill.context / 1024)}k ctx` : "skill",
        name: skill.name,
        selected: skill.name === selectedSkillName,
        type: "skill",
      }),
    );
  }
  if (skillFiles.length === 0) {
    renderEmptyDetail(skillDetail, "No skill definitions found.");
  }
}

async function loadSkillDetail(name) {
  setPanelScanState(PANEL_SKILLS, "Loading...", true);
  try {
    const data = await fetchJson(`/api/skills/read?name=${encodeURIComponent(name)}`);
    if (!skillDetail) return;

    const card = document.createElement("article");
    card.className = "source-card";

    const header = document.createElement("div");
    header.className = "source-card__header";
    const identity = document.createElement("div");
    identity.className = "source-card__identity";
    const title = document.createElement("p");
    title.className = "source-card__status";
    title.textContent = name;
    const meta = document.createElement("p");
    meta.className = "source-card__meta-detail";
    meta.textContent = data.version ? `v${data.version}` : "skill definition";
    identity.append(title, meta);
    header.append(identity);
    card.append(header);

    const pre = document.createElement("pre");
    pre.className = "agent-editor";
    pre.textContent = data.content ?? "";
    card.append(pre);

    skillDetail.replaceChildren(card);
    setPanelScanState(PANEL_SKILLS, "");
  } catch (error) {
    console.error("[orgos] loadSkillDetail", error);
    setPanelScanState(PANEL_SKILLS, "Load failed");
  }
}

// ── Tools panel render ───────────────────────────────────────────────────

async function loadToolsPanel() {
  if (!toolRegistry) return;
  setPanelScanState(PANEL_TOOLS, "Loading...", true);
  try {
    const data = await fetchJson("/api/tools/list");
    const tools = data.tools ?? [];
    toolRegistry.replaceChildren();
    if (tools.length === 0) {
      toolRegistry.append(emptyDetailCard("No tools registered. Tools become available as sources are connected."));
      setPanelScanState(PANEL_TOOLS, "");
      return;
    }
    for (const tool of tools) {
      const card = document.createElement("article");
      card.className = "source-card tool-card";

      const header = document.createElement("div");
      header.className = "source-card__header";
      const identity = document.createElement("div");
      identity.className = "source-card__identity";
      const name = document.createElement("p");
      name.className = "source-card__status";
      name.textContent = tool.name;
      const scopeMeta = document.createElement("p");
      scopeMeta.className = "source-card__meta-detail";
      scopeMeta.textContent = tool.scope ?? "shared";
      identity.append(name, scopeMeta);
      header.append(identity);
      card.append(header);

      if (tool.file) {
        const detail = document.createElement("p");
        detail.className = "source-card__detail";
        detail.textContent = tool.file;
        card.append(detail);
      }

      toolRegistry.append(card);
    }
    setPanelScanState(PANEL_TOOLS, "");
  } catch (error) {
    console.error("[orgos] loadToolsPanel", error);
    setPanelScanState(PANEL_TOOLS, "Load failed");
  }
}

// ── Queue panel render ────────────────────────────────────────────────────

function renderQueuePanel() {
  if (!queueMetrics || !queueNodes || !queueItems) return;

  // Metrics
  const pending = queueState.filter((i) => i.status === "pending").length;
  const running = queueState.filter((i) => i.status === "running").length;
  const done = queueState.filter((i) => i.status === "done").length;
  const failed = queueState.filter((i) => i.status === "failed").length;

  queueMetrics.replaceChildren();
  for (const [label, value] of [
    ["pending", pending],
    ["running", running],
    ["done", done],
    ["failed", failed],
  ]) {
    const card = document.createElement("div");
    card.className = "queue-metric-card";
    const val = document.createElement("div");
    val.className = "queue-metric-card__value";
    val.textContent = String(value);
    const lbl = document.createElement("div");
    lbl.className = "queue-metric-card__label";
    lbl.textContent = label;
    card.append(val, lbl);
    queueMetrics.append(card);
  }

  // Node cards
  queueNodes.replaceChildren();
  for (const node of queueNodeState) {
    const card = document.createElement("div");
    card.className =
      "queue-node-card" +
      (node.status === "online" ? " is-online" : "") +
      (node.status === "offline" ? " is-offline" : "");
    const name = document.createElement("div");
    name.className = "queue-node-card__name";
    name.textContent = new URL(node.address).hostname;
    const model = document.createElement("div");
    model.className = "queue-node-card__model";
    model.textContent = node.loadedModel ?? "no model loaded";
    const status = document.createElement("div");
    status.className = "queue-node-card__status";
    status.textContent = `${node.status} · ${node.tier} · ${node.activeRequests} req`;
    card.append(name, model, status);
    queueNodes.append(card);
  }

  // Queue items
  queueItems.replaceChildren();
  if (queueState.length === 0) {
    queueItems.append(emptyDetailCard("No inference tasks queued. The queue will populate when agents are dispatched."));
    setPanelState(queueStateLabel, "");
    return;
  }
  const sorted = [...queueState].sort((a, b) => {
    const order = { running: 0, pending: 1, failed: 2, done: 3 };
    return (order[a.status] ?? 4) - (order[b.status] ?? 4);
  });
  for (const item of sorted) {
    const card = document.createElement("div");
    card.className = "queue-item-card";

    const badge = document.createElement("span");
    badge.className =
      "queue-item-status" +
      (item.status === "running" ? " queue-item-status--running" : "") +
      (item.status === "done" ? " queue-item-status--done" : "") +
      (item.status === "failed" ? " queue-item-status--failed" : "");
    badge.textContent = item.status;

    const info = document.createElement("div");
    const agentName = document.createElement("div");
    agentName.className = "queue-item-card__agent";
    agentName.textContent = item.agentId;
    const meta = document.createElement("div");
    meta.className = "queue-item-card__meta";
    meta.textContent = `${item.tier} · ${item.model || "no model"} · ${item.priority}`;
    info.append(agentName, meta);

    card.append(badge, info);
    queueItems.append(card);
  }
}

function emptyDetailCard(message) {
  const shell = document.createElement("div");
  shell.className = "text-empty-state";
  const note = document.createElement("p");
  note.className = "panel-copy";
  note.textContent = message;
  shell.append(note);
  return shell;
}

function ensureScheduleSelection() {
  selectedScheduleId = setSelectedIdIfMissing(scheduleTasks, selectedScheduleId);
}

function ensureMeetingSelection() {
  selectedMeetingId = setSelectedIdIfMissing(meetings, selectedMeetingId);
}

function ensureMailSelection() {
  selectedMailId = setSelectedIdIfMissing(mailMessages, selectedMailId);
}

function ensureProjectSelection() {
  selectedProjectId = setSelectedIdIfMissing(projects, selectedProjectId);
}

function ensureEvalSelection() {
  selectedEvalId = setSelectedIdIfMissing(evals, selectedEvalId);
}

function findHireSelection() {
  if (!hireState || !selectedHireKey) {
    return null;
  }
  const [type, id] = selectedHireKey.split(":");
  if (type === "department") {
    const item = hireState.departments.find((entry) => entry.id === id);
    return item ? { type, item } : null;
  }
  if (type === "team") {
    const item = hireState.teams.find((entry) => entry.id === id);
    return item ? { type, item } : null;
  }
  if (type === "role") {
    const item = hireState.roles.find((entry) => entry.id === id);
    return item ? { type, item } : null;
  }
  return null;
}

function ensureHireSelection() {
  if (!hireState) {
    selectedHireKey = null;
    return;
  }
  const all = [
    ...hireState.departments.map((item) => ({ key: `department:${item.id}` })),
    ...hireState.teams.map((item) => ({ key: `team:${item.id}` })),
    ...hireState.roles.map((item) => ({ key: `role:${item.id}` })),
  ];
  if (selectedHireKey && all.some((entry) => entry.key === selectedHireKey)) {
    return;
  }
  selectedHireKey = all[0]?.key ?? null;
}

function roleLabelMap() {
  return new Map((hireState?.roles ?? []).map((role) => [role.id, role.title]));
}

async function loadSchedulePanelData() {
  if (!activeOrganizationId) {
    scheduleTasks = [];
    selectedScheduleId = null;
    renderSchedulePanel();
    return;
  }
  setPanelState(scheduleState, "Loading...", true);
  try {
    const data = await fetchJson(`/api/flow/list?orgId=${encodeURIComponent(activeOrganizationId)}`);
    scheduleTasks = data.tasks ?? [];
    ensureScheduleSelection();
    setPanelState(scheduleState, "");
  } catch (error) {
    console.error(error);
    setPanelState(scheduleState, "Load failed");
  }
  renderSchedulePanel();
}

function renderSchedulePanel() {
  if (!scheduleList || !scheduleDetail) return;
  if (!activeOrganizationId) {
    scheduleList.replaceChildren();
    requireActiveOrganization(scheduleDetail, "Activate an organization to sequence flow objectives.");
    return;
  }
  ensureScheduleSelection();
  scheduleList.replaceChildren();
  scheduleTasks.forEach((task) => {
    scheduleList.append(
      createMenuCard({
        id: task.id,
        meta: describeFlowMeta(task),
        name: task.name || "untitled flow",
        selected: task.id === selectedScheduleId,
        type: "schedule",
      }),
    );
  });

  scheduleDetail.replaceChildren();
  const selected = scheduleTasks.find((task) => task.id === selectedScheduleId);
  if (!selected) {
    scheduleDetail.append(emptyDetailCard("Create a flow to sequence continuous work without idle time."));
    return;
  }

  const card = document.createElement("article");
  card.className = "source-card";
  card.dataset.scheduleId = selected.id;
  const dependencyOptions = scheduleTasks
    .filter((task) => task.id !== selected.id)
    .map((task) => `<option value="${task.id}">${escapeHtml(task.name || task.id)}</option>`)
    .join("");
  card.innerHTML = `
    <div class="source-card__header">
      <div class="source-card__identity">
        <p class="source-card__status">${selected.name || "untitled flow"}</p>
        <p class="source-card__meta-detail">${describeFlowMeta(selected)}</p>
      </div>
      <div class="source-card__actions">
        <button class="chrome-button source-card__button" data-action="save-schedule" type="button">save</button>
        <button class="chrome-button source-card__button" data-action="delete-schedule" type="button">delete</button>
      </div>
    </div>
    <div class="field-grid">
      <label class="field">
        <span class="field__label">flow</span>
        <input class="field__control" data-field="name" type="text" value="${escapeHtml(selected.name ?? "")}" />
      </label>
      <label class="field">
        <span class="field__label">cadence</span>
        <input class="field__control" data-field="cadence" type="text" value="${escapeHtml(selected.cadence ?? selected.cronExpression ?? "")}" />
      </label>
    </div>
    <div class="field-grid field-grid--compact">
      <label class="field">
        <span class="field__label">assignee type</span>
        <select class="field__control" data-field="assigneeType">
          <option value="agent_template">agent template</option>
          <option value="role_assignment">role assignment</option>
        </select>
      </label>
      <label class="field">
        <span class="field__label">assignee</span>
        <input class="field__control" data-field="assigneeValue" type="text" value="${escapeHtml(selected.assigneeValue ?? "")}" />
      </label>
    </div>
    <div class="field-grid field-grid--compact">
      <label class="field">
        <span class="field__label">workstream</span>
        <input class="field__control" data-field="workstream" type="text" value="${escapeHtml(selected.workstream ?? "")}" />
      </label>
      <label class="field">
        <span class="field__label">group</span>
        <input class="field__control" data-field="groupKey" type="text" value="${escapeHtml(selected.groupKey ?? "")}" />
      </label>
    </div>
    <div class="field-grid field-grid--compact">
      <label class="field">
        <span class="field__label">context</span>
        <input class="field__control" data-field="contextRequirement" type="number" min="1000" step="1000" value="${Number(selected.contextRequirement ?? 128000)}" />
      </label>
      <label class="source-card__toggle source-card__toggle--compact">
        <input class="source-card__checkbox" data-field="evaluationRequired" type="checkbox" ${selected.evaluationRequired ? "checked" : ""} />
        evaluation required
      </label>
    </div>
    <label class="field">
      <span class="field__label">depends on</span>
      <select class="field__control" data-field="dependencyIds" multiple size="4">
        ${dependencyOptions}
      </select>
    </label>
    <label class="field">
      <span class="field__label">objective</span>
      <textarea class="field__control field__control--textarea" data-field="objective">${escapeHtml(selected.objective ?? "")}</textarea>
    </label>
    <label class="field">
      <span class="field__label">notes</span>
      <textarea class="field__control field__control--textarea" data-field="notes">${escapeHtml(selected.notes ?? "")}</textarea>
    </label>
    <label class="source-card__toggle">
      <input class="source-card__checkbox" data-field="enabled" type="checkbox" ${selected.enabled ? "checked" : ""} />
      enabled
    </label>
  `;
  card.querySelector('[data-field="assigneeType"]').value = selected.assigneeType ?? "agent_template";
  const dependencySelect = card.querySelector('[data-field="dependencyIds"]');
  [...dependencySelect.options].forEach((option) => {
    option.selected = (selected.dependencyIds ?? []).includes(option.value);
  });
  scheduleDetail.append(card);
}

async function loadMeetPanelData() {
  if (!activeOrganizationId) {
    meetings = [];
    selectedMeetingId = null;
    renderMeetPanel();
    return;
  }
  setPanelState(meetState, "Loading...", true);
  try {
    const data = await fetchJson(`/api/meet/list?orgId=${encodeURIComponent(activeOrganizationId)}`);
    meetings = data.meetings ?? [];
    ensureMeetingSelection();
    setPanelState(meetState, "");
  } catch (error) {
    console.error(error);
    setPanelState(meetState, "Load failed");
  }
  renderMeetPanel();
}

function renderMeetPanel() {
  if (!meetingMenu || !meetDetail) return;
  if (!activeOrganizationId) {
    meetingMenu.replaceChildren();
    requireActiveOrganization(meetDetail, "Activate an organization to run structured meetings.");
    return;
  }
  ensureMeetingSelection();
  meetingMenu.replaceChildren();
  meetings.forEach((meeting) => {
    meetingMenu.append(
      createMenuCard({
        id: meeting.id,
        meta: meeting.status,
        name: meeting.title || "untitled meeting",
        selected: meeting.id === selectedMeetingId,
        type: "meeting",
      }),
    );
  });

  meetDetail.replaceChildren();
  const selected = meetings.find((meeting) => meeting.id === selectedMeetingId);
  if (!selected) {
    meetDetail.append(emptyDetailCard("Create a meeting to coordinate participants and capture consensus."));
    return;
  }

  const card = document.createElement("article");
  card.className = "source-card";
  card.dataset.meetingId = selected.id;
  card.innerHTML = `
    <div class="source-card__header">
      <div class="source-card__identity">
        <p class="source-card__status">${selected.title || "untitled meeting"}</p>
        <p class="source-card__meta-detail">${selected.status}</p>
      </div>
      <div class="source-card__actions">
        <button class="chrome-button source-card__button" data-action="save-meeting" type="button">save</button>
      </div>
    </div>
    <div class="field-grid field-grid--compact">
      <label class="field">
        <span class="field__label">title</span>
        <input class="field__control" data-field="title" type="text" value="${escapeHtml(selected.title ?? "")}" />
      </label>
      <label class="field">
        <span class="field__label">status</span>
        <select class="field__control" data-field="status">
          <option value="pending">pending</option>
          <option value="active">active</option>
          <option value="complete">complete</option>
        </select>
      </label>
    </div>
    <label class="field">
      <span class="field__label">participants</span>
      <input class="field__control" data-field="participants" type="text" value="${escapeHtml((selected.participants ?? []).join(", "))}" />
    </label>
    <label class="field">
      <span class="field__label">agenda</span>
      <textarea class="field__control field__control--textarea" data-field="agenda">${escapeHtml((selected.agenda ?? []).join("\n"))}</textarea>
    </label>
    <label class="field">
      <span class="field__label">summary</span>
      <textarea class="field__control field__control--textarea" data-field="summary">${escapeHtml(selected.summary ?? "")}</textarea>
    </label>
    <label class="field">
      <span class="field__label">consensus</span>
      <textarea class="field__control field__control--textarea" data-field="consensus">${escapeHtml(selected.consensus ?? "")}</textarea>
    </label>
    <label class="field">
      <span class="field__label">minutes</span>
      <textarea class="field__control field__control--textarea" data-field="minutes">${escapeHtml(selected.minutes ?? "")}</textarea>
    </label>
  `;
  card.querySelector('[data-field="status"]').value = selected.status ?? "pending";
  meetDetail.append(card);
}

async function loadMailPanelData() {
  if (!activeOrganizationId) {
    mailMessages = [];
    selectedMailId = null;
    renderMailPanel();
    return;
  }
  setPanelState(mailState, "Loading...", true);
  try {
    const data = await fetchJson(`/api/mail/list?orgId=${encodeURIComponent(activeOrganizationId)}&folder=${encodeURIComponent(mailFolder)}`);
    mailMessages = (data.messages ?? []).map((message) => ({ ...message, persisted: true }));
    ensureMailSelection();
    setPanelState(mailState, "");
  } catch (error) {
    console.error(error);
    setPanelState(mailState, "Load failed");
  }
  renderMailPanel();
}

function renderMailPanel() {
  if (!mailFolderMenu || !mailDetail) return;
  mailFolderMenu.querySelectorAll("[data-mail-folder]").forEach((button) => {
    button.classList.toggle("source-item--active", button.dataset.mailFolder === mailFolder);
  });
  if (!activeOrganizationId) {
    requireActiveOrganization(mailDetail, "Activate an organization to send and review mail.");
    return;
  }
  ensureMailSelection();
  const selected = mailMessages.find((message) => message.id === selectedMailId) ?? null;
  const wrapper = document.createElement("div");
  wrapper.className = "source-card";
  const items = mailMessages.map((message) => `
    <button class="source-menu-item__select ${message.id === selectedMailId ? "is-selected" : ""}" data-action="select-mail" data-mail-id="${message.id}" type="button">
      <span class="source-menu-item__row"><span class="source-menu-item__name">${escapeHtml(message.subject || "(no subject)")}</span></span>
      <span class="source-menu-item__meta">${escapeHtml(message.to || message.from || "")}</span>
    </button>
  `).join("");
  wrapper.innerHTML = `
    <div class="source-card__header">
      <div class="source-card__identity">
        <p class="source-card__status">${mailFolder}</p>
      </div>
      <div class="source-card__actions">
        <button class="chrome-button source-card__button" data-action="compose-mail" type="button">compose</button>
        ${selected ? '<button class="chrome-button source-card__button" data-action="save-mail" type="button">save</button>' : ""}
      </div>
    </div>
    <div class="source-menu">${items || '<p class="source-card__note">No messages yet.</p>'}</div>
    <div class="field-grid field-grid--compact">
      <label class="field">
        <span class="field__label">to</span>
        <input class="field__control" data-field="to" type="text" value="${escapeHtml(selected?.to ?? "")}" />
      </label>
      <label class="field">
        <span class="field__label">from</span>
        <input class="field__control" data-field="from" type="text" value="${escapeHtml(selected?.from ?? "human")}" />
      </label>
    </div>
    <label class="field">
      <span class="field__label">subject</span>
      <input class="field__control" data-field="subject" type="text" value="${escapeHtml(selected?.subject ?? "")}" />
    </label>
    <label class="field">
      <span class="field__label">message</span>
      <textarea class="field__control field__control--textarea" data-field="body">${escapeHtml(selected?.body ?? "")}</textarea>
    </label>
  `;
  mailDetail.replaceChildren(wrapper);
}

async function loadHirePanelData() {
  if (!activeOrganizationId) {
    hireState = null;
    selectedHireKey = null;
    renderHirePanel();
    return;
  }
  setPanelState(hireStateLabel, "Loading...", true);
  try {
    hireState = await fetchJson(`/api/staff/read?orgId=${encodeURIComponent(activeOrganizationId)}`);
    ensureHireSelection();
    setPanelState(hireStateLabel, "");
  } catch (error) {
    console.error(error);
    setPanelState(hireStateLabel, "Load failed");
  }
  renderHirePanel();
}

function renderHirePanel() {
  if (!hireMenu || !hireDetail) return;
  if (!activeOrganizationId) {
    hireMenu.replaceChildren();
    requireActiveOrganization(hireDetail, "Activate an organization to staff departments, teams, roles, and identities.");
    return;
  }
  ensureHireSelection();
  hireMenu.replaceChildren();
  (hireState?.departments ?? []).forEach((department) => {
    hireMenu.append(createMenuCard({
      id: department.id,
      meta: summarizeTemplateProvenance(department.templateId, department.templateSource, "department"),
      name: department.name || "new department",
      selected: selectedHireKey === `department:${department.id}`,
      type: "department",
    }));
  });
  (hireState?.teams ?? []).forEach((team) => {
    const department = hireState?.departments.find((entry) => entry.id === team.departmentId);
    hireMenu.append(createMenuCard({
      id: team.id,
      meta: [department?.name, summarizeTemplateProvenance(team.templateId, team.templateSource, "team")]
        .filter(Boolean)
        .join(" · "),
      name: team.name || "new team",
      selected: selectedHireKey === `team:${team.id}`,
      type: "team",
    }));
  });
  (hireState?.roles ?? []).forEach((role) => {
    const identity = findIdentityForRole(role.id);
    hireMenu.append(createMenuCard({
      id: role.id,
      meta: identity
        ? `employee ${identity.employeeNumber} · ${identity.name}`
        : `${role.status} · ${findRoleTemplateSummary(role.templateId)?.name || role.templateName || "unassigned"}`,
      name: role.title || "new role",
      selected: selectedHireKey === `role:${role.id}`,
      type: "role",
    }));
  });

  hireDetail.replaceChildren();
  const selection = findHireSelection();
  if (!selection) {
    hireDetail.append(emptyDetailCard("Add a department, team, or role to begin shaping the organization."));
    return;
  }

  const { type, item } = selection;
  const card = document.createElement("article");
  card.className = "source-card";
  card.dataset.hireType = type;
  card.dataset.hireId = item.id;

  if (type === "department") {
    const departmentTemplateOptions = getDepartmentTemplates().map((template) =>
      `<option value="${template.id}">${escapeHtml(template.name)}</option>`
    ).join("");
    card.innerHTML = `
      <div class="source-card__header">
        <div class="source-card__identity">
          <p class="source-card__status">${item.name || "new department"}</p>
          <p class="source-card__meta-detail">${escapeHtml(summarizeTemplateProvenance(item.templateId, item.templateSource, "department"))}</p>
        </div>
        <div class="source-card__actions">
          <button class="chrome-button source-card__button" data-action="save-hire" type="button">save</button>
          <button class="chrome-button source-card__button" data-action="delete-hire" type="button">delete</button>
        </div>
      </div>
      <label class="field"><span class="field__label">template</span><select class="field__control" data-field="templateId"><option value="">custom department</option>${departmentTemplateOptions}</select></label>
      <label class="field"><span class="field__label">department</span><input class="field__control" data-field="name" type="text" value="${escapeHtml(item.name ?? "")}" /></label>
      <label class="field"><span class="field__label">summary</span><textarea class="field__control field__control--textarea" data-field="summary">${escapeHtml(item.summary ?? "")}</textarea></label>
    `;
    card.querySelector('[data-field="templateId"]').value = item.templateId ?? "";
  } else if (type === "team") {
    const departmentOptions = (hireState?.departments ?? []).map((department) =>
      `<option value="${department.id}">${escapeHtml(department.name)}</option>`
    ).join("");
    const teamTemplateOptions = getTeamTemplates().map((template) =>
      `<option value="${template.id}">${escapeHtml(template.name)}</option>`
    ).join("");
    card.innerHTML = `
      <div class="source-card__header">
        <div class="source-card__identity">
          <p class="source-card__status">${item.name || "new team"}</p>
          <p class="source-card__meta-detail">${escapeHtml(summarizeTemplateProvenance(item.templateId, item.templateSource, "team"))}</p>
        </div>
        <div class="source-card__actions">
          <button class="chrome-button source-card__button" data-action="save-hire" type="button">save</button>
          <button class="chrome-button source-card__button" data-action="delete-hire" type="button">delete</button>
        </div>
      </div>
      <label class="field"><span class="field__label">template</span><select class="field__control" data-field="templateId"><option value="">custom team</option>${teamTemplateOptions}</select></label>
      <div class="field-grid field-grid--compact">
        <label class="field"><span class="field__label">team</span><input class="field__control" data-field="name" type="text" value="${escapeHtml(item.name ?? "")}" /></label>
        <label class="field"><span class="field__label">department</span><select class="field__control" data-field="departmentId">${departmentOptions}</select></label>
      </div>
      <label class="field"><span class="field__label">summary</span><textarea class="field__control field__control--textarea" data-field="summary">${escapeHtml(item.summary ?? "")}</textarea></label>
    `;
    card.querySelector('[data-field="templateId"]').value = item.templateId ?? "";
    card.querySelector('[data-field="departmentId"]').value = item.departmentId ?? "";
  } else {
    const identity = findIdentityForRole(item.id);
    const teamOptions = (hireState?.teams ?? []).map((team) =>
      `<option value="${team.id}">${escapeHtml(team.name)}</option>`
    ).join("");
    const agentOptions = agentFiles.map((agent) =>
      `<option value="${agent.name}">${escapeHtml(agent.name)}</option>`
    ).join("");
    const roleTemplateOptions = getRoleTemplates().map((template) =>
      `<option value="${template.id}">${escapeHtml(template.name)}</option>`
    ).join("");
    card.innerHTML = `
      <div class="source-card__header">
        <div class="source-card__identity">
          <p class="source-card__status">${item.title || "new role"}</p>
          <p class="source-card__meta-detail">${escapeHtml(summarizeTemplateProvenance(item.templateId, item.templateSource, "custom role"))}</p>
        </div>
        <div class="source-card__actions">
          <button class="chrome-button source-card__button" data-action="save-hire" type="button">save</button>
          <button class="chrome-button source-card__button" data-action="delete-hire" type="button">delete</button>
        </div>
      </div>
      <label class="field"><span class="field__label">template</span><select class="field__control" data-field="templateId"><option value="">custom role</option>${roleTemplateOptions}</select></label>
      <div class="field-grid field-grid--compact">
        <label class="field"><span class="field__label">role</span><input class="field__control" data-field="title" type="text" value="${escapeHtml(item.title ?? "")}" /></label>
        <label class="field"><span class="field__label">team</span><select class="field__control" data-field="teamId">${teamOptions}</select></label>
      </div>
      <div class="field-grid field-grid--compact">
        <label class="field"><span class="field__label">agent template</span><select class="field__control" data-field="templateName">${agentOptions}</select></label>
        <label class="field"><span class="field__label">tier</span><select class="field__control" data-field="tier"><option value="top">top</option><option value="mid">mid</option><option value="low">low</option></select></label>
      </div>
      <div class="field-grid field-grid--compact">
        <label class="field"><span class="field__label">status</span><select class="field__control" data-field="status"><option value="open">open</option><option value="assigned">assigned</option></select></label>
        <label class="field"><span class="field__label">assignee</span><input class="field__control" data-field="assigneeLabel" type="text" value="${escapeHtml(item.assigneeLabel ?? "")}" /></label>
      </div>
      <div class="field-grid field-grid--compact">
        <label class="field"><span class="field__label">evaluation focus</span><input class="field__control" data-field="evaluationFocus" type="text" value="${escapeHtml(item.evaluationFocus ?? "")}" /></label>
        <div class="field"><span class="field__label">bundles</span><div class="field__static">${renderBundleChips(item.bundleIds ?? [])}</div></div>
      </div>
      <div class="field-grid">
        <label class="field"><span class="field__label">required skills</span><textarea class="field__control field__control--textarea" data-field="requiredSkills">${escapeHtml(formatListForTextarea(item.requiredSkills))}</textarea></label>
        <label class="field"><span class="field__label">required tools</span><textarea class="field__control field__control--textarea" data-field="requiredTools">${escapeHtml(formatListForTextarea(item.requiredTools))}</textarea></label>
      </div>
      <div class="field-grid field-grid--compact">
        <label class="field"><span class="field__label">identity</span><input class="field__control" type="text" value="${escapeHtml(identity?.name ?? "not generated")}" readonly /></label>
        <label class="field"><span class="field__label">employee</span><input class="field__control" type="text" value="${identity ? `employee ${identity.employeeNumber}` : "unassigned"}" readonly /></label>
      </div>
      <label class="field"><span class="field__label">persona</span><textarea class="field__control field__control--textarea" readonly>${escapeHtml(identity?.personaSummary ?? "Identity will be generated during auto bootstrap or when assigned.")}</textarea></label>
      <div class="field-grid field-grid--compact">
        <label class="field"><span class="field__label">memory root</span><input class="field__control" type="text" value="${escapeHtml(identity?.memoryRoot ?? "memory/pending")}" readonly /></label>
        <label class="field"><span class="field__label">prompt file</span><input class="field__control" type="text" value="${escapeHtml(identity?.promptFile ?? "prompts/agents/pending.txt")}" readonly /></label>
      </div>
      <label class="field"><span class="field__label">notes</span><textarea class="field__control field__control--textarea" data-field="notes">${escapeHtml(item.notes ?? "")}</textarea></label>
    `;
    card.querySelector('[data-field="templateId"]').value = item.templateId ?? "";
    card.querySelector('[data-field="teamId"]').value = item.teamId ?? "";
    card.querySelector('[data-field="templateName"]').value = item.templateName ?? "";
    card.querySelector('[data-field="tier"]').value = item.tier ?? "mid";
    card.querySelector('[data-field="status"]').value = item.status ?? "open";
  }
  hireDetail.append(card);
}

async function loadProjectsPanelData() {
  if (!activeOrganizationId) {
    projects = [];
    selectedProjectId = null;
    renderProjectsPanel();
    return;
  }
  setPanelState(projectsStateLabel, "Loading...", true);
  try {
    const data = await fetchJson(`/api/projects/list?orgId=${encodeURIComponent(activeOrganizationId)}`);
    projects = data.projects ?? [];
    ensureProjectSelection();
    setPanelState(projectsStateLabel, "");
  } catch (error) {
    console.error(error);
    setPanelState(projectsStateLabel, "Load failed");
  }
  renderProjectsPanel();
}

function renderProjectsPanel() {
  if (!projectsMenu || !projectsDetail) return;
  if (!activeOrganizationId) {
    projectsMenu.replaceChildren();
    requireActiveOrganization(projectsDetail, "Activate an organization to define projects and participants.");
    return;
  }
  ensureProjectSelection();
  projectsMenu.replaceChildren();
  projects.forEach((project) => {
    projectsMenu.append(createMenuCard({
      id: project.id,
      meta: project.status,
      name: project.name || "untitled project",
      selected: project.id === selectedProjectId,
      type: "project",
    }));
  });
  projectsDetail.replaceChildren();
  const selected = projects.find((project) => project.id === selectedProjectId);
  if (!selected) {
    projectsDetail.append(emptyDetailCard("Create a project to coordinate participants and outputs."));
    return;
  }
  const roleNames = roleLabelMap();
  const checklist = (hireState?.roles ?? []).map((role) => `
    <label class="source-card__toggle">
      <input class="source-card__checkbox" data-field="participantRoleIds" data-role-id="${role.id}" type="checkbox" ${selected.participantRoleIds?.includes(role.id) ? "checked" : ""} />
      ${escapeHtml(role.title)}
    </label>
  `).join("");
  const card = document.createElement("article");
  card.className = "source-card";
  card.dataset.projectId = selected.id;
  card.innerHTML = `
    <div class="source-card__header">
      <div class="source-card__identity"><p class="source-card__status">${selected.name || "untitled project"}</p></div>
      <div class="source-card__actions">
        <button class="chrome-button source-card__button" data-action="save-project" type="button">save</button>
        <button class="chrome-button source-card__button" data-action="delete-project" type="button">delete</button>
      </div>
    </div>
    <div class="field-grid field-grid--compact">
      <label class="field"><span class="field__label">project</span><input class="field__control" data-field="name" type="text" value="${escapeHtml(selected.name ?? "")}" /></label>
      <label class="field"><span class="field__label">status</span><select class="field__control" data-field="status"><option value="draft">draft</option><option value="active">active</option><option value="blocked">blocked</option><option value="done">done</option></select></label>
    </div>
    <label class="field"><span class="field__label">summary</span><textarea class="field__control field__control--textarea" data-field="summary">${escapeHtml(selected.summary ?? "")}</textarea></label>
    <label class="field"><span class="field__label">outputs</span><textarea class="field__control field__control--textarea" data-field="outputs">${escapeHtml(selected.outputs ?? "")}</textarea></label>
    <div class="field"><span class="field__label">participants</span><div class="json-node__body">${checklist || '<p class="source-card__note">No hired roles available yet.</p>'}</div></div>
    <p class="source-card__note">${(selected.participantRoleIds ?? []).map((id) => roleNames.get(id)).filter(Boolean).join(", ") || "No participants selected."}</p>
  `;
  card.querySelector('[data-field="status"]').value = selected.status ?? "draft";
  projectsDetail.append(card);
}

async function loadEvalsPanelData() {
  if (!activeOrganizationId) {
    evals = [];
    selectedEvalId = null;
    renderEvalsPanel();
    return;
  }
  setPanelState(evalsStateLabel, "Loading...", true);
  try {
    const data = await fetchJson(`/api/evals/list?orgId=${encodeURIComponent(activeOrganizationId)}`);
    evals = data.evals ?? [];
    ensureEvalSelection();
    setPanelState(evalsStateLabel, "");
  } catch (error) {
    console.error(error);
    setPanelState(evalsStateLabel, "Load failed");
  }
  renderEvalsPanel();
}

function renderEvalsPanel() {
  if (!evalsMenu || !evalsDetail) return;
  if (!activeOrganizationId) {
    evalsMenu.replaceChildren();
    requireActiveOrganization(evalsDetail, "Activate an organization to define evaluations.");
    return;
  }
  ensureEvalSelection();
  evalsMenu.replaceChildren();
  evals.forEach((evalRecord) => {
    evalsMenu.append(createMenuCard({
      id: evalRecord.id,
      meta: evalRecord.status,
      name: evalRecord.name || "untitled eval",
      selected: evalRecord.id === selectedEvalId,
      type: "eval",
    }));
  });
  evalsDetail.replaceChildren();
  const selected = evals.find((evalRecord) => evalRecord.id === selectedEvalId);
  if (!selected) {
    evalsDetail.append(emptyDetailCard("Create an evaluation to track expectations and results."));
    return;
  }
  const card = document.createElement("article");
  card.className = "source-card";
  card.dataset.evalId = selected.id;
  card.innerHTML = `
    <div class="source-card__header">
      <div class="source-card__identity"><p class="source-card__status">${selected.name || "untitled eval"}</p></div>
      <div class="source-card__actions">
        <button class="chrome-button source-card__button" data-action="save-eval" type="button">save</button>
        <button class="chrome-button source-card__button" data-action="delete-eval" type="button">delete</button>
      </div>
    </div>
    <div class="field-grid field-grid--compact">
      <label class="field"><span class="field__label">eval</span><input class="field__control" data-field="name" type="text" value="${escapeHtml(selected.name ?? "")}" /></label>
      <label class="field"><span class="field__label">status</span><select class="field__control" data-field="status"><option value="draft">draft</option><option value="passing">passing</option><option value="failing">failing</option></select></label>
    </div>
    <div class="field-grid field-grid--compact">
      <label class="field"><span class="field__label">target type</span><select class="field__control" data-field="targetType"><option value="agent">agent</option><option value="prompt">prompt</option><option value="skill">skill</option><option value="tool">tool</option><option value="workflow">workflow</option></select></label>
      <label class="field"><span class="field__label">target ref</span><input class="field__control" data-field="targetRef" type="text" value="${escapeHtml(selected.targetRef ?? "")}" /></label>
    </div>
    <label class="field"><span class="field__label">criteria</span><textarea class="field__control field__control--textarea" data-field="criteria">${escapeHtml(selected.criteria ?? "")}</textarea></label>
    <label class="field"><span class="field__label">prompt</span><textarea class="field__control field__control--textarea" data-field="prompt">${escapeHtml(selected.prompt ?? "")}</textarea></label>
    <div class="field-grid field-grid--compact">
      <label class="field"><span class="field__label">score</span><input class="field__control" data-field="score" type="text" value="${escapeHtml(selected.score ?? "")}" /></label>
      <label class="field"><span class="field__label">result</span><input class="field__control" data-field="resultSummary" type="text" value="${escapeHtml(selected.resultSummary ?? "")}" /></label>
    </div>
  `;
  card.querySelector('[data-field="status"]').value = selected.status ?? "draft";
  card.querySelector('[data-field="targetType"]').value = selected.targetType ?? "workflow";
  evalsDetail.append(card);
}

function updateScheduleField(id, field, value) {
  const task = scheduleTasks.find((entry) => entry.id === id);
  if (!task) return;
  if (field === "dependencyIds") {
    task.dependencyIds = value;
    return;
  }
  if (field === "contextRequirement") {
    task.contextRequirement = Number(value) || 128000;
    return;
  }
  task[field] = value;
}

async function saveScheduleTask(id) {
  const task = scheduleTasks.find((entry) => entry.id === id);
  if (!task || !activeOrganizationId) return;
  setPanelState(scheduleState, "Saving...", true);
  try {
    const saved = await fetchJson("/api/flow/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...task, orgId: activeOrganizationId }),
    });
    scheduleTasks = scheduleTasks.map((entry) => (entry.id === id ? saved : entry));
    setPanelState(scheduleState, "Saved");
  } catch (error) {
    console.error(error);
    setPanelState(scheduleState, "Save failed");
  }
  renderSchedulePanel();
}

async function deleteScheduleTaskRecord(id) {
  if (!activeOrganizationId) return;
  await fetchJson("/api/flow/delete", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id, orgId: activeOrganizationId }),
  });
  scheduleTasks = scheduleTasks.filter((entry) => entry.id !== id);
  ensureScheduleSelection();
  renderSchedulePanel();
}

function addScheduleTask() {
  const item = {
    id: crypto.randomUUID(),
    name: "new flow",
    cadence: "continuous",
    contextRequirement: 128000,
    dependencyIds: [],
    evaluationRequired: false,
    groupKey: "",
    workstream: "",
    assigneeType: "agent_template",
    assigneeValue: agentFiles[0]?.name ?? "",
    enabled: true,
    notes: "",
    objective: "",
    trigger: "auto",
    createdAt: new Date().toISOString(),
    lastRunAt: null,
    agentId: "",
  };
  scheduleTasks = [item, ...scheduleTasks];
  selectedScheduleId = item.id;
  renderSchedulePanel();
}

function updateMeetingField(id, field, value) {
  const meeting = meetings.find((entry) => entry.id === id);
  if (!meeting) return;
  if (field === "participants") {
    meeting.participants = value.split(",").map((item) => item.trim()).filter(Boolean);
    return;
  }
  if (field === "agenda") {
    meeting.agenda = value.split("\n").map((item) => item.trim()).filter(Boolean);
    return;
  }
  meeting[field] = value;
}

async function saveMeetingRecord(id) {
  const meeting = meetings.find((entry) => entry.id === id);
  if (!meeting || !activeOrganizationId) return;
  setPanelState(meetState, "Saving...", true);
  try {
    const saved = await fetchJson("/api/meet/write", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...meeting, orgId: activeOrganizationId }),
    });
    meetings = meetings.map((entry) => (entry.id === id ? saved : entry));
    setPanelState(meetState, "Saved");
  } catch (error) {
    console.error(error);
    setPanelState(meetState, "Save failed");
  }
  renderMeetPanel();
}

async function addMeetingRecord() {
  if (!activeOrganizationId) return;
  setPanelState(meetState, "Creating...", true);
  try {
    const meeting = await fetchJson("/api/meet/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        orgId: activeOrganizationId,
        title: "new meeting",
      }),
    });
    meetings = [meeting, ...meetings];
    selectedMeetingId = meeting.id;
    setPanelState(meetState, "Created");
  } catch (error) {
    console.error(error);
    setPanelState(meetState, "Create failed");
  }
  renderMeetPanel();
}

function updateMailField(id, field, value) {
  const message = mailMessages.find((entry) => entry.id === id);
  if (!message) return;
  message[field] = value;
}

function composeMailMessage() {
  const message = {
    id: crypto.randomUUID(),
    subject: "",
    body: "",
    to: "",
    from: "human",
    folder: "outbox",
    readAt: null,
    sentAt: new Date().toISOString(),
    orgId: activeOrganizationId,
  };
  mailMessages = [message, ...mailMessages];
  selectedMailId = message.id;
  renderMailPanel();
}

async function saveMailMessageRecord(id) {
  const message = mailMessages.find((entry) => entry.id === id);
  if (!message || !activeOrganizationId) return;
  setPanelState(mailState, "Saving...", true);
  try {
    if (mailMessages.filter((entry) => entry.id === id).length && !message.persisted) {
      const saved = await fetchJson("/api/mail/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...message, orgId: activeOrganizationId }),
      });
      saved.persisted = true;
      mailMessages = mailMessages.map((entry) => (entry.id === id ? saved : entry));
      selectedMailId = saved.id;
    } else {
      const saved = await fetchJson("/api/mail/write", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...message, orgId: activeOrganizationId }),
      });
      saved.persisted = true;
      mailMessages = mailMessages.map((entry) => (entry.id === id ? saved : entry));
    }
    setPanelState(mailState, "Saved");
  } catch (error) {
    console.error(error);
    setPanelState(mailState, "Save failed");
  }
  renderMailPanel();
}

function createEmptyHireState() {
  return {
    departments: [],
    identities: [],
    roles: [],
    teams: [],
    updatedAt: new Date().toISOString(),
    version: 1,
  };
}

function addHireRecord(type) {
  hireState = hireState ?? createEmptyHireState();
  if (type === "department") {
    const item = {
      id: crypto.randomUUID(),
      name: "new department",
      summary: "",
      templateId: "",
      templateSource: "system",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    hireState.departments.unshift(item);
    selectedHireKey = `department:${item.id}`;
  } else if (type === "team") {
    const item = {
      id: crypto.randomUUID(),
      departmentId: hireState.departments[0]?.id ?? "",
      name: "new team",
      summary: "",
      templateId: "",
      templateSource: "system",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    hireState.teams.unshift(item);
    selectedHireKey = `team:${item.id}`;
  } else {
    const item = {
      id: crypto.randomUUID(),
      assigneeLabel: "",
      bundleIds: [],
      createdAt: new Date().toISOString(),
      evaluationFocus: "",
      notes: "",
      requiredSkills: [],
      requiredTools: [],
      status: "open",
      teamId: hireState.teams[0]?.id ?? "",
      templateId: "",
      templateName: agentFiles[0]?.name ?? "",
      templateSource: "system",
      tier: "mid",
      title: "new role",
      updatedAt: new Date().toISOString(),
    };
    hireState.roles.unshift(item);
    selectedHireKey = `role:${item.id}`;
  }
  renderHirePanel();
}

function updateHireField(type, id, field, value) {
  const list = type === "department" ? hireState?.departments : type === "team" ? hireState?.teams : hireState?.roles;
  const record = list?.find((entry) => entry.id === id);
  if (!record) return;
  if (type === "department" && field === "templateId") {
    applyDepartmentTemplate(record, value);
    record.updatedAt = new Date().toISOString();
    renderHirePanel();
    return;
  }
  if (type === "team" && field === "templateId") {
    applyTeamTemplate(record, value);
    record.updatedAt = new Date().toISOString();
    renderHirePanel();
    return;
  }
  if (type === "role" && field === "templateId") {
    applyRoleTemplate(record, value);
    record.updatedAt = new Date().toISOString();
    renderHirePanel();
    return;
  }
  if (type === "role" && (field === "requiredSkills" || field === "requiredTools")) {
    record[field] = String(value).split("\n").map((item) => item.trim()).filter(Boolean);
    record.updatedAt = new Date().toISOString();
    return;
  }
  record[field] = value;
  record.updatedAt = new Date().toISOString();
}

async function saveHireStateRecord() {
  if (!hireState || !activeOrganizationId) return;
  setPanelState(hireStateLabel, "Saving...", true);
  try {
    hireState = await fetchJson("/api/staff/write", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...hireState, orgId: activeOrganizationId }),
    });
    setPanelState(hireStateLabel, "Saved");
  } catch (error) {
    console.error(error);
    setPanelState(hireStateLabel, "Save failed");
  }
  renderHirePanel();
}

function deleteHireRecord(type, id) {
  if (!hireState) return;
  if (type === "department") {
    const teamIds = hireState.teams.filter((entry) => entry.departmentId === id).map((entry) => entry.id);
    hireState.departments = hireState.departments.filter((entry) => entry.id !== id);
    hireState.teams = hireState.teams.filter((entry) => entry.departmentId !== id);
    hireState.roles = hireState.roles.filter((entry) => !teamIds.includes(entry.teamId));
  } else if (type === "team") {
    hireState.teams = hireState.teams.filter((entry) => entry.id !== id);
    hireState.roles = hireState.roles.filter((entry) => entry.teamId !== id);
  } else {
    hireState.roles = hireState.roles.filter((entry) => entry.id !== id);
  }
  ensureHireSelection();
  renderHirePanel();
}

function addProjectRecord() {
  const project = {
    id: crypto.randomUUID(),
    name: "new project",
    outputs: "",
    participantRoleIds: [],
    status: "draft",
    summary: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  projects = [project, ...projects];
  selectedProjectId = project.id;
  renderProjectsPanel();
}

function updateProjectField(id, field, value, roleId = null) {
  const project = projects.find((entry) => entry.id === id);
  if (!project) return;
  if (field === "participantRoleIds" && roleId) {
    project.participantRoleIds = value
      ? [...new Set([...(project.participantRoleIds ?? []), roleId])]
      : (project.participantRoleIds ?? []).filter((entry) => entry !== roleId);
  } else {
    project[field] = value;
  }
  project.updatedAt = new Date().toISOString();
}

async function saveProjectRecord(id) {
  const project = projects.find((entry) => entry.id === id);
  if (!project || !activeOrganizationId) return;
  setPanelState(projectsStateLabel, "Saving...", true);
  try {
    const saved = await fetchJson("/api/projects/write", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...project, orgId: activeOrganizationId }),
    });
    projects = projects.map((entry) => (entry.id === id ? saved : entry));
    setPanelState(projectsStateLabel, "Saved");
  } catch (error) {
    console.error(error);
    setPanelState(projectsStateLabel, "Save failed");
  }
  renderProjectsPanel();
}

async function deleteProjectRecord(id) {
  if (!activeOrganizationId) return;
  await fetchJson("/api/projects/delete", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id, orgId: activeOrganizationId }),
  });
  projects = projects.filter((entry) => entry.id !== id);
  ensureProjectSelection();
  renderProjectsPanel();
}

function addEvalRecord() {
  const evalRecord = {
    id: crypto.randomUUID(),
    name: "new eval",
    criteria: "",
    prompt: "",
    resultSummary: "",
    score: "",
    status: "draft",
    targetRef: "",
    targetType: "workflow",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  evals = [evalRecord, ...evals];
  selectedEvalId = evalRecord.id;
  renderEvalsPanel();
}

function updateEvalField(id, field, value) {
  const evalRecord = evals.find((entry) => entry.id === id);
  if (!evalRecord) return;
  evalRecord[field] = value;
  evalRecord.updatedAt = new Date().toISOString();
}

function applyOrganizationsPayload(organizationsState) {
  openOrganizationIds = Array.isArray(organizationsState.openOrganizationIds)
    ? organizationsState.openOrganizationIds
    : [];
  organizationModes = organizationsState.organizationModes ?? {};
  organizationAppearanceOverrides = organizationsState.organizationAppearanceOverrides ?? {};
  runtimeOrganizations = organizationsState.organizationRuntime ?? runtimeOrganizations;
  organizations = (organizationsState.organizations ?? []).map((organization) =>
    normalizeOrganization({
      ...organization,
      appearanceAccent: organizationAppearanceOverrides[organization.id]?.accent,
      appearanceTheme: organizationAppearanceOverrides[organization.id]?.theme,
      mode: organizationModes[organization.id] ?? "idle",
      open: openOrganizationIds.includes(organization.id),
    })
  );
  activeOrganizationId = organizationsState.activeOrganizationId ?? null;
  organizationDrafts = new Map(
    organizations.filter((entry) => entry.persisted).map((entry) => [entry.id, { ...entry }]),
  );
  if (activeOrganizationId) {
    touchOrganizationRecent(activeOrganizationId);
  }
  organizations = sortOrganizations(organizations);
  filesystemRoots = filesystemRoots.map((root) =>
    root.id === "organization"
      ? {
        ...root,
        available: Boolean(activeOrganizationId),
        label: organizations.find((entry) => entry.id === activeOrganizationId)?.name ?? "organization",
      }
      : root.id === "deleted"
        ? { ...root, available: Boolean(activeOrganizationId) }
        : root
  );
  syncFilesystemState();
  renderOrganizations();
  renderFilesPanel();
  renderTextPanel();
  renderSystemMode();
  applyAppearance();
  renderNotifications();
  renderStatusPanel();
}

async function saveEvalRecord(id) {
  const evalRecord = evals.find((entry) => entry.id === id);
  if (!evalRecord || !activeOrganizationId) return;
  setPanelState(evalsStateLabel, "Saving...", true);
  try {
    const saved = await fetchJson("/api/evals/write", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...evalRecord, orgId: activeOrganizationId }),
    });
    evals = evals.map((entry) => (entry.id === id ? saved : entry));
    setPanelState(evalsStateLabel, "Saved");
  } catch (error) {
    console.error(error);
    setPanelState(evalsStateLabel, "Save failed");
  }
  renderEvalsPanel();
}

async function deleteEvalRecord(id) {
  if (!activeOrganizationId) return;
  await fetchJson("/api/evals/delete", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id, orgId: activeOrganizationId }),
  });
  evals = evals.filter((entry) => entry.id !== id);
  ensureEvalSelection();
  renderEvalsPanel();
}

function connectQueueSSE() {
  if (queueSSE) {
    queueSSE.close();
    queueSSE = null;
  }
  queueSSE = new EventSource("/__queue");
  queueSSE.addEventListener("queue:snapshot", (event) => {
    queueState = JSON.parse(event.data);
    // Refresh node telemetry alongside the queue snapshot
    fetchJson("/api/queue/state").then((data) => {
      queueNodeState = data.nodes ?? [];
      renderQueuePanel();
    }).catch(() => { renderQueuePanel(); });
  });
  queueSSE.addEventListener("queue:enqueue", (event) => {
    const item = JSON.parse(event.data);
    queueState = queueState.filter((i) => i.id !== item.id);
    queueState.push(item);
    renderQueuePanel();
  });
  queueSSE.addEventListener("queue:update", (event) => {
    const update = JSON.parse(event.data);
    queueState = queueState.map((i) => (i.id === update.id ? { ...i, ...update } : i));
    renderQueuePanel();
  });
  queueSSE.addEventListener("queue:done", (event) => {
    const update = JSON.parse(event.data);
    queueState = queueState.map((i) => (i.id === update.id ? { ...i, ...update } : i));
    renderQueuePanel();
  });
  queueSSE.addEventListener("queue:failed", (event) => {
    const update = JSON.parse(event.data);
    queueState = queueState.map((i) => (i.id === update.id ? { ...i, ...update } : i));
    renderQueuePanel();
  });
  queueSSE.onerror = () => {
    logEvent("queue_sse_error");
  };
}

function renderFilePicker() {
  filePickerRootMenu.replaceChildren();
  filesystemRoots.forEach((rootMeta) => {
    filePickerRootMenu.append(
      createRootMenuItem(rootMeta, rootMeta.id === filePickerSession.root, "pick-root"),
    );
  });

  filePickerPath.textContent = formatPathLabel(filePickerSession.root, filePickerSession.path);
  filePickerEntries.replaceChildren();
  if (filePickerSession.path) {
    filePickerEntries.append(
      createFolderMenuItem("up one level", parentRelativePath(filePickerSession.path), "parent", "parent"),
    );
  }
  filePickerSession.entries
    .filter((entry) => entry.type === "directory" || entry.editable)
    .forEach((entry) => {
      filePickerEntries.append(
        createFileEntry(entry, filePickerSession.mode === "save" ? "picker-save" : "picker-open"),
      );
    });
}

async function confirmFilePicker() {
  if (filePickerSession.mode !== "save") {
    return;
  }

  const documentRecord = textDocuments.find((entry) => entry.id === filePickerSession.targetDocumentId);
  if (!documentRecord) {
    return;
  }

  const filename = filePickerFilename.value.trim().replace(/[\\/]+/g, "");
  if (!filename) {
    filePickerState.hidden = false;
    filePickerState.textContent = "Filename required";
    return;
  }

  savingTextDocumentIds.add(documentRecord.id);
  renderTextPanel();
  filePickerState.hidden = false;
  filePickerState.textContent = "Saving...";
  filePickerState.classList.add("is-busy");
  try {
    const relativePath = [filePickerSession.path, `${filename}.${filePickerExtension.value}`]
      .filter(Boolean)
      .join("/");
    const payload = await fetchJson("/api/text/write", {
      body: JSON.stringify({
        content: documentRecord.content,
        overwrite: false,
        path: relativePath,
        root: filePickerSession.root,
      }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });

    documentRecord.extension = payload.extension.replace(".", "");
    documentRecord.name = payload.name;
    documentRecord.path = payload.path;
    documentRecord.persisted = true;
    documentRecord.root = payload.root;
    documentRecord.savedContent = documentRecord.content;
    closeFilePicker();
    setTextState("Saved");
  } catch (error) {
    console.error(error);
    filePickerState.textContent = String(error).includes("409")
      ? "File already exists"
      : "Save failed";
  } finally {
    savingTextDocumentIds.delete(documentRecord.id);
    filePickerState.classList.remove("is-busy");
    renderTextPanel();
  }
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
          archetypeId: organization.archetypeId,
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

    applyOrganizationsPayload(organizationsState);
    const match =
      organizations.find((entry) => entry.id === organization.id) ??
      organizations.find((entry) => normalizeOrganizationNameKey(entry.name) === normalizeOrganizationNameKey(organization.name));
    if (match) {
      selectedOrganizationId = match.id;
      touchOrganizationRecent(match.id);
    }
    openPanel(PANEL_ABOUT);
    setAboutState("Organization saved");
    if (systemMode === "auto" && activeOrganizationId) {
      await bootstrapAutoMode();
    }
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

    applyOrganizationsPayload(organizationsState);
    touchOrganizationRecent(organizationId);
    selectedOrganizationId = organizationId;
    openPanel(PANEL_ABOUT);
    setAboutState("Organization active");
    if (systemMode === "auto" && activeOrganizationId) {
      await bootstrapAutoMode();
    }
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

  applyOrganizationsPayload(organizationsState);
  organizationRecentIds = organizationRecentIds.filter((id) => id !== organizationId);

  if (activeOrganizationId) {
    touchOrganizationRecent(activeOrganizationId);
    const selectedExists = organizations.some((organization) => organization.id === selectedOrganizationId);
    selectedOrganizationId = selectedExists ? selectedOrganizationId : activeOrganizationId;
    setAboutState("Organization deleted");
    openPanel(PANEL_ABOUT);
  } else if (organizations.length > 0) {
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
  renderFilesPanel();
  renderTextPanel();
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
  renderFilesPanel();
  renderTextPanel();
}

async function setOrganizationRuntime(organizationId, payload) {
  const organizationsState = await fetchJson("/api/organizations/runtime", {
    body: JSON.stringify({ id: organizationId, ...payload }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  applyOrganizationsPayload(organizationsState);
}

async function setOrganizationAppearanceOverride(organizationId, payload) {
  const organizationsState = await fetchJson("/api/organizations/appearance", {
    body: JSON.stringify({ id: organizationId, ...payload }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  applyOrganizationsPayload(organizationsState);
}

async function markNotificationRead(notificationId, unread = false) {
  await fetchJson("/api/notifications/read", {
    body: JSON.stringify({ id: notificationId, unread }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  boardNotifications = boardNotifications.map((notification) =>
    notification.id === notificationId ? { ...notification, unread } : notification
  );
  renderNotifications();
  renderOrganizations();
  renderStatusPanel();
}

async function openNotificationTarget(notificationId) {
  const notification = boardNotifications.find((entry) => entry.id === notificationId);
  if (!notification) {
    return;
  }
  notificationsOpen = false;
  if (notification.organizationId) {
    await setOrganizationRuntime(notification.organizationId, { active: true, open: true });
    selectedOrganizationId = notification.organizationId;
  }
  if (notification.targetPanel) {
    openPanel(notification.targetPanel);
  }
  await markNotificationRead(notificationId, false);
}

function openPanel(panelId) {
  tabNavIndex = -1;
  openPanelIds = [panelId, ...openPanelIds.filter((item) => item !== panelId)];
  activePanelId = panelId;
  showingDesktop = false;
  renderPanels();
  if (panelId === PANEL_FILES) {
    void loadFilesDirectory(filesView.root, filesView.path);
  }
  if (panelId === PANEL_WEB) {
    void loadWebPanelData();
  }
  if (panelId === PANEL_QUEUE) {
    connectQueueSSE();
  }
  if (panelId === PANEL_AGENTS) {
    setPanelScanState(PANEL_AGENTS, "Loading...", true);
    fetchJson("/api/agents/list").then((data) => {
      agentFiles = data.agents ?? [];
      setPanelScanState(PANEL_AGENTS, "");
      renderAgentsPanel();
    }).catch(() => {
      setPanelScanState(PANEL_AGENTS, "Load failed");
    });
  }
  if (panelId === PANEL_SKILLS) {
    setPanelScanState(PANEL_SKILLS, "Loading...", true);
    fetchJson("/api/skills/list").then((data) => {
      skillFiles = data.skills ?? [];
      setPanelScanState(PANEL_SKILLS, "");
      renderSkillsPanel();
    }).catch(() => {
      setPanelScanState(PANEL_SKILLS, "Load failed");
    });
  }
  if (panelId === PANEL_TOOLS) {
    void loadToolsPanel();
  }
  if (panelId === PANEL_SCHEDULE) {
    void loadSchedulePanelData();
  }
  if (panelId === PANEL_MEET) {
    void loadMeetPanelData();
  }
  if (panelId === PANEL_MAIL) {
    void loadMailPanelData();
  }
  if (panelId === PANEL_HIRE) {
    void loadHirePanelData();
  }
  if (panelId === PANEL_PROJECTS) {
    void loadProjectsPanelData();
  }
  if (panelId === PANEL_EVALS) {
    void loadEvalsPanelData();
  }
}

function closePanel(panelId) {
  tabNavIndex = -1;
  openPanelIds = openPanelIds.filter((item) => item !== panelId);
  if (activePanelId === panelId) {
    activePanelId = openPanelIds[0] ?? null;
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
  statusPanel.hidden = activePanelId !== PANEL_STATUS || showingDesktop;
  sourcesPanel.hidden = activePanelId !== PANEL_SOURCES || showingDesktop;
  colorPanel.hidden = activePanelId !== PANEL_COLOR || showingDesktop;
  filesPanel.hidden = activePanelId !== PANEL_FILES || showingDesktop;
  textPanel.hidden = activePanelId !== PANEL_TEXT || showingDesktop;
  webPanel.hidden = activePanelId !== PANEL_WEB || showingDesktop;
  agentsPanel.hidden = activePanelId !== PANEL_AGENTS || showingDesktop;
  skillsPanel.hidden = activePanelId !== PANEL_SKILLS || showingDesktop;
  toolsPanel.hidden = activePanelId !== PANEL_TOOLS || showingDesktop;
  schedulePanel.hidden = activePanelId !== PANEL_SCHEDULE || showingDesktop;
  meetPanel.hidden = activePanelId !== PANEL_MEET || showingDesktop;
  mailPanel.hidden = activePanelId !== PANEL_MAIL || showingDesktop;
  queuePanel.hidden = activePanelId !== PANEL_QUEUE || showingDesktop;
  hirePanel.hidden = activePanelId !== PANEL_HIRE || showingDesktop;
  projectsPanel.hidden = activePanelId !== PANEL_PROJECTS || showingDesktop;
  evalsPanel.hidden = activePanelId !== PANEL_EVALS || showingDesktop;
  workspaceArea.classList.toggle("has-open-panels", openPanelIds.length > 0);
  renderSystemTray();

  headerTabActiveSlot.replaceChildren();
  headerTabs.replaceChildren();
  const inactivePanelIds = getInactiveOpenPanelIds();
  headerTabs.style.setProperty("--tab-count", String(inactivePanelIds.length || 1));

  if (activePanelId) {
    const fragment = headerTabTemplate.content.cloneNode(true);
    const tab = fragment.querySelector(".header-tab");
    const activateButton = fragment.querySelector('[data-action="activate-tab"]');
    const closeButton = fragment.querySelector('[data-action="close-tab"]');

    tab.dataset.panelId = activePanelId;
    tab.classList.add("is-active");
    tab.classList.add(`header-tab--${getPanelScope(activePanelId)}`);
    activateButton.dataset.panelId = activePanelId;
    closeButton.dataset.panelId = activePanelId;
    fragment.querySelector('[data-role="label"]').textContent = panelLabel(activePanelId);
    fragment.querySelector('[data-role="icon"]').innerHTML = panelIconMarkup(activePanelId);
    headerTabActiveSlot.append(fragment);
  }

  for (const panelId of inactivePanelIds) {
    const fragment = headerTabTemplate.content.cloneNode(true);
    const tab = fragment.querySelector(".header-tab");
    const activateButton = fragment.querySelector('[data-action="activate-tab"]');
    const closeButton = fragment.querySelector('[data-action="close-tab"]');

    tab.dataset.panelId = panelId;
    tab.classList.add(`header-tab--${getPanelScope(panelId)}`);
    activateButton.dataset.panelId = panelId;
    closeButton.dataset.panelId = panelId;
    fragment.querySelector('[data-role="label"]').textContent = panelLabel(panelId);
    fragment.querySelector('[data-role="icon"]').innerHTML = panelIconMarkup(panelId);
    headerTabs.append(fragment);
  }

  panelHeaderBar.classList.toggle("has-inactive-tabs", inactivePanelIds.length > 0);
  tabScrollLeftButton.hidden = inactivePanelIds.length === 0;
  headerTabsViewport.hidden = inactivePanelIds.length === 0;
  tabScrollRightButton.hidden = inactivePanelIds.length === 0;

  window.cancelAnimationFrame(tabLayoutFrame);
  tabLayoutFrame = window.requestAnimationFrame(() => {
    applyTabWidths();
    updateTabScrollButtons();
    updateNavigationHighlights();
  });
}

function applyTabWidths() {
  const activeTab = headerTabActiveSlot.querySelector(".header-tab");
  const tabs = headerTabs.querySelectorAll(".header-tab");
  const inactiveCount = tabs.length;

  panelHeaderBar.style.removeProperty("--active-tab-width");
  panelHeaderBar.style.removeProperty("--inactive-tab-width");
  headerTabs.classList.remove("is-overflowing");

  if (!activeTab) return;

  const totalWidth = panelHeaderBar.clientWidth;
  if (totalWidth === 0) return;

  if (inactiveCount === 0) {
    panelHeaderBar.style.setProperty("--active-tab-width", "minmax(0, 1fr)");
    return;
  }

  const buttonAllowance = tabScrollLeftButton.offsetWidth + tabScrollRightButton.offsetWidth + 20;
  const available = Math.max(totalWidth - buttonAllowance, 320);
  const equalWidth = Math.floor(available / (inactiveCount + 1));
  const minTabWidth = 176;

  if (equalWidth >= minTabWidth) {
    panelHeaderBar.style.setProperty("--active-tab-width", `${equalWidth}px`);
    panelHeaderBar.style.setProperty("--inactive-tab-width", `${equalWidth}px`);
    headerTabsViewport.scrollLeft = 0;
    return;
  }

  panelHeaderBar.style.setProperty(
    "--active-tab-width",
    `${Math.max(Math.min(Math.floor(available * 0.34), 320), 200)}px`,
  );
  panelHeaderBar.style.setProperty("--inactive-tab-width", `${minTabWidth}px`);
  headerTabs.classList.add("is-overflowing");
}

function updateTabScrollButtons() {
  if (getInactiveOpenPanelIds().length === 0) {
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
  if (!activeOrganizationId) {
    return;
  }
  const organization = organizations.find((entry) => entry.id === activeOrganizationId);
  const nextMode = organization?.mode === "auto" ? "idle" : "auto";
  void setOrganizationRuntime(activeOrganizationId, { mode: nextMode, open: true, active: true }).then(() => {
    if (nextMode === "auto") {
      return bootstrapAutoMode();
    }
    return null;
  });
});

desktopSidebarToggle?.addEventListener("click", () => {
  desktopSidebarCollapsed = !desktopSidebarCollapsed;
  applyDesktopSidebarState();
  persistDesktopSidebarState();
});

appearanceThemeGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-theme-option]");
  if (!button || savingAppearance) {
    return;
  }

  setAppearance({
    theme: button.dataset.themeOption,
  });
});

accentRail?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-accent-option]");
  if (!button || savingAppearance) {
    return;
  }

  setAppearance({
    accent: button.dataset.accentOption,
  });
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

statusIcon?.addEventListener("click", () => {
  openPanel(PANEL_STATUS);
});

statusLaunch?.addEventListener("click", () => {
  openPanel(PANEL_STATUS);
});

sourcesIcon.addEventListener("click", () => {
  openPanel(PANEL_SOURCES);
});

colorIcon.addEventListener("click", () => {
  openPanel(PANEL_COLOR);
});

filesIcon.addEventListener("click", () => {
  openPanel(PANEL_FILES);
});

textIcon.addEventListener("click", () => {
  openPanel(PANEL_TEXT);
});

webIcon.addEventListener("click", () => {
  openPanel(PANEL_WEB);
});

agentsIcon.addEventListener("click", () => {
  openPanel(PANEL_AGENTS);
});

skillsIcon.addEventListener("click", () => {
  openPanel(PANEL_SKILLS);
});

toolsIcon.addEventListener("click", () => {
  openPanel(PANEL_TOOLS);
});

scheduleIcon.addEventListener("click", () => {
  openPanel(PANEL_SCHEDULE);
});

meetIcon.addEventListener("click", () => {
  openPanel(PANEL_MEET);
});

mailIcon.addEventListener("click", () => {
  openPanel(PANEL_MAIL);
});

queueIcon.addEventListener("click", () => {
  openPanel(PANEL_QUEUE);
});

hireIcon.addEventListener("click", () => {
  openPanel(PANEL_HIRE);
});

projectsIcon.addEventListener("click", () => {
  openPanel(PANEL_PROJECTS);
});

evalsIcon.addEventListener("click", () => {
  openPanel(PANEL_EVALS);
});

headerCaption.addEventListener("click", () => {
  openPanel(PANEL_ABOUT);
});

sourceIndicator.addEventListener("click", () => {
  openPanel(PANEL_SOURCES);
});

notificationIndicator?.addEventListener("click", () => {
  notificationsOpen = !notificationsOpen;
  if (notificationPopover) {
    notificationPopover.hidden = !notificationsOpen;
  }
});

notificationPopoverList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-notification-id]");
  if (!button) {
    return;
  }
  void openNotificationTarget(button.dataset.notificationId);
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

headerTabActiveSlot.addEventListener("click", (event) => {
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
  headerTabActiveSlot.querySelectorAll(".is-nav-highlighted").forEach((tab) => {
    tab.classList.remove("is-nav-highlighted");
  });
  headerTabs.querySelectorAll(".is-nav-highlighted").forEach((tab) => {
    tab.classList.remove("is-nav-highlighted");
  });
  if (!keyboardNavigationVisible || navMode !== "header") {
    return;
  }
  const headerPanelIds = getHeaderNavigablePanelIds();
  const targetPanelId = headerPanelIds[tabNavIndex];
  const tab = [
    ...headerTabActiveSlot.querySelectorAll(".header-tab"),
    ...headerTabs.querySelectorAll(".header-tab"),
  ].find(
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
      const panelId = getDesktopPanelIds()[desktopNavIndex] ?? PANEL_ABOUT;
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
  if (notificationIndicatorWrap && !notificationIndicatorWrap.contains(event.target)) {
    notificationsOpen = false;
    if (notificationPopover) {
      notificationPopover.hidden = true;
    }
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

desktopOrgList?.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }
  const organizationId = button.dataset.organizationId;
  if (!organizationId) {
    return;
  }
  if (button.dataset.action === "activate-desktop-organization") {
    await setOrganizationRuntime(organizationId, { active: true, open: true });
    selectedOrganizationId = organizationId;
    touchOrganizationRecent(organizationId);
    renderOrganizations();
    return;
  }
  if (button.dataset.action === "toggle-open-desktop-organization") {
    const organization = findOrganization(organizationId);
    await setOrganizationRuntime(organizationId, { open: !organization?.open, active: organizationId === activeOrganizationId ? organization?.open ? false : true : undefined });
    return;
  }
  if (button.dataset.action === "toggle-mode-desktop-organization") {
    const organization = findOrganization(organizationId);
    const nextMode = organization?.mode === "auto" ? "idle" : "auto";
    await setOrganizationRuntime(organizationId, { mode: nextMode, open: true });
    if (nextMode === "auto") {
      await bootstrapAutoMode(organizationId);
    }
  }
});

desktopAddOrganizationButton?.addEventListener("click", () => {
  addOrganizationButton.click();
  openPanel(PANEL_ABOUT);
});

desktopOpenAboutButton?.addEventListener("click", () => {
  openPanel(PANEL_ABOUT);
});

systemTrayToggle?.addEventListener("click", () => {
  systemTrayOpen = !systemTrayOpen;
  renderSystemTray();
});

systemTrayClose?.addEventListener("click", () => {
  systemTrayOpen = false;
  renderSystemTray();
});

statusMenu?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-status-scope]");
  if (!button) {
    return;
  }
  selectedStatusScope = button.dataset.statusScope === "system" ? "system" : "organization";
  renderStatusPanel();
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
    return;
  }
  if (field === "archetypeId") {
    refreshOrganizationDetailCard(card, organization);
    return;
  }
  if (field === "appearanceTheme" || field === "appearanceAccent") {
    if (!organization.persisted) {
      return;
    }
    if (field === "appearanceTheme") {
      organization.appearanceTheme = target.value;
    } else {
      organization.appearanceAccent = target.value;
    }
    void setOrganizationAppearanceOverride(organization.id, {
      accent: organization.appearanceAccent,
      theme: organization.appearanceTheme,
    });
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

  if (action === "toggle-open-organization") {
    const organization = findOrganization(organizationId);
    if (!organization?.persisted) {
      return;
    }
    await setOrganizationRuntime(organizationId, { open: !organization.open });
    return;
  }

  if (action === "activate-organization") {
    const organization = findOrganization(organizationId);
    if (!organization?.persisted) {
      return;
    }
    await setOrganizationRuntime(organizationId, { active: true, open: true });
    selectedOrganizationId = organizationId;
    return;
  }

  if (action === "toggle-mode-organization") {
    const organization = findOrganization(organizationId);
    if (!organization?.persisted) {
      return;
    }
    await setOrganizationRuntime(organizationId, {
      mode: organization.mode === "auto" ? "idle" : "auto",
      open: true,
    });
    if (organizationId === activeOrganizationId && organizations.find((entry) => entry.id === organizationId)?.mode === "auto") {
      await bootstrapAutoMode();
    }
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

addAgentButton?.addEventListener("click", async () => {
  const name = `agent-${Date.now()}`;
  const content = `---
name: ${name}
role: new role
description: Describe this agent template.
tier: mid
model: gemma4:latest
prompt_file: prompts/agents/${name}.txt
tools:
- web-browsing
skills:
- memory
---

Update this template.
`;
  await fetchJson("/api/agents/write", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, content }),
  });
  const data = await fetchJson("/api/agents/list");
  agentFiles = data.agents ?? [];
  selectedAgentName = name;
  renderAgentsPanel();
  await loadAgentDetail(name);
});

agentMenu?.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="select-record"]');
  if (!button) return;
  selectedAgentName = button.dataset.recordId;
  renderAgentsPanel();
  void loadAgentDetail(selectedAgentName);
});

skillMenu?.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="select-record"]');
  if (!button) return;
  selectedSkillName = button.dataset.recordId;
  renderSkillsPanel();
  void loadSkillDetail(selectedSkillName);
});

addScheduleTaskButton?.addEventListener("click", () => {
  addScheduleTask();
});

scheduleList?.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="select-record"]');
  if (!button) return;
  selectedScheduleId = button.dataset.recordId;
  renderSchedulePanel();
});

scheduleDetail?.addEventListener("input", (event) => {
  const card = event.target.closest(".source-card");
  if (!card) return;
  const field = event.target.dataset.field;
  if (!field) return;
  const value = field === "dependencyIds"
    ? [...event.target.selectedOptions].map((option) => option.value)
    : event.target.type === "checkbox"
      ? event.target.checked
      : event.target.value;
  updateScheduleField(card.dataset.scheduleId, field, value);
});

scheduleDetail?.addEventListener("change", (event) => {
  const card = event.target.closest(".source-card");
  if (!card) return;
  const field = event.target.dataset.field;
  if (!field) return;
  const value = field === "dependencyIds"
    ? [...event.target.selectedOptions].map((option) => option.value)
    : event.target.type === "checkbox"
      ? event.target.checked
      : event.target.value;
  updateScheduleField(card.dataset.scheduleId, field, value);
});

scheduleDetail?.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const card = button.closest(".source-card");
  if (!card) return;
  if (button.dataset.action === "save-schedule") {
    await saveScheduleTask(card.dataset.scheduleId);
  }
  if (button.dataset.action === "delete-schedule") {
    await deleteScheduleTaskRecord(card.dataset.scheduleId);
  }
});

createMeetingButton?.addEventListener("click", async () => {
  await addMeetingRecord();
});

meetingMenu?.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="select-record"]');
  if (!button) return;
  selectedMeetingId = button.dataset.recordId;
  renderMeetPanel();
});

meetDetail?.addEventListener("input", (event) => {
  const card = event.target.closest(".source-card");
  if (!card) return;
  updateMeetingField(card.dataset.meetingId, event.target.dataset.field, event.target.value);
});

meetDetail?.addEventListener("change", (event) => {
  const card = event.target.closest(".source-card");
  if (!card) return;
  updateMeetingField(card.dataset.meetingId, event.target.dataset.field, event.target.value);
});

meetDetail?.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const card = button.closest(".source-card");
  if (!card) return;
  if (button.dataset.action === "save-meeting") {
    await saveMeetingRecord(card.dataset.meetingId);
  }
});

mailFolderMenu?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-mail-folder]");
  if (!button) return;
  mailFolder = button.dataset.mailFolder;
  void loadMailPanelData();
});

mailDetail?.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.action === "compose-mail") {
    composeMailMessage();
    return;
  }
  if (button.dataset.action === "save-mail") {
    await saveMailMessageRecord(selectedMailId);
    return;
  }
  if (button.dataset.action === "select-mail") {
    selectedMailId = button.dataset.mailId;
    renderMailPanel();
  }
});

mailDetail?.addEventListener("input", (event) => {
  const field = event.target.dataset.field;
  if (!field || !selectedMailId) return;
  updateMailField(selectedMailId, field, event.target.value);
});

addHireDepartmentButton?.addEventListener("click", () => addHireRecord("department"));
addHireTeamButton?.addEventListener("click", () => addHireRecord("team"));
addHireRoleButton?.addEventListener("click", () => addHireRecord("role"));

hireMenu?.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="select-record"]');
  if (!button) return;
  selectedHireKey = `${button.dataset.recordType}:${button.dataset.recordId}`;
  renderHirePanel();
});

hireDetail?.addEventListener("input", (event) => {
  const card = event.target.closest(".source-card");
  if (!card) return;
  updateHireField(card.dataset.hireType, card.dataset.hireId, event.target.dataset.field, event.target.value);
});

hireDetail?.addEventListener("change", (event) => {
  const card = event.target.closest(".source-card");
  if (!card) return;
  updateHireField(card.dataset.hireType, card.dataset.hireId, event.target.dataset.field, event.target.value);
});

hireDetail?.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const card = button.closest(".source-card");
  if (!card) return;
  if (button.dataset.action === "save-hire") {
    await saveHireStateRecord();
  }
  if (button.dataset.action === "delete-hire") {
    deleteHireRecord(card.dataset.hireType, card.dataset.hireId);
  }
});

addProjectButton?.addEventListener("click", () => addProjectRecord());

projectsMenu?.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="select-record"]');
  if (!button) return;
  selectedProjectId = button.dataset.recordId;
  renderProjectsPanel();
});

projectsDetail?.addEventListener("input", (event) => {
  const card = event.target.closest(".source-card");
  if (!card) return;
  const field = event.target.dataset.field;
  if (!field) return;
  if (field === "participantRoleIds") {
    updateProjectField(card.dataset.projectId, field, event.target.checked, event.target.dataset.roleId);
  } else {
    updateProjectField(card.dataset.projectId, field, event.target.value);
  }
});

projectsDetail?.addEventListener("change", (event) => {
  const card = event.target.closest(".source-card");
  if (!card) return;
  const field = event.target.dataset.field;
  if (!field) return;
  if (field === "participantRoleIds") {
    updateProjectField(card.dataset.projectId, field, event.target.checked, event.target.dataset.roleId);
  } else {
    updateProjectField(card.dataset.projectId, field, event.target.value);
  }
});

projectsDetail?.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const card = button.closest(".source-card");
  if (!card) return;
  if (button.dataset.action === "save-project") {
    await saveProjectRecord(card.dataset.projectId);
  }
  if (button.dataset.action === "delete-project") {
    await deleteProjectRecord(card.dataset.projectId);
  }
});

addEvalButton?.addEventListener("click", () => addEvalRecord());

evalsMenu?.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="select-record"]');
  if (!button) return;
  selectedEvalId = button.dataset.recordId;
  renderEvalsPanel();
});

evalsDetail?.addEventListener("input", (event) => {
  const card = event.target.closest(".source-card");
  if (!card) return;
  updateEvalField(card.dataset.evalId, event.target.dataset.field, event.target.value);
});

evalsDetail?.addEventListener("change", (event) => {
  const card = event.target.closest(".source-card");
  if (!card) return;
  updateEvalField(card.dataset.evalId, event.target.dataset.field, event.target.value);
});

evalsDetail?.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const card = button.closest(".source-card");
  if (!card) return;
  if (button.dataset.action === "save-eval") {
    await saveEvalRecord(card.dataset.evalId);
  }
  if (button.dataset.action === "delete-eval") {
    await deleteEvalRecord(card.dataset.evalId);
  }
});

// ── Queue dispatch form ───────────────────────────────────────────────────

queueEnqueueButton?.addEventListener("click", () => {
  if (!queueEnqueueForm) return;
  queueEnqueueForm.hidden = !queueEnqueueForm.hidden;
  if (!queueEnqueueForm.hidden && queueEnqueueAgent) {
    queueEnqueueAgent.replaceChildren();
    for (const agent of agentFiles) {
      const opt = document.createElement("option");
      opt.value = agent.name;
      opt.textContent = agent.name;
      queueEnqueueAgent.append(opt);
    }
  }
});

queueEnqueueCancel?.addEventListener("click", () => {
  if (queueEnqueueForm) queueEnqueueForm.hidden = true;
});

queueEnqueueSubmit?.addEventListener("click", async () => {
  const agentId = queueEnqueueAgent?.value;
  const taskDescription = queueEnqueueTask?.value?.trim();
  const priority = queueEnqueuePriority?.value ?? "normal";
  if (!agentId || !taskDescription) {
    setPanelState(queueStateLabel, "Agent and task are required.");
    return;
  }
  setPanelState(queueStateLabel, "Dispatching...", true);
  try {
    await fetchJson("/api/queue/enqueue", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ agentId, taskDescription, priority }),
    });
    if (queueEnqueueTask) queueEnqueueTask.value = "";
    if (queueEnqueueForm) queueEnqueueForm.hidden = true;
    setPanelState(queueStateLabel, "Dispatched");
  } catch {
    setPanelState(queueStateLabel, "Dispatch failed");
  }
});

filesRootMenu?.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="select-root"]');
  if (!button) {
    return;
  }
  filesView.root = button.dataset.rootId;
  filesView.path = "";
  void loadFilesDirectory(filesView.root, "");
});

filesFolderMenu?.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="open-folder"]');
  if (!button) {
    return;
  }
  filesView.path = button.dataset.path ?? "";
  void loadFilesDirectory(filesView.root, filesView.path);
});

filesDetail?.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const entryPath = button.dataset.path ?? "";
  if (!action) {
    return;
  }

  if (action === "open-folder") {
    filesView.path = entryPath;
    await loadFilesDirectory(filesView.root, filesView.path);
    return;
  }

  if (action === "open-text-file") {
    await openTextDocument(filesView.root, entryPath);
    return;
  }

  if (action === "delete-file") {
    openConfirmation({
      body: "This moves the file into the active organization's deleted area. This action can be reversed later from the deleted root.",
      confirmLabel: "delete",
      onConfirm: async () => {
        try {
          await fetchJson("/api/files/delete", {
            body: JSON.stringify({ path: entryPath, root: filesView.root }),
            headers: {
              "content-type": "application/json",
            },
            method: "POST",
          });
          await loadFilesDirectory(filesView.root, filesView.path);
        } catch (error) {
          console.error(error);
          setFilesState("Delete failed");
        }
      },
      title: "Delete file?",
    });
    return;
  }

  if (action === "rename-entry") {
    const entry = filesView.entries.find((item) => item.path === entryPath);
    if (entry) {
      openFileActionModal("rename", entry);
    }
  }
});

refreshFilesButton?.addEventListener("click", () => {
  void loadFilesDirectory(filesView.root, filesView.path);
});

addFileButton?.addEventListener("click", () => {
  filesImportInput.value = "";
  filesImportInput.click();
});

addFolderButton?.addEventListener("click", () => {
  openFileActionModal("create-folder");
});

filesImportInput?.addEventListener("change", async () => {
  const file = filesImportInput.files?.[0];
  if (!file) {
    return;
  }

  const form = new FormData();
  form.set("root", filesView.root);
  form.set("path", filesView.path);
  form.set("file", file);

  setFilesState("Importing...", true);
  try {
    await fetchJson("/api/files/import", {
      body: form,
      method: "POST",
    });
    await loadFilesDirectory(filesView.root, filesView.path);
    setFilesState("Imported");
  } catch (error) {
    console.error(error);
    setFilesState("Import failed");
  }
});

addTextDocumentButton?.addEventListener("click", () => {
  createNewTextDocument();
});

openTextDocumentButton?.addEventListener("click", async () => {
  await openFilePicker("open");
});

refreshWebButton?.addEventListener("click", () => {
  void loadWebPanelData();
});

addWebFragmentButton?.addEventListener("click", async () => {
  if (!activeOrganizationId) {
    return;
  }
  const index = webState.fragments.length + 1;
  setWebState("Creating...", true);
  try {
    await fetchJson("/api/web/write", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        content: `<section>\n  <h1>Fragment ${index}</h1>\n  <p>New web fragment.</p>\n</section>\n`,
        file: `fragment-${index}.htm`,
        orgId: activeOrganizationId,
      }),
    });
    await loadWebPanelData();
    setWebState("Created");
  } catch (error) {
    console.error(error);
    setWebState("Create failed");
  }
});

webMenu?.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="select-record"]');
  if (!button) {
    return;
  }
  webState.selectedFragmentId = button.dataset.recordId;
  renderWebPanel();
});

webDetail?.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }
  if (button.dataset.action === "open-web-fragment-text") {
    const selected = webState.fragments.find((entry) => entry.id === webState.selectedFragmentId);
    if (selected?.path) {
      await openTextDocument("organization", selected.path);
    }
    return;
  }
  if (button.dataset.action === "open-tool-registry") {
    openPanel(PANEL_TOOLS);
  }
});

textDocumentMenu?.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="select-text-document"]');
  if (!button) {
    return;
  }
  const item = button.closest(".source-menu-item");
  if (!item) {
    return;
  }
  selectedTextDocumentId = item.dataset.documentId;
  renderTextPanel();
});

textDetail?.addEventListener("input", (event) => {
  const target = event.target;
  const card = target.closest(".text-card");
  if (!card) {
    return;
  }
  const documentId = card.dataset.documentId;
  const documentRecord = textDocuments.find((entry) => entry.id === documentId);
  if (!documentRecord) {
    return;
  }
  if (target.dataset.field === "content") {
    updateTextDocumentField(documentId, target.value);
    return;
  }
  if (target.dataset.field === "extension") {
    documentRecord.extension = target.value;
    if (documentRecord.viewMode === "parsed") {
      renderTextPanel();
    } else {
      refreshTextCardState(card, documentRecord);
      renderTextDocumentMenuOnly();
    }
    return;
  }
  if (target.dataset.action === "parsed-plain") {
    updateTextDocumentField(documentId, target.textContent ?? "");
    return;
  }
  if (target.dataset.action === "parsed-markdown") {
    documentRecord.content = htmlToMarkdown(target);
    renderTextDocumentMenuOnly();
    refreshTextCardState(card, documentRecord);
    return;
  }
  if (target.dataset.action === "json-leaf") {
    const pathSegments = (target.dataset.path ?? "").split(".").filter(Boolean);
    const valueType = target.dataset.valueType ?? "string";
    let nextValue;
    if (target.type === "checkbox") {
      nextValue = target.checked;
    } else if (valueType === "number") {
      nextValue = Number(target.value);
    } else if (valueType === "null") {
      nextValue = target.value.trim().toLowerCase() === "null" ? null : target.value;
    } else {
      nextValue = target.value;
    }
    documentRecord.parsedJson = setJsonPathValue(documentRecord.parsedJson, pathSegments, nextValue);
    documentRecord.content = JSON.stringify(documentRecord.parsedJson, null, 2);
    renderTextDocumentMenuOnly();
    refreshTextCardState(card, documentRecord);
  }
});

textDetail?.addEventListener("mousedown", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }
  const action = button.dataset.action ?? "";
  if (action.startsWith("md-")) {
    event.preventDefault();
  }
});

textDetail?.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }
  const action = button.dataset.action;
  if (action === "new-text-document") {
    createNewTextDocument();
    return;
  }
  if (action === "open-text-file" && !button.closest(".text-card")) {
    await openFilePicker("open");
    return;
  }
  const card = button.closest(".text-card");
  const documentId = card?.dataset.documentId ?? selectedTextDocumentId;
  if (!documentId) {
    return;
  }
  if (action === "save-text-document") {
    await saveTextDocument(documentId);
    return;
  }
  if (action === "close-text-document") {
    closeTextDocument(documentId);
    return;
  }
  if (action === "set-text-view") {
    const documentRecord = textDocuments.find((entry) => entry.id === documentId);
    if (!documentRecord) {
      return;
    }
    documentRecord.viewMode = button.dataset.viewMode === "parsed" ? "parsed" : "raw";
    renderTextPanel();
    return;
  }
  if (action === "txt-bold" || action === "txt-italic" || action === "txt-center") {
    if (action === "txt-bold") textViewSettings.plainBold = !textViewSettings.plainBold;
    if (action === "txt-italic") textViewSettings.plainItalic = !textViewSettings.plainItalic;
    if (action === "txt-center") textViewSettings.plainCenter = !textViewSettings.plainCenter;
    persistTextViewSettings();
    renderTextPanel();
    return;
  }
  if (action === "md-bold") document.execCommand("bold");
  if (action === "md-italic") document.execCommand("italic");
  if (action === "md-h1") document.execCommand("formatBlock", false, "h1");
  if (action === "md-h2") document.execCommand("formatBlock", false, "h2");
  if (action === "md-quote") document.execCommand("formatBlock", false, "blockquote");
  if (action === "md-list") document.execCommand("insertUnorderedList");
  if (action?.startsWith("md-")) {
    const parsedEditor = card.querySelector('[data-action="parsed-markdown"]');
    if (parsedEditor) {
      parsedEditor.focus();
      const documentRecord = textDocuments.find((entry) => entry.id === documentId);
      if (documentRecord) {
        documentRecord.content = htmlToMarkdown(parsedEditor);
        renderTextDocumentMenuOnly();
        refreshTextCardState(card, documentRecord);
      }
    }
    return;
  }
  if (action === "discard-text-document") {
    discardTextDocumentChanges(documentId);
    return;
  }
  if (action === "open-text-file") {
    await openFilePicker("open");
  }
});

textFilePicker?.addEventListener("click", async (event) => {
  const button = event.target.closest("button, [data-action=\"close-file-picker\"]");
  if (!button) {
    return;
  }
  const action = button.dataset.action;
  if (action === "close-file-picker") {
    closeFilePicker();
    return;
  }
  if (action === "pick-root") {
    await loadFilePickerDirectory(button.dataset.rootId, "");
    return;
  }
  if (action === "open-folder") {
    await loadFilePickerDirectory(filePickerSession.root, button.dataset.path ?? "");
    return;
  }
  if (action === "open-text-from-picker") {
    closeFilePicker();
    await openTextDocument(filePickerSession.root, button.dataset.path);
    return;
  }
  if (action === "confirm-file-picker") {
    await confirmFilePicker();
  }
});

fileActionModal?.addEventListener("click", async (event) => {
  const button = event.target.closest("button, [data-action=\"close-file-action\"]");
  if (!button) {
    return;
  }
  const action = button.dataset.action;
  if (action === "close-file-action") {
    closeFileActionModal();
    return;
  }
  if (action === "confirm-file-action") {
    await confirmFileAction();
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
  systemColorMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  systemColorMediaQuery.addEventListener("change", () => {
    if (appearanceState.theme === "system") {
      applyAppearance();
      renderAppearanceControls();
    }
  });
  renderAccentOptions();
  initializeDesktopGroups();
  loadDesktopSidebarState();
  applyDesktopSidebarState();
  loadSystemMode();
  loadTextViewSettings();
  renderSystemMode();
  applyAppearance();
  renderAppearanceControls();
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
  const autoOrganizations = organizations.filter((organization) => organization.persisted && organization.open && organization.mode === "auto");
  for (const organization of autoOrganizations) {
    await bootstrapAutoMode(organization.id);
  }
  await discoverSources();
}

startClock();
syncFullscreenButtons();
void initialize();
connectLiveReload();
