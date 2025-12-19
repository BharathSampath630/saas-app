import Image from "next/image";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

const StreakCard = ({ currentStreak, longestStreak, lastActivityDate }: StreakCardProps) => {
  const today = new Date().toISOString().split('T')[0];
  const isActiveToday = lastActivityDate === today;
  
  // Calculate if streak is at risk (last activity was not today or yesterday)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  const isStreakAtRisk = lastActivityDate !== today && lastActivityDate !== yesterdayStr;

  return (
    <div className="relative overflow-hidden border border-orange-200 rounded-lg p-6 bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Fire emoji background decoration */}
      <div className="absolute top-2 right-2 text-4xl opacity-20">🔥</div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl">🔥</div>
          <h3 className="text-xl font-bold text-orange-800">Daily Streak</h3>
        </div>
        {isActiveToday && (
          <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
            Active Today!
          </div>
        )}
        {isStreakAtRisk && currentStreak > 0 && (
          <div className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
            At Risk!
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Current Streak */}
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600 mb-1">
            {currentStreak}
          </div>
          <div className="text-sm text-orange-700 font-medium">
            Current Streak
          </div>
          <div className="text-xs text-orange-600 mt-1">
            {currentStreak === 1 ? 'day' : 'days'}
          </div>
        </div>

        {/* Longest Streak */}
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-1">
            {longestStreak}
          </div>
          <div className="text-sm text-yellow-700 font-medium">
            Best Streak
          </div>
          <div className="text-xs text-yellow-600 mt-1">
            {longestStreak === 1 ? 'day' : 'days'}
          </div>
        </div>
      </div>

      {/* Progress indicators */}
      <div className="mt-4 flex justify-center gap-1">
        {Array.from({ length: Math.min(currentStreak, 7) }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-orange-400"
          />
        ))}
        {currentStreak > 7 && (
          <div className="text-xs text-orange-600 ml-1">
            +{currentStreak - 7}
          </div>
        )}
      </div>

      {/* Motivational message */}
      <div className="mt-4 text-center">
        {currentStreak === 0 && (
          <p className="text-sm text-orange-700">
            Complete a lesson to start your streak! 🚀
          </p>
        )}
        {currentStreak > 0 && currentStreak < 7 && (
          <p className="text-sm text-orange-700">
            Keep it up! You're building a great habit! 💪
          </p>
        )}
        {currentStreak >= 7 && currentStreak < 30 && (
          <p className="text-sm text-orange-700">
            Amazing! You're on fire! 🔥
          </p>
        )}
        {currentStreak >= 30 && (
          <p className="text-sm text-orange-700">
            Incredible dedication! You're a learning champion! 🏆
          </p>
        )}
      </div>
    </div>
  );
};

export default StreakCard;