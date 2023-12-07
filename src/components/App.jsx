import './App.css';

import cards from './config';
import shuffle from '../helpers/shuffle';
import Game from './Game';

const shuffled = shuffle([...cards]);

function App() {
  return (
    <div className="app">
      <Game arr={shuffled} />
    </div>
  );
}

export default App;
