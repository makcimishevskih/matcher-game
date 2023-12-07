import { useState, useEffect, useRef, useCallback } from 'react';

const useTimer = () => {
  const [timer, setTimer] = useState(0);
  const [isStop, setIsStop] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [isShowCard, setIsShowCard] = useState(false);

  let timerId = useRef(null);

  useEffect(() => {
    if (isStart && !isStop) {
      timerId.current = setInterval(() => {
        setTimer((prev) => (prev += 1));
      }, 1000);
    } else {
      setIsStart(false);
    }

    return () => clearInterval(timerId.current);
  }, [isStart, isStop]);

  const handleStart = useCallback(() => {
    if (isStart && timerId.current) {
      setIsStart(false);
      clearInterval(timerId.current);
      return;
    }

    setIsStop(false);
    setIsShowCard(true);

    setTimeout(() => {
      setIsStart(true);
    }, 1550);
  }, [isStart]);

  const handleStop = useCallback(() => {
    setIsStop(true);
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
    isStart,
    timer,
    timerId,
    handleStart,
    handleStop,
    handleTimerReset,
    isShowCard,
    handleChangeIsShowCard,
  };
};

export default useTimer;
