# 兰台云数智档案 — 源码文件功能映射

> 本文档记录项目中所有源代码文件及其对应功能描述。

---

## 顶层文件

| 文件 | 功能 |
|------|------|
| `App.tsx` | 应用主入口，配置 HashRouter 路由分发，管理认证流程、主布局（Sidebar + TopBar + Routes） |
| `index.tsx` | React DOM 渲染入口，挂载 App 组件到 `#root` |
| `index.html` | HTML 模板，包含 `div#root` 挂载点 |
| `index.css` | 全局样式：Tailwind CSS + 自定义主题色（primary/blue 系）+ 滚动条样式 |
| `types.ts` | TypeScript 类型定义：Project、Identity、Organization、ProjectMember 等核心模型 |
| `tsconfig.json` | TypeScript 编译器配置 |
| `vite.config.ts` | Vite 构建配置：React 插件、Tailwind CSS、端口 3000、环境变量 |
| `package.json` | 依赖：React 19、React Router 7、Recharts、Lucide React、Tailwind CSS 4、Motion |

---

## `context/` — 全局状态管理

| 文件 | 功能 |
|------|------|
| `AppContext.tsx` | React Context 全局状态：认证、身份切换、项目管理；含四个 Mock 初始身份（张三/李进/徐琴） |

---

## `data/` — 模拟数据

| 文件 | 功能 |
|------|------|
| `mockCloudFiles.ts` | 云盘模拟文件系统（Word、Excel、PDF、CAD 等 15+ 文件） |
| `mockProjects.ts` | 三个组织的 Mock 项目数据（创建中/整理中/审核中/已入库），含成员列表 |

---

## `components/common/` — 公共组件

| 文件 | 功能 |
|------|------|
| `Sidebar.tsx` | 左侧导航栏：著录端（主页/新建档案/我的档案）与审核端（工作台/指导/登记/审核/项目信息/统计）按角色切换 |
| `TopBar.tsx` | 顶部导航栏：页面标题 + 档案馆选择器 + UserSwitcher 用户切换 |
| `UserSwitcher.tsx` | 用户切换下拉菜单：身份切换、退出、个人信息显示 |
| `ProtectedRoute.tsx` | 路由守卫：认证检查、组织上下文检查、角色权限控制 |
| `ArchiveSwitcher.tsx` | 档案馆切换器 |
| `fileUtils.tsx` | 文件图标工具函数（根据文件类型返回对应图标组件） |

---

## `components/dashboard/` — 登录与工作台

| 文件 | 功能 |
|------|------|
| `Login.tsx` | 登录页：张三（著录端）/ 李进（著录端）/ 徐琴（审核端）三标签切换，审核端特殊颜色标识 |
| `IdentitySelector.tsx` | 身份选择页：登录后展示多组织身份卡片供选择（仅显示当前用户的身份） |
| `Dashboard.tsx` | 著录工作台：昆山城建档案馆上下文 + 项目卡片列表 + 消息中心 |
| `Enterprise.tsx` | 企业管理/档案馆管理页：根据角色切换企业模式与档案馆模式 |
| `NewProjectPage.tsx` | 新建档案页面容器，包装 NewProjectWizard 组件 |
| `PersonalSettings.tsx` | 个人设置：个人资料、安全（密码修改）、通知偏好、账号绑定 |
| `ProjectCard.tsx` | 项目卡片组件：按阶段（创建中/整理中/审核中/已入库）显示不同颜色样式 |
| `OnboardingPanel.tsx` | 新用户引导面板 |
| `UserMessageCenter.tsx` | 消息管理中心 |

### `dashboard/enterprise-tabs/` — 企业/档案馆设置标签页

| 文件 | 功能 |
|------|------|
| `BasicInfoTab.tsx` | 企业基本信息 |
| `TeamTab.tsx` | 团队成员管理：角色标签、成员配置、邀请成员 |
| `SecurityTab.tsx` | 安全管理：所有权移交、退出组织、解散企业，按角色控制可见性 |
| `VersionTab.tsx` | 订阅管理：版本套餐、价格对比、订单历史 |
| `CurrentVersionTab.tsx` | 当前版本信息 |
| `ExternalArchivesTab.tsx` | 外部档案馆关联（仅企业类型组织可见） |
| `ArchiveInfoTab.tsx` | 档案馆信息（审核端） |
| `ArchiveTemplateTab.tsx` | 档案馆模板管理（审核端） |
| `AuditFlowConfigTab.tsx` | 审核流程配置（审核端） |
| `ProjectTypeConfigTab.tsx` | 项目类型配置（审核端） |
| `EngineeringTypeTab.tsx` | 工程类型管理（审核端） |
| `ProjectTypeTreeTab.tsx` | 项目类型树（审核端） |

---

## `components/capture/` — 著录端

