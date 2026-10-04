# Relatório — Missão 02.5: validação integrada do MVP

> Execução: 2026-10-04 — America/Sao_Paulo.
> Recomendação: **MVP_VALIDATED_WITH_RESERVATIONS**.
> Entrega documental para revisão do PO/Tech Lead; contrato permanece Approved.
> Contrato Approved e HEAD validado: `7f580f356df0202b578c6e21f2450abb01fdbdbd`.
> Código funcional aceito: `7267b25aa21b998fc4df92b67f03e00f64de1530`.

## Fatos

### Resumo e precondições

O percurso integrado foi demonstrado em navegador real com dois veículos e duas combinações de objetivo/urgência, em desktop e mobile. Os 19 testes nativos passaram. As guardas de contexto, falhas recuperáveis de storage, reload, substituição e renderização literal foram observados e registrados. Não foi encontrado defeito funcional Blocker, Critical ou Major nos cenários executados. Há um achado Minor de recurso auxiliar: `favicon.ico` retorna 404. Nenhum defeito foi corrigido.

| Precondição | Evidência e resultado |
|---|---|
| Repositório e branch exclusivos | Origin `https://github.com/WilkerSantosX/AutoPilot-AI`; `feature/sprint-02-vehicle-profile`. PASS. |
| Estado inicial | HEAD `353435a236c17dc87eb313bcc76714c9a06e3bae`; workspace/índice limpos; upstream `origin/feature/sprint-02-vehicle-profile`; status inicial indicava behind 1 perante a referência então conhecida. |
| Fetch e sincronização | Fetch sem prune, tags ou submódulos atualizou origin da referência abreviada `97de2fc` para `7f580f3`. Fast-forward seguro de `353435a` a `7f580f3`; somente dois documentos de missão alterados pela sincronização. Nenhuma divergência local. |
| Contrato executável | Missão 02.5 Approved no SHA indicado pelo usuário. PASS. |
| Baselines ancestrais | `git merge-base --is-ancestor` para `7267b25aa21b998fc4df92b67f03e00f64de1530` e `353435a236c17dc87eb313bcc76714c9a06e3bae`, ambos exit 0. PASS. |
| Fechamento 02.4 | `mission-02.4.md` em Completed; fechamento formal de 2026-10-03 confirma implementação e relatório acima, aceite PO/Tech Lead e limites conhecidos. PASS. |
| Relação com remoto e main após fetch | HEAD/upstream `7f580f3`, comparação 0/0. `origin/main...HEAD`: 0/14; nenhum commit exclusivo de main. PASS. |
| Código efetivamente validado | HEAD `7f580f3`; `git diff 7267b25... HEAD -- apps` vazio: aplicação e testes correspondem à implementação aceita. |

Foram lidos AGENTS.md, GOV.01, documentos disponíveis de ADRs, Project Bible, Engineering Bible, APDL e Sprint 02, incluindo relatórios históricos e fechamento 02.4. A regra histórica de quilometragem positiva foi tratada conforme a resolução explícita da 02.4, preservada expressamente pela 02.5: inteiro maior ou igual a zero. Os relatos históricos descrevem suas respectivas baselines; não foram usados como descrição do código atual. Os documentos estratégicos enumerados mas ausentes no Project Bible continuam uma limitação documental conhecida, sem inventar seu conteúdo.

O primeiro fetch foi bloqueado pela escrita em `.git/FETCH_HEAD`; repetido com execução autorizada fora do sandbox. O fast-forward também exigiu autorização de escrita em `.git`. Não houve contorno das restrições.

### Ambiente, dados e métodos

