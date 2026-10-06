# Relatório — Missão 03.5 — Vehicle Care Cockpit

Data: 2026-10-05, America/Sao_Paulo. Governança: GOV.01.
Resultado: implementação e validações técnicas concluídas para publicação e review. Aceite formal do PO pendente. Missão 03.6 não iniciada.

## Fatos

### Baseline e inspeção

- Branch `feature/sprint-03-vehicle-care`, inicialmente limpa e sincronizada no HEAD aceito da 03.4: `2ac26bf144212ed7dc4e544a30442393681e2d8b`.
- Fetch encontrou `c8de893fcbb8e352416e863783f7151e801cb513`. Fast-forward para esse commit, confirmado por `git rev-parse HEAD`, antes da implementação. Ele acrescenta exclusivamente o contrato Approved 03.5; código-base da 03.4 preservado.
- AGENTS.md, GOV.01, sprint-contract, Missões 03.1–03.4 e relatórios consultados. ADRs, Project Bible disponível, Engineering Bible e APDL já lidos nesta conversa, sem mudanças na sincronização. Não foi identificado conflito aplicável.
- Inspecionados cockpit, questionScreen, router/AppState, app.js, estilos, perfil e testes da jornada; Care Onboarding, engine, Care Events, checkpoints e referências locais.
- Perfil ativo vem de loadVehicleProfile e seu ID persistido. Cockpit legado depende também de respostas válidas da sessão; o onboarding usa somente o perfil. Nenhuma dependência, framework, nova arquitetura, schema ou contrato persistido foi necessário.
- A consolidação reutiliza loadCareOnboarding, que confere os loaders, seleciona o marco pelo engine, encontra sua referência user e avalia pelo mesmo engine. Nenhuma regra de classificação foi copiada ou alterada.

### Arquivos e resumo do diff

Criados:

- `apps/autopilot-web/vehicle/careCockpit.js`: consolidação de três avaliações, prioridade e diferença factual de quilometragem.
- `apps/autopilot-web/screens/careCockpitContent.js`: apresentação de estados, evidências, ações, lacunas e erro técnico.
- `apps/autopilot-web/vehicle/careCockpit.test.mjs`: nove testes focados.
- Este relatório e cinco capturas em `reports/mission-03.5-evidence/`: insufficient.jpg, mixed-reload.jpg, desktop.jpg, mobile.jpg e existing-journey.jpg.

Modificados:

- `screens/CockpitScreen.js`: incorpora Vehicle Care antes do resumo de respostas; distingue quilometragem de cadastro da leitura factual; reutilizado na entrada direta sem respostas.
- `router.js` e `app.js`: entrada care-cockpit no mecanismo existente, protegida pelo perfil válido; guarda do cockpit legado preservada.
- `screens/questionScreen.js`: link visível para cockpit de cuidados, mantendo entrada anterior do onboarding.
- `screens/CareOnboardingScreen.js`: link de retorno ao cockpit de cuidados.
- `styles/cockpit.css`: somente estilos do recorte, três colunas em desktop e uma em mobile, foco e indicadores textuais.
- `vehicle/vehicleJourney.test.mjs`: mock de storage agora distingue chaves e um teste adicional de rota/guarda. Asserções anteriores preservadas; alias profile dos testes continua apontando para a chave real.

Engine, modelos, schemas, storages, questionário e Hero permanecem compatíveis. Não há escrita pelo cockpit; domínio da 03.1–03.4 intacto.

### Critérios de aceite

| Item | Resultado e evidência |
|---|---|
| 1 — Entrada principal | PASS: link na pergunta do veículo e seção integrada no cockpit da jornada; smoke e teste de rota. |
| 2 — Três itens | PASS: CARE_ITEMS consolidado; óleo, arrefecimento e revisão básica visíveis. |
| 3 — Engine | PASS: loadCareOnboarding existente; teste compara avaliação completa com engine via loader. |
| 4 — Resumo | PASS: texto orientado ao estado prioritário, acima dos cartões. |
| 5 — Ordem determinística | PASS: attention-needed > due-soon > insufficient-information > up-to-date; empate mantém ordem CARE_ITEMS pelo sort estável. |
| 6 — Next Action | PASS: traduções de monitor, preparar, agir, informar histórico/referência/marco ou leitura; testes e smoke. |
| 7 — Insuficiência útil | PASS: faltas explícitas, caminho ao percurso quando aplicável; edição de mileage do marco não prometida. |
| 8 — Origem user | PASS: referência informada por você e origem usuário, sem recomendação de fabricante/AutoPilot. |
| 9 — Evidência | PASS: datas factuais, marco, leitura, referência e diferença até/no/além da referência; testes e capturas. |
| 10 — Sem previsão/diagnóstico | PASS: nenhum cálculo temporal, diagnóstico ou alegação de saúde mecânica. |
| 11 — Reload | PASS: dados cadastrados pelo onboarding reapareceram no cockpit após reload. |
| 12 — Falhas separadas | PASS: erro técnico com alert/retry e nenhum estado artificial; corrupção/bloqueio de cada storage testados. |
| 13 — Desktop/mobile | PASS: capturas examinadas; cartões em coluna no mobile, texto legível e sem corte/sobreposição. |
| 14 — Jornada anterior | PASS: landing → perguntas → Hero → cockpit com objetivo e urgência reais, além dos cuidados. |
| 15 — Testes | PASS: 82 testes, incluindo 72 anteriores, nove de consolidação e um de rota. |
| 16 — Limite 03.6+ | PASS: nenhum Care Loop, novo marco automático, referência inferida, periodicidade ou fluxo pós-manutenção. |

