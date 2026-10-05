# Relatório — Missão 03.6 — Care Loop

Data: 2026-10-05, America/Sao_Paulo. GOV.01.
Resultado técnico: implementação e validações previstas concluídas para publicação/review. Aceite explícito do PO pendente. Missão 03.7 não iniciada.

## Fatos

### Baseline e inspeção dirigida

- Branch feature/sprint-03-vehicle-care, árvore inicialmente limpa, HEAD aceito da 03.5 `4e12c18de6f18a534f19e583e386bc7a7d2ad4e0`.
- Fetch encontrou `b41f2e3f11958139cddc720cdf980e32468fc671`. Sincronizado por merge --ff-only para esse commit, sem merge commit ou reescrita. rev-parse HEAD e status confirmaram baseline exato e árvore limpa antes de alterar código.
- O commit acrescenta exclusivamente mission-03.6.md Approved; código aceito da 03.5 permanece base da implementação.
- Lidos contrato 03.6 e GOV.01; AGENTS.md, ADRs, Project Bible disponível, Engineering Bible, APDL, sprint-contract, Missões 03.1–03.5 e seus relatórios foram consultados nesta conversa. Nenhuma mudança nesses documentos na sincronização, nenhum conflito aplicável identificado.
- Inspecionados cockpit/router/onboarding, preparação e gravação de planos, careModel/careStorage, careReferenceStorage, odometerModel/storage, seleção e política do careStateEngine.
- Engine seleciona Care Event por occurredAt, depois recordedAt e ID; referência pertence ao evento, não ao Care Item genericamente. loadCareOnboarding seleciona pelo engine e recupera somente a referência desse marco. Assim o novo marco não herda referência antiga.
- A gravação já existente preserva histórico, verifica conflitos e repete o mesmo plano sem duplicar identidades após escrita parcial. Não foi necessária transação, dependência, framework, schema novo ou alteração incompatível.

### Arquivos e diff

Criados:

- `apps/autopilot-web/vehicle/careLoop.js`: preparação do novo evento e checkpoint factual, reuso de leitura equivalente e delegação de gravação.
- `apps/autopilot-web/screens/CareLoopScreen.js`: formulário contextual e handlers com guarda do veículo, validação, retry e conclusão única.
- `apps/autopilot-web/vehicle/careLoop.test.mjs`: dez testes focados, inclusive handler com falha parcial, troca de veículo e reenvio.
- Este relatório e quatro capturas em mission-03.6-evidence: form.jpg, with-reference.jpg, without-reference-reload.jpg e existing-journey.jpg.

Modificados:

- app.js: aceita care-loop no entrypoint existente.
- router.js: rota contextual por item aprovado, guarda de perfil/item, retorno ao cockpit com feedback focável e URL de cockpit para reload.
- screens/careCockpitContent.js: ação por Care Item e linguagem agora coerente com registro realizado disponível.
- vehicle/careCockpit.test.mjs: expectativa textual atualizada para capacidade autorizada nesta missão, sem remover cobertura.

Modelos, schemas, engine e storages 03.1–03.5 não foram alterados. Não foi criado CSS/framework novo; formulário usa padrões existentes. Diff de integração nos quatro arquivos existentes é pequeno, módulos novos específicos ao loop. Novos arquivos também revisados.

### Critérios de aceite

| Item | Resultado/evidência |
|---|---|
| 1 — Início pelo cockpit | PASS: link por item leva ao formulário correto; smoke óleo/arrefecimento/revisão. |
| 2 — Fato realizado | PASS: linguagem factual, data obrigatória, rejeição de data futura; teste e UI. |
| 3 — Novo evento/histórico | PASS: novo ID performed, evento antigo preservado; teste com ambos os eventos. |
| 4 — Quilometragem factual | PASS: checkpoint na data do cuidado, zero válido, mileage opcional e reuso de equivalente. |
| 5 — Referência opcional | PASS: user, N>M e vínculo ao novo Care Event; teste e smoke. |
| 6 — Referência antiga | PASS: permanece histórica, não selecionada para marco novo; teste e UI. |
| 7 — Sem inferência | PASS: referência em branco permanece null, nenhum intervalo reaproveitado. |
| 8 — Recálculo | PASS: delega ao loader/engine existentes e renderiza cockpit novamente. |
| 9 — Sem nova referência | PASS: novo arrefecimento pede referência conhecida, sem aplicar os 89000 antigos. |
| 10 — Retrospectivo | PASS: cuidado em 2026-10-04/88500 mantém leitura de 2026-10-05/89000; teste com leitura posterior 95000 também. |
| 11 — Retry/falha parcial | PASS: quota em checkpoint/referência retorna erro; mesmo plano completa sem duplicar; handler só chama conclusão após sucesso, reenvio bloqueado. |
| 12 — Reload | PASS: cockpit recarregado mantém novo marco e estado; teste de reconstrução de storage e smoke real. |
| 13 — Regressão de experiência | PASS: onboarding recuperou marco/referência novos e jornada completa chegou ao cockpit com respostas. |
| 14 — Suíte | PASS: 92 testes, 82 anteriores e dez novos; sintaxe 37 arquivos. |
| 15 — Limites | PASS: sem timeline, edição/exclusão, política inferida, diagnóstico, previsão, novas dependências ou trabalho da 03.7. |

