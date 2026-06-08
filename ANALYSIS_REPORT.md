# LantaiCloud 大文件结构分析与拆分方案报告

---

## 1. components/integrator/wizards/NewArchiveWizard.tsx

- **总行数**: 967
- **包含的独立组件/函数**:
  - `const EXTERNAL_ARCHIVES` — 静态数据常量（外部档案馆列表）
  - `interface WizardProps` — 组件 Props 类型
  - `interface ArchiveType` — 档案类型接口
  - `const ARCHIVE_TYPES` — 档案类型数据常量
  - `const StepDot` — 步骤指示器小组件
  - `const Label` — 表单标签小组件
  - `const NewArchiveWizard` — 主组件（~876 行 JSX + 逻辑）
    - 内部函数: `getFilteredArchiveTypes`, `triggerGenerateSimulatedPermitNo`, `handleImport`, `handleNext`, `handleBack`, `finishCreation`
    - 6 个步骤 (step 0~5) 的 JSX 渲染
- **建议拆分成文件**:
  1. `wizards/NewArchiveWizard.tsx` — 主 wizard 组件骨架，仅保留步骤流转和导航逻辑
  2. `wizards/steps/StepExternalArchive.tsx` — 步骤 0：并轨对接选择
  3. `wizards/steps/StepArchiveType.tsx` — 步骤 1：档案大类选择
  4. `wizards/steps/StepSubType.tsx` — 步骤 2：子分类选择
  5. `wizards/steps/StepBasicInfo.tsx` — 步骤 3：基本信息填写
  6. `wizards/steps/StepCommitmentLetter.tsx` — 步骤 4：承诺书签署
  7. `wizards/steps/StepAuditResult.tsx` — 步骤 5：审核结果展示
  8. `wizards/constants.ts` — EXTERNAL_ARCHIVES, ARCHIVE_TYPES, ArchiveType 等数据/类型
  9. `wizards/components/StepDot.tsx` — 小组件
  10. `wizards/components/Label.tsx` — 小组件
- **关键难点**: 6 个步骤共享大量状态，状态在顶层组件中通过 `useState` 集中管理。拆分为子组件后需要将 `step`、`formData`、`selectedType` 等 15+ 状态提升或通过 context 传递。步骤之间的条件流转逻辑紧密耦合（例如 `isConstruction` 和 `useExternalArchive` 控制步骤数变化）。

---

## 2. components/integrator/ProjectsList.tsx

- **总行数**: 836
- **包含的独立组件/函数**:
  - `interface ProjectsListProps` — 组件 Props
  - `const ProjectsList` — 主组件
    - 内部状态: `subTab`, `searchTerm`, `selectedSigningProject`, `deletingProject`, `managingUnitsProject`, `unitFormMode`, `editingUnitId`, `unitFormName`, `unitFormCode`, `isSigningLoading`, `signingStep`
    - 内部函数: `handleAddUnitInModal`, `handleEditUnitInModal`, `handleSignCommitment`, `handleApproveCommitment`, `handleDeleteProject`
  - 3 个模态窗口（内嵌 JSX）：
    - 承诺书签署模态 (Commitment Signing Dialog)
    - 删除确认模态 (Delete Confirmation)
    - 单位工程管理模态 (Project Units Manager)
- **建议拆分成文件**:
  1. `ProjectsList.tsx` — 主列表 + 筛选逻辑 + 卡片渲染
  2. `ProjectsListModals.tsx` — 3 个模态窗口组件各自的文件
     - `modals/CommitmentSigningModal.tsx`
     - `modals/DeleteProjectModal.tsx`
     - `modals/UnitEngineeringManager.tsx`
  3. `ProjectCard.tsx` — 单个项目卡片组件（如果可以提取）
- **关键难点**: 3 个模态共享并修改 `ProjectsList` 的顶层 state（`projects`, `setProjects`），需要将 state 修改回调通过 props 传入子组件。项目过滤、排序、搜索逻辑与列表渲染紧密耦合。

---

## 3. components/audit/ArchiveExplorer.tsx

