import React, { useState, useMemo, useCallback } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { ThemeProvider } from './contexts/ThemeContext';
import { useData } from './hooks/useData';
import SimpleHeader from './components/SimpleHeader';
import ProductLineSelector from './components/ProductLineSelector';
import MultiSelectCountries from './components/MultiSelectCountries';
import CurrencyConverter from './components/CurrencyConverter';
import SecondaryFilters from './components/SecondaryFilters';
import ProductTable from './components/ProductTable';
import i18n from './lib/i18n';
import { Loader2 } from 'lucide-react';
import { Button } from './components/ui/button';
import './App.css';

function AppContent() {
  const { products, countries, exchangeRates, loading, error } = useData();
  const { t } = useTranslation();
  const [selectedProductLine, setSelectedProductLine] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currencyConverter, setCurrencyConverter] = useState(null);

  // Filter products based on product line and country
  const primaryFilteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Product line filter
      const matchesProductLine = !selectedProductLine || 
        product.model.toLowerCase().includes(selectedProductLine.toLowerCase());
      
      // Country filter
      const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(product.country_code);

      return matchesProductLine && matchesCountry;
    });

    return filtered;
  }, [products, selectedProductLine, selectedCountries]);

  // Handle secondary filter results
  const handleFilteredProductsChange = useCallback((filtered) => {
    setFilteredProducts(filtered);
  }, []);

  // Handle currency converter change
  const handleCurrencyChange = useCallback((converter) => {
    setCurrencyConverter(converter);
  }, []);

  // Count statistics
  const totalDataCount = products.length;
  const uniqueCountries = [...new Set(filteredProducts.map(p => p.country_code))].length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{t('common.loading')}</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Data</h2>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Left Side - Results (70%) */}
          <div className="flex-1 w-[70%] space-y-4">
            {/* Secondary Filters */}
            <SecondaryFilters 
              products={primaryFilteredProducts}
              onFilteredProductsChange={handleFilteredProductsChange}
              exchangeRates={exchangeRates}
              targetCurrency={currencyConverter?.toCurrency}
              currencyConverter={currencyConverter}
            />

            {/* Results Summary */}
            <div className="text-sm text-muted-foreground">
              Found {filteredProducts.length} products from {uniqueCountries} countries.
            </div>

            {/* Product List */}
            <ProductTable
              products={filteredProducts}
              countries={countries}
              exchangeRates={exchangeRates}
              currencyConverter={currencyConverter}
            />

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {t('common.noData')}
                </p>
              </div>
            )}
          </div>

          {/* Right Side - Filters (30%) */}
          <div className="w-[30%] space-y-4">
            {/* Product Line Selector */}
            <ProductLineSelector
              selectedProductLine={selectedProductLine}
              onSelectionChange={setSelectedProductLine}
            />

            {/* Country Filter */}
            <MultiSelectCountries
              countries={countries}
              selectedCountries={selectedCountries}
              onSelectionChange={setSelectedCountries}
            />

            {/* Currency Converter */}
            <CurrencyConverter
              onCurrencyChange={handleCurrencyChange}
            />

            {/* Clear All Filters */}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSelectedProductLine('');
                setSelectedCountries([]);
              }}
            >
              {t('filters.clearFilters')}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {t('footer.dataSource')}
            </div>
            <div className="text-sm text-muted-foreground">
              {t('footer.lastUpdate')}: {exchangeRates?.date || 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">
              收录数据 {totalDataCount} 条
            </div>
          </div>
          <div className="mt-4 pt-4 border-t text-center text-sm text-muted-foreground">
            <a 
              href="https://github.com/neon9809/apple-global-price" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Apple Global Price
            </a>
            {' '}
            项目代码由
            {' '}
            <a 
              href="https://manus.im" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Manus AI
            </a>
            {' '}
            在多轮对话指导下完成。
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;

