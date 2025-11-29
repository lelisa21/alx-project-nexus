// components/NotificationSettingsModal.tsx
'use client';

import { useState } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationSettingsModal({ isOpen, onClose }: NotificationSettingsModalProps) {
  const [notifications, setNotifications] = useState({
    email: {
      pollResults: true,
      newVotes: true,
      weeklyDigest: false,
      productUpdates: true,
    },
    push: {
      newVotes: true,
      pollReminders: false,
    },
    inApp: {
      achievements: true,
      suggestions: true,
    }
  });

  const [saved, setSaved] = useState(false);

  const handleToggle = (category: string, key: string) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: !prev[category as keyof typeof prev][key as keyof typeof prev[keyof typeof prev]]
      }
    }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(notifications));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Bell className="h-6 w-6 mr-2 text-blue-600" />
              Notification Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Manage how you receive notifications</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Control what email notifications you receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notifications.email).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getNotificationDescription(key)}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={() => handleToggle('email', key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>
                Browser and mobile push notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notifications.push).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getNotificationDescription(key)}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={() => handleToggle('push', key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* In-App Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>In-App Notifications</CardTitle>
              <CardDescription>
                Notifications within the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notifications.inApp).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getNotificationDescription(key)}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={() => handleToggle('inApp', key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex items-center space-x-4">
              {saved && (
                <div className="flex items-center space-x-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <span>Settings saved!</span>
                </div>
              )}
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getNotificationDescription(key: string): string {
  const descriptions: { [key: string]: string } = {
    pollResults: 'Get notified when your poll results are ready',
    newVotes: 'Receive alerts when someone votes on your polls',
    weeklyDigest: 'Weekly summary of your poll performance',
    productUpdates: 'Updates about new features and improvements',
    pollReminders: 'Reminders for polls that are ending soon',
    achievements: 'Notifications when you unlock achievements',
    suggestions: 'Personalized poll suggestions and tips',
  };
  return descriptions[key] || 'Notification setting';
}
