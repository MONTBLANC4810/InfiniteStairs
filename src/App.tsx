import React, { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import type { Direction } from './store/gameStore';
import GameBoard from './components/GameBoard';
import HUD from './components/HUD';
import { Trophy, Play, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const { status, score, startGame, resetGame, tick } = useGameStore();

  // 게임 루프 (타이머 감소)
  useEffect(() => {
    let lastTime = performance.now();
    let frameId: number;

    const frame = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      tick(delta);
      frameId = requestAnimationFrame(frame);
    };

    if (status === 'playing') {
      frameId = requestAnimationFrame(frame);
    }

    return () => cancelAnimationFrame(frameId);
  }, [status, tick]);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden font-game text-white bg-slate-900">
      {/* 배경 장식 (Subtle Gradient & Stars) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
      
      {status === 'idle' && (
        <div className="z-10 flex flex-col items-center space-y-8 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-500 drop-shadow-lg text-center">
            INFINITE<br/>STAIRS
          </h1>
          <button
            onClick={startGame}
            className="group relative flex items-center space-x-3 px-12 py-6 bg-blue-600 hover:bg-blue-500 transition-all rounded-xl pixel-border transform hover:scale-110 active:scale-95"
          >
            <Play fill="currentColor" size={24} />
            <span className="text-2xl">START</span>
          </button>
          <p className="text-slate-400 text-sm animate-pulse">PRESS START TO PLAY</p>
        </div>
      )}

      {status === 'playing' && (
        <>
          <HUD />
          <GameBoard />
        </>
      )}

      {status === 'gameover' && (
        <div className="z-20 flex flex-col items-center p-12 bg-black/80 backdrop-blur-md rounded-3xl pixel-border animate-bounce-in">
          <Trophy className="text-yellow-400 mb-4" size={64} />
          <h2 className="text-4xl font-bold text-red-500 mb-2">GAME OVER</h2>
          <div className="text-6xl font-bold text-white mb-8">{score}</div>
          <button
            onClick={startGame}
            className="flex items-center space-x-3 px-8 py-4 bg-orange-500 hover:bg-orange-400 transition-all rounded-lg transform hover:scale-105"
          >
            <RefreshCcw size={20} />
            <span>RETRY</span>
          </button>
          <button
            onClick={resetGame}
            className="mt-4 text-slate-500 hover:text-white transition-colors"
          >
            QUIT
          </button>
        </div>
      )}

      {/* 조작 설명 (playing 상태에서 작게 표시) */}
      {status === 'playing' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-8 opacity-40 text-xs">
          <div className="flex flex-col items-center"><span className="p-1 border border-white rounded mb-1">←</span> CLIMB</div>
          <div className="flex flex-col items-center"><span className="p-1 border border-white rounded mb-1">→</span> TURN</div>
        </div>
      )}
    </div>
  );
};

export default App;
