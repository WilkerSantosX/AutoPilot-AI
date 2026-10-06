# Missão 03.3 — Care State Engine

> Sprint: 03 — Vehicle Care — Da memória à orientação  
> Status: **Approved — decisão de domínio complementar aprovada pelo PO**  
> Governança: GOV.01 — Mission Handoff Protocol  
> Owner: Chief Architect / Tech Lead  
> Executor: Codex / Senior Software Engineer

## 1. Baseline aprovado

A execução original iniciou a partir do baseline aceito da Missão 03.2:

`724cee9adba96e8ee4c92311086175d61b766728`

A primeira entrega parcial autorizada da 03.3 foi publicada em:

`c36ab3593ef20cfdd6aa79f66bc12ef3fb549f51`

Esse commit implementou a infraestrutura segura do Care State Engine e interrompeu corretamente a classificação positiva/alerta por ausência de política aprovada.

A presente revisão do contrato resolve explicitamente esse bloqueio de domínio. O Codex deve sincronizar a branch `feature/sprint-03-vehicle-care` com o commit que contém esta revisão antes de retomar a implementação.

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

### 3.1 Princípio aprovado de Care State

> **Care State representa o estado do acompanhamento em relação a uma referência conhecida; não representa a condição mecânica do veículo.**

Portanto, atingir uma referência registrada significa que o acompanhamento requer ação em relação àquela referência. Não significa, por si só, que exista defeito, desgaste comprovado ou condição mecânica insegura.

## 4. Pré-condições

Antes de retomar a implementação, o Codex deve:

1. ler `AGENTS.md`;
2. ler `docs/governance/mission-handoff-protocol.md`;
3. ler `docs/sprints/sprint-03/sprint-contract.md`;
4. ler as Missões 03.1 e 03.2 e seus relatórios;
5. ler o relatório parcial atual da Missão 03.3;
6. inspecionar a implementação parcial do Care State Engine em `c36ab3593ef20cfdd6aa79f66bc12ef3fb549f51`;
7. confirmar que esta revisão do contrato é posterior ao commit parcial e resolve o bloqueio de política registrado;
8. confirmar que a continuação pode ocorrer sem nova dependência, framework ou mudança arquitetural.

Se surgir conflito diferente daquele explicitamente resolvido nesta revisão, parar e reportar.

## 5. Estados conceituais autorizados

O engine deve representar explicitamente os quatro estados conceituais mínimos aprovados no contrato da Sprint 3:

- `up-to-date` — **Em dia**;
- `due-soon` — **Atenção em breve**;
- `attention-needed` — **Atenção necessária**;
- `insufficient-information` — **Informação insuficiente**.

A semântica desses estados é de **acompanhamento**, nunca de diagnóstico mecânico.

## 6. Escopo autorizado

### 6.1 Resultado de avaliação

O resultado deve expressar, no mínimo:

- veículo avaliado;
- Care Item avaliado;
- Care State resultante;
- Next Action resultante;
- base factual e cálculo suficiente para explicar o estado;
- referência utilizada e sua origem;
- distinção explícita quando a informação for insuficiente.

O Care State deve permanecer derivado deterministicamente dos fatos e da política aplicável, não persistido como nova fonte de verdade.

### 6.2 Informação insuficiente

A ausência de histórico ou de referência confiável deve resultar em `insufficient-information`, nunca em estado artificialmente saudável ou atrasado.

Quando possível, a Next Action deve transformar a lacuna em orientação concreta, por exemplo:

- informar/confirmar histórico conhecido;
- informar a próxima referência conhecida;
- registrar um novo cuidado para estabelecer marco confiável;
- atualizar a quilometragem quando necessária para avaliar o cuidado.

### 6.3 Política aprovada para o MVP

Para o recorte atual da Sprint 3, o AutoPilot **não inventará periodicidade de manutenção**.

A política inicial deve acompanhar uma **próxima referência explícita de quilometragem**, conceitualmente `nextDueMileage`, informada pelo usuário.

A referência deve possuir origem explícita. Para este MVP, a origem autorizada é:

- `user` — referência explicitamente informada pelo usuário.

O modelo deve preservar caminho de evolução para origens futuras, como fabricante ou orientação do AutoPilot, mas **essas origens não devem ser implementadas como fontes ativas nesta missão**.

Uma referência pontual não deve ser automaticamente transformada em periodicidade permanente. Exemplo: se um cuidado ocorreu aos 80.000 km e a próxima referência informada é 90.000 km, o sistema não deve assumir silenciosamente que todo ciclo futuro será de 10.000 km.

### 6.4 Marco factual da política

Para avaliar uma referência de quilometragem são necessários:

- um Care Event factual relevante que estabeleça o marco do cuidado;
- quilometragem factual desse marco;
- `nextDueMileage` explicitamente conhecida;
- leitura factual atual/mais recente de odômetro quando necessária para posicionar o veículo em relação à referência.

Deve valer:

`nextDueMileage > milestoneMileage`

Referências iguais ou inferiores ao marco são inválidas para esta política e devem falhar com segurança, sem gerar estado artificial.

Não inferir `nextDueMileage` a partir de eventos anteriores.

### 6.5 Regra de 10% — Atenção em breve

Decisão aprovada pelo PO:

> **A faixa `due-soon` corresponde aos 10% finais do intervalo entre a quilometragem do marco e a próxima referência explícita.**

Definições conceituais:

`interval = nextDueMileage - milestoneMileage`

`attentionWindow = interval * 0.10`

`dueSoonThreshold = nextDueMileage - attentionWindow`

Classificação:

- `currentMileage < dueSoonThreshold` → `up-to-date`;
- `currentMileage >= dueSoonThreshold` e `currentMileage < nextDueMileage` → `due-soon`;
- `currentMileage >= nextDueMileage` → `attention-needed`.

A implementação deve evitar ambiguidade de ponto flutuante e definir deterministicamente os limites para quilometragens inteiras. A escolha técnica de arredondamento deve ser documentada no relatório e coberta por testes de fronteira, sem alterar a intenção de produto de “10% finais”.

Exemplo normativo simples:

- marco: 80.000 km;
- próxima referência: 90.000 km;
- intervalo: 10.000 km;
- faixa final de 10%: 1.000 km;
- até 88.999 km → `up-to-date`;
- de 89.000 a 89.999 km → `due-soon`;
- a partir de 90.000 km → `attention-needed`.

Essa regra determina **quando alertar em relação a uma referência já conhecida**. Ela não determina quando óleo, arrefecimento ou revisão deveriam ocorrer tecnicamente.

### 6.6 Uso de Care Events

O engine deve considerar Care Events válidos apenas do veículo e Care Item corretos.

Quando múltiplos eventos válidos existirem, a seleção do marco factual relevante deve ser determinística e independente da ordem de inserção.

Não inferir que um evento significa algo além de sua semântica factual registrada.

### 6.7 Uso de Odometer Checkpoints

Quando a avaliação depender da quilometragem atual, utilizar a leitura factual mais recente conhecida conforme a fundação da 03.2.

Não usar `recordedAt` como data factual da leitura.

Não estimar quilometragem atual, média de uso, velocidade de consumo da referência ou data futura em que a referência será atingida.

Se faltar leitura factual necessária, retornar `insufficient-information` com Next Action apropriada.

### 6.8 Next Action

A Next Action deve responder semanticamente “o que fazer agora?” sem diagnosticar defeitos.

Para esta política, deve haver comportamento determinístico equivalente a:

- `insufficient-information` → obter a informação/referência faltante ou estabelecer novo marco;
- `up-to-date` → acompanhar;
- `due-soon` → preparar-se para a referência que se aproxima;
- `attention-needed` → agir em relação à referência atingida e, após o cuidado, registrar novo marco.

Os identificadores técnicos exatos podem seguir as convenções do módulo. Não implementar navegação, CTA visual, notificações ou automações nesta missão.

### 6.9 Transparência da origem

O resultado da avaliação deve preservar evidência suficiente para que camadas futuras possam comunicar algo equivalente a:

> “Referência informada por você.”

Não é necessário implementar esse texto na UI nesta missão.

O domínio não deve apresentar uma referência `user` como recomendação do fabricante ou do AutoPilot.

### 6.10 Testes

Adicionar/atualizar testes automatizados focados, sem novas dependências.

No mínimo, validar:

- os quatro Care States;
- `insufficient-information` sem histórico;
- `insufficient-information` sem `nextDueMileage`;
- referência com origem `user`;
- rejeição de referência igual ou inferior ao marco;
- `up-to-date` antes da faixa de 10%;
- fronteira exata de entrada em `due-soon`;
- `due-soon` dentro dos 10% finais;
- fronteira exata de `nextDueMileage` produzindo `attention-needed`;
- valor acima da referência permanecendo `attention-needed`;
- intervalos cuja faixa de 10% não resulte em número inteiro, cobrindo a regra técnica de arredondamento adotada;
- isolamento por veículo e Care Item;
- seleção determinística do Care Event relevante;
- uso da leitura factual mais recente do odômetro;
- ausência de estimativa quando faltar quilometragem;
- ausência de inferência de periodicidade futura;
- ausência de diagnóstico mecânico;
- entradas inválidas falhando com segurança;
- preservação dos contratos de Care Event, Odometer Checkpoint e VehicleProfile;
- regressão completa da suíte existente.

