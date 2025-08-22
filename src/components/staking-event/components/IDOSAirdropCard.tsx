import InfoIcon from '@/components/icons/info';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export function IDOSAirdropCard() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [tooltipText, setTooltipText] = useState<string>('');

  return (
    <div
      className="bg-neutral-800/60 rounded-[20px] border border-neutral-800 p-6 min-w-[250px] w-fit space-y-4 bg-right bg-no-repeat relative"
      style={{
        backgroundImage: 'url(/airdrop-mask.png)',
        backgroundPosition: '10% 25%',
        backgroundSize: '150% 150%',
      }}
    >
      <div className="flex items-center gap-2 text-neutral-600">
        <div className="font-['Inter'] text-sm font-light">
          Expected IDOS airdrop*
        </div>
        <div className="relative">
          <button
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltipPosition({
                x: rect.left + rect.width / 2,
                y: rect.bottom + 8,
              });
              setTooltipText(
                'Based on current rates and lock periods. The final amount of IDOS will be calculated when the Staking Event finishes in Oct. 31, 2025.',
              );
              setShowTooltip(true);
            }}
            onMouseLeave={() => {
              setShowTooltip(false);
              setTooltipPosition(null);
              setTooltipText('');
            }}
            className="flex items-center text-neutral-400 hover:text-neutral-300 transition-colors"
          >
            <InfoIcon className="text-neutral-600 w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="text-neutral-950 text-[28px] leading-[36px] font-normal">
        {/* TODO: calculate value */}
        18,780.25 IDOS
      </div>
      {/* Tooltip rendered outside component using portal */}
      {showTooltip &&
        tooltipPosition &&
        createPortal(
          <div
            className="fixed z-50 bg-neutral-800 rounded-lg p-4 text-neutral-200 drop-shadow-[0_0_10px_rgba(0,0,0,0.7)] w-[356px] pointer-events-none"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translateX(5%)',
            }}
          >
            <div className="text-sm text-neutral-400">{tooltipText}</div>
          </div>,
          document.body,
        )}
    </div>
  );
}
