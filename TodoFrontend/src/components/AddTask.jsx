import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo } from "@/store/todo-slice";
import { toast } from "sonner";
import { useState } from "react";
import TaskForm from "./TaskForm";

export default function AddTaskDialog() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (data) => {
    try {
      const payload = {
        ...data, // date is already a string (YYYY-MM-DD)
        userId: user?._id,
      };
      await dispatch(addTodo(payload)).unwrap();
      toast.success("Task added!");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to add task.");
      console.error("Add Task Error:", err?.response?.data || err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="flex items-center cursor-pointer gap-2"
        >
          <Plus size={16} /> Add Task
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white border-0 max-w-md rounded-xl shadow-2xl shadow-black/80">
        <TaskForm
          actionLabel="Add Task"
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
