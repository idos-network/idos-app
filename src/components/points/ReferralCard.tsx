import { getUserReferralCount } from '@/api/user';
import { useToast } from '@/hooks/useToast';
import { useUserId } from '@/hooks/useUserId';
import CopyIcon from '@/icons/copy';
import { generateReferralCode } from '@/utils/quests';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export default function ReferralCard() {
  const { showToast } = useToast();
  const { data: userId } = useUserId();

  const referralCode = useMemo(
    () => (userId ? generateReferralCode(userId) : ''),
    [userId],
  );

  const referralUrl = useMemo(
    () => (referralCode ? `${window.location.origin}?ref=${referralCode}` : ''),
    [referralCode],
  );

  const displayUrl = useMemo(
    () => (referralUrl ? referralUrl.replace(/^https?:\/\//, '') : ''),
    [referralUrl],
  );

  const referralCount = useQuery({
    queryKey: ['referralCount', referralCode],
    queryFn: () => getUserReferralCount(referralCode),
    enabled: !!referralCode,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const getMultiplier = (count: number) => {
    if (count >= 1000) return 300;
    if (count >= 100) return 275;
    if (count >= 25) return 250;
    if (count >= 5) return 200;
    return 100;
  };

  const currentMultiplier = referralCount.data
    ? getMultiplier(referralCount.data)
    : 100;
  const currentCount = referralCount.data || 0;

  const getCurrentTier = (count: number) => {
    if (count >= 1000) return 4;
    if (count >= 100) return 3;
    if (count >= 25) return 2;
    if (count >= 5) return 1;
    return 0;
  };

  const currentTier = getCurrentTier(currentCount);

  return (
    <div className="flex flex-col w-full font-['Inter'] max-w-md gap-5 bg-neutral-800/60 rounded-[20px] p-6 items-start justify-start border border-neutral-800">
      {/* My referral Link section */}
      <div className="flex flex-col gap-3 w-full border-b-1 border-neutral-800">
        <div className="text-sm font-light text-neutral-400">
          My referral Link
        </div>
        <div className="flex gap-2 p-4 rounded-lg items-center h-12 bg-neutral-800/60 min-w-full justify-between border border-neutral-800 mb-4">
          <div className="text-base font-light text-neutral-200 font-['Inter'] truncate">
            {displayUrl}
          </div>
          <button
            className="cursor-pointer flex-shrink-0"
            onClick={() => {
              navigator.clipboard.writeText(referralUrl);
              showToast({
                type: 'success',
                message: 'Referral link copied to clipboard',
              });
            }}
          >
            <CopyIcon />
          </button>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="flex gap-3 w-full">
        <div className="flex flex-col gap-2 flex-1 bg-neutral-800/60 rounded-lg p-3 border border-neutral-800">
          <div className="text-sm font-light text-neutral-400">
            Users referred
          </div>
          <div className="text-xl font-medium font-['Urbanist'] text-[#FF9E7F]">
            {referralCount.isLoading ? (
              <div className="w-6 h-6 border-2 border-neutral-600 border-t-[#FF9E7F] rounded-full animate-spin" />
            ) : referralCount.isError ? (
              <span className="text-neutral-500">--</span>
            ) : (
              currentCount
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-1 bg-neutral-800/60 rounded-lg p-3 border border-neutral-800">
          <div className="text-sm font-light text-neutral-400">
            Referral multiplier
          </div>
          <div className="text-xl font-medium font-['Urbanist'] text-[#FF9E7F]">
            {referralCount.isLoading ? (
              <div className="w-6 h-6 border-2 border-neutral-600 border-t-[#FF9E7F] rounded-full animate-spin" />
            ) : referralCount.isError ? (
              <span className="text-neutral-500">--</span>
            ) : (
              `${currentMultiplier}%`
            )}
          </div>
        </div>
      </div>

      {/* Multiplier progression */}
      <div className="flex flex-col gap-4 w-full bg-neutral-800/60 rounded-lg p-4 border border-neutral-800">
        {/* Progress bar */}
        <div className="relative">
          <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-x-[2px] items-center">
            {/* Row 1: Referrals labels */}
            <span className="text-xs font-light text-neutral-400 pb-4">
              Referrals
            </span>
            <span
              className={`text-center text-xs ${currentTier === 0 ? 'text-neutral-50' : 'text-neutral-400'} pb-4`}
            >
              0
            </span>
            <span
              className={`text-center text-xs ${currentTier === 1 ? 'text-neutral-50' : 'text-neutral-400'} pb-4`}
            >
              5
            </span>
            <span
              className={`text-center text-xs ${currentTier === 2 ? 'text-neutral-50' : 'text-neutral-400'} pb-4`}
            >
              25
            </span>
            <span
              className={`text-center text-xs ${currentTier === 3 ? 'text-neutral-50' : 'text-neutral-400'} pb-4`}
            >
              100
            </span>
            <span
              className={`text-center text-xs ${currentTier === 4 ? 'text-neutral-50' : 'text-neutral-400'} pb-4`}
            >
              1000
            </span>

            {/* Row 2: Progress bars */}
            <div></div>
            <div className="relative">
              <div
                className={`h-1.5 rounded-full bg-[#FFC4AF]`}
                style={{
                  border: currentTier === 0 ? '0.5px solid #FDE5E2' : 'none',
                  boxShadow: currentTier === 0 ? '0 0 6px #FF5D2E' : 'none',
                }}
              />
              {currentTier === 0 && (
                <div className="absolute w-0.5 bg-white shadow-lg left-1/2 transform -translate-x-1/2 top-[-5px] bottom-[-5px]" />
              )}
            </div>
            <div className="relative">
              <div
                className={`h-1.5 rounded-full bg-[#FF9E7F]`}
                style={{
                  border: currentTier === 1 ? '0.5px solid #FDE5E2' : 'none',
                  boxShadow: currentTier === 1 ? '0 0 6px #FF5D2E' : 'none',
                }}
              />
              {currentTier === 1 && (
                <div className="absolute w-0.5 bg-white shadow-lg left-1/2 transform -translate-x-1/2 top-[-5px] bottom-[-5px]" />
              )}
            </div>
            <div className="relative">
              <div
                className={`h-1.5 rounded-full bg-[#FF7A50]`}
                style={{
                  border: currentTier === 2 ? '0.5px solid #FDE5E2' : 'none',
                  boxShadow: currentTier === 2 ? '0 0 6px #FF5D2E' : 'none',
                }}
              />
              {currentTier === 2 && (
                <div className="absolute w-0.5 bg-white shadow-lg left-1/2 transform -translate-x-1/2 top-[-5px] bottom-[-5px]" />
              )}
            </div>
            <div className="relative">
              <div
                className={`h-1.5 rounded-full bg-[#FF5D2E]`}
                style={{
                  border: currentTier === 3 ? '0.5px solid #FDE5E2' : 'none',
                  boxShadow: currentTier === 3 ? '0 0 6px #FF5D2E' : 'none',
                }}
              />
              {currentTier === 3 && (
                <div className="absolute w-0.5 bg-white shadow-lg left-1/2 transform -translate-x-1/2 top-[-5px] bottom-[-5px]" />
              )}
            </div>
            <div className="relative">
              <div
                className={`h-1.5 rounded-full bg-[#FF4109]`}
                style={{
                  border: currentTier === 4 ? '0.5px solid #FDE5E2' : 'none',
                  boxShadow: currentTier === 4 ? '0 0 6px #FF5D2E' : 'none',
                }}
              />
              {currentTier === 4 && (
                <div className="absolute w-0.5 bg-white shadow-lg left-1/2 transform -translate-x-1/2 top-[-5px] bottom-[-5px]" />
              )}
            </div>

            {/* Row 3: Multiplier labels */}
            <span className="text-xs font-light text-neutral-400 pt-4">
              Multiplier
            </span>
            <span
              className={`text-center text-xs ${currentTier === 0 ? 'text-neutral-50' : 'text-neutral-400'} pt-4 `}
            >
              100%
            </span>
            <span
              className={`text-center text-xs ${currentTier === 1 ? 'text-neutral-50' : 'text-neutral-400'} pt-4 `}
            >
              200%
            </span>
            <span
              className={`text-center text-xs ${currentTier === 2 ? 'text-neutral-50' : 'text-neutral-400'} pt-4 `}
            >
              250%
            </span>
            <span
              className={`text-center text-xs ${currentTier === 3 ? 'text-neutral-50' : 'text-neutral-400'} pt-4 `}
            >
              275%
            </span>
            <span
              className={`text-center text-xs ${currentTier === 4 ? 'text-neutral-50' : 'text-neutral-400'} pt-4 `}
            >
              300%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
