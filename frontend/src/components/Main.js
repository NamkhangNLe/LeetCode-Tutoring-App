// src/components/Main.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Main() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    axios.get('/api/dashboard')
      .then(response => {
        setDashboardData(response.data);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
      });
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {dashboardData ? <pre>{JSON.stringify(dashboardData, null, 2)}</pre> : 'Loading...'}
    </div>
  );
}

export default Main;