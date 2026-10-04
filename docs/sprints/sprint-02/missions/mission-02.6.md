# Missão 02.6 — Sprint 2 Delivery Readiness & PR Preparation

> Status: Completed
> Projeto: AutoPilot AI
> Sprint: 02
> Responsáveis: PO — Wilker; Tech Lead — ChatGPT; execução — Codex
> Baseline obrigatória: `f3197cb5dae1e92aabcacee651dc3dfb315015f3`
> Branch alvo de trabalho: `feature/sprint-02-vehicle-profile`
> Base do PR: `main`
> Gate final aceito: `SPRINT_02_PR_READY_WITH_RESERVATIONS`
> Aceite PO/Tech Lead: 2026-10-04 — aprovado com ressalvas

## 1. Objetivo

Transformar o estado validado e aceito com ressalvas da Missão 02.5 em um pacote revisável de entrega da Sprint 2, consolidando evidências, pendências, coerência entre promessa de interface e capacidade real, e preparação do Pull Request.

Esta missão é de fechamento técnico e preparação de entrega. Não é uma missão de expansão funcional.

**Merge em `main` é expressamente proibido nesta missão e permanece condicionado a autorização explícita do PO.**

## 2. Contexto aprovado

A Missão 02.5 foi formalmente concluída no commit `f3197cb5dae1e92aabcacee651dc3dfb315015f3` com o gate `MVP_VALIDATED_WITH_RESERVATIONS`.

Resultados aceitos da 02.5:

- 19 testes nativos PASS;
- matriz V01–V16: 15 PASS e 1 FAIL Minor;
- AC01–AC07 PASS;
- nenhum cenário BLOCKED ou NOT APPLICABLE;
- F01 permanece conhecido: `favicon.ico` retorna 404;
- validação em Chromium desktop e viewport mobile, sem aparelho físico/outros navegadores;
- falhas de storage testadas de forma sintética;
- respostas permanecem em memória;
- cockpit não constitui diagnóstico;
- capacidades futuras não estão implementadas.

O aceite da 02.5 não converte V15 em PASS e não elimina F01.

## 3. Precondições e condição de parada

Antes de qualquer alteração, o Codex deve:

1. confirmar repositório `WilkerSantosX/AutoPilot-AI`;
2. confirmar branch `feature/sprint-02-vehicle-profile`;
3. executar fetch seguro;
4. confirmar que a baseline `f3197cb5dae1e92aabcacee651dc3dfb315015f3` é ancestral do HEAD executado;
5. confirmar upstream e relação local/remoto;
6. registrar relação entre `main` e HEAD;
7. confirmar workspace e índice limpos, salvo artefato explicitamente esperado desta missão;
8. ler `AGENTS.md`, GOV.01 e os contratos/relatórios relevantes da Sprint 2.

Se houver divergência de branch, história, baseline, alterações inesperadas, conflito com `AGENTS.md`/GOV.01 ou qualquer condição que torne inseguro prosseguir, **interromper antes da implementação e reportar ao PO/Tech Lead**.

Não resolver conflitos de produto ou governança por inferência.

## 4. Escopo obrigatório

### 4.1 Consolidar a entrega da Sprint 2

Produzir uma visão única e auditável das Missões 02.1–02.5, distinguindo explicitamente:

- IMPLEMENTED;
- VALIDATED;
- KNOWN_RESERVATION;
- PENDING;
- OUT_OF_SCOPE.

A consolidação deve responder objetivamente o que a Sprint 2 realmente entrega ao usuário e o que ela não entrega.

### 4.2 Auditoria de coerência das promessas da interface

Auditar textos, CTAs, botões, cards, labels, estados e demais affordances visíveis da jornada atual contra a capacidade efetivamente implementada.

Cada promessa relevante deve ser classificada como uma destas categorias:

- `COHERENT` — promessa corresponde à capacidade entregue;
- `FUTURE_CAPABILITY_CLEARLY_MARKED` — capacidade futura aparece de forma inequivocamente não disponível/planejada;
- `MISLEADING` — interface sugere capacidade utilizável que não existe;
- `OUT_OF_SCOPE` — capacidade está fora do escopo da Sprint e não deve ser apresentada como disponível.

Revisar obrigatoriamente no cockpit, no mínimo:

- “Diagnóstico inteligente”;
- “Plano de manutenção”;
- “Aprender sobre meu carro”;
- “Histórico”;
- “Ver dica” e a promessa associada;
- qualquer outro CTA ou copy equivalente encontrado durante a inspeção.

Também revisar Hero, landing, questionário, cadastro e mensagens de sucesso/estado quando houver promessa funcional relevante.

### 4.3 Regra para correção de promessa enganosa

Quando uma promessa for classificada como `MISLEADING`, o Codex pode realizar somente o menor ajuste necessário de copy, affordance ou estado visual para alinhar a interface à capacidade real.

Preferir, conforme o caso:

- deixar capacidade futura explicitamente marcada como futura/em breve;
- remover aparência de ação executável quando não houver ação;
- ajustar copy para não prometer diagnóstico, recomendação, histórico ou inteligência ainda inexistentes.

É proibido implementar nova feature apenas para fazer a interface cumprir a promessa.

Não implementar nesta missão:

- diagnóstico automotivo;
- plano real de manutenção;
- histórico de manutenção;
- recomendações inteligentes;
- IA externa;
- autenticação;
- múltiplos veículos;
- edição/exclusão completa de veículo;
- integrações externas;
- OBD/telemetria;
- persistência adicional de respostas;
- qualquer expansão funcional não necessária ao Delivery Readiness.

### 4.4 Ressalva F01

