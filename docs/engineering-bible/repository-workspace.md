# Repository Workspace

> Status: Approved  
> Owner: Chief Architect  
> Version: 1.0  
> Layer: Engineering Bible

---

## 1. Purpose

Este documento define o workspace oficial do AutoPilot AI.

Seu objetivo é estabelecer uma organização física, operacional e evolutiva clara para o repositório, permitindo que pessoas e agentes de IA trabalhem com segurança, previsibilidade e rastreabilidade.

O workspace deve preservar:

- clareza de responsabilidades;
- separação entre produto, engenharia, processo e histórico;
- evolução incremental;
- baixa ambiguidade operacional;
- rastreabilidade de decisões;
- segurança no uso do Codex;
- preservação do histórico do Git.

---

## 2. Official Repository Structure

```text
AutoPilot-AI/
├── apps/
│   └── autopilot-web/
├── packages/
├── docs/
│   ├── project-bible/
│   ├── engineering-bible/
│   ├── apdl/
│   ├── adr/
│   ├── sprints/
│   ├── knowledge/
│   └── templates/
├── tools/
├── scripts/
├── .github/
├── .vscode/
├── README.md
├── CONTRIBUTING.md
├── PROJECT-STATUS.md
├── LICENSE
└── .gitignore
```

---

## 3. Workspace Responsibilities

### 3.1 `apps/`

Contém aplicações executáveis entregues ao usuário ou utilizadas operacionalmente.

Exemplo atual:

```text
apps/autopilot-web/
```

Possíveis aplicações futuras:

```text
apps/autopilot-api/
apps/autopilot-mobile/
apps/autopilot-admin/
```

Regras:

- cada aplicação deve possuir responsabilidade explícita;
- uma aplicação não deve depender da implementação interna de outra;
- contratos entre aplicações devem ser explícitos;
- build, execução e testes devem ser identificáveis por aplicação;
- uma nova aplicação exige justificativa arquitetural.

---

### 3.2 `packages/`

Contém código reutilizável e compartilhado.

Exemplos futuros:

```text
packages/shared-ui/
packages/shared-domain/
packages/shared-utils/
packages/vehicle-engine/
```

Regras:

- não criar package preventivamente;
- somente extrair código quando houver reutilização real ou limite arquitetural claro;
- packages não podem depender de apps;
- dependências circulares são proibidas;
- contratos públicos devem ser estáveis e revisados.

---

### 3.3 `docs/`

Contém o conhecimento oficial do projeto.

```text
docs/
├── project-bible/
├── engineering-bible/
├── apdl/
├── adr/
├── sprints/
├── knowledge/
└── templates/
```

Regras:

- documentação oficial não deve permanecer apenas em conversas;
- decisões relevantes devem ser versionadas;
- documentos aprovados devem possuir status;
- Codex não altera documentos estratégicos ou arquiteturais sem autorização explícita;
- Sprint Specifications são contratos de implementação.

---

### 3.4 `tools/`

Contém ferramentas internas de engenharia.

Exemplos:

- importadores;
- geradores;
- migradores;
- analisadores;
- utilitários de datasets.

Não fazem parte diretamente da experiência entregue ao usuário.

---

### 3.5 `scripts/`

Contém automações operacionais do repositório.

Exemplos:

- bootstrap local;
- validação;
- build;
- testes;
- preparação de ambiente;
- verificação de qualidade.

Scripts devem ser:

- pequenos;
- documentados;
- idempotentes quando possível;
- seguros para execução local.

---

### 3.6 `.github/`

Contém recursos de governança e automação do GitHub.

Exemplos:

- Pull Request Template;
- Issue Templates;
- workflows;
- dependabot;
- CODEOWNERS, quando necessário.

---

## 4. Current Application Migration

O projeto web criado na Sprint 1 deve ser preservado e movido para:

```text
apps/autopilot-web/
```

A migração deve:

- preservar todos os arquivos;
- preservar o comportamento atual;
- não refatorar;
- não renomear componentes;
- não alterar layout;
- não alterar regras;
- ajustar apenas caminhos relativos estritamente necessários;
- ser validada por execução manual antes do commit.

---

## 5. Repository Evolution Rules

Uma alteração estrutural é considerada relevante quando:

- cria nova aplicação;
- cria novo package;
- altera limites de módulos;
- modifica regras de dependência;
- muda a estratégia de build;
- altera o modelo de versionamento;
- introduz nova tecnologia estrutural;
- reorganiza diretórios principais.

