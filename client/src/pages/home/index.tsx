import { useEffect, useState } from "react";
import { Music } from "../../models";
import api from "../../api";
import { Link } from "react-router";
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";

export function HomePage() {
  const [musics, setMusics] = useState<Music[]>([]);
  const [picture] = useState("");

  useEffect(() => {
    (async () => {
      const musics = await api.musics.list();
      setMusics(musics);
    })();
  }, []);

  return (
    <div className="flex px-5 py-10">
      <div className="flex w-full flex-col gap-5">
        <div className="font-lucky flex justify-center text-center text-6xl">Today musics</div>
        <div className="flex gap-10">
          {musics.map((music) => (
            <Link
              to={`/music/${music.yt_id}`}
              key={music.id}
              className="group flex gap-x-5 rounded-xl border-2 border-transparent bg-[#384364] p-5 pr-14 transition-all hover:border-[#24A7AA] hover:bg-[#384364]"
            >
              <span className="relative flex flex-col items-center gap-y-4 text-base font-semibold">
                <img src={picture} className="aspect-square w-[140px] rounded-lg bg-white" />
              </span>

              <div className="flex flex-col gap-y-3">
                <div>
                  <div className="font-lucky text-2xl font-light">{music.title}</div>
                  <div>{music.artist}</div>
                </div>

                <div className="w-fit rounded-full bg-emerald-400 px-4 py-px text-sm font-bold">Easy</div>

                <div className="flex">
                  <TiStarFullOutline className="text-4xl text-amber-400" />
                  <TiStarOutline className="text-4xl text-[#19233B]" />
                  <TiStarOutline className="text-4xl text-[#19233B]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
