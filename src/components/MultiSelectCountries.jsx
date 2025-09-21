import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { X, Check, RotateCcw } from 'lucide-react';

const MultiSelectCountries = ({ countries, selectedCountries, onSelectionChange }) => {
  const { t, i18n } = useTranslation();
  // Always expanded, no toggle needed

  const handleCountryToggle = (countryCode) => {
    const newSelection = selectedCountries.includes(countryCode)
      ? selectedCountries.filter(code => code !== countryCode)
      : [...selectedCountries, countryCode];
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    onSelectionChange(countries.map(country => country.code));
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const getCountryName = (country) => {
    return i18n.language === 'zh' ? (country.name_zh || country.name_en) : country.name_en;
  };

  const selectedCountryNames = selectedCountries.map(code => {
    const country = countries.find(c => c.code === code);
    return country ? getCountryName(country) : code;
  });

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          {t('filters.country')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Selected Countries Display */}
        <div className="min-h-[2rem]">
          {selectedCountries.length === 0 ? (
            <span className="text-sm text-muted-foreground">
              {t('filters.allCountries')}
            </span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {selectedCountryNames.map((name, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {name}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => handleCountryToggle(selectedCountries[index])}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="flex items-center gap-1 text-xs"
          >
            <Check className="h-3 w-3" />
            {t('common.selectAll')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="flex items-center gap-1 text-xs"
          >
            <RotateCcw className="h-3 w-3" />
            {t('common.clearAll')}
          </Button>
        </div>

        {/* Country List - Always Expanded */}
        <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
          <div className="grid grid-cols-1 gap-2">
            {countries.map((country) => (
              <div key={country.code} className="flex items-center space-x-2">
                <Checkbox
                  id={country.code}
                  checked={selectedCountries.includes(country.code)}
                  onCheckedChange={() => handleCountryToggle(country.code)}
                />
                <label
                  htmlFor={country.code}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {getCountryName(country)}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiSelectCountries;

