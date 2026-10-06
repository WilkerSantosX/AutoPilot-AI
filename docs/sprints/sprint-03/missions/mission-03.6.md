# Missão 03.6 — Care Loop

> Sprint: 03 — Vehicle Care — Da memória à orientação  
> Status: **Approved**  
> Governança: GOV.01 — Mission Handoff Protocol  
> Owner: Chief Architect / Tech Lead  
> Executor: Codex / Senior Software Engineer

## 1. Baseline aprovado

A execução deve iniciar na branch `feature/sprint-03-vehicle-care`, a partir do HEAD aceito da Missão 03.5:

`4e12c18de6f18a534f19e583e386bc7a7d2ad4e0`

Esse baseline contém a fundação completa até o Vehicle Care Cockpit: Care Events, Odometer Checkpoints, Care State Engine, referências `user`, Care Onboarding e visão consolidada dos três Care Items.

Antes de alterar código, o Codex deve confirmar branch ativa, HEAD esperado, árvore de trabalho limpa e presença desta missão na branch.

## 2. Objetivo

Fechar o primeiro **Care Loop** funcional do AutoPilot, permitindo que o motorista parta de uma orientação do cockpit, registre que realizou um cuidado, estabeleça um novo marco factual e veja o acompanhamento ser recalculado a partir desse novo estado.

Fluxo-alvo:

`acompanhar → orientar → agir → registrar cuidado realizado → estabelecer novo marco → recalcular → continuar acompanhando`

Esta é a última missão funcional da Sprint 3. A Missão 03.7 será dedicada à validação e entrega do MVP da Sprint.

## 3. Intenção de produto

O AutoPilot não deve apenas dizer que uma referência foi atingida. Ele deve permitir que o motorista **feche o ciclo** depois de agir.

Exemplo conceitual:

1. cockpit indica que a referência registrada para óleo foi atingida;
2. motorista realiza a troca;
3. registra no AutoPilot que o cuidado foi realizado;
4. esse registro vira um novo Care Event factual;
5. a quilometragem informada, quando aplicável, vira/usa um marco factual coerente;
6. a referência anterior deixa de governar o novo ciclo;
7. se o motorista souber a próxima referência, pode informá-la explicitamente;
8. o Care State Engine recalcula;
9. cockpit passa a refletir o novo estado.

O sistema não deve inventar a próxima referência nem reutilizar automaticamente o intervalo anterior.

## 4. Princípios obrigatórios

### 4.1 Registrar fato, não “resolver alerta”

A ação do usuário deve registrar um cuidado que realmente aconteceu. O sistema não deve simplesmente marcar um alerta como concluído sem criar o fato correspondente.

### 4.2 Novo marco encerra a aplicabilidade da referência anterior

Uma Care Reference é vinculada ao Care Event que estabeleceu seu marco. Quando um novo Care Event mais recente passa a ser o marco relevante, a referência antiga não deve ser aplicada ao novo ciclo.

### 4.3 Próxima referência continua explícita

Após registrar o cuidado, `nextDueMileage` permanece opcional e deve ser informada explicitamente pelo usuário, com `source: user`.

Não inferir a nova referência pelo intervalo anterior.

### 4.4 Recalcular, não persistir estado derivado

O novo Care State deve continuar sendo derivado dos fatos, checkpoint e referência aplicável. Não persistir “em dia”, “atenção” etc. como nova fonte de verdade.

## 5. Pré-condições

Antes da implementação, o Codex deve:

1. ler `AGENTS.md`;
2. ler `docs/governance/mission-handoff-protocol.md`;
3. ler `docs/sprints/sprint-03/sprint-contract.md`;
4. ler as Missões 03.1–03.5 e seus relatórios;
5. inspecionar o Vehicle Care Cockpit e Care Onboarding atuais;
6. inspecionar Care Event, Care Reference, Odometer Checkpoint e respectivos storages;
7. inspecionar a seleção determinística de marco do Care State Engine;
8. confirmar como uma referência antiga deixa de ser aplicável quando surge um Care Event mais recente;
9. confirmar que o loop pode ser implementado sem nova dependência, framework ou mudança arquitetural relevante.

