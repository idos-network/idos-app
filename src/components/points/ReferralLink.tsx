import { useUserId } from '@/hooks/useUserId';
import CopyIcon from '../icons/copy';
import { useToast } from '@/hooks/useToast';
import { generateReferralCode } from '@/utils/quests';
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

  return (
    <div className="flex flex-col min-w-[400px] gap-5 bg-neutral-800/60 rounded-[20px] p-6 items-start justify-center border border-neutral-800">
      <div className="flex gap-2 items-center h-8 font-['Inter'] text-sm font-normal text-neutral-400">
        My referral Link
      </div>
      <div className="flex gap-2 p-4 rounded-lg items-center h-12 bg-neutral-800/60 min-w-full justify-between border border-neutral-800">
        <div className="text-base font-light text-neutral-200 font-['Inter']">
          {referralUrl}
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
