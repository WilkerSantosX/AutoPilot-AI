# Missão 03.3 — Care State Engine

> Sprint: 03 — Vehicle Care — Da memória à orientação  
> Status: **Approved**  
> Governança: GOV.01 — Mission Handoff Protocol  
> Owner: Chief Architect / Tech Lead  
> Executor: Codex / Senior Software Engineer

## 1. Baseline aprovado

A execução deve iniciar na branch `feature/sprint-03-vehicle-care`, a partir do HEAD aceito da Missão 03.2:

`724cee9adba96e8ee4c92311086175d61b766728`

Antes de alterar código, o Codex deve confirmar branch ativa, HEAD esperado, árvore de trabalho limpa e presença desta missão na branch.

## 2. Objetivo

Criar o primeiro **Care State Engine** determinístico do AutoPilot, capaz de interpretar os fatos já conhecidos sobre um veículo e produzir, para os Care Items iniciais, um estado atual e uma próxima ação coerentes com as evidências disponíveis.

Esta missão inaugura a passagem de:

`memória factual → interpretação determinística → orientação`

Ela não cria ainda a experiência de onboarding nem o cockpit final.

## 3. Intenção de produto

O AutoPilot deve começar a responder:

> **“Com o que eu sei sobre este veículo, qual é o estado deste cuidado e o que o motorista deve fazer agora?”**

A resposta deve preservar a honestidade epistemológica definida no contrato da Sprint 3:

- fato conhecido não é estimativa;
- cálculo determinístico não é observação mecânica;
- ausência de informação deve permanecer ausência de informação;
- estado de cuidado não equivale a diagnóstico de saúde mecânica.

## 4. Pré-condições

Antes da implementação, o Codex deve:

1. ler `AGENTS.md`;
2. ler `docs/governance/mission-handoff-protocol.md`;
3. ler `docs/sprints/sprint-03/sprint-contract.md`;
4. ler as Missões 03.1 e 03.2 e seus relatórios;
5. inspecionar `careModel`, `careStorage`, `odometerModel`, `odometerStorage`, `VehicleProfile` e testes relacionados;
6. confirmar que o engine pode ser implementado como lógica de domínio determinística sem nova dependência, framework ou mudança arquitetural;
7. identificar qualquer ausência de regra de negócio que obrigaria a inventar intervalos de manutenção.

Se for necessário inventar periodicidade, limite técnico ou recomendação mecânica não aprovada, parar e reportar antes da implementação.

## 5. Estados conceituais autorizados

O engine deve representar explicitamente os quatro estados conceituais mínimos aprovados no contrato da Sprint 3:

- `up-to-date` — **Em dia**;
- `due-soon` — **Atenção em breve**;
- `attention-needed` — **Atenção necessária**;
- `insufficient-information` — **Informação insuficiente**.

Os identificadores técnicos podem ser refinados se houver justificativa coerente com o repositório, mas a semântica não pode ser alterada silenciosamente.

## 6. Escopo autorizado

### 6.1 Resultado de avaliação

Criar uma representação explícita e pequena do resultado de avaliação de um Care Item.

O resultado deve ser capaz de expressar, no mínimo:

- veículo avaliado;
- Care Item avaliado;
- Care State resultante;
- Next Action resultante;
- base factual/cálculo suficiente para explicar por que aquele estado foi produzido;
- distinção explícita quando a informação for insuficiente.

O engine não precisa persistir o Care State como nova fonte de verdade. Preferencialmente, o estado deve ser derivado deterministicamente dos fatos persistidos, salvo se a inspeção do repositório demonstrar necessidade diferente dentro do escopo.

### 6.2 Informação insuficiente

A ausência de histórico confiável deve resultar em `insufficient-information`, nunca em um estado artificialmente saudável ou atrasado.

Quando possível, a Next Action deve transformar a lacuna em orientação concreta, por exemplo:

- informar/confirmar histórico conhecido;
- registrar um novo cuidado para estabelecer marco confiável;
- atualizar a quilometragem quando ela for necessária para avaliar o cuidado.

A ação deve permanecer genérica ao domínio e não antecipar a interface da 03.4/03.5.

