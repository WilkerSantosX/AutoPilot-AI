# APDL — Quality Gates

> ID: APDL-007
> Status: 🔒 Constitutional
> Versão: 1.0
> Última revisão: Sprint 1.5

---

# Objetivo

Os Quality Gates definem os critérios mínimos de qualidade exigidos para que uma demanda avance entre estados do APDL.

Eles funcionam como mecanismos reutilizáveis de validação.

As Transition Rules consultam os Quality Gates antes de autorizar qualquer mudança de estado.

---

# Filosofia

Os Quality Gates não existem para impedir entregas.

Eles existem para impedir que problemas avancem para a próxima etapa.

Quanto mais cedo uma falha for identificada, menor será seu custo de correção.

---

# Estrutura

Todo Quality Gate possui:

- Objetivo
- Critérios
- Responsável pela validação
- Resultado

Resultado possível:

- PASS
- FAIL

---

# Quality Gates Oficiais

## QG-001 — Product Alignment

Objetivo:

Garantir aderência ao Project Bible.

Critérios:

- alinhado ao North Star;
- respeita Product Principles;
- respeita Product Boundaries;
- fortalece o conceito de Vehicle Life Intelligence.

Responsável:

Product Owner

---

## QG-002 — Architecture

Objetivo:

Validar a estratégia técnica.

Critérios:

- arquitetura definida;
- impactos conhecidos;
- necessidade de ADR avaliada.

Responsável:

Chief Architect

---

## QG-003 — Sprint Specification

Objetivo:

Garantir que a Sprint está pronta para implementação.

Critérios:

- requisitos claros;
- critérios de aceitação definidos;
- riscos conhecidos.

Responsável:

Chief Architect

---

## QG-004 — Implementation

Objetivo:

Validar a implementação.

Critérios:

- código funcionando;
- aderência ao Engineering Bible;
- simplicidade;
- ausência de falhas críticas.

Responsável:

Senior Software Engineer

---

## QG-005 — Technical Review

Objetivo:

Garantir qualidade técnica.

Critérios:

- arquitetura preservada;
- legibilidade;
- baixo acoplamento;
- alta coesão.

Responsável:

Chief Architect

---

## QG-006 — Validation

Objetivo:

Confirmar entrega de valor.

Critérios:

- critérios de aceitação atendidos;
- problema resolvido;
- ausência de regressões conhecidas.

Responsável:

Product Owner

---

## QG-007 — Documentation

Objetivo:

Garantir sincronização da documentação.

Critérios:

- documentação atualizada;
- artefatos sincronizados;
- ADR criada quando necessária.

Responsável:

Toda a equipe.

---

## QG-008 — Knowledge Preservation

Objetivo:

Preservar aprendizado.

Critérios:

- lições registradas;
- History atualizado quando necessário;
- Playbooks atualizados quando necessário;
- melhorias metodológicas avaliadas.

Responsável:

Chief Architect

---

# Reutilização

Um mesmo Quality Gate pode ser utilizado por diferentes Transition Rules.

Essa reutilização evita duplicação de critérios e mantém a consistência do processo.

---

# Resultado

PASS

A demanda pode prosseguir para a próxima etapa.

FAIL

A demanda permanece no estado atual até que todos os critérios sejam atendidos.

---

# Compromisso

No APDL, qualidade não é uma etapa.

Qualidade é uma condição permanente para evolução.

Cada transição representa um compromisso de que a etapa anterior foi concluída com responsabilidade e rastreabilidade.