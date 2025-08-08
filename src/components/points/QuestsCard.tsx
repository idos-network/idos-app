import type { QuestWithStatus } from '@/hooks/useQuests';
import { useQuests } from '@/hooks/useQuests';
import { useMemo } from 'react';

interface QuestsCardProps {
  onError?: (error: string) => void;
}

export default function QuestsCard({ onError }: QuestsCardProps) {
  const { quests, isLoading, error } = useQuests();

  const activeQuests = useMemo(() => {
    return quests.filter(
      (quest: QuestWithStatus) => quest.status === 'Available',
    );
  }, [quests]);

  if (isLoading) return null;

  if (error) {
    onError?.(error.message || 'Failed to load quests');
    return null;
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/60 p-6 w-full">
      {/* Header Section */}
      <div className="flex">
        <h1 className="font-normal text-xl text-neutral-50">Active Quests</h1>
      </div>

      {/* Table Section */}
      <div className="flex-grow overflow-x-auto">
        <table className="w-full table-auto text-sm font-['Inter']">
          <thead>
            <tr className="text-left text-neutral-400 text-sm bg-neutral-800 h-[52px]">
              <th className="w-4/5 px-4 font-normal rounded-l-[20px]">Quest</th>
              <th className="w-1/5 px-4 font-normal rounded-r-[20px]">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {activeQuests.map((quest, index) => {
              const isLastRow = index === activeQuests.length - 1;
              return (
                <tr
                  key={quest.id}
                  className={`text-neutral-200 text-base h-[52px] ${!isLastRow ? 'border-neutral-800 border-b' : ''}`}
                >
                  <td className="w-4/5 px-4">{quest.title}</td>
                  <td className="w-1/5 px-4 font-medium text-neutral-200">
                    <div className="flex items-center">
                      <img
                        src="/idos-points-logo.png"
                        alt="Points"
                        className="w-4 h-4 mr-2"
                      />
                      {quest.pointsReward}
                    </div>
                  </td>
                </tr>
              );
            })}
            {activeQuests.length === 0 && (
              <tr className="text-neutral-400 text-base h-[52px]">
                <td colSpan={2} className="px-4 text-center">
                  No active quests available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
