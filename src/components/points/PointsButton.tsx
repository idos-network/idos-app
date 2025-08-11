import { useCompleteQuest } from '@/hooks/useCompleteQuest';
import { useUserId } from '@/hooks/useUserId';
import { useUserPoints } from '@/hooks/useUserPoints';

export default function PointsButton() {
  const { userId } = useUserId();
  const { refetch } = useUserPoints();
  const { completeQuest } = useCompleteQuest();

  const handleClick = async () => {
    if (!userId) {
      console.error('User ID is not available');
      return;
    }

    try {
      await completeQuest(userId, 'referral_program');
      refetch();
      console.log('Quest completed successfully');
    } catch (error) {
      console.error('Failed to complete quest:', error);
    }
  };

  return (
    <button
      className="bg-aquamarine-400 text-neutral-950 hover:bg-aquamarine-600"
      onClick={handleClick}
      disabled={!userId}
    >
      <span>Referral Program</span>
    </button>
  );
}