- **总行数**: 818
- **包含的独立组件/函数**:
  - `interface ArchiveExplorerProps` — Props 类型
  - `interface ModificationIssue` — 问题记录接口
  - `const getAIAnalysis` — AI 分析函数（异步模拟）
  - `const flattenNodes` — 工具函数
  - `const SimulatedAdministrativeLicensePDF` — 模拟行政许可证 PDF 组件（~59 行）
  - `export const ArchiveExplorer` — 主组件（~676 行）
    - 内部函数: `handleContextMenu`, `handleAddMemoClick`, `saveMemo`, `addIssue`, `handleAIAnalysis`, `handleNextNode`, `handleManualModification`, `handleDownload`, `confirmAcceptance`, `confirmReceipt`
    - `const MetadataForm` — 内联元数据表单组件
- **建议拆分成文件**:
  1. `archive/ArchiveExplorer.tsx` — 主组件框架，左右面板布局
  2. `archive/ExplorerLeftPanel.tsx` — 左面板（TREE / INFO / WORKFLOW 标签）
  3. `archive/ExplorerRightPanel.tsx` — 右面板（文件预览 + 工具栏）
  4. `archive/MetadataForm.tsx` — 元数据查看表单
  5. `archive/SimulatedPDF.tsx` — 模拟许可证 PDF 组件
  6. `archive/IssueListDrawer.tsx` — 问题列表侧边栏
  7. `archive/MemoDialog.tsx` — 备忘编辑对话框
  8. `archive/ActionModals.tsx` — 验收/接收意见模态
  9. `archive/ContextMenu.tsx` — 右键菜单
  10. `archive/archiveUtils.ts` — `flattenNodes`, `getAIAnalysis`, 类型定义
- **关键难点**: 大量状态集中在顶层（~20 个 useState），左右面板和多个弹窗共享状态。`MetadataForm` 嵌入在组件内部，需要提取。`TreeNodeWithMemos`、`InfoRow`、`TimelineItem` 从 `Shared.tsx` 导入——确认它们是否存在。

---

## 4. components/collection/ArchiveUtilization.tsx

- **总行数**: 764
- **包含的独立组件/函数**:
  - `interface ArchiveUtilizationProps` — Props 接口
  - `const ArchiveUtilization` — 主组件
    - 内部状态: `basket`, `registrations`, `auditLogs`, `showRegisterForm`, `registerForm`（含7个字段）
    - 内部函数: `handleRegisterSubmit`, `handleApproveRegistration`, `handleRejectRegistration`
    - 3 个 useEffect（localStorage 同步）
  - 大段内联 JSX 渲染：标题横幅、注册表单（~230 行）、审批表格（~110 行）、审计日志表格（~75 行）
- **建议拆分成文件**:
  1. `archive/ArchiveUtilization.tsx` — 主组件骨架，模式切换
  2. `archive/UtilizationHeader.tsx` — 顶部品牌横幅
  3. `archive/RegisterForm.tsx` — 借阅申请表单（引用 `SelectionItem` 类型）
  4. `archive/RegistrationTable.tsx` — 申请列表/审批表格
  5. `archive/AuditLogTable.tsx` — 审计日志表格（仅 approve 模式）
  6. `archive/archiveUtilizationData.ts` — localStorage 工具函数（`getStoredBasket`, `setStoredBasket` 等，但这些已存在于 `archiveData.ts`）
- **关键难点**: `mode`（'apply' | 'approve'）控制整个组件的 UI 和数据流，两个模式的表格渲染差异大。`registrations` 和 `auditLogs` 联动——审批操作同时修改两个 state。代码量大但逻辑相对独立，拆分难度中等。

---

## 5. components/dashboard/PersonalSettings.tsx

- **总行数**: 759
- **包含的独立组件/函数**:
  - `interface PersonalSettingsProps` — Props
  - `interface BoundAccount` — 绑定账号接口
  - `const PersonalSettings` — 主组件
    - 内部状态: `activeTab`, `toast`, `personalInfo`, `passwordFields`, `newPhone`, `verificationCode`, `sentCode`, `countdown`, `isSendingCode`, `timerRef`, `boundAccounts`
    - 内部函数: `triggerToast`, `handleSaveProfile`, `handleSavePassword`, `handleGetCode`, `handleSavePhone`, `handleUnbind`, `handleBind`
    - Tab 内容：基本资料、更换手机、修改密码、第三方绑定
