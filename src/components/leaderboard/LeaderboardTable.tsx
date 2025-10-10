import { type LeaderboardEntryData } from '@/api/leaderboard';
import Spinner from '@/components/Spinner';
import DropdownArrowIcon from '@/components/icons/dropdown-arrow';

interface LeaderboardTableProps {
  data: LeaderboardEntryData[];
  isLoading?: boolean;
  error?: any;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  emptyState?: React.ReactNode;
  errorState?: React.ReactNode;
}

export function LeaderboardTable({
  data,
  isLoading = false,
  error,
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  emptyState,
  errorState,
}: LeaderboardTableProps) {
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
        {errorState || 'Error loading leaderboard. Please try again.'}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center p-8 text-gray-600">
        {emptyState || 'No leaderboard data available.'}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/60 p-6 w-fit">
      <div className="overflow-x-auto">
        <table className="table-fixed text-xs font-['Inter'] w-fit">
          <thead>
            <tr className="text-left text-neutral-400 text-xs bg-neutral-800 h-[44px]">
              <th className="w-[70px] px-4 font-normal rounded-l-[20px]">
                Rank
              </th>
              <th className="w-[240px] px-4 font-normal">Name</th>
              <th className="w-[110px] px-4 font-normal text-center">
                Total Points
              </th>
              <th className="w-[110px] px-4 font-normal text-center">
                Referrals
              </th>
              <th className="w-[120px] px-4 font-normal text-[#FFA015] text-center">
                Quest Points
              </th>
              <th className="w-[100px] px-4 font-normal text-center">
                Mindshare
              </th>
              <th className="w-[165px] px-4 font-normal text-[#A0F73C] text-center">
                <span className="inline-flex items-center gap-2">
                  Social Points
                  <span className="inline-flex items-center h-4 px-2 rounded-xl bg-[#00FFB933] text-aquamarine-400 text-[10px] font-normal">
                    Soon
                  </span>
                </span>
              </th>
              <th className="w-[145px] px-4 font-normal text-center">
                Total Contribution
              </th>
              <th className="w-[200px] px-4 font-normal text-[#00B3FF] rounded-r-[20px] text-center">
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
            {data.map((item, index) => {
              const isLastRow = index === data.length - 1;
              return (
                <tr
                  key={item.id}
                  className={`font-[Urbanist] text-sm font-medium h-[44px] ${!isLastRow ? 'border-neutral-800 border-b' : ''} text-neutral-400`}
                >
                  <td className="px-4">
                    {item.rank === 0 ? '-' : `#${item.rank}`}
                  </td>
                  <td className="px-4 truncate">{item.name}</td>
                  <td className="px-4 font-light text-sm text-neutral-200">
                    <div className="flex items-center justify-center">
                      <img
                        src="/idos-points-logo.png"
                        alt="Points"
                        className="w-4 h-4 mr-2"
                      />
                      {item.totalPoints}
                    </div>
                  </td>
                  <td className="px-4 text-center">
                    {item.rank === 0 ? '-' : item.referralCount}
                  </td>
                  <td className="px-4 text-center">
                    {item.questPoints === 0 ? '-' : item.questPoints}
                  </td>
                  <td className="px-4 text-center">
                    {item.relativeMindshare === 0
                      ? '-'
                      : `${(item.relativeMindshare * 100).toFixed(2)}%`}
                  </td>
                  <td className="px-4 text-center">
                    {item.socialPoints === 0 ? '-' : item.socialPoints}
                  </td>
                  <td className="px-4 text-center">-</td>
                  <td className="px-4 text-center">
                    {item.contributionPoints === 0
                      ? '-'
                      : item.contributionPoints}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showPagination && totalPages > 1 && (
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
