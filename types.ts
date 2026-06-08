
export enum PageRoute {
    DASHBOARD = 'dashboard',
    CLOUD = 'cloud',
    ENTERPRISE = 'enterprise',
    WORKSPACE = 'workspace'
}

// Level 1 Tenant: The Archive Authority (e.g., Kunshan Archives)
export interface ArchiveTenant {
    id: string;
    name: string;
    region: string; // e.g., 'Kunshan', 'Shanghai'
    logo?: string;
    themeColor?: string;
}

// Level 2 Tenant: The Enterprise (e.g., Construction Company)
export interface Organization {
    id: string;
    name: string;
    shortName?: string; // Enterprise short name (displayed in sidebar, max 6 Chinese characters)
    type: 'ENTERPRISE' | 'GOVERNMENT' | 'AGENCY'; 
    code?: string; // Social Credit Code / Organization Code
    licenceFileName?: string; // Business License filename
    legalRep?: string; // Legal Representative name
    legalRepPhone?: string; // Legal Representative phone number
}

// The connection between User and Org
export interface Identity {
    id: string;
    user: User;
    archive?: ArchiveTenant;    // Optional, deprecated Level 1 Tenant
    organization?: Organization;// Context: Who are we acting as?
    role: string;               // 法定代表人, 管理员, 成员
    department?: string;
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