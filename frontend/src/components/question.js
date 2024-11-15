// src/components/Question.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Question({ userId }) {
  const [practiceProblems, setPracticeProblems] = useState(null);

  useEffect(() => {
    axios.get('/api/practice')
      .then(response => {
        setPracticeProblems(response.data);
      })
      .catch(error => {
        console.error('Error fetching practice problems:', error);
      });
  }, []);

  return (
    <div>
      <h2>Practice Problems</h2>
      {practiceProblems ? <pre>{JSON.stringify(practiceProblems, null, 2)}</pre> : 'Loading...'}
    </div>
  );
}

export default Question;