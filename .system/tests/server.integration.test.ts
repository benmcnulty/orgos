import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cp, mkdtemp, readFile, rm } from "node:fs/promises";
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
    expect(Array.isArray(payload.sources)).toBe(true);
    expect(payload.organizations.length).toBeGreaterThan(0);
    expect(payload.sources[0]).toMatchObject({
      active: true,
      address: "http://127.0.0.1:11434",
      kind: "local_default",
      tier: "mid",
    });
    expect(typeof payload.sources[0].name).toBe("string");
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
      kind: "saved",
      model: "gemma4:e2b",
      name: "min",
      tier: "low",
    });
    expect(savedFile.sources[2]).toMatchObject({
      address: "http://192.168.1.175:11434",
      kind: "saved",
      model: "gemma4:latest",
      name: "air",
      tier: "top",
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
});
