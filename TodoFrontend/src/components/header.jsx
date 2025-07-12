import { AlignJustify, PanelLeftOpen } from "lucide-react";
import { Button } from "./ui/button";
import { logoutUser } from "@/store/auth-slice";
import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeaderComponent({ open, setOpen }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-8 py-6 border-b-1 border-gray-300 bg-background ">
      {open ? (
        ""
      ) : (
        <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
          <AlignJustify />
          <span className="sr-only">Toggle Menu </span>
        </Button>
      )}

      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 bg-black text-white items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default HeaderComponent;
