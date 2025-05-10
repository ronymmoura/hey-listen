import { Outlet } from "react-router";
import { PiUserSoundFill } from "react-icons/pi";
import { TiStarFullOutline } from "react-icons/ti";
import { HiBookmark } from "react-icons/hi2";

export function RootLayout() {
  return (
    <div className="h-full p-10 text-white">
      <div className="flex items-center justify-between">
        <div className="font-lucky flex items-center gap-x-5">
          <PiUserSoundFill className="text-8xl text-slate-400" />
          <div className="text-4xl">Hey, listen!</div>
        </div>

        <div className="flex rounded-lg bg-[#384364] px-2 py-1 mr-4 mt-10 pr-[200px] relative">
          <div className="flex items-baseline gap-x-2">
            <TiStarFullOutline className="text-5xl text-amber-400" />
            <div className="font-lucky text-4xl  text-amber-400">500</div>
          </div>

          <div className="absolute -top-[45px] right-[50px] flex justify-center">
            <img
              src="https://gravatar.com/userimage/91635443/ca6a48e3bdb7aa0be63b1156001bf5d8.jpeg?size=128"
              alt="Rony"
              className="rounded-full border-4 border-white"
            />

            <div className="absolute bottom-1">
              <div className="font-lucky relative z-10 items-center rounded-md bg-[#24A7AA] px-4 py-1 text-center text-xl uppercase">
                level 10
              </div>

              <HiBookmark className="absolute top-[10px] -left-[20px] z-0 rotate-90 text-[#128683]" size={40} />
              <HiBookmark className="absolute top-[10px] -right-[20px] z-0 -rotate-90 text-[#128683]" size={40} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-h-screen">
        <nav className="flex h-auto w-[350px] flex-col gap-y-3 pt-10">
          <a href="/" className="rounded-lg border border-zinc-600 bg-white/5 p-4 transition-all hover:bg-white/10">
            Home
          </a>

          <a
            href="/studio"
            className="rounded-lg border border-zinc-600 bg-white/5 p-4 transition-all hover:bg-white/10"
          >
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