### 6.3 Regras determinísticas e referências

O engine pode usar somente referências explicitamente disponíveis no domínio aprovado ou introduzidas nesta missão como **política determinística claramente versionada e justificada**.

Não é autorizado inventar intervalos específicos de troca/revisão com aparência de recomendação universal do fabricante.

Se os Care Items `engine-oil`, `cooling` ou `basic-review` ainda não possuírem referência suficiente para classificar com segurança `up-to-date`, `due-soon` e `attention-needed`, o Codex deve:

1. implementar a infraestrutura de avaliação e o caminho de `insufficient-information` que forem inequivocamente possíveis;
2. parar antes de inventar números;
3. produzir relatório GOV.01 indicando exatamente qual decisão de produto/domínio é necessária para completar os demais estados.

Uma regra somente pode produzir estado positivo/alerta quando os fatos necessários e a política aplicável forem conhecidos.

### 6.4 Uso de Care Events

O engine deve conseguir considerar Care Events válidos do veículo e do Care Item correto.

Eventos de outro veículo ou outro Care Item não podem contaminar a avaliação.

Quando múltiplos eventos válidos existirem, a seleção do evento factual relevante deve ser determinística e não depender da ordem de inserção.

Não inferir que um evento significa algo além de sua semântica factual registrada.

### 6.5 Uso de Odometer Checkpoints

Quando uma regra depender de quilometragem, o engine deve utilizar a leitura factual mais recente conhecida conforme a fundação da 03.2.

Não usar `recordedAt` como se fosse a data factual da quilometragem.

Não estimar quilometragem atual, média de uso ou quilometragem futura.

Se a regra exigir quilometragem e não houver leitura factual suficiente, o resultado deve refletir informação insuficiente e orientar a obtenção do dado necessário.

### 6.6 Next Action

Introduzir uma representação determinística de **Next Action** suficiente para o domínio da Sprint 3.

A Next Action deve responder semanticamente “o que fazer agora?” sem diagnosticar defeitos.

Ela pode representar ações como:

- fornecer informação faltante;
- atualizar quilometragem;
- registrar cuidado realizado/estabelecer novo marco;
- acompanhar, quando nenhuma intervenção imediata for necessária.

Não implementar navegação, CTA visual, notificações ou automações nesta missão.

### 6.7 Testes

Adicionar testes automatizados focados, sem novas dependências.

No mínimo, validar:

- os quatro Care States como valores válidos do domínio;
- resultado determinístico para informação insuficiente;
- Next Action coerente com a lacuna conhecida;
- isolamento por veículo e Care Item;
- seleção determinística do Care Event relevante;
- uso correto da leitura de odômetro mais recente quando aplicável;
- ausência de estimativa quando falta quilometragem;
- ausência de diagnóstico mecânico;
- rejeição/handling seguro de entradas inválidas;
- preservação dos contratos de Care Event, Odometer Checkpoint e VehicleProfile;
- regressão completa da suíte existente;
- cenários de `up-to-date`, `due-soon` e `attention-needed` somente se houver política determinística aprovada suficiente para produzi-los.

## 7. Fora do escopo / limites

Esta missão **não autoriza**:

- Care Onboarding;
- alterações de cockpit;
- formulários ou CTAs de interface;
- Care Loop completo;
- notificações ou lembretes;
- previsão de data futura baseada em padrão de uso;
- média de quilômetros por dia/mês;
- GPS/background tracking;
- OBD-II ou telemetria;
- diagnóstico mecânico;
- afirmações de “motor saudável”, “sistema de arrefecimento saudável” ou equivalentes;
- recomendação de oficina;
- marketplace;
- biblioteca completa de manutenção;
- regras específicas por fabricante/modelo sem fonte e contrato apropriados;
- machine learning ou LLM;
- backend/cloud sync;
- novas dependências/frameworks;
- refatorações incidentais fora do mínimo necessário;
- início antecipado das Missões 03.4+.

## 8. Critérios de aceite

A Missão 03.3 é tecnicamente aceitável quando houver evidência de que:

