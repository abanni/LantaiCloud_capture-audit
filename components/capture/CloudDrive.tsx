
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Cloud, ChevronLeft, Search, Plus, UploadCloud, Folder, 
    FileText, Image as ImageIcon, FileDigit, Monitor, LayoutGrid, List,
    MoreHorizontal, X
} from 'lucide-react';
import { FileItem } from '../../types';
import { INITIAL_CLOUD_FILES } from '../../data/mockCloudFiles';

// Mock Data
const MOCK_FILES: FileItem[] = INITIAL_CLOUD_FILES;

const CloudDrive: React.FC = () => {
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set(['3']));
    const [isUploadPanelOpen, setIsUploadPanelOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ 
        'doc': 100, 
        'dwg': 45, 
        'folder': 0 
    });

    const triggerUpload = () => {
        setIsUploadPanelOpen(true);
        // Simulate progress
        setTimeout(() => setUploadProgress(prev => ({ ...prev, dwg: 60 })), 1000);
        setTimeout(() => setUploadProgress(prev => ({ ...prev, dwg: 80, folder: 10 })), 2000);
    };

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedFiles);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedFiles(newSet);
    };

    const getIcon = (type: string) => {
        switch(type) {
            case 'folder': return <Folder className="w-12 h-12 text-yellow-500 mb-2" />;
            case 'word': return <FileText className="w-12 h-12 text-blue-500 mb-2" />;
            case 'excel': return <FileText className="w-12 h-12 text-green-500 mb-2" />;
            case 'pdf': return <FileText className="w-12 h-12 text-red-500 mb-2" />;
            case 'cad': return <Monitor className="w-12 h-12 text-purple-600 mb-2" />; // Proxy for CAD
            default: return <FileText className="w-12 h-12 text-slate-400 mb-2" />;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-bg overflow-hidden">
            {/* Header */}
            <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5 shadow-sm shrink-0 z-10">
                <div className="flex items-center gap-3 font-bold text-lg text-slate-800">
                    <Cloud className="w-6 h-6 text-primary" />
                    <span>兰台云盘</span>
                    <span className="text-xs font-normal text-slate-400 border-l pl-3 ml-2">
                        昆山开发区城市广场地下主体工程
                    </span>
                </div>
                <div className="flex gap-6 text-sm text-slate-500">
                    <span className="cursor-pointer hover:text-slate-800" onClick={() => navigate('/capture-dashboard')}>返回项目主页</span>
                    <span className="cursor-pointer text-primary font-medium">云盘 (资料收集)</span>
                    <span className="cursor-pointer hover:text-slate-800" onClick={() => navigate('/workspace')}>去归档</span>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Tree */}
                <div className="w-[280px] bg-white border-r border-slate-200 flex flex-col shrink-0">
                    <div className="p-4 border-b border-slate-100">
                        <div className="font-bold text-slate-800 mb-2">🏗️ 昆山开发区城市广场...</div>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="🔍 搜索单位工程..." 
                                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-2">
                        <div className="px-4 text-xs text-slate-400 mb-2">单位工程列表</div>
                        {[
                            '1. 主体结构工程',
                            '2. 地下室防水工程',
                            '3. 配电间安装工程',
                            '4. 暖通空调工程'
                        ].map((item, idx) => (
                            <div 
                                key={idx} 
                                className={`
                                    px-4 py-2 flex items-center text-sm cursor-pointer border-l-4 transition-colors
                                    ${idx === 0 
                                        ? 'bg-primary-light text-primary border-primary font-medium' 
                                        : 'border-transparent text-slate-700 hover:bg-slate-50'}
                                `}
                            >
                                <Building className="w-4 h-4 mr-2" />
                                <span className="flex-1 truncate">{item}</span>
                                <span className="text-[10px] bg-orange-50 text-orange-500 border border-orange-200 px-1 rounded ml-2">
                                    单位
                                </span>
                            </div>
                        ))}
                         <div className="px-4 py-2 text-sm text-slate-400 flex items-center">
                            <Building className="w-4 h-4 mr-2 opacity-50" />
                            <span>5. 室外景观... (还有98个)</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col bg-white">
                    {/* Toolbar */}
                    <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center shrink-0">
                        <div className="flex items-center text-sm text-slate-500">
                            <span className="hover:text-slate-800 cursor-pointer">主体结构工程</span>
                            <span className="mx-2 text-slate-300">/</span>
                            <span className="font-medium text-slate-800">施工资料</span>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded text-sm hover:border-primary hover:text-primary transition-colors">
                                <Search className="w-4 h-4" /> 搜索
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded text-sm hover:border-primary hover:text-primary transition-colors">
                                <Plus className="w-4 h-4" /> 新建文件夹
                            </button>
                            <button 
                                className="flex items-center gap-1 px-4 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary-hover shadow-sm transition-colors"
                                onClick={triggerUpload}
                            >
                                <UploadCloud className="w-4 h-4" /> 上传文件
                            </button>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 flex gap-4 text-xs text-slate-500 items-center">
                        <span className="font-bold text-slate-700">快速筛选:</span>
                        <span className="px-2 py-0.5 rounded-full bg-primary-light text-primary cursor-pointer">全部</span>
                        <span className="px-2 py-0.5 rounded-full hover:text-primary cursor-pointer">📄 文档</span>
                        <span className="px-2 py-0.5 rounded-full hover:text-primary cursor-pointer">🖼️ 图纸</span>
                        <span className="px-2 py-0.5 rounded-full hover:text-primary cursor-pointer">📷 声像</span>
                        <span className="ml-auto">共 12,450 个文件</span>
                    </div>

                    {/* File Grid */}
                    <div className="flex-1 overflow-y-auto p-5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {MOCK_FILES.map(file => (
                                <div 
                                    key={file.id}
                                    onClick={() => toggleSelection(file.id)}
                                    className={`
                                        group relative p-4 border rounded-lg cursor-pointer flex flex-col items-center text-center transition-all
                                        ${selectedFiles.has(file.id) ? 'bg-primary-light border-primary' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'}
                                    `}
                                >
                                    <input 
                                        type="checkbox" 
                                        checked={selectedFiles.has(file.id)} 
                                        readOnly
                                        className={`absolute top-2 left-2 ${selectedFiles.has(file.id) ? 'block' : 'hidden group-hover:block'}`}
                                        title={file.name}
                                    />
                                    {getIcon(file.type)}
                                    <div className="text-sm text-slate-700 line-clamp-2 w-full break-words mb-1">
                                        {file.name}
                                    </div>
                                    <div className="text-[10px] text-slate-400">
                                        {file.size ? `${file.size} | ` : ''}{file.date}
                                    </div>
                                </div>
                            ))}
                            {/* Placeholder */}
                            <div className="p-4 border border-transparent rounded-lg flex flex-col items-center text-center opacity-40">
                                <div className="text-slate-300 font-bold text-2xl mb-2">...</div>
                                <div className="text-sm text-slate-400">其他 12,000+ 个文件</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Panel */}
            {isUploadPanelOpen && (
                <div className="fixed bottom-5 right-5 w-80 bg-white rounded-lg shadow-xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center text-sm font-semibold">
                        <span>正在上传 (3/400)</span>
                        <X className="w-4 h-4 cursor-pointer hover:text-red-500" onClick={() => setIsUploadPanelOpen(false)} />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        <UploadItem name="施工组织设计方案_V2.docx" icon="W" progress={uploadProgress.doc} color="text-blue-500" />
                        <UploadItem name="结构总图.dwg" icon="D" progress={uploadProgress.dwg} color="text-purple-600" />
                        <UploadItem name="/现场照片/3月/" icon="F" progress={uploadProgress.folder} color="text-yellow-500" isFolder />
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper components for CloudDrive
const Building = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
);

const UploadItem = ({ name, icon, progress, color, isFolder }: any) => (
    <div className="px-4 py-3 border-b border-slate-100 flex items-center text-xs">
        <span className={`font-bold mr-2 w-4 text-center ${color}`}>{icon}</span>
        <div className="flex-1 min-w-0 mr-3">
            <div className="truncate mb-1 text-slate-700">{name}</div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full bg-primary transition-all duration-300 w-[${progress}%]`}></div>
            </div>
        </div>
        <span className="text-slate-400 w-8 text-right">{progress === 0 ? 'Wait' : `${progress}%`}</span>
    </div>
);

export default CloudDrive;