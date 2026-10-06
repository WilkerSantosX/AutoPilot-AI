# Missão 03.7 — MVP Validation & Delivery

> Sprint: 03 — Vehicle Care — Da memória à orientação  
> Status: **Approved**  
> Governança: GOV.01 — Mission Handoff Protocol  
> Owner: Chief Architect / Tech Lead  
> Executor: Codex / Senior Software Engineer

## 1. Baseline aprovado

Executar na branch `feature/sprint-03-vehicle-care`, partindo do HEAD aceito da Missão 03.6:

`563eecea6f47c8b00cbf5d8a8a421136bdbb2928`

Este baseline representa **100% da construção funcional autorizada para a Sprint 3**.

Antes de qualquer alteração, confirmar branch, HEAD, upstream e árvore limpa.

## 2. Objetivo

Executar o gate final da Sprint 3 e produzir evidência suficiente para decidir se o incremento Vehicle Care está pronto para Sprint Review e preparação de PR.

A missão deve validar, não expandir, a promessa:

> **“Existe alguma coisa que eu preciso fazer no meu carro agora?”**

Fluxo completo a provar:

`veículo conhecido → conhecimento/lacunas → histórico → referência → quilometragem factual → Care State → Next Action → cockpit → cuidado realizado → novo marco → recálculo → acompanhamento`

## 3. Regra principal

**Esta não é uma missão de features.**

Correções são autorizadas apenas quando necessárias para fazer o comportamento já contratado nas Missões 03.1–03.6 cumprir seu contrato.

Qualquer necessidade de nova capacidade, nova regra de domínio, nova política, redesign ou expansão deve provocar parada e reporte.

## 4. Matriz mínima de validação do produto

Validar ponta a ponta, com dados sintéticos e reproduzíveis:

### 4.1 Primeiro contato / desconhecimento

- veículo válido e sem histórico de cuidados;
- três Care Items presentes;
- histórico desconhecido aceito;
- nenhum fato inventado;
- cockpit comunica informação insuficiente e próxima ação útil;
- usuário consegue continuar sem conhecer o passado.

### 4.2 Histórico conhecido e referência explícita

- registrar cuidado conhecido;
- referência opcional com `source: user`;
- checkpoint factual quando aplicável;
- reload preserva fatos;
- cockpit apresenta evidências e origem da referência.

### 4.3 Quatro Care States

Provar os quatro estados existentes:

- `up-to-date`;
- `due-soon`;
- `attention-needed`;
- `insufficient-information`.

Validar limites da regra dos 10% e ausência de classificação duplicada na UI.

### 4.4 Prioridade do cockpit

Validar combinação de estados e ordenação:

`attention-needed > due-soon > insufficient-information > up-to-date`

Empates devem preservar ordem determinística dos Care Items. A prioridade é de apresentação, não criticidade mecânica.

### 4.5 Care Loop

Validar:

- entrada contextual pelo cockpit;
- registro de cuidado já realizado;
- novo Care Event;
- histórico anterior preservado;
- novo checkpoint factual quando aplicável;
- nova referência opcional vinculada ao novo evento;
- referência anterior não governa novo marco;
- ausência de nova referência não infere intervalo;
- recálculo pelo engine existente;
- feedback de conclusão coerente;
- reload preserva resultado.

### 4.6 Registro retrospectivo

Provar que um cuidado retrospectivo pode entrar no histórico sem reduzir indevidamente a última leitura factual conhecida e sem substituir um marco mais recente quando não for o evento relevante.

### 4.7 Falhas e integridade

Validar comportamento seguro para, quando coberto pela infraestrutura existente:

- storage ausente/corrompido;
- falha de escrita;
- retry após persistência parcial;
- submissão duplicada;
- mudança do veículo ativo durante fluxo;
- rota inválida/Care Item inválido.

Não aceitar sucesso falso, duplicação silenciosa ou sobrescrita de storage corrompido.

## 5. Auditoria de promessas da interface

Revisar toda a experiência visível relacionada à Sprint 3: onboarding, cockpit, Next Actions, Care Loop, mensagens de sucesso/erro e entradas a partir da jornada anterior.

Classificar cada promessa relevante como:

- **Suportada** — comportamento existe e está validado;
- **Ambígua** — texto pode sugerir mais do que o sistema sabe;
- **Não suportada** — interface promete capacidade inexistente.

Não pode permanecer promessa não suportada.

A linguagem deve preservar:

- Care State como estado do acompanhamento, não saúde mecânica;
- referência informada pelo usuário como referência, não recomendação técnica;
- distância em km como cálculo factual, não previsão temporal;
- ausência de dados como desconhecimento, não diagnóstico;
- cuidado registrado como fato, não “problema resolvido”.

Correções exclusivamente textuais ou de navegação necessárias para remover promessa incorreta estão autorizadas, desde que não criem capacidade nova.

## 6. Validação desktop e mobile

Fechar explicitamente a pendência visual registrada na 03.6.

Executar smoke visual em pelo menos:

- viewport desktop representativo;
- viewport mobile representativo.

Validar no mínimo:

- cockpit com três Care Items;
- estados mistos;
- onboarding;
- formulário do Care Loop;
- mensagens de erro/sucesso;
- ausência de corte, sobreposição ou controle inacessível;
- legibilidade;
- foco/navegação básica;
- informação de estado não dependente somente de cor.

Se a ferramenta de captura falhar novamente, diferenciar claramente **falha da ferramenta** de **falha da aplicação** e buscar evidência alternativa reproduzível sem alterar produto para contornar ferramenta.

