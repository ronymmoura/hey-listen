import { useEffect, useState, useRef } from "react";
import { TiMediaFastForward, TiMediaRewind } from "react-icons/ti";
import YouTube, { YouTubeProps } from "react-youtube";
import { Music } from "../../models";
import api from "../../api";

export function StudioPage() {
  const ytRef = useRef<YouTube>(null);

  const [musicID, setMusicID] = useState("");
  const [music, setMusic] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [lyricsLines, setLyricsLines] = useState<[string, string][]>([]);

  const [currentLine, setCurrentLine] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const opts: YouTubeProps["opts"] = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 0,
      fs: 0,
      controls: 1,
      disablekb: 1,
    },
  };

  useEffect(() => {
    const int = setInterval(() => {
      (async () => {
        if (ytRef.current && ytRef.current.internalPlayer.getCurrentTime) {
          const time = await ytRef.current.internalPlayer.getCurrentTime();
          setCurrentTime(time);
        }
      })();
    }, 250);

    return () => {
      clearInterval(int);
    };
  }, []);

  async function togglePlay() {
    const state = await ytRef.current.internalPlayer.getPlayerState();
    if (state != 1) {
      await ytRef.current.internalPlayer.playVideo();
    } else {
      await ytRef.current.internalPlayer.pauseVideo();
    }
  }

  async function seek(val: number) {
    await ytRef.current.internalPlayer.seekTo(currentTime + val);
  }

  function handleLoadMusic() {
    setMusic(musicID);

    const lyricsLines = lyrics.split("\n");
    setLyricsLines(lyricsLines.map((line) => ["000000.00", line]));
  }

  function handleMark() {
    const ogLines = lyricsLines;
    ogLines[currentLine] = [currentTime.toFixed(2).padStart(9, "0"), ogLines[currentLine][1]];
    setLyricsLines(ogLines);
    setCurrentLine((current) => ++current);
  }

  async function handleSave() {
    const lyricsMap: { [time: string]: string } = {};

    for (const line of lyricsLines) {
      lyricsMap[line[0]] = line[1];
    }

    const req: Music = {
      title,
      artist,
      yt_id: musicID,
      lyrics: lyricsMap,
    };

    await api.musics.create(req);
  }

  return (
    <div className="flex flex-row p-5">
      <div className="flex-1 text-xl">
        {lyricsLines.map((line) => (
          <div>
            {line[0]}: {line[1]}
          </div>
        ))}
      </div>

      <div className="flex-1">
        <div>
          <div>
            <div>
              <label>YouTube Video ID:</label>
              <input name="id" value={musicID} onChange={(e) => setMusicID(e.target.value)} />
            </div>

            <div>
              <label>Title:</label>
              <input name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
              <label>Artist:</label>
              <input name="artist" value={artist} onChange={(e) => setArtist(e.target.value)} />
            </div>

            <div>
              <label>Lyrics:</label>
              <textarea name="lyrics" value={lyrics} onChange={(e) => setLyrics(e.target.value)}></textarea>
            </div>

            <button onClick={handleLoadMusic}>Load music</button>
          </div>

          <YouTube videoId={music} opts={opts} ref={ytRef} />

          <div className="flex space-x-3 p-3">
            <button onClick={() => seek(-10)}>
              <TiMediaRewind /> <span>10 seconds</span>
            </button>
            <button onClick={togglePlay}>Play/Pause</button>
            <button onClick={() => seek(10)}>
              <span>10 seconds</span>
              <TiMediaFastForward />
            </button>
          </div>

          <div>
            <button onClick={handleMark}>Mark</button>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
