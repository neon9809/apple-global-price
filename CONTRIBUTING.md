# 贡献指南

感谢您对 Apple Global Price 项目的关注！我们欢迎各种形式的贡献，包括但不限于数据更新、功能改进、错误修复和文档完善。

## 📋 目录

1. [贡献方式](#贡献方式)
2. [数据贡献](#数据贡献)
3. [代码贡献](#代码贡献)
4. [文档贡献](#文档贡献)
5. [问题报告](#问题报告)
6. [开发环境设置](#开发环境设置)
7. [代码规范](#代码规范)
8. [提交规范](#提交规范)

## 🤝 贡献方式

您可以通过以下方式为项目做出贡献：

- **数据贡献**: 添加或更新 Apple 产品价格信息
- **功能开发**: 开发新功能或改进现有功能
- **错误修复**: 修复发现的 Bug
- **文档改进**: 完善项目文档
- **问题报告**: 报告 Bug 或提出改进建议
- **翻译工作**: 添加新的语言支持

## 📊 数据贡献

数据贡献是最直接和重要的贡献方式。我们需要准确、及时的价格信息。

### 数据来源要求

- **官方渠道**: 价格信息必须来自 Apple 官方网站或授权经销商
- **时效性**: 数据应该是最新的，建议在获取后 24 小时内提交
- **准确性**: 确保价格、税费、货币等信息准确无误

### 添加新产品价格

1. **找到对应文件**: 在 `public/data/prices/` 目录下找到对应的产品类别
2. **编辑 JSON 文件**: 按照现有格式添加新的价格条目
3. **验证格式**: 确保 JSON 格式正确

#### 价格数据格式示例

```json
{
  "model": "iPhone 17 Pro",
  "storage": "256GB",
  "net_price": 1099.0,
  "tax_fees": 0.0,
  "total_price": 1099.0,
  "currency": "USD",
  "launch_date": "2025-09-20",
  "notes": "",
  "country_code": "US",
  "contributor": {
    "name": "your_github_username",
    "profile_url": "https://github.com/your_github_username",
    "commit_date": "2025-09-20T10:00:00Z"
  }
}
```

#### 字段说明

- `model`: 产品型号（必填）
- `storage`: 存储容量（必填）
- `net_price`: 净价格，不含税（必填）
- `tax_fees`: 税费金额（必填，无税费时填 0）
- `total_price`: 消费者实际支付总价（必填）
- `currency`: 货币代码，使用 ISO 4217 标准（必填）
- `launch_date`: 发售日期，格式 YYYY-MM-DD（必填）
- `notes`: 备注信息（可选）
- `country_code`: 国家/地区代码，使用 ISO 3166-1 alpha-2 标准（必填）
- `contributor`: 贡献者信息（自动生成）

### 更新现有价格

1. **找到对应条目**: 在相应的 JSON 文件中找到需要更新的价格条目
2. **更新信息**: 修改价格、税费等相关信息
3. **更新贡献者信息**: 更新 `contributor` 字段中的信息

### 添加新国家/地区

如果您要添加新的国家或地区，需要：

1. **更新国家信息**: 在 `public/data/country_info/cr.json` 中添加新的国家信息
2. **添加价格数据**: 在相应的产品文件中添加该国家的价格信息

#### 国家信息格式示例

```json
{
  "code": "US",
  "name_en": "United States",
  "name_zh": "美国",
  "name_local": "United States",
  "tax_info": {
    "can_refund": true,
    "refund_rate": "variable",
    "notes": "Sales tax varies by state. Tourists may be eligible for tax refunds in some states."
  }
}
```

## 💻 代码贡献

### 开发流程

1. **Fork 仓库**: 点击仓库页面右上角的 "Fork" 按钮
2. **克隆仓库**: 将您的 Fork 克隆到本地
3. **创建分支**: 为您的功能创建一个新分支
4. **开发功能**: 在新分支上进行开发
5. **测试代码**: 确保代码通过所有测试
6. **提交更改**: 提交您的更改
7. **推送分支**: 将分支推送到您的 Fork
8. **创建 PR**: 创建 Pull Request

### 功能开发指南

#### 添加新功能

1. **需求分析**: 确保新功能符合项目目标
2. **设计方案**: 设计功能的实现方案
3. **编写代码**: 实现功能代码
4. **编写测试**: 为新功能编写测试用例
5. **更新文档**: 更新相关文档

#### 常见功能类型

- **新产品支持**: 添加对新 Apple 产品的支持
- **数据可视化**: 改进价格展示和对比功能
- **用户体验**: 优化界面和交互体验
- **性能优化**: 提升应用性能
- **国际化**: 添加新的语言支持

### 组件开发规范

#### React 组件

```jsx
// 使用函数组件和 Hooks
import React, { useState, useEffect } from 'react';

const ProductCard = ({ product, onSelect }) => {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    // 副作用逻辑
  }, []);

  return (
    <div className="product-card">
      {/* 组件内容 */}
    </div>
  );
};

export default ProductCard;
```

#### 样式规范

- 使用 Tailwind CSS 类名
- 遵循响应式设计原则
- 支持暗色模式

```jsx
<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
    产品标题
  </h3>
</div>
```

## 📝 文档贡献

### 文档类型

- **README.md**: 项目介绍和基本使用说明
- **DEPLOYMENT.md**: 部署指南
- **CONTRIBUTING.md**: 贡献指南（本文档）
- **API 文档**: 数据格式和接口说明
- **用户指南**: 详细的使用说明

### 文档编写规范

- 使用 Markdown 格式
- 保持结构清晰，使用适当的标题层级
- 提供代码示例和截图
- 确保内容准确、及时更新

## 🐛 问题报告

### 报告 Bug

在报告 Bug 时，请提供以下信息：

1. **问题描述**: 清楚地描述遇到的问题
2. **重现步骤**: 详细的重现步骤
3. **预期行为**: 描述您期望的正确行为
4. **实际行为**: 描述实际发生的情况
5. **环境信息**: 浏览器版本、操作系统等
6. **截图或录屏**: 如果可能，提供视觉证据

#### Bug 报告模板

```markdown
## Bug 描述
简要描述遇到的问题

## 重现步骤
1. 打开应用
2. 点击某个按钮
3. 观察到错误

## 预期行为
描述您期望发生的情况

## 实际行为
描述实际发生的情况

## 环境信息
- 浏览器: Chrome 120.0.0.0
- 操作系统: Windows 11
- 设备: Desktop

## 附加信息
其他相关信息或截图
```

### 功能请求

在提出功能请求时，请说明：

1. **功能描述**: 详细描述建议的功能
2. **使用场景**: 说明功能的使用场景
3. **预期收益**: 解释功能的价值和好处
4. **实现建议**: 如果有想法，可以提供实现建议

## 🛠️ 开发环境设置

### 系统要求

- Node.js 18 或更高版本
- pnpm（推荐）或 npm
- Git

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/your-username/apple-global-price.git
cd apple-global-price
```

2. **安装依赖**
```bash
pnpm install
```

3. **启动开发服务器**
```bash
pnpm run dev
```

4. **运行测试**
```bash
pnpm run test
```

5. **构建项目**
```bash
pnpm run build
```

### 开发工具推荐

- **编辑器**: VS Code
- **扩展**: 
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
  - ESLint

### 调试技巧

1. **浏览器开发者工具**: 使用 Chrome DevTools 进行调试
2. **React Developer Tools**: 安装 React 开发者工具扩展
3. **网络监控**: 监控 API 请求和数据加载
4. **性能分析**: 使用 Lighthouse 分析性能

## 📏 代码规范

### JavaScript/React 规范

- 使用 ES6+ 语法
- 优先使用函数组件和 Hooks
- 使用 const/let 而不是 var
- 使用箭头函数
- 保持函数简洁，单一职责

```javascript
// 好的示例
const formatPrice = (price, currency) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

// 避免的示例
function formatPrice(price, currency) {
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  });
  return formatter.format(price);
}
```

### 命名规范

- **组件**: 使用 PascalCase（如 `ProductCard`）
- **函数**: 使用 camelCase（如 `formatPrice`）
- **常量**: 使用 UPPER_SNAKE_CASE（如 `API_BASE_URL`）
- **文件名**: 使用 kebab-case 或 PascalCase

### 注释规范

```javascript
/**
 * 格式化价格显示
 * @param {number} price - 价格数值
 * @param {string} currency - 货币代码
 * @returns {string} 格式化后的价格字符串
 */
const formatPrice = (price, currency) => {
  // 实现逻辑
};
```

## 📝 提交规范

### 提交信息格式

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 提交类型

- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 提交示例

```bash
# 新功能
git commit -m "feat: add price comparison chart"

# 错误修复
git commit -m "fix: resolve currency conversion issue"

# 文档更新
git commit -m "docs: update deployment guide"

# 数据更新
git commit -m "data: update iPhone 17 Pro prices for US market"
```

## 🔄 Pull Request 流程

### 创建 Pull Request

1. **确保分支最新**: 在创建 PR 前，确保您的分支基于最新的 main 分支
2. **填写 PR 模板**: 详细描述您的更改
3. **关联 Issue**: 如果 PR 解决了某个 Issue，请在描述中关联
4. **请求审查**: 指定合适的审查者

### PR 模板

```markdown
## 更改描述
简要描述此 PR 的更改内容

## 更改类型
- [ ] 新功能
- [ ] 错误修复
- [ ] 文档更新
- [ ] 数据更新
- [ ] 其他

## 测试
- [ ] 本地测试通过
- [ ] 添加了新的测试用例
- [ ] 所有现有测试通过

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 更新了相关文档
- [ ] 提交信息符合规范

## 相关 Issue
关闭 #123
```

### 代码审查

所有 PR 都需要经过代码审查：

1. **自动检查**: GitHub Actions 会自动运行测试和检查
2. **人工审查**: 项目维护者会审查代码质量和功能
3. **反馈处理**: 根据审查反馈进行必要的修改
4. **合并**: 审查通过后，PR 将被合并到主分支

## 🏆 贡献者认可

我们重视每一位贡献者的努力：

- **贡献者列表**: 在 README 中展示贡献者
- **数据贡献**: 在数据文件中记录贡献者信息
- **特殊贡献**: 对重大贡献给予特别认可

## 📞 获取帮助

如果您在贡献过程中遇到任何问题：

1. **查阅文档**: 首先查看项目文档
2. **搜索 Issues**: 查看是否有类似问题
3. **创建 Issue**: 如果找不到答案，创建新的 Issue
4. **联系维护者**: 通过 GitHub 或邮件联系项目维护者

## 🙏 致谢

感谢您考虑为 Apple Global Price 项目做出贡献！您的参与使这个项目变得更好。

---

通过遵循本指南，您可以有效地为项目做出贡献。我们期待您的参与！

