import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Edit3, 
  Save, 
  X, 
  Key,
  Activity,
  TrendingUp,
  Award
} from 'lucide-react';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const userInitials = currentUser.displayName 
    ? currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : currentUser.email?.[0]?.toUpperCase() || 'U';

  const memberSince = currentUser.metadata.creationTime 
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
    : 'Recently';

  const lastSignIn = currentUser.metadata.lastSignInTime
    ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString()
    : 'Recently';

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setError('');
      setSuccess('');
      setLoading(true);

      await updateProfile(currentUser, {
        displayName: profileData.displayName
      });

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      setError('Failed to update profile: ' + error.message);
    }
    setLoading(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser || !currentUser.email) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, passwordData.newPassword);

      setSuccess('Password changed successfully!');
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        setError('Current password is incorrect');
      } else {
        setError('Failed to change password: ' + error.message);
      }
    }
    setLoading(false);
  }

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      setError('Failed to logout');
    }
  }

  return (
    <PageLayout title="Profile">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-primary/10 to-success/10 border-primary/20">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-primary/30 flex-shrink-0">
                <AvatarImage src={currentUser.photoURL || undefined} />
                <AvatarFallback className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-primary to-success text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold truncate">
                    {currentUser.displayName || 'DevX Trader'}
                  </h1>
                  <Badge variant="secondary" className="bg-success/20 text-success self-center sm:self-auto">
                    <Award className="h-3 w-3 mr-1" />
                    Pro Trader
                  </Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center text-muted-foreground space-y-2 sm:space-y-0 sm:space-x-4 text-sm">
                  <div className="flex items-center justify-center sm:justify-start space-x-1 min-w-0">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{currentUser.email}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-1">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>Member since {memberSince}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 text-sm">
                  <div className="flex items-center justify-center sm:justify-start space-x-1">
                    <Activity className="h-4 w-4 text-success flex-shrink-0" />
                    <span>Last active: {lastSignIn}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-1">
                    <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Portfolio Growth: +23.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="border-success/50 bg-success/10">
            <AlertDescription className="text-success">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Account Information */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <User className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="self-start sm:self-auto"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Display Name</label>
                    <Input
                      value={profileData.displayName}
                      onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                      placeholder="Enter your display name"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      value={profileData.email}
                      disabled
                      className="bg-muted mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button type="submit" disabled={loading} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setProfileData({
                          displayName: currentUser?.displayName || '',
                          email: currentUser?.email || ''
                        });
                      }}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Display Name</label>
                    <p className="text-lg break-words">{currentUser.displayName || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-lg break-all">{currentUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                    <p className="text-lg flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-success" />
                      <span>Verified Account</span>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </CardTitle>
              {!isChangingPassword && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsChangingPassword(true)}
                  className="self-start sm:self-auto"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {isChangingPassword ? (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Current Password</label>
                    <Input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">New Password</label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button type="submit" disabled={loading} className="flex-1">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Password</label>
                    <p className="text-lg">••••••••••••</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Two-Factor Authentication</label>
                    <p className="text-lg flex items-center space-x-2">
                      <span>Not enabled</span>
                      <Badge variant="outline">Coming Soon</Badge>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h3 className="font-medium">Sign Out</h3>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="self-start sm:self-auto">
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