1. existe representação explícita dos quatro Care States aprovados;
2. existe resultado de avaliação determinístico por veículo/Care Item;
3. informação ausente nunca é transformada em certeza artificial;
4. o resultado consegue expressar uma Next Action coerente;
5. Care Events são considerados apenas dentro do veículo/Care Item correto;
6. Odometer Checkpoints são utilizados factual e deterministicamente quando necessários;
7. nenhum cálculo é apresentado como observação ou diagnóstico mecânico;
8. a avaliação independe da ordem de inserção dos fatos equivalentes;
9. entradas inválidas falham com segurança;
10. contratos das Missões 03.1 e 03.2 permanecem compatíveis;
11. testes focados e regressão passam;
12. nenhuma capacidade de 03.4+ foi antecipada;
13. `up-to-date`, `due-soon` e `attention-needed` somente são produzidos quando houver política explicitamente suportada; caso contrário, o bloqueio GOV.01 é reportado sem invenção de regra.

## 9. Validação obrigatória

O Codex deve, no mínimo:

- executar toda a suíte automatizada disponível relevante ao repositório;
- validar sintaxe dos JavaScript alterados e relacionados;
- executar `git diff --check`;
- revisar o diff final procurando vazamento de escopo;
- verificar que a aplicação continua iniciando/servindo pelo workflow existente quando praticável;
- verificar console do navegador quando houver execução da aplicação;
- registrar problemas preexistentes separadamente, sem expandir escopo para corrigi-los.

## 10. Regras Git e publicação

Nesta missão, o Codex está autorizado a:

- alterar somente arquivos necessários ao escopo aprovado na branch `feature/sprint-03-vehicle-care`;
- criar o relatório em `docs/sprints/sprint-03/reports/mission-03.3-report.md`;
- após validação bem-sucedida, fazer commit da implementação e do relatório;
- publicar o commit em `origin/feature/sprint-03-vehicle-care`.

Mensagem sugerida:

`feat(vehicle-care): add deterministic care state engine`

Não está autorizado a:

- alterar/publicar diretamente em `main`;
- realizar merge;
- rebase, squash, force-push ou reescrita de histórico;
- iniciar a Missão 03.4.

## 11. Condições de parada

Parar e reportar antes de improvisar se:

- houver conflito documental;
- branch/baseline estiver incorreto;
- for necessário quebrar contratos existentes;
- for necessária mudança arquitetural ou nova dependência;
- não houver regra aprovada suficiente para determinar limites de `up-to-date`, `due-soon` ou `attention-needed`;
- for necessário inventar periodicidade universal de manutenção;
- surgir ambiguidade entre fato, cálculo, estimativa e desconhecido;
- for necessário diagnosticar condição mecânica;
- o escopo precisar crescer;
- surgir risco de integridade ou segurança não coberto.

Em bloqueio, produzir o relatório GOV.01 com evidência, informar se houve alteração/commit/push e declarar explicitamente a decisão necessária do PO/Tech Lead.

## 12. Relatório obrigatório

Persistir em:

`docs/sprints/sprint-03/reports/mission-03.3-report.md`

O relatório deve conter, no mínimo:

1. estado inicial da branch e HEAD;
2. inspeção dirigida das fundações 03.1/03.2;
3. implementação realizada;
4. arquivos criados/modificados;
5. modelo de Care State e Next Action adotado;
6. regras determinísticas efetivamente implementadas e origem/justificativa de cada uma;
7. comportamento para informação insuficiente;
8. critérios de aceite avaliados item a item;
9. testes/comandos e resultados;
10. resumo do diff;
11. estado Git final e SHA;
12. riscos, limitações e pendências;
13. confirmação explícita de que não houve estimativa, diagnóstico ou antecipação da 03.4+;
14. se bloqueado por falta de política, decisão exata requerida do PO/Tech Lead.

Manter **Fatos**, **Decisões** e **Recomendações** distinguíveis conforme `AGENTS.md`.

## 13. Gate de conclusão

A execução pelo Codex não encerra formalmente a missão.

Após o push, o Tech Lead revisará relatório, diff, evidências e estado final. A missão somente será considerada concluída após aceite explícito do PO.

Não iniciar a Missão 03.4 sem autorização.
