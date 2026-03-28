import React from 'react';
import { useGameStore } from '../store/gameStore';
import type { Direction } from '../store/gameStore';

const StairsRender: React.FC = () => {
  const { stairs, climbCount } = useGameStore();

  // 계단 그리기 로직
  // 누적 좌표를 계산하여 각 계단을 배치
  let currentX = 0;
  let currentY = 0;

  return (
    <div className="relative">
      {/* 초기 발판 */}
      <div 
        className="absolute w-24 h-10 bg-slate-700 border-2 border-slate-600 rounded-sm"
        style={{ transform: 'translate(-50%, 0)', left: '50%', bottom: '40px' }}
      ></div>

      {/* 동적 생성 계단 */}
      {stairs.map((dir, index) => {
        // index 0이 현재 밟아야 할 계단
        // 누적 위치 계산 (실제 게임 화면에서는 아래에서 위로 쌓임)
        if (dir === 1) currentX += 40;
        else currentX -= 40;
        currentY -= 40;

        return (
          <div
            key={`${climbCount}-${index}`}
            className="absolute w-20 h-8 transition-opacity duration-300"
            style={{
              left: `calc(50% + ${currentX}px)`,
              bottom: `${Math.abs(currentY) + 40}px`,
              transform: 'translateX(-50%)',
              backgroundColor: index < 5 ? '#f87171' : index < 10 ? '#fbbf24' : '#60a5fa',
              boxShadow: '0 4px 0 rgba(0,0,0,0.3)',
              borderRadius: '2px',
            }}
          >
            {/* 계단 장식 */}
            <div className="w-full h-1 bg-white/20"></div>
          </div>
        );
      })}
    </div>
  );
};

export default StairsRender;
