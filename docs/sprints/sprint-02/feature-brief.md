# Feature Brief — Initial Vehicle Profile

> Status: Approved
>
> Sprint: Sprint 2 — Vehicle Profile Foundation
>
> Owner: Product Owner & Chief Architect
>
> Version: 1.0

---

# Executive Summary

A Sprint 2 introduz o primeiro contexto persistente de veículo do AutoPilot AI.

Até o momento, a aplicação utiliza um veículo fixo definido diretamente no código, impossibilitando a personalização da experiência do usuário.

Esta Sprint substitui essa abordagem por um perfil persistente criado pelo próprio usuário.

Este perfil passa a ser a fonte oficial de contexto automotivo da aplicação.

---

# Business Goal

Permitir que o AutoPilot AI conheça o veículo do usuário.

A partir desta Sprint, todas as funcionalidades futuras relacionadas ao veículo deverão utilizar este contexto.

---

# Problem Statement

Hoje o sistema apresenta sempre o mesmo veículo durante toda a experiência.

Essa abordagem impede:

- personalização;
- persistência;
- histórico;
- inteligência contextual;
- evolução futura do produto.

Sem um contexto oficial de veículo, o AutoPilot AI não consegue cumprir sua missão de acompanhar a vida útil do automóvel.

---

# User Story

Como proprietário de um veículo,

quero cadastrar meu carro,

para que o AutoPilot AI personalize toda a experiência utilizando os dados reais do meu veículo.

---

# User Outcome

Ao concluir o cadastro:

- meu veículo estará salvo;
- o sistema lembrará dele nas próximas utilizações;
- o diagnóstico utilizará meu veículo;
- o cockpit exibirá meu veículo.

---

# Business Value

Esta Sprint inaugura o conceito de **Vehicle Context**.

Ele será utilizado por futuras funcionalidades como:

- manutenção preventiva;
- revisões;
- histórico;
- consumo;
- diagnósticos;
- alertas;
- integração com hardware;
- inteligência artificial.

---

# User Journey

Fluxo esperado:

```text
Landing
        │
        ▼
Existe veículo salvo?
        │
   ┌────┴────┐
   │         │
 Não        Sim
   │         │
   ▼         ▼
Cadastro   Questionário
   │         │
   └────┬────┘
        ▼
      Hero
        ▼
     Cockpit
```

---

# Vehicle Context Principle

Existe apenas um contexto oficial de veículo.

Todas as telas deverão consumir este contexto.

Nenhuma tela deverá reconstruir manualmente informações do veículo.

---

# Scope

## Incluído

- cadastro do veículo;
- validação;
- persistência local;
- recuperação do perfil;
- integração ao fluxo atual;
- cockpit utilizando o perfil.

---

## Fora do Escopo

- backend;
- login;
- múltiplos veículos;
- edição;
- exclusão;
- upload de foto;
- consulta por placa;
- integração OBD;
- APIs externas;
- sincronização em nuvem;
- IA.

---

# Success Criteria

A Sprint será considerada bem-sucedida quando:

- o usuário conseguir cadastrar um veículo;
- o perfil permanecer salvo após recarregar a aplicação;
- o fluxo atual continuar funcionando;
- o cockpit utilizar o veículo cadastrado;
- o usuário não precisar cadastrar novamente o veículo a cada acesso.

---

# Product Impact

Esta feature representa o nascimento do primeiro conceito persistente do domínio do AutoPilot AI.

Ela estabelece a base para toda a evolução futura da plataforma.

---

# References

- Project Bible
- Engineering Bible
- APDL
- Sprint Plan
- Engineering Discovery
- Implementation Contract