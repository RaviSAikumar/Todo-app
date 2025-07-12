import { CircleCheck, BrushCleaning } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTasks } from "@/store/todo-slice";
import { useEffect } from "react";
import { format, parseISO } from "date-fns";
import AddTaskDialog from "../components/AddTask";
import TaskTemplate from "@/components/TaskTemplate";

function TodayTasks() {
  const { todos, isLoading, error } = useSelector((state) => state.todo);
  const dispatch = useDispatch();
  const today = format(new Date(), "yyyy-MM-dd");
  const todayTasks =
    todos?.filter((task) => {
      if (!task.date) return false;
      const formattedTaskDate = format(parseISO(task.date), "yyyy-MM-dd");
      return formattedTaskDate === today;
    }) || [];
  //   console.log("today", today);

  useEffect(() => {
    dispatch(getAllTasks());
  }, [dispatch]);

  const taskCount = todos ? todos.length : 0;
  //   console.log(todos);
  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="w-full px-50">
      <h2 className="font-bold text-4xl tracking-wider">Today</h2>
      <div className="flex flex-1/6 mt-8 items-center  gap-2 text-gray-500">
        <CircleCheck size={14} className="text-gray-500" />
        <span className="font-[10px]">{todayTasks.length} task</span>
      </div>
      <hr className="mt-8 border-t mb-8 border-gray-200" />
      <div>
        <h1 className="font-bold mt-8 text-2xl">{formatDate(today)}</h1>
        <hr className="mt-10 border-gray-300" />
      </div>
      {todos?.length > 0 ? (
        <div className="w-full flex flex-col justify-start gap-5">
          {todayTasks.length > 0 ? (
            todayTasks.map((task) => (
              <div key={task._id}>
                {task.completed ? null : <TaskTemplate task={task} />}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No tasks for today</div>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-10">
          <BrushCleaning size={100} className="mt-5" />
          <h1 className="text-5xl mt-5 font-bold">No tasks</h1>
          <AddTaskDialog />
        </div>
      )}

      <div className="mt-5">
        <AddTaskDialog />
      </div>
    </div>
  );
}

export default TodayTasks;
