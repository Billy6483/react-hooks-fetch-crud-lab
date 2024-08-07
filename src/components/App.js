import React, { useState, useEffect } from 'react';
import QuestionList from './QuestionList';
import NewQuestionForm from './NewQuestionForm';

function App() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/questions')
      .then(response => response.json())
      .then(data => setQuestions(data))
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  const handleAddQuestion = (newQuestion) => {
    setQuestions(prev => [...prev, newQuestion]);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(prev => prev.filter(question => question.id !== id));
  };

  const handleUpdateQuestion = (updatedQuestion) => {
    setQuestions(prev => prev.map(question =>
      question.id === updatedQuestion.id ? updatedQuestion : question
    ));
  };

  return (
    <div>
      <NewQuestionForm onAddQuestion={handleAddQuestion} />
      <QuestionList
        questions={questions}
        onDeleteQuestion={handleDeleteQuestion}
        onUpdateQuestion={handleUpdateQuestion}
      />
    </div>
  );
}

export default App;
