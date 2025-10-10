import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown: React.FC<CountdownProps> = ({
  targetDate,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = targetDate.getTime() - Date.now();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const updateCountdown = () => {
      setTimeLeft(calculateTimeLeft());
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {/* Days */}
      <div className="flex flex-col items-center">
        <div className="bg-black rounded-lg flex items-center justify-center w-[44px] h-[44px] text-center">
          <span className="text-neutral-50 text-2xl font-medium">
            {formatNumber(timeLeft.days)}
          </span>
        </div>
        <span className="text-neutral-500 text-xs mt-1 font-['Inter']">
          Days
        </span>
      </div>

      <div className="flex flex-col pb-6 text-gray-400 text-xs items-center">
        :
      </div>

      {/* Hours */}
      <div className="flex flex-col items-center">
        <div className="bg-black rounded-lg flex items-center justify-center w-[44px] h-[44px] text-center">
          <span className="text-neutral-50 text-2xl font-medium">
            {formatNumber(timeLeft.hours)}
          </span>
        </div>
        <span className="text-neutral-500 text-xs mt-1 font-['Inter']">
          Hours
        </span>
      </div>

      <div className="flex flex-col pb-6 text-gray-400 text-lg items-center">
        :
      </div>

      {/* Minutes */}
      <div className="flex flex-col items-center">
        <div className="bg-black rounded-lg flex items-center justify-center w-[44px] h-[44px] text-center">
          <span className="text-neutral-50 text-2xl font-medium">
            {formatNumber(timeLeft.minutes)}
          </span>
        </div>
        <span className="text-neutral-500 text-xs mt-1 font-['Inter']">
          Mins
        </span>
      </div>

      <div className="flex flex-col pb-6 text-gray-400 text-lg items-center">
        :
      </div>

      {/* Seconds */}
      <div className="flex flex-col items-center">
        <div className="bg-black rounded-lg flex items-center justify-center w-[44px] h-[44px] text-center">
          <span className="text-neutral-50 text-2xl font-medium">
            {formatNumber(timeLeft.seconds)}
          </span>
        </div>
        <span className="text-neutral-500 text-xs mt-1 font-['Inter']">
          Secs
        </span>
      </div>
    </div>
  );
};

export default Countdown;
