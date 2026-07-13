# APDL — States

> ID: APDL-005
> Status: 🔒 Constitutional
> Versão: 1.0
> Última revisão: Sprint 1.5

---

# Objetivo

Este documento define os estados oficiais de uma demanda dentro do AutoPilot Product Development Lifecycle.

Cada demanda deve estar exatamente em um estado por vez.

Os estados permitem rastrear a evolução do trabalho, automatizar processos e facilitar a comunicação entre pessoas e agentes de IA.

---

# Estados Oficiais

## Discovery

A demanda está sendo compreendida.

Objetivo:

Entender o problema.

---

## Product Alignment

A demanda está sendo validada estrategicamente.

Objetivo:

Garantir aderência ao Project Bible.

---

## Engineering Design

A solução técnica está sendo definida.

Objetivo:

Escolher a melhor abordagem arquitetural.

---

## Sprint Ready

A Sprint Specification foi aprovada.

A demanda está pronta para implementação.

---

## In Progress

A implementação está em andamento.

Responsável principal:

Senior Software Engineer.

---

## Technical Review

A implementação aguarda revisão técnica.

---

## Validation

A solução está sendo validada.

Critérios de aceitação são verificados.

---

## Ready for Merge

A implementação foi aprovada.

Aguardando integração.

---

## Documentation Update

Toda documentação impactada está sendo atualizada.

---

## Knowledge Preservation

Os aprendizados estão sendo incorporados ao projeto.

Exemplos:

- ADR
- Playbook
- History
- Engineering Bible

---

## Done

O ciclo foi concluído.

O conhecimento foi preservado.

A demanda pode ser considerada oficialmente encerrada.

---

# Fluxo

Discovery

↓

Product Alignment

↓

Engineering Design

↓

Sprint Ready

↓

In Progress

↓

Technical Review

↓

Validation

↓

Ready for Merge

↓

Documentation Update

↓

Knowledge Preservation

↓

Done

---

# Regras

Uma demanda nunca pode:

- voltar para Discovery sem justificativa;
- estar em dois estados simultaneamente;
- ser marcada como Done antes da preservação do conhecimento.

---

# Filosofia

Os estados do APDL representam a evolução do conhecimento sobre uma demanda.

O código implementado é apenas uma das consequências dessa evolução.