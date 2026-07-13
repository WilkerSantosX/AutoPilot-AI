# ADR-0003 — Layered Knowledge Architecture (LKA)

> Status: Accepted
>
> Data: 2026-07-12
>
> Responsáveis:
> - Wilker (Founder & Product Owner)
> - ChatGPT (Chief Architect)

---

# Contexto

Após a consolidação do Project Bible como fonte oficial da estratégia do AutoPilot AI, tornou-se evidente que diferentes tipos de conhecimento estavam sendo produzidos durante a evolução do projeto.

Alguns documentos descreviam a identidade e os objetivos do produto.

Outros registravam padrões de engenharia.

Em seguida surgiram documentos que definiam processos, estados, transições e qualidade.

Paralelamente, ADRs e o History passaram a preservar decisões e acontecimentos relevantes.

Embora todos fossem essenciais, eles possuíam naturezas diferentes.

A tentativa de agrupá-los em uma única estrutura aumentaria o acoplamento documental, dificultaria a navegação e reduziria a clareza da arquitetura.

---

# Problema

O conhecimento do projeto crescia de forma saudável, mas sem uma arquitetura explícita existia o risco de:

- misturar responsabilidades;
- duplicar informações;
- dificultar a localização de contexto;
- aumentar o esforço de manutenção;
- dificultar a atuação de agentes especializados.

Era necessário organizar o conhecimento do projeto de maneira estrutural, e não apenas por diretórios.

---

# Alternativas Consideradas

## Estrutura única

### Vantagens

- Organização inicial simples.

### Desvantagens

- Alto acoplamento.
- Escalabilidade limitada.
- Mistura entre estratégia, engenharia e processo.

---

## Organização apenas por funcionalidades

### Vantagens

- Boa navegação por tema.

### Desvantagens

- Não resolve a separação entre tipos de conhecimento.
- Favorece duplicação de contexto.

---

## Arquitetura em Camadas do Conhecimento (LKA)

### Vantagens

- Separação clara de responsabilidades.
- Evolução independente de cada camada.
- Excelente suporte para humanos e agentes de IA.
- Redução de acoplamento.
- Maior escalabilidade documental.

### Desvantagens

- Requer disciplina para manter os limites entre as camadas.

---

# Decisão

Foi adotada a **Layered Knowledge Architecture (LKA)** como arquitetura oficial da documentação do AutoPilot AI.

Toda informação produzida pelo projeto deverá pertencer claramente a uma camada de conhecimento.

As camadas oficiais são:

## Product Layer

Representa o conhecimento estratégico do produto.

Artefatos:

- Project Bible
- Roadmap

Responde:

> Por que o produto existe? Para onde ele está indo?

---

## Engineering Layer

Representa o conhecimento técnico.

Artefatos:

- Engineering Bible

Responde:

> Como o software deve ser construído?

---

## Process Layer

Representa o conhecimento operacional.

Artefatos:

- APDL
- Sprint Specifications
- Playbooks
- Templates

Responde:

> Como o trabalho acontece?

---

## Historical Layer

Representa a memória institucional do projeto.

Artefatos:

- ADRs
- History
- Sprint Reviews

Responde:

> Como chegamos até aqui? Quais decisões moldaram o projeto?

---

# Justificativa

Arquitetura não se aplica apenas ao software.

Ela também deve organizar o conhecimento que sustenta o produto.

Ao separar estratégia, engenharia, processo e memória institucional em camadas independentes, o projeto ganha clareza, reduz acoplamento e facilita sua evolução.

Essa arquitetura também permite que diferentes pessoas e agentes de IA consultem apenas o contexto necessário para desempenhar seus papéis.

---

# Consequências

## Positivas

- Organização consistente do conhecimento.
- Melhor escalabilidade.
- Navegação simplificada.
- Redução de ambiguidades.
- Facilita automação e colaboração entre agentes.

## Negativas

- Exige disciplina para evitar que documentos atravessem camadas sem necessidade.

## Riscos

- Caso os limites entre camadas não sejam respeitados, a arquitetura tende a perder clareza ao longo do tempo.

---

# Impacto

Esta decisão influencia diretamente:

- Project Bible
- Engineering Bible
- APDL
- ADRs
- History
- Playbooks
- Templates
- Sprint Specifications

Ela estabelece a arquitetura documental oficial do AutoPilot AI.

---

# Relação com outras ADRs

- ADR-0001 — Vehicle Life Intelligence
- ADR-0002 — Project Bible como Fonte Oficial da Estratégia
- ADR-0004 — AutoPilot Product Development Lifecycle

---

# Lições Aprendidas

Conhecimento também precisa de arquitetura.

Da mesma forma que componentes de software possuem responsabilidades bem definidas, documentos também devem possuir limites claros.

Uma arquitetura documental organizada reduz a complexidade do projeto e preserva sua capacidade de evolução.

---

# Observações Históricas

Inicialmente, esta decisão foi percebida apenas como a separação entre o Project Bible e o Engineering Bible.

Durante a revisão da Foundation Recovery, tornou-se evidente que essa separação era consequência de um princípio mais amplo: a organização do conhecimento em camadas independentes.

Essa descoberta consolidou a Layered Knowledge Architecture como um dos pilares estruturantes do AutoPilot AI e influenciou diretamente a forma como pessoas e agentes de IA passam a consumir o contexto do projeto.