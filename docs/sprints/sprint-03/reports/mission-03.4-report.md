# Relatório de execução — Missão 03.4 — Care Onboarding

Data: 2026-10-05 — America/Sao_Paulo. Governança: GOV.01.
Resultado técnico: **implementação e validações concluídas para publicação/review**. Aceite formal do PO pendente; o executor não alterou o status da missão. Missão 03.5 não iniciada.

## Fatos

### Estado inicial e baseline

- Branch ativa: `feature/sprint-03-vehicle-care`, upstream homônimo em origin, árvore inicialmente limpa.
- HEAD inicial: `4bfa00ada173878b3b04c27700f117b52467439a`, baseline aceito da 03.3.
- Fetch confirmou `382d35c88559bd4b298b4866d42861ae6b0ff48e`, que acrescenta exclusivamente `missions/mission-03.4.md` Approved.
- Sincronização por `git merge --ff-only 382d35c88559bd4b298b4866d42861ae6b0ff48e`, autorizada pelo pedido do usuário; sem merge commit ou reescrita de histórico.
- `git rev-parse HEAD` confirmou exatamente 382d35c antes de alterar código. Missão presente, branch correta e árvore limpa.
- Nenhuma dependência instalada, worktree criado, alteração em main ou comando destrutivo executado.

### Inspeção dirigida

Lidos contrato 03.4, SPA/jornada, padrões de formulário, router/AppState, app.js, index/CSS, VehicleProfile e testes, careModel/careStorage, odometerModel/odometerStorage e careStateEngine. Missões e relatórios 03.1–03.3, AGENTS.md, GOV.01, contrato da Sprint, ADRs, Project Bible disponível, Engineering Bible e APDL foram consultados nesta mesma conversa; a sincronização desta missão acrescentou somente o contrato 03.4. Nenhum conflito aplicável foi identificado. Foundation Recovery permanece parcial e fora do escopo.

- Veículo ativo é o único VehicleProfile persistido, identificado pelo ID já existente. A SPA não possui roteador externo; renderApp/goToScreen controlam telas.
- Pergunta inicial apresenta o veículo persistido. Formulário de cadastro e renderizações existentes usam HTML, handlers síncronos e classes Bootstrap/CSS já disponíveis.
- Care Event/Checkpoint e VehicleProfile permanecem schema 1. O engine usa referência user vinculada ao marco, sem persistência própria da referência antes desta missão.
- Loaders distinguem ausência de dados de falha/corrupção. A aplicação não possui framework de DOM/E2E; testes nativos da lógica foram complementados com smoke manual no navegador.

### Arquivos criados

1. `apps/autopilot-web/vehicle/careReferenceStorage.js`: persistência local mínima de referências user.
2. `apps/autopilot-web/vehicle/careOnboarding.js`: leitura/composição do contexto, preparação validada e gravação do onboarding com retry.
3. `apps/autopilot-web/vehicle/careOnboarding.test.mjs`: 14 testes focados.
4. `apps/autopilot-web/screens/CareOnboardingScreen.js`: percurso por cuidado, conhecido/desconhecido, formulário, feedback e reuso do marco salvo.
5. `apps/autopilot-web/styles/careOnboarding.css`: estilos específicos responsivos sobre o padrão existente.
6. `docs/sprints/sprint-03/reports/mission-03.4-report.md`: este relatório.
7. Evidências em `docs/sprints/sprint-03/reports/mission-03.4-evidence/`: known-reference.jpg, unknown-history.jpg, reload-reference.jpg, mobile-form.jpg e existing-journey.jpg.

### Arquivos modificados e diff

- `apps/autopilot-web/screens/questionScreen.js`: link contextual na pergunta do veículo.
- `apps/autopilot-web/router.js`: case care-onboarding com guarda de perfil persistido.
- `apps/autopilot-web/app.js`: aceita screen=care-onboarding no entrypoint existente.
- `apps/autopilot-web/index.html`: stylesheet específico.

Não houve alteração de cockpit, cadastro do perfil, esquemas, storages existentes ou engine. Integração nos arquivos existentes é pequena; novos arquivos limitados à missão. Capturas mostram somente dados sintéticos de localhost.

### Critérios de aceite — item a item

