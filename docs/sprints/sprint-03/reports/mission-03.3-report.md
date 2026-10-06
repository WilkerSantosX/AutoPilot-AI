# Relatório consolidado — Missão 03.3 — Care State Engine

Data: 2026-10-05 — America/Sao_Paulo. Governança: GOV.01.
Resultado técnico: **complemento autorizado implementado e validado para publicação/review**. Bloqueio por falta de política resolvido pelo contrato revisado. Aceite formal do PO pendente; missão não promovida a Completed pelo executor.

## Fatos

### Baselines, sincronizações e bloqueio histórico

- Baseline aceito da 03.2: `724cee9adba96e8ee4c92311086175d61b766728`, branch `feature/sprint-03-vehicle-care`.
- Primeira tentativa encontrou o contrato ausente e produziu relatório local de bloqueio, sem código, commit ou push.
- Após orientação do usuário, fetch/fast-forward alcançou `05f4d79e31da88a7bb2d01e1ffabf71d7634c782`, acrescentando somente o contrato Approved. Relatório local substituído com autorização explícita.
- A entrega parcial `c36ab3593ef20cfdd6aa79f66bc12ef3fb549f51` publicou infraestrutura, informação insuficiente, seleção factual e dez testes novos. Validação anterior: 51 PASS, sintaxe de 27 JS/MJS, HTTP e console. Parou antes de inventar periodicidades, conforme seção 6.3 da versão inicial.
- PO aprovou decisão complementar publicada em `ff38256fea9ee9845df0e4aad0ec0fdc802c9b6e`. Esta revisão altera somente `docs/sprints/sprint-03/missions/mission-03.3.md` e resolve expressamente o bloqueio.
- Retomada começou com árvore limpa no commit parcial. Fetch seguido de `git merge --ff-only ff38256fea9ee9845df0e4aad0ec0fdc802c9b6e` atualizou o checkout, sem merge commit ou reescrita. `git rev-parse HEAD` confirmou exatamente o SHA informado. Branch/upstream corretos e árvore limpa antes de editar.
- Operações de escrita de metadados Git usam permissão elevada porque .git é protegido pelo sandbox. Nenhuma alteração em main ou operação destrutiva foi executada.

### Leitura e inspeção dirigida

AGENTS.md, GOV.01, contrato da Sprint e missão revisada foram relidos. Missões/relatórios 03.1/03.2, ADRs, Project Bible disponível, Engineering Bible e APDL foram lidos nas etapas anteriores desta mesma missão; a sincronização desta retomada alterou somente o contrato 03.3. Relatório parcial e implementação foram relidos antes do complemento. Não foi identificado conflito novo aplicável. Foundation Recovery permanece parcial, sem recuperação incidental.

Inspeção das fundações confirmou:

- Care Events schema 1: fato performed, veículo/item, occurredAt, recordedAt e mileage opcional; nenhuma periodicidade.
- Checkpoints schema 1: quilometragem factual e seleção temporal por occurredAt, recordedAt e ID.
- VehicleProfile schema 1: mileage sem data factual específica dessa leitura; seus metadados não são checkpoints.
- Storage permanece intacto. Loaders retornam ok/error; corrupção não deve ser tratada como histórico vazio pelo chamador.
- O módulo parcial era puro, sem relógio, storage, UI ou dependências novas. O complemento mantém esse limite.

### Decisão complementar aprovada

Seções 3.1 e 6.3–6.9 da revisão aprovada definem Care State como **acompanhamento em relação a referência conhecida**, nunca condição mecânica. A referência pontual nextDueMileage é explicitamente informada pelo usuário, origem user, maior que a quilometragem do marco factual. Atenção em breve corresponde aos 10% finais desse intervalo. Nenhuma periodicidade por fabricante, inferência de próximo ciclo ou estimativa temporal foi autorizada.

### Arquivos e diff

A missão como um todo criou careStateEngine.js, careStateEngine.test.mjs e este relatório no commit parcial. Nesta continuação, **nenhum arquivo novo foi criado**; apenas estes três arquivos foram modificados:

