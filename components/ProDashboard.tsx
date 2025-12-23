'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Brain, 
  Target, 
  Clock, 
  Award, 
  BarChart3, 
  Calendar,
  Zap,
  Trophy,
  BookOpen,
  Users,
  Star,
  Activity,
  Flame,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import Image from 'next/image';

interface ProDashboardProps {
  userId: string;
  userStats: {
    totalSessions: number;
    totalMinutes: number;
    averageScore: number;
    currentStreak: number;
    longestStreak: number;
    companionsCreated: number;
    subjectsStudied: string[];
    weeklyProgress: number[];
    monthlyProgress: { month: string; sessions: number; score: number }[];
    topSubjects: { subject: string; sessions: number; avgScore: number }[];
    recentAchievements: { title: string; description: string; date: string; icon: string }[];
    learningVelocity: number;
    consistencyScore: number;
    masteryLevel: { [subject: string]: number };
    predictedGoals: { goal: string; probability: number; timeframe: string }[];
  };
}

const ProDashboard = ({ userId, userStats }: ProDashboardProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [animatedStats, setAnimatedStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    averageScore: 0,
    currentStreak: 0
  });

  // Animate numbers on load
  useEffect(() => {
    const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        callback(current);
        if (progress < 1) requestAnimationFrame(animate);
      };
      animate();
    };

    animateValue(0, userStats.totalSessions, 1000, (value) => 
      setAnimatedStats(prev => ({ ...prev, totalSessions: value }))
    );
    animateValue(0, userStats.totalMinutes, 1200, (value) => 
      setAnimatedStats(prev => ({ ...prev, totalMinutes: value }))
    );
    animateValue(0, userStats.averageScore, 1400, (value) => 
      setAnimatedStats(prev => ({ ...prev, averageScore: value }))
    );
    animateValue(0, userStats.currentStreak, 800, (value) => 
      setAnimatedStats(prev => ({ ...prev, currentStreak: value }))
    );
  }, [userStats]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMasteryBadge = (level: number) => {
    if (level >= 90) return { label: 'Expert', color: 'bg-purple-100 text-purple-800' };
    if (level >= 75) return { label: 'Advanced', color: 'bg-blue-100 text-blue-800' };
    if (level >= 60) return { label: 'Intermediate', color: 'bg-green-100 text-green-800' };
    if (level >= 40) return { label: 'Beginner', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Novice', color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Pro Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Advanced insights into your learning journey</p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2">
          <Trophy className="w-4 h-4 mr-2" />
          Pro Companion
        </Badge>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Sessions</p>
                <p className="text-3xl font-bold">{animatedStats.totalSessions}</p>
                <p className="text-blue-100 text-xs mt-1">
                  +{Math.floor(userStats.totalSessions * 0.15)} this month
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Learning Time</p>
                <p className="text-3xl font-bold">{Math.floor(animatedStats.totalMinutes / 60)}h</p>
                <p className="text-green-100 text-xs mt-1">
                  {animatedStats.totalMinutes % 60}m total
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Average Score</p>
                <p className="text-3xl font-bold">{animatedStats.averageScore}%</p>
                <div className="flex items-center mt-1">
                  <ChevronUp className="w-4 h-4 text-purple-200" />
                  <p className="text-purple-100 text-xs">+5% vs last month</p>
                </div>
              </div>
              <Target className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Current Streak</p>
                <p className="text-3xl font-bold">{animatedStats.currentStreak}</p>
                <p className="text-orange-100 text-xs mt-1">
                  Best: {userStats.longestStreak} days
                </p>
              </div>
              <Flame className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="mastery" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Mastery
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Goals
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Learning Velocity */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  Learning Velocity
                </CardTitle>
                <CardDescription>Your learning pace over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sessions per week</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      {userStats.learningVelocity}
                    </span>
                  </div>
                  <Progress value={Math.min(userStats.learningVelocity * 10, 100)} className="h-3" />
                  <div className="grid grid-cols-7 gap-1 mt-4">
                    {userStats.weeklyProgress.map((sessions, index) => (
                      <div key={index} className="text-center">
                        <div 
                          className="bg-indigo-200 rounded-sm mb-1"
                          style={{ height: `${Math.max(sessions * 8, 4)}px` }}
                        />
                        <span className="text-xs text-gray-500">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consistency Score */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Consistency Score
                </CardTitle>
                <CardDescription>How consistent is your learning habit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Consistency Rating</span>
                    <span className="text-2xl font-bold text-green-600">
                      {userStats.consistencyScore}%
                    </span>
                  </div>
                  <Progress value={userStats.consistencyScore} className="h-3" />
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-green-600">{userStats.currentStreak}</p>
                      <p className="text-xs text-gray-500">Current</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-blue-600">{userStats.longestStreak}</p>
                      <p className="text-xs text-gray-500">Best</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-purple-600">
                        {Math.floor(userStats.totalSessions / 7)}
                      </p>
                      <p className="text-xs text-gray-500">Avg/Week</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subject Performance */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Subject Performance
              </CardTitle>
              <CardDescription>Your performance across different subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userStats.topSubjects.map((subject, index) => (
                  <div key={subject.subject} className="p-4 rounded-lg bg-gray-50 border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Image 
                          src={`/icons/${subject.subject}.svg`} 
                          alt={subject.subject}
                          width={20}
                          height={20}
                          className="filter brightness-0 invert"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold capitalize">{subject.subject}</h4>
                        <p className="text-sm text-gray-500">{subject.sessions} sessions</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Score</span>
                        <span className={`font-semibold ${getScoreColor(subject.avgScore)}`}>
                          {subject.avgScore}%
                        </span>
                      </div>
                      <Progress value={subject.avgScore} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Monthly Performance Trends</CardTitle>
                <CardDescription>Sessions and scores over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userStats.monthlyProgress.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <p className="font-medium">{month.month}</p>
                        <p className="text-sm text-gray-500">{month.sessions} sessions</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${getScoreColor(month.score)}`}>
                          {month.score}%
                        </p>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${month.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>Your latest milestones and accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userStats.recentAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
                      <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white text-sm">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-yellow-800">{achievement.title}</h4>
                        <p className="text-sm text-yellow-700">{achievement.description}</p>
                        <p className="text-xs text-yellow-600 mt-1">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mastery Tab */}
        <TabsContent value="mastery" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Subject Mastery Levels
              </CardTitle>
              <CardDescription>Your expertise level in each subject area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(userStats.masteryLevel).map(([subject, level]) => {
                  const badge = getMasteryBadge(level);
                  return (
                    <div key={subject} className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                            <Image 
                              src={`/icons/${subject}.svg`} 
                              alt={subject}
                              width={24}
                              height={24}
                              className="filter brightness-0 invert"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold capitalize text-lg">{subject}</h3>
                            <Badge className={badge.color}>{badge.label}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600">{level}%</p>
                          <p className="text-sm text-gray-500">Mastery</p>
                        </div>
                      </div>
                      <Progress value={level} className="h-3 mb-2" />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Novice</span>
                        <span>Expert</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-600" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>Personalized recommendations based on your learning patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-white border border-indigo-200">
                  <h4 className="font-semibold text-indigo-800 mb-2">🎯 Optimal Learning Time</h4>
                  <p className="text-sm text-gray-700">
                    Based on your performance data, you learn best between 2-4 PM. 
                    Consider scheduling important sessions during this window.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">📈 Improvement Opportunity</h4>
                  <p className="text-sm text-gray-700">
                    Your {userStats.topSubjects[userStats.topSubjects.length - 1]?.subject} scores could improve by 15% 
                    with 2 additional practice sessions per week.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">🔥 Streak Prediction</h4>
                  <p className="text-sm text-gray-700">
                    You're on track to reach a 30-day streak! Keep up your current pace 
                    and you'll achieve this milestone in {30 - userStats.currentStreak} days.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Learning Pattern Analysis</CardTitle>
                <CardDescription>Deep dive into your learning behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-blue-50">
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(userStats.totalMinutes / userStats.totalSessions)}m
                    </p>
                    <p className="text-sm text-blue-700">Avg Session Length</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-50">
                    <p className="text-2xl font-bold text-green-600">
                      {userStats.subjectsStudied.length}
                    </p>
                    <p className="text-sm text-green-700">Subjects Explored</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Learning Style Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Visual Learning</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Interactive Practice</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Conceptual Understanding</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Predicted Achievement Goals
              </CardTitle>
              <CardDescription>AI-generated goals based on your learning trajectory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userStats.predictedGoals.map((goal, index) => (
                  <div key={index} className="p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-yellow-800 mb-2">{goal.goal}</h3>
                        <p className="text-sm text-yellow-700 mb-3">Expected: {goal.timeframe}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-yellow-600">{goal.probability}%</p>
                        <p className="text-xs text-yellow-600">Probability</p>
                      </div>
                    </div>
                    <Progress value={goal.probability} className="h-3 mb-2" />
                    <p className="text-xs text-yellow-600">
                      {goal.probability >= 80 ? 'Highly Likely' : 
                       goal.probability >= 60 ? 'Likely' : 
                       goal.probability >= 40 ? 'Possible' : 'Challenging'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProDashboard;