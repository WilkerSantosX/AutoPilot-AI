# Git Workflow

> Status: Approved  
> Version: 1.0

## 1. Branch Principal

```text
main
```

A `main` deve permanecer estável e executável.

## 2. Início de Trabalho

```bash
git checkout main
git pull
git checkout -b chore/repository-consolidation
```

Para feature:

```bash
git checkout main
git pull
git checkout -b feature/sprint-02-vehicle-profile
```

## 3. Verificação

Antes de qualquer commit:

```bash
git status
git diff
```

## 4. Staging

Adicionar arquivos de forma consciente:

```bash
git add caminho/do/arquivo
```

Evitar `git add .` quando houver alterações não revisadas.

## 5. Commit

```bash
git commit -m "chore(repo): consolidate repository workspace"
```

## 6. Push

```bash
git push -u origin chore/repository-consolidation
```

## 7. Pull Request

Abrir PR da branch de trabalho para `main`.

Não realizar merge antes do review arquitetural.

## 8. Ajustes

Após correções:

```bash
git add caminho/do/arquivo
git commit -m "fix(repo): correct relative asset paths"
git push
```

O PR será atualizado automaticamente.

## 9. Merge

Somente após aprovação.

Preferência inicial:

```text
Squash and merge
```

O método pode ser revisto futuramente.

## 10. Sincronização Local

Após merge:

```bash
git checkout main
git pull
git branch -d chore/repository-consolidation
```

## 11. Comandos Proibidos sem Análise

Não executar de forma automática:

```bash
git reset --hard
git clean -fd
git push --force
git rebase
git filter-repo
```

Esses comandos podem causar perda de histórico ou arquivos.
