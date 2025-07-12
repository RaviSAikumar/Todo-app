import { Dialog, DialogContent } from "@/components/ui/dialog";
import { deleteTask, updateTask } from "@/store/todo-slice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import TaskForm from "./TaskForm";
export default function EditTask({ open, setOpen, taskToEdit, completed }) {
  const dispatch = useDispatch();

  const handleSubmit = async (formData) => {
    try {
      const result = await dispatch(
        updateTask({
          ...formData,
          id: formData._id,
          date: formData.date ? new Date(formData.date).toISOString() : null,
        })
      ).unwrap();

      toast.success("Task updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white border-0 max-w-md rounded-xl shadow-2xl shadow-black/80">
        <TaskForm
          actionLabel="Update Task"
          initialData={{
            _id: taskToEdit?._id,
            title: taskToEdit?.title || "",
            description: taskToEdit?.description || "",
            date: taskToEdit?.date ? new Date(taskToEdit.date) : null,
            time: taskToEdit?.time || "",
          }}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
export function DeleteTask({ taskId }) {
  const dispatch = useDispatch();

  const handleDeleteClick = async () => {
    if (!taskId) {
      toast.error("Error: No task ID provided for deletion.");
      return;
    }

    try {
      await dispatch(deleteTask(taskId)).unwrap();

      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error(`Failed to delete task: ${error || "Unknown error"}`);
      console.error("Failed to delete task:", error);
    }
  };
  return (
    <Button
      variant="ghost"
      onClick={handleDeleteClick}
      className="p-0 h-auto cursor-pointer"
    >
      <Trash />
    </Button>
  );
}
