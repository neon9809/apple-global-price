# 苹果全球价格
> 🍎 通过高级筛选和货币转换功能，比较全球苹果产品价格
一款全面的 React 应用程序，用于比较不同国家和地区苹果产品的价格，支持多语言、高级筛选、货币转换和响应式设计。
## ✨ 增强功能
### 🌍 全球价格对比
- **多国支持**：覆盖10+国家和地区的价格对比
- **实时数据**：由社区驱动的价格数据，定期更新
- **税费明细**：净价、税费及总成本的详细拆解
- **退税信息**：退税资格与税率的说明
### 🔍 高级筛选与搜索
- **多国选择筛选器**：一键全选/清除，支持多国同时比价
- **智能搜索**：支持产品型号、存储容量或国家名称检索
- **高级字段筛选**：按任意产品属性（型号、存储、价格、上市日期等）筛选排序
- **动态排序**：支持价格、型号、国家等字段升序/降序排序
- **筛选持久化**：刷新页面后筛选条件自动保留
### 💱 货币转换
- **实时汇率**：将价格转换为首选货币
- **双币显示**：原始价格与转换价格并列呈现
- **汇率信息**：显示当前汇率及最后更新时间
- **税费计算**：转换税额并双币显示税率
### 🌐 国际化支持
- **多语言支持**：全面支持英语和简体中文
- **动态语言切换**：无需刷新页面即可即时切换语言
- **本地化内容**：所有界面元素、标签和提示信息均完成翻译
- **文化适配**：日期格式、数字格式及货币显示均按地区调整
### 🎨 现代化UI/UX
- **深浅主题**：自由切换浅色/深色模式
- **响应式设计**：适配桌面端、平板及移动设备
- **现代组件**：基于shadcn/ui构建，确保设计一致性与无障碍访问
- **流畅动画**：细腻的过渡效果与悬停交互
- **网格/列表视图**：自由切换卡片网格与列表布局
### 🔧 技术特性
- React 19：采用最新React框架，支持现代钩子与模式
- TypeScript就绪：全面支持TypeScript类型安全
- Vite构建：快速开发与优化生产构建
- GitHub Actions：自动部署至GitHub Pages
- PWA就绪：渐进式Web应用功能
- **SEO优化**：搜索引擎元标签与结构化数据
## 🚀 快速入门
### 环境要求
- Node.js 18+
- pnpm（推荐）或 npm
### 安装步骤
```bash
# 克隆仓库
git clone https://github.com/yourusername/apple-global-price.git
cd apple-global-price
# 安装依赖
pnpm install
# 启动开发服务器
pnpm run dev
# 构建生产环境
pnpm run build
# 预览生产构建
pnpm run preview
```
### 开发环境
```bash
# 启用主机访问的开发模式
pnpm run dev --host
# 运行代码检查
pnpm run lint
# 运行类型检查
pnpm run type-check
```
## 📁 项目结构
```
.
├── CONTRIBUTING.md
├── DEPLOYMENT.md
├── LICENSE
├── README.md
├── components.json
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── project_files.txt
├── public
│   ├── data
│   │   ├── country_info
│   │   │   └── cr.json
│   │   ├── exchange_rates
│   │   │   └── latest.json
│   │   └── prices
│   │       ├── Mac
│   │       ├── iPad
│   │       └── iPhone
│   │           ├── iphone_17_pro.json
│   │           └── iphone_17_pro_max.json
│   ├── favicon.ico
│   └── locales
│       ├── en
│       │   └── translation.json
│       └── zh
│           └── translation.json
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── AdvancedFilters.jsx
│   │   ├── CurrencyConverter.jsx
│   │   ├── ExchangeRateConverter.jsx
│   │   ├── Header.jsx
│   │   ├── MultiSelectCountries.jsx
│   │   ├── ProductFilter.jsx
│   │   ├── ProductLineSelector.jsx
│   │   ├── ProductTable.jsx
│   │   ├── SecondaryFilters.jsx
│   │   ├── SimpleHeader.jsx
│   │   └── ui
│   │       ├── accordion.jsx
│   │       ├── alert-dialog.jsx
│   │       ├── alert.jsx
│   │       ├── aspect-ratio.jsx
│   │       ├── avatar.jsx
│   │       ├── badge.jsx
│   │       ├── breadcrumb.jsx
│   │       ├── button.jsx
│   │       ├── calendar.jsx
│   │       ├── card.jsx
│   │       ├── carousel.jsx
│   │       ├── chart.jsx
│   │       ├── checkbox.jsx
│   │       ├── collapsible.jsx
│   │       ├── command.jsx
│   │       ├── context-menu.jsx
│   │       ├── dialog.jsx
│   │       ├── drawer.jsx
│   │       ├── dropdown-menu.jsx
│   │       ├── form.jsx
│   │       ├── hover-card.jsx
│   │       ├── input-otp.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       ├── menubar.jsx
│   │       ├── navigation-menu.jsx
│   │       ├── pagination.jsx
│   │       ├── popover.jsx
│   │       ├── progress.jsx
│   │       ├── radio-group.jsx
│   │       ├── resizable.jsx
│   │       ├── scroll-area.jsx
│   │       ├── select.jsx
│   │       ├── separator.jsx
│   │       ├── sheet.jsx
│   │       ├── sidebar.jsx
│   │       ├── skeleton.jsx
│   │       ├── slider.jsx
│   │       ├── sonner.jsx
│   │       ├── switch.jsx
│   │       ├── table.jsx
│   │       ├── tabs.jsx
│   │       ├── textarea.jsx
│   │       ├── toggle-group.jsx
│   │       ├── toggle.jsx
│   │       └── tooltip.jsx
│   ├── contexts
│   │   └── ThemeContext.jsx
│   ├── hooks
│   │   ├── use-mobile.js
│   │   └── useData.js
│   ├── index.css
│   ├── lib
│   │   ├── i18n.js
│   │   └── utils.js
│   └── main.jsx
└── vite.config.js

19 directories, 86 files
```
## 🌍 增强型数据结构
### 产品数据格式
```json
  {
    "model": "iPhone Air",
    "storage": "512GB",
    "retail_price": 1199.0,
    "currency": "USD",
    "launch_date": "2025-09-19",
    "country_code": "US",
    "contributor": "Perplexity AI"
  }
```
### 国家信息格式
```json
  {
    "code": "CN",
    "name_en": "China",
    "name_zh": "中国",
    "name_local": "中国",
    "tax_info": {
      "can_refund": true,
      "refund_rate": "13%",
      "notes": "Foreign visitors can get a VAT refund on an iPhone in China if it is bought at a designated tax‑refund shop and taken out of the country with the required paperwork under the nationwide “immediate VAT refund” scheme."
    }
  }
```
### 汇率信息格式
五个基准货币：人民币、美元、欧元、英镑、日元
无法直接转换时使用美元作为联系汇率
```json
  {
    "base_currency": "CNY",
    "date": "2025-09-21",
    "rates": {
      "USD": 0.1405,
      "JPY": 20.7864,
      "GBP": 0.1041,
      "EUR": 0.1195,
      "AUD": 0.2128,
      "CAD": 0.1938,
      "KRW": 196.174,
      "HKD": 1.093,
      "SGD": 0.1804
    }
  }
```

