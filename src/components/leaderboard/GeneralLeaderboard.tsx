import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useMemo } from 'react';

interface GeneralLeaderboardProps {
  limit?: number;
  offset?: number;
  onPageChange?: (page: number) => void;
}

export function GeneralLeaderboard({
  limit = 5,
  offset = 0,
  onPageChange,
}: GeneralLeaderboardProps) {
  const { leaderboard, total, isLoading, error } = useLeaderboard({
    limit,
    offset,
  });

  const currentPage = useMemo(
    () => Math.floor(offset / limit) + 1,
    [offset, limit],
  );
  const totalPages = useMemo(
    () => (total ? Math.max(1, Math.ceil(total / limit)) : 1),
    [total, limit],
  );

  return (
    <LeaderboardTable
      data={leaderboard || []}
      isLoading={isLoading}
      error={error}
      showPagination={!!total && totalPages > 1}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
