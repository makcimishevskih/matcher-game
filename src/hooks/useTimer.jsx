import { useState, useEffect, useRef, useCallback } from 'react';

const useTimer = () => {
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
      clearInterval(timerId.current);
    };
  }, [isStart]);

  const handleStart = useCallback(() => {
    setIsStart(true);
  }, []);

  const handleStop = useCallback(() => {
    setIsStart(false);
  }, []);

  const handleTimerReset = useCallback(() => {
    setTimer(0);
  }, []);

  return { timer, timerId, handleStart, handleStop, handleTimerReset };
};

export default useTimer;
