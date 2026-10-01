# Missão 02.3 — VehicleProfile na entrada da jornada

## Fatos — Estado inicial e inspeção

- Branch: `feature/sprint-02-vehicle-profile`.
- HEAD original/baseline ancestral: `d3aef9f6e0b64dc2df7be87bae76f45d3dfc745e`.
- Única alteração inicial: relatório aprovado da Missão 02.2, não rastreado.
- Relatório revisado e publicado separadamente em `8f7f124fa084fc7a0d4e350c227121739cd9dbc8`, antes de qualquer alteração funcional da 02.3.
- HEAD de início da implementação: `8f7f124fa084fc7a0d4e350c227121739cd9dbc8`; workspace limpo; upstream `origin/feature/sprint-02-vehicle-profile`, 0 à frente/atrás; 4 commits à frente de `origin/main` local.
- Fluxo encontrado: landing → Router → Question Engine, sem consulta ao perfil. Cadastro acessível por query técnica, salva e permanece no formulário.
- `loadVehicleProfile` valida com `isVehicleProfile`; `saveVehicleProfile` grava somente a chave `autopilot.vehicle-profile.v1`. Erros são retornados, mas o getter padrão de localStorage escapava do try.
- Cadastro usa createVehicleProfile, mensagens recuperáveis e textContent no resumo. Primeira pergunta usa Clio fixo; Escolher outro é resposta comum.
- Modelo/validação/storage, renderizadores, callbacks de navegação e reset do Engine são reutilizáveis.

## Decisões — Plano anterior às alterações funcionais

1. `router.js`: verificar perfil válido em toda entrada do questionário; encaminhar ausência/erro ao cadastro; reiniciar perguntas ao entrar; continuar após salvamento; ligar Escolher outro ao cadastro.
2. `VehicleProfileScreen.js`: callback somente após gravação bem-sucedida; preservar dados e nova tentativa em falha; adequar mensagem técnica à jornada.
3. `questionScreen.js` e `questions.js`: opção derivada do perfil persistido, renderização segura, desvio para cadastro e reset da sessão ao substituir contexto.
4. `vehicleStorage.js`: incluir obtenção do localStorage no tratamento de falha existente.
5. Testes sem dependências novas: proteger persistência bloqueada e integração da entrada, cadastro, substituição e renderização segura.

Fonte de verdade planejada: VehicleProfile persistido na chave existente; nenhuma segunda persistência ou objeto paralelo de veículo.

O recorte aprovado da Missão 02.3 prevalece sobre a entrega ampla da Sprint: cockpit/Hero, respostas persistentes e validação numérica além da preservação de zero ficam fora desta missão.

## Decisões — Plano executado e arquivos

Os cinco passos do plano foram executados. O Router recupera e valida o perfil antes de renderizar o questionário. O cadastro chama onSaved somente após saveVehicleProfile retornar sucesso; o Router relê o perfil persistido e abre as perguntas. Falhas mantêm o formulário e liberam o botão para nova tentativa. Escolher outro abre imediatamente o cadastro; salvar a substituição reinicia perguntas e respostas em memória.

Arquivos modificados:

- `apps/autopilot-web/router.js`: pré-condição, continuação e callbacks de navegação.
- `apps/autopilot-web/screens/VehicleProfileScreen.js`: callback após sucesso e identificação Meu veículo.
- `apps/autopilot-web/screens/questionScreen.js`: nome real escapado, Escolher outro e reset usando Engine existente.
- `apps/autopilot-web/data/questions.js`: substituição da opção Clio por ação estática Usar este veículo.
- `apps/autopilot-web/vehicle/vehicleStorage.js`: tratamento do getter bloqueado dentro do try.

Arquivos criados:

- `apps/autopilot-web/vehicle/vehicleJourney.test.mjs`: sete testes de integração e falhas.
- Este relatório: plano registrado antes da implementação e evidências da entrega.

## Fonte de verdade

VehicleProfile persistido em `autopilot.vehicle-profile.v1`, recuperado exclusivamente por loadVehicleProfile e validado por isVehicleProfile. O Router passa o resultado da leitura à tela; atualizações internas relêem o storage. Não existe veículo armazenado em AppState, objeto paralelo ou segunda persistência. A resposta da primeira pergunta é a ação estática Usar este veículo; não armazena uma cópia dos dados do perfil.

## Fatos — Cenários de aceite

