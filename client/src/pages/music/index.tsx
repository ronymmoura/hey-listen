import { ReactNode, useEffect, useRef, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { TiMediaFastForward, TiMediaPause, TiMediaPlay, TiMediaRewind } from "react-icons/ti";
// import music from "../../lyrics/1.json";
import { cn } from "../../lib/cn";
import { Music } from "../../models";
import api from "../../api";
import { useParams } from "react-router";

export function MusicPage() {
  const params = useParams();

  const ytRef = useRef<YouTube>(null);

  const [music, setMusic] = useState<Music | undefined>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [picture, setPicture] = useState("");

  const [currentTime, setCurrentTime] = useState(0);
  const [answers, setAnswers] = useState<{ [K: string]: { word: string; typedWord: string; seconds: number } }>();

  const currentTimeMark = music && Object.keys(music.lyrics)
    .filter((x) => +x <= currentTime)
    .reverse()[0];
  // const currentLine = music.lyrics[currentTimeMark];

  const opts: YouTubeProps["opts"] = {
    height: "0",
    width: "0",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      fs: 0,
      controls: 1,
      disablekb: 1,
    },
  };

  useEffect(() => {
    (async () => {
      const music = await api.musics.get(params.yt_id);
      setMusic(music);
    })();
  }, []);

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

  useEffect(() => {
    if (music) {
      (async () => {
        const accessKey = "n940eVW90DffI_0F68jJXLupWryAKbUwHhAoIWfMhpU";
        const pictureRes = await fetch(`https://api.unsplash.com/photos/random?client_id=${accessKey}&topics=music&query=${music.artist}`)
        const pic = await pictureRes.json();
        setPicture(pic.urls.thumb);
      })();
    }
  }, [music]);

  useEffect(() => {
    if (music) {
      const currentLineElement = document.getElementById(currentTimeMark);
      currentLineElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      currentLineElement.getElementsByTagName("input")[0]?.focus();
    }
  }, [currentTimeMark]);

  useEffect(() => {
    if (music) {
      const lines = Object.keys(music.lyrics);

      for (let i = 0; i < lines.length; i++) {
        const line = music.lyrics[lines[i]];

        const indexOfBlank = line.indexOf("{{");

        if (indexOfBlank > -1) {
          const indexOfEnding = line.indexOf("}}");
          const values = line.substring(indexOfBlank + 2, indexOfEnding).split(":");
          const word = values[0];

          setAnswers((old) => ({
            ...old,
            [`${i}`]: {
              word,
              typedWord: "",
              seconds: +lines[i],
            },
          }));
        }
      }
    }
  }, [music]);

  async function togglePlay() {
    const state = await ytRef.current.internalPlayer.getPlayerState();
    if (state != 1) {
      await ytRef.current.internalPlayer.playVideo();
      setIsPlaying(true);
    } else {
      await ytRef.current.internalPlayer.pauseVideo();
      setIsPlaying(false);
    }
  }

  async function seek(val: number) {
    await ytRef.current.internalPlayer.seekTo(currentTime + val);
  }

  async function goto(time: number) {
    await ytRef.current.internalPlayer.seekTo(time);
    await ytRef.current.internalPlayer.playVideo();
  }

  // async function debug() {
  //   const internalPlayer = ytRef.current.internalPlayer;
  //   console.log({ internalPlayer });

  //   await internalPlayer.seekTo(currentTime - 10);
  // }

  function parseLine(idx: number, time: number, line: string): ReactNode {
    if (answers) {
      const indexOfBlank = line.indexOf("{{");

      const hasSpaceAfter = line.indexOf("\n") > -1;

      if (indexOfBlank === -1) return <div className={hasSpaceAfter && "mb-5"}>{line}</div>;

      const indexOfEnding = line.indexOf("}}");
      const values = line.substring(indexOfBlank + 2, indexOfEnding).split(":");
      const size = values[1];

      return (
        <div className={hasSpaceAfter && "mb-10"} onClick={() => goto(time)}>
          <span>{line.substring(0, indexOfBlank)}</span>

          <input
            id={`blank_${idx}`}
            className={
              cn()
              // "transition-all",
              // currentTime >= time ? "border-b-accent text-accent font-bold" : "text-white",
            }
            style={{
              width: size + "px",
            }}
            onChange={(e) => {
              const oldanswers = answers;
              oldanswers[idx].typedWord = e.target.value;
              setAnswers(oldanswers);

              if (oldanswers[idx].typedWord.length >= oldanswers[idx].word.length) {
                if (oldanswers[idx].typedWord !== oldanswers[idx].word) {
                  document.getElementById(`blank_${idx}`).classList.remove("right");
                  document.getElementById(`blank_${idx}`).classList.add("wrong");
                } else {
                  document.getElementById(`blank_${idx}`).classList.remove("wrong");
                  document.getElementById(`blank_${idx}`).classList.add("right");
                }
              } else {
                document.getElementById(`blank_${idx}`).classList.remove("wrong");
                document.getElementById(`blank_${idx}`).classList.remove("right");
              }
            }}
          />

          <span>{line.substring(indexOfEnding + 2)}</span>
        </div>
      );
    }

    return <></>;
  }

  if (!music) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex flex-col items-center p-5 lg:order-2 mt-20 bg-white/5 w-[450px] gap-y-10">
        <img src={picture} className="aspect-square bg-white rounded-2xl w-[200px]" />


        <div className="text-center gap-y-3 flex flex-col">
          <div className="text-4xl font-semibold">{music.title}</div>
          <div>{music.artist}</div>
        </div>

        <YouTube videoId={music.yt_id} opts={opts} ref={ytRef} />

        {/* <div className="flex items-center space-x-3">
          <div className="text-accent my-5 text-2xl">{currentTime.toFixed(2)}</div>
          <button onClick={debug}>Debug</button>
        </div> */}

        <div className="flex space-x-3">
          <button onClick={() => seek(-10)} className="">
            <TiMediaRewind className="text-2xl hover:text-zinc-400 cursor-pointer transition-all" />
          </button>
          <button onClick={togglePlay} className="text-3xl bg-white text-zinc-700 p-2 rounded-full hover:bg-zinc-300 transition-all cursor-pointer">
            {isPlaying ? <TiMediaPause /> : <TiMediaPlay />}
          </button>
          <button onClick={() => seek(10)} className="">
            <TiMediaFastForward className="text-2xl" />
          </button>
        </div>
      </div>

      <div className="no-scrollbar h-screen space-y-3 overflow-y-auto p-10 text-3xl lg:order-1 lg:flex-1 pt-24">
        {Object.keys(music.lyrics).map((time, idx) => (
          <div
            key={idx}
            id={`${time}`}
            className={cn(
              "w-fit cursor-pointer p-1 transition-all hover:bg-zinc-800",
              currentTime >= +time ? "text-accent font-bold" : "text-white",
            )}
            onClick={() => goto(+time)}
          >
            {parseLine(idx, +time, music.lyrics[time])}
          </div>
        ))}
      </div>
    </div>
  );
}
