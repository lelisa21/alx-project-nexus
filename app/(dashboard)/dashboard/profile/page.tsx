'use client';

import { useAppSelector } from '@/store/hooks';
import { User, Mail, Calendar, BarChart3, Users, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth);
  const { polls } = useAppSelector((state) => state.polls);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-x-2   border-l-green-600 border-r-red-500"></div>
      </div>
    );
  }

  const userStats = {
    totalPolls: polls.length,
    totalVotes: polls.reduce((sum, poll) => sum + poll.totalVotes, 0),
    activePolls: polls.filter(poll => poll.isActive).length,
    averageVotes: polls.length > 0 ? Math.round(polls.reduce((sum, poll) => sum + poll.totalVotes, 0) / polls.length) : 0,
  };

  const recentPolls = polls.slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account and view your polling statistics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your basic profile information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <Badge variant="info" className="mt-2">
                    Active Member
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Name</p>
                    <p className="text-sm text-gray-600">{user.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Member since</p>
                    <p className="text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Total Polls</p>
                    <p className="text-sm text-gray-600">{userStats.totalPolls}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Polls */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Polls</CardTitle>
              <CardDescription>
                Your most recently created polls
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentPolls.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-sm text-gray-600">No polls created yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPolls.map((poll) => (
                    <div
                      key={poll.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 line-clamp-1">
                          {poll.question}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {poll.totalVotes} votes
                          </span>
                          <span>
                            {new Date(poll.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge variant={poll.isActive ? 'success' : 'warning'}>
                        {poll.isActive ? 'Active' : 'Closed'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Polls</span>
                <span className="font-semibold text-gray-900">{userStats.totalPolls}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Votes</span>
                <span className="font-semibold text-gray-900">{userStats.totalVotes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Polls</span>
                <span className="font-semibold text-gray-900">{userStats.activePolls}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Votes/Poll</span>
                <span className="font-semibold text-gray-900">{userStats.averageVotes}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Notification Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
