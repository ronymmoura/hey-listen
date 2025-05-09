import { Music } from "../models";

const apiUrl = "http://localhost:8081"

export default {
  musics: {
    list: async (): Promise<Music[]> => {
      const musicsRes = await fetch(apiUrl + "/musics");
      const musics = await musicsRes.json();
      return musics;
    },

    get: async (yt_id: string): Promise<Music> => {
      const musicRes = await fetch(apiUrl + "/musics?yt_id=" + yt_id);
      const music = await musicRes.json();
      return music.length > 0 ? music[0] : undefined;
    },

    create: async (music: Music): Promise<any> => {
      const res = await fetch(apiUrl + "/musics/new", { body: JSON.stringify(music), method: "POST" });
      const m = await res.json();
      return m;
    }
  }
}
