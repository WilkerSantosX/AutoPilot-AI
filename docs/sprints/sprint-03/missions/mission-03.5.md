# Missão 03.5 — Vehicle Care Cockpit

> Sprint: 03 — Vehicle Care — Da memória à orientação  
> Status: **Approved**  
> Governança: GOV.01 — Mission Handoff Protocol  
> Owner: Chief Architect / Tech Lead  
> Executor: Codex / Senior Software Engineer

## 1. Baseline aprovado

A execução deve iniciar na branch `feature/sprint-03-vehicle-care`, a partir do HEAD aceito da Missão 03.4:

`2ac26bf144212ed7dc4e544a30442393681e2d8b`

Esse baseline contém:

- Vehicle Care Foundation;
- Odometer Checkpoints;
- Care State Engine;
- política de referência explícita `user-next-due-mileage`;
- Care Onboarding funcional.

Antes de alterar código, o Codex deve confirmar branch ativa, HEAD esperado, árvore de trabalho limpa e presença desta missão na branch.

## 2. Objetivo

Evoluir a experiência principal do AutoPilot para apresentar um **Vehicle Care Cockpit** que permita ao motorista compreender rapidamente:

- como estão os cuidados conhecidos do veículo;
- o que está em dia;
- o que está se aproximando;
- o que requer atenção em relação a uma referência registrada;
- o que o AutoPilot ainda não sabe;
- qual é a próxima ação útil.

Esta missão materializa o Hero Moment da Sprint 3:

> **“Existe alguma coisa que eu preciso fazer no meu carro agora?”**

## 3. Intenção de produto

O cockpit não deve ser apenas uma lista de dados técnicos. Ele deve transformar os estados já calculados pelo domínio em uma leitura rápida, responsável e acionável.

A hierarquia da experiência deve favorecer:

`entender situação → identificar prioridade → compreender por quê → saber o próximo passo`

O cockpit deve mostrar a inteligência que já existe, sem criar inteligência nova escondida na interface.

## 4. Princípios obrigatórios

### 4.1 Estado de acompanhamento, não diagnóstico

Care State continua representando o estado do acompanhamento em relação a fatos e referências conhecidas.

A interface não pode converter:

- `up-to-date` em afirmação de saúde mecânica;
- `attention-needed` em diagnóstico de defeito;
- `insufficient-information` em falha do sistema.

### 4.2 Desconhecimento deve virar progresso

Informação insuficiente deve ser apresentada como uma oportunidade clara de avançar, não como um erro genérico.

Exemplo conceitual:

> “Ainda não temos uma referência confiável para este cuidado. Complete o acompanhamento quando souber ou estabeleça um novo marco na próxima manutenção.”

### 4.3 Transparência

Quando houver referência `source: user`, a experiência deve conseguir comunicar que aquela referência foi **informada pelo usuário**.

O cockpit não deve apresentar referência do usuário como recomendação do fabricante ou do AutoPilot.

## 5. Pré-condições

Antes da implementação, o Codex deve:

1. ler `AGENTS.md`;
2. ler `docs/governance/mission-handoff-protocol.md`;
3. ler `docs/sprints/sprint-03/sprint-contract.md`;
4. ler as Missões 03.1–03.4 e seus relatórios;
5. inspecionar a experiência principal atual, cockpit existente, router e componentes reutilizáveis;
6. inspecionar Care Onboarding, Care State Engine e storages relacionados;
7. confirmar como o veículo ativo é carregado e apresentado;
8. confirmar que o cockpit pode evoluir sem nova dependência, framework ou mudança arquitetural relevante.

Se houver conflito com a experiência existente que exija redefinição ampla da jornada, parar e reportar.

## 6. Escopo autorizado

### 6.1 Entrada principal do Vehicle Care

O Vehicle Care deve tornar-se visível e acessível na experiência principal do veículo, sem depender de URL técnica ou conhecimento prévio do usuário.

A solução deve preservar a jornada existente e integrar-se ao cockpit/tela principal atual da maneira mínima coerente com a arquitetura da SPA.

Não criar um sistema de navegação novo.

### 6.2 Visão consolidada dos três Care Items

O cockpit deve apresentar os três Care Items aprovados:

- Óleo do motor;
- Arrefecimento;
- Revisão básica.

Para cada item, a experiência deve derivar o estado utilizando os fatos, referências e Care State Engine existentes.

Não duplicar a lógica de classificação na camada de UI.

### 6.3 Hierarquia de estados

A apresentação deve distinguir visual e semanticamente:

- `attention-needed` — prioridade atual;
- `due-soon` — atenção se aproximando;
- `up-to-date` — acompanhamento dentro da referência;
- `insufficient-information` — informação necessária para avançar.

A terminologia visual pode ser refinada, desde que a semântica permaneça fiel ao domínio.

A UI pode utilizar indicadores visuais, badges, ícones ou estilos já compatíveis com a aplicação, mas não deve depender exclusivamente de cor para comunicar estado.

