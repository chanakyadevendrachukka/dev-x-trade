
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Globe, 
  Lock, 
  User, 
  Settings as SettingsIcon,
  Monitor,
  Smartphone,
  Mail,
  Shield,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Check,
  Save,
  RefreshCw
} from 'lucide-react';

export default function Settings() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      priceAlerts: true,
      newsUpdates: false,
      portfolioUpdates: true
    },
    display: {
      darkMode: true,
      compactView: false,
      showAdvanced: true,
      currency: 'USD',
      timezone: 'UTC'
    },
    trading: {
      confirmTrades: true,
      autoStop: false,
      riskLevel: 'medium',
      maxDailyTrades: 10
    }
  });

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to save settings');
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'display', label: 'Display', icon: Monitor },
    { id: 'trading', label: 'Trading', icon: TrendingUp }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="displayName" className="text-foreground">Display Name</Label>
                  <Input 
                    id="displayName"
                    value={currentUser.displayName || ''}
                    className="mt-1 bg-background text-foreground border-border"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Edit this in your Profile page
                  </p>
                </div>
                <div>
                  <Label htmlFor="email" className="text-foreground">Email Address</Label>
                  <Input 
                    id="email"
                    type="email" 
                    value={currentUser.email || ''}
                    className="mt-1 bg-background text-foreground border-border"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Primary account email
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Account Type</span>
                  <Badge variant="secondary" className="bg-success/20 text-success">
                    <Shield className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Email Verified</span>
                  <Badge variant="secondary" className="bg-success/20 text-success">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Member Since</span>
                  <span className="text-muted-foreground">
                    {currentUser.metadata.creationTime 
                      ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                      : 'Recently'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Price Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified of significant price changes</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.priceAlerts}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, priceAlerts: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Portfolio Updates</Label>
                    <p className="text-sm text-muted-foreground">Daily portfolio performance summaries</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.portfolioUpdates}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, portfolioUpdates: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">News Updates</Label>
                    <p className="text-sm text-muted-foreground">Market news and analysis</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.newsUpdates}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, newsUpdates: checked }
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg bg-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-foreground">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Badge variant="outline">Coming Soon</Badge>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg bg-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-foreground">Login Sessions</Label>
                      <p className="text-sm text-muted-foreground">Manage your active sessions</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Sessions
                    </Button>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg bg-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-foreground">Password</Label>
                      <p className="text-sm text-muted-foreground">Last changed recently</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'display':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Display Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
                  </div>
                  <Switch 
                    checked={settings.display.darkMode}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        display: { ...prev.display, darkMode: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Compact View</Label>
                    <p className="text-sm text-muted-foreground">Show more data with less spacing</p>
                  </div>
                  <Switch 
                    checked={settings.display.compactView}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        display: { ...prev.display, compactView: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Advanced Features</Label>
                    <p className="text-sm text-muted-foreground">Show advanced trading tools</p>
                  </div>
                  <Switch 
                    checked={settings.display.showAdvanced}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        display: { ...prev.display, showAdvanced: checked }
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="currency" className="text-foreground">Default Currency</Label>
                  <select 
                    id="currency"
                    value={settings.display.currency}
                    onChange={(e) => 
                      setSettings(prev => ({
                        ...prev,
                        display: { ...prev.display, currency: e.target.value }
                      }))
                    }
                    className="mt-1 w-full px-3 py-2 bg-background text-foreground border border-border rounded-md"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'trading':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Trading Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Confirm Trades</Label>
                    <p className="text-sm text-muted-foreground">Require confirmation before executing trades</p>
                  </div>
                  <Switch 
                    checked={settings.trading.confirmTrades}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        trading: { ...prev.trading, confirmTrades: checked }
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="riskLevel" className="text-foreground">Risk Level</Label>
                  <select 
                    id="riskLevel"
                    value={settings.trading.riskLevel}
                    onChange={(e) => 
                      setSettings(prev => ({
                        ...prev,
                        trading: { ...prev.trading, riskLevel: e.target.value }
                      }))
                    }
                    className="mt-1 w-full px-3 py-2 bg-background text-foreground border border-border rounded-md"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="medium">Medium</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="maxTrades" className="text-foreground">Max Daily Trades</Label>
                  <Input 
                    id="maxTrades"
                    type="number"
                    value={settings.trading.maxDailyTrades}
                    onChange={(e) => 
                      setSettings(prev => ({
                        ...prev,
                        trading: { ...prev.trading, maxDailyTrades: parseInt(e.target.value) || 10 }
                      }))
                    }
                    className="mt-1 bg-background text-foreground border-border"
                    min="1"
                    max="100"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PageLayout title="Settings">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Settings
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            Customize your DevX Trade experience with personalized settings and preferences.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="border-success/50 bg-success/10">
            <Check className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Mobile Tab Navigation */}
          <div className="lg:hidden">
            <Card>
              <CardContent className="p-3">
                <div className="flex overflow-x-auto space-x-2 pb-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "secondary" : "ghost"}
                        size="sm"
                        className="flex-shrink-0"
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <Icon className="mr-1 h-4 w-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SettingsIcon className="h-5 w-5" />
                  <span>Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {tab.label}
                      </Button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">
                  {tabs.find(tab => tab.id === activeTab)?.label} Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderTabContent()}
                
                {/* Save Button */}
                <div className="pt-4 sm:pt-6 border-t border-border mt-4 sm:mt-6">
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button onClick={handleSaveSettings} disabled={loading} className="w-full sm:w-auto">
                      {loading ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/profile')} className="w-full sm:w-auto">
                      Go to Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
