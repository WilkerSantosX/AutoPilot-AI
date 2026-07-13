# ADR-0004 — Arquitetura de Execução Orientada por Processo

> Status: Accepted
>
> Data: 2026-07-12
>
> Responsáveis:
> - Wilker (Founder & Product Owner)
> - ChatGPT (Chief Architect)

---

# Contexto

Após consolidar a estratégia do produto (Project Bible) e a arquitetura do conhecimento (Layered Knowledge Architecture), surgiu uma nova necessidade.

O projeto precisava de uma forma consistente de transformar conhecimento em software.

Embora existissem boas práticas de engenharia, elas ainda não estavam organizadas em um ciclo único, disciplinado e rastreável.

Além disso, o AutoPilot AI seria desenvolvido por uma equipe híbrida composta por pessoas e agentes de IA, exigindo um processo explícito, reproduzível e automatizável.

---

# Problema

Sem um processo arquitetado, o projeto corria o risco de:

- depender da experiência individual de cada participante;
- perder rastreabilidade entre estratégia e implementação;
- gerar inconsistências entre diferentes agentes de IA;
- dificultar automações futuras;
- transformar boas práticas em conhecimento implícito.

Era necessário tornar o próprio processo um elemento arquitetural do produto.

---

# Alternativas Consideradas

## Utilizar apenas Scrum ou Kanban

### Vantagens

- Amplamente conhecidos.
- Fácil adoção inicial.

### Desvantagens

- Não representam a arquitetura documental do projeto.
- Não incorporam o Project Bible, Engineering Bible e ADRs como elementos centrais.
- Não foram concebidos para colaboração intensa entre humanos e agentes de IA.

---

## Criar apenas um conjunto de boas práticas

### Vantagens

- Menor esforço inicial.

### Desvantagens

- Baixa padronização.
- Dificuldade para automação.
- Pouca rastreabilidade.

---

## Criar uma Arquitetura de Execução baseada no APDL

### Vantagens

- Processo único e disciplinado.
- Integra estratégia, engenharia e implementação.
- Facilita automações futuras.
- Suporta colaboração entre humanos e agentes de IA.
- Preserva conhecimento continuamente.

### Desvantagens

- Exige aprendizado inicial.
- Requer manutenção evolutiva.

---

# Decisão

Foi adotada uma Arquitetura de Execução baseada no **AutoPilot Product Development Lifecycle (APDL)**.

O APDL passa a ser o mecanismo oficial que conecta:

- estratégia;
- engenharia;
- planejamento;
- implementação;
- revisão;
- documentação;
- preservação do conhecimento.

O processo deixa de ser apenas uma prática operacional e passa a fazer parte da arquitetura do produto.

---

# Justificativa

Software de alta qualidade depende não apenas de uma boa arquitetura técnica, mas também de um bom processo de construção.

Ao transformar o processo em um componente arquitetural explícito, reduzimos ambiguidades, aumentamos previsibilidade e criamos uma base sólida para evolução contínua.

Essa decisão também prepara o projeto para um futuro em que parte significativa do desenvolvimento será conduzida por agentes especializados de IA.

---

# Consequências

## Positivas

- Processo padronizado.
- Melhor rastreabilidade.
- Facilidade para automação.
- Colaboração consistente entre humanos e IA.
- Evolução contínua da metodologia.

## Negativas

- Necessidade de disciplina para seguir o ciclo definido.

## Riscos

- Tratar o APDL como burocracia em vez de um facilitador de qualidade.

---

# Impacto

Esta decisão influencia diretamente:

- Sprint Specifications;
- Workflow;
- States;
- Transition Rules;
- Quality Gates;
- Playbooks;
- Revisões técnicas;
- Processo de Merge;
- Atualização da documentação.

---

# Relação com outras ADRs

- ADR-0001 — Vehicle Life Intelligence
- ADR-0002 — Project Bible como Fonte Oficial da Estratégia
- ADR-0003 — Layered Knowledge Architecture
- ADR-0005 — Colaboração Humano + IA

---

# Lições Aprendidas

Processos também possuem arquitetura.

Quando um processo é explicitamente modelado, ele deixa de depender da memória das pessoas e passa a ser um ativo permanente do projeto.

Isso aumenta a previsibilidade, reduz desperdícios e cria condições para automação responsável.

---

# Observações Históricas

Durante a Sprint 1.5, o APDL evoluiu de uma simples ideia de fluxo de trabalho para uma arquitetura completa de execução.

A descoberta de conceitos como Workflow, States, Transition Rules e Quality Gates demonstrou que o processo possuía estrutura suficiente para ser tratado como um componente arquitetural.

Essa percepção marcou o nascimento oficial do APDL como um dos pilares fundamentais do AutoPilot AI.