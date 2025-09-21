import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Clock, TrendingUp, ArrowRight } from 'lucide-react';

const CurrencyConverter = ({ onCurrencyChange }) => {
  const { t } = useTranslation();
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('CNY');
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load exchange rates from JSON file
  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        // 获取正确的 base URL - 修复路径问题
        const baseUrl = import.meta.env.BASE_URL || '/';
        console.log('Base URL:', baseUrl); // 调试信息
        
        const ratesUrl = `${baseUrl}data/exchange_rates/latest.json`;
        console.log('Loading exchange rates from:', ratesUrl); // 调试信息
        
        const response = await fetch(ratesUrl);
        if (!response.ok) {
          throw new Error(`Failed to load exchange rates: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Loaded exchange rates:', data); // 调试信息
        
        setExchangeRates(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading exchange rates:', error);
        setLoading(false);
      }
    };

    loadExchangeRates();
  }, []);

  // Get all available currencies
  const availableCurrencies = useMemo(() => {
    if (!exchangeRates.length) return [];
    const currencies = new Set();
    exchangeRates.forEach(rateData => {
      currencies.add(rateData.base_currency);
      Object.keys(rateData.rates).forEach(currency => currencies.add(currency));
    });
    return Array.from(currencies).sort();
  }, [exchangeRates]);

  // Get exchange rate between two currencies
  const getExchangeRate = (from, to) => {
    if (from === to) return 1;

    const usdRateData = exchangeRates.find(data => data.base_currency === 'USD');
    if (!usdRateData) {
      console.warn('USD exchange rates not available. Cannot perform cross-currency conversion.');
      return 1; // Fallback if USD rates are not available
    }

    let fromToUsdRate = 1; // Rate from 'from' currency to USD
    let usdToToRate = 1;   // Rate from USD to 'to' currency

    // Calculate fromToUsdRate (from 'from' currency to USD)
    if (from === 'USD') {
      fromToUsdRate = 1;
    } else {
      const fromRateData = exchangeRates.find(data => data.base_currency === from);
      if (fromRateData && fromRateData.rates['USD']) {
        fromToUsdRate = fromRateData.rates['USD'];
      } else if (usdRateData.rates[from]) {
        // If USD->from rate exists, invert it to get from->USD
        fromToUsdRate = 1 / usdRateData.rates[from];
      } else {
        console.warn(`No direct or inverse rate found for ${from} to USD. Assuming 1.`);
        return 1; // Cannot convert, return 1 as fallback
      }
    }

    // Calculate usdToToRate (from USD to 'to' currency)
    if (to === 'USD') {
      usdToToRate = 1;
    } else if (usdRateData.rates[to]) {
      usdToToRate = usdRateData.rates[to];
    } else {
      const toRateData = exchangeRates.find(data => data.base_currency === to);
      if (toRateData && toRateData.rates['USD']) {
        // If 'to'->USD rate exists, invert it to get USD->'to'
        usdToToRate = 1 / toRateData.rates['USD'];
      } else {
        console.warn(`No direct or inverse rate found for USD to ${to}. Assuming 1.`);
        return 1; // Cannot convert, return 1 as fallback
      }
    }

    return fromToUsdRate * usdToToRate;
  };

  // Get USD rates for display when using cross-currency conversion
  const getUsdRates = (currency1, currency2) => {
    const usdRateData = exchangeRates.find(data => data.base_currency === 'USD');
    if (!usdRateData) return null;
    
    const currency1RateData = exchangeRates.find(data => data.base_currency === currency1);
    const currency2RateData = exchangeRates.find(data => data.base_currency === currency2);
    
    let usdToCurrency1 = null;
    let usdToCurrency2 = null;
    
    if (currency1 === 'USD') {
      usdToCurrency1 = 1;
    } else if (usdRateData.rates[currency1]) {
      usdToCurrency1 = usdRateData.rates[currency1];
    }
    
    if (currency2 === 'USD') {
      usdToCurrency2 = 1;
    } else if (usdRateData.rates[currency2]) {
      usdToCurrency2 = usdRateData.rates[currency2];
    }
    
    return { usdToCurrency1, usdToCurrency2 };
  };

  // Convert price
  const convertPrice = (price, from, to) => {
    const rate = getExchangeRate(from, to);
    return price * rate;
  };

  // Notify parent component of currency change
  useEffect(() => {
    if (onCurrencyChange) {
      onCurrencyChange({
        fromCurrency,
        toCurrency,
        convertPrice: (price, from, to) => convertPrice(price, from || fromCurrency, to || toCurrency),
        getExchangeRate: (from, to) => getExchangeRate(from || fromCurrency, to || toCurrency)
      });
    }
  }, [fromCurrency, toCurrency, exchangeRates, onCurrencyChange]);

  const currentRate = getExchangeRate(fromCurrency, toCurrency);
  const isUsingUsdIntermediate = fromCurrency !== 'USD' && toCurrency !== 'USD' && fromCurrency !== toCurrency;
  const usdRates = isUsingUsdIntermediate ? getUsdRates(fromCurrency, toCurrency) : null;

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">
            {t('exchangeRate.loading', '加载汇率数据中...')}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          {t('exchangeRate.title', '汇率转换器')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Currency Selectors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('exchangeRate.fromCurrency', '从')}
            </label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableCurrencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('exchangeRate.toCurrency', '到')}
            </label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableCurrencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Exchange Rate Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-lg">
            <span className="font-medium">1 {fromCurrency}</span>
            <ArrowRight className="h-4 w-4" />
            <span className="font-medium">{currentRate.toFixed(4)} {toCurrency}</span>
          </div>

          {/* USD Intermediate Rate Info */}
          {isUsingUsdIntermediate && usdRates && (
            <div className="text-xs text-muted-foreground space-y-1">
              <p>{t('exchangeRate.usdIntermediate', '已使用美元作为联系汇率进行转换')}</p>
              {usdRates.usdToCurrency1 && (
                <p>1 USD = {usdRates.usdToCurrency1.toFixed(4)} {fromCurrency}</p>
              )}
              {usdRates.usdToCurrency2 && (
                <p>1 USD = {usdRates.usdToCurrency2.toFixed(4)} {toCurrency}</p>
              )}
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {t('exchangeRate.lastUpdated', '最后更新')}: {exchangeRates[0]?.date || '2025-09-20'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};




// Enhanced Product Card with dual currency display
export const ProductCardWithCurrency = ({ product, countries, currencyConverter }) => {
  const { t, i18n } = useTranslation();
  const formatCurrency = (amount, currency) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      return `${currency} ${amount.toFixed(2)}`;
    }
  };

  const country = countries.find(c => c.code === product.country_code);
  const countryName = country ? (i18n.language === 'zh' ? (country.name_zh || country.name_en) : country.name_en) : product.country_code;

  // Calculate tax rate
  const taxRate = product.net_price > 0 ? ((product.tax_fees / product.net_price) * 100) : 0;

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold">
              {product.model} - {product.storage}
            </h3>
            <p className="text-sm text-muted-foreground">
              {countryName}
            </p>
            {product.notes && (
              <p className="text-xs text-muted-foreground">
                {product.notes}
              </p>
            )}
          </div>
          <div className="text-right space-y-1">
            {/* Original Currency */}
            <div className="space-y-1">
              <p className="font-bold text-lg">
                {formatCurrency(product.total_price, product.currency)}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('productTable.netPrice')}: {formatCurrency(product.net_price, product.currency)}
              </p>
              {product.tax_fees > 0 && (
                <p className="text-xs text-muted-foreground">
                  {t('productTable.tax')}: {formatCurrency(product.tax_fees, product.currency)} ({taxRate.toFixed(1)}%)
                </p>
              )}
            </div>

            {/* Converted Currency */}
            {currencyConverter && currencyConverter.toCurrency !== product.currency && (
              <div className="pt-2 border-t space-y-1">
                <p className="font-semibold" style={{ color: '#f8b524' }}>
                  {formatCurrency(currencyConverter.convertPrice(product.total_price, product.currency, currencyConverter.toCurrency), currencyConverter.toCurrency)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('productTable.netPrice')}: {formatCurrency(currencyConverter.convertPrice(product.net_price, product.currency, currencyConverter.toCurrency), currencyConverter.toCurrency)}
                </p>
                {product.tax_fees > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {t('productTable.tax')}: {formatCurrency(currencyConverter.convertPrice(product.tax_fees, product.currency, currencyConverter.toCurrency), currencyConverter.toCurrency)} ({taxRate.toFixed(1)}%)
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;


