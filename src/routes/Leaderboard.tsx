import ConnectModal from '@/components/leaderboard/ConnectModal';
import { GeneralLeaderboard } from '@/components/leaderboard/GeneralLeaderboard';
import { LeaderboardTitle } from '@/components/leaderboard/LeaderboardTitle';
import { UserLeaderboard } from '@/components/leaderboard/UserLeaderboard';
import PointsDisclaimer from '@/components/points/PointsDisclaimer';
import SmallPrimaryButton from '@/components/SmallPrimaryButton';
import Spinner from '@/components/Spinner';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useUserId } from '@/hooks/useUserId';
import { useWalletConnector } from '@/hooks/useWalletConnector';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

export function Leaderboard() {
  const { data: userId } = useUserId();
  const { isLoading, error } = useLeaderboard({
    userId,
  });
  const { isConnected } = useWalletConnector();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectingFromLeaderboard, setConnectingFromLeaderboard] =
    useState(false);
  const navigate = useNavigate();
  const wasConnectedRef = useRef(isConnected);
  const [page, setPage] = useState(1);
  const limit = 20;
  const offset = (page - 1) * limit;

  useEffect(() => {
    const wasConnected = wasConnectedRef.current;
    if (!wasConnected && isConnected && connectingFromLeaderboard) {
      navigate({ to: '/idos-profile' });
      setConnectingFromLeaderboard(false);
    }
    wasConnectedRef.current = isConnected;
  }, [isConnected, connectingFromLeaderboard, navigate]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center p-8">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center p-8 text-red-600">
          Error loading leaderboard. Please try again.
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-[max-content] gap-14 justify-center">
          <div className="flex flex-col p-6 rounded-xl bg-[#00382D99] gap-5">
            <div className="flex text-2xl text-neutral-50 font-normal">
              Get started
            </div>
            <div className="flex flex-col gap-10 items-start justify-center">
              <div className="text-base font-['Inter'] text-center text-neutral-400">
                Create an idOS Profile to start completing quests and earning
                points*
              </div>
              <div>
                <SmallPrimaryButton
                  onClick={() => {
                    setConnectingFromLeaderboard(true);
                    setShowConnectModal(true);
                  }}
                >
                  Create idOS Profile
                </SmallPrimaryButton>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <LeaderboardTitle
              title="idOS Points Leaderboard"
              subtitle="Top 20 users"
            />
            <GeneralLeaderboard
              limit={limit}
              offset={offset}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </div>

        <ConnectModal
          isOpen={showConnectModal}
          onClose={() => setShowConnectModal(false)}
        />
        <PointsDisclaimer />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-14">
      <div className="flex flex-col w-full gap-5">
        <LeaderboardTitle
          title="My total idOS Points"
          subtitle="Points Leaderboard"
        />
        <UserLeaderboard />
      </div>
      <div className="flex flex-col w-full gap-5">
        <LeaderboardTitle
          title="idOS Points Leaderboard"
          subtitle="Top 20 users"
        />
        <GeneralLeaderboard
          limit={limit}
          offset={offset}
          onPageChange={(p) => setPage(p)}
        />
      </div>
      <PointsDisclaimer />
    </div>
  );
}
