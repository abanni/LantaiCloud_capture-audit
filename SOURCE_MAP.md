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
| `types.ts` | TypeScript 类型定义：Project、Identity、Organization、FileItem、SelectionItem 等核心模型 |
| `tsconfig.json` | TypeScript 编译器配置 |
| `vite.config.ts` | Vite 构建配置：React 插件、Tailwind CSS、端口 3000、环境变量 |
| `package.json` | 依赖：React 19、React Router 7、Recharts、Lucide React、Tailwind CSS 4、Motion |

---

## `components/context/` — 全局状态管理

| 文件 | 功能 |
|------|------|
| `AppContext.tsx` | React Context 全局状态：认证、身份切换、项目管理；含三个组织的 Mock 初始身份 |

---

## `data/` — 模拟数据

| 文件 | 功能 |
|------|------|
| `index.ts` | Mock 数据模块导出 |
| `mockCloudFiles.ts` | 云盘模拟文件系统（Word、Excel、PDF、CAD 等 15+ 文件） |
| `mockProjects.ts` | 三个组织的 Mock 项目数据（创建中/整理中/审核中/已入库） |

---

## `components/common/` — 公共组件

| 文件 | 功能 |
|------|------|
| `Sidebar.tsx` | 左侧导航栏：主页、档案著录、档案审核、数字馆藏、利用服务等菜单项 |
| `TopBar.tsx` | 顶部导航栏：页面标题 + 通知铃铛 + UserSwitcher 用户切换 |
| `UserSwitcher.tsx` | 用户切换下拉菜单：身份切换、退出、个人信息显示、布局/个人设置 |
| `ProtectedRoute.tsx` | 路由守卫：认证检查、组织上下文检查、角色权限控制 |
| `fileUtils.tsx` | 文件图标工具函数（根据文件类型返回对应图标组件） |

---

## `components/dashboard/` — 登录与工作台

| 文件 | 功能 |
|------|------|
| `Login.tsx` | 登录页：张三（企业身份）/ 李进（个人身份）双标签切换，模拟登录 |
| `IdentitySelector.tsx` | 身份选择页：登录后展示多组织身份卡片供选择 |
| `Dashboard.tsx` | 工作台主页：组织信息头 + 项目卡片列表 + 消息中心 + 新建档案向导入口 |
| `Enterprise.tsx` | 企业管理页：基本信息、团队、安全、版本、外部档案馆 标签页 |
| `PersonalSettings.tsx` | 个人设置：个人资料、安全（密码修改）、通知偏好、账号绑定 |
| `ProjectCard.tsx` | 项目卡片组件：按阶段（创建中/整理中/审核中/已入库）显示不同样式 |
| `OnboardingPanel.tsx` | 新用户引导面板：显示设置步骤、消息、核心功能快捷入口 |
| `UserMessageCenter.tsx` | 消息管理中心：多选、状态跟踪、项目跳转 |

### `dashboard/settings-tabs/` — 设置标签页

| 文件 | 功能 |
|------|------|
| `ProfileTab.tsx` | 个人资料编辑：姓名、身份证、电话、邮箱、性别 |
| `SecurityTab.tsx` | 安全设置：密码修改、手机号换绑 + 验证码倒计时 |
| `NotificationTab.tsx` | 通知偏好：短信、邮件、应用内通知开关 |
| `AccountsTab.tsx` | 第三方账号绑定：第三方平台绑定管理（解绑/刷新） |

### `dashboard/enterprise-tabs/` — 企业设置标签页

| 文件 | 功能 |
|------|------|
| `BasicInfoTab.tsx` | 企业基本信息：名称、简称、类型、注册号、法人、营业执照 |
| `TeamTab.tsx` | 团队成员管理：角色标签、成员配置、邀请新成员 |
| `SecurityTab.tsx` | 企业安全：法定代表人所有权移交 |
| `VersionTab.tsx` | 订阅管理：版本套餐（免费/团队/专业/企业）、价格对比、订单历史 |
| `ExternalArchivesTab.tsx` | 外部档案馆关联：已关联档案馆列表、API Token 生成、文件类型绑定 |

---

## `components/integrator/` — 档案著录（新建项目）