## 7. Fora do escopo / limites

Esta missão **não autoriza**:

- Care Onboarding;
- alterações de cockpit;
- formulários ou CTAs de interface;
- Care Loop completo;
- notificações ou lembretes;
- previsão de data futura baseada em padrão de uso;
- média de quilômetros por dia/mês;
- inferência automática de `nextDueMileage`;
- periodicidade permanente derivada de uma referência pontual;
- GPS/background tracking;
- OBD-II ou telemetria;
- diagnóstico mecânico;
- afirmações de saúde mecânica;
- recomendação de oficina;
- marketplace;
- biblioteca completa de manutenção;
- regras específicas por fabricante/modelo sem fonte e contrato apropriados;
- ativação de políticas de fabricante ou AutoPilot nesta missão;
- machine learning ou LLM;
- backend/cloud sync;
- novas dependências/frameworks;
- refatorações incidentais fora do mínimo necessário;
- início antecipado das Missões 03.4+.

## 8. Critérios de aceite

A Missão 03.3 é tecnicamente aceitável quando houver evidência de que:

1. os quatro Care States estão representados explicitamente;
2. existe avaliação determinística por veículo/Care Item;
3. `insufficient-information` permanece honesto quando faltam fatos/referência;
4. uma referência explícita `user` pode produzir os três estados de acompanhamento;
5. `due-soon` corresponde deterministicamente aos 10% finais do intervalo conhecido;
6. atingir `nextDueMileage` produz `attention-needed` sem alegar defeito mecânico;
7. o resultado preserva a origem da referência;
8. Care Events e Odometer Checkpoints são usados factual e deterministicamente;
9. a avaliação independe da ordem de inserção dos fatos equivalentes;
10. não existe inferência automática de periodicidade futura;
11. Next Action é coerente com cada estado;
12. entradas inválidas falham com segurança;
13. contratos das Missões 03.1 e 03.2 permanecem compatíveis;
14. testes focados e regressão passam;
15. nenhuma capacidade de 03.4+ foi antecipada.

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

Nesta continuação da missão, o Codex está autorizado a:

- alterar somente arquivos necessários para completar a 03.3 na branch `feature/sprint-03-vehicle-care`;
- atualizar `docs/sprints/sprint-03/reports/mission-03.3-report.md`, substituindo o estado parcial/bloqueado pelo relatório consolidado da execução;
- após validação bem-sucedida, fazer commit da continuação e do relatório;
- publicar em `origin/feature/sprint-03-vehicle-care`.

Mensagem sugerida:

`feat(vehicle-care): complete care state policy evaluation`

Não está autorizado a:

- alterar/publicar diretamente em `main`;
- realizar merge;
- rebase, squash, force-push ou reescrita de histórico;
- iniciar a Missão 03.4.

## 11. Condições de parada

O bloqueio específico por ausência de política de referência foi resolvido por esta revisão.

Parar e reportar se surgir novo impedimento, incluindo:

- conflito documental não resolvido por esta decisão;
- baseline/branch incompatível;
- necessidade de quebrar contratos existentes;
- necessidade de nova arquitetura ou dependência;
- impossibilidade de representar `nextDueMileage` e sua origem sem expansão incompatível do domínio;
- ambiguidade não resolvida entre fato, cálculo, estimativa e desconhecido;
- necessidade de diagnóstico mecânico;
- expansão para onboarding/cockpit/Care Loop;
- risco de integridade ou segurança não coberto.

## 12. Relatório obrigatório

Atualizar:

`docs/sprints/sprint-03/reports/mission-03.3-report.md`

O relatório consolidado deve conter, no mínimo:

1. baseline original e sincronizações posteriores;
2. registro do bloqueio por falta de política;
3. decisão complementar aprovada pelo PO;
4. implementação final;
5. arquivos criados/modificados;
6. representação de `nextDueMileage` e origem;
7. regra dos 10% e decisão técnica de arredondamento;
8. comportamento dos quatro Care States e respectivas Next Actions;
9. critérios de aceite item a item;
10. testes/comandos e resultados;
11. resumo do diff;
12. estado Git final e SHA;
13. riscos, limitações e pendências;
14. confirmação de ausência de inferência de periodicidade, estimativa, diagnóstico e antecipação da 03.4+.

Manter **Fatos**, **Decisões** e **Recomendações** distinguíveis conforme `AGENTS.md`.

## 13. Gate de conclusão

A execução pelo Codex não encerra formalmente a missão.

Após o push, o Tech Lead revisará relatório, diff, evidências e estado final. A missão somente será considerada concluída após aceite explícito do PO.

Não iniciar a Missão 03.4 sem autorização.
