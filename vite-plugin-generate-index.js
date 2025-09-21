import fs from 'fs';
import path from 'path';

export function generateIndexPlugin() {
  return {
    name: 'generate-index',
    buildStart() {
      generateIndexFiles();
    },
    configureServer(server) {
      // 开发模式下也生成索引文件
      generateIndexFiles();
      
      // 监听文件变化，自动重新生成索引
      const pricesPath = path.resolve('public/data/prices');
      if (fs.existsSync(pricesPath)) {
        server.watcher.add(pricesPath);
        server.watcher.on('add', (filePath) => {
          if (filePath.includes('public/data/prices') && filePath.endsWith('.json') && !filePath.includes('index.json')) {
            console.log('检测到新文件，重新生成索引:', filePath);
            generateIndexFiles();
          }
        });
        server.watcher.on('unlink', (filePath) => {
          if (filePath.includes('public/data/prices') && filePath.endsWith('.json') && !filePath.includes('index.json')) {
            console.log('检测到文件删除，重新生成索引:', filePath);
            generateIndexFiles();
          }
        });
      }
    }
  };
}

function generateIndexFiles() {
  const pricesPath = path.resolve('public/data/prices');
  
  if (!fs.existsSync(pricesPath)) {
    console.log('prices 文件夹不存在，跳过索引生成');
    return;
  }

  const categories = [];

  try {
    // 读取所有子文件夹
    const items = fs.readdirSync(pricesPath, { withFileTypes: true });
    
    for (const item of items) {
      if (item.isDirectory()) {
        const categoryName = item.name;
        const categoryPath = path.join(pricesPath, categoryName);
        
        // 读取文件夹中的所有 JSON 文件（排除 index.json）
        const files = fs.readdirSync(categoryPath)
          .filter(file => file.endsWith('.json') && file !== 'index.json')
          .sort(); // 按字母顺序排序

        if (files.length > 0) {
          categories.push(categoryName);

          // 生成类别索引文件
          const categoryIndexPath = path.join(categoryPath, 'index.json');
          const categoryIndexData = {
            category: categoryName,
            files: files,
            lastUpdated: new Date().toISOString(),
            fileCount: files.length
          };

          fs.writeFileSync(categoryIndexPath, JSON.stringify(categoryIndexData, null, 2), 'utf8');
          console.log(`✅ 生成 ${categoryName} 索引文件: ${files.length} 个文件`);
        }
      }
    }

    // 生成主索引文件
    const mainIndexPath = path.join(pricesPath, 'index.json');
    const mainIndexData = {
      categories: categories.sort(),
      lastUpdated: new Date().toISOString(),
      categoryCount: categories.length
    };

    fs.writeFileSync(mainIndexPath, JSON.stringify(mainIndexData, null, 2), 'utf8');
    console.log(`✅ 生成主索引文件: ${categories.length} 个类别`);
    console.log('📁 发现的类别:', categories);

  } catch (error) {
    console.error('❌ 生成索引文件时出错:', error);
  }
}