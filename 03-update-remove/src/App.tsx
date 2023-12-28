import {
  init,
  getSchedules,
  getTrash,
} from "./daily-scheduler/daily-scheduler-util";
import DailyScheduler from "./daily-scheduler/DailyScheduler";

const initialSchedules = [
  {
    id: 1,
    start: "2024-01-01 00:00:00",
    end: "2024-01-01 07:00:00",
    category_id: 1,
  },
  {
    id: 2,
    start: "2024-01-01 09:00:00",
    end: "2024-01-01 12:30:00",
    category_id: 2,
  },
];

function App() {
  function handleClick() {
    console.log("schedules", getSchedules());
    console.log("trash", getTrash());
  }

  init("2024-01-01", 0);

  return (
    <div className="App">
      <DailyScheduler schedules={initialSchedules} />
      <br />
      <button type="button" onClick={handleClick}>
        console.log
      </button>
    </div>
  );
}

export default App;
