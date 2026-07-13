# APDL — Roles and Responsibilities

> ID: APDL-002
> Status: 🔒 Constitutional
> Versão: 1.0
> Última revisão: Sprint 1.5

---

# Objetivo

Este documento define os papéis oficiais dentro do AutoPilot Product Development Lifecycle (APDL).

Cada papel possui responsabilidades claras, evitando sobreposição de funções e garantindo uma colaboração eficiente entre pessoas e agentes de IA.

---

# Princípios

No APDL, responsabilidades pertencem aos papéis, não às ferramentas.

Isso significa que, futuramente, diferentes ferramentas poderão assumir um mesmo papel sem alterar a metodologia.

---

# Papéis Oficiais

## Founder

Responsável pela existência do produto.

Responsabilidades:

- definir propósito;
- estabelecer visão de longo prazo;
- aprovar mudanças estratégicas;
- proteger a identidade do produto.

---

## Product Owner

Responsável pelo valor entregue.

Responsabilidades:

- priorizar backlog;
- definir objetivos das Sprints;
- validar requisitos;
- aprovar entregas.

---

## Chief Architect

Responsável pela arquitetura global.

Responsabilidades:

- definir princípios arquiteturais;
- revisar decisões técnicas;
- aprovar mudanças estruturais;
- garantir alinhamento entre produto e engenharia.

---

## Tech Lead

Responsável pela execução técnica.

Responsabilidades:

- orientar implementação;
- reduzir dívida técnica;
- garantir qualidade de engenharia;
- apoiar revisões.

---

## Product Strategist

Responsável pela evolução estratégica.

Responsabilidades:

- alinhar funcionalidades ao Product Bible;
- analisar impacto de novas ideias;
- preservar coerência do produto.

---

## Senior Software Engineer

Responsável pela implementação.

Responsabilidades:

- desenvolver funcionalidades;
- corrigir defeitos;
- realizar refatorações;
- manter aderência ao Engineering Bible.

---

# Agentes de IA

O APDL considera agentes de IA como participantes oficiais do processo de desenvolvimento.

Cada agente atua em uma especialidade bem definida.

Exemplos:

- implementação;
- revisão;
- documentação;
- testes;
- arquitetura;
- pesquisa.

---

# Matriz de Responsabilidades

| Atividade | Founder | PO | Chief Architect | Tech Lead | Engineer |
|------------|---------|----|-----------------|-----------|----------|
| Estratégia | A | C | C | I | I |
| Backlog | I | A | C | C | I |
| Arquitetura | I | C | A | C | I |
| Sprint Spec | I | A | C | C | I |
| Implementação | I | I | C | C | A |
| Code Review | I | I | A | C | C |
| Merge | I | I | C | A | C |
| Documentação | I | C | A | C | C |

Legenda:

- A = Accountable
- C = Contributor
- I = Informed

---

# Filosofia

O APDL não distribui autoridade.

Ele distribui responsabilidade.

A colaboração entre pessoas e agentes de IA deve ampliar a qualidade das decisões, preservando sempre a clareza sobre quem responde por cada etapa do ciclo de desenvolvimento.