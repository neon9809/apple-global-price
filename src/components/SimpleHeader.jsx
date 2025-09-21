import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { Moon, Sun, Globe } from 'lucide-react';

const SimpleHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const changeLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  const getCurrentLanguage = () => {
    return i18n.language === 'zh' ? '中文' : 'English';
  };

  return (
    <header className="border-b bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('app.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {t('app.subtitle')}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={changeLanguage}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {getCurrentLanguage()}
            </Button>

            {/* Theme Switcher */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="flex items-center gap-2"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              {t('common.theme')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;

