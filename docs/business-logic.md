# LantaiCloud 业务逻辑图

## 1. 整体架构流程

```mermaid
flowchart TD
    Login[登录页] --> LoginSelect{选择用户}
    LoginSelect -->|张三 著录端| Identity[身份选择]
    LoginSelect -->|李进 著录端| CaptureLayout[著录端布局]
    LoginSelect -->|徐琴 审核端| AuditLayout[审核端布局]

    Identity --> CaptureLayout
    
    subgraph CaptureLayout[著录端布局]
        CaptureSidebar[Sidebar: 主页/新建档案/我的档案]
        CaptureSidebar --> CaptureDashboard[著录工作台 /capture-dashboard]
        CaptureSidebar --> NewProject[新建档案 /newproject]
        CaptureSidebar --> Archives[我的档案 /projects]
        CaptureSidebar --> Enterprise[企业管理 /enterprise]
    end

    subgraph AuditLayout[审核端布局]
        AuditSidebar[Sidebar: 工作台/指导/登记/审核/项目信息/统计]
        AuditSidebar --> AuditDashboard[审核工作台 /audit-dashboard]
        AuditSidebar --> AuditGuidance[档案指导 /audit-guidance]
        AuditSidebar --> AuditRegistration[档案登记 /audit-registration]
        AuditSidebar --> AuditProjects[档案审核 /audit-projects]
        AuditSidebar --> AuditProjectInfo[项目信息 /audit-project-info]
        AuditSidebar --> AuditStatistics[统计分析 /audit-statistics]
        AuditSidebar --> ArchiveMgmt[档案馆管理 /enterprise]
    end

    CaptureDashboard --> ProjectCards[项目卡片列表]
    CaptureDashboard --> MessageCenter[消息中心]

    Archives --> ProjectList[档案项目列表]
    ProjectList --> NewProjectWizard[新建项目向导]
    ProjectList --> Workspace[著录工作台]
    ProjectList --> MemberMgmt[项目成员管理弹窗]

    NewProject --> NewProjectWizard

    subgraph NewProjectFlow[新建档案向导]
        Step1[Step 1: 档案分类] --> Step2[Step 2: 基本信息]
        Step2 -->|建设工程+外报馆| Step3[Step 3: 签署承诺书]
        Step3 --> Step4[Step 4: 审核登记]
        Step2 -->|本地SaaS馆| Finish[完成创建]
    end

    subgraph WorkspaceFlow[著录工作台 4步流程]
        WStep1[Step1: 云盘选文件] --> WStep2[Step2: 分类]
        WStep2 --> WStep3[Step3: 整理 案卷管理]
        WStep3 --> WStep4[Step4: 审核确认]
    end

    Enterprise --> BasicInfo[企业基本信息]
    Enterprise --> Team[团队管理]
    Enterprise --> Security[安全管理]
    Enterprise --> Version[版本信息]
    Enterprise --> ExternalArchives[外部档案馆]

    ArchiveMgmt --> ArchiveInfo[档案馆信息]
    ArchiveMgmt --> ArchiveTemplates[档案馆模板]
    ArchiveMgmt --> AuditFlowConfig[审核流程配置]
    ArchiveMgmt --> ProjectTypeConfig[项目类型配置]
    ArchiveMgmt --> EngineeringType[工程类型]
    ArchiveMgmt --> ProjectTypeTree[项目类型树]
```

---

## 2. 角色体系

参见 `AGENTS.md`，核心角色关系：

```mermaid
flowchart TD
    subgraph Enterprise[企业级]
        LegalRep[法定代表人] -->|默认参与所有项目| EnterpriseAdmin[企业管理员]
        EnterpriseAdmin -->|默认参与所有项目| Member[成员]
    end

    subgraph Project[项目级]
        PM[项目管理员<br>创建人/转让] --> Participant[参与人员]
        Participant --> Observer[观察人员]
        External[外部参与者<br>监理/甲方代表] -->|由PM邀请| Participant
        External -->|由PM设定| Observer
    end

    LegalRep -->|某个项目中可降级| Observer
    EnterpriseAdmin -->|某个项目中可降级| Observer
    Member -->|被邀请| Participant
```

