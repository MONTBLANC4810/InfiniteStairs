import { create } from 'zustand';

export type Direction = 0 | 1;

interface GameState {
  score: number;
  combo: number;
  maxCombo: number;
  timeLeft: number;
  status: 'idle' | 'playing' | 'gameover';
  stairs: Direction[];
  playerDirection: Direction;
  climbCount: number;
  lastInputTime: number;
  shake: boolean;
  fever: boolean;
  
  // Actions
  startGame: () => void;
  climb: (targetDir: Direction) => void;
  tick: (delta: number) => void;
  resetGame: () => void;
  setShake: (val: boolean) => void;
}

const INITIAL_STAIRS_COUNT = 30;
const MAX_TIME = 100;
const BASE_DECAY = 5;
const RECOVERY = 4;

export const useGameStore = create<GameState>((set, get) => ({
  score: 0,
  combo: 0,
  maxCombo: 0,
  timeLeft: MAX_TIME,
  status: 'idle',
  stairs: [],
  playerDirection: 1,
  climbCount: 0,
  lastInputTime: 0,
  shake: false,
  fever: false,

  startGame: () => {
    const initialStairs: Direction[] = [];
    for (let i = 0; i < INITIAL_STAIRS_COUNT; i++) {
      initialStairs.push(Math.random() > 0.5 ? 1 : 0 as Direction);
    }
    set({
      status: 'playing',
      score: 0,
      combo: 0,
      timeLeft: MAX_TIME,
      stairs: initialStairs,
      playerDirection: 1,
      climbCount: 0,
      fever: false,
      shake: false,
    });
  },

  climb: (inputDir: Direction) => {
    const state = get();
    if (state.status !== 'playing') return;

    const nextStairDir = state.stairs[0];
    const now = performance.now();
    const interval = now - state.lastInputTime;

    if (inputDir === nextStairDir) {
      const newStairs = [...state.stairs.slice(1), Math.random() > 0.5 ? 1 : 0 as Direction];
      const newCombo = state.combo + 1;
      
      // 입력 속도가 빠르면 화면 흔들림 효과 유발
      const shouldShake = interval < 150;
      const isFever = newCombo > 50;

      set({
        score: state.score + 1,
        combo: newCombo,
        maxCombo: Math.max(state.maxCombo, newCombo),
        stairs: newStairs,
        playerDirection: inputDir,
        timeLeft: Math.min(MAX_TIME, state.timeLeft + (isFever ? RECOVERY * 1.5 : RECOVERY)),
        climbCount: state.climbCount + 1,
        lastInputTime: now,
        shake: shouldShake,
        fever: isFever,
      });

      if (shouldShake) {
        setTimeout(() => set({ shake: false }), 100);
      }
    } else {
      set({ status: 'gameover', combo: 0, fever: false });
    }
  },

  tick: (delta: number) => {
    const state = get();
    if (state.status !== 'playing') return;

    // 난이도 상승에 따른 시간 감소 가속
    const accel = Math.floor(state.score / 100) * 2;
    const decay = state.fever ? (BASE_DECAY + accel) * 0.5 : (BASE_DECAY + accel);
    const newTime = state.timeLeft - (decay * delta);

    if (newTime <= 0) {
      set({ timeLeft: 0, status: 'gameover', fever: false });
    } else {
      set({ timeLeft: newTime });
    }
  },

  resetGame: () => set({ status: 'idle', score: 0, combo: 0, fever: false }),
  setShake: (val) => set({ shake: val }),
}));
