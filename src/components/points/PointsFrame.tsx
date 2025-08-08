import { useUserPoints } from '@/hooks/useUserPoints';

export default function PointsFrame() {
  const { points } = useUserPoints();

  return (
    <div className="bg-gradient-to-r from-[#562391] to-[#262626] rounded-[20px] p-[0.5px] w-full">
      <div className="flex flex-col bg-gradient-to-r from-[#120428] to-[#2F1061B2] rounded-[20px] h-full p-6 pb-8 items-start justify-between">
        <div className="flex items-center h-8 font-['Inter'] text-sm font-normal text-neutral-200">
          My Total Points
        </div>
        <div className="flex gap-2 items-center h-8">
          <img src="/idos-points-logo.png" alt="Points" className="h-8 w-8" />
          <div className="text-3xl font-medium text-neutral-50">{points}</div>
        </div>
      </div>
    </div>
  );
}