- Windows; PowerShell; Node `v23.3.0`; Python `3.11.3`.
- Navegador real: Codex In-app Browser, Chromium identificado pelo user-agent como `Chrome/154.0.0.0`, Windows NT 10.0/Win64. User-agent registrado pelo apoio de teste e pelo servidor em [http-harness.jsonl](mission-02.5-evidence/http-harness.jsonl).
- Viewports solicitados: desktop **1440 × 900** e mobile **390 × 844**. Medições em [ui-observations.json](mission-02.5-evidence/ui-observations.json) confirmam essas dimensões; scrollWidth desktop 1425, mobile 390, sem exceder a largura. Capturas fullPage são mais altas que o viewport; uma inspeção desktop após captura completa registrou altura 1255. O viewport foi reaplicado a 1440 × 900 antes das medições finais. Não se confunde imagem de página inteira com tamanho de tela.
- Origens novas de teste `http://localhost:18765/` e `http://localhost:18766/`; dados exclusivamente fictícios. Nenhuma origem anterior contendo possível contexto pessoal foi alterada.
- Contexto A: Toyota Corolla, 2020, motor 2.0, Flex, **0 km**; objetivo **Planejar a próxima revisão**, urgência **Baixa — só quero me organizar**.
- Apelido A: `"Meu" & <img src=x onerror="alert(1)"> São João '`. O payload permaneceu texto literal; nenhuma imagem foi criada no cockpit (consulta DOM: zero elementos `#app img`), sem diálogo observado.
- Contexto B: Honda Civic, 2022, motor 1.5 Turbo, Gasolina, **42000 km**, sem apelido; objetivo **Entender um problema atual**, urgência **Alta — preciso resolver logo**.

Os percursos normais usaram cliques e preenchimento reais por controles do navegador, sem fabricar respostas da sessão. A observação de guardas/erros usou um servidor Python temporário, fora do conteúdo versionado, que serve os arquivos originais e acrescenta um painel apenas em `/__mission.html`. O painel injeta perfil/JSON/respostas, falhas dos métodos/getter de localStorage e chamadas do router por botões explícitos. Não modifica módulos da aplicação. Método integral reproduzível em [injection-method.md](mission-02.5-evidence/injection-method.md).

O apoio foi iniciado em 18766. Ao final, o servidor simples de 18765 foi interrompido e o mesmo apoio foi iniciado nessa porta para **ler o Honda realmente persistido** e verificar recuperação de JSON corrompido por cadastro real de Toyota zero. A única adaptação do script foi trocar a porta 18766 por 18765. Esses registros estão em `ui-observations.json`; os estados injetados têm entradas identificadas separadamente em [injected-observations.json](mission-02.5-evidence/injected-observations.json).

Os testes nativos usam doubles de DOM/storage; seus PASS não foram usados como substitutos silenciosos do navegador. A inspeção estática confirmou a chave/schema existentes, respostas em memória e escape dos textos. Edição mantendo o mesmo ID não é funcionalidade deste recorte; V07 exercita substituição do perfil com outro ID, como no cadastro existente.

### Matriz obrigatória V01–V16

Cada linha registra execução, entrada, esperado, observado e evidência. Os IDs citados correspondem aos registros JSON publicados; imagens complementam a observação textual.

