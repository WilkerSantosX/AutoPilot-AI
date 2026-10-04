# Relatório de execução — Missão 02.4

> Data de referência: 2026-10-03 — America/Sao_Paulo.
> Execução entregue para revisão do PO/Tech Lead; missão permanece Approved.
> Contrato executado: `470d6f629c42d4086159d152302224af959d04bc`.
> Commit funcional publicado: `7267b25aa21b998fc4df92b67f03e00f64de1530`.

## Fatos

### Estado inicial e sincronização

- Branch exclusiva: `feature/sprint-02-vehicle-profile`.
- Upstream: `origin/feature/sprint-02-vehicle-profile`.
- Na primeira entrada, HEAD `d87bb2031c36aa7a7487aca33e7721df23fd9d91`, workspace limpo, três commits atrás do upstream conhecido.
- Fetch sem prune/tags/submódulos e fast-forward seguro levaram ao contrato original `60669d5caaee378295825bda6301552f711700d3`.
- Após a parada documental e a autorização de retomada, workspace continuava limpo em `60669d5`; fetch encontrou somente a resolução anunciada pelo usuário. Fast-forward levou a `470d6f629c42d4086159d152302224af959d04bc`.
- `git merge-base --is-ancestor` confirmou, com exit code 0, a baseline 02.3 `d87bb2031c36aa7a7487aca33e7721df23fd9d91` e GOV.01 `55403775d1409f4969821987fc9ac211b58ef173` como ancestrais do HEAD sincronizado.
- Após sincronização: comparação `HEAD...upstream` = 0/0; `origin/main...HEAD` = 0/9. Nenhum commit exclusivo de main, nenhum commit local divergente e nenhuma alteração alheia.
- Escritas em `.git` e uma consulta remota foram bloqueadas pelo sandbox; os comandos necessários foram repetidos com aprovação de execução fora do sandbox. Sem contornar restrições.

### Parada anterior e resolução explícita

O documento anterior [implementation-contract.md](../implementation-contract.md), seção **Validation Rules**, exige: **“quilometragem deve ser positiva”**. Esse trecho motivou a parada diante do item 3/AC02 da missão 02.4, que exigem preservar e apresentar zero. A parada ocorreu antes de qualquer implementação, commit ou push.

A seção **Resolução explícita do conflito — quilometragem** de [mission-02.4.md](../missions/mission-02.4.md), adicionada no commit `470d6f629c42d4086159d152302224af959d04bc`, determina:

> a quilometragem válida é um número inteiro maior ou igual a zero. Zero é um valor válido e deve ser preservado no cadastro, persistência, leitura e apresentação.

Também substitui expressamente, para esta missão, qualquer exigência anterior de valor estritamente maior que zero. A resolução limita-se a essa desigualdade; os documentos históricos, a precedência e os demais limites permanecem preservados. O validador existente foi reutilizado sem alterar schema, chave ou regras numéricas.

### Inspeção dirigida

- Leitura de AGENTS.md, GOV.01, contrato atualizado e documentos disponíveis de ADRs, Project Bible, Engineering Bible, APDL e Sprint 02.
- `questionEngine.js` mantém respostas por ID, no formato `{ questionId, value, answeredAt }`; `value` é o texto da opção, não um índice ou enum.
- `questionScreen.js` conclui passando `getAllAnswers()` ao callback do router. “Escolher outro” abre cadastro antes de gravar essa resposta.
- IDs atuais: 1 = veículo, 2 = objetivo, 3 = urgência. Rótulos autorizados vêm de `Questions`.
- O router guardava respostas somente em memória, mas não as consumia; cockpit recebia Wilker/Clio fixos. Hero apresentava mensagens de análise sem cálculo.
- `loadVehicleProfile` já trata ausência, JSON incompatível e falha de leitura. `isVehicleProfile` verifica o schema existente e a quilometragem inteira não negativa.

## Decisões

### Plano local definido antes das alterações

1. Preservar Engine, schema, chave e persistência existentes.
2. Guardar somente ID do perfil em memória para vincular respostas ao questionário iniciado.
3. Proteger Hero/cockpit com leitura do perfil e validação das respostas reais; reiniciar cadastro/questionário quando necessário.
4. Passar perfil e respostas ao cockpit, escapar textos e substituir apenas a apresentação fictícia e os textos necessários do Hero.
5. Cobrir integração e estados inválidos com testes nativos; validar HTTP, dois percursos, reload, substituição, console e desktop/mobile.
6. Publicar implementação validada primeiro e relatório depois; parar sem avançar missão.

### Implementação e arquivos

