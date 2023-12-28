import { useState, useRef } from "react";
import {
  dragStart,
  dragEnd,
  getStartAndEndOnGrid,
  canAddSchedule,
  setHorizonOnGrid,
} from "./daily-scheduler-util";
import type { MouseEvent as ReactMouseEvent } from "react";

export default function NewScheduleTrack({
  category,
  addSchedule,
}: {
  category: ScheduleCategory;
  addSchedule(schedule: ScheduleItem): void;
}) {
  const [schedule, setSchedule] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseDown(e: ReactMouseEvent): void {
    if (e.button !== 0 || !canAddSchedule(e.clientX)) return;

    dragStart(e.clientX);
    setHorizonOnGrid(e.clientX);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent): void {
    setSchedule(getStartAndEndOnGrid(e.clientX));
  }

  function handleMouseUp(e: MouseEvent): void {
    const { start, end } = getStartAndEndOnGrid(e.clientX);

    dragEnd();
    setSchedule(null);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);

    if (end - start < 1) return;

    const category_id = category.id;
    addSchedule({ start, end, category, category_id });
  }

  return (
    <div ref={ref} className="new-schedule-track" onMouseDown={handleMouseDown}>
      {schedule && (
        <div
          className="schedule-item"
          style={{
            width: schedule.end - schedule.start,
            left: schedule.start,
            backgroundColor: category.fill,
            borderColor: category.stroke,
          }}
        ></div>
      )}
    </div>
  );
}
