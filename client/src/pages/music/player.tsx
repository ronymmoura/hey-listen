import { useRef, useEffect } from "react";
import {
  TiMediaRewind,
  TiMediaPause,
  TiMediaPlay,
  TiMediaFastForward,
  TiStarFullOutline,
  TiStarOutline,
} from "react-icons/ti";
import YouTube, { YouTubeProps } from "react-youtube";
import { useGameStore } from "../../stores";

export function Player() {
  const gameStore = useGameStore();

  const ytRef = useRef<YouTube>(null);

  // const currentTimeMark =
  //   music &&
  //   Object.keys(music.lyrics)
  //     .filter((x) => +x <= currentTime)
  //     .reverse()[0];
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

  const countAnswers = gameStore.answers
    ? Object.keys(gameStore.answers).filter((x) => gameStore.answers[x].typedWord === gameStore.answers[x].word).length
    : 0;

  const percent = (countAnswers / Object.keys(gameStore.answers || {}).length) * 100;

  useEffect(() => {
    const int = setInterval(() => {
      (async () => {
        if (ytRef && ytRef.current && ytRef.current.internalPlayer.getCurrentTime) {
          const time = await ytRef.current.internalPlayer.getCurrentTime();
          gameStore.setCurrentTime(time);
        }
      })();
    }, 250);

    return () => {
      clearInterval(int);
    };
  }, []);

  useEffect(() => {
    (async () => {
      await ytRef.current.internalPlayer.seekTo(gameStore.currentTime);
      await ytRef.current.internalPlayer.playVideo();
    })();
  }, [gameStore.currentTime]);

  async function togglePlay() {
    const state = await ytRef.current.internalPlayer.getPlayerState();
    if (state != 1) {
      await ytRef.current.internalPlayer.playVideo();
      gameStore.setIsPlaying(true);
    } else {
      await ytRef.current.internalPlayer.pauseVideo();
      gameStore.setIsPlaying(false);
    }
  }

  async function seek(val: number) {
    await ytRef.current.internalPlayer.seekTo(gameStore.currentTime + val);
  }

  return (
    <div className="mt-20 flex w-[450px] flex-col items-center gap-y-10 rounded-lg bg-white/5 p-10 lg:order-2">
      <img src={""} className="aspect-square w-[200px] rounded-2xl bg-white" />

      <div className="flex flex-col gap-y-3 text-center">
        <div className="text-4xl font-semibold">{gameStore.music.title}</div>
        <div>{gameStore.music.artist}</div>
      </div>

      <YouTube videoId={gameStore.music.yt_id} opts={opts} ref={ytRef} />

      {/* <div className="flex items-center space-x-3">
          <div className="text-accent my-5 text-2xl">{currentTime.toFixed(2)}</div>
          <button onClick={debug}>Debug</button>
        </div> */}

      <div className="flex w-full justify-center space-x-3">
        <button onClick={() => seek(-10)} className="">
          <TiMediaRewind className="cursor-pointer text-2xl transition-all hover:text-zinc-400" />
        </button>
        <button
          onClick={togglePlay}
          className="cursor-pointer rounded-full bg-white p-2 text-3xl text-zinc-700 transition-all hover:bg-zinc-300"
        >
          {gameStore.isPlaying ? <TiMediaPause /> : <TiMediaPlay />}
        </button>
        <button onClick={() => seek(10)} className="">
          <TiMediaFastForward className="text-2xl" />
        </button>
      </div>

      <div className="flex w-full flex-col gap-y-1">
        <div className="relative flex w-full justify-between">
          <TiStarOutline className="text-[#8993B4]" size={40} /> {/* 0% */}
          {percent >= 30 ? (
            <TiStarFullOutline className="text-amber-400" size={40} />
          ) : (
            <TiStarOutline className="text-amber-400" size={40} />
          )}
          {percent >= 60 ? (
            <TiStarFullOutline className="text-amber-400" size={40} />
          ) : (
            <TiStarOutline className="text-amber-400" size={40} />
          )}
          {percent >= 100 ? (
            <TiStarFullOutline className="text-amber-400" size={40} />
          ) : (
            <TiStarOutline className="text-amber-400" size={40} />
          )}{" "}
        </div>

        <div className="relative flex h-6 w-full items-center px-5">
          <div className="relative flex h-4 w-full rounded-md bg-[#8993B4]"></div>
          <div
            className="absolute top-0 flex h-6 rounded-md bg-amber-500 transition-all"
            style={{ width: percent >= 90 ? "90%" : percent + "%" }}
          ></div>{" "}
          {/* 90% max */}
          {/* {countAnswers} / {Object.keys(gameStore.answers || {}).length} words */}
        </div>
      </div>
    </div>
  );
}
