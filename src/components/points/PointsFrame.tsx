import { useUserPoints } from '@/hooks/useUserPoints';

export default function PointsFrame() {
  const { points } = useUserPoints();

  return (
    <div className="flex gap-4 w-full">
      <div className="flex flex-col h-full w-[210px] p-6 items-start justify-start bg-neutral-800/60 rounded-lg border border-neutral-800 gap-4">
        <div className="flex items-center h-8 font-['Inter'] text-sm font-normal text-neutral-400">
          My Total Points
        </div>
        <div className="flex gap-2 items-center h-8">
          <img src="/idos-points-logo.png" alt="Points" className="h-8 w-8" />
          <div className="text-3xl font-medium text-neutral-50">
            {points.totalPoints}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-6 items-start justify-between bg-neutral-800/60 rounded-lg border border-neutral-800 gap-4">
        <div className="flex items-center h-8 font-['Inter'] text-sm font-normal text-neutral-400">
          idOS Points breakdown{' '}
        </div>
        <div className="flex flex-col w-full h-full gap-4">
          {/* Category labels */}
          <div className="flex text-xs">
            <span className="text-[#FF9E7F] font-medium flex-1">
              Quest Points
            </span>
            <span className="text-[#A0F73C] font-medium flex-1">
              Social Points
            </span>
            <span className="text-[#00B3FF] font-medium flex-1">
              Contribution Points
            </span>
          </div>

          {/* Points breakdown bars */}
          <div className="relative w-full h-8 flex items-center">
            {/* Quest Points Bar */}
            <div className="relative flex-1 h-8 bg-gradient-to-r from-[#FF5D2E] to-[#FF9B7B] rounded-full flex items-center justify-start -mr-4">
              <div className="absolute left-2.5 w-3 h-3 bg-[#FAFAFA66] rounded-full">
                {' '}
                <div className="absolute -left-2.5 -top-2.5 w-8 h-8 bg-[#FAFAFA66] rounded-full"></div>
              </div>
              <span className="text-neutral-50 font-['Inter'] text-sm font-medium ml-10">
                {points.questPoints} Points
              </span>
            </div>

            {/* Social Points Bar */}
            <div className="relative flex-1 h-8 bg-gradient-to-r from-[#95F635] to-[#DAFCB9] rounded-full flex items-center justify-start z-10 -mr-4">
              <div className="absolute left-2.5 w-3 h-3 bg-[#09090933] rounded-full">
                {' '}
                <div className="absolute -left-2.5 -top-2.5 w-8 h-8 bg-[#09090933] rounded-full"></div>
              </div>{' '}
              <span className="text-neutral-900 font-['Inter'] text-sm font-medium ml-10">
                {points.socialPoints} Points
              </span>
            </div>

            {/* Contribution Points Bar */}
            <div className="relative flex-1 h-8 bg-gradient-to-r from-[#00B3FF] to-[#0059A5] rounded-full flex items-center justify-start z-10 -mr-4">
              <div className="absolute left-2.5 w-3 h-3 bg-[#FAFAFA33] rounded-full">
                {' '}
                <div className="absolute -left-2.5 -top-2.5 w-8 h-8 bg-[#FAFAFA33] rounded-full"></div>
              </div>
              <span className="text-neutral-50 font-['Inter'] text-sm font-medium ml-10">
                {points.contributionPoints} Points
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
