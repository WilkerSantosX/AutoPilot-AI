# Missão 02.4 — Meu cockpit: veículo e respostas reais

> Status: Draft
> Projeto: AutoPilot AI
> Sprint: 02
> Responsáveis: PO — Wilker; Tech Lead — ChatGPT; execução — Codex
> Protocolo: docs/governance/mission-handoff-protocol.md
> Aprovação: pendente de aceite explícito do PO para este recorte.
> Este documento não autoriza execução enquanto permanecer Draft.

## Objetivo

Completar o primeiro percurso Meu veículo → minhas respostas → experiência coerente → meu cockpit.
O cockpit deve apresentar o veículo cadastrado e resumir o objetivo e a urgência declarados na sessão.
A experiência deve descrever organização de informações, sem alegar diagnóstico ou segurança do veículo.

## Baseline e precondições

- Repositório: WilkerSantosX/AutoPilot-AI.
- Branch exclusiva: feature/sprint-02-vehicle-profile.
- Baseline funcional aceita da 02.3: d87bb2031c36aa7a7487aca33e7721df23fd9d91.
- GOV.01 publicada: 55403775d1409f4969821987fc9ac211b58ef173.
- Antes de implementar, ler AGENTS.md, o protocolo e os documentos exigidos por AGENTS.md, respeitando sua precedência.
- Registrar status, branch, HEAD, upstream e relação com origin/main; fazer fetch e sincronizar somente por fast-forward seguro na branch ativa, com workspace limpo e sem commits locais divergentes.
- Confirmar ambos os SHAs como ancestrais do HEAD e a presença da versão Approved desta missão.
- Registrar o SHA exato do contrato Approved usado na execução. Se houver mudanças remotas inesperadas, divergência ou alterações locais alheias, parar e reportar.

## Fatos observados na preparação

- router.js já exige perfil válido para o questionário e armazena respostas da sessão em AppState.answers.
- O cockpit ainda recebe Wilker e Renault Clio fixos.
- CockpitScreen.js afirma Veículo estável e ausência de situação crítica sem cálculo que sustente essas conclusões.
- HeroScreen.js apresenta animação de análise simulada.
- O questionário contém seleção do veículo, objetivo e urgência. Não coleta nome do usuário.
- A 02.3 não integrou Hero/Cockpit nem persistiu respostas.

## Escopo proposto para aprovação

1. Reutilizar loadVehicleProfile/isVehicleProfile e a chave autopilot.vehicle-profile.v1 como única fonte persistente do veículo.
2. Passar ao cockpit os dados reais do perfil válido e as respostas reais da sessão, sem criar cópia persistente de veículo ou respostas.
3. Mostrar fabricante, modelo, ano e motor; apresentar quilometragem preservando zero. Apelido, se usado, é complementar à identificação.
4. Remover o nome pessoal fixo: usar saudação neutra, pois não há cadastro de usuário.
5. Mostrar objetivo e urgência com seus rótulos do questionário. Urgência é autodeclaração do usuário, não classificação mecânica.
6. Substituir o status fictício por resumo factual: informações recebidas/organizadas; informar que o resumo não constitui diagnóstico.
7. Ajustar somente os textos do Hero necessários à coerência: organizar respostas e preparar resumo. Preservar a transição existente; não simular detecção de falhas ou orientação inteligente.
8. Proteger entrada em Hero/Cockpit: perfil ausente, inválido ou erro de leitura encaminha ao cadastro; respostas ausentes/incompletas/inválidas encaminham ao início do questionário, sem inventar valores padrão.
9. Se o perfil mudar durante a sessão, invalidar respostas anteriores antes de mostrar o cockpit. É autorizado guardar apenas o identificador do perfil em memória para vincular a sessão, sem duplicar o objeto do veículo.
10. Preservar reset da jornada e substituição do veículo; reload continua voltando à landing, mantém veículo e inicia novas respostas.
11. Renderizar todos os dados dinâmicos como texto seguro.
12. Ajustes locais mínimos em router.js, telas Hero/Cockpit e estilos existentes se necessários; testes nativos sem novas dependências. Alterações em assinaturas internas dessas telas e seus chamadores estão autorizadas exclusivamente para passar este contexto.

## Fora de escopo

Backend, banco, autenticação, múltiplos veículos, OBD-II, APIs, IA real, diagnóstico, pontuação de saúde, classificação de segurança/criticidade, recomendação mecânica, manutenção calculada, persistência de respostas, retomada de sessão após reload, novos módulos de produto, redesign amplo e novas dependências.
Não implementar as ações futuras dos cartões do cockpit; não criar serviços genéricos, novos frameworks, novas camadas ou reorganizar o repositório.
Não reescrever Router/Question Engine nem alterar schema/chave do VehicleProfile.
Não executar 02.5/02.6, atualizar Trello ou alterar documentos históricos como parte da implementação.

## Critérios de aceite

