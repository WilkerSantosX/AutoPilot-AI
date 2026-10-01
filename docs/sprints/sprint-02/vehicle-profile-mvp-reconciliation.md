# Missão 02.2 — Reconciliar VehicleProfile com o MVP retomado

> Projeto: AutoPilot AI
> Natureza: relatório investigativo; não constitui decisão de implementação.
> Análise realizada: 24/09/2026 — America/Sao_Paulo.
> Registro em Markdown: 27/09/2026, por solicitação do usuário.
> Baseline analisado: `d3aef9f6e0b64dc2df7be87bae76f45d3dfc745e`.

Este documento preserva os resultados da análise já apresentada. Sua criação não representa uma nova execução dos testes ou da validação no navegador. Evidências, avaliações e recomendações estão diferenciadas abaixo.

## 1. Executive Summary

**O VehicleProfile é uma base reutilizável de cadastro e persistência, mas ainda não participa do caminho principal do MVP.**

Hoje existem dois fluxos separados:

```text
Acesso técnico → cadastro → perfil salvo → permanência no formulário

Landing → questionário fixo → Hero simulado → cockpit fixo
```

O cadastro funcionou no navegador e recuperou o veículo após reload. Porém, mesmo com um Toyota Corolla salvo, o questionário e o cockpit continuaram exibindo o Renault Clio definido no código.

Durante a investigação não houve implementação, alteração documental, commit ou push. Este arquivo foi criado posteriormente, mediante solicitação explícita.

## 2. Baseline analisado

| Item | Estado observado na investigação |
|---|---|
| Branch | `feature/sprint-02-vehicle-profile` |
| HEAD | `d3aef9f6e0b64dc2df7be87bae76f45d3dfc745e` |
| Baseline técnico preservado | `f753447d56db48ee9e78e6fc1f655800b13c1515` |
| Upstream | `origin/feature/sprint-02-vehicle-profile` |
| Comparação com upstream local | 0 à frente, 0 atrás |
| Workspace inicial | Limpo |

Não foi executado fetch na Missão 02.2; a sincronização acima corresponde às referências locais existentes.

A análise considerou o [AGENTS.md](../../../AGENTS.md), a governança lida nas missões anteriores e os documentos da Sprint, especialmente o [Implementation Contract](implementation-contract.md) e o [Feature Brief](feature-brief.md).

## 3. Mapa do VehicleProfile

| Elemento | Comportamento encontrado |
|---|---|
| [vehicleModel.js](../../../apps/autopilot-web/vehicle/vehicleModel.js) | Cria perfil, identificador, timestamps e `schemaVersion: 1`; verifica o formato de perfis recuperados. |
| [vehicleValidator.js](../../../apps/autopilot-web/vehicle/vehicleValidator.js) | Normaliza e valida entradas; retorna valores normalizados e erros por campo. |
| [vehicleStorage.js](../../../apps/autopilot-web/vehicle/vehicleStorage.js) | Salva e recupera um perfil em `localStorage`, na chave `autopilot.vehicle-profile.v1`. |
| [VehicleProfileScreen.js](../../../apps/autopilot-web/screens/VehicleProfileScreen.js) | Formulário, eventos de submit, mensagens, erros e resumo do perfil recuperado. |
| [vehicleProfile.css](../../../apps/autopilot-web/styles/vehicleProfile.css) | Estilos próprios do cadastro, incluindo regras responsivas. |
| [vehicleProfile.test.mjs](../../../apps/autopilot-web/vehicle/vehicleProfile.test.mjs) | Seis testes de normalização, validação, modelo e persistência. |

### Campos e defaults

- Obrigatórios: fabricante, modelo, ano, motorização, combustível e quilometragem.
- Opcional: apelido; vazio é normalizado para `null`.
- Metadados: `id`, `createdAt`, `updatedAt`, `schemaVersion`.
- Textos recebem `trim`; campos textuais ausentes tornam-se vazios.
- Ano e quilometragem são convertidos com `Number`; ausência ou string vazia tornam-se `NaN`.
- Ano: inteiro entre 1886 e o ano atual mais um.
- Quilometragem: inteiro maior ou igual a zero.
- Identificador: `crypto.randomUUID`, com fallback baseado em tempo e aleatoriedade.
- Timestamps começam iguais. Não há operação específica que atualize `updatedAt` posteriormente.

