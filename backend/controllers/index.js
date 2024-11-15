// frontend/src/components/Question.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Question = ({ topic, userId }) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await axios.get(`/api/questions/${topic}`, { params: { userId } });
      setQuestions(response.data);
    };

    fetchQuestions();
  }, [topic, userId]);

  return (
    <div>
      <h2>Questions for {topic}</h2>
      {questions.map(question => (
        <div key={question.id}>
          <p>{question.title}</p>
          <a href={question.url} target="_blank" rel="noopener noreferrer">Solve on LeetCode</a>
        </div>
      ))}
    </div>
  );
};

export default Question;