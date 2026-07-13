# Sprint 2 — Vehicle Profile Foundation

## Status

Planning

## Sprint Goal

Permitir que um usuário cadastre o perfil básico de seu veículo, estabelecendo a primeira fonte estruturada de contexto automotivo dentro do AutoPilot AI.

## Strategic Context

A Sprint 2 representa a primeira execução prática e completa do AutoPilot Development Lifecycle — APDL.

A prioridade deixa de ser a construção da fundação documental e passa a ser a entrega de software orientada pelas decisões registradas no Project Bible, Engineering Bible e documentos do APDL.

Esta Sprint também funcionará como validação operacional da metodologia construída durante a Sprint 1.5.

## Feature

### Criação do Perfil Inicial do Veículo

O sistema deverá permitir que o usuário registre os dados essenciais de seu veículo.

O perfil do veículo será a primeira fonte estruturada de contexto automotivo do AutoPilot AI e servirá como base para futuras funcionalidades relacionadas a manutenção, histórico, diagnósticos, alertas e inteligência veicular.

## User Outcome

Ao concluir o fluxo, o usuário deverá possuir um veículo cadastrado e reconhecido pela aplicação.

## Initial Vehicle Data

O perfil deverá considerar inicialmente:

* fabricante;
* modelo;
* ano;
* motorização;
* quilometragem atual;
* tipo de combustível;
* apelido opcional.

A definição final dos campos, tipos, obrigatoriedade e regras de validação deverá ser registrada na Feature Specification antes do início da implementação.

## Scope

### Included

* interface de cadastro do veículo;
* modelo de domínio;
* validação de entrada;
* caso de uso para criação do perfil;
* persistência do perfil;
* confirmação de sucesso;
* tratamento básico de falhas;
* testes automatizados essenciais;
* documentação técnica da entrega;
* revisão arquitetural;
* preservação dos aprendizados.

### Excluded

* autenticação e gerenciamento de usuários;
* suporte a múltiplos veículos;
* edição de veículo;
* exclusão de veículo;
* upload de imagens;
* consulta automática por placa;
* integrações externas;
* telemetria;
* dispositivos OBD;
* histórico de manutenção;
* diagnósticos automotivos;
* alertas preventivos;
* recomendações inteligentes.

## Initial Acceptance Criteria

1. O usuário deve conseguir acessar o formulário de cadastro do veículo.

2. O formulário deve apresentar todos os campos definidos como obrigatórios na Feature Specification.

3. O sistema deve impedir o envio quando os dados obrigatórios estiverem ausentes ou inválidos.

4. As mensagens de validação devem ser compreensíveis para o usuário.

5. Um perfil válido deve ser persistido com sucesso.

6. Os dados cadastrados devem permanecer disponíveis após o recarregamento ou reinicialização da aplicação.

7. O usuário deve receber uma confirmação visual após o cadastro.

8. O mesmo envio não deve criar registros duplicados acidentalmente.

9. As responsabilidades entre interface, aplicação, domínio e infraestrutura devem respeitar o Engineering Bible.

10. Os testes automatizados definidos para a feature devem estar passando antes do merge.

## Execution Flow

A Sprint deverá seguir obrigatoriamente o fluxo:

Project Bible
→ Engineering Bible
→ APDL
→ Sprint Specification
→ Implementação pelo Codex
→ Testes
→ Pull Request
→ Review Arquitetural
→ Ajustes
→ Aprovação
→ Merge
→ Knowledge Preservation

## Team Roles

### Founder & Product Owner

Wilker

Responsável por:

* aprovação do escopo;
* validação do resultado funcional;
* autorização de merge;
* decisões de produto.

### Chief Architect, Tech Lead & Product Strategist

ChatGPT

Responsável por:

* planejamento;
* especificação;
* orientação arquitetural;
* preparação das instruções para o Codex;
* revisão das alterações;
* avaliação dos Quality Gates;
* preservação do conhecimento.

### Senior Software Engineer

Codex

Responsável por:

* análise técnica do repositório;
* implementação da especificação aprovada;
* criação e execução de testes;
* descrição das alterações realizadas;
* comunicação de riscos e impedimentos.

O Codex não possui autorização para alterar decisões de produto, arquitetura, APDL, Project Bible ou Engineering Bible.

## Definition of Done

A Sprint somente poderá ser considerada concluída quando:

* a Feature Specification estiver aprovada;
* a implementação estiver concluída;
* os critérios de aceite estiverem atendidos;
* os testes estiverem passando;
* o Pull Request tiver sido revisado;
* os Quality Gates aplicáveis tiverem sido validados;
* as alterações tiverem sido integradas à branch principal;
* os aprendizados tiverem sido registrados;
* a Sprint Review tiver sido concluída;
* a Foundation Recovery tiver sido reavaliada com base nas evidências da execução.
