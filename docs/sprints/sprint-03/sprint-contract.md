# Sprint 3 — Implementation Contract

## Vehicle Care — Da memória à orientação

Data de aprovação: 2026-10-04 — America/Sao_Paulo  
Status: **Approved pelo PO — execução das missões permanece sujeita a autorização própria**  
Baseline de planejamento: `main` após o fechamento documental da Sprint 2 (`fdbcf782263b189cd2907c239773dadc7c016c5f`).

## 1. Sprint Goal

> Fazer o AutoPilot responder pela primeira vez: **“O que meu carro precisa de mim agora?”**

A Sprint 2 estabeleceu o veículo como contexto persistente. A Sprint 3 transforma parte desse contexto em orientação útil e responsável, inaugurando o primeiro ciclo de Vehicle Care.

## 2. Hipótese de produto

Se o AutoPilot conhecer o veículo, sua quilometragem e acontecimentos relevantes de manutenção, poderá interpretar esse contexto e ajudar o proprietário a entender o que está em dia, o que está se aproximando, o que requer atenção e o que ainda não é possível avaliar.

A Sprint não busca diagnóstico automotivo. O fluxo-alvo é:

`memória → interpretação determinística → orientação → próxima ação`

## 3. Journey 03

`Veículo conhecido → identificar conhecimento/lacunas → obter histórico quando conhecido → aceitar histórico desconhecido → propor próxima ação → registrar cuidado → estabelecer marco confiável → recalcular estado → apresentar situação e próxima ação no cockpit`

Loop de produto:

`acompanhar → orientar → agir → registrar → recalcular → acompanhar`

## 4. Primeiro recorte de Vehicle Care

A Sprint prova o mecanismo inicialmente com três famílias:

- **Óleo do motor** — acompanhar referência conhecida ou estabelecer novo marco após uma troca.
- **Arrefecimento** — acompanhar atenção/verificação sem alegar condição mecânica não observada.
- **Revisão básica** — acompanhamento preventivo periódico sem diagnóstico.

A Sprint não cria uma biblioteca completa de manutenção.

## 5. Modelo conceitual

### Care Item

Algo do veículo que precisa ser acompanhado. Exemplos iniciais: `engine-oil`, `cooling`, `basic-review`.

### Care Event

Fato informado sobre algo que aconteceu com um cuidado, por exemplo: troca de óleo realizada em determinada data e quilometragem. Care Event representa fato registrado, não previsão.

### Odometer Checkpoint

Leitura de quilometragem associada a um momento. Quilometragem não deve ser tratada conceitualmente apenas como `currentMileage`; o domínio deve preservar caminho para `checkpoints → histórico → padrão de uso → estimativa futura`.

### Care State

Interpretação atual do cuidado. Estados conceituais mínimos:

- **Em dia**
- **Atenção em breve**
- **Atenção necessária**
- **Informação insuficiente**

A terminologia de interface pode ser refinada sem alterar silenciosamente a semântica.

## 6. Next Action

Todo Care State relevante deve tentar responder **“O que eu faço agora?”**.

Informação ausente deve, quando possível, virar uma ação compreensível em vez de um beco sem saída.

## 7. Histórico desconhecido

> **O AutoPilot não exige conhecimento do passado para começar a cuidar do futuro.**

Se o motorista não souber quando um cuidado ocorreu, o AutoPilot não inventa, não bloqueia e não diagnostica. Deve permitir estabelecer um novo marco confiável quando o usuário realizar e registrar o cuidado.

## 8. Quilometragem

Nesta Sprint, a fonte confiável de quilometragem é a informação explicitamente fornecida pelo usuário.

Novos **Odometer Checkpoints** devem poder atualizar o contexto do veículo e alimentar o recálculo dos Care Items dependentes de quilometragem.

Não entram nesta Sprint GPS contínuo, localização em background, inferência de deslocamento do veículo pelo celular, OBD-II ou telemetria automática.

