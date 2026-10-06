# Missão 03.7 — MVP Validation & Delivery

Governança: GOV.01. Execução técnica entregue para review; aceite formal pendente.

## Fatos

### Baseline e documentação

- Branch inicial e de entrega: `feature/sprint-03-vehicle-care`; upstream `origin/feature/sprint-03-vehicle-care`.
- HEAD inicial: `563eecea6f47c8b00cbf5d8a8a421136bdbb2928`, implementação aceita da 03.6. Árvore limpa, upstream sem divergência.
- Fetch normal e avanço exclusivamente fast-forward para `e6a3c9a1efabf0c6f430452b4dafe59481ba4cf1`. HEAD exato, contrato 03.7 presente, árvore limpa e upstream sem divergência confirmados antes das alterações.
- O avanço acrescentou somente o contrato 03.7, preservando o baseline funcional aceito; não houve reescrita, descarte de trabalho ou merge commit.
- Lidos AGENTS.md, GOV.01, contrato 03.7 e contratos/relatórios anteriores. ADRs, Project Bible/histórico disponível, Engineering Bible e APDL foram lidos nesta conversa durante as missões antecedentes; nenhuma mudança ou conflito aplicável identificado. Foundation Recovery continua parcial conforme documentação histórica, sem expansão nesta missão.

### Ambiente e dados reproduzíveis

Aplicação estática iniciada com `python -u -m http.server 18773 --bind 127.0.0.1 --directory apps/autopilot-web`. Smoke no navegador in-app, origem nova `http://127.0.0.1:18773`, cadastro e registros exclusivamente sintéticos pela interface, sem injeção de storage. Servidor encerrado, viewport restaurado e aba temporária fechada ao terminar.

Veículo: Toyota Corolla, 2020, 2.0, Flex, cadastro 80.000 km. Após completar os três históricos desconhecidos sem fatos fabricados, o percurso foi reaberto:

| Cuidado | Marco conhecido | Referência user | Leitura explícita | Resultado inicial |
| --- | --- | --- | --- | --- |
| Óleo | 2026-09-01 / 80.000 km | 90.000 km | 89.000 km atual | due-soon |
| Arrefecimento | 2026-09-01 / 80.000 km | 89.000 km | mesma leitura já salva | attention-needed |
| Revisão básica | 2026-08-01 / 75.000 km | 100.000 km | mesma leitura já salva | up-to-date |

O checkpoint atual foi datado pelo relógio efetivo do runtime, exibindo 2026-10-06 nas capturas; não foi estimado a partir do cadastro ou das datas dos cuidados. Testes nativos usam datas/IDs fixos. Para reproduzir o smoke em outro dia, manter a ordem factual das datas e informar a leitura atual explicitamente; os estados dependem das quilometragens aprovadas, não de previsão temporal.

### Matriz executada

PASS indica critérios verificados pelo conjunto de UI real, testes nativos e inspeção de fonte; falhas de storage foram provocadas nos testes existentes com adapters determinísticos, não em dados do usuário.

| Contrato | Execução e prova | Resultado |
| --- | --- | --- |
| 4.1 Primeiro contato | Veículo válido sem cuidados; três itens, insuficiência e CTA útil. Percurso completo com “Não sei / não lembro”; continuação e conclusão aceitas. Testes de desconhecimento verificam ausência de escrita/fatos e preservação do histórico existente. Capturas 01–02. | PASS |
| 4.2 Histórico e referência | Três registros da tabela; leitura atual explícita somente quando necessária; origem usuário e marco exibidos; reload preservou fatos. Testes de onboarding/storage verificam `source: user`, vínculos e bytes do perfil. Capturas 03–04. | PASS |
| 4.3 Quatro estados | Insuficiência na 01; três estados completos na 04. Engine normativo 80.000→90.000: 88.999 em dia; 89.000 e 89.999 aproximação; 90.000 e além atenção. Teste dos três itens, intervalos curtos, limites seguros e oráculo inteiro. UI somente apresenta avaliação, sem repetir limiar/classificação. | PASS |
| 4.4 Prioridade | Arrefecimento atenção, óleo aproximação, revisão em dia na 04; insuficiência precedendo em dia após loop na 10. Testes cockpit cobrem atenção > aproximação > insuficiência > em dia e empates na ordem CARE_ITEMS. | PASS |
| 4.5 Loop com referência | Link contextual óleo; cuidado 2026-10-04 / 88.500 km, referência nova 98.500. Sucesso focável, retorno cockpit, óleo em dia, distância factual 9.500, referência antiga 90.000 não aplicada, leitura 89.000 preservada. Testes conferem novos IDs, histórico, vínculo e checkpoint ocorrido na data do cuidado. Capturas 07–08. | PASS |
| 4.5 Loop sem referência | Arrefecimento 2026-10-04 / 88.500, campo referência vazio. Novo marco insuficiente por referência ausente; nenhuma periodicidade inferida; reload preservou resultado e leitura 89.000. Capturas 09–10 e testes loop/engine. | PASS |
| 4.6 Retrospectivo | Óleo 2026-08-10 / 72.000, referência 82.000. Feedback retrospectivo; marco relevante 2026-10-04 / 88.500 e sua referência 98.500 preservados, assim como última leitura 89.000. Testes verificam histórico e seleção factual por ocorrência. Captura 11. | PASS |
| 4.7 Storage ausente/corrompido | Foundation, perfil, odômetro, referência, onboarding e cockpit: ausência tratada; JSON/schema/IDs/vínculos inválidos e leitura bloqueada retornam erro, sem sobrescrita ou conversão de corrupção em insuficiência. | PASS nativo |
| 4.7 Escrita/retry/duplicação | Falha em etapas de checkpoint/referência, persistência parcial, repetição do mesmo plano/IDs, exatamente um fato por entidade, callback de conclusão ausente antes do sucesso; duplo envio ignorado. Sem enfraquecer testes. | PASS nativo |
| 4.7 Veículo e rotas | Troca do perfil durante fluxo recusa conclusão/escrita no veículo errado; guardas de perfil/respostas preservadas. Care Item inválido exercitado na UI; teste adicional de item ausente/inválido prova retorno seguro e ausência de fatos nas três chaves. | PASS |
| Jornada anterior | Perguntas com perfil existente, objetivo manutenção preventiva e urgência baixa; Hero organiza respostas; cockpit exibe respostas reais, cuidados e ressalva de contexto. Testes preservam guardas, zero, escape e troca de veículo. Captura 12. | PASS |

