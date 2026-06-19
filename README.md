# 兰台云数智档案

> 建设工程档案全流程管理 SaaS 原型系统

基于 React 19 + TypeScript 构建的档案管理前端原型，覆盖档案著录、审核、馆藏管理、利用服务等核心业务环节。

---

## 功能模块

| 模块 | 路由 | 说明 |
|------|------|------|
| **工作台** | `/dashboard` | 项目卡片、引导面板、消息中心、档案馆统计 |
| **项目著录** | `/projects` | 著录项目列表 → 四步著录工作台（选文件/分类/组卷/审核） |
| **新建档案向导** | wizard 内嵌 | 6 步向导：外部档案馆选配 → 类型 → 子类 → 基本信息 → 承诺书 → 审核结果 |
| **企业管理** | `/enterprise` | 基本信息、团队管理、安全设置、版本订阅、外部档案馆关联 |
| **档案审核** | `/audit-*` | 审核工作台、档案登记、树形节点审批、项目信息、档案指导、统计分析 |
| **数字馆藏** | `/archive-center` | 档案列表、统计图表（Recharts 柱状图/饼图）、四级树状详情 |
| **综合查询** | `/archive-search` | 全文检索 + 综合检索双模式，动态条件构建器 |
| **档案利用** | `/archive-apply` / `/archive-approve` | 借阅申请、审批面板、借阅篮、审计日志 |
| **个人设置** | `/settings` | 个人资料、手机换绑、密码修改、第三方绑定 |

## 技术栈

| 类别 | 工具 |
|------|------|
| 框架 | React 19, TypeScript 5.8 |
| 构建 | Vite 6 + @vitejs/plugin-react |
| 样式 | Tailwind CSS 4 + 自定义主题色（档案蓝 + 暖灰体系） |
| 路由 | React Router DOM 7（HashRouter） |
| 图表 | Recharts 3 |
| 图标 | Lucide React |
| 动画 | Motion 12 |
| 状态管理 | React Context（认证/身份/项目） |
| 测试 | Vitest 4 + Testing Library + jsdom |

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 设置 Gemini API 密钥（当前仅用于编译时注入）
cp .env.local.example .env.local
# 编辑 .env.local 填入 GEMINI_API_KEY

# 3. 启动开发服务器
npm run dev
# → http://localhost:3000

# 4. 运行测试
npm test
```

## 项目结构

```
├── App.tsx                    # 应用入口：路由分发、认证流程、主布局
├── index.tsx / index.html     # 渲染入口
├── index.css                  # 全局样式 + 设计系统 Token
├── types.ts                   # 核心类型（Project/Identity/Organization 等）
├── vite.config.ts             # Vite + Tailwind + React 配置
│
├── context/
│   └── AppContext.tsx          # 全局状态：认证、身份切换、项目管理
│
├── components/
│   ├── common/                # Sidebar、TopBar、UserSwitcher、路由守卫、文件图标
│   ├── dashboard/             # 登录、工作台、企业管理、个人设置、项目卡片
│   ├── integrator/            # 著录模块：项目列表、云盘、四步工作台、新建向导
│   ├── audit/                 # 审核模块：树形审批、项目信息、登记、指导、统计
│   ├── collection/            # 馆藏：档案馆、高级搜索、详情浏览
│   └── utilization/           # 利用：借阅申请/审批、借阅篮、登记卡
│
├── data/                      # Mock 数据（3 个组织的项目和文件）
├── styles/                    # 页面间距统一配置
├── src/__tests__/             # Vitest 测试用例（7 个）
└── docs/
    └── business-logic.md      # 业务逻辑图（Mermaid 流程图 + 数据模型 + 工作流）
```

## 核心数据模型

```
User ──→ Identity ──→ Organization  （多身份/多组织切换）
            │
            └── Project ──→ ArchiveEngineering ──→ ArchiveVolume ──→ ArchiveFile
```

系统中预设 4 个身份：无无科技（管理员）、清陶动力（成员）、常熟建工（法定代表人）、李进（个人档案员）。

## 审核工作流

```
新建 → 登记 → 一审 → 二审 → 通过 → 归档
                ↑退回↓        （节点级状态跟踪 + 问题管理）
```

## 开发说明

- 当前为纯前端原型，所有数据为 Mock 内置，无后端依赖
- 项目从 Google AI Studio 迁移，部分大文件已按 `ANALYSIS_REPORT.md` 拆分
- 著录工作台 4 步流程各有独立子组件目录（`classification/`、`organization/`）
- 审核模块的树形组件位于 `audit/explorer/` 子目录

## NPM 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（端口 3000） |
| `npm run build` | 生产构建 |
| `npm run preview` | 预览生产构建 |
| `npm test` | 运行测试 |
