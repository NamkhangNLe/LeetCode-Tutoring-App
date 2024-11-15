import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';
import Question from './components/Question';
import Progress from './components/Progress';

function App() {
  const userId = 'some-user-id'; // Replace with actual user ID

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/questions/:topic" element={<Question userId={userId} />} />
        <Route path="/progress" element={<Progress userId={userId} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;