- `apps/autopilot-web/vehicle/careStateEngine.js`: referência explícita validada, política versionada, cálculo e classificação dos quatro estados, ações e lacunas.
- `apps/autopilot-web/vehicle/careStateEngine.test.mjs`: atualização dos testes de lacuna e sete testes complementares; 17 testes focados no total.
- `docs/sprints/sprint-03/reports/mission-03.3-report.md`: consolidação do histórico, decisão, implementação, validação e limites.

Revisão própria confirmou escopo somente nesses arquivos. Não houve modificação de schemas, storage, telas, sessão, dependências, documentos estratégicos ou arquitetura.

### Critérios de aceite atuais — item a item

| Item | Resultado/evidência |
|---|---|
| 1 — Quatro estados explícitos | PASS: CARE_STATES e isCareState, somente os identificadores aprovados. |
| 2 — Avaliação determinística por veículo/item | PASS: função pura e identidade explícita no resultado. |
| 3 — Insuficiência honesta | PASS: ausência de marco, mileage do marco, referência ou leitura suficiente não gera certeza artificial. |
| 4 — Referência user produz três estados | PASS: exemplo normativo completo nos três Care Items, com referência preservada. |
| 5 — 10% finais | PASS: limiar inteiro matematicamente equivalente ao ceil do limiar racional; testes de fronteira e oracle BigInt. |
| 6 — Referência atingida | PASS: 90000/91000 produzem attention-needed; ação relativa à referência, sem diagnóstico. |
| 7 — Origem preservada | PASS: evidence.reference.source user; manufacturer/autopilot recusados como fontes ativas. |
| 8 — Fatos determinísticos | PASS: eventos do veículo/item correto e getLatestOdometerCheckpoint da 03.2; occurredAt é a data factual. |
| 9 — Independência da inserção | PASS: permutações de eventos/checkpoints, empates e novo marco. |
| 10 — Sem periodicidade futura | PASS: referência vinculada ao ID do marco; novo marco não herda referência anterior. |
| 11 — Next Action | PASS: obter dado faltante, atualizar km, acompanhar, preparar-se ou agir/registrar após cuidado. |
| 12 — Inválidos seguros | PASS: ok false/evaluation null para dados malformados, duplicidades, vínculo/origem inválidos e referência <= marco. |
| 13 — Compatibilidade 03.1/03.2 | PASS: contratos intactos, teste integrado de avaliação com referência preserva objetos e bytes de perfil/eventos/checkpoints. |
| 14 — Testes/regressão | PASS: 58 testes no total, zero falhas/skips/cancelamentos; 27 JS/MJS com sintaxe válida. |
| 15 — Sem 03.4+ | PASS: nenhum formulário, onboarding, cockpit, CTA, loop ou automação. |

### Validação executada

```powershell
node --test apps/autopilot-web/vehicle/*.test.mjs
Get-ChildItem apps/autopilot-web -Recurse -Include *.js,*.mjs | ForEach-Object { node --check $_.FullName }
git -c safe.directory=C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI diff --check
python -u -m http.server 18770 --bind 127.0.0.1 --directory apps/autopilot-web
```

