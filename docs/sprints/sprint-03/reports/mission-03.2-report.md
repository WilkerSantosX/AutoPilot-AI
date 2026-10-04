# Relatório de execução — Missão 03.2

Data: 2026-10-04 — America/Sao_Paulo. Governança: GOV.01.
Resultado técnico: implementação validada para publicação/review. Aceite explícito do Tech Lead pendente; contrato não promovido a Completed.

## Fatos

### Estado inicial e baseline

- Branch ativa: `feature/sprint-03-vehicle-care`, árvore limpa, HEAD inicial `8c3560e3a3b4561b0da3a6962857d80030c79b71`, baseline aceito da 03.1.
- A missão ainda não existia no checkout inicial. Fetch de origin confirmou o commit `0f979c130706d28aacb2512b431a62ab3da18ead`, filho direto do baseline, adicionando exclusivamente `missions/mission-03.2.md` Approved.
- Atualização por `git merge --ff-only origin/feature/sprint-03-vehicle-care`, sem merge commit, reescrita de histórico ou mudança em main. HEAD de implementação: `0f979c130706d28aacb2512b431a62ab3da18ead`, missão presente e árvore limpa antes do código.
- Reutilizado o checkout existente; não foram criados worktrees, dependências, frameworks ou novas camadas.

### Inspeção dirigida

Consultados AGENTS.md, GOV.01, contrato da Sprint 3, missão/relatório 03.1 e missão 03.2. A leitura de ADRs, Project Bible/histórico disponível, Engineering Bible e APDL foi realizada nesta conversa durante a 03.1; a atualização remota desta rodada alterou somente o contrato da missão 03.2. Nenhum conflito aplicável foi identificado. Foundation Recovery permanece parcial, conforme documentação existente, sem expansão incidental.

Inspecionados `vehicleModel.js`, `vehicleValidator.js`, `vehicleStorage.js`, cadastro/cockpit e testes existentes, além de `careModel.js`, `careStorage.js` e testes da 03.1.

- VehicleProfile schema 1 contém mileage obrigatório, createdAt/updatedAt de criação/atualização do perfil; não contém data específica da leitura de mileage.
- Cadastro normaliza números/textos e persiste um perfil único. Cockpit exibe quilometragem informada; não há rotina de atualização contínua da quilometragem.
- Vehicle Care usa histórico JSON versionado por veículo, resultado explícito ok/error, storage injetável, lista vazia segura e rejeição de corrupção/duplicidade sem sobrescrita.
- Stack e testes: JavaScript ES Modules, localStorage, node:test/node:assert. Não foi necessária alteração de contrato existente ou decisão arquitetural adicional.

### Arquivos criados e resumo do diff

1. `apps/autopilot-web/vehicle/odometerModel.js`: checkpoint factual, validação, seleção temporal determinística e preparação explícita de perfil compatível.
2. `apps/autopilot-web/vehicle/odometerStorage.js`: persistência de múltiplos checkpoints por veículo, isolada dos dados anteriores.
3. `apps/autopilot-web/vehicle/odometerCheckpoint.test.mjs`: 13 testes novos.
4. `docs/sprints/sprint-03/reports/mission-03.2-report.md`: este relatório.

Nenhum arquivo anterior foi modificado. Revisão própria confirmou diff restrito à missão, sem UI, cockpit, estado da sessão, mudanças no schema VehicleProfile ou Care Events.

### Critérios de aceite