### 6.4 Resumo principal

O cockpit deve possuir uma leitura resumida que ajude a responder rapidamente se existe algo a fazer agora.

A regra de prioridade deve ser determinística e derivada dos estados existentes, seguindo a ordem conceitual:

1. `attention-needed`;
2. `due-soon`;
3. `insufficient-information`;
4. `up-to-date`.

Essa prioridade organiza a apresentação; não altera o Care State dos itens.

Quando múltiplos itens tiverem a mesma prioridade, não inventar criticidade mecânica entre eles. Usar ordem estável/determinística dos Care Items.

### 6.5 Next Action

Cada Care Item deve expor uma próxima ação coerente com o resultado já produzido pelo Care State Engine.

A UI pode traduzir identificadores técnicos em linguagem humana, mas não deve alterar o significado da ação.

Exemplos conceituais:

- acompanhar;
- preparar-se para a referência que se aproxima;
- agir em relação à referência atingida;
- fornecer histórico/referência/leitura faltante;
- estabelecer novo marco quando realizar o cuidado.

### 6.6 Evidência e explicabilidade mínima

Quando houver dados suficientes, o cockpit deve mostrar contexto suficiente para o usuário compreender a avaliação sem fazer cálculo manual.

Quando aplicável, isso pode incluir:

- última quilometragem factual conhecida;
- quilometragem do marco relevante;
- próxima referência conhecida;
- origem da referência;
- distância factual restante até a referência, calculada deterministicamente quando ambos os valores forem conhecidos.

A distância restante é um cálculo factual simples, não uma previsão temporal.

Não exibir data estimada de vencimento, ritmo de uso ou previsão de quando a referência será atingida.

### 6.7 Informação insuficiente como CTA útil

Quando um Care Item estiver em `insufficient-information`, o cockpit deve orientar o usuário para a ação que pode melhorar aquele acompanhamento.

Quando a lacuna puder ser resolvida pelo Care Onboarding já implementado, oferecer caminho coerente para ele.

Não fabricar um CTA impossível para lacunas que a experiência atual ainda não consegue resolver.

### 6.8 Relação com Care Onboarding

O cockpit deve reconhecer os dados produzidos pela 03.4 após reload e refletir imediatamente os estados correspondentes.

O usuário deve conseguir acessar/retomar o Care Onboarding para complementar informações, sem apagar fatos existentes.

Não reimplementar o onboarding dentro do cockpit.

### 6.9 Quilometragem

O cockpit pode apresentar a última leitura factual conhecida de quilometragem quando isso ajudar a explicar o estado.

Não estimar quilometragem atual.

Se a ausência de checkpoint impedir determinada avaliação, comunicar a lacuna e direcionar para o fluxo autorizado que permita informar a leitura.

### 6.10 Estados de falha

Falhas de leitura/persistência devem ser tratadas separadamente de `insufficient-information`.

Não apresentar corrupção/falha de storage como se fosse simplesmente ausência de histórico.

A experiência deve falhar de forma segura e compreensível, preservando os dados existentes.

### 6.11 Responsividade e acessibilidade

O Vehicle Care Cockpit deve permanecer utilizável em desktop e mobile dentro dos padrões atuais da aplicação.

No mínimo:

- hierarquia textual clara;
- controles navegáveis pelos padrões existentes;
- estado não comunicado apenas por cor;
- textos legíveis;
- CTAs com rótulos compreensíveis;
- foco/feedback coerentes quando aplicável.

Não realizar redesign global da aplicação.

### 6.12 Testes

Adicionar testes automatizados focados usando a abordagem atual do repositório e sem novas dependências.

No mínimo, validar a lógica responsável por:

- consolidar avaliações dos três Care Items;
- prioridade `attention-needed > due-soon > insufficient-information > up-to-date`;
- estabilidade da ordem quando houver empate;
- preservação dos estados individuais;
- cálculo de distância restante quando factual e aplicável;
- ausência de previsão temporal;
- referência `user` permanecendo identificável como tal;
- informação insuficiente produzindo ação útil;
- falha de storage não sendo convertida em `insufficient-information`;
- reload refletindo dados persistidos do onboarding;
- compatibilidade com as fundações 03.1–03.4;
- regressão completa da suíte existente.

Se a infraestrutura atual não suportar teste automatizado de DOM sem nova dependência, testar a lógica extraída e complementar com smoke test manual documentado.

## 7. Fora do escopo / limites

Esta missão **não autoriza**:

- Care Loop completo pós-manutenção;
- fluxo de “realizei este cuidado” com criação automática de novo marco;
- inferência de nova `nextDueMileage`;
- periodicidade automática;
- notificações/push;
- previsão de data futura;
- média de uso;
- políticas de fabricante ou AutoPilot como fontes ativas;
- diagnóstico mecânico;
- afirmação de saúde de sistemas;
- expansão de Care Items;
- oficina/marketplace;
- GPS/background tracking;
- OBD-II/telemetria;
- backend/cloud sync;
- autenticação;
- chatbot/LLM;
- novas dependências/frameworks;
- novo roteador/arquitetura;
- redesign global;
- início antecipado da Missão 03.6.

