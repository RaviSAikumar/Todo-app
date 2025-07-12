import { useState } from "react";
import { format } from "date-fns";
import { CalendarDays, Bell, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export default function TaskForm({
  onSubmit,
  initialData = {},
  actionLabel = "Add Task",
  onCancel,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: null,
    time: "",
    completed: false,
    ...initialData,
  });

  const [reminderOpen, setReminderOpen] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      date: formData.date ? formData.date.toISOString().split("T")[0] : null,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-gray-800">{actionLabel}</h2>

      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        type="text"
        placeholder="Task title"
        className="p-2 border border-none outline-none focus:outline-none rounded w-full"
      />

      <Textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="border border-none outline-none focus:outline-none"
      />

      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="text-sm text-gray-500">
              <CalendarDays size={16} />
              {formData.date ? format(formData.date, "PPP") : "Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white">
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={(date) => setFormData((prev) => ({ ...prev, date }))}
            />
          </PopoverContent>
        </Popover>

        {/* Reminder Time */}
        <Popover open={reminderOpen} onOpenChange={setReminderOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="text-sm text-gray-500">
              <Bell size={16} /> Reminders
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[260px] bg-white border-none p-4 space-y-3">
            <input
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, time: e.target.value }))
              }
              className="w-full border-gray-300 outline-gray-300 h-8 p-1 rounded text-sm"
            />
            <Button
              type="button"
              onClick={() => setReminderOpen(false)}
              className="w-full bg-[#F11A7B] text-white text-sm"
              disabled={!formData.time}
            >
              Add reminder
            </Button>
          </PopoverContent>
        </Popover>

        <Button variant="outline" className="text-sm text-gray-500">
          <Inbox size={16} /> Inbox
        </Button>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="outline">
            Cancel
          </Button>
        )}
        <Button type="submit" className="bg-[#F11A7B] text-white">
          {actionLabel}
        </Button>
      </div>
    </form>
  );
}
