import React from 'react';
import { useGameStore } from '../store/gameStore';

const HUD: React.FC = () => {
  const { score, timeLeft, fever } = useGameStore();

  return (
    <div className="absolute top-0 left-0 w-full p-8 z-50 flex flex-col items-center pointer-events-none">
      {/* 타이머 바 - 울트라 디자인 */}
      <div className="w-full max-w-md h-12 relative mb-4">
        {/* 테두리 프레임 (생성된 UI 에셋 사용) */}
        <div className="absolute inset-0 border-4 border-yellow-600 rounded-xl bg-black/40 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <div 
            className={`h-full transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(255,255,255,0.5)] ${fever ? 'bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 animate-pulse' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`}
            style={{ width: `${timeLeft}%` }}
          />
        </div>
        <div className="absolute -top-3 left-4 px-3 py-1 bg-yellow-600 text-[10px] font-black tracking-widest text-black rounded-md">TIME</div>
      </div>

      {/* 실시간 점수 */}
      <div className="text-center">
        <div className="text-sm font-bold text-slate-400 tracking-[0.2em] mb-1">CURRENT SCORE</div>
        <div className="text-7xl font-black text-white italic tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
          {score}
        </div>
      </div>
    </div>
  );
};

export default HUD;