| Item | Resultado/evidência |
|---|---|
| 1 — Entrada no contexto existente | PASS: link na pergunta do veículo; rota usa loadVehicleProfile e ID existente. |
| 2 — Três cuidados | PASS: percurso usa CARE_ITEMS engine-oil/cooling/basic-review; os três foram percorridos no browser. |
| 3 — Histórico conhecido factual | PASS: Care Event performed criado com data informada e mileage opcional; teste e smoke. |
| 4 — Desconhecimento sem fatos/bloqueio | PASS: nenhuma escrita por não sei; feedback de novo marco futuro e continuidade. Fatos anteriores preservados. |
| 5 — Referência opcional/user/vínculo | PASS: captura só com mileage do marco, origem user e careEventId; rejeição de N<=M. |
| 6 — Persistência após reload | PASS: envelope versionado por veículo; formulário recuperou marco e 90000 km após reload, avaliação continuou due-soon. |
| 7 — Leitura explícita | PASS: campo atual solicitado quando necessário; checkpoint somente quando informado, zero válido; não copia mileage do perfil/evento. |
| 8 — Engine existente | PASS: loadCareOnboarding compõe fatos/referência e chama evaluateCareItem sem alterá-lo. |
| 9 — Lacuna honesta | PASS: histórico desconhecido e referência ausente produzem informação insuficiente com dados faltantes em linguagem acessível. |
| 10 — Linguagem sem diagnóstico | PASS: referência informada por você; estado relativo ao registro; nenhuma recomendação universal. |
| 11 — Compatibilidade | PASS: testes de preservação de perfil/bytes/schemas e regressão 03.1–03.3; módulos existentes intactos. |
| 12 — Testes/regressão | PASS: 72 testes, 14 novos e 58 anteriores; 31 JS/MJS com sintaxe válida. |
| 13 — Jornada anterior | PASS: no navegador, retorno à landing → perguntas → Hero → cockpit; suíte da jornada intacta. |
| 14 — Sem 03.5+ | PASS: feedback de um cuidado por vez; nenhum cockpit consolidado, loop pós-manutenção ou automação. |

### Testes e validações

```powershell
node --test apps/autopilot-web/vehicle/*.test.mjs
Get-ChildItem apps/autopilot-web -Recurse -Include *.js,*.mjs | ForEach-Object { node --check $_.FullName }
git -c safe.directory=C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI diff --check
python -u -m http.server 18771 --bind 127.0.0.1 --directory apps/autopilot-web
```

- Primeira suíte: 71 PASS. Após reforçar preflight de conflitos, suíte final: **72 PASS**, zero falhas/skips/cancelamentos; seis arquivos .test.mjs no total.
- Cobertos referência user, isolamento veículo/item/marco, ausência, dados inválidos, N<=M, corrupção/versão/duplicidade, falha de leitura/quota/getter global, unknown sem escrita, known sem mileage/referência, checkpoint somente explícito/zero, avaliação pelo engine, reuso/reload, contratos/bytes, retry após escrita parcial e conflitos antes de escrita nova.
- Sintaxe de 31 JS/MJS aprovada; loop de validação confere o código de saída de cada arquivo.
- Primeiro diff --check apontou finais de linha CRLF inseridos em arquivos de convenção mista. Finais originais das linhas não alteradas foram preservados, sem normalizar/refatorar arquivos inteiros. Diff final e stage sem apontamentos de whitespace. Aviso LF→CRLF do Git não é erro funcional.
- HTTP 200 por Invoke-WebRequest para `/`, `/screens/CareOnboardingScreen.js`, `/vehicle/careReferenceStorage.js`, `/vehicle/careOnboarding.js` e `/styles/careOnboarding.css`.
- Console consultado durante a jornada e ao final: `tab.dev.logs({levels:['warn','error'],limit:50})` retornou `[]`.
- Viewport móvel temporário configurado em 390×844 e restaurado; captura full-page examinada visualmente, com campos/botões em coluna, sem cortes ou sobreposição. Captura desktop do feedback também examinada.
- Aba temporária e servidor encerrados; exit 1 do servidor corresponde a Ctrl+C intencional. Dados sintéticos permanecem somente na origem localhost:18771 usada para o smoke.
- F01/favicon ausente permanece pendência histórica; sem correção incidental e sem declaração de resolução. Nenhum erro novo de console foi observado.

### Smoke manual e evidências