| ID | Cenário | Resultado esperado |
|---|---|---|
| AC01 | Perfil Toyota/Honda diferente do exemplo original | Identificação real no cockpit; nenhum Wilker/Clio como fallback |
| AC02 | Quilometragem zero | Exibe zero, sem valor falso ou ausência |
| AC03 | Objetivos e urgências diferentes | Resumo muda conforme respostas; não infere diagnóstico |
| AC04 | Hero → cockpit | Organização/resumo coerentes, sem alegar análise mecânica |
| AC05 | Conteúdo do status | Sem Veículo estável, ausência de criticidade ou garantia de tranquilidade |
| AC06 | Entrada sem contexto completo | Cadastro/questionário recuperáveis; cockpit não exibe dados inventados |
| AC07 | Escolher outro e concluir nova sessão | Somente novo veículo e novas respostas aparecem |
| AC08 | Perfil alterado durante sessão | Respostas antigas invalidadas antes da apresentação |
| AC09 | Reload e nova entrada | Veículo persiste; respostas devem ser refeitas |
| AC10 | Texto com aspas, &, tags e payload HTML | Exibido literalmente; sem injeção em HTML/atributos |
| AC11 | Regressão da 02.3 | Cadastro, falha de storage, nova tentativa e reset preservados |
| AC12 | Desktop/mobile | Resumo legível, sem cortes ou overflow na largura testada |

## Validação obrigatória

- Inspeção dirigida do formato real das respostas/Engine antes das alterações. Não presumir shape nem mudar o contrato do Engine.
- Registrar plano local no relatório e executar apenas este recorte.
- Executar todos os testes nativos existentes e testes significativos para integração do contexto, entradas inválidas, troca de perfil e renderização segura.
- Validar sintaxe JS/MJS, git diff --check e revisão do diff.
- Iniciar aplicação por HTTP local e testar cadastro → perguntas → Hero → cockpit com ao menos dois veículos e combinações distintas de respostas.
- Verificar reload, substituição e visualização desktop/mobile; consultar console do navegador.
- Distinguir evidências automatizadas das observações de navegador. Se navegador ou outra validação obrigatória estiver indisponível, reportar como pendente e não declarar aceite completo.

## Git e publicação — vigentes somente após Approved

- Autoriza commit/push exclusivamente da implementação deste recorte e de seu relatório na branch feature/sprint-02-vehicle-profile, após validações bem-sucedidas.
- Não alterar main, fazer merge/rebase/squash, reset destrutivo, force-push, excluir branches ou reescrever histórico.
- Selecionar arquivos explicitamente; não incluir mudanças alheias.
- Publicar implementação primeiro com mensagem feat(cockpit): personalize cockpit with vehicle and session answers.
- Depois registrar o SHA funcional no relatório e publicá-lo em commit documental separado: docs(sprint-02): report mission 02.4 execution.
- Evitar autorreferência: o relatório contém SHA funcional e estado anterior ao seu commit; a resposta final do Codex informa também o SHA documental e o HEAD remoto confirmado.
- Confirmar status limpo, upstream e sincronização local/remota após publicação. Se push falhar, reportar estado local/remoto sem contornar restrições.
- Não alterar Status para Completed: fechamento cabe ao PO/Tech Lead após revisão. Não avançar à próxima missão.

## Condições de parada

Todas as condições de AGENTS.md e GOV.01 aplicam-se.
Parar diante de contrato ainda Draft, baseline ausente, conflito documental, divergência Git, mudanças locais alheias, necessidade de ampliar escopo, dependência nova ou alteração arquitetural.
Falha de validação deve ser corrigida dentro do recorte; se exigir expansão, parar e reportar. Não publicar como sucesso com validação obrigatória pendente.
Em bloqueio, informar evidência, arquivos alterados, commit/push realizado ou não e decisão necessária.

## Relatório esperado

Caminho: docs/sprints/sprint-02/reports/mission-02.4-report.md.

Separar fatos, decisões e recomendações. Incluir:
- Estado inicial, SHAs ancestrais e SHA do contrato Approved.
- Inspeção dirigida e plano anterior às alterações.
- Implementação e arquivos criados/modificados.
- Fonte de verdade do veículo e vínculo das respostas à sessão.
- Matriz AC01–AC12 com resultado/evidência ou pendência explícita.
- Comandos de testes, sintaxe, HTTP, navegador, console e revisão do diff.
- Resumo do diff e SHA funcional.
- Estado Git anterior ao commit documental, riscos e limitações.
- Confirmação dos limites e parada ao final.
- Recomendações futuras separadas, sem executá-las.

## Revisão e fechamento

Codex entrega URLs do commit funcional, relatório e HEAD documental.
ChatGPT revisa diretamente o relatório, diff e estado remoto; PO/Tech Lead aceitam ou solicitam correção.
Somente após aceite formal a missão passa a Completed e o Trello reflete conclusão.
