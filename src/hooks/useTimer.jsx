import { useState, useEffect, useRef, useCallback } from 'react';

const useTimer = () => {
  const [isShowCard, setIsShowCard] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isStart, setIsStart] = useState(false);

  let timerId = useRef(null);

  useEffect(() => {
    if (isStart) {
      timerId.current = setInterval(() => {
        setTimer((prev) => (prev += 1));
      }, 1000);
    }

    return () => {
      setIsShowCard(false);
      clearInterval(timerId.current);
    };
  }, [isStart]);

  const handleStart = useCallback(() => {
    setIsShowCard(true);
    setTimeout(() => {
      setIsStart(true);
      setIsShowCard(false);
    }, 2000);
  }, []);

  const handleStop = useCallback(() => {
    setIsShowCard(false);
    setIsStart(false);
  }, []);

  const handleChangeIsShowCard = (bool) => {
    setIsShowCard(bool);
  };

  const handleTimerReset = useCallback(() => {
    setTimer(0);
  }, []);

  return {
    timer,
    timerId,
    handleStart,
    handleStop,
    handleTimerReset,
    //
    isShowCard,
    handleChangeIsShowCard,
  };
};

export default useTimer;
