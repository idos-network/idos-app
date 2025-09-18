import ConnectModal from '@/components/leaderboard/ConnectModal';
import { GeneralLeaderboard } from '@/components/leaderboard/GeneralLeaderboard';
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
    limit: 5,
    offset: 0,
  });
  const { isConnected } = useWalletConnector();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectingFromLeaderboard, setConnectingFromLeaderboard] =
    useState(false);
  const navigate = useNavigate();
  const wasConnectedRef = useRef(isConnected);

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
        <div className="flex items-start gap-8">
          <div className="w-[599px] p-6 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="flex flex-col gap-4 items-center justify-center">
              <div className="text-base text-center text-neutral-300">
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
          <div className="flex-1">
            <GeneralLeaderboard limit={5} offset={0} />
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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <UserLeaderboard />
      <GeneralLeaderboard limit={5} offset={0} />
      <PointsDisclaimer />
    </div>
  );
}
