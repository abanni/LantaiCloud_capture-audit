export interface TreeItem {
    id: string;
    label: string;
    type: 'project' | 'unit' | 'category' | 'folder'; 
    children?: TreeItem[];
    expanded?: boolean;
}

export interface CategoryNode {
    id: string;
    label: string;
}

export interface StandardCategory {
    id: string;
    label: string;
    children: CategoryNode[];
}

export const STANDARD_CATEGORIES: StandardCategory[] = [
    {
        id: 'cat_A', label: 'A 工程准备阶段文件', children: [
            { id: 'sub_A_desc', label: '情况说明' },
            { id: 'sub_A1', label: 'A1 立项文件' },
            { id: 'sub_A2', label: 'A2 建设用地文件' },
            { id: 'sub_A3', label: 'A3 勘察、测绘、设计文件' },
            { id: 'sub_A4', label: 'A4 招投标文件' },
            { id: 'sub_A5', label: 'A5 开工审批文件' },
        ]
    },
    {
        id: 'cat_B', label: 'B 工程监理文件', children: [
            { id: 'sub_B1', label: 'B1 监理管理资料' },
            { id: 'sub_B2', label: 'B2 进度控制资料' },
        ]
    },
    {
        id: 'cat_C', label: 'C 施工文件', children: [
            { id: 'sub_C1', label: 'C1 施工管理文件' },
        ]
    }
];
