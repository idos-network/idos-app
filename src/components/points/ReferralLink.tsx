import { getUserReferralCount } from '@/api/user';
import { useToast } from '@/hooks/useToast';
import { useUserId } from '@/hooks/useUserId';
import CopyIcon from '@/icons/copy';
import PersonIcon from '@/icons/person';
import { generateReferralCode } from '@/utils/quests';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export default function ReferralLink() {
  const { showToast } = useToast();
  const { userId } = useUserId();

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

  return (
    <div className="flex flex-col w-full max-w-md gap-5 bg-neutral-800/60 rounded-[20px] p-6 items-start justify-center border border-neutral-800">
      <div className="flex items-center justify-between min-h-8 font-['Inter'] text-sm font-normal text-neutral-400 w-full">
        <div className="flex items-center justify-start min-h-8 font-['Inter'] text-sm font-normal text-neutral-400">
          My referral link
        </div>
        <div className="flex items-center justify-end gap-2 min-h-8 font-['Inter'] text-sm font-medium">
          {referralCount.isLoading ? (
            <div className="flex items-center gap-2 text-neutral-500">
              <div className="w-4 h-4 border-2 border-neutral-600 border-t-neutral-400 rounded-full animate-spin" />
              <span>Loading...</span>
            </div>
          ) : referralCount.isError ? (
            <div className="flex items-center gap-2 text-neutral-500">
              <span className="text-xs">⚠</span>
              <span>Unable to load</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <PersonIcon className="text-neutral-400" width="16" height="16" />
              <span
                className={`${
                  referralCount.data === 0
                    ? 'text-neutral-500'
                    : 'text-[#C99BFF]'
                }`}
              >
                {referralCount.data === 0
                  ? 'No referrals yet'
                  : referralCount.data === 1
                    ? '1 referral'
                    : `${referralCount.data} referrals`}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 p-4 rounded-lg items-center h-12 bg-neutral-800/60 min-w-full justify-between border border-neutral-800">
        <div className="text-base font-light text-neutral-200 font-['Inter']">
          {displayUrl}
        </div>
        <button
          className="cursor-pointer"
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
  );
}
