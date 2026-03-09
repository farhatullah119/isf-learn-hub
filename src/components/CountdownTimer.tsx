import { useState, useEffect } from "react";

interface CountdownTimerProps {
  deadline: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(deadline: string): TimeLeft | null {
  try {
    const parsed = Date.parse(deadline);
    if (isNaN(parsed)) return null;
    
    const deadlineDate = new Date(parsed);
    deadlineDate.setHours(23, 59, 59, 999);
    const diff = deadlineDate.getTime() - Date.now();
    
    if (diff <= 0) return null;
    
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  } catch {
    return null;
  }
}

const CountdownTimer = ({ deadline, className = "" }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calculateTimeLeft(deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(deadline));
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  if (!timeLeft) {
    return (
      <div className={`text-destructive font-semibold text-sm ${className}`}>
        Expired
      </div>
    );
  }

  const isVeryUrgent = timeLeft.days <= 3;
  const isLastDay = timeLeft.days === 0;

  return (
    <div className={`${className}`}>
      <div className={`grid grid-cols-4 gap-1.5 text-center ${isVeryUrgent ? "animate-pulse" : ""}`}>
        <TimeBlock value={timeLeft.days} label="Days" urgent={isVeryUrgent} />
        <TimeBlock value={timeLeft.hours} label="Hrs" urgent={isVeryUrgent} />
        <TimeBlock value={timeLeft.minutes} label="Min" urgent={isVeryUrgent} />
        <TimeBlock value={timeLeft.seconds} label="Sec" urgent={isLastDay} pulse={isLastDay} />
      </div>
    </div>
  );
};

interface TimeBlockProps {
  value: number;
  label: string;
  urgent?: boolean;
  pulse?: boolean;
}

const TimeBlock = ({ value, label, urgent, pulse }: TimeBlockProps) => (
  <div className={`
    rounded-md px-1.5 py-1 
    ${urgent ? "bg-destructive/10" : "bg-muted"} 
    ${pulse ? "animate-[pulse_1s_ease-in-out_infinite]" : ""}
    transition-colors duration-300
  `}>
    <div className={`
      font-mono text-sm font-bold leading-none mb-0.5
      ${urgent ? "text-destructive" : "text-foreground"}
    `}>
      {String(value).padStart(2, "0")}
    </div>
    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
      {label}
    </div>
  </div>
);

export default CountdownTimer;