### Validações

```powershell
node --test apps/autopilot-web/vehicle/*.test.mjs
Get-ChildItem apps/autopilot-web -Recurse -Include *.js,*.mjs | ForEach-Object { node --check $_.FullName }
git -c safe.directory=C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI diff --check
python -u -m http.server 18772 --bind 127.0.0.1 --directory apps/autopilot-web
```

- Suíte final: **82 PASS**, zero falhas/skips/cancelamentos. Sintaxe: **34 JS/MJS PASS**, código de saída conferido por arquivo.
- Primeira regressão apontou que a troca da entrada do onboarding removia o link esperado. Entrada anterior preservada junto à nova; teste original permaneceu intacto. Teste novo expôs mock legado que devolvia o perfil para qualquer chave: corrigido para map por chave, sem enfraquecer asserções.
- Diff --check inicialmente detectou CRLF numa linha nova de arquivo com finais mistos; corrigido somente o final da linha inserida. Check final e staged devem estar limpos antes do commit. Avisos LF→CRLF do Git não são erros de aplicação.
- HTTP 200: `/`, `/screens/CockpitScreen.js`, `/screens/careCockpitContent.js`, `/vehicle/careCockpit.js`, `/styles/cockpit.css`.
- Console durante os cenários e ao final: `tab.dev.logs({levels:['warn','error'],limit:50})` retornou `[]`.
- Diff revisado, incluindo arquivos novos: nenhuma mudança de política, persistência, schema, fonte de referência, inferência ou capacidade futura.
- Aba temporária fechada, viewport temporário restaurado, servidor encerrado por Ctrl+C (exit 1 intencional). Nenhuma ferramenta/dependência instalada.
- Foundation Recovery/F01 favicon ausente continuam pendências históricas fora do escopo; nenhuma correção incidental ou novo erro de console observado.

### Smoke tests e capturas

Dados exclusivamente sintéticos em localhost:18772, Toyota Corolla 2020/2.0/Flex, cadastro 80000 km.

| Cenário | Resultado |
|---|---|
| Sem perfil | Entrada care-cockpit encaminhou para cadastro existente. |
| Informação insuficiente | Link da pergunta abriu três cartões sem fatos, faltas e ações honestas; insufficient.jpg. |
| Cockpit → onboarding | Link Completar informações abriu percurso existente, mesmo veículo. |
| Due-soon | Óleo: data 2026-09-01, marco 80000, referência 90000, leitura explícita 89000. Cockpit mostrou referência se aproximando e 1000 km factuais restantes. |
| Attention-needed | Arrefecimento: data 2026-09-01, marco 80000, referência 89000, mesma leitura 89000. Referência atingida, sem defeito diagnosticado. |
| Misto e reload | Reload exibiu arrefecimento → óleo → revisão sem fatos, com prioridade atingida e fatos salvos; mixed-reload.jpg. |
| Retomar sem apagar | CTA da revisão reabriu percurso do primeiro cuidado; não sei em óleo/arrefecimento preservou fatos, depois revisão foi completada. |
| Up-to-date | Revisão: data 2026-08-01, marco 75000, referência 100000. Leitura 89000 produziu Dentro da referência e 11000 km restantes; desktop.jpg. |
| Mobile | Viewport solicitado 390×844; captura mobile.jpg inspecionada com três cartões em coluna, controles e textos legíveis. Override restaurado. |
| Jornada anterior | Retorno à landing, Iniciar minha jornada, usar Toyota, manutenção preventiva, urgência baixa, Hero e cockpit com respostas corretas e cuidados; existing-journey.jpg. |

Falhas técnicas foram simuladas nos testes nativos, sem alterar storage pelo navegador. Persistência e estados foram exercitados pela UI real do onboarding.

## Decisões

