import './Game.css';

import PropTypes from 'prop-types';
import useModal from '../../hooks/useModal';
import useTimer from '../../hooks/useTimer.jsx';
import { useState, useEffect, useMemo, useCallback } from 'react';

// import shuffle from '../../helpers/shuffle';

import Card from './components/Card';
import Modal from '../Modal';
import Button from '../../shared/Button';

Game.propTypes = {
  arr: PropTypes.array,
};

function Game({ arr }) {
  const { isOpen, handleClose, handleOpen } = useModal();
  const {
    timer,
    timerId,
    handleStart,
    handleStop,
    handleTimerReset,
    isShowCard,
    handleChangeIsShowCard,
  } = useTimer();

  const [pickedCards, setPickedCards] = useState([]);
  const [shuffledCards, setShuffledCards] = useState(arr);

  const [isTouched, setIsTouched] = useState(false);
  const [cardsCount, setCardsCount] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);

  useEffect(() => {
    let timerId;
    if (isShowCard) {
      // setIsTouched(true);
      setPickedCards(arr);

      timerId = setTimeout(() => {
        setPickedCards([]);
        setIsTouched(false);
        handleChangeIsShowCard(false);
        // setShuffledCards((prev) =>
        //   prev.map((el) => ({ ...el, isSuccess: false, isError: false }))
        // );
      }, 2000);
    }
    return () => clearTimeout(timerId);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowCard]);

  useEffect(() => {
    let innderTimerId;

    if (!(cardsCount % 2) && cardsCount !== 0) {
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

        if (cardsCount === shuffledCards.length) {
          setIsGameFinished(true);
          handleOpen();
          clearInterval(timerId.current);
        }
      } else {
        setIsTouched(true);
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
          setTimeout(() => setIsTouched(false), 10);
        }, 400);
      }
    }

    return () => {
      clearTimeout(innderTimerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardsCount]);

  const handleReset = useCallback(() => {
    const cur = timerId.current;
    if (cur) clearInterval(cur);

    setCardsCount(0);
    setPickedCards([]);
    setIsTouched(false);
    handleStop();
    handleTimerReset();

    setTimeout(() => {
      setShuffledCards((prev) =>
        prev.map((el) => ({ ...el, isSuccess: false, isError: false }))
      );
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerId]);

  const handlePick = (id) => {
    if (isTouched || pickedCards.find((el) => el.id === id)) return;

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

export default Game;
