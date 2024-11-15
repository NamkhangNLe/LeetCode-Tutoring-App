import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/questions/:topic" render={(props) => <Question {...props} userId={userId} />} />
        <Route path="/progress" render={() => <Progress userId={userId} />} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;