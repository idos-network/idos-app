import { useUserPoints } from '@/hooks/useUserPoints';
import { Link } from '@tanstack/react-router';
import { forwardRef } from 'react';

const PointsHeaderFrame = forwardRef<HTMLAnchorElement>((_, ref) => {
  const { points } = useUserPoints();

  return (
    <Link
      ref={ref}
      to="/points"
      className="cursor-pointer flex gap-2 h-8 bg-[#1D083E] rounded-lg px-3 items-center justify-center border border-neutral-800 hover:bg-[#2F1061] transition-colors duration-200 hover:border-[#5A23A7]"
    >
      <img src="/idos-points-logo.png" alt="Points" className="h-5 w-5" />
      <div className="flex gap-1.5">
        <div className="text-sm font-semibold text-neutral-50">{points}</div>
        <div className="text-sm font-semibold text-neutral-50">Points</div>
      </div>
    </Link>
  );
});

PointsHeaderFrame.displayName = 'PointsHeaderFrame';

export default PointsHeaderFrame;
