import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useUserId } from '@/hooks/useUserId';
import Spinner from '@/components/Spinner';
import InfoIcon from '@/components/icons/info';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function MindshareCard() {
  const { data: userId } = useUserId();
  const { userPosition, isLoading, error } = useLeaderboard({
    userId,
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const tooltipText =
    'Mindshare data is provided by WallChain. By linking your X account to the idOS App, your X handle will publicly be associated with your points on the idOS Leaderboard. Your wallet address is still private.';

  const handleTooltipMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width,
      y: rect.bottom + 8,
    });
    setShowTooltip(true);
  };

  const handleTooltipMouseLeave = () => {
    setShowTooltip(false);
    setTooltipPosition(null);
  };

  const renderCard = (mindshareValue: string) => (
    <div className="flex flex-col w-[200px] h-[98px] gap-2 bg-neutral-800/60 rounded-lg p-3 pt-5 border border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="text-sm font-light text-neutral-400">
          idOS Mindshare
        </div>
        <button
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          className="flex items-center text-neutral-400 hover:text-neutral-300 transition-colors"
        >
          <InfoIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="text-xl font-medium font-['Urbanist'] text-[#A0F73C]">
        {mindshareValue}
      </div>
      {showTooltip &&
        tooltipPosition &&
        createPortal(
          <div
            className="fixed z-50 bg-neutral-800 rounded-lg p-4 text-neutral-200 drop-shadow-[0_0_10px_rgba(0,0,0,0.7)] w-[420px] pointer-events-none"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
            }}
          >
            <div className="text-sm text-neutral-400">{tooltipText}</div>
          </div>,
          document.body,
        )}
    </div>
  );

  if (isLoading) {
    return <Spinner height="h-10" width="w-10" />;
  }

  if (error) {
    return <div className="text-red-500">Error loading mindshare points</div>;
  }

  const mindshareValue = userPosition?.relativeMindshare
    ? `${(userPosition.relativeMindshare * 100).toFixed(2)}%`
    : '-';

  return renderCard(mindshareValue);
}