| Cenário | Resultado e evidência |
|---|---|
| 1. Primeira utilização | PASS: navegador abriu cadastro a partir da landing; teste cobre ausência, JSON corrompido e perfil inválido. |
| 2. Cadastro bem-sucedido | PASS: navegador continuou automaticamente para pergunta 1; teste confirmou gravação e continuidade. |
| 3. Perfil existente | PASS: início da jornada recupera e apresenta veículo real; teste de reentrada e navegador. |
| 4. Reload | PASS: reload retorna à landing; ao iniciar, mesmo Toyota foi recuperado na pergunta 1. Respostas reiniciam. |
| 5. Quilometragem zero | PASS: cadastros Toyota e Honda com zero no navegador; modelo e persistência protegidos nos testes. |
| 6. Falha de persistência | PASS automatizado: escrita falha, cadastro permanece, perfil não salvo, botão liberado e Tente novamente; segunda tentativa avança. Getter bloqueado também coberto. Não foi injetada falha no navegador. |
| 7. Veículo real | PASS: Toyota Corolla e depois Honda Civic 2022 apareceram na pergunta 1; nenhum Clio nessa etapa. |
| 8. Escolher outro | PASS: navegador abriu cadastro e substituiu contexto por Honda; teste protege reset de seleção/respostas. |
| 9. Renderização segura | PASS: payload semelhante a img/onerror, aspas e & mostrado literalmente; teste confirma escape e ausência de HTML img no template. |

## Testes e validação

- `node --test apps/autopilot-web/vehicle/vehicleProfile.test.mjs`: seis testes existentes aprovados.
- `node --test apps/autopilot-web/vehicle/*.test.mjs`: 13 testes aprovados, zero falhas.
- `Get-ChildItem apps/autopilot-web -Recurse -Include *.js,*.mjs | ForEach-Object { node --check $_.FullName }`: sintaxe validada.
- `git -c safe.directory=C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI diff --check`: validado após ajuste dos finais de linha nas linhas modificadas.
- `python -m http.server 8766 --bind 127.0.0.1 --directory apps/autopilot-web`: aplicação iniciada e servida por HTTP local.
- Navegador: landing, cadastro, primeira pergunta, reload, substituição e avanço para pergunta 2 validados; logs de níveis error/warn consultados, resultado vazio.
- O servidor registrou 404 de favicon.ico, recurso ausente já existente. Servidor temporário encerrado após a validação.
- Diff funcional e teste novo revisados. Não houve instalação de dependências.
- Testes de integração usam doubles mínimos de DOM/FormData/storage, complementados pelo navegador real; não equivalem a uma suíte E2E completa.

## Diff e estado final do Git

Diff da 02.3: cinco arquivos de produção modificados, um teste novo e este relatório. Alterações limitadas à entrada, persistência recuperável, apresentação segura do perfil e substituição do contexto. Não há alteração funcional em app.js, Question Engine, Hero ou Cockpit.

- Branch: `feature/sprint-02-vehicle-profile`.
- HEAD: `8f7f124fa084fc7a0d4e350c227121739cd9dbc8`.
- Upstream: `origin/feature/sprint-02-vehicle-profile`; commits locais/remotos sincronizados (0/0).
- Relação com `origin/main` local: 4 à frente, 0 atrás; não foi feito fetch nesta missão.
- Status: cinco arquivos modificados e dois arquivos novos, exclusivamente da 02.3; staging vazio.
- Commit documental da 02.2: `8f7f124fa084fc7a0d4e350c227121739cd9dbc8`, publicado antes das alterações funcionais.
- Commit/push da 02.3: não realizados; entrega no workspace para avaliação do PO/Tech Lead. Não existe SHA funcional novo.
- Separação confirmada: commit da 02.2 contém exclusivamente seu relatório; mudanças da 02.3 permanecem posteriores e fora desse commit.
- main não foi modificada; nenhum merge, rebase, squash, reset ou exclusão de branch.

## Riscos, limitações e recomendações futuras

Hero e Cockpit permanecem simulados, com conteúdo fixo e afirmações existentes; esta missão não os tornou consumidores do perfil nem das respostas. Respostas não persistem após reload. Não há suporte a múltiplas abas com alteração concorrente do storage. A confirmação de sucesso do formulário é imediatamente substituída pela primeira pergunta na jornada.

Validação responsiva completa e percurso até o cockpit não foram realizados nesta rodada, cujo corte termina na entrada das respostas. Dados sintéticos de teste ficaram na origem local 127.0.0.1:8766. A evidência visual foi armazenada fora do repositório.

Recomendação para avaliação futura: definir integração das respostas/Hero/Cockpit e seu conteúdo factual em missão própria. Nenhuma dessas extensões foi implementada.

## Confirmação de limites

Não foram introduzidos backend, banco de dados, autenticação, framework, dependências, múltiplos veículos, diagnóstico inteligente, classificações de segurança/criticidade, recomendações mecânicas, mudanças no cockpit ou refatorações oportunistas. Router e Question Engine não foram reescritos. Entrega encerrada no recorte Meu veículo → início das minhas respostas, aguardando avaliação do PO/Tech Lead.
