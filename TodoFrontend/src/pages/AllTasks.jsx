import { CircleCheck, BrushCleaning } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTasks } from "@/store/todo-slice";
import { useEffect } from "react";
import EditTask from "../components/editTask";
import AddTaskDialog from "../components/AddTask";
import TaskTemplate from "../components/tasktemplate";

function AllTask() {
  const dispatch = useDispatch();

  const { todos, isLoading, error } = useSelector((state) => state.todo);
  useEffect(() => {
    dispatch(getAllTasks());
  }, [dispatch]);

  const taskCount = todos ? todos.length : 0;
  //   console.log(todos);
  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="font-bold text-3xl tracking-wider">Tasks</h2>
      <div className="flex flex-1/6 mt-8 items-center gap-2 text-gray-500">
        <CircleCheck size={14} className="text-gray-500" />
        <span className="font-[10px]">{taskCount} task</span>
      </div>
      <hr className="mt-8 border-t mb-8 border-gray-200" />
      <div className="w-full flex flex-col justify-start gap-5 ">
        {todos?.length > 0 ? (
          <div>
            <div className="w-full flex  flex-col  justify-start gap-5 ">
              {todos.map((task) => (
                <div key={task._id}>
                  {task.completed ? null : (
                    <div>
                      <div>
                        <h1 className="font-bold">@{formatDate(task.date)}</h1>
                      </div>
                      <TaskTemplate task={task} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-5">
              <AddTaskDialog />
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-10">
            <BrushCleaning size={100} className="mt-5" />
            <h1 className="text-5xl mt-5 font-bold">No tasks</h1>
            <AddTaskDialog />
          </div>
        )}
      </div>
    </div>
  );
}

export default AllTask;
