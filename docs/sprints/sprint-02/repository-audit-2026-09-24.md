# Auditoria factual do repositório — retomada do desenvolvimento

> Projeto: AutoPilot AI  
> Data: 24/09/2026 — America/Sao_Paulo  
> Público: Product Owner, Tech Lead e equipe  
> Referência auditada: `feature/sprint-02-vehicle-profile` — `f753447d56db48ee9e78e6fc1f655800b13c1515`  
> Natureza: diagnóstico do estado observado; não constitui aprovação da Sprint ou autorização de implementação.

Os caminhos relativos deste documento apontam para arquivos do próprio repositório. As constatações descrevem a referência auditada, não mudanças posteriores. Fatos, limitações da validação e recomendações estão identificados separadamente.

## 1. Executive Summary

**Fatos observados:** o repositório contém um protótipo SPA executável e uma implementação parcial da Sprint 2. O fluxo demonstrável atual é:

**Landing → questionário de três perguntas → Hero Moment simulado → cockpit estático.**

O VehicleProfile já possui modelo, validador, armazenamento local, formulário e testes. Entretanto, **não está integrado ao fluxo principal**: seu acesso ocorre por `?screen=vehicle-profile`, e o veículo salvo não aparece no questionário nem no cockpit.

Os **seis testes existentes passaram**. A aplicação executou no navegador, incluindo cadastro e recuperação após reload. Isso comprova a base isolada do perfil, mas não o cumprimento integral da Sprint 2.

Evidências: [router.js](../../../apps/autopilot-web/router.js), [VehicleProfileScreen.js](../../../apps/autopilot-web/screens/VehicleProfileScreen.js), [contrato da Sprint 2](implementation-contract.md).

## 2. Repository & Git State

**Fatos observados:**

