"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  Bell,
  LogOut,
  X,
  User,
  ImagePlus,
  Trash2,
  Shield,
  Palette,
  Users,
  Layers,
  HelpCircle
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/layout/layout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Textarea } from '@/components/ui/textarea';
import renderHelpSection from '@/components/setting/HelpSection';

// Extended Settings Interface
interface AdvancedSettings {
  privacyControls: {
    accountPrivacy: boolean;
    profileVisibility: 'public' | 'private' | 'selective';
    tagReviewEnabled: boolean;
    hiddenWords: string[];
    offensiveWordFiltering: {
      comments: boolean;
      advancedCommentFiltering: boolean;
      messageRequests: boolean;
    };
  };
  notifications: {
    channelNotifications: {
      [channelName: string]: boolean;
    };
    mentionNotifications: {
      fromEveryone: boolean;
      fromFollowers: boolean;
    };
    handleMentions: boolean;
  };
  advancedPrivacy: {
    blockList: string[];
    muteList: string[];
    restrictedAccounts: string[];
  };
  profile: {
    channelName: string;
    channelHandle: string;
    description: string;
    channelLogo?: File | null;
    channelBanner?: File | null;
    passwordReset: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    };
  };
}

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState<AdvancedSettings>({
    privacyControls: {
      accountPrivacy: false,
      profileVisibility: 'public',
      tagReviewEnabled: true,
      hiddenWords: ['bad', 'offensive', 'harmful'],
      offensiveWordFiltering: {
        comments: true,
        advancedCommentFiltering: false,
        messageRequests: true
      }
    },
    notifications: {
      channelNotifications: {
        'General': true,
        'Tech': true,
        'Music': false,
        'Sports': false
      },
      mentionNotifications: {
        fromEveryone: false,
        fromFollowers: true
      },
      handleMentions: true
    },
    advancedPrivacy: {
      blockList: [],
      muteList: [],
      restrictedAccounts: []
    },
    profile: {
      channelName: '',
      channelHandle: '',
      description: '',
      channelLogo: null,
      channelBanner: null,
      passwordReset: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  });
  const [imagePreview, setImagePreview] = useState<{
    channelLogo?: string | null;
    channelBanner?: string | null;
  }>({
    channelLogo: null,
    channelBanner: null
  });

  const [newHiddenWord, setNewHiddenWord] = useState('');

  const updateSettings = <K extends keyof AdvancedSettings, T extends keyof AdvancedSettings[K]>(
    category: K,
    key: T,
    value: AdvancedSettings[K][T]
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));

    toast({
      title: "Settings Updated",
      description: `${String(key)} has been updated`,
      variant: "default"
    });
  };

  const addHiddenWord = () => {
    if (newHiddenWord.trim()) {
      setSettings(prev => ({
        ...prev,
        privacyControls: {
          ...prev.privacyControls,
          hiddenWords: [...prev.privacyControls.hiddenWords, newHiddenWord.trim()]
        }
      }));
      setNewHiddenWord('');
      toast({
        title: "Hidden Word Added",
        description: `"${newHiddenWord}" added to hidden words list`,
        variant: "default"
      });
    }
  };

  const removeHiddenWord = (word: string) => {
    setSettings(prev => ({
      ...prev,
      privacyControls: {
        ...prev.privacyControls,
        hiddenWords: prev.privacyControls.hiddenWords.filter(w => w !== word)
      }
    }));
  };

  const handleFileUpload = (type: 'channelLogo' | 'channelBanner', file: File | null) => {
    if (file) {
      if (file.size > 6 * 1024 * 1024) {  // 6MB limit
        toast({
          title: "Upload Failed",
          description: "File size exceeds 6MB limit",
          variant: "destructive"
        });
        return;
      }

      // Create file preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => ({
          ...prev,
          [type]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);

      setSettings(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [type]: file
        }
      }));
    }
  };

  const handleRemoveFile = (type: 'channelLogo' | 'channelBanner') => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [type]: null
      }
    }));

    setImagePreview(prev => ({
      ...prev,
      [type]: null
    }));
  };

  const handlePublishProfile = () => {
    // Validate profile details
    if (!settings.profile.channelName || !settings.profile.channelHandle) {
      toast({
        title: "Publish Failed",
        description: "Please fill in Channel Name and Handle",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically add backend logic to save profile
    toast({
      title: "Profile Published",
      description: "Your profile has been successfully updated",
      variant: "default"
    });
  };

  const handlePasswordReset = () => {
    const { newPassword, confirmPassword } = settings.profile.passwordReset;

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Reset Failed",
        description: "New password and confirmation do not match",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Password Reset",
      description: "Your password has been successfully updated",
      variant: "default"
    });

    // Reset password fields
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        passwordReset: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      }
    }));
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Preview</CardTitle>
          <CardDescription>How your profile will look</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {imagePreview.channelBanner && (
            <div className="w-full h-48 bg-cover bg-center rounded-lg"
              style={{ backgroundImage: `url(${imagePreview.channelBanner})` }}>
            </div>
          )}
          {imagePreview.channelLogo && (
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${imagePreview.channelLogo})` }}>
              </div>
              <div>
                <h2 className="text-xl font-bold">{settings.profile.channelName}</h2>
                <p className="text-muted-foreground">@{settings.profile.channelHandle}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">View Channel</Button>
          <div className="space-x-2">
            <Button variant="secondary">Cancel</Button>
            <Button
              variant="default"
              onClick={handlePublishProfile}
            >
              Publish
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Channel Banner</CardTitle>
          <CardDescription>This image will appear across the top of your channel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <p className="text-sm text-muted-foreground">
                For the best results, use an image that's at least 2048 x 1152 pixels and 6MB or less.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    handleFileUpload('channelBanner', file || null);
                  };
                  input.click();
                }}
              >
                <ImagePlus className="mr-2 h-4 w-4" /> Change
              </Button>
              {settings.profile.channelBanner && (
                <Button
                  variant="destructive"
                  onClick={() => handleRemoveFile('channelBanner')}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Remove
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Your profile picture appears where your channel is presented</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <p className="text-sm text-muted-foreground">
                Use a picture that's at least 98 x 98 pixels and 4MB or less. PNG or GIF (no animations).
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    handleFileUpload('channelLogo', file || null);
                  };
                  input.click();
                }}
              >
                <ImagePlus className="mr-2 h-4 w-4" /> Change
              </Button>
              {settings.profile.channelLogo && (
                <Button
                  variant="destructive"
                  onClick={() => handleRemoveFile('channelLogo')}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Remove
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Channel Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Channel Name</Label>
              <Input
                placeholder="Enter channel name"
                value={settings.profile.channelName}
                onChange={(e) => updateSettings('profile', 'channelName', e.target.value)}
              />
            </div>
            <div>
              <Label>Channel Handle</Label>
              <div className="flex items-center">
                <span className="mr-2">@</span>
                <Input
                  placeholder="Choose a unique handle"
                  value={settings.profile.channelHandle}
                  onChange={(e) => updateSettings('profile', 'channelHandle', e.target.value)}
                />
              </div>
            </div>
          </div>
          <div>
            <Label>Channel Description</Label>
            <Textarea
              placeholder="Tell us about your channel"
              value={settings.profile.description}
              onChange={(e) => updateSettings('profile', 'description', e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Current Password</Label>
              <Input
                type="password"
                placeholder="Enter current password"
                value={settings.profile.passwordReset.currentPassword}
                onChange={(e) =>
                  setSettings(prev => ({
                    ...prev,
                    profile: {
                      ...prev.profile,
                      passwordReset: {
                        ...prev.profile.passwordReset,
                        currentPassword: e.target.value
                      }
                    }
                  }))
                }
              />
            </div>
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={settings.profile.passwordReset.newPassword}
                onChange={(e) =>
                  setSettings(prev => ({
                    ...prev,
                    profile: {
                      ...prev.profile,
                      passwordReset: {
                        ...prev.profile.passwordReset,
                        newPassword: e.target.value
                      }
                    }
                  }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={settings.profile.passwordReset.confirmPassword}
                onChange={(e) =>
                  setSettings(prev => ({
                    ...prev,
                    profile: {
                      ...prev.profile,
                      passwordReset: {
                        ...prev.profile.passwordReset,
                        confirmPassword: e.target.value
                      }
                    }
                  }))
                }
              />
            </div>
          </div>
          <Button
            variant="default"
            onClick={handlePasswordReset}
            className="w-full mt-4"
          >
            Reset Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Privacy</CardTitle>
          <CardDescription>Control your account visibility and interactions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Profile Visibility</span>
              <p className="text-sm text-muted-foreground">
                Control who can see your profile and content
              </p>
            </div>
            <Switch
              checked={settings.privacyControls.accountPrivacy}
              onCheckedChange={(checked) =>
                updateSettings('privacyControls', 'accountPrivacy', checked)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Tag Review</span>
              <p className="text-sm text-muted-foreground">
                Manually review tags before they appear on your profile
              </p>
            </div>
            <Switch
              checked={settings.privacyControls.tagReviewEnabled}
              onCheckedChange={(checked) =>
                updateSettings('privacyControls', 'tagReviewEnabled', checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hidden Words & Offensive Content</CardTitle>
          <CardDescription>Manage content filtering and hidden words</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Offensive Word Filtering</Label>
            {Object.entries(settings.privacyControls.offensiveWordFiltering).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) =>
                    updateSettings(
                      'privacyControls',
                      'offensiveWordFiltering',
                      { ...settings.privacyControls.offensiveWordFiltering, [key]: checked }
                    )
                  }
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Hidden Words List</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add a word to hide"
                value={newHiddenWord}
                onChange={(e) => setNewHiddenWord(e.target.value)}
              />
              <Button onClick={addHiddenWord}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.privacyControls.hiddenWords.map((word) => (
                <div
                  key={word}
                  className="bg-violet-800 px-2 py-1 pl-5 rounded-full flex items-center space-x-2"
                >
                  <span>{word}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHiddenWord(word)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Channel Notifications</CardTitle>
          <CardDescription>Manage notifications for different channels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(settings.notifications.channelNotifications).map(([channel, enabled]) => (
            <div key={channel} className="flex justify-between items-center">
              <span>{channel} Channel</span>
              <Switch
                checked={enabled}
                onCheckedChange={(checked) =>
                  updateSettings(
                    'notifications',
                    'channelNotifications',
                    { ...settings.notifications.channelNotifications, [channel]: checked }
                  )
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mention Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span>Mentions from Everyone</span>
              <p className="text-sm text-muted-foreground">
                Receive notifications for mentions from all users
              </p>
            </div>
            <Switch
              checked={settings.notifications.mentionNotifications.fromEveryone}
              onCheckedChange={(checked) =>
                updateSettings(
                  'notifications',
                  'mentionNotifications',
                  {
                    ...settings.notifications.mentionNotifications,
                    fromEveryone: checked
                  }
                )
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span>Handle Mentions</span>
              <p className="text-sm text-muted-foreground">
                Enable or disable handle mentions
              </p>
            </div>
            <Switch
              checked={settings.notifications.handleMentions}
              onCheckedChange={(checked) =>
                updateSettings('notifications', 'handleMentions', checked)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Rest of the component remains the same
  const sections = [
    { id: 'profile', icon: <User />, title: 'Profile' },
    { id: 'privacy', icon: <Lock />, title: 'Privacy' },
    { id: 'notifications', icon: <Bell />, title: 'Notifications' },
    { id: 'security', icon: <Shield />, title: 'Security' },
    { id: 'appearance', icon: <Palette />, title: 'Appearance' },
    { id: 'connections', icon: <Users />, title: 'Connections' },
    { id: 'integrations', icon: <Layers />, title: 'Integrations' },
    { id: 'help', icon: <HelpCircle />, title: 'Help & Support' },
  ];

  return (
    <Layout>
      <div className="min-h-screen flex ">
        {/* Sidebar */}
        <ScrollArea className="">
          <div className=" h-auto border-r p-4 space-y-2 bg-background w-64">
            <div className="flex items-center mb-6 space-x-2">
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>

            {/* Extended Section Navigation */}
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'secondary' : 'ghost'}
                className="w-full justify-start mb-2"
                onClick={() => setActiveSection(section.id)}
              >
                {React.cloneElement(section.icon, { className: 'mr-2' })}
                {section.title}
              </Button>
            ))}

            <Separator className="my-4" />
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500"
              onClick={() => {
                toast({
                  title: "Logged Out",
                  description: "You have been successfully logged out",
                  variant: "default"
                });
              }}
            >
              <LogOut className="mr-2" /> Logout
            </Button>
          </div>
        </ScrollArea>

        {/* Main Content Area */}
        <div className=" flex-1 p-8 overflow-y-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'profile' && renderProfileSection()}
            {activeSection === 'privacy' && renderPrivacySection()}
            {activeSection === 'notifications' && renderNotificationsSection()}
            {activeSection === 'help' && renderHelpSection()}

            {/* Placeholder for new sections */}
            {['security', 'appearance', 'connections', 'integrations'].includes(activeSection) && (
              <Card>
                <CardHeader>
                  <CardTitle>{sections.find(s => s.id === activeSection)?.title} Section</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>This section is coming soon...</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </Layout>
  );
};

export default SettingsPage;