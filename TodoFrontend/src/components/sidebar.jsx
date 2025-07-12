import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ChevronDown,
  ClipboardList,
  SquareCheckBig,
  LayoutList,
  Search,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AddTaskDialog from "./AddTask";

const sideMenu = [
  {
    id: "Today",
    label: "Today",
    path: "/todo/today",
    icon: <ClipboardList size={18} />,
  },
  {
    id: "MyTask",
    label: "My Tasks",
    path: "/todo/tasks",
    icon: <LayoutList size={18} />,
  },

  {
    id: "search",
    label: "Search",
    path: "/todo/search",
    icon: <Search size={18} />,
  },
  {
    id: "completed",
    label: "Completed",
    path: "/todo/completed",
    icon: <SquareCheckBig size={18} />,
  },
];

function MenuItem({ setOpen }) {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("home"); // default active item

  return (
    <nav className="flex flex-col gap-2">
      <AddTaskDialog />
      <div className="mt-4 flex flex-col gap-1">
        {sideMenu.map((menuItem) => (
          <div
            key={menuItem.id}
            onClick={() => {
              setActiveItem(menuItem.id);
              navigate(menuItem.path);
              setOpen?.(false);
            }}
            className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
              activeItem === menuItem.id
                ? "bg-[#F1D4E5] text-[red]"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            {menuItem.icon}
            <span>{menuItem.label}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}

export default function Sidebar({ open, setOpen }) {
  const user = useSelector((state) => state.auth.user);

  const UserInfo = () => (
    <div className="flex items-center gap-3 mb-6">
      <img
        src={user?.profilePic}
        alt="Profile"
        className="w-7 h-7 rounded-full object-cover   border-2 border-[red] "
      />
      <span className="text-base font-semibold truncate max-w-[120px]">
        @{user?.username || "Guest"}
      </span>
      <Button variant="ghost" size="icon" className="ml-auto">
        <Bell size={18} />
      </Button>
      <Button variant="ghost" size="icon" className="ml-auto">
        <ChevronDown size={18} />
      </Button>
    </div>
  );

  return (
    <Fragment>
      {/* Mobile Sheet Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-64 bg-white border-r p-5 shadow-xl"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="mb-4 border-b pb-4">
              <SheetTitle>
                <UserInfo />
              </SheetTitle>
            </SheetHeader>
            <MenuItem setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-74 flex-col border-r border-gray-300 bg-[#FAF7F3] p-5 shadow">
        <UserInfo />
        <MenuItem />
      </aside>
    </Fragment>
  );
}