## 7. Regressão

Executar toda a suíte automatizada existente e validar que continuam funcionais:

- VehicleProfile;
- jornada de perguntas;
- Hero Moment anterior;
- Care Foundation;
- Odometer Checkpoints;
- Care State Engine;
- Care Onboarding;
- Vehicle Care Cockpit;
- Care Loop.

Executar validação sintática e `git diff --check`.

Não enfraquecer testes existentes para obter verde.

## 8. Auditoria de escopo

Inspecionar o diff acumulado da Sprint 3 e confirmar ausência de:

- diagnóstico mecânico;
- afirmação de saúde real do veículo;
- referência/intervalo inventado;
- recomendação de fabricante ou AutoPilot não suportada;
- previsão de data futura;
- média de uso;
- GPS/background tracking;
- OBD-II;
- notificações;
- backend/cloud;
- autenticação;
- LLM/chatbot;
- expansão dos três Care Items;
- novas dependências/frameworks;
- arquitetura desnecessária;
- capacidades de Sprint futura apresentadas como prontas.

## 9. Evidências

Criar evidências suficientes para revisão sem depender apenas de afirmações textuais do relatório.

Organizar, quando aplicável, em:

`docs/sprints/sprint-03/reports/mission-03.7-evidence/`

Priorizar evidências dos cenários:

1. informação insuficiente;
2. estado em dia;
3. atenção em breve;
4. atenção necessária;
5. estados mistos/prioridade;
6. Care Loop com nova referência;
7. Care Loop sem nova referência;
8. reload;
9. mobile;
10. jornada anterior preservada.

Não adicionar evidência redundante sem valor de revisão.

## 10. Correções permitidas

Se a validação encontrar defeito claramente dentro dos contratos 03.1–03.6, o Codex pode corrigi-lo na própria 03.7 desde que:

1. documente o defeito e evidência;
2. demonstre qual critério já aprovado estava violado;
3. faça a menor correção possível;
4. adicione/ajuste teste sem remover cobertura legítima;
5. reexecute a matriz afetada e a regressão;
6. registre a correção no relatório.

Se houver dúvida se é bug ou feature, **parar e reportar**.

## 11. Fora do escopo

Não autoriza:

- nova feature de Vehicle Care;
- novos Care Items;
- timeline completa;
- edição/exclusão avançada;
- custos/oficinas/peças;
- recomendações automáticas;
- novas fontes de política;
- previsão;
- notificações;
- GPS/OBD;
- backend;
- autenticação;
- LLM;
- redesign global;
- novas dependências;
- refatoração ampla sem necessidade de correção;
- merge em `main`.

## 12. Critérios de aceite

A missão é tecnicamente aceitável quando:

1. Journey 03 completa foi executada com evidência;
2. desconhecimento do histórico continua sendo caminho válido;
3. os quatro Care States foram comprovados;
4. prioridade do cockpit foi comprovada;
5. Care Loop fecha o ciclo sem inferir nova referência;
6. persistência/reload foram comprovados;
7. retrospectividade preserva coerência do odômetro;
8. falhas relevantes não produzem sucesso falso;
9. desktop e mobile foram validados ou eventual limitação externa foi documentada com evidência alternativa suficiente;
10. auditoria de promessas não encontrou promessa não suportada remanescente;
11. regressão completa está verde;
12. diff/sintaxe estão limpos;
13. não houve vazamento de escopo;
14. riscos e limitações remanescentes estão explícitos;
15. o incremento está pronto para Sprint Review e preparação de PR.

## 13. Entregáveis

Criar:

`docs/sprints/sprint-03/reports/mission-03.7-report.md`

O relatório deve conter seções distinguíveis de **Fatos**, **Decisões** e **Recomendações**, e no mínimo:

- baseline e estado Git inicial;
- matriz de validação executada;
- auditoria de promessas;
- resultados desktop/mobile;
- regressão e comandos;
- bugs encontrados e correções realizadas, se houver;
- evidências produzidas;
- auditoria de escopo;
- riscos/limitações;
- estado Git final;
- SHA publicado;
- recomendação explícita: **Ready for Sprint Review** ou **Not Ready**, com justificativa.

## 14. Git e publicação

Autorizado:

- alterações mínimas necessárias para correções dentro do contrato;
- relatório/evidências da 03.7;
- commit e push na `feature/sprint-03-vehicle-care`.

Mensagem sugerida:

`test(vehicle-care): validate sprint 03 mvp`

Não autorizado:

- merge;
- alteração direta em `main`;
- rebase/squash/force-push;
- início de Sprint 4;
- criação de nova feature fora das correções permitidas.

## 15. Condições de parada

Parar e reportar se:

- baseline/branch divergirem;
- surgir conflito documental;
- um comportamento necessário não estiver coberto pelos contratos aprovados;
- a correção exigir nova regra de domínio;
- houver necessidade de nova dependência/arquitetura;
- auditoria revelar promessa cuja correção implique feature;
- integridade dos dados não puder ser garantida no modelo atual;
- regressão crítica não puder ser corrigida dentro do escopo;
- qualquer resultado impedir recomendação responsável de entrega.

## 16. Gate final

A execução da 03.7 não fecha automaticamente a Sprint.

Após o push:

1. Tech Lead revisa relatório, diff e evidências;
2. PO realiza aceite explícito da Missão 03.7;
3. realizamos **Sprint Review focada no produto**;
4. consolidamos pendências e decisão de entrega;
5. somente com autorização explícita do PO avançamos para PR/merge.

Nenhum merge está autorizado por este contrato.