- **建议拆分成文件**:
  1. `dashboard/PersonalSettings.tsx` — 主框架（标签导航 + Toast）
  2. `dashboard/settings/ProfileInfo.tsx` — 基本资料编辑面板
  3. `dashboard/settings/ChangePhone.tsx` — 更换手机面板
  4. `dashboard/settings/ChangePassword.tsx` — 修改密码面板
  5. `dashboard/settings/ThirdPartyBinding.tsx` — 第三方绑定面板
  6. `dashboard/settings/BoundAccountTable.tsx` — 绑定账号表格组件
- **关键难点**: `triggerToast` 是全局提示，被各标签共享，拆出去后需要提升或通过 context。`timerRef` 跨组件逻辑（手机验证码倒计时）需要在 ChangePhone 内部自包含。

---

## 6. components/integrator/workspace/Step3_Organization.tsx

- **总行数**: 756
- **包含的独立组件/函数**:
  - `interface OrganizationViewProps` — Props
  - `const OrganizationView` — 主组件（~725 行）
    - 内部函数: `toggleNode`, `expandNode`, `collapseNode`, `collapseAll`, `handleContextMenu`, `handleFileContextMenu`, `handleUpdateFile`, `handleDeleteFile`, `handleStartCompiling`, `handleConfirmSelection`, `handleSortFiles`, `handleUpdatePageNumbers`, `handleToolbarAddVolume`, `handleContextMenuAddVolume`, `confirmAddVolume`, `openMetadata`, `getAttributeButtonLabel`, `handleBackgroundClick`
    - 内部 useMemo: `filteredUnits`, `selectedObject`, `breadcrumbs`, `currentFiles`
  - 4 个模态/弹窗（内联 JSX）：ContextMenu, SelectionModal, AddVolumeModal, PreviewModal
- **建议拆分成文件**:
  1. `workspace/organization/OrganizationView.tsx` — 主组件框架
  2. `workspace/organization/TreePanel.tsx` — 左侧案卷目录树面板
  3. `workspace/organization/FileTable.tsx` — 右侧文件表格
  4. `workspace/organization/Toolbar.tsx` — 工具栏
  5. `workspace/organization/ContextMenu.tsx` — 右键菜单
  6. `workspace/organization/AddVolumeModal.tsx` — 新增案卷弹窗
  7. `workspace/organization/PreviewModal.tsx` — 文件预览弹窗
  8. `workspace/organization/organizationUtils.ts` — useMemo 逻辑（过滤、面包屑、选中对象解析）
- **关键难点**: 树形数据操作（展开/折叠/筛选/选中）逻辑复杂，跨组件共享 `expandedNodes` 和 `selectedId/selectedType`。`handleConfirmSelection`（组卷）中有异步排序和分页运算逻辑，超过 40 行内联代码。右键菜单需要全局事件监听关闭。

---

## 7. components/collection/ArchiveSearch.tsx

- **总行数**: 727
- **包含的独立组件/函数**:
  - `interface ArchiveSearchProps` — Props
  - `const PROJECT_FIELDS` — 项目搜索字段配置
  - `const UNIT_FIELDS` — 工程搜索字段配置
  - `const VOLUME_FIELDS` — 案卷搜索字段配置
  - `const MOCK_SEARCH_PROJECTS` — 模拟项目数据
  - `const MOCK_SEARCH_UNITS` — 模拟工程数据
  - `const getVolumeDataList` — 数据转换函数
  - `const ArchiveSearch` — 主组件
    - 内部函数: `handleViewArchiveDetail`, `handleOpenRegisterForm`, `isSelectedInBasket`, `handleToggleBasketDirect`, `getFieldsForCurrentTab`, `applyFilters`
