import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { TiMediaFastForward, TiMediaRewind } from "react-icons/ti";
import music from "./lyrics/1.json";
import { cn } from "./lib/cn";

function App() {
  const ytRef = useRef<YouTube>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [matching, setMatching] = useState<{ [K: string]: { word: string; typedWord: string; seconds: number } }>();

  useLayoutEffect(() => {
    setTheme();
  }, []);

  // function handleToggleTheme() {
  //   if (!("theme" in localStorage) || localStorage.theme === "dark") {
  //     localStorage.theme = "light";
  //   } else {
  //     localStorage.theme = "dark";
  //   }

  //   setTheme();
  // }

  const currentTimeMark = Object.keys(music.lyrics)
    .filter((x) => +x <= currentTime)
    .reverse()[0];
  // const currentLine = music.lyrics[currentTimeMark];

  const opts: YouTubeProps["opts"] = {
    height: "360",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      fs: 0,
      controls: 0,
      disablekb: 1,
    },
  };

  function setTheme() {
    document.documentElement.classList.toggle(
      "dark",
      localStorage.theme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
    );
  }

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
    const currentLineElement = document.getElementById(currentTimeMark);
    currentLineElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
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

          setMatching((old) => ({
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
    } else {
      await ytRef.current.internalPlayer.pauseVideo();
    }
  }

  async function seek(val: number) {
    await ytRef.current.internalPlayer.seekTo(currentTime + val);
  }

  // async function debug() {
  //   const internalPlayer = ytRef.current.internalPlayer;
  //   console.log({ internalPlayer });

  //   await internalPlayer.seekTo(currentTime - 10);
  // }

  function parseLine(idx: number, time: number, line: string): ReactNode {
    let space = false;

    if (matching) {
      const indexOfBlank = line.indexOf("{{");

      space = line.indexOf("\n") > -1;

      if (indexOfBlank > -1) {
        const indexOfEnding = line.indexOf("}}");
        const values = line.substring(indexOfBlank + 2, indexOfEnding).split(":");
        const size = values[1];

        return (
          <>
            <span className={cn("transition-all", currentTime >= time ? "text-accent font-bold" : "text-white")}>
              {line.substring(0, indexOfBlank)}
            </span>
            <input
              id={`blank_${idx}`}
              className={cn(
                "transition-all",
                currentTime >= time ? "border-b-accent text-accent font-bold" : "text-white",
              )}
              style={{
                width: size + "px",
              }}
              onChange={(e) => {
                const oldMatching = matching;
                oldMatching[idx].typedWord = e.target.value;
                setMatching(oldMatching);

                if (oldMatching[idx].typedWord.length >= oldMatching[idx].word.length) {
                  if (oldMatching[idx].typedWord !== oldMatching[idx].word) {
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
            <span className={cn("transition-all", currentTime >= time ? "text-accent font-bold" : "text-white")}>
              {line.substring(indexOfEnding + 2)}
            </span>

            {space && (
              <>
                <br />
                <br />
                <br />
              </>
            )}
          </>
        );
      } else {
        return (
          <div className={cn("transition-all", currentTime >= time ? "text-accent font-bold" : "text-white")}>
            {line}
            {space && (
              <>
                <br />
                <br />
                <br />
              </>
            )}
          </div>
        );
      }
    }

    return <></>;
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex flex-col items-center p-5 lg:order-2 lg:h-screen">
        <YouTube videoId={music.id} opts={opts} ref={ytRef} />

        {/* <div className="flex items-center space-x-3">
          <div className="text-accent my-5 text-2xl">{currentTime.toFixed(2)}</div>
          <button onClick={debug}>Debug</button>
        </div> */}

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
      </div>

      <div className="no-scrollbar h-screen space-y-3 overflow-y-auto p-5 text-center text-3xl lg:order-1 lg:flex-1">
        {Object.keys(music.lyrics).map((line, idx) => (
          <div key={idx} id={`${line}`}>
            {parseLine(idx, +line, music.lyrics[line])}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
