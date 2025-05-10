import { useEffect, useState } from "react";
import { Music } from "../../models";
import api from "../../api";

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
      <div className="flex w-full max-w-xl flex-col gap-5">
        <div className="flex gap-y-5">
          {musics.map((music) => (
            <a
              href={`/music/${music.yt_id}`}
              key={music.id}
              className="flex cursor-pointer flex-col items-center gap-y-5 rounded-lg bg-[#384364] p-3 text-xl transition-all select-none hover:bg-white/10"
            >
              <img src={picture} className="aspect-square w-[100px] rounded-lg bg-white" />

              <div className="flex flex-col text-center">
                <div className="font-lucky text-2xl">{music.title}</div>
                <div>{music.artist}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
