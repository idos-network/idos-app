import Spinner from '@/components/Spinner';
import DropdownArrowIcon from '@/components/icons/dropdown-arrow';
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        Error loading leaderboard. Please try again.
      </div>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="text-center p-8 text-gray-600">
        No leaderboard data available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/60 p-6 w-fit">
      <div className="overflow-x-auto">
        <table className="table-fixed text-xs font-['Inter']">
          <thead>
            <tr className="text-left text-neutral-400 text-xs bg-neutral-800 h-[44px]">
              <th className="w-[70px] px-4 font-normal rounded-l-[20px]">
                Rank
              </th>
              <th className="w-[240px] px-4 font-normal">Name</th>
              <th className="w-[110px] px-4 font-normal">Total Points</th>
              <th className="w-[110px] px-4 font-normal text-[#F1A039]">
                Quest Points
              </th>
              <th className="w-[10px] px-4 font-normal">Mindshare</th>
              <th className="w-[155px] px-4 font-normal text-[#EEFF41]">
                <span className="inline-flex items-center gap-2">
                  Social Points
                  <span className="inline-flex items-center h-4 px-2 rounded-xl bg-[#00FFB933] text-aquamarine-400 text-[10px] font-normal">
                    Soon
                  </span>
                </span>
              </th>
              <th className="w-[140px] px-4 font-normal">Total Contribution</th>
              <th className="w-[200px] px-4 font-normal text-[#2CB2FF] rounded-r-[20px]">
                <span className="inline-flex items-center gap-2">
                  Contribution Points
                  <span className="inline-flex items-center h-4 px-2 rounded-xl bg-[#00FFB933] text-aquamarine-400 text-[10px] font-normal">
                    Soon
                  </span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((item, index) => {
              const isLastRow = index === leaderboard.length - 1;
              return (
                <tr
                  key={item.name}
                  className={`font-[Urbanist] text-sm font-medium h-[44px] ${!isLastRow ? 'border-neutral-800 border-b' : ''} text-neutral-400`}
                >
                  <td className="px-4">#{item.position}</td>
                  <td className="px-4 truncate">{item.name}</td>
                  <td className="px-4 font-light text-sm text-neutral-200">
                    <div className="flex items-center">
                      <img
                        src="/idos-points-logo.png"
                        alt="Points"
                        className="w-4 h-4 mr-2"
                      />
                      {item.totalPoints}
                    </div>
                  </td>
                  <td className="px-4">{item.questPoints}</td>
                  <td className="px-4">-</td>
                  <td className="px-4">{item.socialPoints}</td>
                  <td className="px-4">-</td>

                  <td className="px-4">{item.contributionPoints}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {total && totalPages > 1 && (
        <div className="flex font-['Inter'] items-center justify-center gap-2 text-xs text-neutral-300">
          <button
            className={`px-2 py-3 rounded-lg border text-neutral-50 border-neutral-800 flex items-center justify-center ${currentPage === 1 ? 'text-neutral-700 cursor-not-allowed' : 'hover:bg-[#26262666] cursor-pointer'}`}
            disabled={currentPage === 1}
            onClick={() => onPageChange?.(currentPage - 1)}
          >
            <DropdownArrowIcon className="rotate-90" />
          </button>
          {(() => {
            const maxButtons = 5;
            const pages: number[] = [];
            const start = Math.max(
              1,
              Math.min(currentPage - 2, totalPages - maxButtons + 1),
            );
            const end = Math.min(totalPages, start + maxButtons - 1);
            for (let p = start; p <= end; p++) pages.push(p);
            return (
              <div className="flex items-center">
                {start > 1 && (
                  <button
                    className="h-8 px-3 rounded-lg font-light hover:bg-neutral-700 hover:cursor-pointer"
                    onClick={() => onPageChange?.(1)}
                  >
                    1
                  </button>
                )}
                {start > 2 && <span className="px-1">…</span>}
                {pages.map((p) => (
                  <button
                    key={p}
                    className={`h-8 px-3 rounded-lg font-light hover:cursor-pointer ${p === currentPage ? 'bg-neutral-800 text-neutral-100' : 'hover:bg-[#26262666]'}`}
                    onClick={() => onPageChange?.(p)}
                  >
                    {p}
                  </button>
                ))}
                {end < totalPages - 1 && <span className="px-1">…</span>}
                {end < totalPages && (
                  <button
                    className="h-8 px-3 rounded-lg font-light hover:cursor-pointer hover:bg-[#26262666]"
                    onClick={() => onPageChange?.(totalPages)}
                  >
                    {totalPages}
                  </button>
                )}
              </div>
            );
          })()}
          <button
            className={`px-2 py-3 rounded-lg border text-neutral-50 border-neutral-800 flex items-center justify-center ${currentPage >= totalPages ? 'text-neutral-700 cursor-not-allowed' : 'hover:bg-[#26262666] cursor-pointer'}`}
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
          >
            <DropdownArrowIcon className="rotate-270" />
          </button>
        </div>
      )}
    </div>
  );
}