- **建议拆分成文件**:
  1. `collection/ArchiveSearch.tsx` — 主组件框架
  2. `collection/search/SearchHeader.tsx` — 顶部品牌横幅
  3. `collection/search/ComprehensiveSearchPanel.tsx` — 综合查询控制台（条件编辑器）
  4. `collection/search/FullTextSearchPanel.tsx` — 全文检索面板
  5. `collection/search/SearchResultsGrid.tsx` — 结果卡片列表
  6. `collection/search/ArchiveTypeSwitcher.tsx` — 档案门类切换
  7. `collection/search/LevelTabs.tsx` — 项目/工程/案卷级别标签
  8. `collection/search/searchConfig.ts` — 所有静态配置（PROJECT_FIELDS, VOLUME_FIELDS, MOCK 数据, 类型）
  9. `collection/search/searchUtils.ts` — `getVolumeDataList`, `applyFilters`, `isSelectedInBasket` 等工具函数
- **关键难点**: 2 种模式（FULL_TEXT / COMPREHENSIVE）之间 UI 差异巨大。条件编辑器支持动态增删行，每个条件关联不同的字段/操作符/输入类型。Mock 数据占据约 100 行，最好迁移到独立数据文件。`filteredSearchResults` 是核心渲染依赖。

---

## 8. components/integrator/workspace/Step2_Classification.tsx

- **总行数**: 610
- **包含的独立组件/函数**:
  - `interface TreeItem` — 树节点接口
  - `const STANDARD_CATEGORIES` — 标准归档分类常量（4 个大类，若干子类）
  - `interface ClassificationViewProps` — Props
  - `const ClassificationView` — 主组件（~558 行）
    - 内部函数/逻辑: `toggleNode`, `expandNode`, `collapseNode`, `collapseAll`, `handleContextMenu`, `handleAddUnitClick`, `handleConfirmAddUnit`, `handleRenameClick`, `handleConfirmRename`, `handleArchiveFiles`, `handleUpdateFile`, `getNodePath`
    - 内部 useMemo: `treeData`, `nodeCounts`, `filteredTreeData`
    - `const renderTree` — 递归树渲染函数（~56 行）
    - ContextMenu 弹窗、AddUnitModal 弹窗
- **建议拆分成文件**:
  1. `workspace/classification/ClassificationView.tsx` — 主组件框架
  2. `workspace/classification/TreePanel.tsx` — 左侧归档目录树
  3. `workspace/classification/FileTablePanel.tsx` — 右侧文件表格
  4. `workspace/classification/ContextMenu.tsx` — 右键菜单
  5. `workspace/classification/AddUnitModal.tsx` — 新增单位工程弹窗
  6. `workspace/classification/classificationConfig.ts` — `STANDARD_CATEGORIES`, `TreeItem` 类型
  7. `workspace/classification/classificationUtils.ts` — `getNodePath`, `nodeCounts` 计算逻辑
- **关键难点**: `renderTree` 是递归函数（~56 行），内部条件分支复杂（选中态、展开态、编辑态、文件计数），嵌入在组件内部难以单独测试。`treeData` 是动态构建的（从 `archiveData + STANDARD_CATEGORIES`），数据流依赖 `archiveData` 和 `expandedNodes` 协同。

---

## 总体建议

这些文件的共同问题：
1. **状态过度集中** — 每个文件都有 10~20 个 `useState`，状态线性增长
2. **内联子组件** — `const Xxx = () => (...)` 形式的子组件嵌入在内部，无法独立测试
3. **配置/数据与逻辑混合** — 大量 Mock 数据、常量定义与业务逻辑在同一文件中
4. **递归渲染** — 树形组件（Step2/Step3）使用递归渲染函数，难以维护

按优先级推荐先处理的文件（根据规模和复杂度）：
1. **NewArchiveWizard.tsx** (967 行, 6 个步骤, 耦合最高)
2. **ArchiveExplorer.tsx** (818 行, 状态最多)
3. **ArchiveSearch.tsx** (727 行, 2 种模式切换)
4. **Step3_Organization.tsx** (756 行, 树+表复杂交互)
