# Implementation Contract — Sprint 2

> Status: Approved
>
> Sprint: Sprint 2 — Vehicle Profile Foundation
>
> Owner: Chief Architect
>
> Audience: Senior Software Engineer (Codex)
>
> Version: 1.0

---

# Purpose

Este documento define o contrato oficial de implementação da feature **Perfil Inicial do Veículo**.

Seu objetivo é eliminar ambiguidades durante o desenvolvimento, garantindo que a implementação respeite o Product Bible, Engineering Bible, APDL e a arquitetura atual da aplicação.

Este contrato possui precedência sobre recomendações geradas durante a Engineering Discovery.

---

# Objective

Implementar o primeiro contexto persistente de veículo do AutoPilot AI.

Ao final da implementação, a aplicação deverá conhecer o veículo do usuário e utilizá-lo como fonte oficial de contexto durante toda a experiência.

---

# Business Context

Até esta Sprint, o veículo apresentado pela aplicação é fixo e definido diretamente no código.

A Sprint 2 substitui essa abordagem por um perfil persistente criado pelo usuário.

Este perfil será utilizado futuramente por funcionalidades como:

- manutenção preventiva;
- histórico de revisões;
- diagnósticos inteligentes;
- alertas;
- integração com hardware;
- inteligência contextual.

---

# Scope

## Dentro do escopo

- cadastro de um veículo;
- validação dos dados;
- persistência local;
- recuperação do perfil;
- utilização do perfil durante o fluxo existente;
- atualização do cockpit.

---

## Fora do escopo

- backend;
- autenticação;
- múltiplos veículos;
- edição;
- exclusão;
- upload de imagens;
- consulta de placa;
- APIs externas;
- OBD;
- IA;
- sincronização em nuvem.

Nenhum desses itens deve ser implementado.

---

# Vehicle Context Principle

A partir desta Sprint existe apenas uma representação oficial do veículo.

Todo componente deverá consumir esse contexto.

Nenhuma tela poderá reconstruir manualmente informações do veículo.

---

# Data Model

O perfil deverá possuir os seguintes campos:

| Campo | Obrigatório |
|---------|-------------|
| manufacturer | Sim |
| model | Sim |
| year | Sim |
| engine | Sim |
| fuelType | Sim |
| mileage | Sim |
| nickname | Não |
| createdAt | Sim |
| updatedAt | Sim |
| schemaVersion | Sim |

---

# Persistence

Persistência obrigatória:

```text
localStorage
```

Somente um perfil poderá existir.

Um novo cadastro substituirá o anterior.

---

# Navigation

Fluxo esperado:

```text
Landing
        │
        ▼
Existe perfil?
        │
   ┌────┴────┐
   │         │
 Não        Sim
   │         │
   ▼         ▼
Cadastro   Questionário
   │         │
   └────┬────┘
        ▼
      Hero
        ▼
     Cockpit
```

---

# Validation Rules

Campos obrigatórios:

- fabricante
- modelo
- ano
- motorização
- combustível
- quilometragem

Regras:

- espaços extras devem ser removidos;
- quilometragem deve ser positiva;
- ano deve ser válido;
- apelido é opcional;
- mensagens devem ser amigáveis.

---

# Integration Points

A implementação deverá integrar-se aos seguintes pontos:

- Landing
- Questionário
- Cockpit

O fluxo atual deverá permanecer funcional.

---

# Files Allowed to Modify

O Codex poderá alterar somente os arquivos necessários.

Entre eles, espera-se algo semelhante a:

- router.js
- app.js (caso necessário)
- questionScreen.js
- CockpitScreen.js
- questions.js

Arquivos adicionais somente quando necessários.

---

# New Files Expected

Espera-se a criação de arquivos equivalentes a:

- VehicleProfileScreen
- vehicleModel
- vehicleValidator
- vehicleStorage

Os nomes poderão variar desde que respeitem a arquitetura vigente.

---

# Forbidden Actions

O Codex não poderá:

- alterar Product Bible;
- alterar Engineering Bible;
- alterar APDL;
- alterar ADRs;
- alterar stack;
- instalar bibliotecas;
- criar backend;
- criar autenticação;
- criar múltiplos veículos;
- remover funcionalidades existentes;
- alterar arquitetura do repositório.

---

# Acceptance Criteria

## Given

Não existe veículo persistido.

## When

O usuário inicia um novo diagnóstico.

## Then

O sistema solicita o cadastro do veículo.

---

## Given

Todos os dados obrigatórios são válidos.

## When

O usuário salva o cadastro.

## Then

O perfil é persistido.

---

## Given

Existe um perfil persistido.

## When

O usuário retorna à aplicação.

## Then

O sistema reutiliza automaticamente esse perfil.

---

## Given

O cockpit é aberto.

## When

O perfil existir.

## Then

O veículo exibido corresponde ao perfil persistido.

---

# Technical Constraints

A implementação deverá:

- manter JavaScript puro;
- preservar a SPA atual;
- evitar abstrações desnecessárias;
- reutilizar componentes quando fizer sentido;
- manter baixo acoplamento.

---

# Manual Validation

Ao concluir a implementação deverá ser possível:

- cadastrar um veículo;
- atualizar a página;
- visualizar o mesmo veículo;
- iniciar o diagnóstico;
- chegar ao cockpit;
- visualizar o veículo cadastrado.

Nenhum erro deverá aparecer no console.

---

# Expected Deliverables

Ao concluir a implementação o Codex deverá apresentar:

- resumo;
- arquivos alterados;
- arquivos criados;
- testes executados;
- limitações encontradas;
- riscos;
- sugestões futuras.

---

# Definition of Done

A implementação somente será considerada concluída quando:

- todos os critérios de aceite forem atendidos;
- o fluxo atual continuar funcionando;
- o perfil persistir corretamente;
- o cockpit consumir o contexto persistido;
- não existirem erros conhecidos;
- o Chief Architect aprovar a revisão;
- o Product Owner aprovar a feature.
