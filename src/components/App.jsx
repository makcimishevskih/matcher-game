import './App.css';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import useModal from '../hooks/useModal';
import useTimer from '../hooks/useTimer.jsx';

import cards from './config';
import shuffle from '../helpers/shuffle';

import Card from './Card';
import Modal from './Modal';
import Button from '../shared/Button';

const shuffled = shuffle([...cards]);

function App() {
  const { isOpen, handleClose, handleOpen } = useModal();
  const { timer, timerId, handleStart, handleStop, handleTimerReset } =
    useTimer();

  const [pickedCards, setPickedCards] = useState([]);
  const [shuffledCards, setShuffledCards] = useState([...shuffled]);

  const [isOff, setIsOff] = useState(false);
  const [cardsCount, setCardsCount] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);

  let timerIdReset = useRef(null);

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
          handleOpen();
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

          setCardsCount((prev) => (prev -= 2));
          setPickedCards((prev) => prev.slice(0, prev.length - 2));
        }, 400);
      }
    }

    setTimeout(() => setIsOff(false), 420);

    return () => {
      clearTimeout(innderTimerId);
      clearInterval(timerIdReset.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardsCount]);

  const handleReset = useCallback(() => {
    const cur = timerId.current;
    if (cur) clearInterval(cur);

    setIsOff(false);
    setCardsCount(0);
    setPickedCards([]);
    handleStop();
    handleTimerReset();

    timerIdReset.current = setTimeout(() => {
      setShuffledCards((prev) =>
        shuffle(prev.map((el) => ({ ...el, isSuccess: false, isError: false })))
      );
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerId]);

  const handlePick = (id) => {
    if (isOff) return;

    const card = shuffledCards.find((el) => el.id === id);

    setCardsCount((prev) => (prev += 1));
    setPickedCards((prev) => prev.concat(card));
  };

  const result = useMemo(() => 1000 - timer * 10, [timer]);

  return (
    <div className="app">
      {isGameFinished && isOpen && (
        <Modal handleClose={handleClose} result={result} />
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
        <Button onClick={handleStart}>Start</Button>
        <Button onClick={handleReset} variant="secondary">
          Stop
        </Button>
        <Button onClick={handleReset}>Shuffle cards</Button>
        <div>Timer: {timer} seconds</div>
        <div>Checked cards counter: {cardsCount}</div>
      </div>
    </div>
  );
}

export default App;
