import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AIPanel from '../components/AIPanel';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useWallet } from '../contexts/WalletContext';
import { toast } from 'sonner';
import { 
  User, 
  CreditCard, 
  Shield, 
  Palette, 
  Key, 
  Bell, 
  Trash2, 
  Eye, 
  EyeOff,
  Copy,
  Crown
} from 'lucide-react';

export default function SettingsPage() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    portfolio: true,
    transactions: true,
    priceAlerts: false,
    aiInsights: true
  });
  
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { wallets, disconnectWallet } = useWallet();

  const mockApiKey = 'viq_sk_1234567890abcdef1234567890abcdef';

  const handleProfileUpdate = () => {
    toast.success('Profile updated successfully!');
  };

  const handleGenerateApiKey = () => {
    toast.success('New API key generated!');
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(mockApiKey);
    toast.success('API key copied to clipboard');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <DashboardLayout onOpenAI={() => setIsAIOpen(true)}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                    <p className="text-sm text-muted-foreground mt-1">
                      JPG, GIF or PNG. 1MB max.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Connected Wallets</h3>
                  <div className="space-y-3">
                    {wallets.map((wallet) => (
                      <div key={wallet.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {wallet.type.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{wallet.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {wallet.ens || formatAddress(wallet.address)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => disconnectWallet(wallet.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleProfileUpdate}>
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Subscription & Billing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border-blue-200 dark:border-blue-800">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-medium">Free Plan</h3>
                      <Badge variant="secondary">Current</Badge>
                    </div>
                    <p className="text-muted-foreground">
                      Basic portfolio tracking with limited features
                    </p>
                  </div>
                  <Button>
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-lg font-medium mb-2">Pro Plan</h3>
                        <div className="text-3xl font-bold mb-2">$29</div>
                        <p className="text-muted-foreground mb-4">per month</p>
                        <ul className="text-sm space-y-2 text-left">
                          <li>✓ Advanced analytics</li>
                          <li>✓ Tax optimization</li>
                          <li>✓ AI insights</li>
                          <li>✓ API access</li>
                          <li>✓ Priority support</li>
                        </ul>
                        <Button className="w-full mt-4">Choose Pro</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-lg font-medium mb-2">Enterprise</h3>
                        <div className="text-3xl font-bold mb-2">$99</div>
                        <p className="text-muted-foreground mb-4">per month</p>
                        <ul className="text-sm space-y-2 text-left">
                          <li>✓ Everything in Pro</li>
                          <li>✓ Custom integrations</li>
                          <li>✓ White-label options</li>
                          <li>✓ Dedicated support</li>
                          <li>✓ SLA guarantee</li>
                        </ul>
                        <Button variant="outline" className="w-full mt-4">
                          Contact Sales
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Billing History</h3>
                  <p className="text-muted-foreground">
                    No billing history available for free plan.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Appearance Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose between light and dark mode
                    </p>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base">Notifications</Label>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Portfolio Updates</Label>
                        <p className="text-xs text-muted-foreground">
                          Daily portfolio performance summaries
                        </p>
                      </div>
                      <Switch
                        checked={notifications.portfolio}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, portfolio: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Transaction Alerts</Label>
                        <p className="text-xs text-muted-foreground">
                          Notifications for new transactions
                        </p>
                      </div>
                      <Switch
                        checked={notifications.transactions}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, transactions: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Price Alerts</Label>
                        <p className="text-xs text-muted-foreground">
                          Alerts for significant price movements
                        </p>
                      </div>
                      <Switch
                        checked={notifications.priceAlerts}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, priceAlerts: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">AI Insights</Label>
                        <p className="text-xs text-muted-foreground">
                          AI-powered portfolio insights and recommendations
                        </p>
                      </div>
                      <Switch
                        checked={notifications.aiInsights}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, aiInsights: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Password</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Keep your account secure with a strong password
                    </p>
                    <Button variant="outline">
                      Change Password
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Add an extra layer of security to your account
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Not Enabled</Badge>
                      <Button variant="outline">
                        Enable 2FA
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base">Login History</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Review recent login activity
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Current Session</p>
                          <p className="text-xs text-muted-foreground">
                            Chrome on macOS • New York, US
                          </p>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  API Keys
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-2">
                    <Crown className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900 dark:text-blue-100">
                        Pro Feature
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        API access is available for Pro and Enterprise subscribers only.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Your API Key</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Use this key to access the vaultIQ API programmatically
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 relative">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          value={mockApiKey}
                          readOnly
                          className="font-mono pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Button variant="outline" onClick={copyApiKey}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleGenerateApiKey}>
                      Regenerate Key
                    </Button>
                    <Button variant="outline">
                      View Documentation
                    </Button>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Warning:</strong> Keep your API key secure. Don't share it or expose it in client-side code.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AIPanel isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </DashboardLayout>
  );
}