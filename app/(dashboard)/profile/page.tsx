"use client"

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setUser, logout } from "@/features/auth";
import {
  User,
  Mail,
  Calendar,
  BarChart3,
  Users,
  Settings,
  Edit3,
  Shield,
  Bell,
  LogOut,
  Award,
  TrendingUp,
  Eye,
  Link2,
  Download,
  QrCode,
  Star,
  Trophy,
  Clock,
  Zap,
  X,
  Github,
  Twitter,
  Chrome,
  Facebook,
  CheckCircle,
  Unlink,
  Share2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Progress } from "@/components/ui/Progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { AccountSettingsModal } from "@/components/AccountSettingModal";
import { NotificationSettingsModal } from "@/components/NotificationSettingsModal";
import  ConnectedAccountsModal  from "@/components/ConnectedAccountsModal";

const getDefaultAvatarColor = (name: string) => {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600', 
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-teal-500 to-teal-600',
    'from-cyan-500 to-cyan-600',
  ];
  
  if (!name) return colors[0];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth);
  const { polls } = useAppSelector((state) => state.polls);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [connectedAccountsModalOpen, setConnectedAccountsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          dispatch(setUser(JSON.parse(userData)));
        } catch (error) {
          console.error("Failed to load user data");
        }
      }
    }

    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [user, dispatch]);

  const userStats = {
    totalPolls: polls.length,
    totalVotes: polls.reduce((sum, poll) => sum + poll.totalVotes, 0),
    activePolls: polls.filter((poll) => poll.isActive).length,
    averageVotes:
      polls.length > 0
        ? Math.round(
            polls.reduce((sum, poll) => sum + poll.totalVotes, 0) / polls.length
          )
        : 0,
    totalViews: polls.reduce((sum, poll) => sum + (poll.views || 0), 0),
    engagementRate:
      polls.length > 0
        ? Math.round(
            (polls.reduce((sum, poll) => sum + poll.totalVotes, 0) /
              polls.reduce(
                (sum, poll) => sum + (poll.views || poll.totalVotes * 3),
                0
              )) *
              100
          )
        : 0,
  };

  const userLevel = {
    level: Math.floor(userStats.totalPolls / 5) + 1,
    progress: ((userStats.totalPolls % 5) / 5) * 100,
    nextLevel: Math.floor(userStats.totalPolls / 5) * 5 + 5,
    achievements: [
      { name: "First Poll", earned: userStats.totalPolls >= 1, icon: Award },
      { name: "Poll Master", earned: userStats.totalPolls >= 10, icon: Trophy },
      {
        name: "Vote Collector",
        earned: userStats.totalVotes >= 100,
        icon: Users,
      },
      {
        name: "Engagement Pro",
        earned: userStats.engagementRate >= 30,
        icon: TrendingUp,
      },
    ],
  };

  const recentPolls = polls.slice(0, 4);
  const topPolls = [...polls]
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 3);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const exportData = () => {
    const data = {
      user,
      stats: userStats,
      polls: polls,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pollapp-data-${user?.name || "user"}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${user?.id}`;
    if (navigator.share) {
      navigator.share({
        title: `Check out ${user?.name}'s Pollify Profile`,
        text: `View ${user?.name}'s polls and achievements on Pollify`,
        url: profileUrl,
      });
    } else {
      navigator.clipboard.writeText(profileUrl);
      alert("Profile link copied to clipboard!");
    }
  };

  const generateQRCode = () => {
    const latestPoll = polls[0];
    if (latestPoll) {
      const pollUrl = `${window.location.origin}/poll/${latestPoll.id}`;
      alert(`QR Code would be generated for: ${pollUrl}\n\nIn a real implementation, this would open a QR code modal or download.`);
    } else {
      alert("No polls available to generate QR code");
    }
  };

  const copyShareableLinks = () => {
    const links = polls.map(poll => 
      `${poll.question}: ${window.location.origin}/poll/${poll.id}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(links);
    alert("Shareable links copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Loading your profile...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-200 to-blue-100 dark:from-gray-900 dark:to-blue-900/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader className="space-y-4">
            <div className={`w-20 h-20 rounded-full bg-linear-to-br ${getDefaultAvatarColor('')} flex items-center justify-center text-white text-2xl font-bold mx-auto`}>
              <User className="h-10 w-10" />
            </div>
            <CardTitle>Welcome to Pollify</CardTitle>
            <CardDescription>
              Please log in to access your personalized profile and polling
              analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => router.push("/login")}
              className="w-full"
              size="lg"
            >
              Sign In to Your Account
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/register")}
              className="w-full"
              size="lg"
            >
              Create New Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-800 shadow-lg">
                  {user.avatar ? (
                    <AvatarImage 
                      src={user.avatar} 
                      alt={user.name || "User Avatar"}
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback 
                    className={`bg-linear-to-br ${getDefaultAvatarColor(user.name)} text-white text-3xl font-bold`}
                  >
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-white dark:border-gray-800">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h1>
                  <Badge variant="success" className="text-sm">
                    <User className="h-3 w-3 mr-1" />
                    Level {userLevel.level}
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Member since{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Recently"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                onClick={exportData}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
              <Button
                onClick={() => router.push("/polls/create")}
                className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                Create Poll
              </Button>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Progress to Level {userLevel.level + 1}</span>
              <span>
                {userStats.totalPolls} / {userLevel.nextLevel} polls
              </span>
            </div>
            <Progress value={userLevel.progress} className="h-2" />
          </div>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1 rounded-2xl">
            <TabsTrigger value="overview" className="rounded-xl">
              Overview
            </TabsTrigger>
            <TabsTrigger value="polls" className="rounded-xl">
              My Polls
            </TabsTrigger>
            <TabsTrigger value="achievements" className="rounded-xl">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stats Overview */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <Card className="bg-linear-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                    <CardContent className="p-4">
                      <BarChart3 className="h-6 w-6 mb-2 opacity-90" />
                      <div className="text-2xl font-bold">
                        {userStats.totalPolls}
                      </div>
                      <div className="text-sm opacity-90">Total Polls</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-linear-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                    <CardContent className="p-4">
                      <Users className="h-6 w-6 mb-2 opacity-90" />
                      <div className="text-2xl font-bold">
                        {userStats.totalVotes}
                      </div>
                      <div className="text-sm opacity-90">Total Votes</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-linear-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                    <CardContent className="p-4">
                      <Eye className="h-6 w-6 mb-2 opacity-90" />
                      <div className="text-2xl font-bold">
                        {userStats.totalViews}
                      </div>
                      <div className="text-sm opacity-90">Total Views</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-linear-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                    <CardContent className="p-4">
                      <TrendingUp className="h-6 w-6 mb-2 opacity-90" />
                      <div className="text-2xl font-bold">
                        {userStats.engagementRate}%
                      </div>
                      <div className="text-sm opacity-90">Engagement</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-linear-to-br from-yellow-500 to-amber-600 text-white border-0 shadow-lg">
                    <CardContent className="p-4">
                      <Star className="h-6 w-6 mb-2 opacity-90" />
                      <div className="text-2xl font-bold">
                        {userLevel.achievements.filter(a => a.earned).length}
                      </div>
                      <div className="text-sm opacity-90">Achievements</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-16 flex-col"
                        onClick={() => router.push("/polls/create")}
                      >
                        <Edit3 className="h-5 w-5 mb-1" />
                        <span className="text-xs">Create Poll</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex-col"
                        onClick={() => setConnectedAccountsModalOpen(true)}
                      >
                        <Link2 className="h-5 w-5 mb-1" />
                        <span className="text-xs">Connect Accounts</span>
                      </Button>
                      <Button 
                        variant="secondary" 
                        className="bg-secondary flex-col"
                        onClick={exportData}
                      >
                        <Download className="h-5 w-5 mb-1" />
                        <span className="text-xs">Export Data</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex-col"
                        onClick={handleShareProfile}
                      >
                        <Share2 className="h-5 w-5 mb-1" />
                        <span className="text-xs">Share Profile</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-indigo-600" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentPolls.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No polls created yet</p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => router.push("/polls/create")}
                        >
                          Create Your First Poll
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentPolls.map((poll, index) => (
                          <div
                            key={poll.id}
                            className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors group"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {poll.question}
                                </h4>
                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    {poll.totalVotes} votes
                                  </span>
                                  <span>
                                    {new Date(
                                      poll.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge
                              variant={poll.isActive ? "success" : "default"}
                            >
                              {poll.isActive ? "Live" : "Closed"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats & Actions */}
              <div className="space-y-6">
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Active Polls
                      </span>
                      <span className="font-semibold text-green-600">
                        {userStats.activePolls}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Avg. Votes
                      </span>
                      <span className="font-semibold text-blue-600">
                        {userStats.averageVotes}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Success Rate
                      </span>
                      <span className="font-semibold text-purple-600">
                        {userStats.engagementRate}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Profile Completion</h3>
                    <Progress value={75} className="h-2 bg-white/20 mb-4" />
                    <p className="text-sm opacity-90 mb-4">
                      Complete your profile to unlock all features
                    </p>
                    <Button
                      variant="secondary"
                      className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
                      onClick={() => setAccountModalOpen(true)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Complete Profile
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Polls Tab */}
          <TabsContent value="polls" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Performing Polls */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                      Top Performing Polls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {topPolls.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No polls data available</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {topPolls.map((poll, index) => (
                          <div
                            key={poll.id}
                            className="flex items-center space-x-4 p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                index === 0
                                  ? "bg-yellow-500"
                                  : index === 1
                                  ? "bg-gray-400"
                                  : "bg-orange-500"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm line-clamp-1">
                                {poll.question}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {poll.totalVotes} votes
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Poll Analytics */}
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                      Poll Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active Polls</span>
                        <span className="font-semibold">
                          {userStats.activePolls}
                        </span>
                      </div>
                      <Progress
                        value={
                          (userStats.activePolls / userStats.totalPolls) * 100
                        }
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average Engagement</span>
                        <span className="font-semibold">
                          {userStats.averageVotes} votes
                        </span>
                      </div>
                      <Progress
                        value={Math.min(userStats.averageVotes * 10, 100)}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Poll Sharing Tools */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <QrCode className="h-5 w-5 mr-2 text-blue-600" />
                    Poll Sharing Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="flex-col h-16" onClick={generateQRCode}>
                      <QrCode className="h-4 w-4 mb-1" />
                      <span className="text-xs">QR Code</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-16" onClick={copyShareableLinks}>
                      <Link2 className="h-4 w-4 mb-1" />
                      <span className="text-xs">Share Link</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-16" onClick={exportData}>
                      <Download className="h-4 w-4 mb-1" />
                      <span className="text-xs">Export Poll</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-16">
                      <BarChart3 className="h-4 w-4 mb-1" />
                      <span className="text-xs">Analytics</span>
                    </Button>
                  </div>
                  
                  {/* Recent sharing activity */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-sm mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Recent Shares
                    </h4>
                    <div className="space-y-2">
                      {recentPolls.slice(0, 2).map((poll) => (
                        <div key={poll.id} className="flex items-center justify-between text-xs p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="truncate flex-1">{poll.question}</span>
                          <Badge variant="success" className="ml-2">
                            {poll.totalVotes} votes
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>
                  Unlock achievements by being active on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userLevel.achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <div
                        key={index}
                        className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all ${
                          achievement.earned
                            ? "bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800"
                            : "bg-gray-50/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 opacity-60"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-lg ${
                            achievement.earned
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 dark:bg-gray-600 text-gray-500"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-medium">{achievement.name}</h4>
                          <p
                            className={`text-sm ${
                              achievement.earned
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {achievement.earned ? "Unlocked" : "Locked"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setAccountModalOpen(true)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile & Privacy
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setNotificationModalOpen(true)}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications & Alerts
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setConnectedAccountsModalOpen(true)}
                  >
                    <Link2 className="h-4 w-4 mr-2" />
                    Connected Accounts
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Appearance & Theme
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Data & Privacy
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={exportData}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AccountSettingsModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />
      <NotificationSettingsModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
      />
      <ConnectedAccountsModal
        isOpen={connectedAccountsModalOpen}
        onClose={() => setConnectedAccountsModalOpen(false)}
      />
    </div>
  );
}