---

## 3. 数据模型关系

```mermaid
classDiagram
    class User {
        +string id
        +string name
        +string role
        +string email
        +string avatarBg
        +string status
    }

    class Organization {
        +string id
        +string name
        +string shortName
        +string type
        +string code
        +string legalRep
    }

    class Identity {
        +string id
        +User user
        +Organization organization
        +string role
        +string department
    }

    class Project {
        +string id
        +string name
        +string stage
        +bool isManaged
        +ProjectMember[] members
        +ArchiveEngineering[] units
    }

    class ProjectMember {
        +string id
        +string name
        +string role
        +string source
        +string department
    }

    class ArchiveEngineering {
        +string id
        +string name
        +string code
        +string stage
        +int progress
        +ArchiveVolume[] volumes
    }

    class ArchiveVolume {
        +string id
        +string title
        +string archiveCode
        +string status
        +int fileCount
        +ArchiveFile[] files
    }

    class ArchiveFile {
        +string id
        +int seq
        +string code
        +string name
        +int pages
        +string date
        +string author
    }

    class AppContext {
        +bool isAuthenticated
        +Identity[] identities
        +Identity currentIdentity
        +Project[] projects
        +login()
        +logout()
        +setCurrentIdentity()
    }

    User "1" -- "*" Identity : has
    Identity "1" --> "0..1" Organization : belongs to
    Project "1" --> "*" ProjectMember : has
    Project "1" --> "*" ArchiveEngineering : contains
    ArchiveEngineering "1" --> "*" ArchiveVolume : contains
    ArchiveVolume "1" --> "*" ArchiveFile : contains
    AppContext --> Identity : manages
    AppContext --> Project : manages
```

---

## 4. 用户操作流程

```mermaid
flowchart LR
    A[打开应用] --> B{选择登录用户}
    B -->|张三| C[选择企业身份]
    B -->|李进| D[著录工作台]
    B -->|徐琴| E[审核工作台]

    C --> F[著录工作台]

    F --> G{选择操作}
    G --> H[查看项目卡片]
    G --> I[新建档案]
    G --> J[查看我的档案列表]
    G --> K[企业管理]

    I --> L[档案分类 → 基本信息]
    L -->|需外报| M[签署承诺书 → 审核登记]
    L -->|本地存档| N[完成创建]

    J --> O[项目操作]
    O --> P[继续创建]
    O --> Q[管理成员]
    O --> R[单位工程]
    O --> S[整理著录]

    E --> T{选择操作}
    T --> U[审核工作台概览]
    T --> V[档案登记]
    T --> W[档案审核/审批]
    T --> X[项目信息查看]
    T --> Y[统计分析]
    T --> Z[档案馆管理]
```

---

## 模块路由总览

| 端侧 | 模块 | 路由 | 核心功能 |
|------|------|------|---------|
| 著录 | 著录工作台 | `/capture-dashboard` | 项目卡片、消息中心 |
| 著录 | 新建档案 | `/newproject` | 分步向导：分类→信息→承诺书→审核 |
| 著录 | 我的档案 | `/projects` | 项目列表、成员管理、单位工程 |
| 著录 | 企业管理 | `/enterprise` | 信息、团队、安全、版本、外部档案馆 |
| 审核 | 审核工作台 | `/audit-dashboard` | 概览、统计、待办 |
| 审核 | 档案登记 | `/audit-registration` | 移交登记核对 |
| 审核 | 档案审核 | `/audit-projects` | 树形审批、问题追踪 |
| 审核 | 项目信息 | `/audit-project-info` | 审计项目详情 |
| 审核 | 档案指导 | `/audit-guidance` | 国家标准说明 |
| 审核 | 统计分析 | `/audit-statistics` | 统计图表 |
| 审核 | 档案馆管理 | `/enterprise` | 档案馆信息、模板、流程、类型 |
| 通用 | 个人设置 | `/settings` | 资料、账号、通知、安全 |