| 文件 | 功能 |
|------|------|
| `Workspace.tsx` | 云端工作区四步向导：选择云盘 → 分类 → 组卷 → 审核移交 |
| `CloudDrive.tsx` | 云盘文件浏览器：网格/列表切换、文件选择、上传面板、文件夹导航 |
| `ProjectsList.tsx` | 企业项目列表：展示所有项目 + 新建/承诺书/单体工程管理入口 |
| `archiveData.ts` | Mock 档案数据定义 + 工具函数（搜索、筛选、本地存储） |
| `mockData.ts` | Mock 初始项目数据 |

### `integrator/wizards/` — 新建档案向导

| 文件 | 功能 |
|------|------|
| `NewArchiveWizard.tsx` | 新建档案分步向导：选择档案馆 → 档案分类 → 基本信息 → 承诺书 → 审核登记 |
| `NewCloudWizard.tsx` | 新建云盘空间向导：名称 + 描述 |
| `constants.ts` | 档案类型定义（建设工程/建设管理/声像/文书/科技/会计）+ 外部档案馆列表 |

### `integrator/wizards/components/` — 向导子组件

| 文件 | 功能 |
|------|------|
| `Label.tsx` | 表单标签组件（支持必填星号） |
| `StepDot.tsx` | 步骤指示器：数字圆圈 + 标签 + 激活/当前状态 |

### `integrator/wizards/steps/` — 分步页面

| 文件 | 功能 |
|------|------|
| `StepExternalArchive.tsx` | 步骤 0：选择是否关联外部档案馆（本地/远程双选项） |
| `StepArchiveType.tsx` | 步骤 1：选择档案类型（大类型） |
| `StepSubType.tsx` | 步骤 2：选择二级分类（子类型） |
| `StepBasicInfo.tsx` | 步骤 3：填写项目基本信息（名称、文号、地址等） |
| `StepCommitment.tsx` | 步骤 4：档案承诺书签署（电子签/上传） |
| `StepAuditResult.tsx` | 步骤 5：审核登记结果展示 |

### `integrator/workspace/` — 工作区子步骤

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

### `integrator/modals/` — 弹窗

| 文件 | 功能 |
|------|------|
| `CommitmentSigningModal.tsx` | 责任承诺书签署弹窗 |
| `DeleteProjectModal.tsx` | 删除项目确认弹窗 |
| `UnitEngineeringManager.tsx` | 单体工程管理弹窗 |

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
| `BatchImportModal.tsx` | 批量导入弹窗：拖拽上传、文件校验（待处理/有效/重复/错误） |
| `NewNodeModal.tsx` | 审批意见/接收证明弹窗：编号输入 |
| `index.ts` | 模块导出 |

---

## `components/collection/` — 数字馆藏

| 文件 | 功能 |
|------|------|
| `ArchiveCenter.tsx` | 我的档案馆：档案列表 + 统计卡片 + 详情弹窗 |
| `ArchiveCenterStats.tsx` | 统计可视化：Recharts 柱状图/饼图（按年份/类别/规格/类型） |
| `ArchiveDetailView.tsx` | 档案详情：项目/单体/卷/文件四级树状浏览 + PDF 工具栏（翻页/缩放/编辑/打印/下载） |
| `ArchiveSearch.tsx` | 高级搜索：全文检索 + 综合检索双模式，条件构建器 |

### `collection/search/` — 搜索子组件

| 文件 | 功能 |
|------|------|
| `SearchBar.tsx` | 搜索输入框：关键字输入 + 清空按钮 |
| `SearchFilters.tsx` | 搜索筛选面板：档案类型选择 + 项目/单体/卷三级条件构建 |
| `SearchResults.tsx` | 搜索结果展示：勾选、详情切换、加入借阅篮 |
| `FullTextSearch.tsx` | 全文检索包装组件 |
| `searchData.ts` | 搜索字段定义（PROJECT_FIELDS/UNIT_FIELDS/VOLUME_FIELDS） |

---

## `components/utilization/` — 利用服务

| 文件 | 功能 |
|------|------|
| `ArchiveUtilization.tsx` | 借阅管理中枢：申请/审批面板切换 + 登记追踪 + 审计日志 |
| `ApplyPanel.tsx` | 借阅申请表：姓名、身份、单位、电话、用途、类型、凭证 |
| `ApprovePanel.tsx` | 审批面板：待审批列表 + 通过/驳回操作 + 审计日志 |
| `BorrowBasket.tsx` | 借阅篮：已选档案列表 + 数量 + 操作指引 |
| `RegistrationCard.tsx` | 登记表格行：ID、日期、用户、用途、数量、操作按钮 |
