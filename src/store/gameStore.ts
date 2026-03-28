import { create } from 'zustand';

// 계단의 방향 타입: 0은 왼쪽 상단, 1은 오른쪽 상단
export type Direction = 0 | 1;

interface GameState {
  score: number;
  timeLeft: number; // 0 ~ 100 (백분율)
  status: 'idle' | 'playing' | 'gameover';
  stairs: Direction[]; // 계단 방향 배열 (Queue)
  playerDirection: Direction; // 플레이어가 바라보는 방향
  climbCount: number; // 총 오른 횟수
  
  // Actions
  startGame: () => void;
  climb: (targetDir: Direction) => void;
  tick: (delta: number) => void;
  resetGame: () => void;
}

const INITIAL_STAIRS_COUNT = 20;
const MAX_TIME = 100;
const TIME_DECAY = 4; // 초당 감소량 (기본)
const TIME_RECOVERY = 5; // 성공 시 회복량

export const useGameStore = create<GameState>((set, get) => ({
  score: 0,
  timeLeft: MAX_TIME,
  status: 'idle',
  stairs: [],
  playerDirection: 1, // 초기 방향 (오른쪽)
  climbCount: 0,

  startGame: () => {
    // 초기 계단 무작위 생성
    const initialStairs: Direction[] = [];
    for (let i = 0; i < INITIAL_STAIRS_COUNT; i++) {
      initialStairs.push(Math.random() > 0.5 ? 1 : 0 as Direction);
    }
    
    set({
      status: 'playing',
      score: 0,
      timeLeft: MAX_TIME,
      stairs: initialStairs,
      playerDirection: 1,
      climbCount: 0,
    });
  },

  climb: (inputDir: Direction) => {
    const { status, stairs, score, timeLeft } = get();
    if (status !== 'playing') return;

    // 현재 밟아야 할 계단의 방향과 입력 방향 비교
    // 무한의 계단 메커니즘: 
    // - 이전 계단과 같은 방향이면 '오르기'
    // - 이전 계단과 다른 방향이면 '방향전환'
    // 여기서는 간단하게 inputDir가 다음 계단의 방향과 일치하는지 확인
    const nextStairDir = stairs[0];

    if (inputDir === nextStairDir) {
      // 성공: 계단 하나 제거하고 새 계단 추가
      const newStairs = [...stairs.slice(1), Math.random() > 0.5 ? 1 : 0 as Direction];
      set({
        score: score + 1,
        stairs: newStairs,
        playerDirection: inputDir,
        timeLeft: Math.min(MAX_TIME, timeLeft + TIME_RECOVERY),
        climbCount: get().climbCount + 1,
      });
    } else {
      // 실패: 게임 오버
      set({ status: 'gameover' });
    }
  },

  tick: (delta: number) => {
    const { status, timeLeft, score } = get();
    if (status !== 'playing') return;

    // 점수가 높을수록 시간이 더 빨리 감소 (난이도 조절)
    const currentDecay = TIME_DECAY + Math.floor(score / 50) * 2;
    const newTime = timeLeft - (currentDecay * delta);

    if (newTime <= 0) {
      set({ timeLeft: 0, status: 'gameover' });
    } else {
      set({ timeLeft: newTime });
    }
  },

  resetGame: () => {
    set({ status: 'idle', score: 0, timeLeft: MAX_TIME, stairs: [] });
  },
}));