| Arquivo modificado | Alteração |
|---|---|
| `apps/autopilot-web/router.js` | Vínculo em memória `answerVehicleId`; guardas de contexto em Hero/cockpit; passagem de perfil/respostas reais; reset ao entrar em cadastro, landing ou questionário; callback do Hero só navega se ainda estiver nessa tela. |
| `apps/autopilot-web/screens/CockpitScreen.js` | Saudação neutra; fabricante/modelo/ano/motor; quilometragem incluindo zero; apelido complementar; objetivo/urgência reais; resumo factual com aviso de não diagnóstico; escape de todos os textos dinâmicos. |
| `apps/autopilot-web/screens/HeroScreen.js` | Textos de organização das informações e preparação de resumo, preservando temporização/transição. |
| `apps/autopilot-web/styles/cockpit.css` | `overflow-wrap: anywhere` no container para textos dinâmicos longos. |
| `apps/autopilot-web/vehicle/vehicleJourney.test.mjs` | Seis testes adicionais de integração, contexto inválido, perfil substituído, reset, conteúdo e renderização segura; fixture de DOM ajustada. |

Arquivo criado: `docs/sprints/sprint-02/reports/mission-02.4-report.md`.

A única fonte persistente permanece `autopilot.vehicle-profile.v1`, lida por `loadVehicleProfile` e verificada com `isVehicleProfile`. Não há cópia persistente nem cópia do objeto do veículo no estado da sessão. Apenas respostas e o identificador ficam em memória.

Para prosseguir, cada resposta deve ter o ID correto, opção válida e timestamp parseável; a confirmação do veículo deve ser “Usar este veículo”. Perfil ausente/inválido ou leitura com erro abre cadastro. Respostas incompletas/inválidas ou ID diferente reiniciam perguntas e apagam respostas anteriores. Perfil é relido também após o Hero, antes de apresentar o cockpit.

### Validação automatizada

| Comando/verificação | Resultado |
|---|---|
| `node --test apps/autopilot-web/vehicle/*.test.mjs` | 19 testes aprovados, zero falhas, skips ou cancelamentos. Inclui todos os 13 testes anteriores e seis novos. |
| `Get-ChildItem apps/autopilot-web -Recurse -Include *.js,*.mjs \| ForEach-Object { node --check $_.FullName }` | Todos os arquivos JS/MJS passaram na validação de sintaxe. |
| `git diff --check` e `git diff --cached --check` | Sem erros de whitespace no diff final. |
| Revisão própria de `git diff -- <cinco arquivos>` e `git diff --cached --stat` | Escopo conferido; sem dependências, alteração de Engine/schema/storage ou arquivos alheios. |

Uma primeira rodada do teste novo falhou porque a fixture deixava o getter de storage bloqueado na iteração seguinte. A fixture foi corrigida restaurando o getter, e a rodada final passou. O primeiro diff também apontou CRLF como whitespace nas linhas novas; foram preservadas as terminações das linhas preexistentes e usados LF nas novas, mantendo o diff pequeno.

Cobertura nova: percurso real pelos handlers do questionário/Engine; Hero/cockpit sem perfil, JSON corrompido, schema inválido ou erro de leitura; respostas nulas, array, incompletas, opção inválida, ID errado e timestamp inválido; confirmação “Escolher outro” rejeitada; Toyota/Honda com respostas distintas; zero; substituição durante perguntas/Hero; reset; payload HTML escapado no perfil e nas respostas. Falhas de gravação, getter bloqueado, nova tentativa e reenvio continuam cobertos pelos testes anteriores.

### Observações no navegador — separadas dos testes

Servidor iniciado com:

```powershell
python -m http.server 8765 --bind 127.0.0.1 --directory apps/autopilot-web
```

Validação no navegador in-app, origem `http://127.0.0.1:8765/`, usando cliques/preenchimento reais:

1. Landing → início → “Escolher outro” → cadastro Toyota Corolla 2020, motor 2.0, Flex, 0 km.
2. Apelido sintético `"Meu" & <img src=x onerror="alert(1)">` → confirmação do veículo → objetivo “Planejar a próxima revisão” → urgência “Baixa — só quero me organizar” → Hero → cockpit.
3. Cockpit mostrou identificação real, 0 km, respostas corretas e apelido literal; consulta DOM encontrou zero elementos `img` no cockpit. Não houve diálogo de execução do payload.
4. Reload do cockpit retornou à landing; nova entrada reutilizou Toyota e começou na pergunta 1, sem resposta selecionada.
5. “Escolher outro” → cadastro Honda Civic 2022, motor 1.5 Turbo, Gasolina, 42000 km, sem apelido → confirmação → objetivo “Entender um problema atual” → urgência “Alta — preciso resolver logo” → Hero → cockpit. Só Honda e as novas respostas apareceram.
6. Screenshots e leitura do DOM confirmaram resumo legível em desktop 1440×900 e mobile 390×844. `document.documentElement.scrollWidth` foi 1425 e 375 respectivamente, inferior à largura do viewport; sem overflow horizontal. A rolagem vertical normal permite consultar o restante do cockpit.
7. `tab.dev.logs({ levels: ['error', 'warn'], limit: 30 })` retornou lista vazia nas consultas após os percursos. Logs informativos anteriores do questionário permanecem fora deste recorte.

