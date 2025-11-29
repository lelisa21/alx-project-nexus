// components/AccountSettingsModal.tsx - Enhanced version
'use client';

import { useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUser } from '@/features/auth';
import { 
  User, Mail, Camera, X, Upload, 
  Eye, EyeOff, CheckCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Enhanced avatar color function
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

export function AccountSettingsModal({ isOpen, onClose }: AccountSettingsModalProps) {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, GIF)');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarPreview(e.target.result as string);
        }
      };
      reader.onerror = () => {
        alert('Failed to read the image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeAvatar = () => {
    setAvatarPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSuccess('');
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!formData.email.trim()) {
      alert('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user,
        id: user?.id || '1',
        name: formData.name.trim(),
        email: formData.email.trim(),
        avatar: avatarPreview,
        createdAt: user?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      dispatch(setUser(updatedUser));
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!formData.currentPassword) {
      alert('Please enter your current password');
      return;
    }

    if (formData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Password changed successfully!');
      setFormData(prev => ({ 
        ...prev, 
        currentPassword: '', 
        newPassword: '', 
        confirmPassword: '' 
      }));
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage your profile and security settings</p>
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
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-indigo-600" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and avatar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enhanced Avatar Upload */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full bg-linear-to-br ${getDefaultAvatarColor(formData.name)} flex items-center justify-center text-white text-2xl font-bold relative overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg`}>
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold">
                        {formData.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex space-x-1">
                    <button
                      onClick={triggerFileInput}
                      className="bg-indigo-600 text-white p-1.5 rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
                      title="Upload avatar"
                    >
                      <Camera className="h-3 w-3" />
                    </button>
                    {avatarPreview && (
                      <button
                        onClick={removeAvatar}
                        className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                        title="Remove avatar"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Profile Picture</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Click the camera icon to upload
                  </p>
                </div>
              </div>

              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={handleSaveProfile}
                  loading={loading}
                  className="flex-1"
                >
                  Save Profile Changes
                </Button>
                <Button 
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Change Password Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password *
                </label>
                <div className="relative">
                  <Input
                    type={showPassword.current ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password *
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword.new ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword.confirm ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleChangePassword}
                loading={loading}
                variant="outline"
                className="w-full"
              >
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{success}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