| 文件 | 功能 |
|------|------|
| `Workspace.tsx` | 云端工作区四步向导：选择云盘 → 分类 → 组卷 → 审核移交 |
| `CloudDrive.tsx` | 云盘文件浏览器：网格/列表切换、文件选择、上传面板、文件夹导航 |
| `ProjectsList.tsx` | 档案项目列表：按身份过滤、搜索、各阶段操作（继续创建/单位工程/整理著录/成员/删除） |
| `archiveData.ts` | Mock 档案数据定义 + 工具函数 |
| `mockData.ts` | Mock 初始项目数据 |

### `capture/wizards/` — 新建档案向导

| 文件 | 功能 |
|------|------|
| `NewProjectWizard.tsx` | 新建档案分步向导：档案分类 → 基本信息 → 签署承诺书 → 审核登记 |
| `NewCloudWizard.tsx` | 新建云盘空间向导 |
| `constants.ts` | 档案类型定义 + 外部档案馆列表 |

### `capture/wizards/components/` — 向导子组件

| 文件 | 功能 |
|------|------|
| `Label.tsx` | 表单标签组件（支持必填星号） |
| `StepDot.tsx` | 步骤指示器：数字圆圈 + 标签 + 激活/当前状态 |

### `capture/wizards/steps/` — 分步页面

| 文件 | 功能 |
|------|------|
| `StepArchiveType.tsx` | 步骤 1：选择档案类型 |
| `StepSubType.tsx` | 步骤 2：选择二级分类 |
| `StepBasicInfo.tsx` | 步骤 3：填写项目基本信息 |
| `StepCommitment.tsx` | 步骤 4：档案承诺书签署 |
| `StepAuditResult.tsx` | 步骤 5：审核登记结果展示 |

### `capture/workspace/` — 工作区子步骤

| 文件 | 功能 |
|------|------|
| `Step1_CloudDrive.tsx` | 步骤 1：选择云盘文件 |
| `Step2_Classification.tsx` | 步骤 2：文件分类 |
| `Step3_Organization.tsx` | 步骤 3：组卷整理 |
| `Step4_Audit.tsx` | 步骤 4：审核移交确认 |
| `ArchiveSelectionModal.tsx` | 档案选择弹窗 |
| `MetadataModal.tsx` | 元数据编辑弹窗 |
| `classification/ClassificationTree.tsx` | 分类树组件 |
| `classification/FileAssignmentPanel.tsx` | 文件分配面板 |
| `classification/constants.ts` | 分类常量 |
| `organization/StructureTree.tsx` | 组织结构树 |
| `organization/VolumeActions.tsx` | 卷操作组件 |
| `organization/VolumeFilePanel.tsx` | 卷内文件面板 |

### `capture/modals/` — 弹窗

| 文件 | 功能 |
|------|------|
| `CommitmentSigningModal.tsx` | 责任承诺书签署弹窗 |
| `DeleteProjectModal.tsx` | 删除项目确认弹窗 |
| `UnitEngineeringManager.tsx` | 单体工程管理弹窗 |
| `ProjectMemberManager.tsx` | 项目成员管理弹窗（添加/移除/角色变更） |

---

## `components/audit/` — 档案审核

| 文件 | 功能 |
|------|------|
| `AuditDashboard.tsx` | 审核工作台：欢迎横幅、统计卡片、待办数量、快捷入口、环比增长图表 |
| `AuditProjectList.tsx` | 待审核项目列表：分页、按阶段/地区/日期筛选排序 |
| `AuditProjectInfoView.tsx` | 审计项目详情：集成 ArchiveExplorer + 筛选 + 分页 |
| `AuditRegistrationView.tsx` | 移交登记文档查看：上传/必传文件核对、筛选 |
| `ArchiveExplorer.tsx` | 核心审计面板：目录树 + 详情面板 + 问题追踪 + 流程推进 + 修改记录 |
| `ArchiveGuidance.tsx` | 档案整理指导说明：国家标准、折页厚度、页码规则、PDF 标准 |
| `StatisticsView.tsx` | 审核统计分析：5个统计卡片 + 多路吞吐趋势线图 + 矩阵网格 |
| `auditTypes.ts` | 审计类型定义：NodeStatus、WorkflowStage、ArchiveItem 等 |
| `Shared.tsx` | 审计共享组件：StatusBadge、InfoRow、TimelineItem、ProjectFilter |

### `audit/explorer/` — 审计浏览器子组件

| 文件 | 功能 |
|------|------|
| `ArchiveTree.tsx` | 案卷目录树：展开/折叠、节点选择、右键菜单、工作流时间线 |
| `NodeDetail.tsx` | 节点详情面板：元数据、文件信息、问题列表、AI 建议 |
| `IssueDrawer.tsx` | 右侧问题抽屉：列出所有审定问题，支持删除 |
| `BatchImportModal.tsx` | 批量导入弹窗：拖拽上传、文件校验 |
| `NewNodeModal.tsx` | 审批意见/接收证明弹窗 |

---

## `styles/` — 样式文件

| 文件 | 功能 |
|------|------|
| `page-spacing.css` | 页面间距统一配置 |
