# Missão 02.5 — Validação integrada do MVP

> Status: Draft
> Projeto: AutoPilot AI
> Sprint: 02
> Responsáveis: PO — Wilker; Tech Lead — ChatGPT; execução — Codex
> Protocolo: docs/governance/mission-handoff-protocol.md
> Aprovação conceitual: PO Wilker em 2026-10-04 (America/Sao_Paulo).
> Draft não executável. A execução depende da promoção explícita para Approved.

## Objetivo

Validar o percurso Meu veículo → minhas respostas → experiência coerente → meu cockpit como experiência de produto integrada. Produzir evidências, achados reproduzíveis e recomendação de gate. Validar não autoriza corrigir.

## Baseline e precondições

- Repositório: WilkerSantosX/AutoPilot-AI.
- Branch exclusiva: feature/sprint-02-vehicle-profile.
- Implementação aceita da 02.4: 7267b25aa21b998fc4df92b67f03e00f64de1530.
- Relatório da 02.4: commit 353435a236c17dc87eb313bcc76714c9a06e3bae.
- Exigir mission-02.4.md em Completed e ler seu fechamento formal.
- Ler AGENTS.md, GOV.01 e documentação exigida por AGENTS.md, respeitando a precedência.
- Registrar branch, HEAD, upstream, status e relação com origin/main; fazer fetch e sincronizar apenas por fast-forward seguro com workspace limpo e sem divergência local.
- Confirmar os dois SHAs acima como ancestrais do HEAD. Registrar SHA exato do contrato Approved e SHA do código efetivamente validado.
- Parar diante de alterações locais alheias, divergência ou mudança remota inesperada.

## Comportamentos aceitos da baseline

- Veículo persiste exclusivamente no schema/chave existentes do VehicleProfile.
- Respostas permanecem em memória; reload retorna à landing, mantém veículo e inicia nova jornada.
- Quilometragem válida é inteira e maior ou igual a zero. A resolução explícita da 02.4 é preservada nesta validação, inclusive em relação à regra histórica > 0; não há nova alteração numérica.
- Cockpit organiza dados declarados, sem diagnóstico, pontuação de saúde ou garantia de segurança.
- Ações futuras dos cartões não estão implementadas.
- Esses limites não constituem defeitos por si só. Divergências do comportamento contratado devem ser registradas.

## Escopo autorizado

Inspeção dirigida, execução de testes nativos existentes, inicialização HTTP local, validação real em navegador desktop/mobile, manipulação de dados sintéticos no ambiente de teste e produção do relatório/evidências.
Usar ambiente isolado de teste e dados fictícios; não sobrescrever dados pessoais.
Não modificar código de aplicação, testes versionados, dependências, configuração ou documentos históricos.
Scripts temporários de apoio sem novas dependências podem ser usados fora do conteúdo versionado; registrar seus comandos/método quando relevantes para reprodução.
Alterações versionadas permitidas ao executor: somente relatório e evidências documentais desta missão, sob reports/.
Não usar inspeção de código ou testes unitários como substitutos silenciosos da observação em navegador.

## Matriz obrigatória

Cada linha exige passos, dados de entrada, esperado, observado e evidência. Desdobrar variantes quando necessário.

| ID | Cenário | Resultado esperado |
|---|---|---|
| V01 | Estado inicial sem perfil: landing → cadastro → questionário → Hero → cockpit | Percurso completo recuperável, sem dados fictícios |
| V02 | Segundo veículo e combinação distinta de objetivo/urgência | Identificação e resumo refletem somente o contexto atual |
| V03 | Quilometragem zero e inteira positiva | Valores preservados no cadastro, storage e cockpit |
| V04 | Campos obrigatórios ausentes, quilometragem negativa/fracionária | Rejeição conforme validador atual, sem submissão inválida |
| V05 | Reload após cadastro, durante questionário e no cockpit | Perfil mantido; landing e novas respostas, sem retomada artificial |
| V06 | Escolher outro veículo e concluir nova jornada | Somente novo perfil e novas respostas |
| V07 | Perfil alterado durante sessão | Respostas anteriores invalidadas antes do cockpit |
| V08 | Entrada em Hero/cockpit sem perfil ou respostas completas/válidas | Encaminhamento seguro ao cadastro/questionário conforme contexto |
| V09 | Storage ausente, JSON corrompido, schema/perfil inválido | Recuperação conforme contrato; sem crash ou fallback inventado |
| V10 | Erro de leitura/escrita do storage e nova tentativa | Falha controlada; sem falso sucesso; recuperação observável |
| V11 | Interromper/reiniciar jornada; reset e navegação disponíveis | Estado coerente; fluxo anterior preservado |
| V12 | Aspas, &, caracteres especiais, tags e payload HTML inerte | Texto literal seguro, sem execução/injeção |
| V13 | Hero e status/resumo do cockpit | Organização factual; sem diagnóstico fictício ou inferência mecânica |
| V14 | Desktop e mobile em jornadas completas | Conteúdo legível, controles acessíveis, sem cortes/overflow impeditivos |
| V15 | Console, carregamento HTTP e recursos da aplicação | Sem erros atribuíveis ao percurso; ocorrências documentadas |
| V16 | Suíte nativa e regressão das 02.3/02.4 | Resultados completos registrados e regressões classificadas |

