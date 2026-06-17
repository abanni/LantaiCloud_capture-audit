# LantaiCloud 业务逻辑图

## 1. 整体架构流程

```mermaid
flowchart TD
    Login[登录页] --> Identity[身份选择]
    Identity --> MainLayout[主布局: Sidebar + TopBar + 路由区]

    MainLayout --> Dashboard[工作台 /dashboard]
    MainLayout --> Projects[项目著录 /projects]
    MainLayout --> Enterprise[企业管理 /enterprise]
    MainLayout --> ArchiveCenter[档案馆 /archive-center]
    MainLayout --> Search[综合查询 /archive-search]
    MainLayout --> Utilization[档案利用 /archive-apply]
    MainLayout --> Audit[审核模块 /audit-*]
    MainLayout --> Settings[个人设置 /settings]

    Dashboard --> ProjectCards[项目卡片列表]
    Dashboard --> Onboarding[引导面板]
    Dashboard --> MessageCenter[消息中心]
    Dashboard --> StatsStats[档案馆统计]

    Projects --> ProjectList[著录项目列表]
    ProjectList --> NewProjectWizard[新建项目向导]
    ProjectList --> Workspace[著录工作台]

    subgraph WorkspaceFlow[著录工作台 4步流程]
        Step1[Step1: 云盘选文件] --> Step2[Step2: 分类 分类树/文件分配]
        Step2 --> Step3[Step3: 整理 案卷管理/卷内文件]
        Step3 --> Step4[Step4: 审核确认]
    end

    Workspace --> Step1
    Workspace --> NewCloudWizard[云盘向导]
    Workspace --> NewArchiveWizard[新档案向导]

    Enterprise --> BasicInfo[企业基本信息]
    Enterprise --> Security[安全管理]
    Enterprise --> Team[团队管理]
    Enterprise --> Version[版本信息]
    Enterprise --> ExternalArchives[外部档案馆]

    Search --> SearchBar[搜索栏]
    Search --> Filters[筛选器]
    Search --> FullText[全文检索]
    Search --> DetailView[档案详情]

    Utilization --> Apply[借阅申请]
    Utilization --> Approve[借阅审批]
    Apply --> BorrowBasket[借阅购物篮]
    Approve --> RegistrationCard[登记卡]

    subgraph AuditFlow[审核工作流]
        AuditDashboard[审核工作台 概览] --> AuditRegistration[档案登记]
        AuditDashboard --> AuditProjects[档案审核]
        AuditProjects --> ArchiveTree[树形节点浏览]
        ArchiveTree --> NodeDetail[节点详情/审批]
        ArchiveTree --> Issues[问题管理]
        ArchiveTree --> BatchImport[批量导入]
        AuditDashboard --> ProjectInfo[项目信息]
        AuditDashboard --> Guidance[档案指导]
        AuditDashboard --> Statistics[统计分析]
    end

    Audit --> AuditDashboard

    Settings --> Profile[个人资料]
    Settings --> Accounts[账号管理]
    Settings --> Notifications[通知设置]
    Settings --> SecuritySet[安全设置]
```

---

## 2. 数据模型关系

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
        +Identity[] members
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
        +string status
        +int progress
        +string stage
        +ArchiveEngineering[] units
        +bool isCommitmentSigned
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

    class ArchiveItem {
        +string id
        +string projectName
        +string stage
        +ArchiveNode[] archiveDataPackage
        +ArchiveNode[] volumeDataPackage
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
    Identity "1" --> "0..1" ArchiveTenant : legacy
    Project "1" --> "*" ArchiveEngineering : contains
    ArchiveEngineering "1" --> "*" ArchiveVolume : contains
    ArchiveVolume "1" --> "*" ArchiveFile : contains
    AppContext --> Identity : manages
    AppContext --> Project : manages
```

---

## 3. 审核工作流状态

```mermaid
stateDiagram-v2
    [*] --> REGISTRATION: 新建档案
    REGISTRATION --> FIRST_REVIEW: 提交审核
    FIRST_REVIEW --> SECOND_REVIEW: 一审通过
    SECOND_REVIEW --> APPROVED: 二审通过
    FIRST_REVIEW --> REGISTRATION: 退回修改
    SECOND_REVIEW --> REGISTRATION: 退回修改
    APPROVED --> PUBLISHED: 发布归档
    PUBLISHED --> [*]
```

---

## 4. 用户操作流程 (主要路径)

```mermaid
flowchart LR
    A[用户打开应用] --> B{是否已登录?}
    B -->|否| C[登录页]
    C --> D[选择身份/企业]

    B -->|是| D

    D --> E{选择什么身份?}

    E -->|管理员| F[工作台]
    E -->|法人| F

    F --> G{选择功能}

    G --> H[查看项目卡片]
    G --> I[进入著录工作台]
    G --> J[进入审核]
    G --> K[查询档案]
    G --> L[借阅档案]

    I --> M[4步著录流程]
    M --> N[提交审核]

    J --> O[审核登记/审批]
    O --> P[通过/退回]

    K --> Q[搜索/筛选/查看详情]

    L --> R[申请借阅]
    R --> S[等待审批]
```

---

## 模块总览

| 模块 | 路由 | 核心功能 |
|------|------|---------|
| 工作台 | /dashboard | 项目卡片、引导、消息、统计 |
| 项目著录 | /projects | 著录列表、4步著录流程、多步骤向导 |
| 企业管理 | /enterprise | 企业信息、团队、安全、版本 |
| 档案馆 | /archive-center | 归档/借阅统计 |
| 综合查询 | /archive-search | 搜索、筛选、全文检索 |
| 档案利用 | /archive-apply / -approve | 借阅申请、审批、购物篮 |
| 审核模块 | /audit-* | 登记、审核(树/节点)、指导、统计 |
| 个人设置 | /settings | 资料、账号、通知、安全 |
