# ADR-0002 — Project Bible como Fonte Oficial da Estratégia

> Status: Accepted
>
> Data: 2026-07-12
>
> Responsáveis:
> - Wilker (Founder & Product Owner)
> - ChatGPT (Chief Architect / Product Strategist)

---

# Contexto

Durante as primeiras Sprints do AutoPilot AI, as decisões estratégicas surgiam naturalmente ao longo das conversas.

Cada nova discussão aprofundava a compreensão do problema e refinava a visão do produto.

Entretanto, tornou-se evidente que depender exclusivamente do histórico das conversas criava um risco crescente.

À medida que o projeto evoluísse, localizar decisões antigas, compreender seu contexto e garantir consistência entre novas funcionalidades se tornaria cada vez mais difícil.

Era necessário transformar conhecimento disperso em patrimônio permanente do projeto.

---

# Problema

A estratégia do produto estava distribuída em múltiplas conversas.

Embora rica em contexto, essa abordagem dificultava:

- consulta rápida;
- rastreabilidade;
- onboarding de novos colaboradores;
- colaboração entre agentes de IA;
- evolução consistente do produto.

Sem uma fonte oficial, diferentes interpretações poderiam surgir ao longo do tempo.

---

# Alternativas Consideradas

## Manter o histórico das conversas como referência

### Vantagens

- Nenhum esforço adicional de documentação.

### Desvantagens

- Baixa rastreabilidade.
- Dificuldade de navegação.
- Dependência do contexto conversacional.

---

## Criar documentação apenas para funcionalidades

### Vantagens

- Menor esforço inicial.

### Desvantagens

- A estratégia continuaria implícita.
- O produto perderia coerência com o tempo.

---

## Criar um Project Bible

### Vantagens

- Estratégia centralizada.
- Fonte única da verdade.
- Excelente suporte para humanos e agentes de IA.
- Evolução disciplinada.
- Base sólida para arquitetura e implementação.

### Desvantagens

- Exige disciplina contínua para manutenção.

---

# Decisão

Foi decidido criar o **Project Bible** como a fonte oficial da estratégia do AutoPilot AI.

Toda decisão relacionada ao produto deve ser compatível com os documentos presentes no Project Bible.

Nenhuma funcionalidade relevante deve ser implementada sem considerar essa base estratégica.

---

# Justificativa

A estratégia é um dos ativos mais importantes de um produto.

Transformá-la em documentação estruturada reduz ambiguidades, preserva contexto e aumenta significativamente a capacidade de evolução do sistema.

Essa decisão também estabelece uma separação clara entre estratégia, engenharia e implementação.

---

# Consequências

## Positivas

- Estratégia centralizada.
- Redução de ambiguidades.
- Melhor onboarding.
- Melhor colaboração entre humanos e IA.
- Evolução consistente do produto.

## Negativas

- Necessidade permanente de manter a documentação atualizada.

## Riscos

- Caso o Project Bible deixe de refletir a realidade do produto, ele perde sua credibilidade como fonte oficial.

---

# Impacto

Esta decisão influencia diretamente:

- Engineering Bible
- APDL
- ADRs
- Sprint Specifications
- Roadmap
- Processo de desenvolvimento

---

# Relação com outras ADRs

- ADR-0001 — Vehicle Life Intelligence
- ADR-0003 — Separação entre Project Bible e Engineering Bible
- ADR-0005 — Documentation as Source of Truth

---

# Lições Aprendidas

Projetos evoluem mais rapidamente quando suas decisões estratégicas deixam de depender da memória das pessoas.

O conhecimento documentado torna-se um ativo permanente que pode ser compartilhado, revisado e ampliado continuamente.

---

# Observações Históricas

A criação do Project Bible representou uma mudança de maturidade no AutoPilot AI.

Até aquele momento, o projeto era conduzido principalmente através de conversas.

A partir dessa decisão, a estratégia passou a existir de forma explícita, organizada e independente das interações que lhe deram origem.

Essa mudança estabeleceu as bases para toda a arquitetura documental construída posteriormente, incluindo o Engineering Bible, o APDL e o processo de Foundation Freeze.