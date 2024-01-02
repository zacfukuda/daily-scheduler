import Schedule from "./Schedule";

export default function Schedules({ items }: { items: ScheduleItem[] }) {
  return (
    <>
      {items.map((i, index) => (
        <Schedule key={index} index={index} {...i} />
      ))}
    </>
  );
}
