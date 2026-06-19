import React from 'react';
import { FolderTree, FolderOpen, FileText, Plus, Pencil } from 'lucide-react';

const treeData = [
    {
        label: '房屋建筑工程',
        icon: FolderOpen,
        children: [
            { label: '地基与基础工程', icon: FolderOpen, children: [
                { label: '地基处理记录', icon: FileText },
                { label: '基础施工记录', icon: FileText },
            ]},
            { label: '主体结构工程', icon: FolderOpen, children: [
                { label: '钢结构施工记录', icon: FileText },
                { label: '混凝土施工记录', icon: FileText },
            ]},
            { label: '建筑装饰装修工程', icon: FolderOpen },
        ],
    },
    {
        label: '市政基础设施工程',
        icon: FolderOpen,
        children: [
            { label: '道路工程', icon: FolderOpen, children: [
                { label: '道路基层施工', icon: FileText },
                { label: '路面面层施工', icon: FileText },
            ]},
            { label: '桥梁工程', icon: FolderOpen },
            { label: '给排水工程', icon: FolderOpen },
        ],
    },
    {
        label: '交通建设工程',
        icon: FolderOpen,
        children: [
            { label: '公路工程', icon: FolderOpen },
            { label: '铁路工程', icon: FolderOpen },
        ],
    },
];

interface TreeNodeProps {
    label: string;
    icon: React.ElementType;
    children?: { label: string; icon: React.ElementType; children?: any[] }[];
    depth?: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ label, icon: Icon, children, depth = 0 }) => (
    <div>
        <div className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-50 cursor-pointer group ${depth > 0 ? 'ml-6' : ''}`}>
            <Icon className={`w-3.5 h-3.5 ${depth === 0 ? 'text-rose-500' : 'text-slate-400'}`} />
            <span className="text-xs text-slate-700 font-medium">{label}</span>
            {depth === 0 && (
                <button className="ml-auto opacity-0 group-hover:opacity-100 text-primary hover:text-primary-hover">
                    <Plus className="w-3 h-3" />
                </button>
            )}
        </div>
        {children?.map((child, i) => (
            <TreeNode key={i} {...child} depth={depth + 1} />
        ))}
    </div>
);

const ProjectTypeTreeTab: React.FC = () => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">项目类型树</h2>
                    <p className="text-xs text-slate-400 mt-0.5">项目类型与工程分类的层级结构树</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-hover transition-all">
                    <Plus className="w-3.5 h-3.5" />新增根节点
                </button>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/30">
                {treeData.map((node, i) => (
                    <TreeNode key={i} {...node} />
                ))}
            </div>
        </div>
    );
};

export default ProjectTypeTreeTab;
