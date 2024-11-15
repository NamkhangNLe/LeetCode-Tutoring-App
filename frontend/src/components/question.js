// frontend/src/components/Question.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Question = ({ topic, userId }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await axios.get(`/api/questions/${topic}`, { params: { userId } });
      setQuestions(response.data);
      setCurrentQuestion(response.data[0]);
      setLoading(false);
    };

    fetchQuestions();
  }, [topic, userId]);

  const handleAnswer = async (success) => {
    await axios.post('/api/progress', { userId, topic, success });
    // Fetch next question or update UI accordingly
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Questions for {topic}</h2>
      {currentQuestion && (
        <div>
          <p>{currentQuestion.title}</p>
          <a href={currentQuestion.url} target="_blank" rel="noopener noreferrer">Solve on LeetCode</a>
          <button onClick={() => handleAnswer(true)}>Solved</button>
          <button onClick={() => handleAnswer(false)}>Struggled</button>
        </div>
      )}
    </div>
  );
};

export default Question;