# Repository Bootstrap

> Status: Approved  
> Version: 1.0

## Objetivo

Preparar localmente o repositório oficial do AutoPilot AI preservando o projeto web já existente.

## Estrutura Inicial

```text
AutoPilot-AI/
├── apps/
│   └── autopilot-web/
├── docs/
├── packages/
├── tools/
├── scripts/
└── .github/
```

## Passos

### 1. Criar uma cópia de segurança

Antes de mover arquivos, copie a pasta atual do projeto para um local seguro.

### 2. Confirmar o estado do Git

```bash
git status
```

O ideal é que não existam alterações pendentes.

### 3. Atualizar a `main`

```bash
git checkout main
git pull
```

### 4. Criar branch

```bash
git checkout -b chore/repository-consolidation
```

### 5. Criar diretórios

```bash
mkdir apps
mkdir packages
mkdir tools
mkdir scripts
```

No Windows PowerShell, os mesmos comandos são válidos.

### 6. Mover a aplicação

Mover o projeto web da Sprint 1 para:

```text
apps/autopilot-web/
```

Não alterar conteúdo ainda.

### 7. Adicionar documentação

Copiar Project Bible, Engineering Bible, APDL, ADRs e documentos de Sprint para `docs/`.

### 8. Executar a aplicação

Abrir:

```text
apps/autopilot-web/index.html
```

Validar:

- carregamento;
- estilos;
- componentes;
- roteamento;
- fluxo já criado;
- console do navegador.

### 9. Revisar alterações

```bash
git status
git diff --stat
git diff
```

### 10. Commit

```bash
git add apps docs .github README.md CONTRIBUTING.md PROJECT-STATUS.md .gitignore
git commit -m "chore(repo): consolidate AutoPilot AI workspace"
```

### 11. Push

```bash
git push -u origin chore/repository-consolidation
```

### 12. PR

Abrir PR para `main`.

Não realizar merge antes do review arquitetural.

## Evidências para trazer ao ChatGPT

- saída de `git status`;
- árvore de pastas;
- resumo do Codex;
- lista de arquivos alterados;
- resultado da execução manual;
- erros do console;
- link ou conteúdo do PR;
- diff relevante.
