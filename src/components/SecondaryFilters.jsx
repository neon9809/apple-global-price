
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { ChevronDown, ChevronUp, ArrowUpDown, X, RotateCcw } from 'lucide-react';

const SecondaryFilters = ({ products, onFilteredProductsChange, exchangeRates, targetCurrency, currencyConverter }) => {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState('total_price'); // 'total_price' or 'tax_refund_price'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [fieldFilters, setFieldFilters] = useState({});
  const [fieldSortOrders, setFieldSortOrders] = useState({});

  // Get available fields for filter (excluding specified fields)
  const availableFields = useMemo(() => {
    if (products.length === 0) return [];
    
    const sampleProduct = products[0];
    const excludedFields = ['country_code', 'launch_date', 'notes', 'category', 'retail_price', 'currency', 'contributor'];
    
    return Object.keys(sampleProduct).filter(key => !excludedFields.includes(key));
  }, [products]);

  // Get unique values for each field
  const getFieldValues = (field) => {
    if (!field || products.length === 0) return [];
    
    const values = [...new Set(products.map(product => product[field]))];
    return values.filter(value => value !== null && value !== undefined);
  };

  // Convert price to target currency using the currency converter
  const convertPrice = (price, fromCurrency, toCurrency, currencyConverter) => {
    if (!currencyConverter || fromCurrency === toCurrency) {
      return price;
    }
    
    return currencyConverter.convertPrice(price, fromCurrency, toCurrency);
  };

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply field filters
    Object.keys(fieldFilters).forEach(field => {
      if (fieldFilters[field] && fieldFilters[field].length > 0) {
        filtered = filtered.filter(product => 
          fieldFilters[field].includes(product[field])
        );
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'total_price') {
        // Use currency converter if available and target currency is different
        if (currencyConverter && currencyConverter.toCurrency) {
          aValue = convertPrice(a.retail_price, a.currency, currencyConverter.toCurrency, currencyConverter);
          bValue = convertPrice(b.retail_price, b.currency, currencyConverter.toCurrency, currencyConverter);
        } else {
          // Fallback to original price if no conversion needed
          aValue = a.retail_price;
          bValue = b.retail_price;
        }
      } else if (sortBy === 'tax_refund_price') {
        const aRefundPrice = a.tax_refund_price || (a.retail_price - (a.tax_fees || 0));
        const bRefundPrice = b.tax_refund_price || (b.retail_price - (b.tax_fees || 0));
        
        if (currencyConverter && currencyConverter.toCurrency) {
          aValue = convertPrice(aRefundPrice, a.currency, currencyConverter.toCurrency, currencyConverter);
          bValue = convertPrice(bRefundPrice, b.currency, currencyConverter.toCurrency, currencyConverter);
        } else {
          aValue = aRefundPrice;
          bValue = bRefundPrice;
        }
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [products, sortBy, sortOrder, fieldFilters, exchangeRates, targetCurrency, currencyConverter]);

  // Update parent component when filtered products change
  React.useEffect(() => {
    onFilteredProductsChange(filteredAndSortedProducts);
  }, [filteredAndSortedProducts, onFilteredProductsChange]);

  const handleSortByPrice = (priceType) => {
    if (sortBy === priceType) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(priceType);
      setSortOrder('asc');
    }
  };

  const handleFieldValueToggle = (field, value) => {
    const currentFilters = fieldFilters[field] || [];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(v => v !== value)
      : [...currentFilters, value];
    
    setFieldFilters({
      ...fieldFilters,
      [field]: newFilters
    });
  };

  const handleClearFieldFilters = (field) => {
    setFieldFilters({
      ...fieldFilters,
      [field]: []
    });
  };

  const handleFieldSort = (field) => {
    const currentOrder = fieldSortOrders[field] || 'asc';
    setFieldSortOrders({
      ...fieldSortOrders,
      [field]: currentOrder === 'asc' ? 'desc' : 'asc'
    });
  };

  const hasActiveFilters = (field) => {
    return fieldFilters[field] && fieldFilters[field].length > 0;
  };

  const hasActiveSorting = (field) => {
    return fieldSortOrders[field];
  };

  return (
    <Card className="w-full mb-4">
      <CardContent className="pt-4">
        <div className="space-y-4">
          {/* Price Sorting Buttons */}
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'total_price' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSortByPrice('total_price')}
              className="flex items-center gap-1 text-xs"
            >
              {t('totalPrice', '总价格')}
              {sortBy === 'total_price' && (
                sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFieldFilters({});
                setFieldSortOrders({});
                setSortBy('total_price');
                setSortOrder('asc');
              }}
              className="flex items-center gap-1 text-xs"
            >
              <RotateCcw className="h-3 w-3" />
              {t('clear', 'Clear')}
            </Button>
          </div>

          {/* Field Filter Buttons */}
          <div className="space-y-3">
            {availableFields.map((field) => {
              const fieldValues = getFieldValues(field);
              const sortOrder = fieldSortOrders[field] || 'asc';
              const isActive = hasActiveFilters(field) || hasActiveSorting(field);
              
              return (
                <div key={field} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isActive ? 'text-blue-600' : ''}`}>
                      {field}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleClearFieldFilters(field)}
                        className="flex items-center gap-1 text-xs"
                        disabled={!hasActiveFilters(field)}
                      >
                        <RotateCcw className="h-3 w-3" />
                        {t('clear', 'Clear')}
                      </Button>
                      <Button
                        variant={hasActiveSorting(field) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFieldSort(field)}
                        className="flex items-center gap-1 text-xs"
                      >
                        <ArrowUpDown className="h-3 w-3" />
                        {sortOrder === 'asc' ? t('ascending', 'Ascending') : t('descending', 'Descending')}
                      </Button>
                    </div>
                  </div>

                  {/* Field Values */}
                  <div className="max-h-32 overflow-y-auto">
                    <div className="grid grid-cols-3 gap-2">
                      {fieldValues
                        .sort((a, b) => {
                          if (typeof a === 'string' && typeof b === 'string') {
                            return sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
                          }
                          return sortOrder === 'asc' ? a - b : b - a;
                        })
                        .map((value, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${field}-${index}`}
                              checked={(fieldFilters[field] || []).includes(value)}
                              onCheckedChange={() => handleFieldValueToggle(field, value)}
                            />
                            <label
                              htmlFor={`${field}-${index}`}
                              className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer truncate"
                            >
                              {String(value)}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecondaryFilters;

