# Codex Mission — Sprint 2

> Status: Approved
>
> Sprint: Sprint 2 — Vehicle Profile Foundation
>
> Assigned Role: Senior Software Engineer
>
> Assigned By: Chief Architect

---

# Mission

Sua missão é implementar a feature **Perfil Inicial do Veículo** conforme especificado nesta Sprint.

Esta é a primeira implementação oficial executada utilizando o AutoPilot Development Lifecycle (APDL).

Toda a implementação deverá respeitar rigorosamente os documentos oficiais do projeto.

---

# Required Reading

Antes de iniciar qualquer alteração, considere como fonte oficial:

1. Project Bible
2. Engineering Bible
3. APDL
4. Sprint Plan
5. Feature Brief
6. Engineering Discovery
7. Implementation Contract

Caso exista conflito entre documentos, interrompa a implementação e solicite esclarecimento.

---

# Implementation Goal

Adicionar suporte ao primeiro perfil persistente de veículo da aplicação.

Ao concluir:

- o usuário poderá cadastrar seu veículo;
- o perfil será persistido localmente;
- o fluxo atual continuará funcionando;
- o cockpit utilizará o perfil salvo.

---

# Authorized Scope

Você está autorizado a:

- criar novos arquivos quando necessários;
- alterar arquivos existentes relacionados ao fluxo da feature;
- adicionar validações;
- implementar persistência local;
- reutilizar componentes existentes;
- criar testes compatíveis com a stack atual.

---

# Forbidden Scope

Você NÃO está autorizado a:

- alterar Product Bible;
- alterar Engineering Bible;
- alterar APDL;
- alterar ADRs;
- alterar a arquitetura do repositório;
- trocar a stack;
- instalar frameworks;
- criar backend;
- criar autenticação;
- implementar múltiplos veículos;
- adicionar funcionalidades fora do escopo;
- remover funcionalidades existentes;
- executar merge.

---

# Implementation Principles

Durante a implementação:

- preservar simplicidade;
- respeitar a arquitetura atual;
- evitar abstrações desnecessárias;
- manter baixo acoplamento;
- reutilizar código existente quando apropriado;
- não realizar refatorações não relacionadas.

---

# Quality Gates

Antes de concluir:

- o fluxo existente deve continuar funcional;
- o cadastro deve validar corretamente;
- o perfil deve persistir após recarregar a página;
- o cockpit deve utilizar o contexto persistido;
- nenhum erro deve aparecer no console durante o fluxo principal.

---

# Expected Deliverables

Ao finalizar, apresente um relatório contendo:

## Executive Summary

Resumo da implementação.

## Files Created

Lista de arquivos criados.

## Files Modified

Lista de arquivos alterados.

## Technical Decisions

Decisões locais tomadas durante a implementação.

## Validation

Como a feature foi validada.

## Tests

Testes executados.

## Risks

Limitações ou riscos identificados.

## Future Improvements

Melhorias sugeridas que ficaram fora do escopo.

---

# Stop Conditions

Interrompa imediatamente a implementação caso:

- seja necessário alterar arquitetura;
- seja necessário alterar contratos públicos;
- exista conflito documental;
- seja necessária uma nova tecnologia;
- exista risco de perda de dados;
- o escopo precise ser ampliado.

Nestes casos, retorne ao Chief Architect com um relatório explicando o motivo da interrupção.

---

# Completion Criteria

Esta missão será considerada concluída somente quando:

- todos os critérios de aceite forem atendidos;
- o relatório final for entregue;
- o código estiver pronto para revisão arquitetural;
- nenhuma alteração fora do escopo tiver sido realizada.