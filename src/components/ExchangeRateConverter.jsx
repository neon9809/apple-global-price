import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Calculator } from 'lucide-react';

const ExchangeRateConverter = ({ products, exchangeRates }) => {
  const { t, i18n } = useTranslation();
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('CNY');

  // Get unique currencies from products
  const availableCurrencies = useMemo(() => {
    const currencies = new Set(products.map(product => product.currency));
    return Array.from(currencies).sort();
  }, [products]);

  // Convert price from one currency to another
  const convertPrice = (price, fromCurrency, toCurrency) => {
    if (!exchangeRates || fromCurrency === toCurrency) return price;

    const baseRate = exchangeRates.base_currency;
    let priceInBase = price;

    // Convert to base currency (USD) first
    if (fromCurrency !== baseRate) {
      const fromRate = exchangeRates.rates[fromCurrency];
      if (!fromRate) return price;
      priceInBase = price / fromRate;
    }

    // Convert from base currency to target currency
    if (toCurrency !== baseRate) {
      const toRate = exchangeRates.rates[toCurrency];
      if (!toRate) return price;
      return priceInBase * toRate;
    }

    return priceInBase;
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat(i18n.language === 'zh' ? 'zh-CN' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'zh' ? 'zh-CN' : 'en-US');
  };

  // Get converted products
  const convertedProducts = useMemo(() => {
    if (!exchangeRates || baseCurrency === targetCurrency) return products;

    return products.map(product => ({
      ...product,
      converted_net_price: convertPrice(product.net_price, product.currency, targetCurrency),
      converted_tax_fees: convertPrice(product.tax_fees, product.currency, targetCurrency),
      converted_total_price: convertPrice(product.total_price, product.currency, targetCurrency),
      original_currency: product.currency,
      target_currency: targetCurrency
    }));
  }, [products, baseCurrency, targetCurrency, exchangeRates]);

  if (!exchangeRates) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {t('exchangeRate.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {t('exchangeRate.title')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('exchangeRate.lastUpdated')}: {formatDate(exchangeRates.date)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label>{t('exchangeRate.baseCurrency')}</Label>
            <Select value={baseCurrency} onValueChange={setBaseCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableCurrencies.map(currency => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('exchangeRate.targetCurrency')}</Label>
            <Select value={targetCurrency} onValueChange={setTargetCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableCurrencies.map(currency => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {baseCurrency !== targetCurrency && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {t('exchangeRate.convertedPrice')}:
            </div>
            
            <div className="grid gap-3">
              {convertedProducts.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{product.model} - {product.storage}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.country_code}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatPrice(product.converted_total_price, targetCurrency)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatPrice(product.total_price, product.original_currency)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {convertedProducts.length > 5 && (
              <p className="text-sm text-muted-foreground text-center">
                {t('common.loading')}...
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExchangeRateConverter;

