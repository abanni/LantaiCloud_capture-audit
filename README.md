# 兰台云数智档案

> 建设工程档案全流程管理 SaaS 原型系统

基于 React 19 + TypeScript 构建的档案管理前端原型，覆盖**著录端**与**审核端**两大业务模块。

---

## 功能模块

| 模块 | 路由 | 说明 |
|------|------|------|
| **著录工作台** | `/capture-dashboard` | 项目卡片、状态图例、消息中心 |
| **新建档案** | `/newproject` | 分步向导：档案分类 → 基本信息 → 承诺书 → 审核登记 |
| **我的档案** | `/projects` | 档案项目列表、成员管理、单位工程管理 |
| **企业管理** | `/enterprise` | 基本信息、团队成员、安全管理、版本订阅、外部档案馆关联 |
| **审核工作台** | `/audit-dashboard` | 审核概览、统计卡片、待办任务 |
| **档案登记** | `/audit-registration` | 移交登记文档查看、文件核对 |
| **档案审核** | `/audit-projects` | 树形节点审批、问题追踪、流程推进 |
| **项目信息** | `/audit-project-info` | 审计项目详情 |
| **档案指导** | `/audit-guidance` | 档案整理指导说明（国家标准） |
| **统计分析** | `/audit-statistics` | 审核统计图表 |
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

# 2. 启动开发服务器
npm run dev
# → http://localhost:3000

# 3. 运行测试
npm test
```

## 项目结构

```
├── App.tsx                    # 应用入口：路由分发、认证流程、主布局
├── index.tsx / index.html     # 渲染入口
├── index.css                  # 全局样式 + 设计系统 Token
├── types.ts                   # 核心类型（Project/Identity/Organization 等）
├── AGENTS.md                  # 角色体系规范（企业级 + 项目级）
├── vite.config.ts             # Vite + Tailwind + React 配置
│
├── context/
│   └── AppContext.tsx          # 全局状态：认证、身份切换、项目管理
│
├── components/
│   ├── common/                # Sidebar、TopBar、UserSwitcher、路由守卫、文件图标
│   ├── dashboard/             # 登录、工作台、企业管理、个人设置、项目卡片
│   ├── capture/               # 著录端：项目列表、新建向导、云盘、工作区、成员管理
│   └── audit/                 # 审核端：树形审批、项目信息、登记、指导、统计
│
├── data/                      # Mock 数据（3 个组织的项目和文件）
├── styles/                    # 页面间距统一配置
└── docs/
    ├── business-logic.md      # 业务逻辑图（Mermaid 流程图 + 数据模型 + 工作流）
    ├── SOURCE_MAP.md          # 源码文件功能映射
    └── ANALYSIS_REPORT.md     # 大文件拆分方案报告
```

## 演示用户

| 用户 | 身份 | 端侧 |
|------|------|------|
| 张三（139****1234） | 多组织管理员 | 著录端 |
| 李进（177****8899） | 个人体验用户 | 著录端 |
| 徐琴（0512****5678） | 昆山市城建档案馆审核人员 | **审核端** |

## 核心数据模型

```
User ──→ Identity ──→ Organization  （多身份/多组织切换）
            │
            └── Project ──→ ArchiveEngineering ──→ ArchiveVolume ──→ ArchiveFile
                │
                └── ProjectMember（项目成员与角色）
```

## 角色体系

详见 `AGENTS.md`，涵盖：
- 企业级角色：法定代表人、管理员、成员
- 项目级角色：项目管理员、参与人员、观察人员、外部参与者
- 各角色操作权限矩阵

## NPM 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（端口 3000） |
| `npm run build` | 生产构建 |
| `npm run preview` | 预览生产构建 |
| `npm test` | 运行测试 |
