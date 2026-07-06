
export type NodeStatus = 'PASSED' | 'FAILED' | 'LOCKED' | 'PENDING';

export type WorkflowStage = 
    | 'REGISTER' 
    | 'FIRST_REVIEW' 
    | 'ACCEPTANCE_PRINT' 
    | 'SECOND_REVIEW' 
    | 'RECEIPT_PRINT' 
    | 'ARCHIVING' 
    | 'COMPLETED';

export interface ProjectInfo {
    id: string;
    projectName: string;
    permitNumber: string;
    projectCode: string;
    location: string;
    constructionUnit: string;
    constructionCompany: string;
    designUnit: string;
    supervisorUnit: string;
    planningPermitNumber?: string;
    approvalNumber?: string;
    qualityNumber?: string;
    landPermitNumber?: string;
    approvalUnit?: string;
    surveyUnit?: string;
    projectManager?: string;
    managerPhone?: string;
    operator?: string;
    operatorPhone?: string;
    totalArea?: string;
    buildingCount?: string;
    totalCost?: string;
    volumeCount?: string;
    textVolumeCount?: string;
    drawingVolumeCount?: string;
    createTime?: string;
}

export interface SubmittedDocument {
    name: string;
    required: boolean;
    uploadDate: string;
}

export interface ArchiveNode {
    id: string;
    name: string;
    type: 'FOLDER' | 'FILE';
    status?: NodeStatus;
    layerType?: 'dual' | 'single'; // dual-layer PDF, single-layer PDF
    children?: ArchiveNode[];
}

export interface ArchiveItem {
    id: string;
    projectInfo: ProjectInfo;
    submissionDocs: SubmittedDocument[];
    archiveDataPackage: ArchiveNode[];
    volumeDataPackage: ArchiveNode[];
    submissionDate: string;
    registrationNumber?: string;
    stage: WorkflowStage;
}

export interface ProjectFilterCriteria {
    projectName?: string;
    permitNumber?: string;
    qualityNumber?: string;
    location?: string;
    volumeTitle?: string;
    constructionUnit?: string;
    constructionCompany?: string;
    supervisorUnit?: string;
    surveyUnit?: string;
    designUnit?: string;
    reviewer?: string;
    archiveStatus?: string;
    organizationStatus?: string;
    retentionPeriod?: string;
    archiveDateStart?: string;
    archiveDateEnd?: string;
    createDateStart?: string;
    createDateEnd?: string;
    transferUnit?: string;
    archiveNumber?: string;
    securityLevel?: string;
}

