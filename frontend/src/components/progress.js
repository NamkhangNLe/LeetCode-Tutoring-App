import React from 'react';

const Progress = ({ progress }) => {
  return (
    <div>
      <h2>Progress</h2>
      {Object.entries(progress).map(([topic, difficulty]) => (
        <div key={topic}>
          <p>{topic}: Level {difficulty}</p>
        </div>
      ))}
    </div>
  );
};

export default Progress;