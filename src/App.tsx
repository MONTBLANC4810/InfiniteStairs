import React, { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import GameBoard from './components/GameBoard';
import HUD from './components/HUD';
import { Trophy, Play, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const { status, score, maxCombo, startGame, resetGame, tick, fever } = useGameStore();

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
    <div className={`game-container font-game flex flex-col items-center justify-center overflow-hidden text-white transition-colors duration-500 ${fever ? 'bg-red-950' : 'bg-[#0f172a]'}`}>
      
      {status === 'idle' && (
        <div className="z-50 flex flex-col items-center space-y-12 animate-fadeIn p-6">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-orange-400 to-red-600 drop-shadow-2xl mb-2 italic">
              INFINITE<br/>STAIRS
            </h1>
            <div className="text-blue-400 text-sm tracking-[0.3em] font-bold">PREMIUM EDITION</div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <button
              onClick={startGame}
              className="relative flex items-center space-x-4 px-16 py-8 bg-black rounded-xl pixel-border hover:bg-slate-900 transition-all transform hover:scale-105 active:scale-95"
            >
              <Play fill="currentColor" size={32} className="text-yellow-400" />
              <span className="text-3xl font-bold tracking-widest uppercase">Start Game</span>
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-slate-400 text-xs animate-pulse">PC KEYBOARD CONTROLS</div>
            <div className="flex gap-4">
              <span className="px-3 py-1 bg-slate-800 rounded border border-slate-700 text-[10px]">Left Arrow: CLIMB</span>
              <span className="px-3 py-1 bg-slate-800 rounded border border-slate-700 text-[10px]">Right Arrow: TURN</span>
            </div>
          </div>
        </div>
      )}

      {status === 'playing' && (
        <>
          <HUD />
          <GameBoard />
        </>
      )}

      {status === 'gameover' && (
        <div className="z-50 flex flex-col items-center p-12 bg-black/90 backdrop-blur-xl rounded-[2rem] pixel-border animate-float border-2 border-red-500/30">
          <Trophy className="text-yellow-400 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" size={80} />
          <h2 className="text-3xl font-black text-red-500 mb-2 tracking-tighter">FINAL SCORE</h2>
          <div className="text-8xl font-black text-white mb-2 tracking-tighter drop-shadow-lg">
            {score}
          </div>
          <div className="text-slate-400 text-sm mb-10 flex items-center gap-2">
             BEST COMBO <span className="text-yellow-400 font-bold">{maxCombo}</span>
          </div>

          <div className="flex flex-col w-full gap-4">
            <button
              onClick={startGame}
              className="w-full flex items-center justify-center space-x-3 px-10 py-5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 transition-all rounded-xl transform hover:scale-105 shadow-xl"
            >
              <RefreshCcw size={24} strokeWidth={3} />
              <span className="text-xl font-bold italic underline-offset-4 decoration-2">TRY AGAIN</span>
            </button>
            <button
              onClick={resetGame}
              className="w-full py-3 text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
