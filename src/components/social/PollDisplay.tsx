import React, { useState, memo } from 'react';
import { PostWithInteractions } from '../../types/social';

const PollDisplay = ({ poll }: { poll: NonNullable<PostWithInteractions['poll']> }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(poll.user_vote || null);
  const [totalVotes, setTotalVotes] = useState(poll.total_votes);
  const [options, setOptions] = useState(poll.options);

  const handleVote = (optionId: string) => {
    if (selectedOption) return;

    setSelectedOption(optionId);
    setTotalVotes(prev => prev + 1);
    setOptions(prev => prev.map(opt =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
    ));
  };

  return (
    <div className="mt-3 space-y-2">
      {options.map((option) => {
        const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
        const isSelected = selectedOption === option.id;

        return (
          <div key={option.id} className="relative">
            {/* Background Bar */}
            {selectedOption && (
                <div
                    className="absolute inset-0 bg-blue-500/10 rounded-lg transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            )}

            <button
                onClick={() => handleVote(option.id)}
                disabled={!!selectedOption}
                className={`relative w-full text-left px-4 py-3 rounded-lg border transition-all flex justify-between items-center ${
                    isSelected
                        ? 'border-blue-500 text-blue-500'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
            >
                <span className="font-medium">{option.text}</span>
                {selectedOption && (
                    <span className="text-sm font-bold">{percentage}%</span>
                )}
            </button>
          </div>
        );
      })}
      <div className="text-sm text-gray-500 mt-2">
        {totalVotes.toLocaleString()} votes • {selectedOption ? 'Final results' : 'Poll open'}
      </div>
    </div>
  );
};

export default memo(PollDisplay);
