export function createQuestionEngine(questions = []) {
  let currentIndex = 0;
  const answers = {};

  function getCurrentQuestion() {
    return questions[currentIndex];
  }

  function getCurrentIndex() {
    return currentIndex;
  }

  function getTotalQuestions() {
    return questions.length;
  }

  function getProgress() {
    if (questions.length === 0) return 0;
    return Math.round(((currentIndex + 1) / questions.length) * 100);
  }

  function answerCurrentQuestion(value) {
    const currentQuestion = getCurrentQuestion();

    if (!currentQuestion) return;

    answers[currentQuestion.id] = {
      questionId: currentQuestion.id,
      value,
      answeredAt: new Date().toISOString()
    };
  }

  function getAnswer(questionId) {
    return answers[questionId] || null;
  }

  function getAllAnswers() {
    return { ...answers };
  }

  function canGoBack() {
    return currentIndex > 0;
  }

  function canGoNext() {
    return currentIndex < questions.length - 1;
  }

  function goNext() {
    if (canGoNext()) {
      currentIndex++;
      return true;
    }

    return false;
  }

  function goBack() {
    if (canGoBack()) {
      currentIndex--;
      return true;
    }

    return false;
  }

  function isLastQuestion() {
    return currentIndex === questions.length - 1;
  }

  function reset() {
    currentIndex = 0;

    Object.keys(answers).forEach((key) => {
      delete answers[key];
    });
  }

  return {
    getCurrentQuestion,
    getCurrentIndex,
    getTotalQuestions,
    getProgress,
    answerCurrentQuestion,
    getAnswer,
    getAllAnswers,
    canGoBack,
    canGoNext,
    goNext,
    goBack,
    isLastQuestion,
    reset
  };
}