Se a semântica atual dos modelos impedir o fechamento seguro do loop, parar e reportar antes de improvisar.

## 6. Escopo autorizado

### 6.1 Entrada para registrar cuidado realizado

Introduzir no Vehicle Care Cockpit um caminho claro para registrar um cuidado realizado para um Care Item.

O caminho deve ser semanticamente compatível com a Next Action atual e pode estar disponível quando fizer sentido registrar um novo marco, sem exigir que o estado esteja necessariamente em `attention-needed`.

A interface deve deixar claro que o usuário está registrando **algo que já aconteceu**.

Não implementar agendamento futuro de manutenção.

### 6.2 Formulário mínimo do novo marco

O registro deve capturar apenas dados factuais necessários ao domínio existente, incluindo no mínimo:

- Care Item;
- data/momento em que o cuidado foi realizado;
- quilometragem do cuidado quando conhecida/aplicável conforme o contrato atual;
- próxima referência de quilometragem, opcional, quando o usuário já a souber.

O Care Item deve vir do contexto da ação iniciada e não depender de o usuário redescobri-lo em um formulário genérico.

Não solicitar diagnóstico, custo, oficina, peças, notas avançadas ou outros campos fora do recorte.

### 6.3 Criação do novo Care Event

Ao confirmar um registro válido, criar um novo Care Event usando o modelo e storage da 03.1.

Regras:

- associar ao veículo correto;
- associar ao Care Item correto;
- preservar o evento anterior como histórico;
- não editar retroativamente o evento antigo para representar o novo cuidado;
- impedir submissão duplicada acidental conforme os padrões atuais da aplicação;
- falhar com segurança em caso de persistência inválida/corrompida.

### 6.4 Quilometragem do novo cuidado

Quando o usuário informar a quilometragem factual em que o cuidado foi realizado, a implementação deve preservar coerência com Odometer Checkpoints.

O Codex deve reutilizar a fundação da 03.2 e escolher a menor solução compatível para garantir que a leitura possa participar corretamente do contexto de quilometragem.

Regras obrigatórias:

- não estimar quilometragem;
- zero permanece válido;
- não reduzir indevidamente a leitura atual conhecida com um registro retrospectivo;
- se o cuidado for registrado retrospectivamente, sua quilometragem pode ser histórica sem substituir a leitura factual mais recente;
- não duplicar checkpoints equivalentes desnecessariamente se a fundação existente já permitir reconhecer/reutilizar o fato de forma segura.

Se sincronizar Care Event e Odometer Checkpoint exigir uma decisão arquitetural não prevista, parar e reportar.

### 6.5 Referência do novo ciclo

Após criar o novo Care Event, permitir opcionalmente persistir uma nova Care Reference vinculada especificamente a esse novo evento.

A referência deve:

- usar `source: user`;
- possuir `nextDueMileage > milestoneMileage`;
- permanecer vinculada ao novo Care Event;
- não alterar nem reaproveitar a referência anterior;
- não ser inferida automaticamente.

Se o usuário não souber a próxima referência, o novo Care Event ainda deve ser válido e o Care State deve refletir honestamente a informação disponível.

### 6.6 Recalcular após registro

Após persistência bem-sucedida, o fluxo deve voltar a uma experiência coerente do Vehicle Care e recalcular o Care Item com o Care State Engine existente.

Cenários conceituais esperados:

- novo evento + nova referência + leitura suficiente → estado calculável para o novo ciclo;
- novo evento sem nova referência → `insufficient-information` em relação à referência, com Next Action coerente;
- novo evento retrospectivo enquanto existe leitura atual posterior → avaliação usa o novo marco e a leitura factual mais recente sem regredir o odômetro;
- falha de persistência → não apresentar sucesso falso nem estado recalculado artificialmente.

### 6.7 Feedback de conclusão

A experiência deve confirmar semanticamente que o cuidado foi registrado e que o acompanhamento foi atualizado/recalculado.

Evitar linguagem como “problema resolvido” ou “veículo saudável”.

Preferir conceitos equivalentes a:

