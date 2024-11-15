// src/components/Progress.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Progress({ userId }) {
  const [progressData, setProgressData] = useState(null);
  const [newProgress, setNewProgress] = useState('');

  useEffect(() => {
    axios.get('/api/progress')
      .then(response => {
        setProgressData(response.data);
      })
      .catch(error => {
        console.error('Error fetching progress data:', error);
      });
  }, []);

  const handleSubmit = () => {
    axios.post('/api/progress', { userId, progress: newProgress })
      .then(response => {
        console.log('Progress saved:', response.data);
      })
      .catch(error => {
        console.error('Error saving progress:', error);
      });
  };

  return (
    <div>
      <h2>User Progress</h2>
      {progressData ? <pre>{JSON.stringify(progressData, null, 2)}</pre> : 'Loading...'}
      <input
        type="text"
        value={newProgress}
        onChange={e => setNewProgress(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit Progress</button>
    </div>
  );
}

export default Progress;