Substituição externa do perfil durante perguntas/Hero e falhas de storage foram verificadas pelos testes automatizados, não por manipulação do storage no navegador. Os testes não substituem a inspeção visual; ambos foram executados.

O log HTTP registrou somente um 404 incidental para `favicon.ico`, já ausente na aplicação; os módulos e estilos locais carregaram com 200/304. A consulta de console não apresentou erro JavaScript. Aba temporária encerrada, override de viewport restaurado e servidor temporário interrompido após os testes. O último perfil sintético Honda permanece no storage dessa origem local de teste.

### Matriz de aceite

| ID | Resultado | Evidência |
|---|---|---|
| AC01 | PASS | Toyota e Honda reais no navegador e em integração; sem fallback Wilker/Clio. |
| AC02 | PASS | Toyota 0 km no cadastro/cockpit; testes de modelo, persistência e apresentação. |
| AC03 | PASS | Revisão/baixa versus problema/alta nos dois percursos; rótulos reais. |
| AC04 | PASS | Hero organiza/prepara resumo e conclui no cockpit em ambos os percursos. |
| AC05 | PASS | Resumo factual e aviso de não diagnóstico; teste rejeita mensagens fictícias anteriores. |
| AC06 | PASS | Guardas automatizadas para perfil/contexto ausente, incompleto, inválido e erro de leitura. |
| AC07 | PASS | Substituição Toyota → Honda e nova sessão no navegador; regressão do reset. |
| AC08 | PASS | Testes substituem perfil antes de Hero e antes de cockpit; respostas apagadas e pergunta 1 reapresentada. |
| AC09 | PASS | Reload retornou à landing, veículo mantido e perguntas reiniciadas sem seleção. |
| AC10 | PASS | Escape de aspas simples/duplas, &, tags/payload nos testes; apelido literal e zero imagens no navegador. |
| AC11 | PASS | Todos os testes 02.3 preservados/passando; cadastro, substituição e reset exercitados no navegador. |
| AC12 | PASS | Inspeção visual e medição DOM em 1440×900 e 390×844, sem overflow horizontal do resumo. |

Os PASS acima são resultados da execução técnica. Aceite formal e fechamento continuam pertencendo ao PO/Tech Lead.

### Diff e estado Git anterior ao commit documental

- Implementação: cinco arquivos, 195 inserções e 29 remoções.
- Mensagem funcional exigida: `feat(cockpit): personalize cockpit with vehicle and session answers`.
- SHA funcional: `7267b25aa21b998fc4df92b67f03e00f64de1530`.
- Push funcional realizado exclusivamente para `feature/sprint-02-vehicle-profile`.
- Após esse push e antes de criar este relatório: workspace/índice limpos, HEAD/upstream funcional iguais, comparação 0/0.
- `git ls-remote origin refs/heads/feature/sprint-02-vehicle-profile` confirmou remotamente o mesmo SHA funcional.
- Este relatório é o único arquivo adicional selecionado para o commit documental `docs(sprint-02): report mission 02.4 execution`.
- O SHA documental e a confirmação do HEAD remoto após sua publicação serão entregues na resposta final, evitando autorreferência.

### Riscos, limitações e limites respeitados

- O resumo organiza autodeclarações; não verifica veracidade do veículo, faz diagnóstico ou classifica segurança/criticidade.
- Respostas são voláteis por contrato. Reload perde a sessão, preservando apenas o veículo.
- Vínculo usa ID em memória, compatível com substituição pelo cadastro atual; edição mantendo o mesmo ID não é funcionalidade deste recorte.
- Cartões/dica existentes continuam com os handlers anteriores, sem implementação de ações futuras. Linguagem histórica de landing/perguntas não foi redesenhada.
- Aparência continua dependendo das fontes/Bootstrap/ícones externos já existentes; nenhum recurso/dependência nova instalado.
- Testes de integração usam DOM/storage simulados; os dois percursos e a inspeção responsiva foram feitos também no navegador real.
- Nenhuma validação obrigatória ficou pendente. Revisão técnica e aceite de produto são os próximos gates humanos, não executados por Codex.
- Nenhuma alteração em main, merge de branches/PR, rebase, squash, reset destrutivo, force-push, exclusão de branches ou reescrita de histórico. Sincronização inicial somente por fast-forward expressamente exigido.
- Nenhum backend, autenticação, IA, serviço genérico, nova camada, alteração arquitetural, schema/chave, persistência de respostas ou mudança no contrato do Engine.
- Documentos históricos e status da missão preservados. Trello não atualizado. Missões 02.5/02.6 não iniciadas.
- Execução encerrada após publicação deste relatório e conferência final da branch.

## Recomendações — não executadas

- PO/Tech Lead revisar o diff funcional e esta matriz antes do fechamento formal.
- Em missão futura aprovada, avaliar a linguagem histórica de landing/perguntas e dos cartões ainda sem funcionalidade.
- Se edição de perfil for aprovada futuramente, definir o vínculo/invalidação da sessão para alterações que preservem o ID.
