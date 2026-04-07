/**
 * seed-demo.ts — Idempotent demo seed for the "Octet" organization.
 *
 * Run: bun .system/scripts/seed-demo.ts
 *
 * Uses deterministic IDs derived from name slugs so running twice produces
 * the same state rather than accumulating duplicates.
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = path.join(import.meta.dir, "..", "..");
const dataDir = path.join(rootDir, ".data");
const systemDir = path.join(dataDir, "system");
const organizationsDir = path.join(dataDir, "organizations");
const orgId = "octet";
const orgDir = path.join(organizationsDir, orgId);

function slug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function writeJson(filePath: string, data: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

async function readJsonOrDefault<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

const now = new Date();
function daysAgo(n: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function hoursAgo(n: number): string {
  const d = new Date(now);
  d.setHours(d.getHours() - n);
  return d.toISOString();
}


// ── 2. About (org metadata) ───────────────────────────────────────────────────

async function seedAbout() {
  const aboutPath = path.join(orgDir, "about.json");
  if (existsSync(aboutPath)) {
    console.log("· about.json already exists");
    return;
  }
  await writeJson(aboutPath, {
    createdAt: daysAgo(90),
    description:
      "Autonomous research lab focused on multi-agent inference orchestration. Octet builds coordination primitives for agentic organizations operating at scale.",
    founded: "2026",
    id: orgId,
    mission: "Make autonomous organization a tractable problem.",
    name: "Octet",
    updatedAt: daysAgo(1),
    website: "https://octet.ai",
  });
  console.log("✓ about.json seeded");
}

// ── 3. Staff ──────────────────────────────────────────────────────────────────

async function seedStaff() {
  const staffPath = path.join(orgDir, "staff.json");
  if (existsSync(staffPath)) {
    console.log("· staff.json already exists");
    return;
  }

  const deptId = slug("Research");
  const team1Id = slug("Inference Lab");
  const team2Id = slug("Coordination");

  const roleIds = {
    ceo: slug("ceo"),
    coo: slug("coo"),
    cto: slug("cto"),
    lead: slug("lead-researcher"),
    eng: slug("research-engineer"),
  };

  const departments = [
    {
      createdAt: daysAgo(90),
      id: deptId,
      name: "Research",
      summary: "Core research into multi-agent inference and coordination.",
      updatedAt: daysAgo(30),
    },
  ];

  const teams = [
    {
      createdAt: daysAgo(85),
      departmentId: deptId,
      id: team1Id,
      name: "Inference Lab",
      summary: "Tier routing, dispatch optimization, and node health.",
      updatedAt: daysAgo(7),
    },
    {
      createdAt: daysAgo(85),
      departmentId: deptId,
      id: team2Id,
      name: "Coordination",
      summary: "Workflow planning, facilitator logic, and reflection loops.",
      updatedAt: daysAgo(7),
    },
  ];

  const roles = [
    {
      assigneeLabel: "Adelaide Hartwell",
      createdAt: daysAgo(90),
      id: roleIds.ceo,
      identityId: slug("adelaide-hartwell"),
      notes: "Strategic direction, board liaison, and org-level objectives.",
      status: "assigned",
      teamId: team2Id,
      templateId: "ceo",
      templateName: "CEO",
      title: "Chief Executive Officer",
      updatedAt: daysAgo(1),
    },
    {
      assigneeLabel: "Marcus Chen",
      createdAt: daysAgo(90),
      id: roleIds.coo,
      identityId: slug("marcus-chen"),
      notes: "Operations, resource allocation, and cross-team coordination.",
      status: "assigned",
      teamId: team2Id,
      templateId: "coo",
      templateName: "COO",
      title: "Chief Operating Officer",
      updatedAt: daysAgo(2),
    },
    {
      assigneeLabel: "Priya Ramanathan",
      createdAt: daysAgo(88),
      id: roleIds.cto,
      identityId: slug("priya-ramanathan"),
      notes: "Technical architecture, inference stack, and tooling roadmap.",
      status: "assigned",
      teamId: team1Id,
      templateId: "cto",
      templateName: "CTO",
      title: "Chief Technology Officer",
      updatedAt: daysAgo(1),
    },
    {
      assigneeLabel: "Yuki Tanaka",
      createdAt: daysAgo(80),
      id: roleIds.lead,
      identityId: slug("yuki-tanaka"),
      notes: "Leads tier-routing research and benchmark design.",
      status: "assigned",
      teamId: team1Id,
      templateId: "",
      templateName: "Lead Researcher",
      title: "Lead Researcher",
      updatedAt: daysAgo(3),
    },
    {
      assigneeLabel: "Sam Okafor",
      createdAt: daysAgo(60),
      id: roleIds.eng,
      identityId: slug("sam-okafor"),
      notes: "Inference telemetry, node health monitoring, and eval harness.",
      status: "assigned",
      teamId: team1Id,
      templateId: "",
      templateName: "Research Engineer",
      title: "Research Engineer",
      updatedAt: daysAgo(5),
    },
  ];

  const identities = [
    {
      createdAt: daysAgo(90),
      employeeNumber: 1,
      id: slug("adelaide-hartwell"),
      influence: "First-principles thinker. Holds the organization to its mission under pressure.",
      memoryRoot: `memory/identities/${slug("adelaide-hartwell")}`,
      name: "Adelaide Hartwell",
      personaSummary:
        "Decisive and strategically patient. Communicates in precise, low-word-count directives.",
      promptFile: "prompts/agents/ceo-system.txt",
      roleId: roleIds.ceo,
      roleTitle: "Chief Executive Officer",
      systemRole: false,
      templateName: "CEO",
      updatedAt: daysAgo(1),
    },
    {
      createdAt: daysAgo(90),
      employeeNumber: 2,
      id: slug("marcus-chen"),
      influence: "Operationally fluent. Keeps things moving when direction is ambiguous.",
      memoryRoot: `memory/identities/${slug("marcus-chen")}`,
      name: "Marcus Chen",
      personaSummary:
        "Pragmatic and process-oriented. Surfaces blockers early and resolves them fast.",
      promptFile: "prompts/agents/coo-system.txt",
      roleId: roleIds.coo,
      roleTitle: "Chief Operating Officer",
      systemRole: false,
      templateName: "COO",
      updatedAt: daysAgo(2),
    },
    {
      createdAt: daysAgo(88),
      employeeNumber: 3,
      id: slug("priya-ramanathan"),
      influence: "Deep systems intuition. Drives architectural clarity across the stack.",
      memoryRoot: `memory/identities/${slug("priya-ramanathan")}`,
      name: "Priya Ramanathan",
      personaSummary:
        "Methodical and documentation-driven. Favors explicit contracts over implicit convention.",
      promptFile: "prompts/agents/cto-system.txt",
      roleId: roleIds.cto,
      roleTitle: "Chief Technology Officer",
      systemRole: false,
      templateName: "CTO",
      updatedAt: daysAgo(1),
    },
    {
      createdAt: daysAgo(80),
      employeeNumber: 4,
      id: slug("yuki-tanaka"),
      influence: "Sharp experimental instinct. Questions assumptions before designing benchmarks.",
      memoryRoot: `memory/identities/${slug("yuki-tanaka")}`,
      name: "Yuki Tanaka",
      personaSummary:
        "Rigorous and skeptical. Insists on reproducibility. Writes clear, minimal prose.",
      promptFile: "prompts/agents/ceo-system.txt",
      roleId: roleIds.lead,
      roleTitle: "Lead Researcher",
      systemRole: false,
      templateName: "Lead Researcher",
      updatedAt: daysAgo(3),
    },
    {
      createdAt: daysAgo(60),
      employeeNumber: 5,
      id: slug("sam-okafor"),
      influence: "Builds fast and iterates. Good at instrumenting systems others can't see into.",
      memoryRoot: `memory/identities/${slug("sam-okafor")}`,
      name: "Sam Okafor",
      personaSummary: "Energetic and curious. Comfortable with ambiguity, good at narrowing it.",
      promptFile: "prompts/agents/ceo-system.txt",
      roleId: roleIds.eng,
      roleTitle: "Research Engineer",
      systemRole: false,
      templateName: "Research Engineer",
      updatedAt: daysAgo(5),
    },
  ];

  await writeJson(staffPath, {
    departments,
    identities,
    roles,
    teams,
    updatedAt: daysAgo(1),
    version: 1,
  });
  console.log("✓ staff.json seeded (1 department, 2 teams, 5 roles + identities)");
}

// ── 4. Projects ───────────────────────────────────────────────────────────────

async function seedProjects() {
  const projectsPath = path.join(orgDir, "projects.json");
  if (existsSync(projectsPath)) {
    console.log("· projects.json already exists");
    return;
  }

  const projects = [
    {
      createdAt: daysAgo(45),
      id: slug("tier-routing-benchmark-v2"),
      name: "Tier-routing benchmark v2",
      outputs: "Published benchmark suite with baseline scores across top/mid/low tiers.",
      participantRoleIds: [slug("cto"), slug("lead-researcher"), slug("research-engineer")],
      status: "active",
      summary:
        "Design and run a reproducible benchmark suite for evaluating tier routing quality under varying load and model availability conditions.",
      updatedAt: daysAgo(2),
    },
    {
      createdAt: daysAgo(30),
      id: slug("workflow-planner-improvements"),
      name: "Workflow planner improvements",
      outputs: "Updated workflow engine with dependency awareness and priority preemption.",
      participantRoleIds: [slug("cto"), slug("coo"), slug("research-engineer")],
      status: "active",
      summary:
        "Improve the workflow dispatch loop to support dependency edges, priority preemption, and partial completion recovery.",
      updatedAt: daysAgo(1),
    },
    {
      createdAt: daysAgo(14),
      id: slug("q1-evaluation-harness"),
      name: "Q1 evaluation harness",
      outputs: "Eval harness integrated with the Evals panel and ready for automated runs.",
      participantRoleIds: [slug("lead-researcher"), slug("research-engineer")],
      status: "draft",
      summary:
        "Build a repeatable evaluation harness for Q1 agent benchmarks, integrated with the Evals panel and triggerable from the Queue.",
      updatedAt: daysAgo(7),
    },
  ];

  await writeJson(projectsPath, projects);
  console.log("✓ projects.json seeded (3 projects)");
}

// ── 5. Evals ──────────────────────────────────────────────────────────────────

async function seedEvals() {
  const evalsPath = path.join(orgDir, "evals.json");
  if (existsSync(evalsPath)) {
    console.log("· evals.json already exists");
    return;
  }

  const evals = [
    {
      createdAt: daysAgo(21),
      criteria:
        "Plan quality scored on: completeness (0–4), dependency ordering (0–3), objective specificity (0–3).",
      id: slug("orchestrator-plan-quality"),
      name: "Orchestrator plan quality",
      prompt:
        "Given an organizational objective and the current flow state, generate a ranked task plan with dependency edges.",
      resultSummary: "Mean score 7.8 / 10 across 12 runs. Dependency ordering is strongest signal.",
      score: "7.8",
      status: "passing",
      targetRef: "ceo",
      targetType: "agent",
      updatedAt: daysAgo(3),
    },
    {
      createdAt: daysAgo(18),
      criteria: "Tier selection accuracy vs. oracle routing on a fixed node topology.",
      id: slug("tier-selection-accuracy"),
      name: "Tier selection accuracy",
      prompt:
        "Given a queue item with specified tier, model, and token budget, select the optimal node from the available telemetry.",
      resultSummary: "87% accuracy on held-out node configurations. Fails on cold-start topology.",
      score: "0.87",
      status: "passing",
      targetRef: "orgos",
      targetType: "tool",
      updatedAt: daysAgo(5),
    },
    {
      createdAt: daysAgo(7),
      criteria:
        "Workflow completion rate: fraction of seeded workflows that reach 'done' within 10 dispatch cycles.",
      id: slug("workflow-completion-rate"),
      name: "Workflow completion rate",
      prompt: "Seed a 4-task workflow with one dependency edge. Dispatch and measure completion.",
      resultSummary: "72% completion rate. Failures correlate with dependency resolution timeouts.",
      score: "0.72",
      status: "failing",
      targetRef: slug("workflow-planner-improvements"),
      targetType: "workflow",
      updatedAt: daysAgo(1),
    },
  ];

  await writeJson(evalsPath, evals);
  console.log("✓ evals.json seeded (3 evals)");
}

// ── 6. Flow objectives ────────────────────────────────────────────────────────

async function seedFlow() {
  const flowPath = path.join(orgDir, "flow.json");
  if (existsSync(flowPath)) {
    console.log("· flow.json already exists");
    return;
  }

  const t1 = slug("design-tier-routing-benchmark-suite");
  const t2 = slug("run-baseline-benchmark-collection");
  const t3 = slug("analyze-routing-failures");
  const t4 = slug("improve-workflow-dependency-handling");
  const t5 = slug("build-q1-eval-harness");

  const tasks = [
    {
      agentId: "cto",
      assigneeType: "role_assignment",
      assigneeValue: slug("cto"),
      cadence: "once",
      contextRequirement: 8192,
      dependencyIds: [],
      enabled: true,
      groupKey: "benchmark",
      id: t1,
      lastRunAt: daysAgo(12),
      name: "Design tier-routing benchmark suite",
      notes: "Defines the evaluation protocol and sampling strategy for v2 benchmarks.",
      objective:
        "Produce a documented benchmark design covering node topologies, model coverage, and scoring rubric.",
      priority: 1,
      trigger: "auto",
      workstream: "Tier-routing benchmark v2",
    },
    {
      agentId: "lead-researcher",
      assigneeType: "role_assignment",
      assigneeValue: slug("lead-researcher"),
      cadence: "once",
      contextRequirement: 16384,
      dependencyIds: [t1],
      enabled: true,
      groupKey: "benchmark",
      id: t2,
      lastRunAt: daysAgo(5),
      name: "Run baseline benchmark collection",
      notes: "First full benchmark run using the v2 design across all available nodes.",
      objective: "Collect 30+ benchmark runs and store results in a structured evaluation record.",
      priority: 2,
      trigger: "queue_relief",
      workstream: "Tier-routing benchmark v2",
    },
    {
      agentId: "lead-researcher",
      assigneeType: "role_assignment",
      assigneeValue: slug("lead-researcher"),
      cadence: "reflection",
      contextRequirement: 8192,
      dependencyIds: [t2],
      enabled: true,
      groupKey: "benchmark",
      id: t3,
      lastRunAt: null,
      name: "Analyze routing failures",
      notes: "Deep-dive on failure modes uncovered in baseline collection.",
      objective:
        "Produce a failure taxonomy and ranked list of improvement hypotheses for the routing layer.",
      priority: 3,
      trigger: "reflection",
      workstream: "Tier-routing benchmark v2",
    },
    {
      agentId: "cto",
      assigneeType: "role_assignment",
      assigneeValue: slug("cto"),
      cadence: "once",
      contextRequirement: 12288,
      dependencyIds: [],
      enabled: true,
      groupKey: "workflow",
      id: t4,
      lastRunAt: daysAgo(2),
      name: "Improve workflow dependency handling",
      notes: "Addresses the 72% completion rate failure in the workflow eval.",
      objective:
        "Ship updated dispatch loop with dependency edge resolution and priority preemption.",
      priority: 1,
      trigger: "auto",
      workstream: "Workflow planner improvements",
    },
    {
      agentId: "research-engineer",
      assigneeType: "role_assignment",
      assigneeValue: slug("research-engineer"),
      cadence: "once",
      contextRequirement: 8192,
      dependencyIds: [t3, t4],
      enabled: true,
      groupKey: "eval",
      id: t5,
      lastRunAt: null,
      name: "Build Q1 eval harness",
      notes: "Depends on both benchmark analysis and improved workflow dispatch.",
      objective: "Integrate eval harness with Evals panel and make it triggerable from the Queue.",
      priority: 2,
      trigger: "manual",
      workstream: "Q1 evaluation harness",
    },
  ];

  await writeJson(flowPath, { tasks, version: 1 });
  console.log("✓ flow.json seeded (5 objectives)");
}

// ── 7. Meetings ───────────────────────────────────────────────────────────────

async function seedMeetings() {
  const meetDir = path.join(orgDir, "meetings");
  await mkdir(meetDir, { recursive: true });

  const meetings = [
    {
      agenda: [
        "Review benchmark v2 progress",
        "Discuss workflow completion rate failures",
        "Prioritize Q1 eval harness scope",
      ],
      completedAt: daysAgo(7),
      consensus:
        "Benchmark v2 on track. Workflow planner fix prioritized above harness build. Sam to scope harness after CTO ships dispatch fix.",
      createdAt: daysAgo(9),
      id: slug("weekly-planning-apr-1"),
      minutes:
        "Adelaide opened with Q1 milestone review. Priya confirmed dispatch fix ETA of 2 days. Yuki flagged cold-start topology issue in tier routing. Marcus agreed to unblock node provisioning.",
      orgId: orgId,
      participants: ["Adelaide Hartwell", "Marcus Chen", "Priya Ramanathan", "Yuki Tanaka", "Sam Okafor"],
      startedAt: daysAgo(8),
      status: "complete",
      summary: "Q1 milestone review. Dispatch fix ETA confirmed, benchmark v2 progressing.",
      title: "Weekly planning — Apr 1",
    },
    {
      agenda: [
        "Walk through baseline benchmark results",
        "Identify top-3 routing failure modes",
        "Assign follow-up research tasks",
      ],
      completedAt: null,
      consensus: "",
      createdAt: daysAgo(3),
      id: slug("tier-routing-review"),
      minutes: null,
      orgId: orgId,
      participants: ["Priya Ramanathan", "Yuki Tanaka", "Sam Okafor"],
      startedAt: null,
      status: "pending",
      summary: "Deep-dive on baseline benchmark results and routing failure analysis.",
      title: "Tier-routing review",
    },
    {
      agenda: [
        "Score the orchestrator plan quality eval",
        "Review workflow completion rate decline",
        "Update eval criteria for Q1",
      ],
      completedAt: daysAgo(3),
      consensus:
        "Plan quality eval passing. Workflow completion rate decline attributed to dependency timeout bug — now tracked in flow objectives.",
      createdAt: daysAgo(8),
      id: slug("evals-retro"),
      minutes:
        "Yuki walked through eval scoring methodology. Sam demoed the dependency timeout trace. Adelaide approved updated Q1 criteria.",
      orgId: orgId,
      participants: ["Adelaide Hartwell", "Yuki Tanaka", "Sam Okafor"],
      startedAt: daysAgo(5),
      status: "complete",
      summary: "Eval review: plan quality passing, workflow completion rate failure root-caused.",
      title: "Evals retro",
    },
    {
      agenda: [
        "Strategic alignment on autonomous organization thesis",
        "Funding runway and milestone review",
        "Board communication cadence",
      ],
      completedAt: daysAgo(14),
      consensus:
        "Thesis remains strong. Q1 milestones are the primary proof point. Monthly async board update agreed.",
      createdAt: daysAgo(16),
      id: slug("founder-sync"),
      minutes:
        "Adelaide presented Q1 plan. Marcus covered operational metrics. Priya briefed on inference stack progress. Board satisfied with direction.",
      orgId: orgId,
      participants: ["Adelaide Hartwell", "Marcus Chen"],
      startedAt: daysAgo(15),
      status: "complete",
      summary: "Quarterly founder sync. Q1 milestones confirmed as primary board proof point.",
      title: "Founder sync",
    },
  ];

  let seeded = 0;
  for (const meeting of meetings) {
    const meetPath = path.join(meetDir, `${meeting.id}.json`);
    if (!existsSync(meetPath)) {
      await writeJson(meetPath, meeting);
      seeded++;
    }
  }
  console.log(`✓ meetings seeded (${seeded} new, ${meetings.length - seeded} existing)`);
}

// ── 8. Mail ───────────────────────────────────────────────────────────────────

async function seedMail() {
  const mailDir = path.join(orgDir, "mail");
  await mkdir(mailDir, { recursive: true });

  const messages = [
    {
      body: "Priya — the baseline benchmark run is complete. Routing accuracy is 87% overall but drops to 61% on cold-start topology. I'm writing up the failure taxonomy now. Should have something for you to review by end of day.",
      folder: "inbox",
      from: "Yuki Tanaka",
      id: slug("baseline-benchmark-results"),
      orgId: orgId,
      readAt: daysAgo(4),
      sentAt: daysAgo(5),
      subject: "Baseline benchmark results — routing accuracy 87%",
      to: "Priya Ramanathan",
    },
    {
      body: "Sam — I need the dependency timeout trace from your last dispatch run. The workflow completion rate dropped to 72% and I want to understand if it's the resolution logic or the queue pressure. Attach the telemetry export when you get a chance.",
      folder: "inbox",
      from: "Priya Ramanathan",
      id: slug("dependency-timeout-trace-request"),
      orgId: orgId,
      readAt: null,
      sentAt: daysAgo(2),
      subject: "Need the dependency timeout trace",
      to: "Sam Okafor",
    },
    {
      body: "Team — quick update on Q1 milestones. Benchmark v2 is on track (Yuki has results). Workflow dispatch fix is shipping today (Priya confirmed). Harness build starts next week (Sam is scoping). We're in good shape. Stay focused.",
      folder: "inbox",
      from: "Adelaide Hartwell",
      id: slug("q1-milestone-update"),
      orgId: orgId,
      readAt: daysAgo(1),
      sentAt: daysAgo(1),
      subject: "Q1 milestone update — all green",
      to: "All",
    },
    {
      body: "Priya, here's the telemetry export from yesterday's dispatch run. The timeout is happening in the dependency resolution step, not queue pressure. Line 847 of the dispatch loop is where it stalls. Let me know if you need the full trace.",
      folder: "outbox",
      from: "Sam Okafor",
      id: slug("telemetry-export-response"),
      orgId: orgId,
      readAt: null,
      sentAt: daysAgo(1),
      subject: "Re: Need the dependency timeout trace",
      to: "Priya Ramanathan",
    },
    {
      body: "Marcus — I've updated the operational runbook for the new dispatch loop. Key change: dependency edges are now resolved before queue priority is evaluated. The runbook is in the web fragments under 'Operations'. Let me know if anything is unclear.",
      folder: "inbox",
      from: "Priya Ramanathan",
      id: slug("dispatch-runbook-update"),
      orgId: orgId,
      readAt: null,
      sentAt: hoursAgo(3),
      subject: "Dispatch runbook updated — new dependency handling",
      to: "Marcus Chen",
    },
    {
      body: "Yuki — great work on the benchmark suite design. I've reviewed the rubric and it's solid. One suggestion: add a 'node recovery' scenario to stress-test what happens when a primary node goes offline mid-run. That failure mode will matter for the board demo.",
      folder: "inbox",
      from: "Adelaide Hartwell",
      id: slug("benchmark-suite-feedback"),
      orgId: orgId,
      readAt: null,
      sentAt: hoursAgo(6),
      subject: "Benchmark suite — add node recovery scenario",
      to: "Yuki Tanaka",
    },
  ];

  let seeded = 0;
  for (const msg of messages) {
    const msgPath = path.join(mailDir, `${msg.id}.json`);
    if (!existsSync(msgPath)) {
      await writeJson(msgPath, msg);
      seeded++;
    }
  }
  console.log(`✓ mail seeded (${seeded} new, ${messages.length - seeded} existing)`);
}

// ── 9. Workflows ──────────────────────────────────────────────────────────────

async function seedWorkflows() {
  const workflowsPath = path.join(orgDir, "workflows.json");
  if (existsSync(workflowsPath)) {
    console.log("· workflows.json already exists");
    return;
  }

  const workflows = [
    {
      createdAt: daysAgo(5),
      createdBy: "Adelaide Hartwell",
      id: slug("benchmark-v2-pipeline"),
      objective:
        "Complete benchmark v2: design → collect → analyze → synthesize findings into a published report.",
      organizationId: orgId,
      status: "running",
      taskIds: [
        slug("tier-routing-benchmark-design-task"),
        slug("tier-routing-data-collection-task"),
        slug("routing-failure-analysis-task"),
        slug("benchmark-report-draft-task"),
      ],
      title: "Benchmark v2 pipeline",
      updatedAt: daysAgo(1),
    },
    {
      createdAt: daysAgo(10),
      createdBy: "Priya Ramanathan",
      id: slug("dispatch-fix-workflow"),
      objective:
        "Ship the workflow dispatch fix: diagnose root cause, implement dependency resolution fix, validate with eval harness.",
      organizationId: orgId,
      status: "done",
      taskIds: [
        slug("dispatch-root-cause-task"),
        slug("dependency-resolution-fix-task"),
        slug("dispatch-validation-task"),
      ],
      title: "Dispatch fix workflow",
      updatedAt: daysAgo(1),
    },
  ];

  await writeJson(workflowsPath, workflows);
  console.log("✓ workflows.json seeded (2 workflows — 1 running, 1 done)");
}

// ── 10. Web fragments ─────────────────────────────────────────────────────────

async function seedWeb() {
  const fragmentsDir = path.join(orgDir, "web", "fragments");
  await mkdir(fragmentsDir, { recursive: true });

  const fragments = [
    {
      filename: "about.htm",
      content: `<section class="page-section">
  <h1>About Octet</h1>
  <p>Octet is an autonomous research lab building coordination primitives for multi-agent inference organizations. Founded in 2026, we operate at the intersection of systems design and AI orchestration.</p>
  <h2>Mission</h2>
  <p>Make autonomous organization a tractable problem.</p>
</section>`,
    },
    {
      filename: "roster.htm",
      content: `<section class="page-section">
  <h1>Roster</h1>
  <ul>
    <li><strong>Adelaide Hartwell</strong> — Chief Executive Officer</li>
    <li><strong>Marcus Chen</strong> — Chief Operating Officer</li>
    <li><strong>Priya Ramanathan</strong> — Chief Technology Officer</li>
    <li><strong>Yuki Tanaka</strong> — Lead Researcher, Inference Lab</li>
    <li><strong>Sam Okafor</strong> — Research Engineer, Inference Lab</li>
  </ul>
</section>`,
    },
    {
      filename: "research.htm",
      content: `<section class="page-section">
  <h1>Active Research</h1>
  <h2>Tier-Routing Benchmark v2</h2>
  <p>A reproducible benchmark suite for evaluating tier routing quality under varying load and model availability. First results show 87% accuracy with a known failure mode on cold-start topology.</p>
  <h2>Workflow Planner Improvements</h2>
  <p>Redesigned dispatch loop with dependency edge resolution and priority preemption. Addresses the 72% completion rate limitation in v1.</p>
</section>`,
    },
  ];

  let seeded = 0;
  for (const frag of fragments) {
    const fragPath = path.join(fragmentsDir, frag.filename);
    if (!existsSync(fragPath)) {
      await writeFile(fragPath, frag.content, "utf8");
      seeded++;
    }
  }
  console.log(`✓ web fragments seeded (${seeded} new, ${fragments.length - seeded} existing)`);
}

// ── 11. Board notifications ───────────────────────────────────────────────────

async function seedNotifications() {
  const notifPath = path.join(systemDir, "notifications.json");
  const config = await readJsonOrDefault<{ notifications: unknown[]; version: number }>(notifPath, {
    notifications: [],
    version: 1,
  });

  const ids = new Set(
    (config.notifications as Array<{ id: string }>).map((n) => n.id),
  );

  const toAdd = [
    {
      createdAt: daysAgo(7),
      id: slug("notif-workflow-dispatch-fix-done"),
      level: "unread",
      organizationId: orgId,
      sourceApp: "queue",
      summary: "Dispatch fix workflow completed all 3 tasks — dependency resolution now active.",
      targetId: slug("dispatch-fix-workflow"),
      targetPanel: "queue",
      title: "Workflow complete",
      unread: false,
    },
    {
      createdAt: daysAgo(5),
      id: slug("notif-benchmark-v2-started"),
      level: "unread",
      organizationId: orgId,
      sourceApp: "queue",
      summary: "Benchmark v2 pipeline workflow started — 4 tasks queued.",
      targetId: slug("benchmark-v2-pipeline"),
      targetPanel: "queue",
      title: "Workflow started",
      unread: false,
    },
    {
      createdAt: daysAgo(5),
      id: slug("notif-baseline-benchmark-done"),
      level: "unread",
      organizationId: orgId,
      sourceApp: "queue",
      summary: "Baseline benchmark collection complete — 34 runs recorded, 87% routing accuracy.",
      targetId: slug("tier-routing-benchmark-v2"),
      targetPanel: "evals",
      title: "Agent task complete",
      unread: false,
    },
    {
      createdAt: daysAgo(3),
      id: slug("notif-tier-routing-eval-run"),
      level: "unread",
      organizationId: orgId,
      sourceApp: "evals",
      summary: "Tier selection accuracy eval passed with 87% accuracy on held-out configurations.",
      targetId: slug("tier-selection-accuracy"),
      targetPanel: "evals",
      title: "Eval passed",
      unread: false,
    },
    {
      createdAt: daysAgo(2),
      id: slug("notif-workflow-completion-rate-failing"),
      level: "unread",
      organizationId: orgId,
      sourceApp: "evals",
      summary: "Workflow completion rate eval is failing — 72% rate, below 80% threshold. Review dependency handling.",
      targetId: slug("workflow-completion-rate"),
      targetPanel: "evals",
      title: "Eval failing",
      unread: true,
    },
    {
      createdAt: daysAgo(1),
      id: slug("notif-q1-milestone-update"),
      level: "unread",
      organizationId: orgId,
      sourceApp: "about",
      summary: "Adelaide confirmed all Q1 milestones on track. Benchmark v2 and dispatch fix are the critical path.",
      targetId: orgId,
      targetPanel: "about",
      title: "Milestone update",
      unread: true,
    },
    {
      createdAt: hoursAgo(6),
      id: slug("notif-dispatch-runbook-updated"),
      level: "unread",
      organizationId: orgId,
      sourceApp: "web",
      summary: "Dispatch runbook updated with new dependency handling details — web fragment 'Operations'.",
      targetId: "operations",
      targetPanel: "web",
      title: "Document updated",
      unread: true,
    },
    {
      createdAt: hoursAgo(2),
      id: slug("notif-benchmark-analysis-queued"),
      level: "unread",
      organizationId: orgId,
      sourceApp: "queue",
      summary: "Routing failure analysis task dispatched to Yuki Tanaka — tier: mid, estimated 8k tokens.",
      targetId: slug("routing-failure-analysis-task"),
      targetPanel: "queue",
      title: "Agent dispatched",
      unread: true,
    },
  ];

  let added = 0;
  for (const notif of toAdd) {
    if (!ids.has(notif.id)) {
      (config.notifications as unknown[]).push(notif);
      added++;
    }
  }

  if (added > 0) {
    await writeJson(notifPath, config);
  }
  console.log(`✓ notifications seeded (${added} new, ${toAdd.length - added} existing)`);
}

// ── 12. Telemetry ─────────────────────────────────────────────────────────────

async function seedTelemetry() {
  const telemetryPath = path.join(systemDir, "telemetry.json");
  const config = await readJsonOrDefault<{ inference: { events: unknown[] }; version: number }>(
    telemetryPath,
    { inference: { events: [] }, version: 1 },
  );

  if (config.inference.events.length >= 20) {
    console.log("· telemetry already has events, skipping");
    return;
  }

  const agents = [
    "Adelaide Hartwell",
    "Marcus Chen",
    "Priya Ramanathan",
    "Yuki Tanaka",
    "Sam Okafor",
  ];
  const tiers = ["top", "mid", "mid", "low", "low"] as const;
  const models = ["llama3.2:3b", "mistral:7b", "llama3.1:8b"];
  const statuses = ["done", "done", "done", "done", "failed"] as const;

  const events = Array.from({ length: 50 }, (_, i) => {
    const agentIdx = i % agents.length;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      agentId: agents[agentIdx],
      completedAt: hoursAgo(Math.floor(Math.random() * 48)),
      durationMs: 800 + Math.floor(Math.random() * 4200),
      id: `telemetry-${i}`,
      model: models[Math.floor(Math.random() * models.length)],
      organizationId: orgId,
      promptTokens: 1200 + Math.floor(Math.random() * 3000),
      completionTokens: 400 + Math.floor(Math.random() * 800),
      status,
      tier: tiers[agentIdx],
    };
  });

  config.inference.events.push(...events);
  await writeJson(telemetryPath, config);
  console.log(`✓ telemetry seeded (${events.length} inference events)`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding demo organization: Octet\n");

  // The server discovers orgs by scanning organizationsDir — no index entry needed.
  await mkdir(orgDir, { recursive: true });
  await mkdir(systemDir, { recursive: true });

  await seedAbout();
  await seedStaff();
  await seedProjects();
  await seedEvals();
  await seedFlow();
  await seedMeetings();
  await seedMail();
  await seedWorkflows();
  await seedWeb();
  await seedNotifications();
  await seedTelemetry();

  console.log("\nDemo seed complete. Start the server and activate 'Octet' to explore.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