### Testes e validações

```powershell
node --test apps/autopilot-web/vehicle/*.test.mjs
Get-ChildItem apps/autopilot-web -Recurse -Include *.js,*.mjs | ForEach-Object { node --check $_.FullName }
git -c safe.directory=C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI diff --check
python -u -m http.server 18772 --bind 127.0.0.1 --directory apps/autopilot-web
```

- Suíte final **92 PASS**, zero falhas/skips/cancelamentos. Sintaxe **37 JS/MJS PASS**, conferindo código de saída por arquivo.
- Testes: evento/item/veículo, preservação, engine, referência vinculada/user, sem inferência, zero/desconhecido, retrospectivo relevante e anterior ao marco, checkpoint equivalente, perfil intacto, isolamento, data futura/números inválidos/N<=M/redução, quota parcial/retry, corrupção, reload, coerência evento/checkpoint, escape de HTML, troca de veículo e submissão concluída duplicada.
- git diff --check sem apontamentos. Avisos LF→CRLF não alteram semântica. Revisão de diff e fontes novas sem vazamento de escopo.
- HTTP 200 em `/`, `/screens/CareLoopScreen.js` e `/vehicle/careLoop.js`; aplicação servida pelo workflow existente.
- Console durante o loop, após reload e no final: consulta de warn/error retornou `[]`.
- Controle de navegador sofreu timeout durante verificações adicionais; nova aba no mesmo navegador recuperou a sessão sem repetir registros. Não foi identificado erro da aplicação relacionado ao timeout.
- Tentativa adicional de captura mobile apresentou inconsistência entre viewport/DOM e bitmap do controlador. Capturas parciais descartadas; não se afirma validação visual mobile nesta missão. Desktop e todos os smoke tests obrigatórios do contrato foram concluídos. Estilos existentes não foram alterados.
- Abas temporárias fechadas, viewport restaurado, servidor encerrado por Ctrl+C (exit 1 intencional).
- F01/favicon e Foundation Recovery permanecem pendências históricas, sem correção incidental. Nenhum novo erro de console observado.

### Smoke tests

Dados sintéticos já existentes da validação 03.5 em localhost:18772: Toyota Corolla 2020/2.0/Flex; leitura factual 89000 em 2026-10-05.

| Cenário | Resultado |
|---|---|
| Entrada contextual | Óleo pelo cockpit abriu Registrar Óleo do motor; arrefecimento e revisão também abriram seus contextos, sem seletor genérico. |
| Com nova referência | Óleo realizado em 2026-10-04/88500, referência explicitamente informada 98500. Sucesso retornou ao cockpit com feedback focado. Novo marco exibido, estado Dentro da referência, 9500 km factuais restantes. form.jpg e with-reference.jpg. |
| Retrospectivo | Nova ocorrência anterior ao checkpoint de 2026-10-05: leitura mais recente permaneceu 89000; mileage do cuidado ficou histórico, sem regredir contexto. |
| Sem nova referência | Arrefecimento realizado em 2026-10-04/88500, referência vazia. Cockpit pediu próxima referência; valor antigo 89000 deixou de governar o novo marco. |
| Reload | Reload na URL do cockpit manteve novos marcos/referência do óleo e insuficiência do arrefecimento; without-reference-reload.jpg. |
| Data futura | Revisão com 2027-01-01 recusada com mensagem focada; nenhum registro confirmado. |
| Onboarding | Reentrada e Usar marco já salvo recuperaram óleo 2026-10-04/88500/98500, sem pedir leitura atual já adequada. |
| Jornada anterior | Landing → perguntas → manutenção preventiva → urgência baixa → Hero → cockpit com respostas da sessão e dados do loop; existing-journey.jpg. |

Falhas de quota/corrupção foram simuladas na suíte nativa, sem injeção ou alteração direta de storage no navegador. Capturas mostram somente localhost e dados sintéticos; rótulo do link foi refinado depois da captura inicial para Registrar cuidado realizado: <item>.

## Decisões

### Fluxo, fato e referência