### Auditoria de promessas

| Experiência/promessa relevante | Classificação final e fundamento |
| --- | --- |
| Cadastro local e respostas da sessão | Suportada: perfil persistido; respostas transitórias com guarda legada e aviso de reload. |
| Onboarding opcional/desconhecimento/continuar | Suportada: três itens, opção desconhecida sem inventar fatos, conclusão possível. |
| “Sei o histórico” / “Usar marco já salvo” | Suportada: registra fato passado ou reutiliza marco com campos protegidos; não edita histórico incidentalmente. |
| Referência conhecida opcional e origem usuário | Suportada: vínculo ao evento, source user, N>M, campo vazio válido; ajuda explicita que não é recomendação AutoPilot. |
| Leitura atual opcional quando necessária | Suportada: checkpoint explícito; cadastro/cuidado anterior não se tornam leitura atual automaticamente. |
| Estados, resumo e Next Actions | Suportada: engine único, orientação em relação à referência informada, desconhecimento exposto e alternativa de cuidado realizado. Estado não avalia saúde mecânica. |
| Distância em km | Suportada: diferença factual entre referência e última leitura, incluindo zero/excesso; sem previsão de data. |
| Registrar cuidado realizado | Suportada: formulário contextual, apenas fato passado, histórico preservado, novo checkpoint factual quando aplicável. |
| Novo marco / recálculo / retorno | Suportada: feedback diferencia novo marco relevante de histórico retrospectivo; não declara problema resolvido. |
| Erro, retry e ausência de duplicação | Suportada dentro da sessão/plano: preflight, falhas explícitas e callback somente após sucesso. Não promete transação entre chaves. |
| Capacidades futuras: diagnóstico, plano, aprendizado e dicas | Suportada como indisponibilidade: controles desabilitados, rótulos futuros; nenhuma dessas capacidades implementada. |
| Histórico futuro | Texto anterior ambíguo: dizia que registro de eventos era indisponível apesar do loop funcional. Corrigido para “Consulta completa do histórico ainda indisponível”; classificação final suportada. Timeline continua fora do escopo. |
| Entrada pela jornada anterior e Hero | Suportada: organiza respostas reais e contexto, sem diagnóstico/saúde artificial. |

Nenhuma promessa não suportada remanescente foi encontrada. A correção textual removeu a ambiguidade identificada sem criar capacidade nova.

### Desktop/mobile e fechamento da pendência 03.6

Desktop representativo capturado em largura aproximada de 1.265 px; três cards em colunas, evidências/ações legíveis. Onboarding, loop, resultado e jornada anterior exercitados. Mobile solicitado 390×844, com captura/área útil variando entre 375 e 390 px conforme scrollbar/backend: cards em coluna; onboarding e loop legíveis, sem sobreposição ou overflow horizontal observado; rolagem vertical normal permite acessar controles inferiores.