- “Cuidado registrado.”
- “Novo marco estabelecido.”
- “Acompanhamento atualizado.”

Os textos exatos podem seguir o padrão visual atual.

### 6.8 Histórico preservado

O loop não deve apagar Care Events anteriores ou referências históricas válidas.

O engine deve selecionar deterministicamente o Care Event relevante mais recente conforme sua semântica existente.

Não construir nesta missão uma tela completa de timeline/histórico. Preservar os fatos para uso futuro é suficiente.

### 6.9 Falha parcial e integridade

O fluxo envolve potencialmente Care Event, Odometer Checkpoint e Care Reference. A implementação deve minimizar risco de estado parcialmente persistido.

O Codex deve inspecionar os padrões já usados no onboarding e reutilizar a estratégia mínima existente para:

- impedir duplicação em retry;
- reconhecer fatos já persistidos quando uma etapa posterior falhar;
- não sobrescrever storage válido após corrupção detectada;
- apresentar erro compreensível e permitir recuperação segura.

Não criar transação genérica, banco ou infraestrutura nova somente para esta missão.

### 6.10 Relação com o Care Onboarding

Care Onboarding continua sendo o fluxo para estabelecer conhecimento inicial/lacunas.

Care Loop deve ser o fluxo natural para **registrar um novo cuidado realizado após o acompanhamento já existir**.

Não duplicar ou substituir o onboarding inteiro.

### 6.11 Testes

Adicionar testes automatizados focados usando a abordagem atual do repositório e sem novas dependências.

No mínimo, validar:

- novo Care Event criado para veículo/Care Item corretos;
- evento anterior preservado;
- seleção do novo evento como marco relevante quando cronologicamente aplicável;
- nova referência vinculada ao novo Care Event;
- referência antiga não aplicada ao novo marco;
- ausência de nova referência resultando em estado honesto de informação insuficiente quando aplicável;
- nova referência não inferida a partir da anterior;
- quilometragem factual do cuidado integrada ao histórico sem regressão indevida;
- registro retrospectivo preservando checkpoint mais recente;
- prevenção de submissão duplicada/retry seguro;
- falha parcial não produzindo sucesso falso;
- recálculo usando Care State Engine existente;
- reload preservando novo marco e estado correspondente;
- contratos das 03.1–03.5 permanecendo compatíveis;
- regressão completa da suíte existente.

Se a infraestrutura atual não suportar teste automatizado de DOM sem nova dependência, testar a lógica extraída e complementar com smoke test manual documentado.

## 7. Fora do escopo / limites

Esta missão **não autoriza**:

- timeline completa de manutenção;
- edição/exclusão avançada de eventos históricos;
- custos, oficina, peças ou anexos;
- recomendação automática de próxima referência;
- reutilização automática do intervalo anterior;
- periodicidade por fabricante;
- políticas de fabricante ou AutoPilot como fontes ativas;
- previsão de data futura;
- média de uso;
- notificações/push;
- diagnóstico mecânico;
- afirmação de saúde mecânica;
- expansão de Care Items;
- GPS/background tracking;
- OBD-II/telemetria;
- backend/cloud sync;
- autenticação;
- chatbot/LLM;
- novas dependências/frameworks;
- mudança arquitetural ampla;
- redesign global;
- antecipação da Missão 03.7 além das evidências necessárias desta missão.

## 8. Critérios de aceite

A Missão 03.6 é tecnicamente aceitável quando houver evidência de que:

1. o motorista consegue iniciar pelo cockpit o registro de um cuidado realizado;
2. o fluxo deixa claro que registra um fato passado/realizado;
3. um novo Care Event válido é criado sem apagar o histórico anterior;
4. quilometragem informada é tratada como fato e integrada coerentemente aos checkpoints;
5. uma nova Care Reference pode ser informada opcionalmente e fica vinculada ao novo evento;
6. a referência anterior não governa automaticamente o novo ciclo;
7. nenhuma próxima referência é inferida quando o usuário não a informa;
8. o Care State é recalculado pelo engine existente após o registro;
9. ausência de referência nova resulta em desconhecimento honesto quando aplicável;
10. registro retrospectivo não reduz indevidamente a quilometragem atual conhecida;
11. retries/falhas parciais não geram duplicação ou sucesso falso;
12. reload preserva novo marco e acompanhamento correspondente;
13. Care Onboarding e jornada preexistente continuam funcionais;
14. testes focados e regressão passam;
15. nenhuma capacidade fora do escopo ou da 03.7 é antecipada.

