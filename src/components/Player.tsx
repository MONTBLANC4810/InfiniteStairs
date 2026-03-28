import React from 'react';
import { useGameStore } from '../store/gameStore';

const Player: React.FC = () => {
  const { playerDirection, climbCount } = useGameStore();

  // 플레이어의 현재 X 좌표 계산
  // 계단이 1(오른쪽)이면 x+40, 0(왼쪽)이면 x-40
  // 실제 위치는 climbCount 시점의 계단 누적합이 필요하지만, 
  // 여기서는 단순히 현재 바라보는 방향에 따른 flip 효과만 먼저 구현
  
  return (
    <div 
      className="absolute bottom-0 left-0 w-12 h-16 transition-all duration-100 ease-out z-10"
      style={{
        transform: `translate(-50%, -${climbCount * 40}px) scaleX(${playerDirection === 1 ? 1 : -1})`,
        bottom: '80px', // 초기 오프셋
        left: '50%',    // 화면 중앙 기준
      }}
    >
      {/* 캐릭터 바디 (임시 픽셀 표현) */}
      <div className="w-full h-full bg-yellow-400 rounded-sm relative flex flex-col items-center">
        {/* 눈 */}
        <div className="flex space-x-2 mt-3">
          <div className="w-2 h-2 bg-black rounded-full"></div>
          <div className="w-2 h-2 bg-black rounded-full"></div>
        </div>
        {/* 입 */}
        <div className="w-4 h-1 bg-red-600 mt-2"></div>
        
        {/* 다리 애니메이션 (홀수/짝수 climbCount에 따라) */}
        <div className="absolute -bottom-2 flex space-x-4">
          <div className={`w-3 h-4 bg-blue-500 ${climbCount % 2 === 0 ? 'translate-y-1' : ''}`}></div>
          <div className={`w-3 h-4 bg-blue-500 ${climbCount % 2 !== 0 ? 'translate-y-1' : ''}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Player;