Estados têm texto explícito, além da cor. Erro de referência N<=M focou `loop-message`, manteve campos editáveis; corrigir os valores permitiu salvar. Tab a partir da mileage levou à referência; feedback de sucesso recebeu foco. Botões/link inferiores do loop foram capturados inteiros na 13 e “Voltar aos cuidados” foi acionado, retornando ao cockpit.

Capturas iniciais do backend mobile apresentaram recorte/composição incompleta; isso foi distinguido da aplicação pelas medidas DOM (largura/scrollWidth e retângulos de cards/controles), pela árvore acessível e por capturas posteriores. Os JSONs de layout e a captura 13 complementam as páginas longas 05–08, que podem ser reduzidas pelo visualizador. Nenhum CSS/produto foi alterado para contornar a ferramenta. Não houve erro/aviso no console coletado (`console.json`).

**Pendência visual da Missão 03.6 encerrada nesta execução**, com smoke efetivo desktop/mobile e evidência alternativa suficiente para as limitações de captura. Isto não é auditoria completa de acessibilidade nem certificação em todos os navegadores/dispositivos.

### Regressão e comandos

```powershell
node --test apps/autopilot-web/vehicle/*.test.mjs
Get-ChildItem apps/autopilot-web -Recurse -File -Include *.js,*.mjs | ForEach-Object { node --check $_.FullName }
git diff --check
git diff fdbcf782 -- apps/autopilot-web
```

Git executado com `-c safe.directory=C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI` neste ambiente. Suite final: **94 testes, 94 PASS, 0 falhas/skips/cancelados**, oito arquivos de teste; log integral em `native-tests.txt`. Suite inicial: 92 PASS; dois testes adicionados, nenhum removido. Sintaxe: **37 arquivos PASS**. Diff check: PASS; avisos de normalização LF/CRLF não são erros de whitespace. Inicialização e HTTP: 200 em `/`, care-cockpit, care-onboarding e care-loop contextual. O smoke de UI, não somente HTTP, confirmou execução da aplicação.

Verificação adicional `git diff fdbcf782 --check` encontrou apenas espaços finais de quebra Markdown nos cabeçalhos dos contratos já publicados da Sprint 3 (missões 03.1–03.7 e sprint-contract). Esses arquivos não foram alterados nesta missão. O diff de implementação acumulado (`git diff fdbcf782 --check -- apps/autopilot-web`) e o diff próprio da 03.7 estão limpos; não se removeu formatação dos contratos aprovados incidentalmente.

### Auditoria do diff acumulado

Inspecionados inventário e diff de `fdbcf782` (baseline final Sprint 2) até a árvore da 03.7, abrangendo modelos/storage, engine, onboarding, cockpit, loop, router/app, estilos, testes, contratos/relatórios/evidências. Scripts permanecem módulos JS/ESM, testes node:test e storage local existentes. Engine é a fonte da classificação; cockpit adiciona somente prioridade de apresentação e distância factual; schemas/contratos aceitos preservados. Exatamente engine-oil, cooling e basic-review.

Não encontrados diagnóstico mecânico, afirmação de saúde real, referências/intervalos inventados, fontes fabricante/AutoPilot, previsão de data, média de uso, GPS/background, OBD-II, notificações, backend/cloud, autenticação ou LLM/chatbot. Nenhuma dependência/framework, camada/arquitetura ou organização nova. Bootstrap/fontes já existentes não foram alterados. Capacidades futuras continuam explicitamente indisponíveis. Correções desta missão não alteram engine, schemas, estilos ou política.

## Decisões

### Correções mínimas autorizadas

1. **Referência retrospectiva inválida produzia plano impossível de repetir.** Reprodução antes da correção: preparação de evento anterior com mileage 70.000 e referência 70.000 retornava ok; save recusava. Como engine avalia o marco mais recente, a referência do evento anterior não passava pela mesma verificação na preparação. Handler manteria plano inválido com campos readonly, impedindo correção. Evidência `defect-before.txt` e teste novo inicialmente vermelho. Contrato 03.6 já exige N>M e recuperação coerente de erro; correção aplica essa mesma regra antes da criação do plano em `prepareCareOnboarding`. Não há nova política nem relaxamento de integridade. Teste cobre igualdade e referência inferior, ausência de plano/escrita; smoke mobile cobre erro editável e correção bem-sucedida; regressão integral verde.
2. **Promessa ambígua de histórico.** `CockpitScreen.js` agora distingue consulta completa futura do registro factual já disponível. Asserções na regressão da jornada exigem texto novo e recusam o anterior. Inspeção da UI/captura 12 confirmou o texto. Não adicionada timeline.
3. Adicionado teste de rota Care Loop com item ausente/inválido, sem alteração de comportamento de navegação; verifica ausência de escrita nas chaves de eventos, checkpoints e referências.

### Arquivos e evidências

Modificados somente quatro arquivos de aplicação/teste:

