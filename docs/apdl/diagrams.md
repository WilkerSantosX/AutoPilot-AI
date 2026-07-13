# APDL — Diagrams

> ID: APDL-009
> Status: 🧊 Frozen
> Versão: 1.0
> Última revisão: Sprint 1.5

---

# Objetivo

Este documento reúne os diagramas oficiais do AutoPilot Product Development Lifecycle (APDL).

Os diagramas complementam a documentação textual e oferecem uma visão rápida da estrutura da metodologia.

---

# Diagrama 1 — Visão Geral do APDL

## Objetivo

Apresentar o fluxo completo de uma demanda.

```mermaid
flowchart TD

A[Discovery]
-->B[Product Alignment]
-->C[Engineering Design]
-->D[Sprint Specification]
-->E[Implementation]
-->F[Technical Review]
-->G[Validation]
-->H[Merge]
-->I[Documentation Update]
-->J[Knowledge Preservation]
-->K[Done]
```

---

# Diagrama 2 — Máquina de Estados

## Objetivo

Representar os estados oficiais de uma demanda.

```mermaid
stateDiagram-v2

Discovery --> ProductAlignment
ProductAlignment --> EngineeringDesign
EngineeringDesign --> SprintReady
SprintReady --> InProgress
InProgress --> TechnicalReview
TechnicalReview --> Validation
Validation --> ReadyForMerge
ReadyForMerge --> DocumentationUpdate
DocumentationUpdate --> KnowledgePreservation
KnowledgePreservation --> Done
```

---

# Diagrama 3 — Camadas do APDL

## Objetivo

Representar a separação entre conhecimento e execução.

```mermaid
flowchart TB

subgraph Knowledge Layer

PB[Project Bible]

EB[Engineering Bible]

ADR[ADR]

HIS[History]

end

subgraph Execution Layer

APDL

WF[Workflow]

ST[States]

TR[Transition Rules]

QG[Quality Gates]

end

PB --> APDL

EB --> APDL

ADR --> APDL

HIS --> APDL

APDL --> WF

WF --> ST

ST --> TR

TR --> QG
```

---

# Diagrama 4 — Responsabilidades

## Objetivo

Visualizar a colaboração entre papéis.

```mermaid
flowchart LR

Founder --> ProductOwner

ProductOwner --> ChiefArchitect

ChiefArchitect --> TechLead

TechLead --> SeniorEngineer

SeniorEngineer --> Review

Review --> Documentation
```

---

# Diagrama 5 — Fluxo do Conhecimento

## Objetivo

Mostrar como o conhecimento retorna ao sistema.

```mermaid
flowchart TD

Implementation

-->

Documentation

-->

History

-->

ADR

-->

EngineeringBible

-->

ProjectBible

-->

NovaDiscovery
```

---

# Observações

Os diagramas representam a arquitetura oficial da versão atual do APDL.

Novos diagramas poderão ser adicionados conforme a metodologia evoluir.

Sempre que houver divergência entre diagramas e documentos textuais, prevalecem os documentos textuais.