| ID / resultado | Passos e entrada | Esperado | Observado / evidência |
|---|---|---|---|
| V01 **PASS** | Origem vazia → Iniciar Diagnóstico → cadastrar A → confirmar Toyota → revisão → baixa → Finalizar. | Cadastro necessário e percurso completo sem valores inventados. | Cadastro abriu; gravação avançou à pergunta 1; Hero e cockpit mostraram A e respostas reais. `V01-after-save`, `V01-V03-V12-V13-desktop-cockpit` em UI JSON; [cockpit desktop](mission-02.5-evidence/v01-desktop-cockpit.jpg). |
| V02 **PASS** | Reload → Iniciar → Escolher outro → cadastrar B → confirmar Honda → problema → alta → Finalizar, mobile. | Identificação/resumo somente do contexto atual. | Honda/42000 e problema/alta; sem Toyota/apelido/respostas antigos. `V02-V06-mobile-cockpit`; [cockpit mobile](mission-02.5-evidence/v02-mobile-cockpit.jpg). |
| V03 **PASS** | Cadastrar A com 0 e B com 42000; observar cockpit/reload; inspecionar perfil persistido por painel. | Inteiros preservados no formulário, storage e apresentação. | 0 e 42000 mantidos. `V03-normal-positive-storage`, `V03-zero-storage-V09-recovery` em UI JSON; `V10-write-retry` no JSON de injeção registra cadastro real zero; screenshots dos cockpits/formulário. |
| V04 **PASS** | Enviar vazio; preencher A, enviar mileage -1; depois 1.5; depois 0. | Rejeitar ausência/negativo/fração sem submissão inválida. | Seis mensagens no envio vazio, foco no fabricante; erros específicos em -1/1.5, formulário preservado e botão liberado; 0 avançou. [Envio vazio](mission-02.5-evidence/v04-empty.jpg); `V04-negative`, `V04-fraction`. |
| V05 **PASS** | Reload logo após salvar A, durante pergunta 2 com revisão selecionada e após cockpit; reiniciar pela landing. | Perfil mantido; landing e novas respostas. | Todos retornaram à landing; nova entrada mostrou Toyota na pergunta 1 sem seleção/avanço habilitado. `V05-after-save-reload`, `V05-question-reload`, `V05-restart-clean`, `V05-cockpit-reload`. |
| V06 **PASS** | Escolher outro no Toyota; salvar B e completar a nova jornada. | Novo perfil e novas respostas somente. | Cadastro substituiu a mesma chave; cockpit B/42000/problema/alta. V02 e teste nativo “Escolher outro abre cadastro e substituição reinicia respostas”. |
| V07 **PASS** | Durante pergunta 3 de Toyota, injetar Honda mantendo respostas; finalizar. Variante: contexto válido Toyota injetado no Hero, substituir Honda antes do timer concluir. | Respostas anteriores invalidadas antes do cockpit. | Ambas voltaram à pergunta 1 Honda, `answers: {}`, Continuar desabilitado; nenhum cockpit com contexto antigo. `V07-replace-during-question`, `V07-after-replace-question`, `V07-hero-seed`, `V07-hero-replace`, `V07-after-hero-replace`; [reset](mission-02.5-evidence/v07-reset.jpg). A variante Hero usa respostas sintéticas válidas, declaradamente. |
| V08 **PASS** | Painel: destinos hero/cockpit × perfil absent; ou Toyota válido × respostas empty/incomplete/invalid (opção inválida na resposta 2). | Cadastro sem perfil; questionário sem respostas completas/válidas. | Oito variantes encaminharam ao destino seguro, sem fallback ou cockpit inválido. Registros `V08-*` e [guardas](mission-02.5-evidence/v08-guards.jpg). |
| V09 **PASS** | Tentar questionário com chave absent, JSON `{broken`, schemaVersion 2 e mileage -1. Em JSON corrompido, cadastrar A real novamente. | Recuperação orientada, sem crash ou perfil inventado. | Cadastro e mensagens apropriadas; novo cadastro substituiu JSON inválido e avançou à pergunta 1 com zero. `V09-*`, `V03-zero-storage-V09-recovery`; [perfil inválido](mission-02.5-evidence/v09-invalid-profile.jpg). |
| V10 **PASS** | Injetar getItem lançando SecurityError e getter lançando SecurityError; tentar jornada, restaurar e repetir. Injetar setItem lançando QuotaExceededError; preencher A e salvar; restaurar e reenviar mesmos dados. | Falha controlada, sem sucesso falso, recuperação observável. | Leitura abriu cadastro com mensagem; após restaurar, Toyota voltou à pergunta 1. Escrita manteve campos, botão habilitado, mensagem Tente novamente e storage null; reenvio gravou zero e avançou. `V10-*`; [falha de escrita](mission-02.5-evidence/v10-write-failure.jpg). |
| V11 **PASS** | Voltar da pergunta 3 para 2 e avançar; Voltar à aplicação no cadastro; reload/reinício. Painel: Hero válido → landing antes da conclusão do timer, inspecionar depois. | Navegação/reset coerentes; veículo mantido e respostas reiniciadas. | Resposta 2 recuperada ao voltar; link retornou à landing; reset apagou respostas/ID e manteve perfil; timer antigo não tirou a landing. `V11-back`, `V11-back-to-app` (UI), `V11-interrupt-hero`, `V11-reset-landing`, `V11-after-old-timer` (injeção). |
| V12 **PASS** | Cadastrar apelido A com aspas, &, tags, acentos e payload; concluir até cockpit e consultar DOM. | Texto literal, sem HTML executado. | Apelido literal, zero imagens no cockpit, sem diálogo de execução observado. Screenshot desktop e registro V01/V12; teste nativo de escape cobre também textos do perfil e respostas. |
| V13 **PASS** | Observar Hero e status/resumo nos contextos A e B. | Organização factual, sem diagnóstico/inferência mecânica ou garantia de segurança. | Hero organiza informações; cockpit explica urgência autodeclarada e que resumo não constitui diagnóstico. [Hero desktop](mission-02.5-evidence/v13-hero-desktop.jpg), [Hero mobile](mission-02.5-evidence/v02-mobile-hero.jpg), dois cockpits/DOM. |
| V14 **PASS** | Percursos A desktop e B mobile; inspecionar landing, cadastro, perguntas, Hero e cockpit; medir largura. Repetição Honda desktop. | Conteúdo legível, controles utilizáveis, sem overflow impeditivo. | Percursos concluídos por controles reais; quebra de texto e rolagem vertical normais. Mobile 390×844, scrollWidth 390; desktop 1440×900, scrollWidth 1425. Registros `V14-*`; imagens [landing mobile](mission-02.5-evidence/v14-mobile-landing.jpg), [formulário mobile](mission-02.5-evidence/v02-mobile-form.jpg), [pergunta mobile](mission-02.5-evidence/v14-mobile-question.jpg), [viewport desktop](mission-02.5-evidence/v14-desktop-viewport.jpg). |
| V15 **FAIL — Minor** | Iniciar HTTP, carregar jornadas, consultar console warn/error e logs HTTP. | Sem erros de carregamento; ocorrências documentadas. | Aplicação/módulos/estilos locais 200/304; console warn/error vazio em ambos os recortes. Única falha de recurso: favicon.ico 404, achado F01. [HTTP normal](mission-02.5-evidence/http-normal.txt), HTTP do apoio, [console normal](mission-02.5-evidence/console-normal.json), [console injetado](mission-02.5-evidence/console-injected.json). Subverificações de início/percurso/console PASS. |
| V16 **PASS** | Executar toda a suíte existente e node --check em JS/MJS. | Suíte e regressão 02.3/02.4 completas, sem ocultar falhas. | 19 PASS, 0 FAIL/cancelled/skipped/todo; sintaxe válida em todos os 19 JS/MJS. [Testes](mission-02.5-evidence/native-tests.txt), [sintaxe](mission-02.5-evidence/syntax.txt). |

