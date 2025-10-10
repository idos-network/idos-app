import { useUserPoints } from '@/hooks/useUserPoints';

export default function PointsFrame() {
  const { points } = useUserPoints();

  return (
    <div className="flex gap-4 w-full">
      <div className="flex flex-col h-full w-[210px] p-6 items-start bg-neutral-800/60 rounded-lg border border-neutral-800 gap-8">
        <div className="flex items-center font-['Inter'] text-sm font-normal text-neutral-400">
          My Total Points
        </div>
        <div className="flex gap-2 items-center h-8">
          <img src="/idos-points-logo.png" alt="Points" className="h-8 w-8" />
          <div className="text-3xl font-medium text-neutral-50">
            {points.totalPoints}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-6 items-start bg-neutral-800/60 rounded-lg border border-neutral-800 gap-4">
        <div className="flex items-center font-['Inter'] text-sm font-normal text-neutral-400">
          idOS Points breakdown{' '}
        </div>
        <div className="flex flex-col w-full h-full gap-4">
          {/* Category labels */}
          <div className="flex text-xs gap-3">
            <span className="text-[#FFA015] font-medium flex-1">
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
          <div className="relative w-full h-8 flex items-center gap-3">
            {/* Quest Points Bar */}
            <div className="relative flex-1 h-8 bg-gradient-to-r from-[#F1A039] to-[#FFD04A] rounded-full flex items-center justify-start">
              <div className="absolute left-2.5 w-3 h-3 bg-[#09090933] rounded-full">
                {' '}
                <div className="absolute -left-2 -top-2 w-7 h-7 bg-[#09090933] rounded-full"></div>
              </div>
              <span className="text-neutral-900 font-['Inter'] text-sm font-medium ml-10">
                {points.questPoints} Points
              </span>
            </div>

            {/* Social Points Bar */}
            <div className="relative flex-1 h-8 bg-gradient-to-r from-[#EDFF38] to-[#F8FDB8] rounded-full flex items-center justify-start">
              <div className="absolute left-2.5 w-3 h-3 bg-[#09090933] rounded-full">
                {' '}
                <div className="absolute -left-2 -top-2 w-7 h-7 bg-[#09090933] rounded-full"></div>
              </div>{' '}
              <span className="text-neutral-900 font-['Inter'] text-sm font-medium ml-10">
                {/* TODO: Update this when social points are implemented */}
                {points.socialPoints === 0
                  ? '-'
                  : `${points.socialPoints} Points`}{' '}
              </span>
            </div>

            {/* Contribution Points Bar */}
            <div className="relative flex-1 h-8 bg-gradient-to-r from-[#2CB2FF] to-[#AEE5FF] rounded-full flex items-center justify-start">
              <div className="absolute left-2.5 w-3 h-3 bg-[#FAFAFA33] rounded-full">
                {' '}
                <div className="absolute -left-2 -top-2 w-7 h-7 bg-[#FAFAFA66] rounded-full"></div>
              </div>
              <span className="text-neutral-50 font-['Inter'] text-sm font-medium ml-10">
                {/* TODO: Update this when contribution points are implemented */}
                {points.contributionPoints === 0
                  ? '-'
                  : `${points.contributionPoints} Points`}{' '}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
