
export enum PageRoute {
    DASHBOARD = 'dashboard',
    CLOUD = 'cloud',
    ENTERPRISE = 'enterprise',
    WORKSPACE = 'workspace'
}

// Enterprise Organization (e.g., Construction Company)
export interface Organizations {
    id: string;
    name: string;
    shortName?: string;
    type: 'ENTERPRISE';
    code?: string;
    licenceFileName?: string;
    legalRep?: string;
    legalRepPhone?: string;
}

// Archive Institution (e.g., Kunshan City Construction Archives)
export interface Archives {
    id: string;
    name: string;
    shortName?: string;
    region: string;
    code?: string;
    responsiblePerson?: string;
}

// The connection between User and Org/Archive
export interface Identity {
    id: string;
    user: User;
    organization?: Organizations;  // Enterprise context for recording staff
    archiveOrg?: Archives;        // Archive context for auditors
    role: string;
    department?: string;
}

// Archive tenant for TopBar switcher (working context)
export interface ArchiveTenant {
    id: string;
    name: string;
    region: string;
    logo?: string;
    themeColor?: string;
}

export interface ProjectMember {
    id: string;
    name: string;
    email: string;
    avatarBg: string;
    role: 'admin' | 'participant' | 'observer';
    source: 'internal' | 'external';
    department?: string;
    joinedAt: string;
}

export interface Project {
    id: string;
    name: string;
    status: 'processing' | 'done';
    progress: number;
    stage: string;
    tags: string[];
    issues: string[];
    regNo?: string; 
    archiveType?: string;
    organizationId?: string; // Associated Organization
    memberCount?: number;     // Number of participants in the project
    members?: ProjectMember[]; // Project member list with roles
    isManaged?: boolean;      // Whether 'I' manage this project
    units?: ArchiveEngineering[]; // Units/Single sub-projects (单位工程)
    isCommitmentSigned?: boolean;
    isCommitmentApproved?: boolean;
    constructionUnit?: string;
    assignedReviewer?: string;
    archiveName?: string;
    licenceNo?: string;
}

export interface FileItem {
    id: string;
    name: string;
    type: 'folder' | 'word' | 'excel' | 'pdf' | 'cad' | 'image' | 'ofd';
    size?: string;
    date: string;
    selected?: boolean;
    isDoubleLayer?: boolean; 
    collaborators?: string[]; 
    status?: 'normal' | 'processing' | 'uploading';
}

export interface User {
    id: string;
    name: string;
    role: string;
    email: string;
    avatarBg: string;
    joinDate: string;
    status: 'active' | 'inactive';
    identities?: Identity[]; // List of available contexts
}

export interface TeamMember extends User {
    department?: string;
}

// Archive Organization Types
export type ArchiveLevel = 'project' | 'engineering' | 'volume' | 'file';

export interface ArchiveFile {
    id: string;
    seq: number;
    code: string; 
    name: string; 
    pages: number; 
    pageStart?: number;
    pageEnd?: number;
    date: string;
    author: string; 
    remark?: string;
}

export interface ArchiveVolume {
    id: string;
    title: string; 
    archiveCode: string; 
    boxNumber?: string; 
    status: 'open' | 'sealed';
    fileCount: number;
    files: ArchiveFile[];
}

export interface ArchiveEngineering {
    id: string;
    name: string; 
    code: string; 
    volumes: ArchiveVolume[];
    stage?: '整理中' | '审核中' | '已入库' | '管理中';
    progress?: number;
}

export interface ArchiveProjectData {
    id: string;
    name: string;
    code: string;
    units: ArchiveEngineering[];
}

export interface SelectionItem {
    id: string;
    title: string;
    type: 'FILE' | 'VOLUME';
    code: string;
}