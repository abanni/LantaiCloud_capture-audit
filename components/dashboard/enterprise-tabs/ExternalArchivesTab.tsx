import React, { useState } from 'react';
import {
    Database, Plus, X, Info, Link, Lock, KeyRound, Eye, EyeOff,
    Trash2, CheckCircle2
} from 'lucide-react';

const EXTERNAL_ARCHIVES = [
    { id: 'ks-urban', name: '昆山城建档案馆', reviewer: '昆山/徐琴', region: '昆山', code: '320583' },
    { id: 'cs-urban', name: '常熟城建档案馆', reviewer: '常熟/袁翔', region: '常熟', code: '320581' },
];

const FILE_TYPES_OPTIONS = [
    '城市建设档案',
    '建筑工程档案',
    '竣工验收检测报告',
    '勘察设计技术文件',
    '监理日志与安全卷宗',
    '绿化排污专项档案',
];

const generateToken = () => {
    return 'LT-KEY-' + Math.random().toString(36).substr(2, 9).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
};

interface ExternalArchivesTabProps {
    associatedArchives: any[];
    isAddingArchive: boolean;
    setIsAddingArchive: (v: boolean) => void;
    selectedArchiveIdForDetails: string | null;
    setSelectedArchiveIdForDetails: (v: string | null) => void;
    onSaveArchives: (list: any[]) => void;
    onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

const ExternalArchivesTab: React.FC<ExternalArchivesTabProps> = ({
    associatedArchives, isAddingArchive, setIsAddingArchive,
    selectedArchiveIdForDetails, setSelectedArchiveIdForDetails,
    onSaveArchives, onToast
}) => {
    const [selectedExtArchiveId, setSelectedExtArchiveId] = useState('ks-urban');
    const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>(['城市建设档案']);
    const [selectedProtocol, setSelectedProtocol] = useState('GB50328-2014 (2019变动版规范)');
    const [selectedSyncFrequency, setSelectedSyncFrequency] = useState('实时自动上报');
    const [newSecretToken, setNewSecretToken] = useState(generateToken());
    const [addRemarks, setAddRemarks] = useState('');
    const [revealedTokens, setRevealedTokens] = useState<Record<string, boolean>>({});
    const [editingAssocId, setEditingAssocId] = useState<string | null>(null);
    const [editFileTypes, setEditFileTypes] = useState<string[]>([]);

    React.useEffect(() => {
        if (isAddingArchive) {
            setNewSecretToken(generateToken());
            setSelectedFileTypes(['城市建设档案']);
            setAddRemarks('');
            setSelectedExtArchiveId('ks-urban');
        }
    }, [isAddingArchive]);

    const handleSubmitNew = () => {
        if (selectedFileTypes.length === 0) {
            onToast('请至少选择勾选一种关联档案类型！', 'error');
            return;
        }
        const target = EXTERNAL_ARCHIVES.find(a => a.id === selectedExtArchiveId);
        if (!target) return;
        if (associatedArchives.some((a: any) => a.archiveId === selectedExtArchiveId)) {
            onToast(`当前企业已经关联了「${target.name}」，请勿重复接入。`, 'error');
            return;
        }
        const newAssoc = {
            associationId: 'assoc_' + Date.now(),
            archiveId: selectedExtArchiveId,
            archiveName: target.name,
            archiveCode: target.code,
            region: target.region,
            fileTypes: selectedFileTypes,
            liaison: target.reviewer,
            syncFrequency: selectedSyncFrequency,
            token: newSecretToken,
            associatedDate: new Date().toISOString().split('T')[0],
            protocolVersion: selectedProtocol,
            status: 'active',
            remarks: addRemarks.trim(),
        };
        const updated = [newAssoc, ...associatedArchives];
        onSaveArchives(updated);
        setSelectedArchiveIdForDetails(newAssoc.associationId);
        setIsAddingArchive(false);
        onToast(`成功关联接入外部档案馆「${target.name}」！`, 'success');
    };

    const handleDisconnect = (assoc: any) => {
        const c = window.confirm(`警告：您正在断开与「${assoc.archiveName}」的关联接入链路接口。确定断开取消关联吗？`);
        if (!c) return;
        const updated = associatedArchives.filter((a: any) => a.associationId !== assoc.associationId);
        onSaveArchives(updated);
        if (updated.length > 0) {
            setSelectedArchiveIdForDetails(updated[0].associationId);
        } else {
            setSelectedArchiveIdForDetails(null);
        }
        onToast(`已成功取消与外部级联档案馆「${assoc.archiveName}」的数据关联关系。`, 'info');
    };

    return (
        <div className="space-y-6">
            {/* Feature Header Card */}
            <div className="bg-gradient-to-r from-slate-800 to-indigo-900 rounded-lg p-6 text-white shadow-md relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10 w-96 h-96 rounded-full bg-white flex items-center justify-center text-9xl pointer-events-none">DB</div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-xs">
                                <Database className="w-6 h-6 text-indigo-200" />
                            </div>
                            <h3 className="text-lg font-black tracking-tight">外部档案馆关联</h3>
                        </div>
                        <p className="text-xs text-indigo-100 leading-relaxed max-w-xl">
                            将本地兰台云系统（档案数据），通过标准接口协议关联申报至指定的外部档案馆。
                        </p>
                    </div>
                    {!isAddingArchive && (
                        <button
                            onClick={() => setIsAddingArchive(true)}
                            className="px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-lg text-xs shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                        >
                            <Plus className="w-3.5 h-3.5 font-bold" />
                            关联新外部档案馆
                        </button>
                    )}
                </div>
            </div>

            {/* Add New Archive Form */}
            {isAddingArchive && (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 space-y-5">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <Link className="w-5 h-5 text-primary" />
                            <span className="font-bold text-slate-800 text-sm">建立新的外部档案馆关联通道</span>
                        </div>
                        <button onClick={() => setIsAddingArchive(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" title="关闭">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    目标外部档案馆 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedExtArchiveId}
                                    onChange={(e) => setSelectedExtArchiveId(e.target.value)}
                                    className="w-full text-sm px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 font-semibold text-slate-800 transition-all cursor-pointer"
                                    title="目标外部档案馆"
                                >
                                    {EXTERNAL_ARCHIVES.map((arc) => (
                                        <option key={arc.id} value={arc.id}>{arc.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1 select-none">
                                        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span>档案馆唯一ID</span>
                                    </label>
                                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-mono font-bold select-all">
                                        {selectedExtArchiveId}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 select-none">
                                        <span>属地区划编码</span>
                                    </label>
                                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-mono select-all">
                                        {EXTERNAL_ARCHIVES.find(a => a.id === selectedExtArchiveId)?.code}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex gap-3 text-xs text-blue-800 leading-relaxed">
                                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                <div>
                                    该档案馆在系统中已指定 <strong>{EXTERNAL_ARCHIVES.find(a => a.id === selectedExtArchiveId)?.reviewer || '系统默认'}</strong> 作为首问分管对接专家。
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    勾选关联档案类型 (多选) <span className="text-red-500">*</span>
                                </label>
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2.5 max-h-[175px] overflow-y-auto">
                                    {FILE_TYPES_OPTIONS.map((type) => {
                                        const isChecked = selectedFileTypes.includes(type);
                                        return (
                                            <label key={type} className="flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer hover:text-slate-900 group select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => {
                                                        if (isChecked) {
                                                            setSelectedFileTypes(prev => prev.filter(t => t !== type));
                                                        } else {
                                                            setSelectedFileTypes(prev => [...prev, type]);
                                                        }
                                                    }}
                                                    className="w-4 h-4 rounded border-slate-200 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                                                />
                                                <span className="text-xs font-semibold">{type}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Extra Fields */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">数据传输接口协议版本</label>
                            <select
                                value={selectedProtocol}
                                onChange={(e) => setSelectedProtocol(e.target.value)}
                                className="w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded focus:outline-none focus:border-primary font-bold text-slate-700 cursor-pointer"
                                title="数据传输接口协议版本"
                            >
                                <option value="GB50328-2014 (2019变动版规范)">GB50328-2014 (2019变动版)</option>
                                <option value="CS-ST-2025 双向数字关联最新标准">CS-ST-2025 双向关联</option>
                                <option value="Lantai Dynamic Link V3 格式">Lantai Link V3</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">数据同步更新频率</label>
                            <select
                                value={selectedSyncFrequency}
                                onChange={(e) => setSelectedSyncFrequency(e.target.value)}
                                className="w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded focus:outline-none focus:border-primary font-bold text-slate-700 cursor-pointer"
                                title="数据同步更新频率"
                            >
                                <option value="实时自动上报">实时自动上报</option>
                                <option value="每日自动汇总上报">按日零点自动汇总</option>
                                <option value="凭证向导手动上报">人工触发申报向导</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">系统配发API认证 Token</label>
                            <div className="relative">
                                <input type="text" readOnly value={newSecretToken}
                                    className="w-full text-xs px-2.5 py-2 pl-7 bg-slate-100 border border-slate-200 text-slate-600 rounded font-mono select-all cursor-not-allowed font-bold"
                                    title="API认证Token"
                                    placeholder="系统配发的Token" />
                                <span className="absolute left-2 top-2 text-slate-400"><KeyRound className="w-3.5 h-3.5" /></span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">接入申报备注说明 (可选)</label>
                        <textarea
                            rows={2}
                            placeholder="请输入接入本外部档案馆的具体用项目申报备注..."
                            value={addRemarks}
                            onChange={(e) => setAddRemarks(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary resize-none placeholder:text-slate-400"
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                        <button type="button" onClick={() => setIsAddingArchive(false)}
                            className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded hover:bg-slate-50 bg-white">
                            取消
                        </button>
                        <button type="button" onClick={handleSubmitNew}
                            className="px-5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded shadow-xs cursor-pointer">
                            立即提交并开通链路
                        </button>
                    </div>
                </div>
            )}

            {/* Associated Archives List */}
            <div className="space-y-4">
                {associatedArchives.length === 0 ? (
                    <div className="bg-white rounded-lg border border-slate-200 border-dashed p-12 text-center space-y-3">
                        <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto text-xl font-mono">∅</div>
                        <div className="space-y-1">
                            <h5 className="text-sm font-bold text-slate-700">暂无关联外部档案馆</h5>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                                您当前企业并未向任何外部国家档案馆申请关联数据端口。点击上方按钮可以快捷申请。
                            </p>
                        </div>
                    </div>
                ) : !selectedArchiveIdForDetails || !associatedArchives.some((a: any) => a.associationId === selectedArchiveIdForDetails) ? (
                    <div className="bg-white rounded-lg border border-slate-200 border-dashed p-12 text-center space-y-3">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto text-lg font-bold animate-pulse">📌</div>
                        <div className="space-y-1">
                            <h5 className="text-sm font-bold text-slate-700">请自左侧选择已关联的档案馆</h5>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                                点击左侧关联外部档案馆块内的指定档案馆，右侧将呈现详细参数。
                            </p>
                        </div>
                    </div>
                ) : (
                    (() => {
                        const assoc = associatedArchives.find((a: any) => a.associationId === selectedArchiveIdForDetails);
                        if (!assoc) return null;
                        const isTokenVisible = revealedTokens[assoc.associationId] || false;
                        const isEditing = editingAssocId === assoc.associationId;

                        return (
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden transition-all">
                                <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 px-1.5 bg-indigo-50 border border-indigo-150 rounded text-indigo-700 shrink-0">
                                            <Database className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-800 leading-snug">{assoc.archiveName} 级联及配置参数</h4>
                                            <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[10px] text-slate-400">
                                                <span>档案馆统一代号:</span>
                                                <span className="font-bold bg-white text-slate-600 px-1 rounded border border-slate-200">{assoc.archiveId}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="bg-green-50 text-green-700 border border-green-200 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0"></span>
                                        对接关联连通正常
                                    </span>
                                </div>

                                <div className="p-5 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-y-3.5 gap-x-4 text-xs font-medium">
                                        <div><div className="text-slate-400">属地区划绑定</div><div className="font-bold text-slate-800 font-mono">{assoc.region} ({assoc.archiveCode})</div></div>
                                        <div><div className="text-slate-400">档案馆简称</div><div className="font-bold text-slate-800">{assoc.archiveName}</div></div>
                                        <div><div className="text-slate-400">物理传输同步频次</div><div className="font-bold text-teal-600">{assoc.syncFrequency}</div></div>
                                        <div><div className="text-slate-400">开通关联接入时间</div><div className="font-bold text-slate-800 font-mono">{assoc.associatedDate}</div></div>
                                        <div className="md:col-span-2"><div className="text-slate-400">数据关联申报协议</div><div className="font-bold text-slate-800 font-mono">{assoc.protocolVersion}</div></div>
                                        <div className="md:col-span-2">
                                            <div className="text-slate-400 flex items-center gap-1.5">
                                                <span>数据通信密钥</span>
                                                <button type="button"
                                                    onClick={() => setRevealedTokens(prev => ({ ...prev, [assoc.associationId]: !isTokenVisible }))}
                                                    className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer select-none">
                                                    {isTokenVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                            <div className="font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 inline-block text-[11px] select-all relative font-bold">
                                                {isTokenVisible ? assoc.token : `LTX-KEY-****************-MASK`}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50/50 p-3.5 rounded-lg border border-slate-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">已授权直报档案类型</span>
                                            {!isEditing ? (
                                                <button onClick={() => { setEditingAssocId(assoc.associationId); setEditFileTypes([...assoc.fileTypes]); }}
                                                    className="text-[10px] text-primary font-bold hover:underline cursor-pointer">修改授权类型</button>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button onClick={() => setEditingAssocId(null)}
                                                        className="text-[10px] text-slate-500 font-semibold hover:underline cursor-pointer">取消</button>
                                                    <button onClick={() => {
                                                        if (editFileTypes.length === 0) { onToast('请至少选择勾选一种关联档案类型！', 'error'); return; }
                                                        const updated = associatedArchives.map((a: any) =>
                                                            a.associationId === assoc.associationId ? { ...a, fileTypes: editFileTypes } : a
                                                        );
                                                        onSaveArchives(updated);
                                                        setEditingAssocId(null);
                                                        onToast('授权关联档案类型修改成功！', 'success');
                                                    }}
                                                        className="text-[10px] text-primary font-bold hover:underline cursor-pointer">保存修改</button>
                                                </div>
                                            )}
                                        </div>
                                        {isEditing ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                                                {FILE_TYPES_OPTIONS.map((type) => (
                                                    <label key={type} className="flex items-center gap-2 text-xs font-semibold text-gray-750 cursor-pointer select-none">
                                                        <input type="checkbox" checked={editFileTypes.includes(type)}
                                                            onChange={() => {
                                                                if (editFileTypes.includes(type)) setEditFileTypes(prev => prev.filter(t => t !== type));
                                                                else setEditFileTypes(prev => [...prev, type]);
                                                            }}
                                                            className="w-3.5 h-3.5 rounded border-slate-200 text-primary focus:ring-primary/25 accent-primary cursor-pointer" />
                                                        <span>{type}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-1.5">
                                                {assoc.fileTypes.map((type: string) => (
                                                    <span key={type} className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10.5px] rounded font-semibold whitespace-nowrap">{type}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {assoc.remarks && (
                                        <div className="text-[11px] text-slate-500 leading-tight italic bg-slate-50 px-3 py-2 rounded">备注: {assoc.remarks}</div>
                                    )}
                                </div>

                                <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex justify-between items-center font-medium text-xs">
                                    
                                    <button onClick={() => handleDisconnect(assoc)}
                                        className="flex items-center gap-1 text-red-500 hover:text-red-700 font-bold transition-colors text-[11px] cursor-pointer">
                                        <Trash2 className="w-3.5 h-3.5" />断开取消关联
                                    </button>
                                </div>
                            </div>
                        );
                    })()
                )}
            </div>
        </div>
    );
};

export default ExternalArchivesTab;
