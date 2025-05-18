import { useEffect, useState } from "react";
import { Music } from "../../models";
import api from "../../api";
import { Link } from "react-router";

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
        <div className="font-lucky flex justify-center text-center text-4xl">Today musics</div>
        <div className="flex gap-y-5">
          {musics.map((music) => (
            <Link to={`/music/${music.yt_id}`} key={music.id} className="group relative inline-block">
              <span className="items-centrer relative z-10 flex justify-center overflow-hidden rounded-lg border-2 border-white px-3.5 py-2 leading-tight font-medium text-white transition-colors duration-300 ease-out group-hover:border-[#24A7AA]">
                <span className="absolute inset-0 h-full w-full rounded-lg bg-[#384364] px-5 py-3"></span>
                <span className="relative flex flex-col items-center gap-y-4 text-base font-semibold">
                  <img src={picture} className="aspect-square w-[130px] rounded-lg bg-white" />

                  <div className="flex flex-col text-center">
                    <div className="font-lucky text-2xl font-light">{music.title}</div>
                    <div>{music.artist}</div>
                  </div>
                </span>
              </span>
              <span className="absolute right-0 bottom-0 -mb-2 h-9 w-full rounded-lg bg-white transition-all group-hover:bg-[#24A7AA]"></span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
