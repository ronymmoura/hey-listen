import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import music from "./lyrics/1.json";
import { cn } from "./lib/cn";

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [matching, setMatching] = useState<{ [K: string]: { word: string; typedWord: string } }>();

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

  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  function setTheme() {
    document.documentElement.classList.toggle(
      "dark",
      localStorage.theme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
    );
  }

  const ytRef = useRef<YouTube>(null);

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
            },
          }));
        }
      }
    }
  }, [music]);

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
              className={cn("transition-all", currentTime >= time ? "border-b-accent font-bold" : "text-white")}
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
    <div className="flex w-full flex-col items-center">
      <YouTube
        videoId="tIA_vrBDC1g"
        opts={opts}
        //onReady={onPlayerReady}
        // onStateChange={handleStateChange}
        // onPlay={handleOnPlay}
        ref={ytRef}
      />
      {/* <div className="text-accent">{currentTime.toFixed(2)}</div> */}
      <div className="mt-5 space-y-3 text-center text-3xl">
        {Object.keys(music.lyrics).map((line, idx) => (
          <div>{parseLine(idx, +line, music.lyrics[line])}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
