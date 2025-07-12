import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import HeaderComponent from "./header";
import { useState } from "react";
function Layout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar open={openSidebar} setOpen={setOpenSidebar} className="w-full" />

      <div className="flex flex-1 bg-[#FBFBFB] flex-col">
        <header>
          <HeaderComponent open={openSidebar} setOpen={setOpenSidebar} />
        </header>

        <main className="flex-1 bg-[#FBFBFB] items-center justify-center  bg-muted/40 p-4 md:p-6">
          <div className=" flex-1 overflow-y-scroll thin-scrollbar scroll-smooth px-4">
            <Outlet className=" h-[80vh]" />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
