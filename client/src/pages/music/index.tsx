import { ReactNode, useEffect } from "react";
import { cn } from "../../lib/cn";
import api from "../../api";
import { useParams } from "react-router";
import { useGameStore } from "../../stores";
import { Player } from "./player";

export function MusicPage() {
  const params = useParams();
  const gameStore = useGameStore();

  useEffect(() => {
    (async () => {
      const music = await api.musics.get(params.yt_id);
      gameStore.setMusic(music);
    })();
  }, []);

  // useEffect(() => {
  //   if (gameStore.music) {
  //     (async () => {
  //       const accessKey = "n940eVW90DffI_0F68jJXLupWryAKbUwHhAoIWfMhpU";
  //       const pictureRes = await fetch(
  //         `https://api.unsplash.com/photos/random?client_id=${accessKey}&topics=music&query=${gameStore.music.artist}`,
  //       );
  //       //const pic = await pictureRes.json();
  //       //setPicture(pic.urls.thumb);
  //     })();
  //   }
  // }, [gameStore.music]);

  useEffect(() => {
    const currentLineElement = document.getElementById(gameStore.currentTimeMark);
    if (currentLineElement) {
      currentLineElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      currentLineElement.getElementsByTagName("input")[0]?.focus();
    }
  }, [gameStore.currentTimeMark]);

  useEffect(() => {
    if (gameStore.music) {
      const lines = Object.keys(gameStore.music.lyrics);

      for (let i = 0; i < lines.length; i++) {
        const line = gameStore.music.lyrics[lines[i]];

        const indexOfBlank = line.indexOf("{{");

        if (indexOfBlank > -1) {
          const indexOfEnding = line.indexOf("}}");
          const values = line.substring(indexOfBlank + 2, indexOfEnding).split(":");
          const word = values[0];
          gameStore.updateAnswers({
            [`${i}`]: {
              word,
              typedWord: "",
              seconds: +lines[i],
            },
          });
        }
      }
    }
  }, [gameStore.music]);

  // async function debug() {
  //   const internalPlayer = ytRef.current.internalPlayer;
  //   console.log({ internalPlayer });

  //   await internalPlayer.seekTo(currentTime - 10);
  // }

  async function goto(time: number) {
    gameStore.setCurrentTime(time);
  }

  function parseLine(idx: number, time: number, line: string): ReactNode {
    if (gameStore.answers) {
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
              const oldanswers = gameStore.answers;
              oldanswers[idx].typedWord = e.target.value;
              gameStore.setAnswers(oldanswers);

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

  if (!gameStore.music) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <Player />

      <div className="no-scrollbar h-[83svh] flex-1 space-y-3 overflow-y-auto p-10 text-3xl lg:order-1">
        {Object.keys(gameStore.music.lyrics).map((time, idx) => (
          <div
            key={idx}
            id={`${time}`}
            className={cn(
              "w-fit cursor-pointer p-1 transition-all hover:bg-zinc-800",
              gameStore.currentTime >= +time ? "text-accent font-bold" : "text-white",
            )}
            onClick={() => goto(+time)}
          >
            {parseLine(idx, +time, gameStore.music.lyrics[time])}
          </div>
        ))}
      </div>
    </div>
  );
}
