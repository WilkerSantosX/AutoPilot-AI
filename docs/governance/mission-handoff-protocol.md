# Mission Handoff Protocol

> Project: AutoPilot AI
> Governance ID: GOV.01
> Owner: Chief Architect
> Status: Approved

## Purpose

Define the minimum repository-based handoff between the Product Owner, Chief Architect/Tech Lead and Codex/Senior Software Engineer.

The repository is the shared operational contract. This protocol automates transport of approved work and execution evidence; it does not delegate product or architectural authority.

## Responsibilities

- **Founder / Product Owner:** approves product intent, priorities and acceptance of outcomes.
- **Chief Architect / Tech Lead:** defines mission scope, architectural constraints, acceptance criteria and reviews execution evidence.
- **Codex / Senior Software Engineer:** executes only the approved mission, validates the implementation, records evidence and stops at the defined boundary.

`AGENTS.md` remains the permanent engineering playbook and applies to every mission.

## Canonical Mission Structure

Sprint-specific missions and reports live under the current Sprint:

```text
docs/sprints/<sprint>/
├── missions/
│   └── mission-<id>.md
└── reports/
    └── mission-<id>-report.md
```

Historical Sprint documents are preserved. Existing files are not renamed or moved solely to conform to this protocol.

## Handoff Lifecycle

1. PO and Tech Lead agree on the next mission.
2. Tech Lead publishes `missions/mission-<id>.md` on the active working branch.
3. Codex reads `AGENTS.md`, the mission file and the required project documents referenced by them.
4. Codex validates all mission preconditions before changing implementation.
5. Codex executes only the authorized scope.
6. Codex validates the result and writes `reports/mission-<id>-report.md` when the mission requires a persisted report.
7. Codex publishes the approved mission changes on the active working branch according to the mission's Git instructions.
8. Tech Lead reviews the report, commit/diff and repository state directly from the shared repository.
9. PO/Tech Lead approve, reject or request a correction.
10. Codex does not begin the next mission until it is explicitly authorized.

## Mission Contract

Every mission must state, at minimum:

- mission ID and title;
- status;
- approved baseline or required starting state;
- objective;
- preconditions;
- authorized scope;
- forbidden scope / limits;
- acceptance criteria;
- validation requirements;
- Git/publication rules;
- stop conditions;
- expected report path and required report content.

A mission may add stricter requirements but must not silently weaken `AGENTS.md`.

## Mission Status

Use one of these values:

- `Draft` — not executable;
- `Approved` — executable by Codex;
- `Blocked` — execution must not continue;
- `Completed` — implementation/report accepted and formally closed.

Only an `Approved` mission may be executed.

## Execution Entry Point

The normal Codex handoff should be short:

```text
Execute the approved mission at <mission-path> following AGENTS.md and the Mission Handoff Protocol. Produce the required report, obey all stop conditions, and do not advance to another mission.
```

The mission file, not the chat message, contains the detailed execution contract.

## Reporting Contract

A persisted mission report should contain, when applicable:

1. initial repository state;
2. facts observed during directed inspection;
3. actions/implementation performed;
4. files created or modified;
5. architectural/local technical decisions;
6. acceptance criteria results;
7. tests and validation commands/results;
8. diff summary;
9. final Git state and commit SHA;
10. risks, limitations and pending items;
11. explicit confirmation that mission limits were respected.

Facts, decisions and recommendations must remain distinguishable, consistent with `AGENTS.md`.

## Stop-and-Report Rule

Codex must stop before expanding scope when any `AGENTS.md` stop condition or mission-specific stop condition is met.

A blocked execution must report:

- the precondition or constraint that failed;
- evidence observed;
- whether any files were changed;
- whether any commit/push occurred;
- the decision required from PO/Tech Lead.

Do not work around a governance stop condition merely to complete the mission.

## Git Discipline

This protocol does not authorize changes to `main`, merges, rebases, squashes, destructive resets, force pushes or history rewrites.

Each mission defines whether commit/push is authorized and which branch is valid. Mission and report artifacts should remain traceable to the implementation they govern.

## Review Contract

The Tech Lead review is based on repository evidence rather than copied chat output whenever that evidence is available remotely.

A mission is not formally complete merely because Codex finished execution. Completion requires the review/approval gate defined by the mission.

## Scope of GOV.01

GOV.01 establishes only the handoff protocol. It does not:

- change application code;
- change product behavior;
- authorize Sprint 02.4 implementation;
- replace APDL, ADRs, Project Bible or Engineering Bible;
- introduce CI/CD, backend services or autonomous product decisions.

Automation may evolve later only after this protocol proves useful in practice.
