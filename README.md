# AutoPilot AI

AutoPilot AI é uma plataforma de Vehicle Life Intelligence orientada à construção de contexto contínuo sobre a vida do veículo.

Este repositório contém a fundação estratégica, arquitetural e operacional do projeto, além da execução da Sprint 2.

## Estado atual

- Product Layer indexado no Project Bible, com fontes estratégicas ainda a recuperar.
- Engineering Layer iniciado por meio do Engineering Bible.
- Process Layer estruturado por meio do APDL.
- Foundation Recovery reavaliada na Sprint Review; permanece parcial.
- Sprint 2 implementada e integrada pelo PR #1; Sprint Review aprovada pelo PO em 2026-10-04.
- Fechamento documental preparado nesta branch; Done depende da integração deste pacote.

## Sprint atual

**Sprint 2 — Vehicle Profile Foundation**

Objetivo: permitir que o usuário cadastre o perfil básico do veículo, estabelecendo a primeira fonte estruturada de contexto automotivo do AutoPilot AI.

## Fluxo operacional

Project Bible  
→ Engineering Bible  
→ APDL  
→ Sprint Specification  
→ Codex implementa  
→ Review Arquitetural  
→ Merge  
→ Knowledge Preservation

## Papéis

- **Wilker** — Founder & Product Owner
- **ChatGPT** — Chief Architect, Tech Lead e Product Strategist
- **Codex** — Senior Software Engineer

## Entrega disponível

A SPA em `apps/autopilot-web/` usa HTML/CSS/JavaScript ES Modules e persiste um perfil local do veículo. Cadastro, questionário, Hero e cockpit apresentam dados e respostas reais da sessão. Respostas são voláteis; reload mantém somente o perfil. Recursos futuros estão sinalizados e desabilitados; não há diagnóstico, IA real ou backend.

Validação: 19 testes nativos passando na revisão técnica. F01 (favicon 404) permanece Minor, não bloqueante. A stack atual não define necessariamente a arquitetura final do produto.

[Review e aprendizados da Sprint 2](docs/sprints/sprint-02/reports/sprint-02-review.md).
