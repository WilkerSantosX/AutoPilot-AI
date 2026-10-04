Engineering Discovery — Sprint 2
1. Executive Summary
A aplicação atual é um protótipo web estático, implementado com HTML, CSS e JavaScript ES Modules, sem framework, bundler, backend ou gerenciador de pacotes.
O fluxo existente é:
Landing → Questionário → Análise simulada → Cockpit
Já existe um contexto visual e textual de veículo, mas ele é inteiramente estático: o veículo “Renault Clio 2001 RT 1.0 16V” aparece fixado no código. Não há modelo estruturado de veículo, criação de perfil, validação de dados ou persistência.
O ponto mais natural para integrar a feature é a primeira pergunta do questionário, “Qual carro vamos analisar?”. A opção “Escolher outro” já sinaliza a intenção de cadastrar ou selecionar outro veículo, embora o motor atual não suporte ramificações condicionais.
A menor implementação coerente deve:
preservar a SPA e o roteador atuais;
adicionar uma tela de cadastro de veículo;
introduzir um modelo simples e validável;
encapsular a criação em um caso de uso pequeno;
persistir um único perfil em localStorage;
fazer o cockpit consumir o perfil persistido;
manter backend, autenticação e múltiplos veículos fora do escopo.
Não há testes automatizados nem infraestrutura para executá-los. A Feature Specification ainda não existe e várias regras necessárias — tipos, obrigatoriedade, validações e comportamento após cadastro — continuam abertas.
Classificação utilizada no relatório:
Fato observado: evidência presente no repositório.
Recomendação: proposta para a futura Feature Specification, ainda não implementada.
2. Current Stack
Fatos observados
HTML5.
CSS puro.
JavaScript nativo com ES Modules.
Bootstrap CSS 5.3.3 carregado por CDN.
Bootstrap Icons 1.11.3 carregado por CDN.
Fonte Poppins carregada do Google Fonts.
DOM API nativa para renderização e eventos.
Templates HTML produzidos com template strings.
SPA sem alteração de URL.
Nenhum package.json, lockfile ou configuração de build foi encontrado.
Nenhum framework como React, Vue, Angular ou Svelte foi encontrado.
Nenhum backend, API client ou chamada fetch foi encontrado.
Nenhuma dependência JavaScript local foi encontrada.
O JavaScript do Bootstrap não é carregado; somente seu CSS é utilizado.
Implicações
Não existe etapa de build ou compilação.
A aplicação depende de acesso à internet para Bootstrap, ícones e Poppins.
A lógica roda integralmente no navegador.
A stack atual permite implementar a feature sem introduzir framework ou backend.
3. Application Entry Point
Fatos observados
A inicialização começa em:
[`index.html`](C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI/apps/autopilot-web/index.html), que:
carrega estilos externos e locais;
declara <main id="app"></main>;
carrega ./app.js como módulo.

[`app.js`](C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI/apps/autopilot-web/app.js), que:
importa renderApp;
executa renderApp() imediatamente.

[`router.js`](C:/Users/adriw/OneDrive/Documents/CodeRepos/AutoPilot-AI/apps/autopilot-web/router.js), que:
encontra #app;
consulta AppState.currentScreen;
renderiza e conecta eventos da tela correspondente.

Não existe bootstrap assíncrono, carregamento de dados persistidos ou tratamento global de inicialização.
4. Repository and Application Structure
Estrutura do repositório
apps/: aplicações executáveis.
apps/autopilot-web/: aplicação web atual.
docs/: conhecimento versionado.
docs/project-bible/: direção estratégica.
docs/engineering-bible/: princípios e regras técnicas.
docs/apdl/: processo oficial de desenvolvimento.
docs/adr/: decisões arquiteturais.
docs/sprints/: planejamento das Sprints.
packages/: reservado para compartilhamento real; não deve ser usado preventivamente.
scripts/: automações operacionais.
tools/: ferramentas internas.
Estrutura de apps/autopilot-web
index.html: documento principal e carregamento de recursos.
app.js: entry point JavaScript.
router.js: estado principal, navegação e composição das telas.
screens/: renderização e eventos específicos de cada tela.
components/: componentes HTML reutilizáveis.
data/: definição estática das perguntas.
engine/: controle do questionário e respostas.
state/: arquivo de estado atualmente não utilizado.
styles/: tema e estilos de telas.
README.md: existe, mas está vazio.
Limites observados
A separação atual é majoritariamente orientada à interface. Ainda não existem diretórios ou módulos explícitos de domínio, aplicação/casos de uso ou infraestrutura/persistência.
5. Current Navigation Flow
Fluxo observado
landing
Renderiza a landing page.
“Iniciar Diagnóstico” chama goToScreen("questionnaire").

questionnaire
Renderiza uma pergunta por vez.
Ao terminar, salva as respostas em memória e chama goToScreen("hero").

