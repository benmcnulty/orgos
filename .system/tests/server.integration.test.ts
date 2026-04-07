import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { createOrgosApp } from "../server/app";

let fixtureRoot = "";
let app = createOrgosApp(process.cwd());

beforeAll(async () => {
  fixtureRoot = await mkdtemp(path.join(os.tmpdir(), "orgos-test-"));

  await cp(path.join(process.cwd(), ".system"), path.join(fixtureRoot, ".system"), {
    recursive: true,
  });
  await cp(path.join(process.cwd(), ".data"), path.join(fixtureRoot, ".data"), {
    recursive: true,
  });
  await cp(path.join(process.cwd(), ".agents"), path.join(fixtureRoot, ".agents"), {
    recursive: true,
  });
  await cp(path.join(process.cwd(), ".skills"), path.join(fixtureRoot, ".skills"), {
    recursive: true,
  });

  app = createOrgosApp(fixtureRoot);
});

afterAll(async () => {
  if (fixtureRoot) {
    await rm(fixtureRoot, { force: true, recursive: true });
  }
});

describe("orgos app integration", () => {
  test("serves the integrated root document", async () => {
    const response = await app.fetch(new Request("http://orgos.local/"));
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(html).toContain('<header class="app-header">');
    expect(html).toContain('id="desktop-home"');
    expect(html).toContain('id="clock-time"');
    expect(html).toContain('id="fullscreen-button"');
    expect(html).toContain('id="windowed-button"');
    expect(html).toContain('id="header-tabs"');
    expect(html).toContain('id="about-icon"');
    expect(html).toContain('id="sources-icon"');
    expect(html).toContain('id="about-panel"');
    expect(html).toContain('id="sources-panel"');
    expect(html).toContain('id="organization-menu"');
    expect(html).toContain('id="source-menu"');
    expect(html).toContain('id="organization-card-template"');
    expect(html).toContain('id="source-card-template"');
    expect(html).toContain('class="hello-mark__text"');
  });

  test("serves system assets and instance data", async () => {
    const cssResponse = await app.fetch(
      new Request("http://orgos.local/assets/styles.css"),
    );
    const dataResponse = await app.fetch(
      new Request("http://orgos.local/data/content/app.json"),
    );

    expect(cssResponse.status).toBe(200);
    expect(cssResponse.headers.get("content-type")).toContain("text/css");
    expect(await cssResponse.text()).toContain(".app-header");

    expect(dataResponse.status).toBe(200);
    expect(dataResponse.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(await dataResponse.json()).toEqual({ title: "orgos" });
  });

  test("serves workspace bootstrap with system sources and organizations", async () => {
    const response = await app.fetch(
      new Request("http://orgos.local/api/workspace/bootstrap"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(typeof payload.activeOrganizationId === "string" || payload.activeOrganizationId === null).toBe(true);
    expect(Array.isArray(payload.organizations)).toBe(true);
    expect(Array.isArray(payload.openOrganizationIds)).toBe(true);
    expect(Array.isArray(payload.organizationRuntime)).toBe(true);
    expect(Array.isArray(payload.sources)).toBe(true);
    expect(Array.isArray(payload.notifications)).toBe(true);
    expect(payload.organizationModes).toBeObject();
    expect(payload.organizationAppearanceOverrides).toBeObject();
    expect(payload.telemetry).toBeObject();
    expect(payload.filesystem).toMatchObject({
      roots: expect.any(Array),
    });
    expect(payload.appearance).toMatchObject({
      accent: expect.any(String),
      theme: expect.any(String),
      version: 1,
    });
    expect(payload.templates).toMatchObject({
      bundles: expect.any(Array),
      organizationArchetypes: expect.any(Array),
      roleTemplates: expect.any(Array),
    });
    expect(payload.organizations.length).toBeGreaterThan(0);
    const localSource = payload.sources.find(
      (source: { address: string; kind: string }) =>
        source.address === "http://127.0.0.1:11434" && source.kind === "local_default",
    );
    expect(localSource).toBeTruthy();
    expect(localSource).toMatchObject({
      active: true,
      address: "http://127.0.0.1:11434",
      kind: "local_default",
    });
    expect(typeof localSource.name).toBe("string");
    expect(localSource.contextWindow).toBe(256000);
    // New fields from Phase 2 bootstrap extension
    expect(Array.isArray(payload.agents)).toBe(true);
    expect(Array.isArray(payload.skills)).toBe(true);
    expect(Array.isArray(payload.queue)).toBe(true);
    expect(Array.isArray(payload.flow)).toBe(true);
    expect(payload.staff).toMatchObject({
      departments: expect.any(Array),
      identities: expect.any(Array),
      roles: expect.any(Array),
      teams: expect.any(Array),
    });
    expect(payload.datamap).toMatchObject({
      entries: expect.any(Array),
      generatedAt: expect.any(String),
      version: 1,
    });
    expect(payload.web).toMatchObject({
      fragments: expect.any(Array),
      preview: expect.any(String),
      tools: expect.any(Array),
    });
    expect(payload.memory).toMatchObject({
      identities: expect.any(Array),
      version: 1,
    });
    expect(payload.agents.length).toBeGreaterThan(0);
    expect(payload.skills.length).toBeGreaterThan(0);
    const ceoAgent = payload.agents.find(
      (a: { file?: string; name?: string }) => a.file === "ceo.md" || a.name === "CEO",
    );
    expect(ceoAgent).toBeTruthy();
    expect(ceoAgent.file).toBe("ceo.md");
    expect(Array.isArray(ceoAgent.bundles)).toBe(true);
    expect(Array.isArray(ceoAgent.effectiveSkills)).toBe(true);
    expect(Array.isArray(ceoAgent.effectiveTools)).toBe(true);
    expect(payload.orgosAgent).toMatchObject({
      id: "orgos",
      name: "orgos",
      scope: "system",
    });
    if (payload.activeOrganizationId) {
      expect(
        payload.organizationRuntime.some(
          (entry: { id: string }) => entry.id === payload.activeOrganizationId,
        ),
      ).toBe(true);
    }
  });

  test("lists shared template assets", async () => {
    const response = await app.fetch(
      new Request("http://orgos.local/api/templates/list"),
    );
    const body = await response.text();
    const payload = JSON.parse(body);

    expect(response.status).toBe(200);
    expect(payload.templates).toMatchObject({
      bundles: expect.any(Array),
      departmentTemplates: expect.any(Array),
      organizationArchetypes: expect.any(Array),
      processTemplates: expect.any(Array),
      roleTemplates: expect.any(Array),
      teamTemplates: expect.any(Array),
      version: 1,
    });
    expect(body).toContain('"organizationArchetypes":[');
    expect(body).toContain('"roleTemplates":[');
  });

  test("persists organization runtime state and board notifications", async () => {
    const bootstrapResponse = await app.fetch(
      new Request("http://orgos.local/api/workspace/bootstrap"),
    );
    const bootstrap = await bootstrapResponse.json();
    const orgId = bootstrap.activeOrganizationId ?? bootstrap.organizations[0]?.id;
    expect(typeof orgId).toBe("string");

    const runtimeResponse = await app.fetch(
      new Request("http://orgos.local/api/organizations/runtime", {
        body: JSON.stringify({ id: orgId, mode: "auto", open: true, active: true }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    const runtime = await runtimeResponse.json();
    expect(runtimeResponse.status).toBe(200);
    expect(runtime.activeOrganizationId).toBe(orgId);
    expect(runtime.openOrganizationIds).toContain(orgId);
    expect(runtime.organizationModes[orgId]).toBe("auto");

    const notificationCreate = await app.fetch(
      new Request("http://orgos.local/api/notifications/create", {
        body: JSON.stringify({
          level: "unread",
          organizationId: orgId,
          sourceApp: "meet",
          summary: "Budget review agenda ready.",
          targetId: "meeting-1",
          targetPanel: "meet",
          title: "Meeting planned",
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    expect(notificationCreate.status).toBe(200);

    const notificationsResponse = await app.fetch(
      new Request("http://orgos.local/api/notifications/list"),
    );
    const notifications = await notificationsResponse.json();
    expect(notificationsResponse.status).toBe(200);
    expect(Array.isArray(notifications.notifications)).toBe(true);
    expect(notifications.notifications[0]).toMatchObject({
      organizationId: orgId,
      sourceApp: "meet",
      targetPanel: "meet",
      unread: true,
    });
  });

  test("auto bootstrap creates executive staffing, identities, memory, and flow", async () => {
    const bootstrapResponse = await app.fetch(
      new Request("http://orgos.local/api/workspace/bootstrap"),
    );
    const bootstrap = await bootstrapResponse.json();
    const orgId = bootstrap.activeOrganizationId ?? bootstrap.organizations[0]?.id;

    const response = await app.fetch(
      new Request("http://orgos.local/api/system/auto-bootstrap", {
        body: JSON.stringify({ orgId }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.staff.roles.map((role: { title: string }) => role.title)).toEqual(
      expect.arrayContaining(["CEO", "COO", "CTO", "Orgos", "Facilitator"]),
    );
    expect(payload.staff.identities.length).toBeGreaterThanOrEqual(5);
    expect(payload.memoryIndex.identities.length).toBeGreaterThanOrEqual(5);
    expect(payload.flow.length).toBeGreaterThanOrEqual(2);
    expect(payload.datamap).toMatchObject({
      entries: expect.any(Array),
      organizationId: orgId,
      version: 1,
    });

    const memoryIndexPath = path.join(
      fixtureRoot,
      ".data",
      "organizations",
      orgId,
      "memory",
      "index.json",
    );
    const memoryIndex = JSON.parse(await readFile(memoryIndexPath, "utf8"));
    expect(memoryIndex.identities.length).toBeGreaterThanOrEqual(5);
    const runtimePath = path.join(
      fixtureRoot,
      ".data",
      "organizations",
      orgId,
      "orgos-runtime.json",
    );
    const runtime = JSON.parse(await readFile(runtimePath, "utf8"));
    expect(runtime.primaryRoles).toEqual(
      expect.arrayContaining(["CEO", "COO", "CTO", "Orgos", "Facilitator"]),
    );
  });

  test("lists, reads, writes, and deletes agent files in .agents/", async () => {
    const listResponse = await app.fetch(
      new Request("http://orgos.local/api/agents/list"),
    );
    const listPayload = await listResponse.json();
    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listPayload.agents)).toBe(true);
    expect(listPayload.agents.length).toBeGreaterThan(0);

    const readResponse = await app.fetch(
      new Request("http://orgos.local/api/agents/read?name=ceo"),
    );
    const readPayload = await readResponse.json();
    expect(readResponse.status).toBe(200);
    expect(typeof readPayload.content).toBe("string");
    expect(readPayload.content).toContain("CEO");

    const writeResponse = await app.fetch(
      new Request("http://orgos.local/api/agents/write", {
        body: JSON.stringify({ name: "test-agent", content: "# Test Agent\n" }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    expect(writeResponse.status).toBe(200);
    expect((await writeResponse.json()).ok).toBe(true);

    const verifyRead = await app.fetch(
      new Request("http://orgos.local/api/agents/read?name=test-agent"),
    );
    expect(verifyRead.status).toBe(200);
    expect((await verifyRead.json()).content).toContain("# Test Agent");

    const deleteResponse = await app.fetch(
      new Request("http://orgos.local/api/agents/delete", {
        body: JSON.stringify({ name: "test-agent" }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    expect(deleteResponse.status).toBe(200);
    expect((await deleteResponse.json()).ok).toBe(true);

    const afterDelete = await app.fetch(
      new Request("http://orgos.local/api/agents/read?name=test-agent"),
    );
    expect(afterDelete.status).toBe(404);
  });

  test("lists and reads skill files in .skills/", async () => {
    const listResponse = await app.fetch(
      new Request("http://orgos.local/api/skills/list"),
    );
    const listPayload = await listResponse.json();
    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listPayload.skills)).toBe(true);
    expect(listPayload.skills.length).toBeGreaterThan(0);

    const readResponse = await app.fetch(
      new Request("http://orgos.local/api/skills/read?name=memory"),
    );
    const readPayload = await readResponse.json();
    expect(readResponse.status).toBe(200);
    expect(typeof readPayload.content).toBe("string");
    expect(readPayload.content).toContain("Memory");
  });

  test("creates, lists, and deletes schedule tasks", async () => {
    const bootstrapResponse = await app.fetch(
      new Request("http://orgos.local/api/workspace/bootstrap"),
    );
    const bootstrap = await bootstrapResponse.json();
    const orgId = bootstrap.activeOrganizationId ?? bootstrap.organizations[0]?.id;

    expect(typeof orgId).toBe("string");

    const createResponse = await app.fetch(
      new Request("http://orgos.local/api/flow/create", {
        body: JSON.stringify({
          name: "Daily summary",
          agentId: "ceo",
          cronExpression: "0 9 * * *",
          enabled: true,
          orgId,
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    const created = await createResponse.json();
    expect(createResponse.status).toBe(200);
    expect(created.name).toBe("Daily summary");
    expect(typeof created.id).toBe("string");

    const listResponse = await app.fetch(
      new Request(`http://orgos.local/api/schedule/list?orgId=${encodeURIComponent(orgId)}`),
    );
    const listPayload = await listResponse.json();
    expect(listResponse.status).toBe(200);
    expect(listPayload.tasks.some((t: { id: string }) => t.id === created.id)).toBe(true);

    const deleteResponse = await app.fetch(
      new Request("http://orgos.local/api/flow/delete", {
        body: JSON.stringify({ id: created.id, orgId }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    expect(deleteResponse.status).toBe(200);
    expect((await deleteResponse.json()).ok).toBe(true);
  });

  test("enqueues and retrieves inference queue items", async () => {
    const enqueueResponse = await app.fetch(
      new Request("http://orgos.local/api/queue/enqueue", {
        body: JSON.stringify({
          agentId: "ceo",
          tier: "top",
          model: "gemma4:26b",
          priority: "normal",
          promptMessages: [{ role: "user", content: "Hello" }],
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    const enqueued = await enqueueResponse.json();
    expect(enqueueResponse.status).toBe(200);
    expect(enqueued.status).toBe("pending");
    expect(enqueued.agentId).toBe("ceo");

    const stateResponse = await app.fetch(
      new Request("http://orgos.local/api/queue/state"),
    );
    const state = await stateResponse.json();
    expect(stateResponse.status).toBe(200);
    expect(Array.isArray(state.items)).toBe(true);
    expect(state.items.some((i: { id: string }) => i.id === enqueued.id)).toBe(true);
    // nodeTelemetry exposed on state endpoint
    expect(Array.isArray(state.nodes)).toBe(true);
  });

  test("enqueues via agent template with server-side prompt assembly", async () => {
    // This exercises the preferred enqueue form: agentId + taskDescription
    const enqueueResponse = await app.fetch(
      new Request("http://orgos.local/api/queue/enqueue", {
        body: JSON.stringify({
          agentId: "CEO",
          taskDescription: "Summarize the strategic outlook for Q2.",
          priority: "high",
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    expect(enqueueResponse.status).toBe(200);
    const enqueued = await enqueueResponse.json();
    expect(enqueued.status).toBe("pending");
    expect(enqueued.tier).toBe("top");
    expect(enqueued.model).toBe("gemma4:26b");
    expect(enqueued.temperature).toBeTypeOf("number");
    expect(enqueued.maxTokens).toBeTypeOf("number");
    expect(Array.isArray(enqueued.promptMessages)).toBe(true);
    expect(enqueued.promptMessages.length).toBeGreaterThan(0);
    expect(enqueued.promptMessages[0].role).toBe("system");
  });

  test("rejects enqueue with unknown agent", async () => {
    const res = await app.fetch(
      new Request("http://orgos.local/api/queue/enqueue", {
        body: JSON.stringify({
          agentId: "nonexistent-agent",
          taskDescription: "Do something.",
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    expect(res.status).toBe(404);
  });

  test("preview prompt renders variable substitution", async () => {
    const res = await app.fetch(
      new Request("http://orgos.local/api/prompts/preview", {
        body: JSON.stringify({
          agentId: "CEO",
          variables: { ORGANIZATION_NAME: "TestOrg", TASK: "Evaluate performance." },
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(typeof data.systemPrompt).toBe("string");
    expect(Array.isArray(data.warnings)).toBe(true);
    // ORGANIZATION_NAME substituted → not present in output as placeholder
    expect(data.systemPrompt).not.toContain("{{ORGANIZATION_NAME}}");
    // TASK substituted
    expect(data.systemPrompt).not.toContain("{{TASK}}");
  });

  test("lists filesystem roots and reads and writes supported text files", async () => {
    await mkdir(path.join(fixtureRoot, ".data", "system", "notes"), { recursive: true });
    await writeFile(
      path.join(fixtureRoot, ".data", "system", "notes", "guide.md"),
      "# guide\n",
      "utf8",
    );

    const listResponse = await app.fetch(
      new Request("http://orgos.local/api/files/list?root=system&path=notes"),
    );
    const listing = await listResponse.json();

    expect(listResponse.status).toBe(200);
    expect(listing).toMatchObject({
      available: true,
      path: "notes",
      root: "system",
    });
    expect(
      listing.entries.some(
        (entry: { editable: boolean; name: string; type: string }) =>
          entry.name === "guide.md" && entry.type === "file" && entry.editable,
      ),
    ).toBe(true);

    const readResponse = await app.fetch(
      new Request("http://orgos.local/api/text/read?root=system&path=notes/guide.md"),
    );
    const readPayload = await readResponse.json();
    expect(readResponse.status).toBe(200);
    expect(readPayload.content).toContain("# guide");

    const writeResponse = await app.fetch(
      new Request("http://orgos.local/api/text/write", {
        body: JSON.stringify({
          content: '{"ok":true}\n',
          overwrite: false,
          path: "notes/config.json",
          root: "system",
        }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      }),
    );
    const writtenFile = await readFile(
      path.join(fixtureRoot, ".data", "system", "notes", "config.json"),
      "utf8",
    );

    expect(writeResponse.status).toBe(200);
    expect(writtenFile).toBe('{"ok":true}\n');
  });

  test("lists and writes organization web fragments", async () => {
    const bootstrapResponse = await app.fetch(
      new Request("http://orgos.local/api/workspace/bootstrap"),
    );
    const bootstrap = await bootstrapResponse.json();
    const orgId = bootstrap.activeOrganizationId ?? bootstrap.organizations[0]?.id;

    const listResponse = await app.fetch(
      new Request(`http://orgos.local/api/web/list?orgId=${encodeURIComponent(orgId)}`),
    );
    const listed = await listResponse.json();
    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listed.fragments)).toBe(true);
    expect(typeof listed.preview).toBe("string");

    const writeResponse = await app.fetch(
      new Request("http://orgos.local/api/web/write", {
        body: JSON.stringify({
          content: "<section><h1>hello</h1></section>\n",
          file: "fragments/test.htm",
          orgId,
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    const written = await writeResponse.json();
    expect(writeResponse.status).toBe(200);
    expect(written).toMatchObject({
      file: "test.htm",
      path: "web/fragments/test.htm",
    });

    const fragmentFile = await readFile(
      path.join(
        fixtureRoot,
        ".data",
        "organizations",
        orgId,
        "web",
        "fragments",
        "test.htm",
      ),
      "utf8",
    );
    expect(fragmentFile).toContain("<h1>hello</h1>");
  });

  test("rebuilds and reads deterministic organization datamaps", async () => {
    const bootstrapResponse = await app.fetch(
      new Request("http://orgos.local/api/workspace/bootstrap"),
    );
    const bootstrap = await bootstrapResponse.json();
    const orgId = bootstrap.activeOrganizationId ?? bootstrap.organizations[0]?.id;

    const rebuildResponse = await app.fetch(
      new Request("http://orgos.local/api/datamap/rebuild", {
        body: JSON.stringify({ orgId }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    const rebuilt = await rebuildResponse.json();
    expect(rebuildResponse.status).toBe(200);
    expect(rebuilt).toMatchObject({
      organizationId: orgId,
      entries: expect.any(Array),
      version: 1,
    });

    const readResponse = await app.fetch(
      new Request(`http://orgos.local/api/datamap/read?orgId=${encodeURIComponent(orgId)}`),
    );
    const datamap = await readResponse.json();
    expect(readResponse.status).toBe(200);
    expect(datamap.entries.length).toBeGreaterThan(0);

    const datamapFile = JSON.parse(
      await readFile(
        path.join(
          fixtureRoot,
          ".data",
          "organizations",
          orgId,
          "memory",
          "datamap.json",
        ),
        "utf8",
      ),
    );
    expect(datamapFile.organizationId).toBe(orgId);
    expect(Array.isArray(datamapFile.entries)).toBe(true);
  });

  test("moves deleted files into the active organization's deleted area", async () => {
    const saveResponse = await app.fetch(
      new Request("http://orgos.local/api/organizations/save", {
        body: JSON.stringify({
          activate: true,
          organization: {
            description: "File owner",
            industry: "technology",
            industryCustom: "",
            name: "File Org",
          },
        }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      }),
    );
    const saved = await saveResponse.json();
    const organization = saved.organizations.find(
      (entry: { name: string }) => entry.name === "File Org",
    );

    await mkdir(path.join(fixtureRoot, ".data", "organizations", organization.id, "docs"), {
      recursive: true,
    });
    await writeFile(
      path.join(fixtureRoot, ".data", "organizations", organization.id, "docs", "draft.txt"),
      "hello\n",
      "utf8",
    );

    const deleteResponse = await app.fetch(
      new Request("http://orgos.local/api/files/delete", {
        body: JSON.stringify({
          path: "docs/draft.txt",
          root: "organization",
        }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      }),
    );

    expect(deleteResponse.status).toBe(200);
    expect(
      await Bun.file(
        path.join(fixtureRoot, ".data", "organizations", organization.id, "docs", "draft.txt"),
      ).exists(),
    ).toBe(false);
    expect(
      await Bun.file(
        path.join(
          fixtureRoot,
          ".data",
          "system",
          "deleted",
          organization.id,
          "organization",
          "docs",
          "draft.txt",
        ),
      ).exists(),
    ).toBe(true);
  });

  test("persists shared system source configuration in .data/system", async () => {
    const saveResponse = await app.fetch(
      new Request("http://orgos.local/api/system/sources", {
        body: JSON.stringify({
          sources: [
            {
              active: true,
              address: "http://127.0.0.1:11434",
              id: "source-localhost",
              kind: "local_default",
              labelCustomized: false,
              model: "gemma4:latest",
              name: "Localhost Ollama",
              tier: "mid",
            },
            {
              active: false,
              address: "http://192.168.1.190:11434",
              id: "source-min",
              kind: "saved",
              labelCustomized: true,
              model: "gemma4:e2b",
              name: "min",
              tier: "low",
            },
            {
              active: false,
              address: "http://192.168.1.175:11434",
              id: "source-air",
              kind: "saved",
              labelCustomized: true,
              model: "gemma4:latest",
              name: "air",
              tier: "top",
            },
          ],
        }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      }),
    );
    const savePayload = await saveResponse.json();
    const savedFile = JSON.parse(
      await readFile(
        path.join(fixtureRoot, ".data", "system", "sources.json"),
        "utf8",
      ),
    );

    expect(saveResponse.status).toBe(200);
    expect(savePayload.sources).toHaveLength(3);
    expect(savePayload.sources.map((source: { address: string }) => source.address)).toEqual([
      "http://127.0.0.1:11434",
      "http://192.168.1.190:11434",
      "http://192.168.1.175:11434",
    ]);
    expect(savedFile.sources[1]).toMatchObject({
      address: "http://192.168.1.190:11434",
      contextWindow: 128000,
      kind: "saved",
      model: "gemma4:e2b",
      name: "min",
      tier: "low",
    });
    expect(savedFile.sources[2]).toMatchObject({
      address: "http://192.168.1.175:11434",
      contextWindow: 128000,
      kind: "saved",
      model: "gemma4:latest",
      name: "air",
      tier: "top",
    });
    expect(savedFile.sources[0].contextWindow).toBe(128000);
  });

  test("persists shared appearance configuration in .data/system", async () => {
    const saveResponse = await app.fetch(
      new Request("http://orgos.local/api/system/appearance", {
        body: JSON.stringify({
          accent: "cyan",
          theme: "dark",
        }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      }),
    );
    const savePayload = await saveResponse.json();
    const savedFile = JSON.parse(
      await readFile(
        path.join(fixtureRoot, ".data", "system", "appearance.json"),
        "utf8",
      ),
    );

    expect(saveResponse.status).toBe(200);
    expect(savePayload).toMatchObject({
      accent: "cyan",
      theme: "dark",
      version: 1,
    });
    expect(savedFile).toMatchObject({
      accent: "cyan",
      theme: "dark",
      version: 1,
    });
  });

  test("persists organizations as siloed about records and can activate one", async () => {
    const saveResponse = await app.fetch(
      new Request("http://orgos.local/api/organizations/save", {
        body: JSON.stringify({
          activate: true,
          organization: {
            description: "Agent-first operating model.",
            industry: "technology",
            industryCustom: "",
            name: "Air Labs",
          },
        }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      }),
    );
    const saved = await saveResponse.json();
    const firstOrganization = saved.organizations[0];

    expect(saveResponse.status).toBe(200);
    expect(saved.activeOrganizationId).toBe(firstOrganization.id);
    expect(firstOrganization).toMatchObject({
      description: "Agent-first operating model.",
      industry: "technology",
      lastActiveAt: expect.any(String),
      name: "Air Labs",
    });

    const aboutFile = JSON.parse(
      await readFile(
        path.join(
          fixtureRoot,
          ".data",
          "organizations",
          firstOrganization.id,
          "about.json",
        ),
        "utf8",
      ),
    );
    expect(aboutFile.name).toBe("Air Labs");

    const secondSaveResponse = await app.fetch(
      new Request("http://orgos.local/api/organizations/save", {
        body: JSON.stringify({
          activate: false,
          organization: {
            description: "A second silo.",
            industry: "custom",
            industryCustom: "research",
            name: "Vic Labs",
          },
        }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      }),
    );
    const secondSaved = await secondSaveResponse.json();
    const secondOrganization = secondSaved.organizations.find(
      (organization: { name: string }) => organization.name === "Vic Labs",
    );

    const activateResponse = await app.fetch(
      new Request("http://orgos.local/api/organizations/activate", {
        body: JSON.stringify({ id: secondOrganization.id }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      }),
    );
    const activated = await activateResponse.json();

    expect(activateResponse.status).toBe(200);
    expect(activated.activeOrganizationId).toBe(secondOrganization.id);
    expect(secondOrganization.id).toBe("vic-labs");
    expect(
      activated.organizations.find((organization: { id: string }) => organization.id === secondOrganization.id)
        ?.lastActiveAt,
    ).toEqual(expect.any(String));
  });

  test("deletes organizations and clears the silo when requested", async () => {
    const saveResponse = await app.fetch(
      new Request("http://orgos.local/api/organizations/save", {
        body: JSON.stringify({
          activate: true,
          organization: {
            description: "Disposable org",
            industry: "technology",
            industryCustom: "",
            name: "Delete Me",
          },
        }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      }),
    );
    const saved = await saveResponse.json();
    const created = saved.organizations.find(
      (organization: { name: string }) => organization.name === "Delete Me",
    );

    const deleteResponse = await app.fetch(
      new Request("http://orgos.local/api/organizations/delete", {
        body: JSON.stringify({ id: created.id }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      }),
    );
    const deleted = await deleteResponse.json();
    const deletedAboutPath = path.join(
      fixtureRoot,
      ".data",
      "organizations",
      created.id,
      "about.json",
    );

    expect(deleteResponse.status).toBe(200);
    expect(
      deleted.organizations.some((organization: { id: string }) => organization.id === created.id),
    ).toBe(false);
    expect(deleted.activeOrganizationId).toBeNull();
    expect(await Bun.file(deletedAboutPath).exists()).toBe(false);
  });

  test("rejects duplicate organization names and allows recreation after delete", async () => {
    const testName = "Octet Duplicate Test";
    const saveResponse = await app.fetch(
      new Request("http://orgos.local/api/organizations/save", {
        body: JSON.stringify({
          activate: true,
          organization: {
            description: "First pass",
            industry: "technology",
            industryCustom: "",
            name: testName,
          },
        }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      }),
    );
    const firstSaved = await saveResponse.json();
    const octet = firstSaved.organizations.find(
      (organization: { name: string }) => organization.name === testName,
    );

    const duplicateResponse = await app.fetch(
      new Request("http://orgos.local/api/organizations/save", {
        body: JSON.stringify({
          activate: false,
          organization: {
            description: "Second pass",
            industry: "technology",
            industryCustom: "",
            name: testName,
          },
        }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      }),
    );

    expect(duplicateResponse.status).toBe(409);

    await app.fetch(
      new Request("http://orgos.local/api/organizations/delete", {
        body: JSON.stringify({ id: octet.id }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      }),
    );

    const recreateResponse = await app.fetch(
      new Request("http://orgos.local/api/organizations/save", {
        body: JSON.stringify({
          activate: true,
          organization: {
            description: "Recreated",
            industry: "technology",
            industryCustom: "",
            name: testName,
          },
        }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      }),
    );
    const recreated = await recreateResponse.json();

    expect(recreateResponse.status).toBe(200);
    expect(
      recreated.organizations.some(
        (organization: { id: string; name: string }) =>
          organization.id === "octet-duplicate-test" && organization.name === testName,
      ),
    ).toBe(true);
  });

  test("still serves inference verification and discovery json", async () => {
    const statusResponse = await app.fetch(
      new Request("http://orgos.local/api/inference/status"),
    );
    const statusPayload = await statusResponse.json();
    const probeResponse = await app.fetch(
      new Request("http://orgos.local/api/inference/probe", {
        body: JSON.stringify({ address: "http://127.0.0.1:11434" }),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      }),
    );
    const probePayload = await probeResponse.json();
    const discoverResponse = await app.fetch(
      new Request("http://orgos.local/api/inference/discover"),
    );
    const discoverPayload = await discoverResponse.json();

    expect(statusResponse.status).toBe(200);
    expect(statusPayload.model).toBe("gemma4:latest");
    expect(typeof statusPayload.available).toBe("boolean");
    expect(probeResponse.status).toBe(200);
    expect(probePayload.address).toBe("http://127.0.0.1:11434");
    expect(Array.isArray(probePayload.models)).toBe(true);
    expect(discoverResponse.status).toBe(200);
    expect(Array.isArray(discoverPayload.sources)).toBe(true);
  });

  test("rejects traversal attempts and unknown routes", async () => {
    const escapedData = await app.fetch(
      new Request("http://orgos.local/data/../package.json"),
    );
    const unknown = await app.fetch(
      new Request("http://orgos.local/does-not-exist"),
    );

    expect(escapedData.status).toBe(404);
    expect(unknown.status).toBe(404);
  });

  test("rejects org id with path traversal characters", async () => {
    const deleteRes = await app.fetch(
      new Request("http://orgos.local/api/organizations/delete", {
        body: JSON.stringify({ id: "../system" }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    expect(deleteRes.status).toBe(400);

    const activateRes = await app.fetch(
      new Request("http://orgos.local/api/organizations/activate", {
        body: JSON.stringify({ id: "../system" }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    expect(activateRes.status).toBe(400);

    const runtimeRes = await app.fetch(
      new Request("http://orgos.local/api/organizations/runtime", {
        body: JSON.stringify({ id: "../system", open: true }),
        headers: { "content-type": "application/json" },
        method: "POST",
      }),
    );
    expect(runtimeRes.status).toBe(400);
  });

  test("bootstrap includes nodeTelemetry in payload", async () => {
    const res = await app.fetch(new Request("http://orgos.local/api/workspace/bootstrap"));
    const payload = await res.json();
    expect(Array.isArray(payload.nodeTelemetry)).toBe(true);
  });
});
