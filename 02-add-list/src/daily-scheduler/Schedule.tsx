import { useRef } from "react";

export default function Schedule({
  id,
  start,
  end,
  category,
  category_id,
  index,
}: ScheduleItemIndexable) {
  const ref = useRef<HTMLDivElement>(null);
  const style = {
    backgroundColor: category.fill,
    borderColor: category.stroke,
    left: start,
    width: end - start,
  };

  return <div ref={ref} className="schedule-item" style={style}></div>;
}
