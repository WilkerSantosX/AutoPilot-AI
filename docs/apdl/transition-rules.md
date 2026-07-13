# APDL — Transition Rules

> ID: APDL-006
> Status: 🔒 Constitutional
> Versão: 1.0
> Última revisão: Sprint 1.5

---

# Objetivo

Este documento define as regras oficiais para transição entre os estados do AutoPilot Product Development Lifecycle (APDL).

Toda mudança de estado deve obedecer às regras aqui descritas.

O objetivo é garantir previsibilidade, rastreabilidade e qualidade durante todo o ciclo de desenvolvimento.

---

# Princípios

Uma transição somente pode ocorrer quando:

- o estado atual permitir;
- todos os pré-requisitos forem atendidos;
- o responsável possuir autoridade para aprová-la;
- nenhuma regra de bloqueio estiver ativa.

---

# Estrutura de uma Regra

Cada transição é composta por:

- Estado de origem
- Estado de destino
- Responsável pela aprovação
- Pré-requisitos
- Critérios de bloqueio
- Artefatos obrigatórios

---

# Regras Oficiais

## Discovery → Product Alignment

Responsável:

Product Owner

Pré-requisitos:

- problema claramente definido.

Bloqueios:

- objetivo indefinido.

Artefatos:

- descrição da demanda.

---

## Product Alignment → Engineering Design

Responsáveis:

Product Owner

Chief Architect

Pré-requisitos:

- alinhamento ao Project Bible.

Bloqueios:

- conflito com Product Principles;
- conflito com Product Boundaries.

Artefatos:

- decisão estratégica registrada.

---

## Engineering Design → Sprint Ready

Responsável:

Chief Architect

Pré-requisitos:

- arquitetura definida;
- riscos conhecidos;
- necessidade de ADR avaliada.

Artefatos:

- Sprint Specification.

---

## Sprint Ready → In Progress

Responsável:

Tech Lead

Pré-requisitos:

- Sprint aprovada.

---

## In Progress → Technical Review

Responsável:

Senior Software Engineer

Pré-requisitos:

- implementação concluída;
- código compilando;
- documentação inicial atualizada.

Bloqueios:

- falhas críticas.

---

## Technical Review → Validation

Responsável:

Chief Architect

Pré-requisitos:

- revisão técnica aprovada.

Bloqueios:

- dívida técnica crítica;
- violações arquiteturais.

---

## Validation → Ready for Merge

Responsável:

Product Owner

Pré-requisitos:

- critérios de aceitação atendidos.

---

## Ready for Merge → Documentation Update

Responsável:

Tech Lead

Pré-requisitos:

- Merge realizado.

---

## Documentation Update → Knowledge Preservation

Responsável:

Toda a equipe.

Pré-requisitos:

- documentação sincronizada.

---

## Knowledge Preservation → Done

Responsável:

Chief Architect

Pré-requisitos:

- lições aprendidas registradas;
- documentação consistente.

---

# Regras Gerais

Nenhuma transição pode ignorar estados obrigatórios.

Toda exceção deve ser registrada.

Toda mudança extraordinária deve ser rastreável.

---

# Filosofia

As Transition Rules garantem que uma demanda avance apenas quando estiver realmente preparada para a próxima etapa.

Elas existem para proteger o conhecimento do projeto, e não para criar burocracia.