## 8. Critérios de aceite

A Missão 03.5 é tecnicamente aceitável quando houver evidência de que:

1. Vehicle Care está visível e acessível na experiência principal;
2. os três Care Items são apresentados em uma visão consolidada;
3. os estados vêm do Care State Engine e não de lógica duplicada na UI;
4. existe resumo principal que permite identificar rapidamente a prioridade atual;
5. a ordenação de prioridade é determinística e não inventa criticidade mecânica;
6. cada item apresenta Next Action coerente;
7. informação insuficiente é comunicada honestamente e, quando possível, leva a uma ação útil;
8. referências `user` são apresentadas como informadas pelo usuário;
9. evidências factuais suficientes permitem compreender o estado sem cálculo manual;
10. nenhuma previsão temporal ou diagnóstico é apresentado;
11. dados produzidos pelo Care Onboarding são refletidos após reload;
12. falhas técnicas não são mascaradas como informação insuficiente;
13. experiência é utilizável em desktop e mobile;
14. jornada preexistente permanece funcional;
15. testes focados e regressão passam;
16. nenhuma capacidade da 03.6+ foi antecipada.

## 9. Validação obrigatória

O Codex deve, no mínimo:

- executar toda a suíte automatizada relevante;
- validar sintaxe dos JavaScript alterados e relacionados;
- executar `git diff --check`;
- revisar o diff final procurando vazamento de escopo;
- iniciar/servir a aplicação pelo workflow existente;
- executar smoke test manual do Vehicle Care Cockpit no navegador;
- validar visualmente desktop e viewport mobile;
- testar ao menos um cenário de `attention-needed`;
- testar ao menos um cenário de `due-soon`;
- testar ao menos um cenário de `up-to-date`;
- testar ao menos um cenário de `insufficient-information`;
- testar cenário misto com prioridades diferentes;
- testar navegação cockpit → Care Onboarding;
- testar reload após dados do onboarding;
- verificar console do navegador e registrar erros observados;
- validar que a jornada preexistente continua acessível;
- registrar problemas preexistentes separadamente sem expandir escopo para corrigi-los.

## 10. Regras Git e publicação

Nesta missão, o Codex está autorizado a:

- alterar somente arquivos necessários ao escopo aprovado na branch `feature/sprint-03-vehicle-care`;
- criar `docs/sprints/sprint-03/reports/mission-03.5-report.md`;
- após validação bem-sucedida, fazer commit da implementação e do relatório;
- publicar em `origin/feature/sprint-03-vehicle-care`.

Mensagem sugerida:

`feat(vehicle-care): surface care states in cockpit`

Não está autorizado a:

- alterar/publicar diretamente em `main`;
- realizar merge;
- rebase, squash, force-push ou reescrita de histórico;
- iniciar a Missão 03.6.

## 11. Condições de parada

Parar e reportar antes de improvisar se:

- houver conflito documental;
- branch/baseline estiver incorreto;
- a integração com o cockpit exigir mudança arquitetural relevante;
- for necessário quebrar contratos existentes;
- for necessária nova dependência/framework;
- for necessário duplicar ou alterar silenciosamente a semântica do Care State Engine;
- a UI exigir inventar diagnóstico, periodicidade ou previsão;
- uma lacuna exigir capacidade exclusiva da 03.6 para ser resolvida;
- o escopo precisar crescer;
- surgir risco de integridade ou segurança não coberto.

Em bloqueio, produzir relatório GOV.01 com evidência, informar alterações/commit/push e declarar a decisão exata necessária do PO/Tech Lead.

## 12. Relatório obrigatório

Persistir em:

`docs/sprints/sprint-03/reports/mission-03.5-report.md`

O relatório deve conter, no mínimo:

1. estado inicial da branch e HEAD;
2. inspeção dirigida do cockpit e fundações 03.1–03.4;
3. implementação realizada;
4. arquivos criados/modificados;
5. hierarquia e resumo de estados adotados;
6. mapeamento de Next Actions para linguagem de interface;
7. evidências/explainability apresentadas;
8. integração com Care Onboarding;
9. decisões locais de UX e justificativa;
10. critérios de aceite item a item;
11. testes/comandos e resultados;
12. smoke tests desktop/mobile e resultados;
13. resumo do diff;
14. estado Git final e SHA;
15. riscos, limitações e pendências;
16. confirmação explícita de ausência de diagnóstico, previsão, periodicidade inventada e antecipação da 03.6+.

Manter **Fatos**, **Decisões** e **Recomendações** distinguíveis conforme `AGENTS.md`.

## 13. Gate de conclusão

A execução pelo Codex não encerra formalmente a missão.

Após o push, o Tech Lead revisará relatório, diff, evidências e estado final. A missão somente será considerada concluída após aceite explícito do PO.

Não iniciar a Missão 03.6 sem autorização.