| Cenário | Procedimento e resultado |
|---|---|
| Entrada | Cadastrado Toyota Corolla sintético, 2020/2.0/Flex/80000 km; pergunta do veículo exibiu link, que abriu care-onboarding no mesmo perfil. |
| Validação de referência | Data 2026-09-01, marco 80000, referência 80000: mensagem compreensível, campos intactos, nenhuma gravação pelo caminho validado. |
| Conhecido com referência | Correção para referência 90000 e leitura explícita 89000: feedback de referência se aproximando e origem informada por você, coerente com due-soon. Evidência: known-reference.jpg. |
| Desconhecido | Arrefecimento → não sei/não lembro: nenhum fato criado pela escolha, insuficiência honesta, orientação de novo marco e botão Próximo cuidado. Evidência: unknown-history.jpg. |
| Referência opcional | Revisão básica em 2026-08-01/75000 km, referência em branco: Care Event salvo e informação insuficiente apenas para próxima referência; continuidade até concluir percurso. |
| Reload | Reload voltou ao primeiro cuidado, exibiu Usar marco já salvo; data/80000/90000 restaurados. Não pediu leitura atual porque checkpoint 89000 já era adequado. Salvar/avaliar reutilizou dados e voltou ao mesmo feedback. Evidência: reload-reference.jpg. |
| Mobile | Formulário restaurado em viewport móvel, sem cortes, campos opcionais/ajuda e botões legíveis. Evidência: mobile-form.jpg. |
| Regressão da jornada | Retorno à aplicação → Iniciar minha jornada → veículo → objetivo manutenção preventiva → urgência baixa → Hero → cockpit original com perfil/respostas. Evidência: existing-journey.jpg. |
| Smoke final | Após ajustes finais de validação/a11y, reload e reuso do marco novamente produziram due-soon; console limpo. |

## Decisões

### Fluxo UX e linguagem

- Entrada na primeira pergunta da jornada, onde o veículo já é conhecido. Usa link/entrypoint da SPA existente; não cria segundo veículo ativo ou novo roteador. Sem perfil válido, usa o cadastro existente.
- Óleo, arrefecimento e revisão básica são percorridos um a um, com progressão 1/3, 2/3, 3/3. Feedback imediato por item, seguido de Próximo cuidado; conclusão confirma somente dados registrados, sem consolidar estados no cockpit.
- Sei o histórico abre data factual e mileage opcional. Referência só habilita com mileage informado e permanece opcional. Valores em branco não viram zero; números precisam ser inteiros seguros não negativos e a referência maior que o marco.
- Não sei/não lembro não persiste preferência nem Care Event/Checkpoint fictício. Oferece continuidade e explica o novo marco futuro. Se já existirem fatos, são preservados e o feedback usa o contexto efetivamente conhecido, sem apagá-lo para simular desconhecimento.
- Reentrada permite Usar marco já salvo; data/mileage anteriores e referência existente são somente leitura. Pode acrescentar referência faltante ou leitura necessária sem duplicar o marco. Não há edição/exclusão de histórico ou fluxo completo pós-manutenção.
- Referência é apresentada como informada por você. Atenção necessária, quando produzida pelo engine, significa referência registrada atingida; a orientação é agir em relação a ela e registrar quando realizar o cuidado. Nenhuma afirmação de saúde/defeito mecânico.
- Labels, inputmode, controles nativos, status aria-live, mensagem focável e botões/links identificáveis preservam acessibilidade básica. CSS reutiliza classes e variáveis visuais existentes, com adaptação móvel específica.
- Guarda do veículo é conferida ao entrar e antes de salvar/avançar. Se o perfil mudar ou falhar a leitura, a tela orienta retorno à aplicação, impedindo escrever dados no veículo errado.

### Care Reference local

Chave: `autopilot.care-references.v1:<vehicleId>`. Envelope: `{schemaVersion: 1, vehicleId, references}`. Cada referência mantém exatamente os campos necessários ao engine: vehicleId, careItemId, careEventId, nextDueMileage e source user.

- Validação reutiliza isCareReference e confere Care Event persistido, vínculo veículo/item, mileage do marco conhecido e N>M.
- No máximo uma referência por careEventId no veículo. Repetição do mesmo valor é idempotente; valor diferente para o mesmo marco é recusado, preservando a referência original. Não foi criado recurso de edição de referência.
- Ausência de chave retorna ok true/references []; corrupção, versão diferente, duplicidade, origem/vínculo incorreto e falhas de acesso retornam erro explícito e não permitem sobrescrita.
- Referência fica pontual no marco; nova referência para marco novo não herda intervalo/valor anterior. Não existe catálogo ou política nova; engine 03.3 permanece inalterado.

### Checkpoints, composição e erros locais