O achado `favicon.ico` 404 deve permanecer rastreável.

Pode ser corrigido somente se a correção for trivial, isolada, sem dependência nova e sem ampliar o escopo. Se corrigido:

- registrar explicitamente a correção;
- revalidar HTTP/console aplicável;
- não reescrever retroativamente o resultado da 02.5: V15 continua registrado como FAIL Minor naquela execução.

Se não corrigido, manter F01 como dívida conhecida não bloqueante e justificar.

### 4.5 Validação após alterações

Se qualquer arquivo de aplicação for alterado:

- executar toda a suíte nativa existente;
- executar verificações de sintaxe aplicáveis;
- validar a jornada afetada em navegador real;
- verificar console e carregamento HTTP aplicáveis;
- produzir evidência suficiente para demonstrar que o alinhamento de interface não introduziu regressão.

Não é necessário repetir artificialmente toda a matriz V01–V16 se o impacto for estritamente localizado; o relatório deve justificar a estratégia de regressão escolhida.

Se nenhum arquivo funcional for alterado, registrar explicitamente que a 02.6 foi documental/auditiva e referenciar as evidências aceitas da 02.5.

## 5. Preparação do Pull Request

Preparar, mas não fazer merge, da branch:

`feature/sprint-02-vehicle-profile` → `main`

O relatório deve fornecer um corpo de PR pronto para uso contendo:

- título recomendado;
- objetivo da Sprint 2;
- resumo das alterações;
- comportamento entregue ao usuário;
- principais decisões técnicas;
- testes e evidências;
- limitações conhecidas;
- ressalvas/dívida conhecida;
- checklist de review;
- pontos de atenção para PO/Tech Lead;
- declaração explícita de que capacidades futuras não fazem parte desta entrega.

A abertura efetiva do PR só pode ocorrer se estiver compatível com GOV.01/AGENTS.md e com as permissões desta missão. Se o protocolo vigente reservar a abertura ao Tech Lead/PO, apenas preparar o conteúdo e reportar.

**Em nenhuma hipótese executar merge, squash merge, rebase merge, atualização de `main` ou qualquer operação equivalente de integração.**

## 6. Artefato obrigatório

Criar:

`docs/sprints/sprint-02/reports/mission-02.6-report.md`

O relatório deve conter, no mínimo:

1. Executive Summary;
2. Baseline e estado Git inicial/final;
3. Sprint 2 Delivery Matrix;
4. Interface Promise Audit;
5. alterações executadas, se houver;
6. evidências e validações;
7. estado de F01;
8. pendências e dívida conhecida;
9. comparação final com `main`;
10. conteúdo recomendado do PR;
11. riscos/limitações;
12. recomendação de gate final;
13. commits publicados e HEAD remoto final.

Não usar evidências acessíveis apenas por caminhos temporários locais.

## 7. Gates finais

A execução deve recomendar exatamente um:

### `SPRINT_02_PR_READY`

Entrega coerente com o escopo, promessas de interface alinhadas, testes/evidências suficientes e nenhuma pendência relevante para revisão do PR.

### `SPRINT_02_PR_READY_WITH_RESERVATIONS`

PR pode seguir para revisão, mas há ressalvas não bloqueantes claramente registradas e rastreáveis.

### `SPRINT_02_NOT_READY`

Existe regressão, inconsistência relevante, promessa enganosa não resolvida, ausência de evidência necessária ou outro risco que impeça recomendar o PR.

Nenhum desses gates autoriza merge.

## 8. Critérios de aceite

A missão poderá ser aceita quando:

- baseline e estado Git estiverem comprovados;
- entrega 02.1–02.5 estiver consolidada sem ampliar retrospectivamente o escopo;
- promessas visíveis da interface tiverem sido auditadas;
- nenhuma capacidade não implementada parecer funcional sem sinalização adequada;
- eventuais ajustes forem mínimos e dentro do escopo;
- testes/regressões aplicáveis estiverem verdes;
- F01 estiver explicitamente resolvido ou preservado como dívida conhecida;
- relatório 02.6 estiver publicado;
- conteúdo do PR estiver preparado;
- branch/remoto estiverem em estado revisável;
- nenhum merge tiver sido executado.

## 9. Limite de conclusão da missão

A Missão 02.6 prepara a Sprint 2 para PR/review. Ela **não encerra sozinha a Sprint 2**.

O fechamento integral da Sprint continua sujeito aos gates posteriores aplicáveis, incluindo revisão do PR, Quality Gates, autorização explícita do PO para merge, integração em `main`, Sprint Review e preservação final de conhecimento conforme o processo vigente.

## 10. Handoff

Ao finalizar, o Codex deve publicar o relatório, commits autorizados e estado remoto, e devolver o handoff ao Tech Lead/PO.

O Tech Lead revisará diff, relatório, evidências, auditoria de promessa e readiness do PR. O PO decidirá sobre aceite da 02.6 e qualquer autorização posterior.

**Não executar merge sem autorização explícita do PO Wilker.**

## 11. Fechamento PO/Tech Lead

Em 2026-10-04, após revisão do relatório, evidências e diff da execução, o PO aprovou formalmente a Missão 02.6 com ressalvas.

Gate aceito: `SPRINT_02_PR_READY_WITH_RESERVATIONS`.

Ressalva preservada: F01 (`favicon.ico` 404), Minor e não bloqueante. O resultado histórico V15 da Missão 02.5 permanece inalterado.

A missão está concluída e autoriza a progressão para abertura e revisão do Pull Request da Sprint 2. Este fechamento **não autoriza merge em `main`**. Qualquer merge continua condicionado a autorização explícita posterior do PO Wilker.
