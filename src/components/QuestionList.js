import React from 'react';

function QuestionList({ questions, onDeleteQuestion, onUpdateQuestion }) {
  const handleDelete = (id) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'DELETE'
    })
      .then(() => onDeleteQuestion(id))
      .catch(error => console.error('Error deleting question:', error));
  };

  const handleUpdate = (id, newCorrectIndex) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correctIndex: newCorrectIndex })
    })
      .then(response => response.json())
      .then(updatedQuestion => onUpdateQuestion(updatedQuestion))
      .catch(error => console.error('Error updating question:', error));
  };

  return (
    <ul>
      {questions.map(question => (
        <li key={question.id}>
          <p>{question.prompt}</p>
          <ul>
            {question.answers.map((answer, index) => (
              <li key={index}>{answer}</li>
            ))}
          </ul>
          <select
            value={question.correctIndex}
            onChange={(e) => handleUpdate(question.id, parseInt(e.target.value))}
          >
            {question.answers.map((_, index) => (
              <option key={index} value={index}>
                {`Answer ${index + 1}`}
              </option>
            ))}
          </select>
          <button onClick={() => handleDelete(question.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default QuestionList;
