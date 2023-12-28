import { useState } from "react";
import scheduleCategories from "./schedule-categories";
import CategoryButtons from "./CategoryButtons";
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

  return (
    <div className="daily-scheduler">
      <CategoryButtons
        items={categories}
        updateActiveCategory={updateActiveCategory}
      />
    </div>
  );
}
