import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

const ProductTable = ({ products, countries, exchangeRates, currencyConverter }) => {
  const { t, i18n } = useTranslation();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [countryTaxInfo, setCountryTaxInfo] = useState({});
  const [taxInfoLoading, setTaxInfoLoading] = useState(true);

  // 加载国家税务信息
  useEffect(() => {
    const loadCountryTaxInfo = async () => {
      try {
        setTaxInfoLoading(true);
        const baseUrl = import.meta.env.BASE_URL || '/';
        const taxInfoUrl = `${baseUrl}data/country_info/cr.json`;
        
        console.log('📖 ProductTable: 加载国家税务信息:', taxInfoUrl);
        
        const response = await fetch(taxInfoUrl);
        if (!response.ok) {
          throw new Error(`无法加载国家税务信息: ${response.status}`);
        }
        
        const taxInfoData = await response.json();
        
        // 将数组转换为以 code 为 key 的对象，方便通过 country_code 查找
        const taxInfoMap = {};
        taxInfoData.forEach(country => {
          taxInfoMap[country.code] = country;
        });
        
        setCountryTaxInfo(taxInfoMap);
        console.log('✅ ProductTable: 国家税务信息加载完成:', Object.keys(taxInfoMap));
        
      } catch (error) {
        console.error('❌ ProductTable: 加载国家税务信息失败:', error);
        setCountryTaxInfo({});
      } finally {
        setTaxInfoLoading(false);
      }
    };

    loadCountryTaxInfo();
  }, []);

  const getCountryInfo = (countryCode) => {
    return countries.find(country => country.code === countryCode);
  };

  // 通过 country_code 获取税务信息
  const getCountryTaxInfo = (countryCode) => {
    return countryTaxInfo[countryCode];
  };

const getCountryName = (countryCode) => {
  // 优先使用税务信息中的国家数据
  const taxCountry = getCountryTaxInfo(countryCode);
  if (taxCountry) {
    const currentLang = i18n.language;
    const localName = taxCountry.name_local; // 当地官方语言名称
    const translatedName = currentLang === 'zh' ? taxCountry.name_zh : taxCountry.name_en;
    
    // 如果本地名称与翻译名称相同，只显示一个
    if (localName === translatedName) {
      return localName;
    }
    
    // 显示格式：本地名称 (翻译名称)
    return `${localName} (${translatedName})`;
  }

  // 回退到原有的 countries 数据
  const country = getCountryInfo(countryCode);
  if (!country) return countryCode;
  
  const currentLang = i18n.language;
  // 如果原有数据没有 name_local 字段，则按原来的逻辑显示
  if (country.name_local) {
    const localName = country.name_local;
    const translatedName = currentLang === 'zh' ? country.name_zh : country.name_en;
    
    if (localName === translatedName) {
      return localName;
    }
    
    return `${localName} (${translatedName})`;
  } else {
    // 原有逻辑保持不变
    if (currentLang === 'zh') {
      return `${country.name_zh}`;
    }
    return `${country.name_en}`;
  }
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

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = React.useMemo(() => {
    if (!sortConfig.key) return products;

    return [...products].sort((a, b) => {
      let aValue = sortConfig.key === 'total_price' ? a.retail_price : a[sortConfig.key];
      let bValue = sortConfig.key === 'total_price' ? b.retail_price : b[sortConfig.key];

      // Handle numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string values
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [products, sortConfig]);

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  // 计算退税金额的辅助函数
  const calculateTaxRefund = (price, refundRate) => {
    if (!refundRate || refundRate === 'N/A' || refundRate === 'variable') {
      return null;
    }
    
    // 提取百分比数字
    const rateMatch = refundRate.match(/(\d+(?:\.\d+)?)%/);
    if (!rateMatch) {
      return null;
    }
    
    const rate = parseFloat(rateMatch[1]) / 100;
    return price * rate;
  };

  // 税务信息弹窗组件
  const TaxRefundInfo = ({ countryCode, product }) => {
    const taxCountry = getCountryTaxInfo(countryCode);
    if (!taxCountry || !taxCountry.tax_info) {
      return (
        <span className="text-xs text-muted-foreground">
          ({t('taxInfo.noTaxInfo')})
        </span>
      );
    }

    const taxInfo = taxCountry.tax_info;
    const refundAmount = calculateTaxRefund(product.retail_price, taxInfo.refund_rate);
    
    // 计算转换后的退税金额
    let convertedRefundAmount = null;
    if (refundAmount && currencyConverter && currencyConverter.toCurrency !== product.currency) {
      convertedRefundAmount = currencyConverter.convertPrice(refundAmount, product.currency, currencyConverter.toCurrency);
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
            <Badge 
              variant={taxInfo.can_refund ? "default" : "secondary"}
              className="cursor-pointer text-xs"
            >
              {taxInfo.can_refund 
                ? t('taxInfo.refundable') 
                : t('taxInfo.nonRefundable')
              } {taxInfo.refund_rate}
            </Badge>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              {getCountryName(countryCode)} - {t('taxInfo.taxDetails')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm min-w-20">
                  {t('taxInfo.refundStatus')}:
                </span>
                <Badge variant={taxInfo.can_refund ? "default" : "secondary"}>
                  {taxInfo.can_refund 
                    ? `✓ ${t('taxInfo.canRefund')}` 
                    : `✗ ${t('taxInfo.cannotRefund')}`
                  }
                </Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm min-w-20">
                  {t('taxInfo.refundRate')}:
                </span>
                <span className="text-sm font-medium">{taxInfo.refund_rate}</span>
              </div>
              
              {/* 预计退税金额 */}
              {taxInfo.can_refund && refundAmount && (
                <div className="space-y-2 bg-green-50 dark:bg-green-950/20 p-3 rounded-md border border-green-200 dark:border-green-800">
                  <div className="font-medium text-sm text-green-800 dark:text-green-200">
                    {t('taxInfo.estimatedRefund')}:
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                      {formatPrice(refundAmount, product.currency)}
                    </div>
                    {convertedRefundAmount && (
                      <div className="text-sm text-green-600 dark:text-green-400">
                        ≈ {formatPrice(convertedRefundAmount, currencyConverter.toCurrency)}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <span className="font-medium text-sm">
                  {t('taxInfo.detailedDescription')}:
                </span>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md leading-relaxed">
                  {taxInfo.notes}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // 税务信息内联显示组件
  const TaxInfoInline = ({ countryCode }) => {
    const taxCountry = getCountryTaxInfo(countryCode);
    if (!taxCountry || !taxCountry.tax_info) {
      return (
        <div className="text-xs text-muted-foreground">
          {t('taxInfo.taxInfoUnavailable')}
        </div>
      );
    }

    const taxInfo = taxCountry.tax_info;

    return (
      <div className="text-xs space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{t('productTable.taxRefund')}:</span>
          <Badge 
            variant={taxInfo.can_refund ? "default" : "secondary"}
            className="text-xs px-2 py-0"
          >
            {taxInfo.can_refund 
              ? t('taxInfo.refundable') 
              : t('taxInfo.nonRefundable')
            }
          </Badge>
          <span className="text-muted-foreground">
            ({taxInfo.refund_rate})
          </span>
        </div>
        {taxInfo.notes && (
          <div className="text-muted-foreground max-w-md">
            {taxInfo.notes.length > 60 
              ? `${taxInfo.notes.substring(0, 60)}...` 
              : taxInfo.notes
            }
          </div>
        )}
      </div>
    );
  };

  // Get all fields except the excluded ones for middle section display
  const getMiddleFields = (product) => {
    const excludedFields = ['retail_price', 'launch_date', 'notes', 'country_code', 'category'];
    return Object.keys(product).filter(key => !excludedFields.includes(key));
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('common.noData')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedProducts.map((product, index) => {
        const taxCountry = getCountryTaxInfo(product.country_code);
        
        return (
          <Card key={index} className="w-full">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                {/* Left Side */}
                <div className="flex-1 space-y-3">
                  {/* Top: Launch Date */}
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {t('productTable.launchDate')}:
                    </span>
                    <span className="ml-2 text-sm">
                      {formatDate(product.launch_date)}
                    </span>
                  </div>

                  {/* Middle: All other fields */}
                  <div className="space-y-2">
                    {getMiddleFields(product).map((field) => (
                      <div key={field} className="flex items-center">
                        <span className="text-sm font-medium text-muted-foreground min-w-20">
                          {field}:
                        </span>
                        <span className="ml-2 text-sm">
                          {String(product[field])}
                        </span>
                      </div>
                    ))}

                    {/* 产品备注 */}
                    {product.notes && (
                      <div className="text-xs text-muted-foreground bg-muted p-2 mt-4 rounded">
                        <span className="font-medium">{t('productTable.productNotes')}: </span>
                        <span>{product.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom: Country and Tax Information */}
                  <div>

                    {/* 国家信息行 */}
                    <div className="flex items-center gap-2 mt-6 ml-2">
                      <span className="text-sm font-medium">
                        {getCountryName(product.country_code)}
                      </span>
                      
                      {/* 点击查看详细税务信息 */}
                      {!taxInfoLoading && (
                        <TaxRefundInfo countryCode={product.country_code} product={product} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Prices */}
                <div className="text-right space-y-2 min-w-32">
                  {/* Retail Price - Normal Solid */}
                  <div className="text-lg font-semibold">
                    {formatPrice(product.retail_price, product.currency)}
                  </div>

                  {/* Converted Currency Display */}
                  {currencyConverter && currencyConverter.toCurrency !== product.currency && (
                    <div className="pt-2 border-t space-y-1">
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {formatPrice(currencyConverter.convertPrice(product.retail_price, product.currency, currencyConverter.toCurrency), currencyConverter.toCurrency)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProductTable;