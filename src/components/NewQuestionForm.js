import React, { useState } from 'react';

function NewQuestionForm({ onAddQuestion }) {
  const [formData, setFormData] = useState({
    prompt: '',
    answers: ['', '', '', ''],
    correctIndex: 0
  });

  const handleChange = (e) => {
    const { name, value, type, dataset } = e.target;
    if (type === 'text') {
      if (name === 'prompt') {
        setFormData(prev => ({ ...prev, [name]: value }));
      } else {
        const updatedAnswers = [...formData.answers];
        updatedAnswers[dataset.index] = value;
        setFormData(prev => ({ ...prev, answers: updatedAnswers }));
      }
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:4000/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(newQuestion => {
        onAddQuestion(newQuestion);
        setFormData({
          prompt: '',
          answers: ['', '', '', ''],
          correctIndex: 0
        });
      })
      .catch(error => console.error('Error adding question:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Prompt:
        <input
          type="text"
          name="prompt"
          value={formData.prompt}
          onChange={handleChange}
        />
      </label>
      <label>
        Answers:
        {formData.answers.map((answer, index) => (
          <input
            key={index}
            type="text"
            data-index={index}
            value={answer}
            onChange={handleChange}
          />
        ))}
      </label>
      <label>
        Correct Answer Index:
        <input
          type="number"
          name="correctIndex"
          value={formData.correctIndex}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Add Question</button>
    </form>
  );
}

export default NewQuestionForm;