Não há linhas BLOCKED ou NOT APPLICABLE. São 15 linhas PASS e uma FAIL de severidade Minor; FAIL não foi convertido em PASS por haver alternativa de uso.

### Achados reproduzíveis

**F01 — Minor — V15 — favicon ausente.** Ambiente: Windows/Chromium 154, HTTP local nas portas 18765/18766. Passos: iniciar servidor com a raiz da aplicação; abrir a landing em origem nova; observar requisição automática `/favicon.ico` no log HTTP. Esperado: recurso auxiliar resolvido sem 404. Observado: `GET /favicon.ico` retorna 404, enquanto aplicação, módulos e estilos locais carregam. Evidências: `http-normal.txt` e `http-harness.jsonl`. Impacto: ocorrência localizada de recurso auxiliar, sem impedir cadastro, respostas, Hero ou cockpit. Alternativa observada: concluir a jornada normalmente. Já era registrado na 02.3/02.4; não é regressão introduzida nesta missão. Nenhuma correção executada.

Não se classificam como defeitos: respostas voláteis, reload na landing, zero válido, resumo sem diagnóstico e ações futuras dos cartões indisponíveis, conforme comportamentos aceitos. A linguagem histórica da landing/perguntas/cartões continua visível; V13 avalia especificamente Hero e status/resumo, sem atribuir implementação de IA ou diagnóstico à aplicação.