| Critério | Resultado / evidência |
|---|---|
| 1 — Checkpoint explícito | PASS: modelo com id, vehicleId, mileage, occurredAt, recordedAt e schemaVersion 1. |
| 2 — Associação ao veículo | PASS: ID obrigatório e conferência do vínculo de todos os registros na leitura/seleção. |
| 3 — Zero e valores inválidos | PASS: inteiro seguro não negativo; testes de zero, negativos, fracionários, strings, ausência, booleano, NaN, Infinity e número inseguro. |
| 4 — Múltiplos checkpoints persistidos | PASS: append/recuperação de registros; rejeição de duplicidade e corrupção sem sobrescrever bytes. |
| 5 — Isolamento | PASS: testes com dois veículos, incluindo mesmo ID de checkpoint em veículos distintos e veículo sem histórico. |
| 6 — Ausência segura | PASS: ok true/checkpoints []; seleção retorna checkpoint null, sem fabricar leitura. |
| 7 — Retrospectivos | PASS: registro antigo inserido depois permanece no histórico e não substitui o mais recente por occurredAt. |
| 8 — Leitura mais recente determinística | PASS: occurredAt, depois recordedAt, depois ID; independente da ordem de inserção, sem mutar lista. |
| 9 — VehicleProfile compatível | PASS: gravação de checkpoint preserva bytes anteriores; preparação mantém schema/campos e gravação existente recupera o novo mileage. Redução é recusada. |
| 10 — Care Events preservados | PASS: bytes e recuperação de evento intactos após gravação de checkpoint e atualização explícita do perfil; suíte 03.1 verde. |
| 11 — Fonte factual | PASS: valor exigido explicitamente, sem cálculo/estimativa ou origem automática; datas de leitura e registro distintas. |
| 12 — Testes/regressão | PASS: 41 testes, 13 novos + 28 existentes; sintaxe de 25 JS/MJS válida. |
| 13 — Sem antecipação 03.3+ | PASS: diff limitado à memória factual, seleção temporal e preparação compatível do perfil. |

### Testes e validação

```powershell
node --test apps/autopilot-web/vehicle/*.test.mjs
Get-ChildItem apps/autopilot-web -Recurse -Include *.js,*.mjs | ForEach-Object { node --check $_.FullName }
git -c safe.directory=C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI diff --check
python -u -m http.server 18770 --bind 127.0.0.1 --directory apps/autopilot-web
```

- Resultado final: 41 PASS, zero falhas, skips ou cancelamentos. Sintaxe de todos os 25 JS/MJS aprovada. Diff/whitespace revisados.
- Primeira rodada teve 40 PASS/1 FAIL por fixture que reutilizava indevidamente o mesmo ID para duas leituras; a validação rejeitou corretamente o histórico duplicado. Corrigido somente o ID da fixture retrospectiva e executada novamente a suíte completa, com 41 PASS.
- Cobertos modelo, limites numéricos, datas/IDs/versão inválidos, ausência, isolamento, múltiplas leituras, duplicidade, corrupção, quota/leitura/getter global bloqueados, ordem retrospectiva, empates temporais, preparação do perfil, zero e preservação dos dados anteriores.
- Servidor iniciado com Python já disponível no runtime; HTTP 200 para `/`, `/vehicle/odometerModel.js` e `/vehicle/odometerStorage.js`, por Invoke-WebRequest.
- Codex In-app Browser abriu landing AutoPilot AI e CTA Iniciar minha jornada. `tab.dev.logs({levels:['warn','error'],limit:50})` retornou `[]`.
- Log HTTP confirmou `/favicon.ico` 404 (F01 preexistente da Sprint 2); não houve correção incidental. Recursos locais da landing responderam 200.
- Servidor e aba temporários encerrados após validação.

## Decisões

### Modelo, persistência e temporalidade

- Domínio novo permanece no diretório vehicle existente. Dois módulos pequenos e específicos; nenhuma extração genérica ou migração de dados antigos.
- occurredAt é o momento informado da leitura; recordedAt é o instante do registro, injetável para testes. Nenhuma data de leitura é criada a partir do perfil ou de Care Event.
- mileage exige Number.isSafeInteger e valor >= 0, sem coerção de string ou default zero. IDs seguem crypto.randomUUID com fallback já usado no projeto; datas seguem Date.parse dos padrões atuais.
- Chave `autopilot.odometer-checkpoints.v1:<vehicleId>` e envelope `{schemaVersion: 1, vehicleId, checkpoints}`. Histórico persistido mantém ordem de registro; fatos retrospectivos são aceitos.
- `getLatestOdometerCheckpoint(checkpoints, vehicleId)` valida a lista inteira e seleciona maior occurredAt; empates usam recordedAt, depois comparação lexical de ID. O desempate é convenção técnica estável, sem alegar superioridade factual entre leituras simultâneas. A lista original não é alterada.
- IDs duplicados no mesmo veículo, corrupção, versão desconhecida e vínculo incorreto geram erro com lista vazia; não são tratados como histórico ausente e não permitem sobrescrita. Falhas de storage retornam erro recuperável.

