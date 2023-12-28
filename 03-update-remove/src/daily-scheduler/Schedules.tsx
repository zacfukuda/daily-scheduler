import Schedule from "./Schedule";

export default function Schedules({
  items,
  updateSchedule,
  removeSchedule,
}: {
  items: ScheduleItem[];
  updateSchedule(arg0: ScheduleItemIndexable): void;
  removeSchedule(arg0: number): void;
}) {
  return (
    <>
      {items.map((i, index) => (
        <Schedule
          key={index}
          index={index}
          updateSchedule={updateSchedule}
          removeSchedule={removeSchedule}
          {...i}
        />
      ))}
    </>
  );
}
