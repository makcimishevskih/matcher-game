import './App.css';

import { useState, useEffect, useRef, useMemo } from 'react';

import shuffle from '../helpers/shuffle';
import cards from './config';

import Card from './Card';
import { Button } from '../shared/Button';
import { useCallback } from 'react';

const shuffled = shuffle(cards);

function App() {
  const [timer, setTimer] = useState(0);
  const [cardsCount, setCardsCount] = useState(0);

  const [pickedCards, setPickedCards] = useState([]);
  const [shuffledCards, setShuffledCards] = useState([...shuffled]);

  const [isOff, setIsOff] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [IsGameFinished, setIsGameFinished] = useState(false);

  let timerId = useRef(null);
  let timerIdReset = useRef(null);
  let timerIdOff = useRef(null);

  useEffect(() => {
    if (isStart) {
      timerId.current = setInterval(() => {
        setTimer((prev) => (prev += 1));
      }, 1000);
    }

    return () => {
      clearInterval(timerId.current);
      clearInterval(timerIdReset.current);
      clearInterval(timerIdOff.current);
    };
  }, [isStart]);

  const handleReset = useCallback(() => {
    const cur = timerId.current;
    if (cur) clearInterval(cur);

    setTimer(0);
    setCardsCount(0);
    setIsOff(false);
    setIsStart(false);
    setPickedCards([]);
    timerIdReset.current = setTimeout(() => {
      setShuffledCards((prev) =>
        shuffle(prev.map((el) => ({ ...el, isSuccess: false, isError: false })))
      );
    }, 500);
  }, [timerId]);

  useEffect(() => {
    let innderTimerId;

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
          clearInterval(timerId.current);
        }
      } else {
        setShuffledCards((prevArr) =>
          prevArr.map((el) => {
            if (el === prev || el === last) {
              el.isError = true;
            }
            return el;
          })
        );

        innderTimerId = setTimeout(() => {
          setShuffledCards((prevArr) =>
            prevArr.map((el) => ({ ...el, isError: false }))
          );

          setPickedCards((prev) => prev.slice(0, prev.length - 2));
          setCardsCount((prev) => (prev -= 2));
        }, 400);
      }
      timerIdOff.current = setTimeout(() => {
        setIsOff(false);
      }, 410);
    }

    return () => clearTimeout(innderTimerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardsCount]);

  const handleStart = useCallback(() => {
    setIsStart(true);
  }, []);

  const handleStop = useCallback(() => {
    setIsStart(false);
    handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePick = (id) => {
    if (isOff) return;

    const card = shuffledCards.find((el) => el.id === id);
    if (pickedCards.find((el) => el.id === id)) return;

    setPickedCards((prev) => prev.concat(card));
    setCardsCount((prev) => (prev += 1));
  };

  const result = useMemo(() => 1000 - timer * 10, [timer]);

  return (
    <div className="app">
      {IsGameFinished && (
        <div className="win-modal">
          <div className="win-block">
            <h2>you win!</h2>
            <p>Your score is: {result < 0 ? 0 : result}</p>
          </div>
        </div>
      )}

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
        <Button onClick={handleStart}>start</Button>
        <Button onClick={handleStop} variant="secondary">
          stop
        </Button>
        <Button onClick={handleReset}>shuffle cards</Button>
        <div>Timer: {timer} seconds</div>
        <div>Checked cards counter: {cardsCount}</div>
      </div>
    </div>
  );
}

export default App;
