import { UserAnalytics } from './actions/analytics.actions';

export const generateDemoAnalytics = (userId: string): UserAnalytics => {
  return {
    totalSessions: 127,
    totalMinutes: 3810, // 63.5 hours
    averageScore: 87,
    currentStreak: 12,
    longestStreak: 28,
    companionsCreated: 15,
    subjectsStudied: ['maths', 'science', 'coding', 'language', 'history'],
    weeklyProgress: [2, 3, 1, 4, 2, 3, 2], // Last 7 days
    monthlyProgress: [
      { month: 'Jul 2024', sessions: 18, score: 82 },
      { month: 'Aug 2024', sessions: 22, score: 85 },
      { month: 'Sep 2024', sessions: 25, score: 88 },
      { month: 'Oct 2024', sessions: 28, score: 86 },
      { month: 'Nov 2024', sessions: 21, score: 89 },
      { month: 'Dec 2024', sessions: 13, score: 91 }
    ],
    topSubjects: [
      { subject: 'coding', sessions: 45, avgScore: 92 },
      { subject: 'maths', sessions: 38, avgScore: 85 },
      { subject: 'science', sessions: 25, avgScore: 88 },
      { subject: 'language', sessions: 12, avgScore: 83 },
      { subject: 'history', sessions: 7, avgScore: 79 }
    ],
    recentAchievements: [
      {
        title: 'Streak Master',
        description: 'Achieved 12-day learning streak!',
        date: 'Dec 23, 2024',
        icon: '🔥'
      },
      {
        title: 'Code Warrior',
        description: 'Completed 45 coding sessions with 92% average!',
        date: 'Dec 20, 2024',
        icon: '💻'
      },
      {
        title: 'Century Club',
        description: 'Reached 100+ total learning sessions!',
        date: 'Dec 15, 2024',
        icon: '💯'
      },
      {
        title: 'Companion Creator',
        description: 'Created 15 unique learning companions!',
        date: 'Dec 10, 2024',
        icon: '🎓'
      }
    ],
    learningVelocity: 17, // sessions per week
    consistencyScore: 85,
    masteryLevel: {
      'coding': 95,
      'maths': 82,
      'science': 78,
      'language': 65,
      'history': 58
    },
    predictedGoals: [
      {
        goal: 'Achieve 30-day learning streak',
        probability: 78,
        timeframe: '18 days'
      },
      {
        goal: 'Reach 90% average quiz score',
        probability: 85,
        timeframe: '2-3 weeks'
      },
      {
        goal: 'Complete 200 total sessions',
        probability: 92,
        timeframe: '6-8 weeks'
      },
      {
        goal: 'Master History (85%+ average)',
        probability: 65,
        timeframe: '1-2 months'
      }
    ]
  };
};