| Item | Estado |
|---|---|
| Branch atual | `feature/sprint-02-vehicle-profile` |
| HEAD | `f753447d56db48ee9e78e6fc1f655800b13c1515` |
| Último commit | `Add vehicle profile screen routing`, de 13/07/2026 |
| `main` local | `c81d94f` |
| Comparação com `main` | Dois commits à frente; nenhum atrás |
| Upstream da branch atual | Não configurado |
| Arquivos rastreados modificados | Nenhum durante a auditoria |
| Alterações staged | Nenhuma |
| Arquivo não rastreado | `AGENTS.md`, já presente no início |
| Remote | [WilkerSantosX/AutoPilot-AI](https://github.com/WilkerSantosX/AutoPilot-AI) |

A diferença entre `main` e a branch auditada abrange **13 arquivos, 1.855 inserções e 14 remoções**, incluindo documentação da Sprint e VehicleProfile.

As referências locais `main` e `origin/main` apontam para o mesmo commit. **Não houve fetch nem consulta de PRs**; portanto, isso não comprova o estado atual do servidor remoto ou aprovações externas.

Evidências: comandos `git status --porcelain=v2 --branch`, `git branch -avv`, `git log`, `git rev-list --left-right --count main...HEAD` e `git diff main...HEAD --stat`.

## 3. Architecture / Project Structure

**Fatos observados:**

- Aplicação única em `apps/autopilot-web/`.
- HTML, CSS e JavaScript nativo com ES Modules.
- Bootstrap CSS **5.3.3**, Bootstrap Icons **1.11.3** e Poppins carregados externamente.
- Sem `package.json`, lockfile, bundler, backend ou dependências JavaScript locais.
- Sem workflows de CI encontrados.
- `scripts/` contém apenas um README.
- Diretórios previstos como `packages/`, `tools/` e `.github/` não estão presentes no inventário auditado.

| Responsabilidade | Local em `apps/autopilot-web/` |
|---|---|
| Documento inicial e estilos | `index.html` |
| Inicialização e acesso técnico | `app.js` |
| Roteamento e estado ativo | `router.js` |
| Telas | `screens/` |
| Componentes HTML | `components/` |
| Perguntas | `data/questions.js` |
| Navegação e respostas do questionário | `engine/questionEngine.js` |
| Modelo, validação e persistência do perfil | `vehicle/` |

A SPA substitui o conteúdo de `#app`. Não utiliza History API ou hash routing. As transições não atualizam a URL; reload reinicia a landing, exceto quando o parâmetro técnico solicita o formulário.

Não há comandos de build ou desenvolvimento encapsulados. A discovery documenta `python -m http.server 8000 --directory apps/autopilot-web` como sugestão. Nesta auditoria, foi utilizado servidor HTTP temporário em memória.

Evidências: [index.html](../../../apps/autopilot-web/index.html), [app.js](../../../apps/autopilot-web/app.js), [router.js](../../../apps/autopilot-web/router.js), [repository-workspace.md](../../engineering-bible/repository-workspace.md), [scripts/README.md](../../../scripts/README.md).

## 4. Implemented Features

**Fatos observados:**

| Área | Comportamento real |
|---|---|
| Landing | Apresentação e botão funcional para iniciar o questionário |
| Questionário | Três perguntas: veículo, objetivo e urgência |
| Seleção | Habilita avanço após escolher uma opção |
| Retorno | Recupera resposta anteriormente confirmada |
| Progresso | Exibe 33%, 67% e 100% |
| Respostas | Mantidas em memória, com identificação e timestamp |
| Hero Moment | Sequência visual temporizada, seguida de navegação automática |
| Cockpit | Painel estático com usuário e veículo fixos |
| Ações do cockpit | Apenas mensagens no console |

“Escolher outro” **não abre cadastro ou seleção de veículo**: avança para a segunda pergunta, como qualquer resposta.

O Hero não recebe nem analisa respostas ou perfil. A sequência usa percentuais fixos e timers. Não há diagnóstico, IA ou personalização implementados.

O cockpit apresenta “Wilker”, “Renault Clio 2001 RT 1.0 16V” e “Não encontrei nenhuma situação crítica”. Na execução, selecionar urgência **Alta** produziu essa mesma mensagem.

Evidências: [questions.js](../../../apps/autopilot-web/data/questions.js), [questionScreen.js](../../../apps/autopilot-web/screens/questionScreen.js), [questionEngine.js](../../../apps/autopilot-web/engine/questionEngine.js), [HeroScreen.js](../../../apps/autopilot-web/screens/HeroScreen.js), [CockpitScreen.js](../../../apps/autopilot-web/screens/CockpitScreen.js).

## 5. VehicleProfile Status

**Fatos observados:**

| Camada | Estado |
|---|---|
| Modelo | Implementado |
| Validador | Implementado |
| Storage | Implementado |
| Formulário | Implementado e executado |
| Recuperação após reload | Confirmada no formulário |
| Integração com landing | Ausente |
| Integração com questionário | Ausente |
| Integração com cockpit | Ausente |

O modelo contém `id`, fabricante, modelo, ano, motorização, combustível, quilometragem, apelido, timestamps e `schemaVersion: 1`.

A validação:

- Remove espaços nas extremidades dos textos.
- Exige fabricante, modelo, motorização e combustível.
- Aceita ano inteiro entre 1886 e o ano atual mais um.
- Aceita quilometragem inteira **maior ou igual a zero**.
- Converte apelido vazio em `null`.
- Mantém combustível e motorização como texto livre.

A persistência utiliza a chave `autopilot.vehicle-profile.v1`, com um único perfil. Novo salvamento substitui o anterior. Há tratamento para JSON inválido, conteúdo incompatível e falhas nos métodos de leitura/escrita.

O formulário mostra erros por campo, direciona foco, confirma sucesso e bloqueia novos envios após salvar. A permanência desse bloqueio foi observada; não há teste automatizado de duplo envio.

Após salvar, o usuário permanece na tela técnica. Não há continuação automática para o diagnóstico.

**Limitações reproduzidas:**

- Se o acesso à propriedade `localStorage` lançar `SecurityError`, a exceção escapa: o acesso ocorre no argumento padrão, antes do `try`.
- No validador diretamente, quilometragem composta apenas por espaços é convertida em zero.
- O contrato exige quilometragem “positiva”, enquanto código e teste aceitam zero. A interpretação precisa ser confirmada pelo responsável pelo contrato.

Evidências: [vehicleModel.js](../../../apps/autopilot-web/vehicle/vehicleModel.js), [vehicleValidator.js](../../../apps/autopilot-web/vehicle/vehicleValidator.js), [vehicleStorage.js](../../../apps/autopilot-web/vehicle/vehicleStorage.js), [VehicleProfileScreen.js](../../../apps/autopilot-web/screens/VehicleProfileScreen.js), [contrato](implementation-contract.md).

## 6. Tests & Validation

**Fatos observados:**

Executado em Node **v23.3.0**, a partir da raiz do repositório:

```text
node --test apps/autopilot-web/vehicle/vehicleProfile.test.mjs
```

Resultado: **6 testes aprovados, 0 falhas, 0 ignorados**.

Cobertura existente:

- Normalização.
- Campos obrigatórios e limites numéricos.
- Criação do modelo.
- Persistência, recuperação e substituição.
- Ausência de dados, JSON inválido e falha de leitura.
- Falha de escrita.

Também foram executados:

- `node --check` nos **18 arquivos JavaScript/MJS**, sem erros.
- `git diff --check`, sem apontamentos na diferença de trabalho.
- Execução da SPA em Microsoft Edge headless, com contexto isolado.
- Conferência final de hashes e inventário dos arquivos.

| Cenário no navegador | Resultado |
|---|---|
| Iniciar sem perfil | Abre questionário; não exige cadastro |
| “Escolher outro” | Avança sem ramificação |
| Voltar no questionário | Recupera resposta confirmada |
| Finalizar com urgência alta | Hero e cockpit estático |
| Enviar formulário vazio | Seis campos inválidos |
| Salvar perfil válido | Sucesso |
| Recarregar formulário | Perfil recuperado |
| Retornar ao diagnóstico | Continua oferecendo Clio fixo |
| JSON corrompido | Mensagem amigável |
| Getter de storage bloqueado | `SecurityError` não tratado |

**Limites da validação:** não ocorreram exceções JavaScript no fluxo normal, mas houve erros de rede para Google Fonts e jsDelivr, bloqueados pelo ambiente, além de 404 de recurso auxiliar. A aparência completa com CDN disponível não foi validada. O formulário foi inspecionado em viewport móvel de 390 px, sem overflow horizontal nessa condição.

Não existem testes automatizados da navegação, Hero, cockpit ou integração do perfil. Não há relatório de cobertura.

Evidência: [vehicleProfile.test.mjs](../../../apps/autopilot-web/vehicle/vehicleProfile.test.mjs).

## 7. Documentation Found

**Fatos observados:** foram lidos os **51 arquivos Markdown** encontrados antes da criação deste relatório, incluindo:

- [AGENTS.md](../../../AGENTS.md): regras operacionais e precedência documental.
- [Project Bible](../../project-bible/README.md) e [History](../../project-bible/history/README.md).
- [Engineering Bible](../../engineering-bible/README.md): princípios e regras de workspace, Git, segurança, testes e operação.
- [APDL](../../apdl/README.md): lifecycle, estados, transições, quality gates, responsabilidades e artefatos.
- [ADRs](../../adr/README.md): seis decisões, todas com status `Accepted`.
- Sprint 2: [plano](sprint-plan.md), [feature brief](feature-brief.md), [discovery](engineering-discovery.md), [contrato](implementation-contract.md) e [missão](codex-mission.md).
- [README raiz](../../../README.md), [CONTRIBUTING](../../../CONTRIBUTING.md), [PROJECT-STATUS](../../../PROJECT-STATUS.md) e documentação de estrutura.

**Lacunas documentais:**

- O Project Bible lista nove documentos estratégicos, mas somente README e History estão presentes.
- Não foram encontrados Sprint Review, aceite final, relatório de implementação ou registros de Knowledge Preservation.
- Não existe documento específico da “Missão 2.1” exibida no formulário.
- O README da aplicação e o README de `docs/adr/foundation/` estão vazios.
- A ADR-0007 é mencionada como futura; não está presente.

Ausência no repositório não comprova ausência desses registros fora dele.

## 8. Gaps / Divergences / Technical Debt

**Fatos observados:**

| Divergência ou débito | Evidência |
|---|---|
| Contrato prevê cadastro integrado e cockpit com perfil; código mantém fluxos separados | [contrato](implementation-contract.md), [router.js](../../../apps/autopilot-web/router.js) |
| README afirma não incluir implementação de produto | [README.md](../../../README.md) |
| Project Status declara Project Bible consolidado, mas os documentos listados não estão presentes | [PROJECT-STATUS.md](../../../PROJECT-STATUS.md) |
| Plano permanece “Planning”, enquanto brief, contrato e missão estão aprovados | [sprint-plan.md](sprint-plan.md) |
| Discovery descreve ausência de perfil e testes; representa estado anterior | [engineering-discovery.md](engineering-discovery.md) |
| Estado duplicado: arquivo separado não é importado | [state/appState.js](../../../apps/autopilot-web/state/appState.js) |
| Tela antiga não importada e com referências não resolvidas | [questionnaireScreen.js](../../../apps/autopilot-web/screens/questionnaireScreen.js) |
| Engine do questionário tem `reset`, mas fluxo ativo não o utiliza | [questionScreen.js](../../../apps/autopilot-web/screens/questionScreen.js) |
| CSS do FeatureCard existe, mas não é carregado | [index.html](../../../apps/autopilot-web/index.html), [FeatureCard.css](../../../apps/autopilot-web/components/FeatureCard/FeatureCard.css) |
| `packages/` é previsto para código compartilhado, mas está ignorado pelo Git | [.gitignore](../../../.gitignore) |

Não foram encontrados marcadores explícitos `TODO`, `FIXME` ou `HACK` no código da aplicação. Existem, porém, placeholders funcionais, logs técnicos e o acesso por query string.

Há referências cruzadas de ADRs com títulos antigos: por exemplo, [ADR-0002](../../adr/adr-0002-project-bible-source-of-truth.md) referencia ADR-0005 como “Documentation as Source of Truth”, embora o arquivo atual trate de colaboração por papéis.

Nenhuma divergência foi corrigida ou resolvida por suposição durante a auditoria.

## 9. Risks

**Avaliações de risco derivadas dos fatos observados:**

| Prioridade | Risco e fundamento |
|---|---|
| Alta | **Interpretação de diagnóstico real:** cockpit afirma ausência de situação crítica sem analisar respostas, inclusive com urgência alta. Evidência: [HeroScreen.js](../../../apps/autopilot-web/screens/HeroScreen.js) e [CockpitScreen.js](../../../apps/autopilot-web/screens/CockpitScreen.js). |
| Alta | **Demonstração da Sprint 2 incompleta:** usuário comum não chega ao cadastro, e perfil salvo não personaliza o fluxo. Evidência: [app.js](../../../apps/autopilot-web/app.js) e [router.js](../../../apps/autopilot-web/router.js). |
| Alta | **Retomada baseada em estado documental incorreto:** planejamento, discovery e status não descrevem uniformemente a implementação atual. |
| Média | **Regressões de integração não detectadas:** testes aprovados cobrem apenas a base isolada do perfil. |
| Média | **Falha em ambientes com storage bloqueado:** exceção do getter não é capturada. Evidência: [vehicleStorage.js](../../../apps/autopilot-web/vehicle/vehicleStorage.js). |
| Média | **Dependência de rede para apresentação:** fontes, ícones e Bootstrap não possuem cópias locais; bloqueio foi observado. |
| Média | **Perda de contexto local:** respostas desaparecem no reload; perfil depende de navegador e origem, sem sincronização. Evidência: [router.js](../../../apps/autopilot-web/router.js) e [vehicleStorage.js](../../../apps/autopilot-web/vehicle/vehicleStorage.js). |
| Média | **Governança não transportada pelo Git:** `AGENTS.md` está não rastreado e não acompanha um clone. |

Os componentes genéricos interpolam HTML diretamente. O nome do perfil atualmente usa `textContent`, portanto **não foi demonstrado XSS no fluxo de cadastro**; a integração futura precisará preservar esse cuidado.

Backend, autenticação, múltiplos veículos, edição, exclusão e IA estão explicitamente fora do escopo da Sprint 2. Sua ausência, isoladamente, não representa defeito dessa Sprint.

## 10. Recommended Next Steps

**Recomendações para decisão do PO e Tech Lead — não implementadas:**

1. **Estabelecer a referência de retomada:** confirmar branch, estado remoto e eventual review/aceite da entrega parcial.
2. **Recuperar o contexto documental ausente:** esclarecer documentos estratégicos e o escopo da “Missão 2.1”, sem presumir que o contrato completo já foi atendido.
3. **Usar o contrato da Sprint 2 como checklist de diferenças:** cadastro integrado, reutilização do perfil e cockpit personalizado permanecem pendentes.
4. **Definir o que a demonstração pode afirmar:** distinguir experiência simulada de diagnóstico real, principalmente na mensagem de segurança do cockpit.
5. **Confirmar regras ambíguas:** zero quilômetro, significado do ano e substituição de perfil.
6. **Preparar uma missão mínima, após decisão humana**, acompanhada de validação do fluxo completo com e sem perfil e tratamento de falhas de storage.
7. **Registrar evidências de revisão e aceite**, preservando a discovery anterior como histórico identificado.

A base isolada do VehicleProfile já existe e funciona nos cenários testados. Isso fornece um ponto concreto para estimar a integração pendente, sem justificar reescrita ou escolha automática de nova feature.

**Integridade da auditoria:** nenhum arquivo do repositório foi criado, modificado ou removido durante a etapa de auditoria. Git, hashes e inventário final confirmaram essa condição. `AGENTS.md` permaneceu não rastreado, como no início. Não houve instalação de dependências, commit, push ou merge. O servidor temporário e o navegador isolado foram encerrados.

**Registro posterior:** este documento Markdown foi criado após a conclusão da auditoria, por solicitação explícita do usuário para compartilhamento com a equipe. Essa criação documental é a única alteração realizada nesta etapa posterior; não altera o estado funcional auditado nem representa correção dos problemas encontrados.