- `apps/autopilot-web/vehicle/careOnboarding.js` — guarda N>M antecipada.
- `apps/autopilot-web/screens/CockpitScreen.js` — texto de histórico futuro.
- `apps/autopilot-web/vehicle/careLoop.test.mjs` — regressão do plano retrospectivo inválido.
- `apps/autopilot-web/vehicle/vehicleJourney.test.mjs` — texto e segurança de rota.

Criados este relatório e a pasta `mission-03.7-evidence/`, com:

| Arquivo | Evidência |
| --- | --- |
| 01-insufficient-desktop.jpg | Três itens, desconhecimento e ação útil |
| 02-unknown-onboarding.jpg | Caminho desconhecido sem fatos inventados |
| 03-known-onboarding-desktop.jpg | Histórico/referência/leitura explícitos |
| 04-mixed-priority-reload-desktop.jpg | Três estados completos, prioridade, fontes e reload |
| 05-mixed-mobile.jpg | Cockpit mobile em coluna |
| 06-onboarding-mobile.jpg | Marco salvo, campos/ajuda/controles mobile |
| 07-loop-error-mobile.jpg | Erro N>M recuperável |
| 08-loop-success-mobile.jpg | Novo marco/referência, recálculo e confirmação |
| 09-loop-form-desktop.jpg | Loop contextual sem referência |
| 10-loop-no-reference-reload.jpg | Lacuna de referência após novo marco e reload |
| 11-retrospective-history.jpg | Retrospectivo preserva marco/última leitura |
| 12-existing-journey.jpg | Respostas reais e jornada anterior preservada |
| 13-mobile-loop-controls.jpg | Controles inferiores inteiros/acessíveis |
| mobile-*-layout.json | Geometria de cockpit, onboarding e loop/error, foco e ausência de overflow horizontal |
| console.json | Coleta de erros/avisos vazia |
| defect-before.txt | Reprodução nativa do defeito antes da correção |
| native-tests.txt | Resultado integral da regressão final |

### Riscos e limitações

- Storage permanece local por origem/dispositivo, sem transação entre chaves ou coordenação entre abas. Retry idempotente cobre mesmo plano na sessão; reload/saída durante falha parcial perde plano em memória, preservando fatos já gravados. Limitação já declarada na 03.4/03.6; não há promessa de atomicidade ou recuperação distribuída.
- Datas, quilometragem e referência informadas não atestam condição mecânica ou adequação técnica. Não há sensor/verificação externa nem recomendação automática.
- Registro retrospectivo pode não se tornar marco relevante. Sem timeline completa, edição/exclusão avançada ou expansão dos itens.
- Evidência visual cobre dois tamanhos representativos; captura mobile exige combinar screenshots, geometria e interação devido à composição variável da ferramenta.
- Aceite formal e encerramento da Sprint dependem de Tech Lead/PO. Nenhuma condição de parada de domínio, arquitetura, dependência, segurança ou escopo nova foi identificada; os defeitos encontrados foram resolvidos dentro dos contratos aceitos.

### Git, SHA publicado e handoff

HEAD pré-publicação: `e6a3c9a1efabf0c6f430452b4dafe59481ba4cf1`. Gates técnicos satisfeitos; preparado commit conjunto `test(vehicle-care): validate sprint 03 mvp` e push normal somente à branch autorizada. O estado remoto/árvore limpa deve ser confirmado no handoff após publicação; este arquivo não afirma push antes de executá-lo.

Para evitar SHA autorreferente, o SHA do commit publicado contendo este relatório é identificado de forma inequívoca por:

```powershell
git log -1 --format=%H -- docs/sprints/sprint-03/reports/mission-03.7-report.md
git rev-parse origin/feature/sprint-03-vehicle-care
git status --porcelain=v2 --branch
```

O handoff final fornece o SHA literal e confirma igualdade HEAD/upstream e árvore limpa. Nenhum merge de entrega, alteração em main, rebase/squash/force-push ou início de Sprint 4 realizado. Contrato permanece Approved até aceite, sem autopromoção a Completed.

## Recomendações

**Ready for Sprint Review.** Os quinze critérios técnicos do contrato estão cobertos pela matriz, regressão, auditoria de promessas/escopo e evidência desktop/mobile. As duas correções são mínimas, preservam as políticas existentes e não introduzem feature. A recomendação permite review e preparação de PR; não autoriza fechamento automático da Sprint ou merge.

Tech Lead deve revisar relatório, diff e evidências, especialmente recuperação de referência inválida e retry parcial. PO deve realizar aceite explícito da 03.7; depois Sprint Review focada no produto e decisão de entrega. PR/merge requer autorização explícita posterior. Recuperação entre reloads, concorrência, timeline e cobertura ampliada de dispositivos são temas futuros sujeitos a contrato próprio, não implementados aqui.
