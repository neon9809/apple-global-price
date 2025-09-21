# 部署指南

本文档详细介绍了如何将 Apple Global Price 项目部署到 GitHub Pages 以及其他平台。

## 📋 目录

1. [GitHub Pages 部署](#github-pages-部署)
2. [本地构建和预览](#本地构建和预览)
3. [自定义域名配置](#自定义域名配置)
4. [其他部署平台](#其他部署平台)
5. [故障排除](#故障排除)

## 🚀 GitHub Pages 部署

### 自动部署（推荐）

项目已配置 GitHub Actions 自动部署流程，每次推送到 `main` 分支时会自动构建和部署。

#### 步骤 1: Fork 仓库

1. 访问 [apple-global-price](https://github.com/your-username/apple-global-price) 仓库
2. 点击右上角的 "Fork" 按钮
3. 选择您的 GitHub 账户作为目标

#### 步骤 2: 启用 GitHub Pages

1. 进入您 Fork 的仓库
2. 点击 "Settings" 选项卡
3. 在左侧菜单中找到 "Pages"
4. 在 "Source" 部分选择 "GitHub Actions"
5. 保存设置

#### 步骤 3: 配置仓库权限

1. 在仓库设置中，找到 "Actions" → "General"
2. 在 "Workflow permissions" 部分选择 "Read and write permissions"
3. 勾选 "Allow GitHub Actions to create and approve pull requests"
4. 点击 "Save" 保存设置

#### 步骤 4: 触发部署

1. 对仓库进行任何更改（如编辑 README.md）
2. 提交并推送到 `main` 分支
3. GitHub Actions 将自动开始构建和部署流程
4. 部署完成后，您的网站将在 `https://your-username.github.io/apple-global-price/` 可用

### 手动部署

如果您需要手动部署，可以按照以下步骤：

#### 步骤 1: 克隆仓库

```bash
git clone https://github.com/your-username/apple-global-price.git
cd apple-global-price
```

#### 步骤 2: 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

#### 步骤 3: 构建项目

```bash
# 使用 pnpm
pnpm run build

# 或使用 npm
npm run build
```

#### 步骤 4: 部署到 gh-pages 分支

```bash
# 安装 gh-pages 工具
npm install -g gh-pages

# 部署到 gh-pages 分支
gh-pages -d dist
```

## 🔧 本地构建和预览

### 开发环境

```bash
# 启动开发服务器
pnpm run dev

# 访问 http://localhost:5173
```

### 生产环境预览

```bash
# 构建生产版本
pnpm run build

# 预览构建结果
pnpm run preview

# 访问 http://localhost:4173
```

### 构建输出说明

构建完成后，`dist` 目录将包含以下文件：

```
dist/
├── index.html              # 主页面
├── assets/                 # 静态资源
│   ├── index-[hash].css    # 样式文件
│   └── index-[hash].js     # JavaScript 文件
├── data/                   # 数据文件
│   ├── prices/             # 产品价格数据
│   ├── country_info/       # 国家信息
│   └── exchange_rates/     # 汇率数据
├── locales/                # 多语言文件
│   ├── en/                 # 英文
│   └── zh/                 # 中文
└── favicon.ico             # 网站图标
```

## 🌐 自定义域名配置

如果您想使用自定义域名，请按照以下步骤：

### 步骤 1: 添加 CNAME 文件

在 `public` 目录下创建 `CNAME` 文件：

```bash
echo "your-domain.com" > public/CNAME
```

### 步骤 2: 配置 DNS

在您的域名提供商处配置 DNS 记录：

#### 对于根域名（example.com）

添加 A 记录指向 GitHub Pages 的 IP 地址：

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

#### 对于子域名（www.example.com）

添加 CNAME 记录指向：

```
your-username.github.io
```

### 步骤 3: 在 GitHub 中配置

1. 进入仓库设置的 "Pages" 页面
2. 在 "Custom domain" 字段中输入您的域名
3. 勾选 "Enforce HTTPS"
4. 保存设置

## 🌍 其他部署平台

### Vercel

1. 访问 [Vercel](https://vercel.com)
2. 连接您的 GitHub 账户
3. 导入 apple-global-price 仓库
4. Vercel 会自动检测 Vite 项目并配置构建设置
5. 点击 "Deploy" 开始部署

### Netlify

1. 访问 [Netlify](https://netlify.com)
2. 点击 "New site from Git"
3. 连接您的 GitHub 账户并选择仓库
4. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 点击 "Deploy site"

### Firebase Hosting

1. 安装 Firebase CLI：
```bash
npm install -g firebase-tools
```

2. 登录 Firebase：
```bash
firebase login
```

3. 初始化项目：
```bash
firebase init hosting
```

4. 配置 `firebase.json`：
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

5. 构建并部署：
```bash
npm run build
firebase deploy
```

## 🔍 故障排除

### 常见问题

#### 1. 页面显示 404 错误

**原因**: 路径配置不正确

**解决方案**: 检查 `vite.config.js` 中的 `base` 配置：

```javascript
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/apple-global-price/' : '/',
  // ... 其他配置
})
```

#### 2. 静态资源加载失败

**原因**: 资源路径不正确

**解决方案**: 确保所有静态资源使用相对路径，并且 `base` 配置正确。

#### 3. GitHub Actions 构建失败

**原因**: 依赖安装或构建过程出错

**解决方案**: 
1. 检查 `.github/workflows/deploy.yml` 配置
2. 查看 Actions 日志了解具体错误
3. 确保 `package.json` 中的脚本正确

#### 4. 数据文件无法加载

**原因**: 数据文件路径不正确或文件格式错误

**解决方案**:
1. 确保数据文件在 `public/data` 目录下
2. 检查 JSON 文件格式是否正确
3. 验证文件路径在 `useData.js` 中是否正确

### 调试技巧

#### 1. 本地调试

```bash
# 启用详细日志
DEBUG=* pnpm run dev

# 检查构建输出
pnpm run build --debug
```

#### 2. 网络调试

在浏览器开发者工具中：
1. 打开 Network 选项卡
2. 刷新页面
3. 检查是否有资源加载失败
4. 查看具体的错误信息

#### 3. 控制台调试

在浏览器控制台中检查 JavaScript 错误：
1. 按 F12 打开开发者工具
2. 切换到 Console 选项卡
3. 查看是否有错误信息

### 性能优化

#### 1. 构建优化

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  }
})
```

#### 2. 资源压缩

确保启用 gzip 压缩：

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { compression } from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    // ... 其他插件
    compression()
  ]
})
```

## 📞 获取帮助

如果您在部署过程中遇到问题，可以通过以下方式获取帮助：

1. **GitHub Issues**: 在项目仓库中创建 Issue
2. **文档**: 查阅 [GitHub Pages 官方文档](https://docs.github.com/en/pages)
3. **社区**: 在相关技术社区寻求帮助

## 🔄 更新和维护

### 定期更新

1. **依赖更新**: 定期更新项目依赖
```bash
pnpm update
```

2. **数据更新**: 定期更新产品价格和汇率数据

3. **安全更新**: 及时应用安全补丁

### 监控和分析

1. **Google Analytics**: 添加网站分析
2. **性能监控**: 使用 Lighthouse 检查性能
3. **错误监控**: 集成错误追踪服务

---

通过遵循本指南，您应该能够成功部署 Apple Global Price 项目。如有任何问题，请随时联系我们。

