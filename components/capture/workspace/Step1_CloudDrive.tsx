
import React, { useState } from 'react';
import { 
    Building, Search, Plus, UploadCloud, LayoutList, LayoutGrid, 
    ScanLine, UserPlus, Folder, FileText, FileSpreadsheet, X, ArrowUpDown
} from 'lucide-react';
import { FileItem } from '../../../types';
import { getFileIcon } from '../../common/fileUtils';

import { INITIAL_CLOUD_FILES } from '../../../data/mockCloudFiles';

const FileGridItem = ({ file, selected, onSelect }: any) => (
    <div onClick={onSelect} className={`group relative p-4 border rounded-lg cursor-pointer flex flex-col items-center text-center transition-all ${selected ? 'bg-primary-light border-primary' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'}`}>
        <input type="checkbox" checked={selected} readOnly className={`absolute top-2 left-2 ${selected ? 'block' : 'hidden group-hover:block'}`} title={file.name} />
        {getFileIcon(file.type, "w-12 h-12 mb-2", file.isDoubleLayer)}
        <div className="text-sm text-slate-700 line-clamp-2 w-full break-words mb-1">{file.name}</div>
        <div className="text-[10px] text-slate-400">{file.size ? `${file.size} | ` : ''}{file.date}</div>
    </div>
);