## 🔧 高级配置
### 部署配置
项目已配置通过 GitHub Actions 部署至 GitHub Pages。详细说明请参阅 [DEPLOYMENT.md](./DEPLOYMENT.md)。
## 🤝 贡献指南
我们欢迎社区贡献！请查阅 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解规范。
### 新增产品数据
1. 在对应的 `public/data/prices/` 子目录下创建新 JSON 文件
2. 遵循既定数据格式
3. 包含准确的定价信息及规范来源标注
4. 提交包含修改内容的拉取请求
### 新增国家/地区
1. 在`public/data/country_info/cr.json`中更新国家信息
2. 为国家名称添加所有支持语言的翻译
3. 包含相关税费与货币信息
### 翻译贡献
1. 在`public/locales/[语言代码]/`添加新语言文件
2. 更新`src/lib/i18n.js`中的i18n配置
3. 彻底测试新语言


## 📄 许可协议
本项目采用MIT许可证授权 - 详情请参阅[LICENSE](LICENSE)文件。
## 🙏 鸣谢
- **社区贡献者**：感谢所有提供价格数据的贡献者
- **shadcn/ui**：提供精美的组件库
- **React团队**：打造卓越的框架
- **Vite 团队**：提供闪电般的构建工具
- **i18next**：提供国际化支持


