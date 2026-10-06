# Missão 03.4 — Care Onboarding

> Sprint: 03 — Vehicle Care — Da memória à orientação  
> Status: **Approved**  
> Governança: GOV.01 — Mission Handoff Protocol  
> Owner: Chief Architect / Tech Lead  
> Executor: Codex / Senior Software Engineer

## 1. Baseline aprovado

A execução deve iniciar na branch `feature/sprint-03-vehicle-care`, a partir do HEAD aceito da Missão 03.3:

`4bfa00ada173878b3b04c27700f117b52467439a`

Esse baseline contém a fundação de Vehicle Care, Odometer Checkpoints e o Care State Engine com política `user-next-due-mileage` aprovada.

Antes de alterar código, o Codex deve confirmar branch ativa, HEAD esperado, árvore de trabalho limpa e presença desta missão na branch.

## 2. Objetivo

Criar o primeiro **Care Onboarding** do AutoPilot: uma experiência pequena e coerente que permita ao motorista transformar conhecimento — ou desconhecimento — sobre os cuidados iniciais do veículo em fatos e referências utilizáveis pelo Care State Engine.

A missão deve conectar a experiência do usuário às fundações já existentes sem antecipar o cockpit final ou o Care Loop completo.

Fluxo-alvo:

`veículo conhecido → o que você sabe? → registrar fato/referência quando conhecidos → aceitar desconhecimento → produzir estado/Next Action honesto`

## 3. Intenção de produto

O onboarding deve materializar dois princípios já aprovados:

> **O AutoPilot não exige conhecimento do passado para começar a cuidar do futuro.**

> **Care State representa o estado do acompanhamento em relação a uma referência conhecida; não representa a condição mecânica do veículo.**

A experiência não deve parecer um formulário técnico de oficina. Deve reduzir esforço cognitivo e permitir que o usuário diga com naturalidade o que sabe e o que não sabe.

## 4. Pré-condições

Antes da implementação, o Codex deve:

1. ler `AGENTS.md`;
2. ler `docs/governance/mission-handoff-protocol.md`;
3. ler `docs/sprints/sprint-03/sprint-contract.md`;
4. ler as Missões 03.1, 03.2 e 03.3 e seus relatórios;
5. inspecionar a implementação atual da jornada principal, VehicleProfile e padrões de UI/SPA existentes;
6. inspecionar `careModel`, `careStorage`, `odometerModel`, `odometerStorage` e `careStateEngine`;
7. confirmar como o veículo ativo é identificado na experiência atual;
8. confirmar que a experiência pode ser implementada sem nova dependência, framework, roteador ou mudança arquitetural.

Se o fluxo exigir alteração estrutural incompatível com a SPA atual ou nova decisão de produto não coberta por este contrato, parar e reportar.

## 5. Escopo autorizado

### 5.1 Entrada no Care Onboarding

Introduzir um ponto de entrada claro e coerente para o Care Onboarding dentro da experiência existente do veículo.

A solução deve:

- operar sobre o veículo persistido/ativo já existente;
- não criar um segundo conceito concorrente de veículo atual;
- manter o fluxo principal existente funcional;
- evitar prometer um cockpit de Vehicle Care ainda não implementado.

O formato exato do ponto de entrada pode seguir os padrões atuais da SPA após inspeção do repositório.

### 5.2 Recorte inicial de cuidados

A experiência deve trabalhar somente com os três Care Items aprovados:

- óleo do motor (`engine-oil`);
- arrefecimento (`cooling`);
- revisão básica (`basic-review`).

Não expandir o catálogo nesta missão.

### 5.3 Histórico conhecido

Para cada Care Item, o usuário deve conseguir informar, quando souber, um marco factual suficiente para o domínio existente.

A experiência deve permitir capturar de forma coerente os dados necessários para criar um Care Event válido, respeitando os contratos já implementados.

Quando a quilometragem do marco for conhecida, ela deve ser factual e explicitamente informada; não inferida.

A interface deve deixar claro que está perguntando sobre algo que aconteceu, não diagnosticando o veículo.

### 5.4 Histórico desconhecido

O usuário deve possuir uma saída explícita equivalente a **“não sei / não lembro”** para o histórico de cada cuidado.

Escolher desconhecimento deve:

- não fabricar Care Event;
- não fabricar quilometragem;
- não bloquear a continuidade da experiência;
- preservar `insufficient-information` quando os fatos necessários não existirem;
- orientar semanticamente que o acompanhamento poderá começar a partir de um novo marco confiável no futuro.

Não persistir fatos fictícios apenas para marcar que o usuário respondeu “não sei”, salvo se a arquitetura existente já possuir mecanismo de preferência/estado de onboarding adequado e sua utilização não alterar a semântica factual. Se persistir esse estado exigir novo domínio, parar e reportar.

### 5.5 Próxima referência conhecida

Quando houver um Care Event com quilometragem factual conhecida, o onboarding deve permitir que o usuário informe opcionalmente uma **próxima referência de quilometragem** que ele já conhece.