### Comandos e validações

```powershell
git -c safe.directory=C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI status --porcelain=v2 --branch
git -c safe.directory=C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI -c fetch.prune=false -c fetch.pruneTags=false fetch --no-prune --no-tags --no-recurse-submodules origin
git -c safe.directory=C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI merge --ff-only origin/feature/sprint-02-vehicle-profile
git -c safe.directory=C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI merge-base --is-ancestor 7267b25aa21b998fc4df92b67f03e00f64de1530 HEAD
git -c safe.directory=C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI merge-base --is-ancestor 353435a236c17dc87eb313bcc76714c9a06e3bae HEAD
git -c safe.directory=C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI rev-list --left-right --count origin/main...HEAD
node --test apps/autopilot-web/vehicle/*.test.mjs
Get-ChildItem apps/autopilot-web -Recurse -Include *.js,*.mjs | ForEach-Object { node --check $_.FullName }
python -u -m http.server 18765 --bind 127.0.0.1 --directory apps/autopilot-web
python -u C:/Users/adriw/AppData/Local/Temp/autopilot-mission-025-server.py
git -c safe.directory=C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI diff 7267b25aa21b998fc4df92b67f03e00f64de1530 HEAD -- apps
git -c safe.directory=C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI diff --check
```

As saídas de testes/sintaxe foram persistidas sem alterar testes. HTTP local respondeu 200 também à sondagem `Invoke-WebRequest`. Uma tentativa de navegação por `127.0.0.1:18765` retornou ERR_ABORTED; navegar por `localhost:18765` funcionou e permaneceu a origem usada. Não constitui BLOCKED porque o percurso real foi executado. Um seletor por label do painel não resolveu; foi substituído pelo ID observado do mesmo controle. A tentativa de consultar userAgent pelo evaluate somente leitura não foi suportada; userAgent foi registrado pelo apoio e cabeçalho HTTP. Nenhum desses problemas de ferramenta foi descrito como defeito da aplicação.

### AC01–AC07

| Critério | Resultado | Fundamento |
|---|---|---|
| AC01 | PASS | Contrato, baseline, ancestralidade, HEAD e ambiente identificados. |
| AC02 | PASS | V01–V16 com resultado, passos, dados, esperado, observado e evidências; F01 explicitamente FAIL. |
| AC03 | PASS | Dois contextos e percursos reais desktop/mobile publicados. |
| AC04 | PASS | Suíte completa, sintaxe, HTTP e console registrados; limitações do método explícitas. |
| AC05 | PASS | F01 classificado/reproduzível; limites conhecidos separados de defeitos. |
| AC06 | PASS | Zero mudanças em aplicação/testes/configuração/dependências; artefatos exclusivamente sob reports/. |
| AC07 | PASS | Gate fundamentado; novo fetch pré-publicação confirmou remoto ainda em 7f580f3; publicação e confirmação final são entregues pelo SHA documental na resposta final, sem autorreferência. |

## Decisões

### Plano e execução autorizada

Validar primeiro precondições/documentação, executar suíte/sintaxe, observar percursos normais, depois injetar estados de falha controlados e registrar evidências. Usar origens sintéticas, preservar módulos e testes existentes, publicar somente documentação e parar. Nenhuma decisão arquitetural ou funcional foi tomada.

