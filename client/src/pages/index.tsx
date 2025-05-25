import { Link, Outlet } from "react-router";
import { PiUserSoundFill } from "react-icons/pi";
import { TiStarFullOutline, TiVideoOutline } from "react-icons/ti";
import { HiBookmark } from "react-icons/hi2";
import { TbHomeFilled } from "react-icons/tb";
import { FaHistory } from "react-icons/fa";

export function RootLayout() {
  return (
    <div className="flex h-screen max-h-screen flex-col p-10 text-white">
      <div className="flex items-center justify-between">
        <div className="font-lucky flex items-center gap-x-5">
          <PiUserSoundFill className="text-8xl text-slate-400" />
          <div className="text-4xl">Hey, listen!</div>
        </div>

        <div className="relative mt-10 mr-4 flex rounded-lg bg-[#384364] px-4 py-2 pr-[200px]">
          <div className="flex items-end gap-x-2">
            <TiStarFullOutline className="text-4xl text-amber-400" />
            <div className="font-lucky text-center text-3xl leading-6 text-amber-400">500</div>
          </div>

          <div className="absolute -top-[45px] right-[30px] flex justify-center">
            <img
              src="https://gravatar.com/userimage/91635443/ca6a48e3bdb7aa0be63b1156001bf5d8.jpeg?size=128"
              alt="Rony"
              className="rounded-full border-4 border-white"
            />

            <div className="absolute bottom-1">
              <div className="font-lucky relative z-10 rounded-md bg-[#24A7AA] px-4 py-1 pt-2 text-center text-xl uppercase">
                level 10
              </div>

              <HiBookmark className="absolute top-[10px] -left-[20px] z-0 rotate-90 text-[#128683]" size={44} />
              <HiBookmark className="absolute top-[10px] -right-[20px] z-0 -rotate-90 text-[#128683]" size={44} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        <nav className="flex h-full w-[350px] flex-col gap-y-5 pt-10">
          <Link to="/" className="font-lucky flex items-center gap-x-3 text-3xl">
            <TbHomeFilled />
            Home
          </Link>

          <Link to="/" className="font-lucky flex items-center gap-x-3 text-3xl">
            <FaHistory />
            History
          </Link>

          <Link to="/studio" className="font-lucky flex items-center gap-x-3 text-3xl">
            <TiVideoOutline />
            Studio
          </Link>
        </nav>

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