Essa informação deve alimentar a política aprovada na 03.3:

- origem: `user`;
- `nextDueMileage` explicitamente informado;
- vínculo com o Care Event que estabeleceu o marco;
- `nextDueMileage > milestoneMileage`.

A interface deve comunicar a referência como algo **informado pelo usuário**, e não como recomendação automática do AutoPilot ou do fabricante.

Não perguntar ou sugerir um intervalo universal de manutenção.

### 5.6 Persistência da referência

A 03.3 introduziu a representação de referência necessária ao engine, mas a 03.4 deve garantir que uma referência capturada pela experiência possa sobreviver a recarregamentos e ser recuperada para avaliação posterior.

O Codex está autorizado a introduzir a **persistência local mínima de Care Reference** necessária para isso, seguindo os padrões de storage já existentes.

A persistência deve:

- manter vínculo com veículo, Care Item e Care Event;
- preservar `source: user`;
- rejeitar referências estruturalmente inválidas;
- impedir duplicidade/ambiguidade para o mesmo marco conforme a solução mínima escolhida;
- retornar estado vazio seguro quando não houver referência;
- não transformar referência pontual em periodicidade;
- não corromper VehicleProfile, Care Events ou Odometer Checkpoints.

Não criar catálogo de políticas, backend, sincronização ou infraestrutura genérica além do necessário.

### 5.7 Quilometragem atual

Se o Care State precisar de uma leitura atual e não houver Odometer Checkpoint factual suficiente, a experiência pode solicitar ao usuário a quilometragem atual e persistir um novo checkpoint válido.

Regras:

- a leitura deve ser explicitamente informada;
- zero continua válido;
- não estimar quilometragem;
- não usar a quilometragem do marco histórico como se fosse automaticamente a quilometragem atual;
- reutilizar os contratos da 03.2.

Evitar pedir novamente a quilometragem se já houver leitura factual adequada disponível.

### 5.8 Resultado imediato do onboarding

Ao concluir dados suficientes de um Care Item, a experiência deve utilizar o Care State Engine existente para obter o estado atual.

O usuário deve receber feedback coerente de que o AutoPilot:

- conseguiu começar a acompanhar aquele cuidado; ou
- ainda precisa de determinada informação; ou
- aceitou que o histórico é desconhecido e poderá começar a acompanhar após um novo marco.

Não construir nesta missão a apresentação consolidada do cockpit da 03.5.

### 5.9 Linguagem e confiança

A interface deve evitar linguagem que implique diagnóstico ou certeza mecânica não suportada.

Preferir conceitos equivalentes a:

- “referência informada por você”;
- “vamos começar a acompanhar”;
- “ainda não temos informação suficiente”;
- “registre quando realizar este cuidado para estabelecer um novo marco”.

Não usar mensagens equivalentes a:

- “seu motor está saudável”;
- “seu sistema está com problema”;
- “o AutoPilot recomenda trocar em X km” quando X veio do usuário;
- “manutenção vencida” sem contextualizar que a referência registrada foi atingida.

Os textos exatos podem ser refinados pelo Codex desde que preservem a semântica aprovada.

### 5.10 UX mínima

A experiência deve ser responsiva e compatível com o padrão visual existente.

Priorizar:

- uma decisão por vez quando isso reduzir complexidade;
- campos apenas quando necessários;
- opção clara de desconhecimento;
- validação compreensível;
- preservação dos dados já informados em caso de erro local;
- não criar becos sem saída;
- acessibilidade básica dos controles conforme os padrões existentes.

Não redesenhar toda a aplicação.

### 5.11 Testes

Adicionar testes automatizados focados usando a abordagem atual do repositório, sem novas dependências.

No mínimo, validar:

- persistência e recuperação de Care Reference `user`;
- isolamento por veículo/Care Item/marco;
- referência inválida ou `nextDueMileage <= milestoneMileage` falhando com segurança;
- histórico desconhecido não criando fatos artificiais;
- histórico conhecido criando Care Event válido;
- referência opcional permanecendo opcional;
- quilometragem atual criando checkpoint somente quando explicitamente fornecida;
- dados suficientes alimentando o Care State Engine;
- recarregamento preservando fatos e referência necessários;
- contratos das 03.1, 03.2 e 03.3 permanecendo compatíveis;
- regressão completa da suíte existente.

Quando testes automatizados de DOM não forem suportados pela infraestrutura atual sem nova dependência, validar a lógica extraída e complementar com smoke test manual documentado; não adicionar framework de teste somente para esta missão.

## 6. Fora do escopo / limites

Esta missão **não autoriza**:

- Vehicle Care Cockpit consolidado;
- Care Loop completo pós-manutenção;
- notificações ou lembretes;
- previsão de data futura;
- média de uso do veículo;
- inferência de `nextDueMileage`;
- recomendação automática de periodicidade;
- políticas de fabricante ou AutoPilot como fontes ativas;
- diagnóstico mecânico;
- expansão de Care Items;
- oficina/marketplace;
- GPS/background tracking;
- OBD-II/telemetria;
- backend/cloud sync;
- autenticação;
- chatbot/LLM;
- novas dependências/frameworks;
- roteador ou arquitetura nova;
- refatoração ampla da SPA;
- início antecipado da Missão 03.5.