hero
Executa uma sequência temporizada de mensagens e progresso.
Ao concluir, chama goToScreen("cockpit").

cockpit
Exibe usuário e veículo fixos.
Seus botões apenas registram mensagens no console.

Características do roteamento
Não utiliza History API.
Não utiliza hash routing.
A URL não muda.
Recarregar a página sempre reinicia em landing.
Não há deep links.
Nomes de telas são strings sem validação centralizada.
Uma tela desconhecida retorna para landing.
Toda transição substitui o conteúdo de #app.
6. Existing Screens and Components
Telas ativas
landingScreen.js: apresentação do produto e início do diagnóstico.
questionScreen.js: questionário sequencial.
HeroScreen.js: análise visual simulada.
CockpitScreen.js: painel final.
Tela aparentemente órfã
questionnaireScreen.js:não é importada pelo roteador;
referencia Questions, AppState, app, renderAutoCard, renderQuestionCard e goToScreen sem imports ou parâmetros;
parece ser uma versão anterior do questionário;
não participa do fluxo atual.

Componentes reutilizáveis
AutoCard: avatar e mensagem do assistente.
FeatureCard: card de benefício com ícone, título e descrição opcional.
QuestionCard: contêiner genérico para título, subtítulo e conteúdo de pergunta.
Reutilização potencial
QuestionCard e AutoCard podem contribuir visualmente para a nova tela. Entretanto, um formulário com vários campos pode justificar uma tela própria, sem forçar QuestionCard a assumir uma responsabilidade diferente.
Limitação de segurança
Os componentes produzem HTML por interpolação direta. Hoje os valores são internos e estáticos. Se dados digitados pelo usuário forem interpolados posteriormente, será necessário evitar inserção insegura em innerHTML ou escapar os valores.
7. State Management
Fatos observados
O estado ativo está declarado dentro de router.js:
{
    currentScreen: "landing",
    answers: {}
}
O questionário mantém estado adicional no fechamento criado por createQuestionEngine:
índice atual;
respostas;
navegação anterior/próxima;
progresso;
reset.
questionScreen.js também mantém variáveis no escopo do módulo:
selectedAnswer;
currentOnComplete.
Existe outro AppState em state/appState.js, mas ele não é importado por nenhum arquivo. Portanto, há duas definições conceitualmente equivalentes, sendo apenas a do roteador efetiva.
Consequências
Todo estado é volátil.
Recarregar a página apaga respostas e reinicia o fluxo.
O estado do questionário sobrevive a transições internas porque o engine é uma instância no escopo do módulo.
Retornar futuramente ao questionário pode reapresentar o estado anterior, pois o engine não é resetado pelo roteador.
Não existe mecanismo de assinatura, reducer, store ou sincronização.
As respostas concluídas são copiadas para AppState.answers, mas não são utilizadas pelo hero ou cockpit.
8. Persistence
Fatos observados
Não existe persistência local.
Não foram encontrados usos de:
localStorage;
sessionStorage;
IndexedDB;
cookies;
arquivos locais;
backend ou API.
O perfil de veículo não permanece disponível após recarregamento, contrariando ainda não o código vigente, mas o critério planejado da Sprint 2.
Recomendação
Para o escopo de um único veículo, sem autenticação e sem backend, localStorage é a menor solução coerente.
A persistência deve ficar isolada atrás de um módulo pequeno, permitindo:
serialização e leitura;
chave estável e identificável;
tratamento de JSON inválido;
tratamento de falha de escrita;
substituição controlada do único perfil;
prevenção de duplicidade por reenvio.
Não há evidência atual que justifique API ou banco de dados.
9. Existing Vehicle Context
Fatos observados
Não existe modelo formal de veículo.
O contexto equivalente está espalhado em strings:
primeira pergunta: “Qual carro vamos analisar?”;
opção fixa: “Renault Clio 2001 RT 1.0 16V”;
subtítulo sugere que já existe veículo cadastrado;
cockpit recebe o mesmo veículo como vehicleName;
cockpit usa valores padrão equivalentes;
hero menciona “contexto do veículo”.
O veículo atual não possui:
identificador;
fabricante separado;
modelo separado;
ano tipado;
motorização separada;
quilometragem;
combustível;
apelido;
timestamps;
versão de schema.
As respostas do questionário armazenam questionId, value e answeredAt, mas isso não constitui um perfil de veículo.
10. Candidate Integration Point
Fato observado
A primeira pergunta oferece:
um veículo supostamente existente;
“Escolher outro”.
Essa é a indicação mais clara de um ponto de entrada para criação de perfil.
Recomendação principal
Na inicialização ou ao entrar no questionário:
se existir um perfil persistido, apresentar esse veículo como opção;
se não existir perfil, direcionar à criação do perfil;
“Escolher outro” pode abrir a tela de criação enquanto houver suporte a apenas um veículo.
Depois do cadastro bem-sucedido, a especificação deve definir se o usuário:
retorna ao questionário com o veículo selecionado; ou
recebe confirmação e segue diretamente ao cockpit.
Para preservar o fluxo existente, o retorno ao questionário com o veículo recém-criado é a integração mais conservadora.
Alternativa simples
A landing page pode direcionar primeiro para criação de perfil quando nenhum veículo persistido existir. Isso é tecnicamente menor, mas muda a semântica do CTA “Iniciar Diagnóstico” e precisa de decisão de produto.
11. Files Likely to Be Modified
Recomendação
index.html
incluir o novo CSS, caso seja criado um stylesheet próprio.

