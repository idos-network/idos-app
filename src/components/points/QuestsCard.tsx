import type { QuestWithStatus } from '@/hooks/useQuests';
import { useQuests } from '@/hooks/useQuests';
import { useMemo, useState } from 'react';
import QuestsModal from './QuestsModal';

interface QuestsCardProps {
  onError?: (error: string) => void;
}

export default function QuestsCard({ onError }: QuestsCardProps) {
  const { quests, isLoading, error } = useQuests();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<QuestWithStatus | null>(
    null,
  );

  const activeQuests = useMemo(() => {
    return quests.filter(
      (quest: QuestWithStatus) => quest.status === 'Available',
    );
  }, [quests]);

  const completedQuests = useMemo(() => {
    return quests.filter(
      (quest: QuestWithStatus) => quest.status === 'Completed',
    );
  }, [quests]);

  const allQuests = useMemo(() => {
    return [...activeQuests, ...completedQuests];
  }, [activeQuests, completedQuests]);

  if (isLoading) return null;

  if (error) {
    onError?.(error.message || 'Failed to load quests');
    return null;
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/60 p-6 w-full">
      {/* Table Section */}
      <div className="flex-grow overflow-x-auto">
        <table className="w-full table-auto text-sm font-['Inter']">
          <thead>
            <tr className="text-left text-neutral-400 text-sm bg-neutral-800 h-[52px]">
              <th className="w-3/5 px-4 font-light rounded-l-[20px]">Quest</th>
              <th className="w-1/5 px-4 font-light">Points</th>
              <th className="w-1/5 px-4 font-light rounded-r-[20px]">Status</th>
            </tr>
          </thead>
          <tbody>
            {allQuests.map((quest, index) => {
              const isLastRow = index === allQuests.length - 1;
              const isCompleted = quest.status === 'Completed';
              return (
                <tr
                  key={quest.id}
                  className={`text-sm font-['Urbanist'] h-[52px] ${!isLastRow ? 'border-neutral-800 border-b' : ''} ${
                    isCompleted
                      ? 'text-neutral-400'
                      : 'text-neutral-200 hover:text-[#C99BFF]'
                  }`}
                >
                  <td
                    className="w-1/3 px-4 cursor-pointer"
                    onClick={() => {
                      setSelectedQuest(quest);
                      setIsModalOpen(true);
                    }}
                  >
                    {quest.title}
                  </td>
                  <td className="w-1/3 px-4 font-medium">
                    <div className="flex items-center">
                      <img
                        src="/idos-points-logo.png"
                        alt="Points"
                        className="w-4 h-4 mr-2"
                      />
                      {quest.pointsReward}
                    </div>
                  </td>
                  <td className="w-2/3 px-4 font-['Inter'] font-normal pr-8">
                    <div className="truncate font-['Inter'] text-neutral-200 flex items-center justify-center gap-3">
                      <span className="flex items-center gap-2 font-normal">
                        {quest.status === 'Completed' ? (
                          <div className="flex text-[13px] font-normal items-center py-[2.5px] px-[5px] rounded-sm bg-[#00FFB933] text-[#00FFB9]">
                            Done
                          </div>
                        ) : quest.isRepeatable === true ? (
                          <div className="flex text-[13px] font-normal items-center py-[2.5px] px-[5px] rounded-sm bg-[#7A7A7A33] text-[#C99BFF]">
                            Ongoing
                          </div>
                        ) : (
                          <div className="flex text-[13px] font-normal items-center py-[2.5px] px-[5px] rounded-sm bg-[#7A7A7A33] text-[#FFBB33]">
                            To do
                          </div>
                        )}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {allQuests.length === 0 && (
              <tr className="text-neutral-400 text-sm h-[52px]">
                <td colSpan={3} className="px-4 text-center">
                  No quests available
                </td>
              </tr>
            )}
            <tr className="text-neutral-400 text-sm h-[52px] border-neutral-800 border-t">
              <td colSpan={3} className="px-4 text-left">
                <div className="inline-flex text-sm font-normal items-center justify-start px-3 rounded-xl bg-[#00FFB933] text-aquamarine-400">
                  More quests coming soon
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedQuest && (
        <QuestsModal
          isOpen={isModalOpen}
          quest={selectedQuest}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedQuest(null);
          }}
        />
      )}
    </div>
  );
}
