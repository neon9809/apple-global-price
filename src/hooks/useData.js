import { useState, useEffect } from 'react';

export const useData = () => {
  const [data, setData] = useState({
    products: [],
    countries: [],
    exchangeRates: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));
        const baseUrl = import.meta.env.BASE_URL || '/';
        console.log('Base URL:', baseUrl);

        const allProducts = [];
        
        // 从主索引文件获取所有产品类别
        const productCategories = await getProductCategories(baseUrl);
        console.log('发现的产品类别:', productCategories);

        // 加载每个产品类别的数据
        for (const category of productCategories) {
          try {
            console.log(`正在加载类别: ${category}`);
            
            // 从类别索引文件获取文件列表
            const categoryFiles = await getCategoryFiles(baseUrl, category);
            console.log(`${category} 类别包含文件:`, categoryFiles);

            // 加载每个文件
            for (const fileName of categoryFiles) {
              try {
                const fileUrl = `${baseUrl}data/prices/${category}/${fileName}`;
                console.log(`加载产品数据:`, fileUrl);
                
                const response = await fetch(fileUrl);
                if (response.ok) {
                  const products = await response.json();
                  // 为每个产品添加类别信息
                  const productsWithCategory = products.map(product => ({
                    ...product,
                    category: category
                  }));
                  allProducts.push(...productsWithCategory);
                  console.log(`✅ ${fileName}: 加载了 ${products.length} 个产品`);
                } else {
                  console.warn(`❌ 加载 ${fileName} 失败: ${response.status}`);
                }
              } catch (fileError) {
                console.warn(`❌ 加载文件 ${fileName} 时出错:`, fileError);
              }
            }
          } catch (categoryError) {
            console.warn(`❌ 处理类别 ${category} 时出错:`, categoryError);
          }
        }

        // 加载国家信息
        const countries = await loadCountries(baseUrl);
        
        // 加载汇率数据
        const exchangeRates = await loadExchangeRates(baseUrl);

        console.log(`🎉 数据加载完成:`);
        console.log(`   - 产品类别: ${productCategories.length}`);
        console.log(`   - 总产品数: ${allProducts.length}`);
        console.log(`   - 国家数据: ${countries.length} 个国家`);
        console.log(`   - 汇率数据: ${exchangeRates ? '已加载' : '未加载'}`);

        setData({
          products: allProducts,
          countries,
          exchangeRates,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('❌ 数据加载错误:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    // 获取所有产品类别
    const getProductCategories = async (baseUrl) => {
      try {
        const mainIndexUrl = `${baseUrl}data/prices/index.json`;
        console.log('📖 加载主索引文件:', mainIndexUrl);
        
        const response = await fetch(mainIndexUrl);
        if (!response.ok) {
          throw new Error(`主索引文件加载失败: ${response.status}`);
        }
        
        const indexData = await response.json();
        console.log('📊 主索引信息:', {
          categories: indexData.categories,
          lastUpdated: indexData.lastUpdated,
          categoryCount: indexData.categoryCount
        });
        
        return indexData.categories || [];
      } catch (error) {
        console.error('❌ 无法加载主索引文件:', error);
        // 如果主索引文件不存在，返回空数组而不是默认值
        // 因为现在我们依赖自动生成的索引文件
        throw new Error('主索引文件不存在，请确保构建过程正常运行');
      }
    };

    // 获取指定类别的文件列表
    const getCategoryFiles = async (baseUrl, category) => {
      try {
        const indexUrl = `${baseUrl}data/prices/${category}/index.json`;
        console.log(`📖 加载 ${category} 索引文件:`, indexUrl);
        
        const response = await fetch(indexUrl);
        if (!response.ok) {
          throw new Error(`${category} 索引文件加载失败: ${response.status}`);
        }
        
        const indexData = await response.json();
        console.log(`📊 ${category} 索引信息:`, {
          validFileCount: indexData.validFileCount,
          invalidFileCount: indexData.invalidFileCount,
          lastUpdated: indexData.lastUpdated
        });

        // 如果有无效文件，给出警告
        if (indexData.invalidFiles && indexData.invalidFiles.length > 0) {
          console.warn(`⚠️  ${category} 类别包含无效文件:`, indexData.invalidFiles);
        }
        
        return indexData.files || [];
      } catch (error) {
        console.error(`❌ 无法加载 ${category} 索引文件:`, error);
        throw error; // 重新抛出错误，让上层处理
      }
    };

    // 加载国家数据
    const loadCountries = async (baseUrl) => {
      try {
        const countriesUrl = `${baseUrl}data/country_info/cr.json`;
        console.log('📖 加载国家数据:', countriesUrl);
        
        const response = await fetch(countriesUrl);
        if (!response.ok) {
          throw new Error(`国家数据加载失败: ${response.status}`);
        }
        
        const countries = await response.json();
        console.log('✅ 国家数据加载完成:', countries.length);
        return countries;
      } catch (error) {
        console.error('❌ 加载国家数据失败:', error);
        throw error;
      }
    };

    // 加载汇率数据
    const loadExchangeRates = async (baseUrl) => {
      try {
        const ratesUrl = `${baseUrl}data/exchange_rates/latest.json`;
        console.log('📖 加载汇率数据:', ratesUrl);
        
        const response = await fetch(ratesUrl);
        if (!response.ok) {
          throw new Error(`汇率数据加载失败: ${response.status}`);
        }
        
        const exchangeRates = await response.json();
        console.log('✅ 汇率数据加载完成');
        return exchangeRates;
      } catch (error) {
        console.error('❌ 加载汇率数据失败:', error);
        throw error;
      }
    };

    loadData();
  }, []);

  return data;
};