### Persistência e integridade

- Novo cadastro substitui o perfil anterior na mesma chave.
- Não há operação dedicada de edição, exclusão ou migração.
- JSON inválido, perfil incompatível e falhas de `getItem`/`setItem` recebem respostas de erro.
- Apenas a versão 1 é aceita; versão diferente é rejeitada.
- A recuperação verifica tipos normalizados, identificador e datas parseáveis; isso não verifica a veracidade dos dados automotivos.

**Limites confirmados:** o getter de `localStorage` pode lançar antes do `try`. O validador, chamado diretamente, aceita `" "`, `false` e `[]` como quilometragem zero. Esses tipos não representam o percurso normal dos campos numéricos da UI, mas revelam tolerância excessiva na função.

## 4. Fluxo funcional atual

O acesso ocorre por `?screen=vehicle-profile`, tratado em [app.js](../../../apps/autopilot-web/app.js). Não há entrada equivalente na landing.

1. O router renderiza o formulário e associa os eventos.
2. `showPersistedProfile()` consulta o storage; havendo perfil válido, mostra fabricante, modelo e ano.
3. O usuário envia o formulário.
4. O evento impede o submit nativo e bloqueia novos envios.
5. `FormData` é convertido em objeto.
6. `createVehicleProfile()` normaliza, valida e cria o perfil.
7. Se inválido, a UI apresenta erros, foca o primeiro campo e libera nova tentativa.
8. Se válido, `saveVehicleProfile()` grava o JSON.
9. Em falha de gravação, apresenta mensagem e libera nova tentativa.
10. Em sucesso, limpa os campos, exibe confirmação e recupera o resumo salvo.

**O fluxo termina nessa tela.** O botão permanece desabilitado como “Veículo salvo”; não há callback de conclusão, atualização do estado compartilhado ou navegação ao questionário.

“Voltar à aplicação” é um link para `./`, que recarrega a landing. Após reload do cadastro, o perfil aparece no resumo, mas o formulário fica vazio e permite substituição.

## 5. Análise dos quatro estágios do MVP

### A. Meu veículo — existe parcialmente

A criação, persistência e recuperação funcionam no percurso normal. Há uma representação identificável e versionada.

Faltam a entrada pelo fluxo principal e o consumo do perfil fora do cadastro. Os limites de storage e coerção impedem considerar a representação robusta em todos os cenários.

### B. Minhas respostas — existe, mas está desconectado do perfil

O [Question Engine](../../../apps/autopilot-web/engine/questionEngine.js) guarda respostas em memória, com `questionId`, `value` e `answeredAt`.

A [tela ativa do questionário](../../../apps/autopilot-web/screens/questionScreen.js) permite selecionar, avançar e recuperar respostas confirmadas ao voltar. Ao finalizar, entrega as respostas ao router.

Entretanto:

- Não há leitura de VehicleProfile nessa cadeia.
- Não há `vehicleId` ou outra associação explícita das respostas ao perfil.
- A primeira pergunta usa um veículo fixo em [questions.js](../../../apps/autopilot-web/data/questions.js).
- “Escolher outro” é uma resposta comum; não abre outro fluxo.
- `AppState.answers` recebe as respostas, mas elas não são consumidas pelo Hero ou cockpit.

### C. Experiência coerente — existe parcialmente

O encadeamento landing → questionário → Hero → cockpit funciona. O encadeamento cadastro → questionário não existe.

O [router.js](../../../apps/autopilot-web/router.js) mantém tela e respostas em memória, sem sincronizar navegação com URL ou histórico do navegador.

- Reload normal volta à landing e perde a sessão de respostas.
- Reload com a query técnica volta ao cadastro.
- O perfil persiste; a sessão não.
- O bloqueio de duplo envio vale durante aquela instância do formulário.
- Após reload, novo cadastro substitui o anterior, conforme o contrato.
- Perfil ausente ou inválido não condiciona o início do questionário.
- Não há recuperação explícita da jornada interrompida.
- O cadastro termina sem continuação; o cockpit apresenta ações sem destino funcional.

### D. Meu cockpit — estrutura existente, personalização ausente

[CockpitScreen.js](../../../apps/autopilot-web/screens/CockpitScreen.js) já oferece um destino visual consolidado: cabeçalho, veículo, status, ações e dica.

Seu potencial de reaproveitamento é direto: já aceita `vehicleName`. Contudo, o router fornece nome e veículo fixos, e a tela não recebe respostas.

O [HeroScreen.js](../../../apps/autopilot-web/screens/HeroScreen.js) apenas executa etapas temporizadas. Não analisa veículo ou respostas.

**Não foi encontrada lógica de resultado personalizado.** O cockpit informa ausência de situação crítica independentemente da urgência escolhida.

## 6. Matriz de rastreabilidade

| Etapa do MVP | Capacidade necessária | Estado atual | Evidência no código | Gap |
|---|---|---|---|---|
| Meu veículo | Criar perfil válido | Existe parcialmente | Modelo, validador e testes | Limites de coerção e regras a esclarecer |
| Meu veículo | Persistir e recuperar | Existe e está conectado ao cadastro | Storage e tela de cadastro | Getter bloqueado escapa do tratamento |
| Meu veículo | Entrar pelo fluxo principal | Existe mas está desconectado | `app.js`, `router.js` | Acesso apenas técnico |
| Minhas respostas | Coletar respostas | Existe e está conectado | Question Engine e tela ativa | Não representa vínculo com perfil |
| Minhas respostas | Usar veículo cadastrado | Não encontrado | Perguntas fixas; ausência de leitura do storage | Fornecer contexto real |
| Experiência coerente | Continuar após cadastro | Não encontrado | Submit termina na confirmação | Definir transição |
| Experiência coerente | Manter sessão entre telas | Existe parcialmente | Engine e `AppState` | Dados não chegam aos consumidores finais |
| Experiência coerente | Retomar após reload | Existe parcialmente | Perfil persistente; respostas em memória | Definir política de retomada |
| Meu cockpit | Oferecer destino visual | Existe e está conectado | Hero → cockpit | Conteúdo fixo |
| Meu cockpit | Exibir veículo e respostas reais | Não encontrado | Router e cockpit | Consumir contexto e síntese factual |
| Meu cockpit | Produzir orientação baseada nos dados | Não encontrado | Hero temporizado e status constante | Definir o que o MVP pode afirmar |

Os módulos citados nesta matriz estão vinculados nas seções 3 a 5.

## 7. Ativos reutilizáveis

| Ativo | Responsabilidade atual e motivo para preservar | Eventual adaptação |
|---|---|---|
| Modelo e schema | Identidade e formato já explícitos | Ajustes pontuais de contrato, se aprovados |
| Validador | Centraliza regras e erros por campo | Restringir coerções e esclarecer limites |
| Storage | Isola serialização e acesso ao perfil | Cobrir indisponibilidade do getter |
| Formulário e CSS | Cadastro demonstrado, feedback e foco em erros | Entrada normal e saída após sucesso |
| Question Engine | Navegação e coleta separadas da apresentação | Vincular sessão ao veículo; definir reinício |
| [QuestionCard](../../../apps/autopilot-web/components/QuestionCard/QuestionCard.js) | Já utilizado no questionário ativo | Conteúdo adequado ao contexto real |
| Router | Já conecta as telas necessárias | Transportar contexto e tratar estados de entrada |
| Cockpit e [CSS](../../../apps/autopilot-web/styles/cockpit.css) | Destino visual já construído | Substituir conteúdo fixo por informação real |
| Testes existentes | Protegem a base isolada | Cobrir integração no próximo corte autorizado |
| [AutoCard](../../../apps/autopilot-web/components/AutoCard/AutoCard.js) e [FeatureCard](../../../apps/autopilot-web/components/FeatureCard/FeatureCard.js) | Componentes utilizados na landing | Revisar mensagens conforme decisão de produto |

**Avaliação técnica:** não há evidência que justifique reescrever essas estruturas para realizar a primeira integração.

## 8. Gaps encontrados

Os principais gaps são de **conexão e consumo de contexto**:

- Cadastro inacessível pela jornada normal.
- Perfil recuperado apenas na tela técnica.
- Respostas sem associação ao veículo.
- Respostas coletadas, mas não utilizadas no resultado.
- Ausência de continuação após salvar.
- Cockpit e Hero com conteúdo independente dos dados.
- Política de reload, reinício e retomada não implementada.
- Cobertura automatizada concentrada na base do perfil.

O contrato já prevê cadastro quando necessário, reutilização do perfil e cockpit correspondente ao veículo salvo. Esses critérios ainda não são atendidos pelo fluxo principal.

## 9. Código e fluxos potencialmente órfãos

| Elemento | Constatação |
|---|---|
| [state/appState.js](../../../apps/autopilot-web/state/appState.js) | Sem importador encontrado; duplica o estado declarado no router. |
| [questionnaireScreen.js](../../../apps/autopilot-web/screens/questionnaireScreen.js) | Fora da cadeia ativa; usa referências não importadas e `currentQuestion` ausente no estado atual. |
| `questionEngine.reset()` | Disponível, sem consumidor encontrado. |
| `AppState.answers` | Recebe dados ao concluir, mas não possui consumidor posterior encontrado. |
| [FeatureCard.css](../../../apps/autopilot-web/components/FeatureCard/FeatureCard.css) | Arquivo existente sem carregamento no `index.html`; o componente JavaScript é utilizado. |
| Ações do cockpit e “Ver dica” | Handlers apenas escrevem no console. |
| Tipos das perguntas | `vehicle`, `goal` e `urgency` não determinam comportamentos distintos na tela ativa. |

Não foram encontrados marcadores `TODO`, `FIXME` ou `HACK` na busca realizada.

A [landing](../../../apps/autopilot-web/screens/landingScreen.js) anuncia “IA que ensina”, enquanto o contrato exclui IA e o código não a implementa. “Sem cadastro” também exige esclarecimento de linguagem: pode significar ausência de conta, mas a jornada retomada requer dados do veículo.

As divergências documentais anteriores permanecem: [plano](sprint-plan.md) em `Planning`, documentos aprovados, [discovery](engineering-discovery.md) histórica e lacunas no [Project Bible](../../project-bible/README.md). Nenhuma foi corrigida nesta investigação.

## 10. Resultados dos testes e validações

### Automatizados

- `node --test apps/autopilot-web/vehicle/vehicleProfile.test.mjs`: 6 testes aprovados; 0 falhas.
- `node --check` nos arquivos JavaScript/MJS: concluído sem erros.
- `git diff --check`: sem apontamentos no workspace durante a investigação.
- Sondagens executadas em memória, sem arquivos adicionais:
  - schema diferente de 1 rejeitado;
  - getter bloqueado de `localStorage` lança fora do tratamento;
  - quilometragem `" "`, `false` e `[]` aceita como zero pela função.

### Comportamento observado no navegador

| Cenário | Resultado |
|---|---|
| Carregamento inicial | Landing apresentada |
| Iniciar sem perfil | Questionário aberto diretamente |
| Acesso técnico ao cadastro | Formulário apresentado |
| Envio vazio | Seis erros; foco no fabricante |
| Salvar Toyota Corolla 2020 | Confirmação e resumo do perfil |
| Após salvar | Permanece no cadastro; botão desabilitado |
| Reload do cadastro | Perfil recuperado; formulário vazio e habilitado |
| Voltar à aplicação | Retorno à landing |
| Iniciar com perfil salvo | Questionário continua mostrando Clio |
| “Escolher outro” | Avança à pergunta de objetivo |
| Finalizar com urgência alta | Hero temporizado, depois cockpit fixo |
| Cockpit | Clio e mensagem de ausência de situação crítica |
| Clicar em diagnóstico no cockpit | Nenhuma mudança visível |
| Reload do cockpit | Retorno à landing |

**Limitações:** não houve inspeção do console JavaScript nesta execução, nem validação responsiva completa. Dados corrompidos e falhas de storage foram cobertos em testes/sondagens, não pela UI nesta rodada. O servidor registrou um 404 de `favicon.ico`.

## 11. Gap mínimo para o primeiro fluxo vertical

**Recomendações para avaliação, não decisões de implementação.** Com base nas evidências, o menor conjunto de capacidades ausentes é:

1. **Entrada orientada pelo perfil:** distinguir perfil válido, ausente e indisponível antes de iniciar a jornada.
2. **Continuação do cadastro:** disponibilizar o perfil salvo ao fluxo e seguir para as perguntas.
3. **Contexto consistente:** associar as respostas ao veículo utilizado, sem depender do nome fixo da primeira pergunta.
4. **Destino que consome os dados:** fazer o cockpit existente apresentar o veículo e uma síntese real das respostas.
5. **Coerência de estados e mensagens:** definir reinício/retomada e evitar conclusões que o código não produz.
6. **Validação vertical:** demonstrar o mesmo veículo do cadastro ao cockpit, incluindo retorno e falhas relevantes.

Isso não exige, pelas evidências atuais, novo framework, backend ou cockpit. Também não implica implementar diagnóstico inteligente.

## 12. Riscos e decisões do PO/Tech Lead

| Decisão pendente | Alternativas e implicações |
|---|---|
| Papel do primeiro cockpit | Resumo factual de veículo/respostas permite um corte menor; orientação calculada exige regras e critérios adicionais. |
| Papel do Hero | Preservar como transição com linguagem compatível, ou dispensá-lo no corte mínimo; hoje ele promete análise inexistente. |
| Reload | Reiniciar perguntas mantendo o perfil é mais simples; retomar sessão exige persistência e regras de validade/vínculo. |
| Primeira pergunta | Confirmar o veículo salvo ou eliminar a seleção redundante; manter “Escolher outro” exige destino explícito. |
| Quilometragem zero | Código e teste aceitam; “positiva” no contrato é ambíguo frente a esse comportamento. |
| Falha de persistência | Bloquear com recuperação orientada ou permitir sessão temporária são experiências diferentes, a serem aprovadas. |

**Risco principal observado:** transmitir uma conclusão de segurança do veículo sem análise, inclusive após urgência alta.

Outro cuidado para futura integração: o cockpit interpola parâmetros em HTML. Ao receber texto cadastrado pelo usuário, será necessário preservar uma renderização segura; o resumo atual do cadastro usa `textContent`.

## 13. Estado final do workspace

### Encerramento da investigação

- HEAD permaneceu em `d3aef9f6e0b64dc2df7be87bae76f45d3dfc745e`.
- Branch e upstream permaneceram iguais.
- Workspace e staging limpos.
- Nenhum arquivo criado, modificado ou removido no repositório.
- Nenhum commit, push, merge, rebase ou alteração de `main`.
- Servidor temporário e aba de validação encerrados.
- Foi gravado um perfil sintético no storage do navegador de teste, na origem `http://127.0.0.1:8765`; sua remoção não foi verificada.

### Registro posterior deste relatório

Em 27/09/2026, o usuário solicitou a geração do arquivo Markdown a partir da análise. A criação de `docs/sprints/sprint-02/vehicle-profile-mvp-reconciliation.md` é a única alteração desta etapa documental. Não houve nova validação funcional, commit ou push.

**Nenhum código funcional foi alterado. Os gaps registrados são evidências para o próximo corte do PO/Tech Lead, não decisões de implementação.**