- loadCareOnboarding verifica ok dos loaders antes de avaliar; seleciona marco via engine e recupera somente sua referência correspondente. Não disfarça falha de storage como histórico ausente.
- prepareCareOnboarding valida todos os dados antes de escrever. saveCareOnboarding faz preflight de estrutura/vínculo e conflitos com fatos/referências existentes, depois usa saveCareEvent, saveOdometerCheckpoint e saveCareReference já específicos ao domínio.
- A leitura atual é solicitada somente quando referência/mileage do marco são conhecidos e a leitura disponível não posiciona o marco. Nunca pré-preenche com mileage do perfil ou do evento; caso a pessoa não informe, insuficiência permanece honesta.
- Checkpoint registra a leitura explicitamente informada agora, com occurredAt/recordedAt do registro atual. Zero válido. O histórico é preservado e o engine utiliza sua seleção factual; VehicleProfile não é alterado silenciosamente. Sua mileage legada permanece a informação de cadastro até uma atualização explícita autorizada; no smoke, cockpit original continuou mostrando 80000 km.
- Escritas permanecem separadas, conforme os storages existentes; não há transação entre chaves. Se quota/acesso falhar após evento/checkpoint salvo, estes fatos não são desfeitos. A tela mantém o plano, preserva campos e permite repetir exatamente os mesmos dados sem duplicar fatos. Após falha de escrita, campos ficam somente leitura para retry; Voltar às opções permite reabrir a experiência com os fatos já persistidos.
- Nenhuma camada genérica de armazenamento, event sourcing, migração, framework ou dependência foi criada.

### Git e handoff

Implementação, relatório e evidências preparados para commit conjunto `feat(vehicle-care): add care onboarding`, após validação, na branch feature/sprint-03-vehicle-care, conforme seção 9 da missão.

HEAD pré-publicação: `382d35c88559bd4b298b4866d42861ae6b0ff48e`. Para evitar SHA autorreferente, o identificador do commit contendo este relatório é resolvido por:

```powershell
git log -1 --format=%H -- docs/sprints/sprint-03/reports/mission-03.4-report.md
```

Este documento registra o estado anterior à sua própria publicação. O handoff final informa SHA literal, resultado do push e verificação de árvore limpa/upstream. Nenhum push é afirmado antecipadamente. Nenhuma alteração/publicação em main, merge de PR, merge commit, rebase, squash, force-push ou reescrita de histórico.

### Riscos, limitações e pendências

- Persistência é local por dispositivo/origem, sujeita a quota/bloqueio/remoção. Sem transação entre chaves, coordenação entre abas, edição/exclusão ou nuvem. Retry cobre repetição do mesmo plano em uma sessão, não resolve concorrência distribuída.
- Reload reinicia o percurso no primeiro item; fatos/referências sobrevivem, mas posição do onboarding e respostas não sei não são persistidas. A missão não autorizou novo domínio de preferências.
- Fatos e referências dependem da informação explícita do usuário. Datas seguem os contratos/Date.parse existentes, sem nova política de datas futuras, diagnóstico ou validação automotiva excepcional.
- Marco já salvo sem mileage não é editado para preencher o valor; o usuário pode informar histórico conhecido para criar o marco factual completo, sem migração/alteração de contrato. Referências existentes não são editáveis nesta entrega.
- Formulário/handlers foram validados manualmente no browser e lógica extraída nos testes nativos. Não foi instalado framework de DOM/E2E nem executada injeção de quota no navegador; falhas de quota/parciais foram simuladas nos testes de storage.
- F01 preexistente e Foundation Recovery continuam fora do escopo. Aceite formal depende do Tech Lead/PO.

**Limites respeitados: sem diagnóstico, periodicidade inventada, inferência de referência/uso futuro, políticas de fabricante/AutoPilot ativas, expansão de Care Items, backend, notificações, telemetria, novo roteador ou dependências. Não foi construído cockpit de Vehicle Care consolidado nem Care Loop completo. Missão 03.5 não iniciada.**

## Recomendações — não executadas

Tech Lead deve revisar sobretudo a referência por marco, a preservação de fatos em falha parcial e a linguagem de insuficiência antes do aceite do PO. Consumo no cockpit e loop pós-manutenção devem seguir contratos próprios, somente após autorização explícita. Edição de referência, concorrência e atualização visual da mileage legada exigem requisitos específicos quando forem necessários; nenhuma dessas melhorias foi adicionada incidentalmente.