### Consolidação, prioridade e evidência

- Pequeno módulo específico no diretório vehicle existente; nenhuma camada genérica ou duplicação da política. Mantém avaliação individual, apenas acrescenta remainingMileage e ordena apresentação.
- Diferença factual usa exclusivamente calculation.nextDueMileage - calculation.currentMileage quando o engine considera os dados suficientes. Positiva: até referência; zero: na referência; negativa: além. Não transforma leitura de cadastro em checkpoint nem data factual em previsão.
- Falha em qualquer loader interrompe a consolidação: apresenta erro e retry, preservando dados e evitando painel aparentemente confiável com parte das fontes inválida.
- Badges textuais acompanham bordas visuais, sem depender só da cor. Cabeçalhos/region/article, links nativos e foco visível mantêm navegação acessível dentro do padrão atual.

### Mapeamento de ações e integração

| Ação do engine | Tradução e caminho |
|---|---|
| monitor | Continuar acompanhando a referência. |
| prepare-for-reference | Preparar-se para a referência que se aproxima. |
| act-on-reference / record-performed-care | Agir em relação à referência; registro de novo marco pós-cuidado ainda indisponível no cockpit, sem botão fictício. |
| provide-information / care-history | Informar histórico quando souber; onboarding existente, sem inventar passado. |
| provide-information / care-reference | Usar marco salvo e informar referência conhecida no onboarding; desconhecimento permanece permitido. |
| provide-information / milestone-mileage | Explicar quilometragem faltante e que marco salvo não é editável neste fluxo; sem CTA que prometa edição ou Care Loop. |
| update-mileage | Informar leitura explícita usando marco salvo no onboarding. |

- Links por item dizem que levam ao percurso, que começa no primeiro cuidado, sem prometer abertura direta no item selecionado. Reutiliza experiência 03.4 integralmente, alterando apenas retorno.
- Rota aditiva care-cockpit usa o mesmo renderCockpitScreen e perfil válido, dispensando respostas da sessão para consultar cuidados após reload. Rota cockpit legada continua exigindo respostas; não persiste respostas nem cria sistema de navegação novo.
- Seção de perguntas só aparece com respostas da jornada. Entrada direta oferece retorno à jornada. Cabeçalho distingue valor de cadastro, mantendo VehicleProfile sem sincronização silenciosa.
- Cards futuros originais permanecem indisponíveis; não foi realizado redesign global ou limpeza incidental.

### Estado Git e handoff

HEAD anterior ao commit da entrega: `c8de893fcbb8e352416e863783f7151e801cb513`. Implementação, evidências e relatório preparados para commit conjunto `feat(vehicle-care): surface care states in cockpit`, seguido de push normal à branch autorizada.

O SHA do commit contendo este relatório é resolvido sem autorreferência por:

```powershell
git log -1 --format=%H -- docs/sprints/sprint-03/reports/mission-03.5-report.md
```

Este relatório registra estado pré-publicação; SHA literal, push e árvore limpa/upstream são confirmados no handoff final. Nenhum push é afirmado antecipadamente. Sem alteração em main, merge de PR, merge commit, rebase, squash, force-push ou reescrita de histórico.

### Riscos, limitações e pendências

- Fatos/referências dependem da informação do usuário; acompanhamento não valida adequação técnica de referência nem condição mecânica.
- Storage permanece local por origem/dispositivo, sujeito a quota, bloqueio e remoção. Sem coordenação entre abas ou snapshot transacional; cockpit é consumidor síncrono, não acrescenta escrita ou infraestrutura.
- Leitura apresentada é a última factual, com data; não garante quilometragem atual física. Cadastro pode divergir do checkpoint e agora é identificado como cadastro.
- Onboarding reinicia no primeiro item e mantém limitações de edição/referência da 03.4. Lacunas exclusivas de novo marco pós-manutenção permanecem explícitas; não foi implementada sua resolução na 03.5.
- A suíte nativa valida lógica, apresentação textual e rota com mocks; smoke manual cobre DOM/layout real, sem framework E2E novo.
- Review do Tech Lead e aceite explícito do PO continuam necessários para fechar a missão formalmente.

**Sem diagnóstico, previsão temporal, periodicidade inventada, inferência de nova referência, fonte fabricante/AutoPilot ativa, Care Loop, automação pós-manutenção, novos Care Items, backend, dependências ou arquitetura nova. Missão 03.6 não iniciada.**

## Recomendações — não executadas

Tech Lead deve revisar linguagem das ações, prioridade e evidências; PO deve realizar o aceite pelo GOV.01. Edição de marcos, entrada direta por item e Care Loop dependem de autorização/contrato próprios. Nenhuma recomendação foi executada incidentalmente.