router.js
adicionar rota lógica da tela;
carregar o perfil na inicialização;
transmitir o perfil ao questionário e cockpit;
remover dependência do veículo fixo.

data/questions.js
substituir a opção fixa pelo perfil real ou retirar dessa lista a responsabilidade de seleção do veículo.

screens/questionScreen.js
suportar a entrada na criação de perfil ou receber opções de veículo dinamicamente.

screens/CockpitScreen.js
renderizar nome derivado do perfil persistido;
eliminar o veículo fixo.

state/appState.js
somente se a Feature Specification decidir centralizar nele o estado hoje duplicado.

Estilos existentes, especialmente styles/style.css ou components/QuestionCard/QuestionCard.css
apenas se a nova tela reutilizar suas regras em vez de possuir CSS próprio.

Observação
questionnaireScreen.js não deve ser usado como base sem uma decisão explícita. Atualmente é código órfão e incompleto. Sua remoção seria uma limpeza separada, não requisito automático da feature.
12. Files Likely to Be Created
Recomendação mínima
Nomes finais devem ser definidos na Feature Specification, mas as responsabilidades provavelmente exigirão:
screens/VehicleProfileScreen.js
formulário, apresentação de erros e eventos.

styles/vehicleProfile.css
estilos específicos da nova tela, caso os estilos existentes não sejam suficientes.

Um módulo de domínio, por exemplo domain/vehicleProfile.js
normalização e validação das regras do perfil.

Um caso de uso, por exemplo application/createVehicleProfile.js
coordenação entre validação e persistência.

Um adaptador de persistência, por exemplo infrastructure/vehicleProfileStorage.js
leitura e escrita no localStorage.

Arquivos de teste para domínio, caso de uso e persistência.

