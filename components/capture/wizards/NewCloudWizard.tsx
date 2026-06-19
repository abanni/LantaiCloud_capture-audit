
import React, { useState } from 'react';
import { Cloud, X, Loader2 } from 'lucide-react';
import { Project, Identity } from '../../../types';

interface WizardProps {
    onClose: () => void;
    onFinish: (project: Project) => void;
    identity?: Identity;
}

const Label = ({ children, required }: any) => (
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {required && <span className="text-red-500 mr-1">*</span>}
        {children}
    </label>
);

const NewCloudWizard: React.FC<WizardProps> = ({ onClose, onFinish }) => {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (!name) return alert("请输入空间名称");
        setLoading(true);
        setTimeout(() => {
            onFinish({
                id: `cloud_${Date.now()}`,
                name: name,
                status: 'processing',
                progress: 0,
                stage: '云协作',
                tags: ['云协作', '新创建'],
                issues: ['📁 文件夹结构已初始化', `📝 ${desc || '暂无描述'}`]
            });
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-[500px] rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 border-t-4 border-blue-500">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-blue-50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center">
                            <Cloud className="w-5 h-5 mr-2 text-blue-600" />
                            新建云协作空间
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600" title="关闭"><X className="w-6 h-6" /></button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <Label required>空间名称</Label>
                        <input 
                            type="text" 
                            className="w-full border border-slate-200 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="例如：2025年度设计部共享盘"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div>
                        <Label>空间描述 / 备注</Label>
                        <textarea 
                            className="w-full border border-slate-200 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
                            placeholder="简要描述该协作空间的用途..."
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                        />
                    </div>
                    <div className="bg-blue-50 p-3 rounded text-xs text-blue-800 border border-blue-100">
                        <p className="mb-1 font-bold">💡 蓝色状态 - 云协作：</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>不强制执行 GB50328 归档标准</li>
                            <li>支持任意格式文件上传与即时预览</li>
                        </ul>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded text-slate-700 hover:bg-slate-100">取消</button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={loading}
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-sm flex items-center"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {loading ? '创建中...' : '立即创建'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewCloudWizard;
