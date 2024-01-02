import { useEffect, useRef, useMemo } from "react";
import { getHours, setO, setGuides } from "./daily-scheduler-util";

export default function Guidelines() {
  const hours = useMemo<number[]>(() => getHours(), []);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGuides(ref.current as HTMLDivElement);
    setO(ref.current?.getBoundingClientRect().x as number);
  }, []);

  return (
    <div ref={ref} className="guidelines">
      {hours.map((i, index) => (
        <span key={index} className="guideline">
          <span>{i}</span>
        </span>
      ))}
    </div>
  );
}
