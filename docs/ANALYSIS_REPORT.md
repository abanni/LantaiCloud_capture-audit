# LantaiCloud 大文件结构分析与拆分方案报告

---

## 1. components/capture/wizards/NewProjectWizard.tsx

- **总行数**: ~874
- **包含的独立组件/函数**:
  - `const EXTERNAL_ARCHIVES` — 静态数据常量（外部档案馆列表）
  - `interface WizardProps` — 组件 Props 类型
  - `interface ArchiveType` — 档案类型接口
  - `const ARCHIVE_TYPES` — 档案类型数据常量
  - `const StepDot` — 步骤指示器小组件
  - `const Label` — 表单标签小组件
  - `const NewProjectWizard` — 主组件
    - 内部函数: `getFilteredArchiveTypes`, `handleNext`, `handleBack`, `finishCreation`
    - 5 个步骤 (step 1~5) 的 JSX 渲染（Step 0 已移除）
- **变更历史**:
  - 原 `NewArchiveWizard.tsx`（967行）经重构后更名为 `NewProjectWizard.tsx`
  - Step 0（选择档案馆）已移除，由右上角档案馆选择器替代
  - 签署承诺书步骤改为在线签章/客户端签章/纸质上传三模式
  - StepDot 步骤指示器根据业务流程条件显示
- **建议拆分成文件**:
  1. `wizards/NewProjectWizard.tsx` — 主组件骨架 + 步骤流转
  2. `wizards/steps/StepArchiveType.tsx` — 步骤 1：档案大类选择
  3. `wizards/steps/StepSubType.tsx` — 步骤 2：子分类选择
  4. `wizards/steps/StepBasicInfo.tsx` — 步骤 3：基本信息填写
  5. `wizards/steps/StepCommitment.tsx` — 步骤 4：承诺书签署
  6. `wizards/steps/StepAuditResult.tsx` — 步骤 5：审核结果展示
  7. `wizards/constants.ts` — 数据常量
  8. `wizards/components/StepDot.tsx` — 小组件
  9. `wizards/components/Label.tsx` — 小组件
- **关键难点**: 5 个步骤共享大量状态（15+ useState），步骤间条件流转逻辑紧密耦合

---

## 2. components/capture/ProjectsList.tsx

- **总行数**: ~400
- **包含的独立组件/函数**:
  - `const ProjectsList` — 主组件
    - 内部状态: `subTab`, `searchTerm`, 多个模态状态
  - 4 个模态窗口：
    - 承诺书签署模态（CommitmentSigningModal）
    - 删除确认模态（DeleteProjectModal）
    - 单位工程管理模态（UnitEngineeringManager）
    - 项目成员管理模态（ProjectMemberManager）← **新增**
- **变更历史**:
  - 所有模态已抽离为独立文件
  - 新增项目成员管理功能
  - 项目成员按钮按管理/参与角色区分显示样式
- **建议拆分成文件**: 当前状态已基本合理

---

## 3. components/audit/ArchiveExplorer.tsx

- **总行数**: 818
- **包含的独立组件/函数**:
  - `interface ArchiveExplorerProps` — Props 类型
  - `const getAIAnalysis` — AI 分析函数（异步模拟）
  - `const flattenNodes` — 工具函数
  - `const SimulatedAdministrativeLicensePDF` — 模拟行政许可证 PDF 组件
  - `export const ArchiveExplorer` — 主组件
  - `const MetadataForm` — 内联元数据表单组件
- **建议拆分成文件**:
  1. `explorer/ArchiveExplorer.tsx` — 主组件框架
  2. `explorer/ExplorerTree.tsx` — 目录树面板
  3. `explorer/NodeDetail.tsx` — 节点详情面板
  4. `explorer/MetadataForm.tsx` — 元数据表单
  5. `explorer/IssueDrawer.tsx` — 问题侧边栏
  6. `explorer/ActionModals.tsx` — 验收/接收模态
  7. `explorer/archiveUtils.ts` — 工具函数
- **关键难点**: ~20 个 useState 集中在顶层，左右面板共享状态

---

## 4. components/capture/workspace/Step3_Organization.tsx

- **总行数**: 756
- **包含的独立组件/函数**:
  - `const OrganizationView` — 主组件
    - 内部函数: 树操作、文件操作、弹窗管理
  - 4 个模态/弹窗：ContextMenu, SelectionModal, AddVolumeModal, PreviewModal
- **建议拆分成文件**:
  1. `organization/OrganizationView.tsx` — 主组件框架
  2. `organization/TreePanel.tsx` — 左侧案卷目录树
  3. `organization/FileTable.tsx` — 右侧文件表格
  4. `organization/Toolbar.tsx` — 工具栏
  5. `organization/organizationUtils.ts` — 工具函数
- **关键难点**: 树形数据操作逻辑复杂，跨组件共享展开/选中状态