O painel chama APIs internas existentes apenas no ambiente de teste. O código temporário é preservado como bloco documental para reprodução; não é novo script operacional versionado nem alteração da configuração de execução do produto. Capturas e JSON ficam no repositório para revisão, sem depender de caminhos temporários como única prova.

### Arquivos, diff e estado anterior ao commit documental

- Criado: este `reports/mission-02.5-report.md`.
- Criados: evidências em `reports/mission-02.5-evidence/`: logs HTTP/console, resultados de testes/sintaxe, observações UI/injeção, método documental e screenshots mencionados na matriz.
- Nenhum arquivo previamente versionado foi modificado pela execução. Não há alteração de aplicação, testes, dependências, configuração, documentos históricos ou status de missão.
- HEAD anterior ao commit documental: `7f580f356df0202b578c6e21f2450abb01fdbdbd`; upstream e referência remota confirmados no mesmo SHA por novo fetch. Relação com main 0/14. Antes de produzir os artefatos, workspace limpo; imediatamente antes do commit, apenas os novos relatório/evidências desta missão.
- Revisão própria do conteúdo/diff, seleção explícita de arquivos e `git diff --check`/`git diff --cached --check` são os controles de publicação. Mensagem autorizada: `docs(sprint-02): report mission 02.5 MVP validation.`
- O SHA documental, HEAD remoto confirmado e estado limpo após push são fornecidos na resposta final. Este relatório registra o estado anterior ao próprio commit, conforme o contrato.

### Riscos, limitações e encerramento

Esta validação é limitada ao Chromium desktop com viewport mobile, sem aparelho físico, outros navegadores, leitor de tela ou auditoria completa de acessibilidade. Não há alegação de cobertura exaustiva nem garantia de segurança mecânica. Falhas de storage são sintéticas, não quota real esgotada; a recuperação foi observada na UI real. Os testes de guardas complementam essas variantes.

Os recursos CDN existentes continuam uma dependência de rede. O console capturado não apresentou warn/error; os logs HTTP locais não comprovam individualmente cada resposta externa. Fontes/ícones/estilos foram visivelmente carregados nas capturas. O apoio acrescenta conteúdo fora de #app, portanto suas imagens de painel não são avaliação visual da aplicação normal; o layout foi avaliado nas jornadas sem painel.

As chaves de perfil das duas origens desta execução foram removidas ao encerrar, com `storage: null` registrado em `cleanup-18765`/`cleanup-18766`; somente dados sintéticos desta missão foram removidos. Overrides restaurados, viewport resetado, aba temporária fechada e três sessões de servidor interrompidas. Arquivos de apoio permanecem no diretório temporário, fora do Git.

Não houve correção automática, nova dependência, backend, IA, alteração de contrato/schema/chave, arquitetura ou organização do repositório. Não houve alteração de main, merge de PR/branches, rebase, squash, reset destrutivo, force-push, exclusão de branches auxiliares ou reescrita de histórico. A sincronização foi somente fast-forward autorizado. Trello não foi atualizado, Status não passou a Completed e nenhuma outra missão foi iniciada.

## Recomendações — não executadas

**MVP_VALIDATED_WITH_RESERVATIONS**: jornada mínima demonstrada, validações obrigatórias concluídas, sem Blocker/Critical/Major e apenas F01 Minor. Não se recomenda MVP_VALIDATED sem ressalva diante do 404 registrado. O aceite final e fechamento formal pertencem ao PO/Tech Lead.

PO/Tech Lead devem revisar matriz, capturas, achado e diff documental. Se considerarem necessário corrigir o recurso auxiliar ou revisar a linguagem histórica, devem autorizar missão posterior específica. Nenhuma melhoria foi implementada nesta execução. Trabalho encerrado na publicação documental da 02.5.