- Inventário de testes confirmou cinco arquivos .test.mjs; toda a suíte disponível foi executada. Resultado final: 58 PASS = 41 testes anteriores à missão + 17 testes do engine. Duas rodadas verdes; a última após ampliar a integração de preservação para avaliação com referência completa.
- Sintaxe validada nos 27 arquivos JS/MJS; rotina verifica código de saída de cada arquivo.
- Cobertos 88999/89000/89999/90000/91000, referência <= marco, origem inválida, valores negativos/fracionários/strings/não finitos/inseguros, zero, intervalos 1/9/11/10001 e limites próximos a Number.MAX_SAFE_INTEGER.
- BigInt é usado somente no teste como oracle independente do arredondamento; não adiciona dependência. Avaliação de produção usa Number e aritmética segura.
- Histórico sem referência não permite classificação. Sem mileage do marco, solicita essa informação; sem leitura factual suficiente, update-mileage. Leitura anterior ao marco e mileage inferior ao marco não são usadas para declarar acompanhamento atual.
- HTTP 200 via Invoke-WebRequest para `/`, `/vehicle/careStateEngine.js`, `/vehicle/careModel.js` e `/vehicle/odometerModel.js`.
- In-app Browser carregou landing AutoPilot AI com texto e botão Iniciar minha jornada. Console: `tab.dev.logs({levels:['warn','error'],limit:50})` retornou `[]`.
- Aba de validação e servidor encerrados. Exit code 1 do servidor corresponde a Ctrl+C intencional.
- F01/favicon 404 continua pendência histórica; nenhum 404 apareceu no trecho de log desta rodada. Não foi corrigido e não se afirma sua resolução.
- Diff revisado para escopo e whitespace antes do commit, incluindo revisão do stage.

## Decisões

### Representação da referência e origem

`evaluateCareItem` recebe adicionalmente `reference`, ausente/null quando desconhecida. Quando presente, contém:

```javascript
{
    vehicleId: "vehicle-1",
    careItemId: "engine-oil",
    careEventId: "care-1",
    nextDueMileage: 90000,
    source: "user"
}
```

isCareReference exige identidades válidas, Care Item suportado, source user e inteiro seguro não negativo. A avaliação confere veículo/item e exige nextDueMileage > mileage do marco correspondente. Valores iguais/inferiores geram erro explícito, sem estado. Objeto parcial malformado é inválido; ausência/null da referência significa informação insuficiente. Nenhuma origem futura foi ativada.

O vínculo careEventId evita reutilizar uma referência pontual para novo ciclo. O evento mais recente continua selecionado por occurredAt, recordedAt e ID lexical. Se a referência pertencer a outro marco, care-reference permanece lacuna; não se altera seu valor ou infere periodicidade. Referências de outro veículo/item são recusadas explicitamente. Dados de evidência são cópias e não mutam objetos de entrada.

Não foi criado storage de referências ou modificado Care Event/VehicleProfile. O chamador fornece a referência explicitamente; persistência e aquisição por UI exigem missão própria. Isso atende a representação autorizada sem expandir os contratos existentes.

### Política e arredondamento

CARE_STATE_POLICY identifica `user-next-due-mileage`, versão 1. Origem/justificativa: revisão aprovada no commit ff38256, seções 6.3–6.5; a constante versiona a regra de acompanhamento e não um intervalo universal de manutenção.

Para inteiros seguros não negativos, com N = nextDueMileage e M = milestoneMileage:

```text
intervalMileage = N - M
attentionWindowMileage = floor(intervalMileage / 10)
dueSoonThreshold = N - attentionWindowMileage
```

Esse limiar equivale exatamente a ceil(N - (N - M)/10), primeiro inteiro situado nos 10% finais. Evita multiplicar quilometragens por 9/10 ou usar limites fracionários em comparação. A janela inteira representa o número de posições inteiras anteriores a N nessa faixa, não uma periodicidade futura.

- Intervalo 10000: faixa inteira 1000, limiar 89000 no exemplo 80000→90000.
- Intervalo 10001: faixa inteira 1000; 40000→50001 entra em due-soon aos 49001, não aos 49000.
- Intervalo inferior a 10: nenhum inteiro antes de N pertence aos 10% finais; acompanhamento passa diretamente de up-to-date a attention-needed. Não se alarga artificialmente a faixa para 1 km.
- Valores safe integer foram exercitados contra oracle racional BigInt no teste; não há multiplicação insegura no engine.

Classificação com fatos completos: currentMileage abaixo do limiar → up-to-date; no limiar até N exclusivo → due-soon; em N ou acima → attention-needed.

### Evidência, lacunas e Next Action