- Formulário recebe Care Item da ação no cockpit e perfil ativo validado. Mantém só data, mileage opcional e referência opcional. Campos vazios não viram zero.
- Data futura recusada porque o registro descreve algo já realizado; sem agenda ou política temporal nova no engine. Datas seguem validadores existentes.
- prepareCareLoop chama prepareCareOnboarding com knowledge known, sem careEventId e sem currentMileage: sempre prepara novo evento; não edita antigo e não copia referência anterior.
- Referência opcional habilita com mileage conhecida, requer N>M, usa source user e novo careEventId. Quando ausente, o loader/engine informa lacuna do novo marco, não infere intervalo.
- Marco relevante continua determinado pelo engine. Se registro for anterior ao marco já conhecido, grava-se histórico e feedback informa que o marco mais recente foi preservado; não promete novo marco relevante artificialmente.

### Checkpoints e preservação

- Mileage conhecida produz checkpoint com occurredAt do cuidado e recordedAt do registro, usando createOdometerCheckpoint. Não transforma cuidado retrospectivo em leitura de agora.
- Reutiliza checkpoint existente do mesmo veículo com instante factual e mileage iguais, mantendo sua identidade/metadados. Eventos de dois cuidados podem referir o mesmo fato de odômetro sem duplicá-lo.
- Quando cuidado está no mesmo instante ou depois da leitura mais recente, mileage inferior é recusada antes de escrever. Histórico anterior pode conter leitura menor sem substituir a mais recente; seleção permanece a da 03.2.
- VehicleProfile não recebe atualização silenciosa. Cockpit continua distinguindo cadastro e última leitura factual, preservando os contratos aceitos.

### Retry, falha parcial e retorno

- saveCareLoop confere coerência factual entre evento/checkpoint e delega saveCareOnboarding. Este faz preflight de vínculo/conflitos e grava evento, checkpoint e referência em chaves separadas.
- Plano é gerado uma vez por submissão válida e mantido no handler. Persistência parcial retorna erro, não chama conclusão. Campos ficam somente leitura para repetir o mesmo plano, IDs e valores; storages reconhecem fatos já salvos e não duplicam.
- Após sucesso, completed/submit impedem nova submissão. Guarda do perfil antes de salvar impede registrar em contexto que mudou; teste exercita essa troca.
- Não há rollback/transação nova. Sair/recarregar durante falha perde o plano em memória, mas preserva fatos já gravados; esta limitação segue estratégia da 03.4 e fica explícita, sem prometer atomicidade.
- Sucesso usa avaliação recarregada do engine; router volta ao cockpit, insere confirmação textual por DOM/textContent, focável e com role status. URL passa ao cockpit via replaceState, sem substituir histórico Git, evitando reload que reabra formulário de registro. Estado derivado nunca é persistido.

### Git e handoff

HEAD pré-publicação: `b41f2e3f11958139cddc720cdf980e32468fc671`. Implementação, relatório e capturas preparados para commit conjunto `feat(vehicle-care): close the care loop`, após validação, e push normal à branch autorizada.

Para evitar SHA autorreferente, o commit contendo este relatório é resolvido por:

```powershell
git log -1 --format=%H -- docs/sprints/sprint-03/reports/mission-03.6-report.md
```

O handoff final confirma SHA literal, push e árvore limpa/upstream. Este relatório registra o estado pré-publicação, sem afirmar push antecipadamente. Sem alteração em main, merge de PR, merge commit, rebase, squash, force-push ou reescrita de histórico.

### Riscos, limitações e pendências

- Persistência local por origem/dispositivo, sem transação entre chaves ou coordenação entre abas. Retry cobre o mesmo plano na sessão; não cobre concorrência distribuída ou reload no meio de falha parcial.
- Data/mileage/referência são informadas pelo usuário, não validam condição mecânica ou adequação da próxima referência.
- Registro retrospectivo pode não tornar-se marco relevante; ordenação do engine permanece a fonte de verdade. Não há timeline completa ou edição/exclusão.
- DOM foi exercitado em desktop; mobile adicional não foi visualmente certificado devido à limitação da captura, sem alterar CSS global para contorná-la.
- Aceite formal requer review do Tech Lead e decisão explícita do PO. Nenhuma condição de parada de domínio/arquitetura foi identificada.

**Sem referência inferida, reaproveitamento automático do intervalo, diagnóstico, alegação de saúde, previsão de data, estimativa de uso, expansão de Care Items, novos schemas/dependências/arquitetura, backend ou capacidades fora do contrato. Missão 03.7 não iniciada.**

## Recomendações — não executadas

Tech Lead deve revisar vínculo do novo marco/referência, tratamento de retry parcial e semântica de checkpoint retrospectivo; PO deve aceitar pelo gate GOV.01. Concorrência, recuperação do plano após reload e timeline dependem de escopo específico. Nenhuma dessas recomendações foi implementada incidentalmente.
