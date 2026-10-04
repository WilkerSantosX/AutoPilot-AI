# AutoPilot AI History

> Status: Constitutional

## Linha do Tempo

- Sprint 0 — Product Foundations
- Descoberta do domínio Vehicle Life Intelligence
- Sprint 1 — Project Ignition
- Nascimento do Project Bible
- Sprint 1.5 — Foundation Freeze
- Foundation Recovery

## Equipe

- Wilker — Founder & Product Owner
- ChatGPT — Chief Architect / Tech Lead / Product Strategist
- Codex — Senior Software Engineer

## Insights Arquiteturais

- Descoberta da simetria entre o ciclo de vida de uma demanda (APDL) e o ciclo de vida de um veículo (Vehicle Life Intelligence).

## Visão Futura

Durante a construção do APDL surgiu a visão de evoluí-lo para uma Workflow Engine orientada por estados, regras de transição e quality gates, capaz de ser executada por agentes de IA de forma determinística.

Emergência das Camadas do APDL

Durante a construção do APDL foi identificado que sua arquitetura naturalmente se dividiu em duas camadas complementares:

• Knowledge Layer
• Execution Layer

A primeira concentra princípios, contexto e estratégia.

A segunda concentra regras determinísticas capazes de serem executadas por pessoas ou agentes de IA.

Essa descoberta passou a orientar toda a evolução futura da metodologia.

---

Durante a Sprint 1.5 surgiu a percepção de que o conjunto formado por Project Bible, Engineering Bible e APDL se comporta como um verdadeiro Product Operating System, capaz de organizar estratégia, engenharia e execução de forma integrada.

Decidiu-se manter essa visão apenas como hipótese estratégica até a conclusão do MVP, evitando aumento de escopo antes da validação prática da metodologia.

## Sprint 2 — entrega e Sprint Review (2026-10-04)

A Sprint 2 entregou o primeiro perfil persistente local do veículo e o percurso cadastro → perguntas → Hero → cockpit factual. O PR #1 foi integrado em `6e81d89` após revisão técnica e autorização explícita do PO. A Sprint Review foi lida e aprovada pelo PO Wilker em 2026-10-04. O fechamento documental aguarda integração própria; a Sprint não é declarada Done neste registro.

[Review, aprendizados, pendências e Foundation Recovery](../../sprints/sprint-02/reports/sprint-02-review.md).

GOV.01 foi exercitado por contratos versionados, execução, evidências, review e aceite. A auditoria de promessas alinhou a interface à capacidade real; contexto local do veículo foi separado das respostas temporárias. F01 permaneceu rastreável, sem reescrever o FAIL Minor histórico. Foundation Recovery permanece parcial: faltam fontes estratégicas enumeradas no Project Bible. Esta execução não promove a hipótese de Workflow Engine ou Product Operating System a decisão de produto.