Resultado preserva veículo/item, state, missingInformation, nextAction e evidence com Care Event, Odometer Checkpoint, referência/origem, política/versionamento e calculation. calculation contém M, N, currentMileage, intervalo, janela inteira e limiar; é null quando falta informação. Não representa observação mecânica ou estimativa.

Lacunas são ordenadas deterministicamente: care-history; milestone-mileage quando há evento sem mileage; care-reference quando ausente ou vinculada a outro marco; odometer-checkpoint quando ausente ou insuficiente para posicionar o marco. A ação trata a primeira lacuna e a lista preserva as demais.

| Estado/lacuna | Next Action |
|---|---|
| Histórico desconhecido | provide-information/care-history; alternativa record-performed-care para fato realizado. |
| Mileage do marco desconhecida | provide-information/milestone-mileage. |
| Próxima referência desconhecida/desatualizada | provide-information/care-reference. |
| Leitura atual ausente/insuficiente | update-mileage. |
| up-to-date | monitor. |
| due-soon | prepare-for-reference. |
| attention-needed | act-on-reference; afterCare record-performed-care. |

A leitura selecionada deve ocorrer no marco ou depois dele e não possuir mileage inferior ao marco para posicionar esse acompanhamento. Caso contrário, informação insuficiente/update-mileage conserva os fatos sem diagnóstico, estimativa ou descarte de histórico. Não se usa mileage do evento/perfil como leitura atual substituta. Nenhum prazo por calendário ou previsão é calculado.

### Git e publicação

Continuação e relatório consolidados preparados para commit conjunto `feat(vehicle-care): complete care state policy evaluation`, conforme seção 10, exclusivamente em feature/sprint-03-vehicle-care.

HEAD antes deste commit: `ff38256fea9ee9845df0e4aad0ec0fdc802c9b6e`. Para evitar SHA autorreferente, o SHA exato que contém a consolidação é obtido por:

```powershell
git log -1 --format=%H -- docs/sprints/sprint-03/reports/mission-03.3-report.md
```

Este arquivo registra o estado antes da própria publicação. O handoff final informa SHA literal, resultado do push e verificação de árvore limpa/upstream. Nenhum push é afirmado antecipadamente. Não houve merge de PR, alteração em main, merge commit, rebase, squash, force-push ou reescrita de histórico.

### Riscos, limitações e pendências

- Referência é fornecida pelo usuário e o engine não valida adequação técnica de manutenção. Estado acompanha essa referência; não afirma condição mecânica.
- Referência não é persistida nesta missão, e não há UI consumindo a avaliação. Persistência atual e schemas continuam intactos; nenhuma migração foi criada.
- Registros dependem da informação factual fornecida. Datas seguem validadores existentes/Date.parse; não foi introduzida política de calendário, datas futuras, adulteração/rollover ou desempate automotivo excepcional.
- O chamador deve conferir ok dos loaders antes de fornecer arrays; corrupção não deve ser mascarada como ausência. Nenhuma orquestração nova foi criada.
- Storage foi exercitado em memória nos testes de preservação. Navegador validou inicialização/console; classificação e fronteiras foram verificadas na suíte nativa, pois não há interface do engine autorizada.
- Aceite formal e fechamento dependem de review do Tech Lead e PO. Nenhum novo bloqueio de domínio foi observado na execução do complemento autorizado.

**Limites respeitados: sem inferência de periodicidade futura, estimativa, diagnóstico, fontes fabricante/AutoPilot ativas, notificações, GPS, OBD, backend, dependências novas, Care Onboarding, alterações de cockpit ou Care Loop. Missão 03.4 não iniciada.**

## Recomendações — não executadas

Tech Lead deve revisar a referência vinculada ao marco e a equivalência matemática do limiar inteiro; PO deve aceitar a entrega pelo gate GOV.01. Aquisição/persistência da referência e integração com experiência visual permanecem trabalho de missões próprias, apenas após autorização explícita. Nenhuma recomendação foi implementada incidentalmente.
