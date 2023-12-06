import './App.css';

import { useState, useEffect, useRef } from 'react';

import shuffle from '../helpers/shuffle';
import cards from './config';

import Card from './Card';
import { Button } from '../shared/Button';

const shuffled = shuffle(cards);

function App() {
  const [timer, setTimer] = useState(3);
  const [cardsCount, setCardsCount] = useState(0);
  const [shuffledCards, setShuffledCards] = useState(shuffled);

  const [pickedCards, setPickedCards] = useState([]);
  const [IsGameFinished, setIsGameFinished] = useState(false);
  const [isOff, setIsOff] = useState(false);

  let timerId = useRef(null);

  // useEffect(() => {
  //   if (isStart && !timerId.current) {
  //     timerId.current = setInterval(() => {
  //       setTimer((prev) => {
  //         if (prev === 0) handleStop();

  //         return --prev;
  //       });
  //     }, 1000);
  //   }

  //   return () => clearInterval(timerId.current);
  // }, [isStart]);
  // const handleReset = () => {
  //   setTimer(3);
  //   setIsStart(false);
  //   setcardsCount(0);
  //   setPickedCards([]);
  // };

  useEffect(() => {
    let timerId;

    if (!(cardsCount % 2) && cardsCount !== 0) {
      setIsOff(true);
      const prev = pickedCards[pickedCards.length - 2];
      const last = pickedCards[pickedCards.length - 1];

      if (prev && last && prev.label === last.label) {
        setShuffledCards((prevArr) =>
          prevArr.map((el) => {
            if (el === prev || el === last) {
              el.isSuccess = true;
            }
            return el;
          })
        );

        if (cardsCount === cards.length) {
          setIsGameFinished(true);
          console.log('shuffled');
        }
      } else {
        setShuffledCards((prevArr) =>
          prevArr.map((el) => {
            if (el === prev || el === last) {
              console.log(el === prev, el === last);
              el.isError = true;
            }
            return el;
          })
        );

        timerId = setTimeout(() => {
          setShuffledCards((prevArr) =>
            prevArr.map((el) => ({ ...el, isError: false }))
          );

          setPickedCards((prev) => prev.slice(0, prev.length - 2));

          setCardsCount((prev) => (prev - 2 < 1 ? 0 : (prev -= 2)));
        }, 700);
      }
      setTimeout(() => {
        setIsOff(false);
      }, 710);

      return () => clearTimeout(timerId);
    }

    return () => clearTimeout(timerId);
  }, [cardsCount]);

  const handleStart = () => {
    console.log('start');
  };

  const handleStop = () => {
    const cur = timerId.current;
    if (cur) {
      clearInterval(cur);
    }
  };

  const handlePick = (id) => {
    if (isOff) return;
    const card = shuffledCards.find((el) => el.id === id);
    if (pickedCards.find((el) => el.id === id)) return;

    setPickedCards((prev) => prev.concat(card));
    setCardsCount((prev) => (prev += 1));
  };

  return (
    <div className="app">
      {IsGameFinished && <div>YOU WIN!</div>}

      <ul className="cards">
        {shuffledCards.map((el) => (
          <Card
            key={el.id}
            isError={el.isError}
            isFail={el.isSuccess}
            handlePick={() => handlePick(el.id)}
            isActive={pickedCards.some((el2) => el2.id === el.id)}
            {...el}
          />
        ))}
      </ul>

      <div className="info">
        <Button onClick={handleStart}>Start</Button>
        <Button onClick={handleStop}>Stop</Button>
        <div>Timer: {timer}seconds</div>
        <div>Checked cards counter: {cardsCount}</div>
      </div>
    </div>
  );
}

export default App;