Restrição
Não há justificativa para criar um package compartilhado, API, repositório remoto, framework de estado ou hierarquia genérica de entidades.
13. Tests and Validation
Testes automatizados observados
Não foram encontrados:
arquivos *.test.* ou *.spec.*;
test runner;
package.json;
scripts de teste;
pipeline de build/teste específico da aplicação.
A Engineering Bible declara prioridade para testes unitários, integração e E2E conforme necessidade, mas não define ferramenta.
Como executar atualmente
O documento de bootstrap recomenda abrir:
apps/autopilot-web/index.html
Como o projeto usa ES Modules, uma validação mais previsível é servi-lo por HTTP usando uma ferramenta já disponível no ambiente, por exemplo:
python -m http.server 8000 --directory apps/autopilot-web
Depois:
http://localhost:8000
Esse comando é uma recomendação; não foi executado nesta discovery.
Checklist manual atual
landing carrega sem erros;
estilos, ícones e fonte carregam;
botão inicia o questionário;
cada opção habilita “Continuar”;
“Voltar” restaura a resposta anterior;
última pergunta inicia o hero;
hero chega a 100%;
cockpit é exibido;
console não apresenta erros inesperados;
layout é validado em desktop e viewport móvel.
Validação necessária para a feature
bloqueio dos campos inválidos;
mensagens por campo;
cadastro válido;
confirmação visual;
persistência após reload;
prevenção de duplicidade no duplo clique/reenvio;
cockpit usando o perfil salvo;
recuperação segura de JSON inválido;
tratamento de falha do localStorage.
A ferramenta e os comandos de testes automatizados são uma lacuna a ser resolvida pela Feature Specification.
14. Technical Risks
Riscos observados
Estado duplicado: AppState existe no roteador e em state/appState.js.
Código órfão: questionnaireScreen.js não integra o fluxo e possui referências não resolvidas.
Dados fixos: veículo e usuário estão espalhados em strings.
Ausência de persistência: reload destrói todo o contexto.
Roteamento somente em memória: não há recuperação de rota ou deep link.
Engine linear: não suporta “Escolher outro” como ramificação.
Singleton do questionário: o engine é criado uma vez e pode reter respostas em reentradas futuras.
Interpolação de HTML: dados do usuário podem introduzir XSS se forem inseridos diretamente em templates.
Dependências CDN: execução visual completa requer internet; não há versões locais.
Falhas do armazenamento: modo privado, quota, bloqueio de storage e JSON corrompido precisam de tratamento.
Ausência de testes: mudanças no fluxo podem produzir regressões silenciosas.
Duplo envio: sem bloqueio ou operação idempotente, o formulário pode executar duas gravações.
Derivação do nome do veículo: não existe regra para formatar fabricante, modelo, ano, motor e apelido.
Documentação divergente: o README raiz afirma que o pacote não inclui implementação de produto, embora exista uma aplicação funcional de protótipo.
Validação manual não executada: esta missão não iniciou servidor nem abriu browser; o comportamento foi inferido por inspeção estática.
15. Gaps and Open Questions
A implementação não deve começar antes da resolução de:
Quais campos são obrigatórios?
Qual é o tipo exato de cada campo?
Ano representa ano de fabricação, ano-modelo ou ambos?
Quais limites de ano são aceitos?
Quilometragem é inteira? Qual unidade e limite?
Motorização é texto livre ou conjunto controlado?
Quais combustíveis são aceitos?
Como veículos flex devem ser representados?
Espaços devem ser normalizados?
O apelido vazio deve ser omitido ou armazenado como string vazia?
O perfil precisa de ID e timestamps?
Qual é a chave e a versão do schema no localStorage?
Reenvio substitui o perfil existente ou retorna o perfil já criado?
O que caracteriza duplicidade?
Qual é o destino após sucesso?
Como o usuário tenta novamente após falha de persistência?
O veículo mock deve desaparecer completamente ou ser convertido em seed?
O cockpit deve mostrar apelido ou descrição completa?
O formulário será uma única tela ou fluxo de perguntas?
A criação é obrigatória antes do diagnóstico?
Qual ferramenta de testes será aprovada?
É aceitável introduzir a primeira estrutura explícita de domínio/aplicação/infraestrutura dentro do app?
O nome fixo “Wilker” permanece fora do escopo ou deve ser neutralizado?
Deve existir edição implícita ao cadastrar novamente? Isso conflitaria com a exclusão explícita de edição do escopo.
O Project Bible disponível contém apenas o README e o histórico, embora seu README mencione outros documentos estratégicos.
A Sprint possui somente sprint-plan.md; não há Feature Specification aprovada.
16. Minimal Recommended Implementation
Recomendação
A menor solução que atende ao plano sem ampliar o escopo é:
Criar um formulário único para:
fabricante;
modelo;
ano;
motorização;
quilometragem atual;
combustível;
apelido opcional.

Manter validação determinística em um módulo de domínio pequeno.

Criar um único caso de uso createVehicleProfile, responsável por:
normalizar entrada;
validar;
criar a representação do perfil;
solicitar persistência;
retornar sucesso ou erros compreensíveis.

Criar um adaptador mínimo para localStorage.

Armazenar apenas um perfil.

Usar uma chave versionada e uma estrutura simples, por exemplo conceitualmente:

{
    id,
    manufacturer,
    model,
    year,
    engine,
    mileage,
    fuelType,
    nickname,
    createdAt
}
A definição final pertence à Feature Specification.
Integrar a criação antes ou a partir da primeira pergunta.

Depois do sucesso:
exibir confirmação;
atualizar o estado em memória;
continuar o fluxo com o veículo criado.

Fazer o cockpit receber o veículo real por parâmetro.

Cobrir automaticamente:
validação do domínio;
sucesso e falha do caso de uso;
serialização/persistência;
prevenção de reenvio duplicado.

Não são necessários backend, autenticação, múltiplos veículos, API externa, consulta por placa, novo package, framework ou state manager.
17. Commands Inspected or Executed
Somente comandos de leitura foram utilizados:
rg --files ...
Get-Content -LiteralPath ... -Raw -Encoding utf8
rg -n ...
Get-ChildItem ... | Select-Object ...
git status --short --branch
git ls-files apps/autopilot-web
git -c safe.directory=... status --short --branch
Observações:
O primeiro git status e git ls-files foram bloqueados pela proteção de “dubious ownership”.
A verificação foi repetida com git -c safe.directory=..., uma configuração apenas para aquela invocação, sem alterar a configuração global.
O status final exibiu somente a branch feature/sprint-02-vehicle-profile, sem arquivos modificados ou não rastreados.
Nenhum servidor, browser, build ou teste foi iniciado.
Nenhuma dependência foi instalada.
18. Confirmation
Confirmo explicitamente que:
nenhum arquivo foi alterado;
nenhum arquivo foi criado ou removido;
nenhuma funcionalidade foi implementada;
nenhuma refatoração foi executada;
nenhuma dependência foi instalada;
nenhum commit foi realizado;
nenhum push ou Pull Request foi realizado.