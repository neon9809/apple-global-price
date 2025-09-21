import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const ProductLineSelector = ({ selectedProductLine, onSelectionChange }) => {
  const { t } = useTranslation();
  const [productLines, setProductLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProductLines = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 获取 base URL
        const baseUrl = import.meta.env.BASE_URL || '/';
        const mainIndexUrl = `${baseUrl}data/prices/index.json`;
        
        console.log(t('productLine.console.loadingIndex'), mainIndexUrl);
        
        const response = await fetch(mainIndexUrl);
        if (!response.ok) {
          throw new Error(`${t('productLine.error.loadFailed')}: ${response.status}`);
        }
        
        const indexData = await response.json();
        console.log(t('productLine.console.indexData'), {
          categories: indexData.categories,
          categoryCount: indexData.categoryCount,
          lastUpdated: indexData.lastUpdated
        });
        
        if (indexData.categories && indexData.categories.length > 0) {
          setProductLines(indexData.categories);
          console.log(t('productLine.console.loadSuccess'), indexData.categories);
        } else {
          console.warn(t('productLine.console.noData'));
          setProductLines([]);
        }
        
      } catch (error) {
        console.error(t('productLine.console.loadError'), error);
        setError(error.message);
        
        // 发生错误时使用备用数据（可选）
        console.log(t('productLine.console.fallbackData'));
        setProductLines(['iPhone', 'iPad', 'Mac']);
        
      } finally {
        setLoading(false);
      }
    };

    loadProductLines();
  }, [t]);

  const handleProductLineSelect = (productLine) => {
    // If the same line is selected, deselect it
    if (selectedProductLine === productLine) {
      onSelectionChange('');
    } else {
      onSelectionChange(productLine);
    }
  };

  // 加载状态
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            {t('productLine.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {/* 骨架屏 */}
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="h-8 bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // 错误状态（如果不使用备用数据）
  if (error && productLines.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            {t('productLine.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-red-500">
            {error}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
            className="w-full"
          >
            {t('productLine.retry')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          {t('productLine.title')}
          {/* 显示产品线数量 */}
          <span className="ml-2 text-xs text-gray-500">
            ({productLines.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Product Line List - Always Expanded */}
        <div className="space-y-2">
          {productLines.length > 0 ? (
            productLines.map((line) => (
              <Button
                key={line}
                variant={selectedProductLine === line ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleProductLineSelect(line)}
                className="w-full justify-start"
              >
                {line}
              </Button>
            ))
          ) : (
            <div className="text-sm text-gray-500 text-center py-4">
              {t('productLine.noData')}
            </div>
          )}
        </div>
        
        {/* 错误提示（使用备用数据时） */}
        {error && productLines.length > 0 && (
          <div className="text-xs text-orange-500 mt-2">
            ⚠️ {t('productLine.fallbackWarning')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductLineSelector;