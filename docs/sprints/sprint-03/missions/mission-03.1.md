# Mission 03.1 — Vehicle Care Foundation

> Sprint: 03 — Vehicle Care — Da memória à orientação  
> Status: **Approved**  
> Governance: GOV.01 — Mission Handoff Protocol  
> Owner: Chief Architect / Tech Lead  
> Executor: Codex / Senior Software Engineer

## 1. Approved baseline

Execution must start from branch `feature/sprint-03-vehicle-care`, created from the approved Sprint 3 contract commit:

`48c423a5dc4c513ee0edc377d78e100d944e3d39`

The Sprint 3 planning baseline is `main` after the Sprint 2 documentary closure at:

`fdbcf782263b189cd2907c239773dadc7c016c5f`

Before implementation, Codex must confirm the active branch, repository cleanliness and that the mission file is present on the active branch.

## 2. Objective

Create the smallest persistent domain foundation required for Vehicle Care by introducing:

- the initial **Care Item** concept;
- the initial **Care Event** concept;
- local persistence for Vehicle Care data;
- automated tests for the introduced domain and persistence behavior.

This mission establishes memory for vehicle care facts. It does **not** interpret care state, calculate due maintenance or change the product journey yet.

## 3. Product intent

The Sprint 3 flow is:

`memória → interpretação determinística → orientação → próxima ação`

Mission 03.1 implements only the first foundation needed by that flow: a reliable way to represent what is being followed and facts the user records about care.

A **Care Event is a recorded fact, not a forecast, diagnosis or inferred mechanical condition**.

## 4. Preconditions

Before changing implementation, Codex must:

1. read `AGENTS.md`;
2. read `docs/governance/mission-handoff-protocol.md`;
3. read `docs/sprints/sprint-03/sprint-contract.md`;
4. inspect the existing vehicle profile/domain and persistence patterns relevant to this mission;
5. confirm that no higher-precedence documentation conflicts with the mission;
6. confirm no new dependency or architectural change is required.

If a conflict or required architectural change is found, stop and report before implementation.

## 5. Authorized scope

Codex is authorized to implement only what is necessary to satisfy the following foundation.

### 5.1 Care Item

Introduce an explicit representation for a care item that can identify the initial Sprint 3 care families:

- `engine-oil`;
- `cooling`;
- `basic-review`.

The implementation should preserve the distinction between the identity/definition of a care item and events that happen to it.

Do not build a generic maintenance catalog or configuration framework.

### 5.2 Care Event

Introduce an explicit representation for a fact recorded about a care item.

The minimum model must be capable of associating the event with:

- the vehicle it belongs to;
- the care item it concerns;
- an event identity;
- when the event was recorded/occurred as required by the chosen minimal model;
- optional factual mileage when explicitly provided by the user;
- an event type/action sufficient for the initial domain without pretending to model every future maintenance operation.

Exact property names and module boundaries may follow existing repository conventions, provided the semantic distinctions above remain explicit.

### 5.3 Persistence

Provide local persistence for Vehicle Care facts using the repository's existing client-side persistence approach.

Persistence must:

- keep care data associated with the correct vehicle;
- support saving and retrieving care events;
- return a safe empty state when no care history exists;
- avoid corrupting or silently changing the existing `VehicleProfile` contract;
- preserve a clear path for later Sprint 3 missions to consume the stored facts.

A schema/version marker may be introduced if consistent with existing persistence patterns and useful for safe evolution. Do not build migration infrastructure beyond what this mission actually needs.

### 5.4 Validation and tests

Add focused automated tests for the new domain/persistence behavior using the repository's current test approach and without adding dependencies.

At minimum validate:

- supported care item identities;
- valid care event persistence and retrieval;
- isolation/association by vehicle;
- safe empty history behavior;
- rejection or safe handling of structurally invalid events according to the chosen existing validation pattern;
- regression of relevant existing tests.

## 6. Forbidden scope / limits

This mission does **not** authorize:

