# Contributing to AutoPilot AI

## Governança

Toda alteração deve respeitar:

- Project Bible;
- Engineering Bible;
- APDL;
- ADRs vigentes;
- especificação da Sprint.

## Branches

Para implementação da Sprint 2, utilizar uma branch específica.

Exemplo:

```bash
git checkout -b feature/sprint-02-vehicle-profile
```

A branch somente deverá ser criada após aprovação da Feature Specification.

## Commits

Utilizar commits pequenos e semanticamente claros.

Exemplos:

```text
docs(sprint-02): add sprint planning
feat(vehicle-profile): add vehicle domain model
test(vehicle-profile): add vehicle creation tests
fix(vehicle-profile): prevent duplicate submission
```

## Pull Requests

Um Pull Request deve conter:

- objetivo da alteração;
- arquivos modificados;
- testes executados;
- riscos conhecidos;
- evidências dos critérios de aceite;
- decisões técnicas que precisem ser preservadas.

## Restrições do Codex

O Codex não está autorizado a:

- alterar o Project Bible;
- alterar o APDL;
- alterar ADRs;
- modificar decisões arquiteturais vigentes;
- trocar a stack;
- adicionar funcionalidades fora do escopo;
- remover testes;
- alterar contratos públicos sem aprovação;
- executar merge;
- modificar a branch principal diretamente.
