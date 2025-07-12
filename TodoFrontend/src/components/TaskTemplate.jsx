import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Info } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import EditTask from "./EditTask";
import { DeleteTask } from "./EditTask";
import { updateTask } from "@/store/todo-slice"; // ✅ Correct thunk action
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function TaskInfo({ task }) {
  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="p-0 text-base font-semibold  hover:underline "
        >
          {task.title}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white border-none shadow-2xl rounded-xl max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
            <div className="flex items-center gap-2">
              <span>
                <Info />
              </span>{" "}
              <span>Task Information</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-gray-700">
          <div>
            <span className="font-semibold text-gray-800">Title:</span>{" "}
            {task.title}
          </div>

          {task.description && (
            <div>
              <span className="font-semibold text-gray-800">
                Task Description:
              </span>{" "}
              {task.description}
            </div>
          )}

          {task.date && (
            <div>
              <span className="font-semibold text-gray-800">
                Scheduled Date:
              </span>{" "}
              {formatDate(task.date)}
            </div>
          )}

          <div>
            <span className="font-semibold text-gray-800">Status:</span>{" "}
            {task.completed ? (
              <span className="text-green-600 font-semibold">Completed</span>
            ) : (
              <span className="text-yellow-600 font-semibold">Pending</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TaskTemplate({ task }) {
  const dispatch = useDispatch();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);

  const [isCompleted, setIsCompleted] = useState(task.completed || false);
  const [completedDateAndTime, setCompletedDateAndTime] = useState(null);

  const handleChange = async (checked) => {
    setIsCompleted(checked);

    // ✅ Set time only when marking as completed (not already completed)
    const now = checked ? new Date() : null;
    setCompletedDateAndTime(now);

    try {
      await dispatch(
        updateTask({
          id: task._id,
          completed: checked,
          completedAt: now?.toISOString(), // ✅ send ISO string to backend
        })
      ).unwrap();

      toast.success(`Task marked as ${checked ? "completed" : "incomplete"}`);
    } catch (error) {
      toast.error("Failed to update task status");
      console.error("Failed to update completion status:", error);
    }
  };

  const handleEditClick = () => {
    setOpenEditDialog(true);
  };

  const handleInfo = () => {
    console.log(task._id, task.title);
    setOpenInfo(true);
  };

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div>
      <div className="w-full flex items-center border-none mt-5 mb-5 outline-none justify-between border rounded p-3 bg-white">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={handleChange}
            className="rounded-full"
          />
          <div>
            <Button
              variant="ghost"
              onClick={handleInfo}
              className={`font-semibold text-gray-800 cursor-pointer ${
                isCompleted ? "line-through opacity-60" : ""
              }`}
            >
              <TaskInfo task={task} />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleEditClick}
            className="p-0 h-auto cursor-pointer"
          >
            <Pencil size={18} />
          </Button>
          <EditTask
            completed={isCompleted}
            open={openEditDialog}
            setOpen={setOpenEditDialog}
            taskToEdit={task}
          />
          <DeleteTask taskId={task._id} />
        </div>
      </div>
      <hr className="border-gray-300" />
    </div>
  );
}

export default TaskTemplate;
