export const Questions = [
    {
        id: 1,
        title: "Qual veículo vamos usar nesta jornada?",
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
        subtitle: "Registre seu objetivo. Ele será exibido no resumo; esta etapa não realiza a ação escolhida.",
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
        subtitle: "A urgência declarada será exibida no resumo, sem avaliação mecânica.",
        type: "urgency",
        options: [
            "Baixa — só quero me organizar",
            "Média — percebi algo estranho",
            "Alta — preciso resolver logo"
        ]
    }
];
