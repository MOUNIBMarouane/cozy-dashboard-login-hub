
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Globe, Image as ImageIcon, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/context/SettingsContext';
import { translations } from '@/translations';

const Settings = () => {
  const { theme, setTheme, language, setLanguage } = useSettings();
  const [useCustomBg, setUseCustomBg] = useState(false);
  const [bgImage, setBgImage] = useState('');
  
  const t = translations[language].settings;

  const handleThemeChange = (value: 'light' | 'dark') => {
    setTheme(value);
  };

  const handleLanguageChange = (value: 'en' | 'fr' | 'es') => {
    setLanguage(value);
  };

  const handleBgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgImage(reader.result as string);
        localStorage.setItem('backgroundImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900/20 to-blue-950/30">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900/95 to-blue-900/95 border-b border-white/10 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Theme Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-xl border-white/10 bg-gradient-to-br from-gray-900/80 to-blue-900/40 backdrop-blur-sm">
              <CardHeader className="border-b border-white/5 bg-gradient-to-r from-blue-800/30 to-purple-800/20">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-blue-400" />
                  {t.theme}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <RadioGroup
                  value={theme}
                  onValueChange={handleThemeChange}
                  className="grid grid-cols-1 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" className="border-blue-400" />
                    <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                      <Sun className="h-4 w-4 text-blue-400" />
                      {t.lightMode}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" className="border-blue-400" />
                    <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                      <Moon className="h-4 w-4 text-blue-400" />
                      {t.darkMode}
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </motion.div>

          {/* Language Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-xl border-white/10 bg-gradient-to-br from-gray-900/80 to-blue-900/40 backdrop-blur-sm">
              <CardHeader className="border-b border-white/5 bg-gradient-to-r from-blue-800/30 to-purple-800/20">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  {t.language}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="bg-blue-950/40 border-blue-400/20 text-white">
                    <SelectValue placeholder={t.selectLanguage} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a1033] border-blue-900/30">
                    <SelectItem value="en" className="text-white hover:bg-blue-900/20">English</SelectItem>
                    <SelectItem value="fr" className="text-white hover:bg-blue-900/20">Français</SelectItem>
                    <SelectItem value="es" className="text-white hover:bg-blue-900/20">Español</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>

          {/* Background Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-2"
          >
            <Card className="shadow-xl border-white/10 bg-gradient-to-br from-gray-900/80 to-blue-900/40 backdrop-blur-sm">
              <CardHeader className="border-b border-white/5 bg-gradient-to-r from-blue-800/30 to-purple-800/20">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-blue-400" />
                  Background Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={useCustomBg}
                      onCheckedChange={setUseCustomBg}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <Label>Use Custom Background Image</Label>
                  </div>
                  
                  {useCustomBg && (
                    <div className="space-y-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBgImageChange}
                        className="hidden"
                        id="bg-upload"
                      />
                      <Label
                        htmlFor="bg-upload"
                        className="flex items-center justify-center w-full h-32 border-2 border-dashed border-blue-400/30 rounded-lg cursor-pointer hover:border-blue-400/50 transition-colors"
                      >
                        {bgImage ? (
                          <img src={bgImage} alt="Background Preview" className="h-full object-cover rounded" />
                        ) : (
                          <div className="text-center">
                            <ImageIcon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                            <p className="text-sm text-blue-300">Click to upload background image</p>
                          </div>
                        )}
                      </Label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