Mudanças relevantes exigem:

1. Engineering RFC;
2. análise do Chief Architect;
3. aprovação do Founder;
4. implementação controlada;
5. ADR quando a decisão se tornar permanente.

---

## 6. Source of Truth

A precedência oficial é:

1. ADR vigente;
2. Project Bible;
3. Engineering Bible;
4. APDL;
5. Sprint Specification;
6. código;
7. conversa não versionada.

Quando houver conflito, a execução deve parar.

Nenhum agente deve resolver conflitos de governança por conta própria.

---

## 7. Operational Roles

### Founder & Product Owner

Responsável por:

- aprovar escopo;
- aceitar resultados;
- autorizar mudanças estruturais;
- autorizar merge.

### ChatGPT — Chief Architect

Responsável por:

- arquitetura;
- planejamento;
- especificações;
- review arquitetural;
- regras para o Codex;
- preservação do conhecimento.

### Codex — Senior Software Engineer

Responsável por:

- análise técnica autorizada;
- implementação;
- testes;
- correções;
- documentação operacional da própria entrega.

O Codex não pode:

- alterar estratégia;
- alterar arquitetura;
- alterar Product Bible;
- alterar APDL;
- alterar ADRs;
- mudar stack;
- expandir escopo;
- fazer merge;
- modificar `main` diretamente.

---

## 8. Default Branch Model

Branch principal:

```text
main
```

Branches de trabalho:

```text
feature/<identificador>
fix/<identificador>
docs/<identificador>
chore/<identificador>
refactor/<identificador>
```

Exemplo:

```text
feature/sprint-02-vehicle-profile
```

Toda implementação deve ocorrer fora da `main`.

---

## 9. Commit Strategy

Commits devem ser:

- pequenos;
- atômicos;
- semanticamente claros;
- reversíveis;
- ligados a um objetivo.

Formato recomendado:

```text
<tipo>(<escopo>): <descrição>
```

Tipos comuns:

```text
feat
fix
docs
test
refactor
chore
build
ci
```

Exemplos:

```text
docs(workspace): add repository operating model
chore(repo): move web app into apps workspace
feat(vehicle-profile): add vehicle registration form
test(vehicle-profile): cover vehicle creation validation
```

---

## 10. Pull Request Strategy

Um Pull Request deve representar uma unidade coerente de entrega.

Deve conter:

- objetivo;
- contexto;
- escopo;
- arquivos principais;
- testes;
- evidências;
- riscos;
- itens fora do escopo;
- checklist de qualidade.

Merge somente após:

- critérios de aceite atendidos;
- testes executados;
- review arquitetural;
- correções concluídas;
- aprovação do Product Owner.

---

## 11. Codex Safety Model

Antes de cada missão, o Codex deve receber:

- objetivo explícito;
- documentos de referência;
- escopo permitido;
- arquivos permitidos;
- ações proibidas;
- resultado esperado;
- formato de retorno.

O Codex deve parar e perguntar quando:

- houver conflito documental;
- precisar alterar arquitetura;
- precisar mudar contrato público;
- encontrar risco de perda de dados;
- detectar segredo;
- precisar ampliar o escopo;
- não conseguir validar a aplicação.

---

## 12. Knowledge Preservation

Após cada entrega, registrar em:

```text
docs/knowledge/sprint-XX/
```

Artefatos mínimos:

```text
lessons-learned.md
technical-decisions.md
mistakes.md
improvements.md
```

Decisões permanentes devem migrar para:

- Engineering Bible;
- Project Bible;
- ADR;
- APDL.

---

## 13. Workspace Quality Gate

O workspace estará válido quando:

- a aplicação existente estiver preservada;
- a aplicação estiver em `apps/autopilot-web`;
- os documentos oficiais estiverem em `docs`;
- nenhuma regra de negócio tiver sido alterada;
- o repositório estiver versionado;
- a branch `main` estiver estável;
- a estrutura estiver compreensível para humanos e agentes;
- a próxima feature puder ser implementada sem ambiguidade estrutural.

---

## 14. Definition of Done — Repository Consolidation

A consolidação estará concluída quando:

- a estrutura oficial estiver criada;
- o projeto web estiver migrado;
- caminhos relativos estiverem válidos;
- a aplicação abrir e funcionar;
- o Git não indicar arquivos inesperados;
- houver commit específico da consolidação;
- houver push;
- houver PR quando aplicável;
- o Chief Architect revisar o diff;
- o merge for autorizado;
- os aprendizados forem preservados.
