# ADR-0005 — Role-Based Collaboration

> Status: Accepted
>
> Data: 2026-07-12
>
> Responsáveis:
> - Wilker (Founder & Product Owner)
> - ChatGPT (Chief Architect)

---

# Contexto

Durante a construção da Foundation Freeze, tornou-se evidente que o AutoPilot AI seria desenvolvido por uma equipe composta por pessoas e agentes de IA.

Inicialmente, essa equipe seria pequena, com papéis acumulados por poucos participantes.

Ao mesmo tempo, a arquitetura precisava permanecer preparada para crescer sem exigir mudanças estruturais.

Era necessário definir um modelo organizacional que privilegiasse responsabilidades, e não ferramentas ou indivíduos específicos.

---

# Problema

Modelar a equipe em torno de ferramentas ou pessoas cria dependências desnecessárias.

Ferramentas evoluem.

Modelos de IA mudam.

Novos agentes surgem.

Pessoas assumem novas responsabilidades.

Sem uma abstração adequada, o processo de desenvolvimento precisaria ser constantemente reorganizado.

---

# Alternativas Consideradas

## Organizar a equipe por ferramentas

Exemplos:

- ChatGPT
- Codex
- Claude
- Gemini

### Vantagens

- Fácil entendimento inicial.

### Desvantagens

- Alto acoplamento tecnológico.
- Baixa durabilidade.
- Dificulta substituição de ferramentas.

---

## Organizar a equipe por pessoas

### Vantagens

- Simplicidade.

### Desvantagens

- Processo dependente dos indivíduos.
- Pouca flexibilidade.

---

## Organizar a equipe por papéis

### Vantagens

- Baixo acoplamento.
- Alta escalabilidade.
- Independência tecnológica.
- Facilidade para incorporar novos agentes ou colaboradores.

### Desvantagens

- Exige definição clara de responsabilidades.

---

# Decisão

Foi adotado um modelo de colaboração baseado em papéis (Role-Based Collaboration).

No APDL, responsabilidades pertencem aos papéis, e não às pessoas ou ferramentas.

Uma mesma pessoa pode exercer múltiplos papéis.

Da mesma forma, um agente de IA pode assumir diferentes responsabilidades, desde que respeite os limites definidos para aquele papel.

---

# Estrutura Inicial

Durante o MVP, a equipe permanecerá intencionalmente enxuta.

Papéis atualmente assumidos:

- Founder / Product Owner — Wilker
- Chief Architect / Tech Lead / Product Strategist — ChatGPT
- Senior Software Engineer — Codex

Essa configuração reduz o custo de coordenação e acelera a entrega do MVP.

---

# Evolução

Novos papéis somente deverão ser criados quando houver uma necessidade real observada durante a evolução do produto.

A arquitetura está preparada para expansão, mas a implementação seguirá o princípio da simplicidade.

---

# Justificativa

Modelar responsabilidades em vez de ferramentas torna a metodologia mais resiliente às mudanças tecnológicas.

Essa abordagem também favorece a colaboração entre humanos e agentes de IA, permitindo que novos participantes sejam incorporados sem alterar a estrutura do processo.

---

# Consequências

## Positivas

- Independência de ferramentas.
- Crescimento sustentável.
- Melhor clareza de responsabilidades.
- Facilidade para automação futura.

## Negativas

- Exige disciplina para evitar sobreposição de responsabilidades.

## Riscos

- Criar papéis antes que exista necessidade real.

---

# Impacto

Esta decisão influencia:

- APDL
- Roles and Responsibilities
- Workflow
- Sprint Specifications
- Processo de onboarding

---

# Relação com outras ADRs

- ADR-0003 — Layered Knowledge Architecture
- ADR-0004 — Arquitetura de Execução Orientada por Processo
- ADR-0006 — Documentation as Source of Truth

---

# Lições Aprendidas

Escalabilidade não significa criar estruturas complexas desde o início.

Significa criar uma arquitetura capaz de crescer sem precisar ser redesenhada.

Uma equipe pequena, organizada por papéis claros, entrega mais valor do que uma estrutura grande sem responsabilidades bem definidas.

---

# Observações Históricas

Durante a Foundation Freeze surgiu a discussão sobre criar uma organização composta por diversos agentes especializados.

Após análise, decidiu-se manter a equipe mínima necessária para o MVP.

Essa decisão preservou o foco na entrega de valor, sem comprometer a capacidade de crescimento futuro da metodologia.

A arquitetura passou a escalar por papéis, enquanto a equipe permaneceu enxuta por escolha estratégica.