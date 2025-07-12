import AddTaskDialog from "./AddTask";
import { CalendarDays } from "lucide-react";

function getNext7Days() {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const nextDay = new Date();
    nextDay.setDate(today.getDate() + i);
    days.push(nextDay.toISOString().split("T")[0]); // Format: "YYYY-MM-DD"
  }

  return days;
}

const tasks = [
  { id: 1, title: "Meeting", date: "2025-07-03" },
  { id: 2, title: "Study React", date: "2025-07-04" },
  { id: 3, title: "Visit doctor", date: "2025-07-05" },
];

function TaskCalendar() {
  const dates = getNext7Days();

  return (
    <div className="p-4 space-y-6">
      {dates.map((date) => (
        <div key={date}>
          <div className="flex justify-start gap-2 mb-0 ">
            <span>
              <CalendarDays />
            </span>
            <h2 className="text-md font-bold text-sm mb-2">
              {new Date(date).toDateString()}
            </h2>
          </div>
          <p>
            <AddTaskDialog />
          </p>
          <ul className="space-y-1">
            {tasks.filter((task) => task.date === date).length > 0 ? (
              tasks
                .filter((task) => task.date === date)
                .map((task) => (
                  <li
                    key={task.id}
                    className="bg-white border rounded px-4 py-2 shadow"
                  >
                    {task.title}
                  </li>
                ))
            ) : (
              <li className="text-gray-400 italic">No tasks</li>
            )}
            <hr className="border-t border-gray-300" />
          </ul>
        </div>
      ))}
    </div>
  );
}

function TaskDetails() {
  return (
    <div className="h-[100vh] overflow-y-scroll mt-0 pt-0 p-4 border-l bg-white">
      <h1 className="font-bold text-lg mb-4 p-4 mt-0 sticky top-0 bg-white z-10">
        Task Details
      </h1>
      <TaskCalendar />
    </div>
  );
}

export default TaskDetails;