## 9. Validação obrigatória

O Codex deve, no mínimo:

- executar toda a suíte automatizada relevante;
- validar sintaxe dos JavaScript alterados e relacionados;
- executar `git diff --check`;
- revisar o diff final procurando vazamento de escopo;
- iniciar/servir a aplicação pelo workflow existente;
- executar smoke test manual do Care Loop no navegador;
- testar registro de cuidado com nova referência;
- testar registro de cuidado sem nova referência;
- testar cenário retrospectivo quando praticável;
- testar reload após o registro;
- verificar que o cockpit reflete o novo estado;
- verificar console do navegador e registrar erros observados;
- validar que Care Onboarding e jornada anterior continuam acessíveis;
- registrar problemas preexistentes separadamente sem expandir escopo para corrigi-los.

## 10. Regras Git e publicação

Nesta missão, o Codex está autorizado a:

- alterar somente arquivos necessários ao escopo aprovado na branch `feature/sprint-03-vehicle-care`;
- criar `docs/sprints/sprint-03/reports/mission-03.6-report.md`;
- após validação bem-sucedida, fazer commit da implementação e do relatório;
- publicar em `origin/feature/sprint-03-vehicle-care`.

Mensagem sugerida:

`feat(vehicle-care): close the care loop`

Não está autorizado a:

- alterar/publicar diretamente em `main`;
- realizar merge;
- rebase, squash, force-push ou reescrita de histórico;
- iniciar a Missão 03.7.

## 11. Condições de parada

Parar e reportar antes de improvisar se:

- houver conflito documental;
- branch/baseline estiver incorreto;
- o loop exigir mudança incompatível nos contratos das 03.1–03.5;
- for necessária nova dependência/framework ou mudança arquitetural relevante;
- não for possível preservar vínculo correto entre novo Care Event e Care Reference;
- integração com Odometer Checkpoint exigir semântica nova não aprovada;
- tratamento de falha parcial exigir infraestrutura transacional nova;
- for necessário inferir periodicidade/referência para completar o fluxo;
- houver ambiguidade entre fato, cálculo, estimativa e desconhecido;
- a UI exigir diagnóstico ou promessa não suportada;
- o escopo precisar crescer;
- surgir risco de integridade ou segurança não coberto.

Em bloqueio, produzir relatório GOV.01 com evidência, informar alterações/commit/push e declarar a decisão exata necessária do PO/Tech Lead.

## 12. Relatório obrigatório

Persistir em:

`docs/sprints/sprint-03/reports/mission-03.6-report.md`

O relatório deve conter, no mínimo:

1. estado inicial da branch e HEAD;
2. inspeção dirigida das fundações 03.1–03.5;
3. implementação realizada;
4. arquivos criados/modificados;
5. fluxo UX do registro de cuidado;
6. estratégia de criação/preservação de Care Event;
7. integração com Odometer Checkpoint;
8. vínculo e comportamento da nova Care Reference;
9. comportamento da referência anterior após novo marco;
10. estratégia para retry/falha parcial;
11. recálculo e retorno ao cockpit;
12. critérios de aceite item a item;
13. testes/comandos e resultados;
14. smoke tests e resultados;
15. resumo do diff;
16. estado Git final e SHA;
17. riscos, limitações e pendências;
18. confirmação explícita de ausência de referência inferida, diagnóstico, previsão, expansão de escopo e início da 03.7.

Manter **Fatos**, **Decisões** e **Recomendações** distinguíveis conforme `AGENTS.md`.

## 13. Gate de conclusão

A execução pelo Codex não encerra formalmente a missão.

Após o push, o Tech Lead revisará relatório, diff, evidências e estado final. A missão somente será considerada concluída após aceite explícito do PO.

Não iniciar a Missão 03.7 sem autorização.