const FileListRow = ({ file, selected, onSelect }: any) => (
    <tr onClick={onSelect} className={`hover:bg-slate-50 cursor-pointer ${selected ? 'bg-blue-50' : ''}`}>
        <td className="px-6 py-4 whitespace-nowrap"><input type="checkbox" checked={selected} readOnly className="rounded border-slate-200 text-primary focus:ring-primary" title={file.name} /></td>
        <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center">{getFileIcon(file.type, "w-5 h-5 mr-3", file.isDoubleLayer)}<span className="text-sm font-medium text-slate-900">{file.name}</span></div></td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{file.size}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{file.date}</td>
        <td className="px-6 py-4 whitespace-nowrap">{file.collaborators ? (<div className="flex -space-x-1 overflow-hidden">{file.collaborators.map((c: string, i: number) => (<div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-400 flex items-center justify-center text-xs text-white">{c}</div>))}</div>) : (<span className="text-xs text-slate-400">私有</span>)}</td>
    </tr>
);

const UploadItem = ({ name, icon, progress, color, isFolder }: any) => (
    <div className="px-4 py-3 border-b border-slate-100 flex items-center text-xs">
        <span className={`font-bold mr-2 w-4 text-center ${color}`}>{icon}</span>
        <div className="flex-1 min-w-0 mr-3"><div className="truncate mb-1 text-slate-700">{name}</div><div className="h-1 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full bg-primary transition-all duration-300 w-[${progress}%]`}></div></div></div>
        <span className="text-slate-400 w-8 text-right">{progress === 0 ? 'Wait' : `${progress}%`}</span>
    </div>
);

const CloudDriveView: React.FC = () => {
    const [files, setFiles] = useState<FileItem[]>(INITIAL_CLOUD_FILES);
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set([]));
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [sortConfig, setSortConfig] = useState<{key: keyof FileItem, direction: 'asc' | 'desc'}>({ key: 'date', direction: 'desc' });
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const [isUploadPanelOpen, setIsUploadPanelOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ 'doc': 100, 'dwg': 45, 'folder': 0 });
    const [isUploading, setIsUploading] = useState(false);

    const triggerUpload = () => {
        setIsUploading(true);
        setIsUploadPanelOpen(true);
        setTimeout(() => setUploadProgress(prev => ({ ...prev, dwg: 60 })), 1000);
        setTimeout(() => {
            setUploadProgress(prev => ({ ...prev, dwg: 100, folder: 100 }));
            setIsUploading(false);
            const newFile: FileItem = { id: `new_${Date.now()}`, name: '新上传的现场视频.mp4', type: 'image', size: '250MB', date: '刚刚' } as any;
            setFiles(prev => [newFile, ...prev]);
        }, 2000);
    };

    const createNewFile = (type: 'word' | 'excel' | 'folder') => {
        setShowCreateMenu(false);
        const ext = type === 'word' ? '.docx' : type === 'excel' ? '.xlsx' : '';
        const name = type === 'folder' ? '新建文件夹' : `新建${type === 'word' ? '文档' : '表格'}${ext}`;
        const newFile: FileItem = {
            id: `create_${Date.now()}`,
            name: name,
            type: type === 'folder' ? 'folder' : type,
            size: type === 'folder' ? '-' : '0KB',
            date: '刚刚',
            collaborators: ['ME']
        } as FileItem;
        setFiles(prev => [newFile, ...prev]);
    };

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedFiles);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedFiles(newSet);
    };

    const handleSort = (key: keyof FileItem) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedFiles = [...files].sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const runOCR = () => {
        const filesToOCR = files.filter(f => selectedFiles.has(f.id) && (f.type === 'pdf' || f.type === 'ofd') && !f.isDoubleLayer);
        if (filesToOCR.length === 0) {
            alert("请选择需要进行双层转换的普通PDF/OFD文件");
            return;
        }
        setFiles(prev => prev.map(f => {
            if (selectedFiles.has(f.id)) return { ...f, status: 'processing' };
            return f;
        }));
        setTimeout(() => {
            setFiles(prev => prev.map(f => {
                if (selectedFiles.has(f.id)) return { ...f, status: 'normal', isDoubleLayer: true };
                return f;
            }));
            alert(`成功转换 ${filesToOCR.length} 个文件为双层文档`);
            setSelectedFiles(new Set());
        }, 2000);
    };

    return (
        <div className="flex h-full bg-white relative">
            <div className="w-[260px] bg-white border-r border-slate-200 flex flex-col shrink-0">
                <div className="p-4 border-b border-slate-100">
                    <div className="font-bold text-slate-800 mb-2">🏗️ 昆山开发区城市广场...</div>
                    <div className="relative">
                        <input type="text" placeholder="🔍 搜索单位工程..." className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs outline-none focus:border-primary" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto py-2">
                    <div className="px-4 text-xs text-slate-400 mb-2">单位工程列表</div>
                    {['1. 主体结构工程', '2. 地下室防水工程', '3. 配电间安装工程', '4. 暖通空调工程'].map((item, idx) => (
                        <div key={idx} className={`px-4 py-2 flex items-center text-sm cursor-pointer border-l-4 transition-colors ${idx === 0 ? 'bg-primary-light text-primary border-primary font-medium' : 'border-transparent text-slate-700 hover:bg-slate-50'}`}>
                            <Building className="w-4 h-4 mr-2" />
                            <span className="flex-1 truncate">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 flex flex-col bg-white">
                <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center shrink-0">
                    <div className="flex items-center text-sm text-slate-500">
                        <span className="hover:text-slate-800 cursor-pointer">主体结构工程</span>
                        <span className="mx-2 text-slate-300">/</span>
                        <span className="font-medium text-slate-800">施工资料</span>
                    </div>
                    <div className="flex gap-3 items-center">
                        {selectedFiles.size > 0 && (
                            <div className="flex items-center mr-4 gap-2 animate-in fade-in slide-in-from-top-2">
                                <span className="text-xs text-slate-500 mr-2">已选 {selectedFiles.size} 项</span>
                                <button onClick={runOCR} className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded text-sm hover:bg-indigo-100 transition-colors"><ScanLine className="w-3.5 h-3.5" /> 双层转换(OCR)</button>
                                <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded text-sm hover:bg-slate-100"><UserPlus className="w-3.5 h-3.5" /> 协作</button>
                            </div>
                        )}
                        <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>
                        <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200">
                            <button onClick={() => setViewMode('list')} title="列表视图" className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}><LayoutList className="w-4 h-4" /></button>
                            <button onClick={() => setViewMode('grid')} title="网格视图" className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}><LayoutGrid className="w-4 h-4" /></button>
                        </div>
                        <div className="relative">
                            <button onClick={() => setShowCreateMenu(!showCreateMenu)} className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded text-sm hover:border-primary hover:text-primary transition-colors"><Plus className="w-4 h-4" /> 新建</button>
                            {showCreateMenu && (
                                <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-slate-200 rounded shadow-lg z-50 py-1">
                                    <div onClick={() => createNewFile('folder')} className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm flex items-center"><Folder className="w-4 h-4 mr-2 text-yellow-500"/> 文件夹</div>
                                    <div onClick={() => createNewFile('word')} className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm flex items-center"><FileText className="w-4 h-4 mr-2 text-blue-500"/> Word 文档</div>
                                    <div onClick={() => createNewFile('excel')} className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm flex items-center"><FileSpreadsheet className="w-4 h-4 mr-2 text-green-500"/> Excel 表格</div>
                                </div>
                            )}
                        </div>
                        <button className="flex items-center gap-1 px-4 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary-hover shadow-sm transition-colors" onClick={triggerUpload}><UploadCloud className="w-4 h-4" /> 上传</button>
                    </div>
                </div>
                <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 flex gap-4 text-xs text-slate-500 items-center">
                    <span className="font-bold text-slate-700">快速筛选:</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary-light text-primary cursor-pointer">全部</span>
                    <span className="px-2 py-0.5 rounded-full hover:text-primary cursor-pointer">文档</span>
                    <span className="px-2 py-0.5 rounded-full hover:text-primary cursor-pointer">图纸</span>
                    <span className="px-2 py-0.5 rounded-full hover:text-primary cursor-pointer">双层OFD/PDF</span>
                    <div className="ml-auto flex items-center gap-3">
                         <span className="text-slate-400">排序:</span>
                         <span onClick={() => handleSort('date')} className="cursor-pointer hover:text-primary flex items-center">时间 <ArrowUpDown className="w-3 h-3 ml-1"/></span>
                         <span onClick={() => handleSort('size')} className="cursor-pointer hover:text-primary flex items-center">大小 <ArrowUpDown className="w-3 h-3 ml-1"/></span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-5 relative">
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {sortedFiles.map(file => <FileGridItem key={file.id} file={file} selected={selectedFiles.has(file.id)} onSelect={() => toggleSelection(file.id)} />)}
                        </div>
                    ) : (
                        <div className="min-w-full inline-block align-middle">
                            <div className="border rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-slate-100">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-10"><input type="checkbox" className="rounded border-slate-200 text-primary focus:ring-primary" title="全选" /></th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>文件名</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-32 cursor-pointer" onClick={() => handleSort('size')}>大小</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-40 cursor-pointer" onClick={() => handleSort('date')}>修改时间</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-32">状态/协作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-100">
                                        {sortedFiles.map(file => <FileListRow key={file.id} file={file} selected={selectedFiles.has(file.id)} onSelect={() => toggleSelection(file.id)} />)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isUploadPanelOpen && (
                <div className="absolute bottom-5 right-5 w-80 bg-white rounded-lg shadow-xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 z-30">
                    <div className={`px-4 py-3 border-b border-slate-200 flex justify-between items-center text-sm font-semibold ${isUploading ? 'bg-blue-50' : 'bg-green-50'}`}>
                        <span className={isUploading ? 'text-blue-700' : 'text-green-700'}>{isUploading ? '正在上传 (2/3)...' : '上传完成'}</span>
                        <X className="w-4 h-4 cursor-pointer hover:text-slate-800 opacity-50" onClick={() => setIsUploadPanelOpen(false)} />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        <UploadItem name="结构总图.dwg" icon="D" progress={uploadProgress.dwg} color="text-purple-600" />
                        <UploadItem name="/现场照片/3月/" icon="F" progress={uploadProgress.folder} color="text-yellow-500" isFolder />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CloudDriveView;