## 7. Critérios de aceite

A Missão 03.4 é tecnicamente aceitável quando houver evidência de que:

1. existe ponto de entrada funcional para o Care Onboarding no contexto do veículo existente;
2. os três Care Items iniciais podem ser percorridos sem expansão de catálogo;
3. o usuário consegue registrar histórico conhecido como Care Event factual;
4. o usuário consegue declarar histórico desconhecido sem criar fatos artificiais e sem ficar bloqueado;
5. `nextDueMileage` é opcional, factual, de origem `user` e vinculada ao marco correto;
6. Care References sobrevivem a recarregamento e são recuperadas com segurança;
7. quando necessária, quilometragem atual pode ser informada explicitamente e virar Odometer Checkpoint válido;
8. dados suficientes são avaliados pelo Care State Engine já existente;
9. informação insuficiente permanece honesta e gera orientação útil;
10. a interface não comunica diagnóstico ou recomendação universal inexistente;
11. VehicleProfile, Care Events, Odometer Checkpoints e Care State Engine permanecem compatíveis;
12. testes focados e regressão passam;
13. experiência principal preexistente continua funcional;
14. nenhuma capacidade da 03.5+ foi antecipada.

## 8. Validação obrigatória

O Codex deve, no mínimo:

- executar toda a suíte automatizada relevante;
- validar sintaxe dos JavaScript alterados e relacionados;
- executar `git diff --check`;
- revisar o diff final procurando vazamento de escopo;
- iniciar/servir a aplicação pelo workflow existente;
- executar smoke test manual do Care Onboarding no navegador;
- testar ao menos um caminho de histórico conhecido com referência;
- testar ao menos um caminho de histórico desconhecido;
- testar recarregamento/persistência;
- verificar console do navegador e registrar erros observados;
- validar que a jornada preexistente continua acessível;
- registrar problemas preexistentes separadamente sem expandir escopo para corrigi-los.

## 9. Regras Git e publicação

Nesta missão, o Codex está autorizado a:

- alterar somente arquivos necessários ao escopo aprovado na branch `feature/sprint-03-vehicle-care`;
- criar `docs/sprints/sprint-03/reports/mission-03.4-report.md`;
- após validação bem-sucedida, fazer commit da implementação e do relatório;
- publicar em `origin/feature/sprint-03-vehicle-care`.

Mensagem sugerida:

`feat(vehicle-care): add care onboarding`

Não está autorizado a:

- alterar/publicar diretamente em `main`;
- realizar merge;
- rebase, squash, force-push ou reescrita de histórico;
- iniciar a Missão 03.5.

## 10. Condições de parada

Parar e reportar antes de improvisar se:

- houver conflito documental;
- branch/baseline estiver incorreto;
- a integração com a SPA exigir mudança arquitetural relevante;
- for necessário quebrar contratos existentes;
- for necessária nova dependência/framework;
- persistir Care Reference exigir semântica diferente da política aprovada na 03.3;
- for necessário inventar periodicidade/recomendação;
- histórico desconhecido exigir fabricação de fato para o fluxo funcionar;
- houver ambiguidade entre fato, cálculo, estimativa e desconhecido;
- a experiência exigir antecipar cockpit ou Care Loop;
- o escopo precisar crescer;
- surgir risco de integridade ou segurança não coberto.

Em bloqueio, produzir relatório GOV.01 com evidência, informar alterações/commit/push e declarar a decisão exata necessária do PO/Tech Lead.

## 11. Relatório obrigatório

Persistir em:

`docs/sprints/sprint-03/reports/mission-03.4-report.md`

O relatório deve conter, no mínimo:

1. estado inicial da branch e HEAD;
2. inspeção dirigida da SPA e fundações 03.1–03.3;
3. implementação realizada;
4. arquivos criados/modificados;
5. fluxo UX implementado para conhecido/desconhecido;
6. persistência de Care Reference adotada;
7. integração com Odometer Checkpoints e Care State Engine;
8. decisões locais de linguagem/UX e justificativa;
9. critérios de aceite item a item;
10. testes/comandos e resultados;
11. smoke tests manuais e resultados;
12. resumo do diff;
13. estado Git final e SHA;
14. riscos, limitações e pendências;
15. confirmação explícita de ausência de diagnóstico, periodicidade inventada e antecipação da 03.5+.

Manter **Fatos**, **Decisões** e **Recomendações** distinguíveis conforme `AGENTS.md`.

## 12. Gate de conclusão

A execução pelo Codex não encerra formalmente a missão.

Após o push, o Tech Lead revisará relatório, diff, evidências e estado final. A missão somente será considerada concluída após aceite explícito do PO.

Não iniciar a Missão 03.5 sem autorização.
