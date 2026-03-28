import React from 'react';
import { useGameStore } from '../store/gameStore';

const HUD: React.FC = () => {
  const { score, timeLeft } = useGameStore();

  // 타임 바 색상 결정
  const barColor = timeLeft > 50 ? 'bg-green-500' : timeLeft > 20 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="absolute top-0 left-0 w-full p-8 z-30 flex flex-col items-center pointer-events-none">
      {/* 점수 표시 */}
      <div className="text-5xl font-bold mb-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
        {score}
      </div>

      {/* 타이머 게이지 */}
      <div className="w-64 h-6 bg-slate-800 rounded-full p-1 border-2 border-slate-700 overflow-hidden shadow-lg">
        <div 
          className={`h-full ${barColor} transition-all duration-100 ease-linear rounded-full`}
          style={{ width: `${timeLeft}%` }}
        >
          {/* 빛 효과 */}
          <div className="w-full h-1 bg-white/30 rounded-full mt-1"></div>
        </div>
      </div>
    </div>
  );
};

export default HUD;
