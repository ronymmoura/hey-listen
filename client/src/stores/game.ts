import { create } from "zustand";
import { Music } from "../models";

type GameStore = {
  music: Music | undefined;
  isPlaying: boolean;
  currentTimeMark: string;
  currentTime: number;
  answers: { [key: string]: { word: string; typedWord: string; seconds: number } };
  setMusic: (music: Music | undefined) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (currentTime: number) => void;
  setAnswers: (answers: { [key: string]: { word: string; typedWord: string; seconds: number } }) => void;
  updateAnswers: (answers: { [key: string]: { word: string; typedWord: string; seconds: number } }) => void;
  reset: () => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  music: undefined,
  isPlaying: false,
  currentTimeMark: "",
  currentTime: 0,
  answers: {},

  setMusic: (music: Music) => set({ music }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => {
    const { music } = get();
    if (!music) return;
    const currentTimeMark = Object.keys(music.lyrics)
      .filter((x) => +x <= currentTime)
      .reverse()[0];
    set({ currentTimeMark, currentTime });
  },
  setAnswers: (answers) => set({ answers }),
  updateAnswers: (answers) => {
    const { answers: currentAnswers } = get();
    set({ answers: { ...currentAnswers, ...answers } });
  },

  reset: () => set({ music: undefined, isPlaying: false, currentTimeMark: "", currentTime: 0, answers: {} }),
}));
