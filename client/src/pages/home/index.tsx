import { useEffect, useState } from "react";
import { Music } from "../../models";
import api from "../../api";

export function HomePage() {
  const [musics, setMusics] = useState<Music[]>([]);

  useEffect(() => {
    (async () => {
      const musics = await api.musics.list();
      setMusics(musics);
    })();
  }, []);

  return (
    <div className="flex w-screen justify-center py-5">
      <div className="w-full max-w-xl gap-5 flex flex-col">
        <div className="text-4xl font-semibold">
          Musics
        </div>

        <div className="flex flex-col gap-y-5">
          <a href="/studio" className="flex text-xl border bg-white/5 p-3 rounded-lg border-zinc-600 hover:bg-white/10 select-none cursor-pointer transition-all">New Music</a>

          {musics.map((music) => (
            <a
              href={`/music/${music.yt_id}`}
              key={music.id}
              className="flex text-xl border bg-white/5 p-3 rounded-lg border-zinc-600 hover:bg-white/10 select-none cursor-pointer transition-all"
            >
              {music.title} - {music.artist}
            </a>
          ))}
        </div>
      </div>
    </div >
  )
}
