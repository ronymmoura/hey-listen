import { useLayoutEffect } from "react";
import { Outlet } from "react-router";
import { PiUserSoundFill } from "react-icons/pi";

export function RootLayout() {
  return (
    <div className="">
      {/* <div>Root</div>
      <button onClick={handleToggleTheme}>Toggle Theme</button> */}

      <div className="py-2 px-20 border-b border-zinc-600 backdrop-blur-2xl flex fixed w-full">
        <div className="flex items-center gap-x-5">
          <PiUserSoundFill className="text-6xl" />
          <div className="text-3xl">Hey, listen!</div>
        </div>
      </div>

      <div className="flex max-h-screen">
        <nav className="w-[350px] flex flex-col p-5 gap-y-3 h-auto pt-24">
          <a href="/" className="border border-zinc-600 bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all">
            Home
          </a>

          <a href="/studio" className="border border-zinc-600 bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all">
            Studio
          </a>
        </nav>

        <div className="flex-1">
          <Outlet />
        </div>

      </div>
    </div>
  );
}
