import { useIdOSLoginStatus } from '@/hooks/useIdOSHasProfile';
import { useUserPoints } from '@/hooks/useUserPoints';
import { Link } from '@tanstack/react-router';
import { forwardRef } from 'react';

interface PointsHeaderFrameProps {
  highlight?: boolean;
}

const PointsHeaderFrame = forwardRef<HTMLAnchorElement, PointsHeaderFrameProps>(
  ({ highlight = false }, ref) => {
    const { points } = useUserPoints();

    const hasProfile = useIdOSLoginStatus();
    return (
      <Link
        ref={ref}
        to={hasProfile ? '/points' : '/idos-profile'}
        className={`cursor-pointer flex gap-2 h-8 bg-[#1D083E] rounded-lg px-3 items-center justify-center border transition-colors duration-200 ${
          highlight
            ? 'border-[#5A23A7] bg-[#2F1061] drop-shadow-[0px_0px_10px_rgba(116,45,208,1)]'
            : 'border-neutral-800 hover:bg-[#2F1061] hover:border-[#5A23A7]'
        }`}
      >
        <img src="/idos-points-logo.png" alt="Points" className="h-5 w-5" />
        <div className="flex gap-1.5">
          <div className="text-sm font-sesmibold text-neutral-50">{points}</div>
          <div className="text-sm font-semibold text-neutral-50">Points</div>
        </div>
      </Link>
    );
  },
);

PointsHeaderFrame.displayName = 'PointsHeaderFrame';

export default PointsHeaderFrame;