### Relação checkpoint ↔ VehicleProfile.mileage

Escolhida **preparação explícita, sem sincronização automática**. `saveOdometerCheckpoint` escreve apenas o histórico. `prepareVehicleProfileMileage(profile, checkpoints, {now})` seleciona o checkpoint mais recente do veículo e retorna uma cópia compatível do perfil. O chamador pode então gravá-la com `saveVehicleProfile` existente. O teste de integração executa esse caminho completo.

- Sem histórico, retorna cópia inalterada do perfil.
- Histórico inválido/de outro veículo ou data de atualização inválida/anterior ao updatedAt existente é recusado.
- mileage inferior ao atual é recusado, inclusive se o checkpoint for o mais recente do histórico; o fato continua armazenado. Isso impede que um histórico antigo/incompleto reduza a quilometragem conhecida, sem tentar resolver troca de painel/adulteração/rollover.
- mileage igual ou superior pode atualizar a cópia; somente mileage/updatedAt mudam, preservando id, createdAt, schema e demais campos.
- Não interpreta createdAt/updatedAt como data de leitura do perfil. A seleção temporal se limita aos checkpoints informados. Como o perfil legado não registra data de leitura, não se afirma que um checkpoint é temporalmente posterior ao mileage legado; a preparação é uma operação explícita com proteção contra redução.
- O histórico não é destruído e Care Events não são usados como checkpoints. Não há alteração de UI ou sincronização da sessão em memória; consumo por missões posteriores exige autorização própria.
- Nenhuma operação escreve simultaneamente em perfil e histórico. Assim, falha ao salvar o perfil não desfaz nem perde o fato já persistido; o caminho explícito pode ser repetido usando os registros existentes.

### Git e handoff

Implementação e relatório preparados para o mesmo commit `feat(vehicle-care): add odometer checkpoints`, exclusivamente na branch `feature/sprint-03-vehicle-care`.

O SHA do commit que contém este relatório é resolvido com `git log -1 --format=%H -- docs/sprints/sprint-03/reports/mission-03.2-report.md`. Para evitar SHA autorreferente, este arquivo registra o estado anterior à própria publicação; o handoff final fornece SHA literal, resultado do push e verificação remota/árvore limpa. Nenhuma publicação é afirmada antes de sua execução.

Nenhuma mudança em main, merge de PR, merge commit, rebase, squash, force-push ou reescrita de histórico foi executada. A única sincronização foi o fast-forward documental de precondição.

### Riscos, limitações e pendências

- localStorage por origem/dispositivo, sujeito a quota/bloqueio/remoção; acesso e quota simulados nos testes. Leitura/append não fornecem coordenação transacional entre abas, conforme padrão existente.
- Datas seguem Date.parse, sem política nova de calendário/datas futuras ou validação automotiva excepcional. Registros dependem dos fatos explicitamente fornecidos.
- Perfil legado não tem momento específico de sua leitura. A preparação conserva compatibilidade e impede redução; não reconstrói essa informação ausente nem cria checkpoint de migração.
- Persistência e composição com o perfil foram testadas em storage em memória. Navegador validou inicialização/console; não foi executado E2E novo de gravação no localStorage real ou uma interface de atualização.
- Sem UI, edição/exclusão, migração ou nuvem nesta entrega. Aceite formal pendente do Tech Lead.

**Não foram implementados Care State, vencimento/atraso, Next Action, estimativas, médias de uso, previsões, lembretes/notificações, GPS/background, inferência por celular, OBD/telemetria, APIs de fabricantes, interface completa de quilometragem, Care Onboarding, alterações de cockpit, diagnóstico, backend/nuvem, autenticação, novas dependências/frameworks ou refatorações incidentais. Missão 03.3 não iniciada; nenhuma outra missão avançada.**

## Recomendações — não executadas

Tech Lead deve revisar principalmente o caminho explícito de atualização do perfil, a proteção contra redução e o desempate temporal antes do aceite. Integração com UI/sessão, políticas excepcionais de hodômetro e mecanismos de concorrência precisam de escopo próprio quando necessários. Nenhuma dessas melhorias foi executada ou autoriza avanço para 03.3.
