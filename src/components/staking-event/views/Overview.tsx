import SmallSecondaryButton from '@/components/SmallSecondaryButton';
import { useNavigate } from '@tanstack/react-router';

export function Overview() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <h1>Staking Event Overview</h1>
      <p>This is the overview page for the staking event.</p>
      <div className="flex gap-4">
        <SmallSecondaryButton
          onClick={() => navigate({ to: '/staking-event/stake' })}
        >
          Stake
        </SmallSecondaryButton>
        <SmallSecondaryButton
          onClick={() => navigate({ to: '/staking-event/my-stakings' })}
        >
          My Stakings
        </SmallSecondaryButton>
      </div>
    </div>
  );
}
