import React from 'react';
import { useGameStore } from '../store/gameStore';

const StairsRender: React.FC = () => {
  const { stairs } = useGameStore();

  // 계단 데이터 시각화
  // 각 계단마다 상대적인 위치(좌/우)를 계산하여 누적 위치를 구함
  let currentOffset = 0;

  return (
    <div className="relative">
      {stairs.map((dir, index) => {
        // 계단이 전진할 때마다 X 오프셋 변경
        // dir이 1이면 오른쪽으로 이동, 0이면 왼쪽으로 이동
        const stepX = currentOffset * 60;
        const stepY = -index * 40;
        
        // 다음 계단을 위한 오프셋 갱신
        if (dir === 1) currentOffset++;
        else currentOffset--;

        return (
          <div
            key={index}
            className="absolute w-24 h-12 transition-all duration-300 pixelated z-10"
            style={{
              left: `${stepX}px`,
              top: `${stepY}px`,
              transform: 'translate(-50%, -50%)',
              opacity: Math.max(0.1, 1 - index / 25), // 위로 갈수록 사라지는 효과
            }}
          >
            {/* 계단 텍스처 (그라데이션과 쉐도우로 입체감 부여) */}
            <div className={`w-full h-full rounded-sm border-b-4 border-slate-900 shadow-lg ${index % 2 === 0 ? 'bg-gradient-to-r from-slate-200 to-slate-400' : 'bg-gradient-to-r from-slate-300 to-slate-500'}`}>
              <div className="w-full h-2 bg-white/20 rounded-t-sm" />
            </div>
            {/* 발밑 그림자 */}
            <div className="absolute top-12 left-0 w-full h-2 bg-black/20 blur-[1px]" />
          </div>
        );
      })}
    </div>
  );
};

export default StairsRender;
