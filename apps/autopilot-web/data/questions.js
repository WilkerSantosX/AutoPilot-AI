export const Questions = [
    {
        id: 1,
        title: "Qual carro vamos analisar?",
        subtitle: "Se você já possui um veículo cadastrado, basta selecioná-lo.",
        type: "vehicle",
        options: [
            "Usar este veículo",
            "Escolher outro"
        ]
    },
    {
        id: 2,
        title: "O que você quer fazer agora?",
        subtitle: "Escolha o tipo de análise que mais combina com sua necessidade.",
        type: "goal",
        options: [
            "Entender um problema atual",
            "Planejar a próxima revisão",
            "Acompanhar manutenção preventiva",
            "Aprender mais sobre meu carro"
        ]
    },
    {
        id: 3,
        title: "Qual é o nível de urgência?",
        subtitle: "Isso ajuda o AutoPilot AI a priorizar o diagnóstico.",
        type: "urgency",
        options: [
            "Baixa — só quero me organizar",
            "Média — percebi algo estranho",
            "Alta — preciso resolver logo"
        ]
    }
];
