'use client';

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { X, Github, Twitter, Chrome, Facebook, Link2, CheckCircle, Unlink } from "lucide-react";
import { useState } from "react";

interface ConnectedAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Account {
  provider: string;
  name: string;
  connected: boolean;
  icon: React.ComponentType<any>;
  email?: string;
  username?: string;
  connectedSince?: string;
}

const ConnectedAccountsModal = ({ isOpen, onClose }: ConnectedAccountsModalProps) => {
  const [accounts, setAccounts] = useState<Account[]>([
    { 
      provider: 'google', 
      name: 'Google', 
      connected: true, 
      icon: Chrome,
      email: 'user@gmail.com',
      connectedSince: '2024-01-15'
    },
    { 
      provider: 'github', 
      name: 'GitHub', 
      connected: true, 
      icon: Github,
      username: 'pollify-user',
      connectedSince: '2024-02-20'
    },
    { 
      provider: 'twitter', 
      name: 'Twitter', 
      connected: false, 
      icon: Twitter 
    },
    { 
      provider: 'facebook', 
      name: 'Facebook', 
      connected: false, 
      icon: Facebook 
    },
  ]);

  const handleConnect = (provider: string) => {
    setAccounts(accounts.map(account => 
      account.provider === provider 
        ? { 
            ...account, 
            connected: true, 
            connectedSince: new Date().toISOString(),
            // Set default values based on provider
            ...(provider === 'google' && { email: 'user@gmail.com' }),
            ...(provider === 'github' && { username: 'pollify-user' }),
            ...(provider === 'twitter' && { username: '@pollifyuser' }),
            ...(provider === 'facebook' && { email: 'user@facebook.com' })
          }
        : account
    ));
  };

  const handleDisconnect = (provider: string) => {
    setAccounts(accounts.map(account => 
      account.provider === provider 
        ? { 
            ...account, 
            connected: false,
            // Clear connection-specific data when disconnecting
            email: undefined,
            username: undefined,
            connectedSince: undefined
          }
        : account
    ));
  };

  const handleConnectAll = () => {
    setAccounts(accounts.map(account => ({
      ...account,
      connected: true,
      connectedSince: account.connected ? account.connectedSince : new Date().toISOString(),
      // Set default values for all accounts
      ...(account.provider === 'google' && !account.email && { email: 'user@gmail.com' }),
      ...(account.provider === 'github' && !account.username && { username: 'pollify-user' }),
      ...(account.provider === 'twitter' && !account.username && { username: '@pollifyuser' }),
      ...(account.provider === 'facebook' && !account.email && { email: 'user@facebook.com' })
    })));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <CardTitle className="text-xl">Connected Accounts</CardTitle>
            <CardDescription>
              Manage your connected social accounts for easier login and sharing
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {accounts.map((account) => {
            const Icon = account.icon;
            return (
              <Card key={account.provider} className="border-2 border-gray-100 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        account.connected 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{account.name}</p>
                        {account.connected ? (
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>
                              {account.email || account.username || 'Connected'}
                            </div>
                            {account.connectedSince && (
                              <div>
                                Since {new Date(account.connectedSince).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500">Not connected</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {account.connected ? (
                        <>
                          <Badge variant="success" className="flex items-center text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Connected
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDisconnect(account.provider)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Unlink className="h-3 w-3 mr-1" />
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => handleConnect(account.provider)}
                          className="bg-linear-to-r from-indigo-600 to-purple-600"
                        >
                          <Link2 className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={handleConnectAll}
            disabled={accounts.every(account => account.connected)}
          >
            <Link2 className="h-4 w-4 mr-2" />
            Connect All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConnectedAccountsModal;
