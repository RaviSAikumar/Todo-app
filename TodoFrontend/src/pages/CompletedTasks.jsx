import { CircleCheck, BrushCleaning, UserRoundCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTasks, updateTask } from "@/store/todo-slice";
import { useEffect } from "react";
import { Checkbox } from "../components/ui/checkbox";
import { toast } from "sonner";
import { TaskInfo } from "@/components/TaskTemplate";

function CompletedTasks() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { todos } = useSelector((state) => state.todo);

  useEffect(() => {
    dispatch(getAllTasks());
  }, [dispatch]);

  const completedTasks = todos?.filter((task) => task.completed) || [];

  const handleChange = async (checked, task) => {
    try {
      await dispatch(
        updateTask({
          id: task._id,
          completed: checked,
          completedAt: checked ? new Date().toISOString() : null, // ✅ if unchecked, clear timestamp
        })
      ).unwrap();

      toast.success(`Task marked as ${checked ? "completed" : "incomplete"}`);
    } catch (error) {
      toast.error("Failed to update task status");
      console.error("Failed to update completion status:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="flex items-center-safe gap-6 text-3xl mb-5 font-bold tracking-wide mb-2 text-gray-800">
        <UserRoundCheck size={40} /> Completed Tasks
      </h2>

      <div className="flex items-center text-sm text-gray-500 mb-6 gap-2">
        <CircleCheck size={16} />
        <span>
          {completedTasks.length} completed task
          {completedTasks.length !== 1 && "s"}
        </span>
      </div>

      <hr className="mb-6 border-gray-300" />

      {completedTasks.length > 0 ? (
        <div className="flex flex-col gap-6">
          {completedTasks.map((task) => (
            <div
              key={task._id}
              className="flex items-start gap-4 bg-gray-50 border-b border-gray-200 rounded-lg p-4"
            >
              <img
                src={user?.profilePic}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <p className="text-gray-700 leading-relaxed flex items-center gap-2">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => handleChange(checked, task)}
                    className="border-amber-300 rounded-4xl text-amber-300"
                  />
                  <span>
                    <span className="font-semibold">You</span> completed the
                    task:{" "}
                    <span className="underline hover:text-red-600">
                      <TaskInfo task={task} />
                    </span>
                  </span>
                </p>
                {task.completedAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    Completed on:{" "}
                    {new Date(task.completedAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <BrushCleaning size={100} className="text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold text-gray-700">
            No completed tasks yet
          </h1>
          <p className="text-gray-500 mt-2">Start by finishing your tasks 🎯</p>
        </div>
      )}
    </div>
  );
}

export default CompletedTasks;