// Highly detailed, realistic mock list of Archive Items in various workflow stages
export const INITIAL_ARCHIVES: ArchiveItem[] = [
    {
        id: 'arc_audit_1',
        submissionDate: '2026-06-04 10:24:15',
        registrationNumber: 'REG-2026-0604-0019',
        stage: 'FIRST_REVIEW',
        projectInfo: {
            id: 'proj_1',
            projectName: '昆山高新区生命健康产业园配套检测中心',
            permitNumber: 'JS32058320251101-01',
            projectCode: '2025-320583-84-01-012903',
            location: '昆山市高新区精密道路108号',
            constructionUnit: '昆山高新技术产业开发区管理委员会',
            constructionCompany: '苏州第一建设工程集团有限公司',
            designUnit: '苏州园林设计院股份有限公司',
            supervisorUnit: '江苏成兴工程建设监理有限责任公司',
            planningPermitNumber: '建字第3205832025118742号',
            approvalNumber: '昆发改核准【2025】3201号',
            qualityNumber: 'ZJ-KS-2025-11029',
            landPermitNumber: '地字第3205832025100084号',
            approvalUnit: '昆山市发展和改革委员会',
            surveyUnit: '苏州市勘察测绘院有限公司',
            projectManager: '严海峰',
            managerPhone: '13861214088',
            operator: '岑源',
            operatorPhone: '15850024951',
            totalArea: '14520.5平方米',
            buildingCount: '2幢',
            totalCost: '6845.00万元',
            volumeCount: '15卷',
            textVolumeCount: '10卷',
            drawingVolumeCount: '5卷',
            createTime: '2025-11-20'
        },
        submissionDocs: [
            { name: '工程规划许可证及附件.pdf', required: true, uploadDate: '2026-06-04' },
            { name: '施工许可证及批文.pdf', required: true, uploadDate: '2026-06-04' },
            { name: '报送承诺书（有公章）.pdf', required: true, uploadDate: '2026-06-04' },
            { name: '易地建设决定书或人防批复.pdf', required: false, uploadDate: '2026-06-04' }
        ],
        archiveDataPackage: [
            {
                id: 'node_1',
                name: '1. 建设基本程序备查文件 (A类)',
                type: 'FOLDER',
                children: [
                    {
                        id: 'node_1_1',
                        name: '立项申请报告及批复.pdf',
                        type: 'FILE',
                        status: 'PENDING',
                        layerType: 'dual'
                    },
                    {
                        id: 'node_1_2',
                        name: '建设用地规划许可证及其红线图.pdf',
                        type: 'FILE',
                        status: 'PENDING',
                        layerType: 'dual'
                    },
                    {
                        id: 'node_1_3',
                        name: '建设工程规划许可证及其附件.pdf',
                        type: 'FILE',
                        status: 'PASSED',
                        layerType: 'single'
                    },
                    {
                        id: 'node_1_4',
                        name: '施工图设计审查合格证及其审查意见书.pdf',
                        type: 'FILE',
                        status: 'PASSED',
                        layerType: 'dual'
                    }
                ]
            },
            {
                id: 'node_2',
                name: '2. 施工质安控制管理文件 (B类)',
                type: 'FOLDER',
                children: [
                    {
                        id: 'node_2_1',
                        name: '开工报告及其批复.pdf',
                        type: 'FILE',
                        status: 'PENDING',
                        layerType: 'single'
                    },
                    {
                        id: 'node_2_2',
                        name: '项目技术交底及会审记录草稿.pdf',
                        type: 'FILE',
                        status: 'PENDING',
                        layerType: 'single'
                    }
                ]
            }
        ],
        volumeDataPackage: [
            {
                id: 'vol_node_1',
                name: '第一案卷：建设前期综合文书立项案卷',
                type: 'FOLDER',
                children: [
                    {
                        id: 'vol_node_1_1',
                        name: '案卷封面和卷内文件目录.pdf',
                        type: 'FILE',
                        status: 'PENDING',
                        layerType: 'dual'
                    },
                    {
                        id: 'vol_node_1_2',
                        name: '立项批文与规划要点说明合卷.pdf',
                        type: 'FILE',
                        status: 'SUCCESS',
                        layerType: 'dual'
                    }
                ]
            }
        ]
    },
    {
        id: 'arc_audit_2',
        submissionDate: '2026-06-05 14:02:11',
        registrationNumber: 'REG-2026-0605-0102',
        stage: 'SECOND_REVIEW',
        projectInfo: {
            id: 'proj_2',
            projectName: '昆山巴城阳澄湖生态产业园一期项目',
            permitNumber: 'JS32058320251211-02',
            projectCode: '2025-320583-84-01-014951',
            location: '昆山市巴城镇阳澄湖水产基地路5号',
            constructionUnit: '昆山市巴城镇投资开发有限公司',
            constructionCompany: '昆山建工集团有限公司',
            designUnit: '清华大学建筑设计研究院',
            supervisorUnit: '苏州正信工程项目管理有限公司',
            planningPermitNumber: '建字第3205832025112102号',
            approvalNumber: '巴发改核【2025】1029号',
            qualityNumber: 'ZJ-KS-2025-11048',
            landPermitNumber: '地字第3205832025118552号',
            approvalUnit: '昆山市发展和改革委员会',
            surveyUnit: '江苏省地质物理勘探院',
            projectManager: '陆海宁',
            managerPhone: '13915729388',
            operator: '李娜',
            operatorPhone: '18550119283',
            totalArea: '23500.00平方米',
            buildingCount: '5幢',
            totalCost: '9540.00万元',
            volumeCount: '28卷',
            textVolumeCount: '18卷',
            drawingVolumeCount: '10卷',
            createTime: '2025-12-11'
        },
        submissionDocs: [
            { name: '规划许可证及附件.pdf', required: true, uploadDate: '2026-06-05' },
            { name: '施工许可证副本.pdf', required: true, uploadDate: '2026-06-05' },
            { name: '报送承诺书盖章正本.pdf', required: true, uploadDate: '2026-06-05' }
        ],
        archiveDataPackage: [
            {
                id: 'arc_2_node_1',
                name: '建设前期申请材料及复核单',
                type: 'FOLDER',
                children: [
                    {
                        id: 'arc_2_node_1_1',
                        name: '建设前期申请书与审批公证书.pdf',
                        type: 'FILE',
                        status: 'PASSED',
                        layerType: 'dual'
                    }
                ]
            }
        ],
        volumeDataPackage: []
    },
    {
        id: 'arc_audit_3',
        submissionDate: '2026-06-07 01:10:00',
        stage: 'REGISTER',
        projectInfo: {
            id: 'proj_3',
            projectName: '陆家镇童趣小镇幼儿园新建级配工程',
            permitNumber: 'JS32058320250601-08',
            projectCode: '2025-320583-84-01-018224',
            location: '昆山市陆家镇童趣小镇园区',
            constructionUnit: '昆山市陆家镇人民政府',
            constructionCompany: '中国建筑第八工程局有限公司',
            designUnit: '同济大学建筑设计研究院(集团)有限公司',
            supervisorUnit: '上海市建设工程监理有限公司',
            planningPermitNumber: '建字第3205832025060852号',
            approvalNumber: '陆发改核【2025】068号',
            qualityNumber: 'ZJ-KS-2025-06042',
            landPermitNumber: '地字第3205832025050012号',
            approvalUnit: '陆家镇发展和改革办公室',
            surveyUnit: '苏州市岩土工程勘察院',
            projectManager: '韩建华',
            managerPhone: '13616230041',
            operator: '阮亮',
            operatorPhone: '18999014125',
            totalArea: '8900.00',
            buildingCount: '1幢',
            totalCost: '2800.00万元',
            volumeCount: '15卷',
            textVolumeCount: '12卷',
            drawingVolumeCount: '3卷',
            createTime: '2025-06-01'
        },
        submissionDocs: [
            { name: '规划许可证及附件.pdf', required: true, uploadDate: '2026-06-07' },
            { name: '施工许可证及审核单.pdf', required: true, uploadDate: '2026-06-07' },
            { name: '报送承诺书（签字盖章正本）.pdf', required: true, uploadDate: '2026-06-07' }
        ],
        archiveDataPackage: [],
        volumeDataPackage: []
    },
    {
        id: 'arc_audit_4',
        submissionDate: '2026-05-18 11:30:22',
        registrationNumber: 'REG-2026-0518-0921',
        stage: 'COMPLETED',
        projectInfo: {
            id: 'proj_4',
            projectName: '常熟高科精密机械厂房一期工程',
            permitNumber: 'JS32058120250501-12',
            projectCode: '2025-320581-84-01-001234',
            location: '常熟市海虞北路88号',
            constructionUnit: '常熟中恒精密制造机械有限公司',
            constructionCompany: '常熟建工集团有限公司',
            designUnit: '江苏省建筑设计研究院',
            supervisorUnit: '常熟工程项目监理咨询有限公司',
            planningPermitNumber: '建字第3205812025050112号',
            approvalNumber: '常发改决【2025】050号',
            qualityNumber: 'ZJ-CS-2025-05011',
            landPermitNumber: '地字第3205812025049102号',
            approvalUnit: '常熟市发展和改革委员会',
            surveyUnit: '常熟海虞地质工程勘察院',
            projectManager: '沈德新',
            managerPhone: '13915609388',
            operator: '沈华',
            operatorPhone: '18051214088',
            totalArea: '18900.00',
            buildingCount: '3幢',
            totalCost: '5160.00万元',
            volumeCount: '22卷',
            textVolumeCount: '15卷',
            drawingVolumeCount: '7卷',
            createTime: '2025-05-01'
        },
        submissionDocs: [
            { name: '立项批文与规划红线图.pdf', required: true, uploadDate: '2026-05-18' },
            { name: '开工许可证正本.pdf', required: true, uploadDate: '2026-05-18' }
        ],
        archiveDataPackage: [],
        volumeDataPackage: []
    }
];
