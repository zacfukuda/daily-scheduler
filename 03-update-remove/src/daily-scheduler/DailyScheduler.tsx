import { useState, useEffect } from "react";
import scheduleCategories from "./schedule-categories";
import {
  joinSchedules,
  updateSchedules,
  joinSchedulesOnUpdate,
  addTrash,
  convertSchedules,
} from "./daily-scheduler-util";
import CategoryButtons from "./CategoryButtons";
import Guidelines from "./Guidelines";
import NewScheduleTrack from "./NewScheduleTrack";
import Schedules from "./Schedules";
import "./DailyScheduler.css";
import type { ScheduleCategoryButton } from "./CategoryButton";

function initailCategories(): ScheduleCategoryButton[] {
  const categories: ScheduleCategoryButton[] = [...scheduleCategories];
  categories[0].active = true;

  for (let i = 1; i < categories.length; i++) {
    categories[i].active = false;
  }

  return categories;
}

export default function DailyScheduler(props: {
  schedules?: Schedule[];
}): JSX.Element {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [categories, setCategories] = useState(initailCategories);
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  function updateActiveCategory(category: ScheduleCategory): void {
    const length = categories.length;
    const cc = new Array(length);

    for (let i = 0; i < length; i++) {
      cc[i] = categories[i];
      cc[i].active = cc[i].id === category.id;
    }

    setCategories(cc);
    setActiveCategory(category);
  }

  function addSchedule(schedule: ScheduleItem): void {
    const ss = joinSchedules([...schedules, schedule]);
    setSchedules(ss);
  }

  function updateSchedule(schedule: ScheduleItemIndexable): void {
    const ss = joinSchedulesOnUpdate(schedule);
    setSchedules(ss);
  }

  function removeSchedule(index: number): void {
    addTrash(schedules[index]);
    schedules.splice(index, 1);
    setSchedules([...schedules]);
  }

  useEffect(() => {
    if (props.schedules) {
      setSchedules(convertSchedules(props.schedules));
    }
  }, [props.schedules]);

  useEffect(() => {
    updateSchedules(schedules);
  }, [schedules]);

  return (
    <div className="daily-scheduler">
      <CategoryButtons
        items={categories}
        updateActiveCategory={updateActiveCategory}
      />
      <div className="track">
        <Guidelines />
        <NewScheduleTrack category={activeCategory} addSchedule={addSchedule} />
        <Schedules
          items={schedules}
          updateSchedule={updateSchedule}
          removeSchedule={removeSchedule}
        />
      </div>
    </div>
  );
}
