import {
  init,
  getSchedules,
  getTrash,
} from "./daily-scheduler/daily-scheduler-util";
import DailyScheduler from "./daily-scheduler/DailyScheduler";

function App() {
  function handleClick() {
    console.log("schedules", getSchedules());
    console.log("trash", getTrash());
  }

  init("2024-01-01", 0);

  return (
    <div className="App">
      <DailyScheduler />
      <br />
      <button type="button" onClick={handleClick}>
        console.log
      </button>
    </div>
  );
}

export default App;