## 9. Honestidade epistemológica

> **O AutoPilot deve distinguir aquilo que sabe, aquilo que calcula, aquilo que estima e aquilo que não sabe.**

Uma leitura informada pelo motorista, um cálculo derivado, uma estimativa e uma lacuna de conhecimento são categorias diferentes. O domínio não deve apagar essa diferença.

## 10. Proatividade Progressiva

> **O AutoPilot deve reduzir progressivamente a dependência da iniciativa e da memória do motorista para manter o veículo acompanhado.**

Evolução pretendida:

`usuário informa → AutoPilot interpreta`

`AutoPilot lembra → usuário confirma`

`AutoPilot estima → usuário valida`

`AutoPilot observa → usuário intervém quando necessário`

A Sprint 3 implementa apenas o recorte autorizado, preservando caminho para as etapas futuras.

## 11. Cockpit

O cockpit deve evoluir para responder:

- Como meu veículo está dentro dos cuidados conhecidos?
- O que está em dia?
- O que está se aproximando?
- O que o AutoPilot ainda não sabe?
- Qual é minha próxima ação?

O Hero Moment é o usuário conseguir compreender rapidamente o estado dos cuidados conhecidos e sua próxima atenção. Isso congela a promessa da experiência, não um layout ou texto específico.

## 12. Guardrail de segurança e coerência

O AutoPilot acompanha cuidados conhecidos; não diagnostica condição mecânica real a partir de registros de manutenção.

Não deve afirmar saúde mecânica de motor, freios ou outros sistemas sem evidência apropriada. Linguagem e controles da interface devem permanecer coerentes com capacidades reais.

## 13. Fora do escopo

Explicitamente fora da Sprint 3:

- OBD-II;
- GPS/background tracking;
- APIs de fabricantes;
- backend/cloud sync;
- autenticação;
- push notifications;
- chatbot/LLM;
- diagnóstico de defeitos;
- recomendação de oficinas;
- marketplace/compra de peças;
- custos avançados;
- biblioteca completa de manutenção;
- expansão indiscriminada de Care Items;
- machine learning;
- resolução incidental de toda a Foundation Recovery.

## 14. Critério de sucesso

No fechamento da Sprint, o proprietário deve abrir o AutoPilot e conseguir responder, sem cálculos manuais:

> **“Existe alguma coisa que eu preciso fazer no meu carro agora?”**

Quando os dados forem insuficientes, o AutoPilot deve conseguir comunicar honestamente que ainda não sabe e indicar a próxima informação ou ação necessária para avançar.

## 15. Decomposição proposta

- **03.1 — Vehicle Care Foundation** — Care Item, Care Event e persistência inicial.
- **03.2 — Odometer Checkpoints** — histórico confiável de quilometragem integrado ao veículo.
- **03.3 — Care State Engine** — estados determinísticos, informação insuficiente e Next Action.
- **03.4 — Care Onboarding** — histórico conhecido/desconhecido e estabelecimento de referências.
- **03.5 — Vehicle Care Cockpit** — estados e próximas ações na experiência principal.
- **03.6 — Care Loop** — cuidado realizado → Care Event → recálculo → nova referência.
- **03.7 — MVP Validation & Delivery** — Journey 03, casos desconhecidos, persistência, regressão, auditoria de promessas, evidências e preparação de PR.

A decomposição pode ser refinada mediante evidência técnica, mas mudanças de escopo ou semântica exigem decisão explícita.

## 16. Governança e autorização

O PO Wilker aprovou este contrato em 2026-10-04.

A aprovação autoriza o planejamento formal da Sprint 3 e o versionamento deste contrato. **Não autoriza implicitamente implementação de qualquer missão, merge, expansão de escopo ou capacidade futura listada como fora de escopo.** Cada missão segue o protocolo de handoff vigente e seus próprios gates de execução, evidência, review, aceite e merge.