- Odometer Checkpoints or mileage history;
- Care State calculation;
- due/overdue thresholds;
- Next Action calculation;
- care onboarding UI;
- cockpit changes;
- reminders or notifications;
- estimation of vehicle usage;
- GPS/background tracking;
- OBD-II or telemetry;
- backend/cloud sync;
- authentication;
- chatbot/LLM behavior;
- diagnosis of defects or mechanical health;
- workshop recommendations;
- marketplace or parts purchasing;
- advanced costs;
- a complete maintenance library;
- new dependencies, frameworks or architectural layers;
- incidental cleanup/refactoring outside the minimum required area.

Do not infer future behavior into the stored facts. Unknown data remains unknown.

## 7. Acceptance criteria

Mission 03.1 is technically acceptable when all of the following are evidenced:

1. The code has an explicit, small representation of the initial Care Items.
2. The code has an explicit Care Event representation whose semantics are factual rather than predictive.
3. A Care Event can be associated with the correct vehicle and care item.
4. Vehicle Care events can be persisted and retrieved locally using repository-compatible patterns.
5. A vehicle with no recorded care history yields a safe empty state rather than fabricated information.
6. Existing VehicleProfile persistence/behavior remains compatible unless an unavoidable conflict triggers a stop condition.
7. Invalid event structures are rejected or safely handled consistently with existing repository conventions.
8. Focused automated tests cover the introduced behavior and relevant existing tests continue to pass.
9. No UI promise is added for functionality that this mission does not implement.
10. No forbidden Sprint 3 capability or Mission 03.2+ behavior is implemented early.

## 8. Required validation

Codex must, at minimum:

- run the complete available automated test suite relevant to the repository;
- run syntax validation for changed JavaScript files using the repository's current approach;
- run `git diff --check`;
- review the final diff for scope leakage;
- verify the application can still start/serve using the existing project workflow when practical;
- inspect the browser console when application execution is part of validation and report any observed errors.

If an existing unrelated validation issue is observed, record it separately and do not silently expand scope to fix it.

## 9. Git and publication rules

For this mission only, Codex is authorized to:

- modify files required by the approved scope on `feature/sprint-03-vehicle-care`;
- create the required report at `docs/sprints/sprint-03/reports/mission-03.1-report.md`;
- commit the implementation and report together after successful validation;
- push the resulting commit to `origin/feature/sprint-03-vehicle-care`.

Suggested commit message:

`feat(vehicle-care): establish care foundation`

Codex is **not** authorized to:

- commit or push to `main`;
- merge any Pull Request;
- rebase, squash, force-push or rewrite history;
- begin Mission 03.2.

## 10. Stop conditions

Stop before implementation or before expanding changes if:

- required documentation conflicts;
- the baseline/branch is not the expected one and cannot be safely reconciled without a governance decision;
- existing VehicleProfile contracts would need a breaking change;
- repository architecture/project structure must change;
- a new dependency is required;
- the mission requires defining Care State, Odometer Checkpoints or another later-Sprint concept to proceed;
- product semantics require guessing whether a fact is known, calculated, estimated or unknown;
- scope must expand to complete the task;
- a security or data-integrity risk appears.

On stop, produce the GOV.01 blocked report with evidence and the explicit decision required. Do not work around the stop condition.

## 11. Required report

Persist the execution report at:

`docs/sprints/sprint-03/reports/mission-03.1-report.md`

The report must contain, at minimum:

1. initial repository state and branch/HEAD;
2. directed inspection performed and relevant existing patterns found;
3. implementation performed;
4. files created/modified;
5. local technical decisions and why they remain inside the mission contract;
6. acceptance criteria results item by item;
7. tests and validation commands with results;
8. diff summary;
9. final Git state and commit SHA;
10. risks, limitations and pending items;
11. explicit confirmation that forbidden scope was not implemented;
12. explicit confirmation that Mission 03.2 was not started.

Keep **Facts**, **Decisions** and **Recommendations** distinguishable as required by `AGENTS.md`.

## 12. Completion gate

Codex finishing execution does not complete the mission.

After push, the Tech Lead reviews repository evidence, report, diff and final Git state. The mission becomes `Completed` only after the explicit review/acceptance gate.

Do not advance to Mission 03.2 without explicit authorization.
