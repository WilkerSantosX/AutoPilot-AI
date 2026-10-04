# Missão 03.2 — Odometer Checkpoints

> Sprint: 03 — Vehicle Care — Da memória à orientação  
> Status: **Approved**  
> Governança: GOV.01 — Mission Handoff Protocol  
> Owner: Chief Architect / Tech Lead  
> Executor: Codex / Senior Software Engineer

## 1. Baseline aprovado

A execução deve iniciar na branch `feature/sprint-03-vehicle-care`, a partir do HEAD aceito da Missão 03.1:

`8c3560e3a3b4561b0da3a6962857d80030c79b71`

Esse baseline contém a implementação aceita da Vehicle Care Foundation e sua evidência documental.

Antes de alterar código, o Codex deve confirmar branch ativa, HEAD esperado, árvore de trabalho limpa e presença desta missão na branch.

## 2. Objetivo

Introduzir **Odometer Checkpoints** como registros factuais de leituras de quilometragem associadas ao veículo e ao momento em que foram informadas, criando um histórico confiável que possa alimentar missões posteriores da Sprint 3.

A missão deve permitir evoluir conceitualmente de:

`quilometragem atual isolada`

para:

`checkpoints → histórico de quilometragem → contexto futuro para interpretação`

Esta missão registra fatos. Ela **não calcula Care State, não estima uso futuro e não cria automação de quilometragem**.

## 3. Intenção de produto

Nesta Sprint, a fonte confiável de quilometragem é a informação explicitamente fornecida pelo usuário.

Um Odometer Checkpoint representa algo que o AutoPilot **sabe porque o motorista informou**. Não representa distância inferida por GPS, celular, OBD-II ou qualquer outra fonte automática.

O domínio deve preservar a distinção entre:

- leitura informada;
- cálculos futuros derivados dessas leituras;
- estimativas futuras;
- informação desconhecida.

A Missão 03.2 implementa apenas a primeira categoria.

## 4. Pré-condições

Antes da implementação, o Codex deve:

1. ler `AGENTS.md`;
2. ler `docs/governance/mission-handoff-protocol.md`;
3. ler `docs/sprints/sprint-03/sprint-contract.md`;
4. ler `docs/sprints/sprint-03/missions/mission-03.1.md` e seu relatório;
5. inspecionar `VehicleProfile`, sua persistência e a Vehicle Care Foundation criada na 03.1;
6. identificar o comportamento atual de `mileage` no perfil do veículo;
7. confirmar que a missão pode ser implementada sem nova dependência, mudança arquitetural ou quebra de contrato público.

Se houver conflito documental ou necessidade de mudança incompatível, parar e reportar.

## 5. Escopo autorizado

### 5.1 Modelo de Odometer Checkpoint

Introduzir uma representação explícita e pequena de Odometer Checkpoint.

O modelo mínimo deve conseguir representar:

- identidade do checkpoint;
- veículo ao qual pertence;
- quilometragem informada;
- momento ao qual a leitura se refere;
- momento de registro, quando necessário para distinguir ocorrência de registro;
- versão de schema, se consistente com os padrões já adotados.

Os nomes exatos das propriedades podem seguir as convenções do repositório, desde que a semântica permaneça explícita.

A quilometragem deve continuar aceitando **zero** como valor válido e deve ser um inteiro seguro não negativo.

### 5.2 Histórico por veículo

Implementar persistência local dos checkpoints utilizando o padrão já existente no projeto.

A persistência deve:

- associar checkpoints ao veículo correto;
- permitir salvar e recuperar múltiplas leituras;
- retornar estado vazio seguro quando não houver histórico;
- impedir corrupção silenciosa de histórico válido;
- rejeitar estruturas inválidas e identidades duplicadas;
- manter isolamento entre veículos;
- preservar dados já existentes de VehicleProfile e Vehicle Care.

Não criar infraestrutura genérica de event sourcing, banco local ou camada arquitetural nova.

### 5.3 Relação com `VehicleProfile.mileage`

A introdução dos checkpoints deve manter coerência com o contexto atual do veículo.

Quando um novo checkpoint válido representar a leitura mais recente conhecida do veículo, a solução deve preservar um caminho simples e explícito para que o contexto atual de quilometragem do veículo reflita essa leitura **sem destruir o histórico**.

O Codex deve primeiro inspecionar o contrato existente de `VehicleProfile` e escolher a menor solução compatível com ele.

Regras obrigatórias:

- não remover `mileage` do VehicleProfile nesta missão;
- não quebrar o schema atual do VehicleProfile;
- não transformar silenciosamente `mileage` em valor estimado;
- não permitir que uma leitura historicamente anterior reduza indevidamente a quilometragem atual conhecida;
- se sincronizar automaticamente o perfil exigir alteração incompatível ou acoplamento arquitetural não autorizado, **parar e reportar**, em vez de improvisar.

### 5.4 Ordenação e coerência temporal

O histórico deve preservar informação suficiente para determinar a sequência das leituras.

A implementação deve tratar de forma determinística checkpoints inseridos fora de ordem temporal.

Não é necessário impedir que o usuário registre retrospectivamente uma leitura antiga, desde que ela não seja confundida com a leitura atual mais recente.

A missão não precisa resolver adulteração de hodômetro, troca de painel, rollover ou cenários automotivos excepcionais. Se esses casos aparecerem como necessidade técnica para concluir o escopo básico, parar e reportar.

### 5.5 Testes

Adicionar testes automatizados focados usando a abordagem atual do repositório e sem novas dependências.

No mínimo, validar:

- criação de checkpoint válido;
- quilometragem zero válida;
- rejeição de quilometragem negativa, fracionária, não numérica ou insegura;
- persistência e recuperação;
- múltiplos checkpoints do mesmo veículo;
- isolamento entre veículos;
- ausência de histórico retornando estado vazio seguro;
- duplicidade de identidade;
- histórico inválido/corrompido;
- inserção fora de ordem temporal;
- determinação da leitura mais recente conhecida;
- preservação do VehicleProfile e dos Care Events existentes;
- comportamento acordado para atualização da quilometragem atual do veículo, caso isso seja implementado dentro dos limites desta missão;
- regressão da suíte existente.

## 6. Fora do escopo / limites

Esta missão **não autoriza**:

- Care State;
- cálculo de vencimento ou atraso de manutenção;
- Next Action;
- estimativa de quilometragem futura;
- cálculo de média de quilômetros por dia/mês;
- previsão de quando determinada quilometragem será atingida;
- lembretes ou notificações;
- GPS ou localização em background;
- inferência de deslocamento pelo celular;
- OBD-II ou telemetria;
- APIs de fabricantes;
- interface completa de atualização de quilometragem;
- Care Onboarding;
- mudanças no cockpit;
- diagnóstico mecânico;
- backend/cloud sync;
- autenticação;
- novas dependências ou frameworks;
- refatorações incidentais fora do mínimo necessário.

Especialmente: **dois checkpoints ainda não autorizam o AutoPilot a afirmar um padrão de uso ou fazer previsões.**

## 7. Critérios de aceite

A Missão 03.2 é tecnicamente aceitável quando houver evidência de que:

1. existe representação explícita de Odometer Checkpoint;
2. cada checkpoint é associado ao veículo correto;
3. a leitura aceita zero e rejeita valores inválidos;
4. múltiplos checkpoints podem ser persistidos e recuperados com segurança;
5. o histórico mantém isolamento entre veículos;
6. ausência de histórico produz estado vazio seguro;
7. checkpoints retrospectivos podem existir sem serem confundidos com a leitura mais recente;
8. é possível determinar deterministicamente a leitura mais recente conhecida;
9. o VehicleProfile continua compatível e seus dados não são corrompidos;
10. os Care Events da 03.1 continuam compatíveis e preservados;
11. nenhuma leitura é apresentada semanticamente como estimada ou automaticamente observada;
12. testes focados e regressão passam;
13. nenhum comportamento pertencente à 03.3+ foi antecipado.

## 8. Validação obrigatória

O Codex deve, no mínimo:

- executar toda a suíte automatizada disponível relevante ao repositório;
- validar sintaxe dos arquivos JavaScript alterados e relacionados usando a abordagem atual;
- executar `git diff --check`;
- revisar o diff final procurando vazamento de escopo;
- verificar que a aplicação continua iniciando/servindo pelo workflow existente quando praticável;
- verificar console do navegador quando houver execução da aplicação;
- registrar separadamente qualquer problema preexistente encontrado, sem corrigi-lo incidentalmente.

## 9. Regras Git e publicação

Nesta missão, o Codex está autorizado a:

- alterar somente arquivos necessários ao escopo aprovado na branch `feature/sprint-03-vehicle-care`;
- criar o relatório em `docs/sprints/sprint-03/reports/mission-03.2-report.md`;
- após validação bem-sucedida, fazer commit da implementação e do relatório;
- publicar o commit em `origin/feature/sprint-03-vehicle-care`.

Mensagem de commit sugerida:

`feat(vehicle-care): add odometer checkpoints`

Não está autorizado a:

- alterar ou publicar diretamente em `main`;
- realizar merge;
- rebase, squash, force-push ou reescrita de histórico;
- iniciar a Missão 03.3.

## 10. Condições de parada

Parar e reportar antes de improvisar se:

- houver conflito entre documentação aplicável;
- a branch/baseline não corresponder ao estado esperado;
- for necessário quebrar o contrato/schema atual do VehicleProfile;
- for necessário alterar arquitetura ou estrutura do projeto;
- uma nova dependência for necessária;
- a sincronização entre checkpoint e quilometragem atual exigir decisão arquitetural não prevista;
- surgir ambiguidade que obrigue a tratar leitura informada como cálculo ou estimativa;
- for necessário implementar Care State, previsão ou outra capacidade de missão futura;
- o escopo precisar crescer;
- surgir risco de integridade de dados ou segurança não coberto pelo contrato.

Em bloqueio, produzir o relatório GOV.01 com evidência, informar se houve alteração/commit/push e declarar explicitamente a decisão necessária do PO/Tech Lead.

## 11. Relatório obrigatório

Persistir em:

`docs/sprints/sprint-03/reports/mission-03.2-report.md`

O relatório deve conter, no mínimo:

1. estado inicial da branch e HEAD;
2. inspeção dirigida do VehicleProfile, Vehicle Care e persistência;
3. implementação realizada;
4. arquivos criados/modificados;
5. decisão tomada sobre relação checkpoint ↔ `VehicleProfile.mileage` e justificativa;
6. comportamento de checkpoints retrospectivos e leitura mais recente;
7. critérios de aceite avaliados item a item;
8. testes/comandos e resultados;
9. resumo do diff;
10. estado Git final e SHA;
11. riscos, limitações e pendências;
12. confirmação explícita de que nenhuma estimativa, Care State ou capacidade 03.3+ foi implementada;
13. confirmação de que a Missão 03.3 não foi iniciada.

Manter **Fatos**, **Decisões** e **Recomendações** distinguíveis conforme `AGENTS.md`.

## 12. Gate de conclusão

A conclusão da execução pelo Codex não encerra formalmente a missão.

Após o push, o Tech Lead revisará relatório, diff, evidências e estado final do repositório. A missão só será considerada concluída após aceite explícito.

Não iniciar a Missão 03.3 sem autorização.
