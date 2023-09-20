import React, { useState, useEffect } from 'react';

const Timer = ({ initialTime }) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [time]);

  const formatTime = (seconds) => {
    const remainingSeconds = seconds % 60;
  
    return `${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return <div>{formatTime(time)}</div>;
};

export default Timer;