Usar ao menos duas larguras, uma desktop e uma mobile; registrar dimensões, navegador e versão. Usar ao menos dois veículos e combinações distintas de respostas.
Cenários por injeção controlada de estado devem indicar o método e separar observação de UI, teste automatizado e inspeção estática.

## Resultados e achados

Resultados: PASS, FAIL, BLOCKED ou NOT APPLICABLE.
BLOCKED significa validação não concluída; nunca equivale a PASS.
NOT APPLICABLE exige justificativa técnica demonstrável; indisponibilidade de ferramenta não torna cenário inaplicável.

Para cada achado: ID, severidade, cenário, ambiente, passos reproduzíveis, esperado/observado, evidências, impacto no MVP e eventual alternativa de uso observada.

- Blocker: impede iniciar/concluir a jornada mínima, sem alternativa.
- Critical: perda/corrupção relevante de contexto ou exposição/execução insegura.
- Major: falha funcional/coerência relevante, ainda com alternativa de uso.
- Minor: problema localizado de texto/apresentação/UX sem impedir a jornada.

Um defeito comum permite registrar, reproduzir e continuar cenários independentes quando seguro. Nunca corrigir automaticamente.
Risco de segurança aciona a parada de AGENTS.md: registrar evidência mínima segura, interromper e devolver a decisão. Não explorar além do necessário.

## Critérios de aceite da execução

- AC01: baseline, contrato e ambiente rastreáveis.
- AC02: todas as linhas V01–V16 têm resultado e evidência/justificativa.
- AC03: observação real do percurso em desktop/mobile e com dois contextos documentada.
- AC04: suíte nativa, console e inicialização HTTP registrados, com limitações explícitas.
- AC05: achados classificados e reproduzíveis; limites conhecidos separados de defeitos.
- AC06: código de aplicação preservado e diff restrito ao relatório/evidências.
- AC07: recomendação de gate fundamentada e estado Git remoto confirmado.

Completar o relatório não significa validar o MVP. Pendências obrigatórias impedem aceite completo.

## Recomendação de gate

- MVP_VALIDATED: cenários aplicáveis obrigatórios concluídos com PASS, sem defeitos ou pendências obrigatórias.
- MVP_VALIDATED_WITH_RESERVATIONS: jornada mínima demonstrada, sem Blocker/Critical/Major, com achados apenas Minor e sem validação obrigatória pendente.
- MVP_NOT_VALIDATED: qualquer Blocker/Critical/Major, jornada não demonstrada ou validação obrigatória BLOCKED/pendente.

Gate é recomendação do executor. Aceite final pertence ao PO/Tech Lead.

## Git e publicação — vigentes somente após Approved

Autoriza commit/push apenas do relatório e evidências desta validação na branch indicada, inclusive relatório com achados ou limitações honestamente documentados.
Não criar commit funcional nem alterar Status para Completed.
Selecionar arquivos explicitamente; revisar diff e executar git diff --check.
Mensagem: docs(sprint-02): report mission 02.5 MVP validation.
Relatório registra SHA validado e estado anterior ao próprio commit; resposta final fornece SHA documental, URL do relatório e HEAD remoto confirmado.
Confirmar workspace limpo, upstream e sincronização local/remota.
Não alterar main, fazer merge/rebase/squash, excluir branches, reset destrutivo, force-push ou reescrever histórico.
Não usar nem remover as branches auxiliares existentes como parte desta missão.
Se precondição/condição de parada impedir execução, reportar bloqueio sem contornar a restrição ou declarar sucesso.

## Condições de parada

Aplicam-se AGENTS.md e GOV.01.
Parar diante de Draft, conflito documental não resolvido, baseline ausente, divergência Git, mudanças alheias, risco de segurança, necessidade de nova dependência, alteração arquitetural/contratual ou expansão de escopo.
Defeitos comuns são achados de validação, não autorização de correção.
Ferramenta obrigatória indisponível: registrar BLOCKED e a limitação, sem inventar evidência; continuar somente verificações independentes permitidas.
Informar arquivos alterados, commit/push realizado ou não e decisão necessária.

## Relatório esperado

Caminho: docs/sprints/sprint-02/reports/mission-02.5-report.md.
Evidências complementares, se necessárias: docs/sprints/sprint-02/reports/mission-02.5-evidence/.

Separar fatos, decisões e recomendações. Incluir estado Git inicial; baseline e SHA do contrato; plano de validação; ambiente, dados e métodos; matriz V01–V16 e AC01–AC07; comandos/resultados; screenshots pertinentes de navegador; achados e severidades; riscos/limitações; arquivos criados/modificados e resumo do diff; estado anterior ao commit documental; gate fundamentado; confirmação de nenhuma correção funcional e parada ao final.
Evidências devem estar acessíveis ao revisor; não usar caminhos temporários locais como única prova. Não incluir dados pessoais, credenciais ou dumps desnecessários.

## Revisão e fechamento

Tech Lead revisa relatório, evidências, diff e estado remoto. PO/Tech Lead decidem aceite e próximos passos.
Somente após aceite formal o contrato poderá passar a Completed.
Correções poderão compor missão posterior explicitamente aprovada; não executar 02.5.x/02.6 nem atualizar Trello nesta validação.
