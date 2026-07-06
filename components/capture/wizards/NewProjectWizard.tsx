
import React, { useState } from 'react';
import { 
    X, Archive, Building2, Landmark, Video, BookOpen, 
    Microscope, Calculator, FileBadge, ArrowLeft, ChevronRight,
    Loader2, RefreshCw, Download, Upload, PenTool, ShieldCheck, CheckCircle,
    Database, Link, Lock
} from 'lucide-react';
import { Project, Identity } from '../../../types';

const EXTERNAL_ARCHIVES = [
    { id: 'ks-urban', name: '昆山市城建档案馆', reviewer: '昆山/李娜', region: '昆山', code: '320583' },
    { id: 'cs-urban', name: '常熟市城市建设档案馆', reviewer: '常熟/许志平', region: '常熟', code: '320581' },
];

interface WizardProps {
    onClose: () => void;
    onFinish: (project: Project) => void;
    identity?: Identity;
    isFullWorkspace?: boolean;
    resumeProject?: Project;
    currentArchiveId?: string;
}

interface ArchiveType {
    id: string;
    label: string;
    sub: string;
    icon: any;
    color: string;
    bg: string;
    children?: { id: string, label: string }[];
}

const ARCHIVE_TYPES: ArchiveType[] = [
    { 
        id: 'construction', 
        label: '建设工程档案', 
        sub: '房屋建筑、市政公用、市政配套', 
        icon: Building2, 
        color: 'text-primary', 
        bg: 'bg-blue-50',
        children: [
            { id: 'housing', label: '房屋建筑工程' },
            { id: 'municipal_public', label: '市政公用工程' },
            { id: 'municipal_support', label: '市政配套工程' },
            { id: 'transport', label: '交通运输工程' }
        ]
    },
    { 
        id: 'management', 
        label: '建设管理档案', 
        sub: '招投标、质量监督、园林、村镇', 
        icon: Landmark, 
        color: 'text-primary', 
        bg: 'bg-blue-50',
        children: [
            { id: 'bidding', label: '招投标档案' },
            { id: 'quality', label: '质量监督档案' },
            { id: 'garden', label: '园林绿化档案' },
            { id: 'village', label: '村镇建设档案' }
        ]
    },
    { id: 'media', label: '声像档案', sub: '工程照片、录音、录像', icon: Video, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'admin', label: '文书档案', sub: '行政文书、党务文书', icon: BookOpen, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'tech', label: '科技档案', sub: '科研项目、设备仪器', icon: Microscope, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: 'account', label: '会计档案', sub: '会计凭证、会计账簿', icon: Calculator, color: 'text-pink-600', bg: 'bg-pink-50' },
];

const StepDot = ({ number, label, active, current }: any) => (
    <div className={`flex items-center ${active ? 'text-primary' : 'text-slate-400'}`}>
        <div className={`
            w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mr-2
            ${active ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'bg-slate-100 text-slate-400'}
        `}>
            {number}
        </div>
        <span className={`text-sm ${current ? 'font-bold text-slate-800' : 'font-medium'}`}>{label}</span>
    </div>
);

const Label = ({ children, required }: any) => (
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {required && <span className="text-red-500 mr-1">*</span>}
        {children}
    </label>
);

const NewProjectWizard: React.FC<WizardProps> = ({ onClose, onFinish, identity, isFullWorkspace, resumeProject, currentArchiveId }) => {
    const [step, setStep] = useState(resumeProject ? 4 : 1); 
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<string | null>(resumeProject ? 'construction' : null);
    const [selectedSubType, setSelectedSubType] = useState<string | null>(resumeProject ? 'housing' : null);

    // --- Associated Archives Integration ---
    const [associatedArchives, setAssociatedArchives] = useState<any[]>([]);
    const [useExternalArchive, setUseExternalArchive] = useState<boolean>(
        resumeProject 
            ? (resumeProject.assignedReviewer !== '兰台本地直属区' && resumeProject.assignedReviewer !== '本地直管' && !resumeProject.assignedReviewer?.includes('本地'))
            : currentArchiveId === 'kunshan'
    );
    const [selectedAssociatedId, setSelectedAssociatedId] = useState<string>(currentArchiveId === 'kunshan' ? 'ks-urban' : '');

    const getFilteredArchiveTypes = (): ArchiveType[] => {
        if (!useExternalArchive || !selectedAssociatedId) {
            return ARCHIVE_TYPES;
        }
        const archive = EXTERNAL_ARCHIVES.find(e => e.id === selectedAssociatedId);
        if (!archive) return ARCHIVE_TYPES;
        
        if (archive.id.includes('urban') || archive.name.includes('城建')) {
            return ARCHIVE_TYPES.filter(t => ['construction', 'management', 'media'].includes(t.id));
        } else if (archive.id.includes('general') || archive.name.includes('综合') || archive.name === '昆山市档案馆(城建部)') {
            return ARCHIVE_TYPES.filter(t => ['management', 'media', 'admin', 'tech', 'account'].includes(t.id));
        }
        return ARCHIVE_TYPES;
    };

    const filteredTypes = getFilteredArchiveTypes();

    React.useEffect(() => {
        if (selectedType) {
            const isAllowed = filteredTypes.some(t => t.id === selectedType);
            if (!isAllowed) {
                setSelectedType(null);
                setSelectedSubType(null);
            }
        }
    }, [useExternalArchive, selectedAssociatedId]);

    React.useEffect(() => {
        const orgId = identity?.organization?.id;
        let list: any[] = [];
        if (orgId) {
            const key = `lantes_associated_archives_${orgId}`;
            const stored = localStorage.getItem(key);
            if (stored) {
                try {
                    list = JSON.parse(stored);
                } catch (e) {
                    console.error("Failed to parse associated archives", e);
                }
            }
        }

        // Initialize fallback/default list if empty
        if (list.length === 0) {
            if (orgId === 'org_wuwu') {
                list = [
                    {
                        associationId: 'assoc_1',
                        archiveId: 'ks-urban',
                        archiveName: '昆山市城市建设档案馆',
                        archiveCode: '320583',
                        region: '昆山',
                        fileTypes: ['城市建设档案', '竣工验收检测报告', '监理日志与安全卷宗'],
                        liaison: '昆山/李娜',
                        syncFrequency: '实时自动上报',
                        token: 'LT-TOK-KS-98321-G9',
                        associatedDate: '2026-05-10',
                        protocolVersion: 'GB50328-2014 (2019变动版规范)',
                        status: 'active'
                    }
                ];
            } else if (orgId === 'org_cs') {
                list = [
                    {
                        associationId: 'assoc_2',
                        archiveId: 'cs-urban',
                        archiveName: '常熟市国家级城建档案馆',
                        archiveCode: '320581',
                        region: '常熟',
                        fileTypes: ['建筑工程档案', '竣工验收检测报告'],
                        liaison: '常熟/许志平',
                        syncFrequency: '每日自动上报',
                        token: 'LT-TOK-CS-38291-B3',
                        associatedDate: '2026-05-24',
                        protocolVersion: 'GB50328-2014 (2019变动版规范)',
                        status: 'active'
                    }
                ];
            } else {
                // Default fallback
                const initialArchive = EXTERNAL_ARCHIVES[0];
                list = [
                    {
                        associationId: 'assoc_fallback',
                        archiveId: initialArchive.id,
                        archiveName: initialArchive.name,
                        archiveCode: initialArchive.code,
                        region: initialArchive.region,
                        fileTypes: ['城市建设档案'],
                        liaison: initialArchive.reviewer,
                        syncFrequency: '实时自动上报',
                        token: 'LT-TOK-FAL-12345',
                        associatedDate: '2026-06-05',
                        protocolVersion: 'GB50328-2014 (2019变动版规范)',
                        status: 'active'
                    }
                ];
            }
        }

        setAssociatedArchives(list);
        
        // Find default selection ID
        let defaultId = list[0]?.archiveId || EXTERNAL_ARCHIVES[0].id;
        if (resumeProject?.assignedReviewer) {
            const matched = EXTERNAL_ARCHIVES.find(ea => ea.reviewer === resumeProject.assignedReviewer || resumeProject.assignedReviewer.includes(ea.region));
            if (matched) {
                defaultId = matched.id;
            }
        } else {
            const matched = list.find(a => a.archiveName === identity?.archiveOrg?.name || a.archiveId === identity?.archiveOrg?.id);
            if (matched) {
                defaultId = matched.archiveId;
            }
        }
        setSelectedAssociatedId(defaultId);
    }, [identity?.organization?.id, identity?.archiveOrg?.id, resumeProject]);

    const activeTargetArchive = EXTERNAL_ARCHIVES.find(a => a.id === selectedAssociatedId) || {
        id: selectedAssociatedId || 'unknown',
        name: identity?.archiveOrg?.name || currentArchiveId === 'kunshan' ? '昆山市城建档案馆' : '未知档案馆',
        region: identity?.archiveOrg?.region || currentArchiveId === 'kunshan' ? '昆山' : '其他',
        code: '320583',
        reviewer: '昆山/李娜'
    };

    const archiveRegion = useExternalArchive ? activeTargetArchive.region : '本地库区';
    const archiveName = useExternalArchive ? activeTargetArchive.name : '兰台本地安全存证中心';

    const [formData, setFormData] = useState({
        name: resumeProject?.name || '',
        code: resumeProject?.regNo || resumeProject?.licenceNo || 'KS-2025-GX-001', 
        permitNo: resumeProject?.licenceNo || '320583202508190204', 
        address: resumeProject?.address || '昆山高新区南淞路西侧、中华园路北侧',
        region: resumeProject?.assignedReviewer?.replace('档案馆', '') || archiveRegion, 
        constructionUnit: resumeProject?.constructionUnit || identity?.organization?.name || '',
        designUnit: resumeProject?.designUnit || '苏州园林设计院有限公司',
    });

    // Sync formData region and permit number when selectedAssociatedId / activeTargetArchive changes
    React.useEffect(() => {
        if (selectedAssociatedId) {
            const chosen = EXTERNAL_ARCHIVES.find(a => a.id === selectedAssociatedId);
            if (chosen) {
                setFormData(prev => ({
                    ...prev,
                    region: chosen.region
                }));
                // Auto change permitPrefix if default dummy
                const prefix = chosen.code;
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                const dateStr = `${yyyy}${mm}${dd}`;
                const randomStr = String(Math.floor(1000 + Math.random() * 9000));
                setFormData(prev => ({
                    ...prev,
                    permitNo: `${prefix}${dateStr}${randomStr}`
                }));
            }
        }
    }, [selectedAssociatedId]);

    const triggerGenerateSimulatedPermitNo = (archiveCode: string) => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}${mm}${dd}`;
        const randomStr = String(Math.floor(1000 + Math.random() * 9000));
        const simVal = `${archiveCode}${dateStr}${randomStr}`;
        setFormData(prev => ({ ...prev, permitNo: simVal }));
    };

    const [isSigned, setIsSigned] = useState(false);
    const [signMethod, setSignMethod] = useState<'online' | 'client' | 'upload'>('online');
    const [auditStatus, setAuditStatus] = useState<'pending' | 'approved'>('pending');

    const handleImport = () => {
        setIsLoading(true);
        setTimeout(() => {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}${mm}${dd}`;
            const randomStr = String(Math.floor(1000 + Math.random() * 9000));
            setFormData({
                ...formData,
                name: '昆山高新区南淞路西侧住宅项目',
                code: 'KS-2025-GX-001',
                permitNo: `${archiveRegion === '常熟' ? '320581' : '320583'}${dateStr}${randomStr}`,
                address: '昆山高新区南淞路西侧、中华园路北侧',
                designUnit: '苏州园林设计院有限公司',
            });
            setIsLoading(false);
        }, 1000);
    };

    const activeTypeObj = ARCHIVE_TYPES.find(t => t.id === selectedType);
    const hasSubTypes = activeTypeObj?.children && activeTypeObj.children.length > 0;
    const isConstruction = selectedType === 'construction';

    const handleNext = () => {
        if (step === 1) {
            if (!selectedType) return alert("请选择档案类型");
            if (hasSubTypes) {
                setStep(2); 
            } else {
                setStep(3); 
            }
        } else if (step === 2) {
            if (!selectedSubType) return alert("请选择二级分类");
            setStep(3);
        } else if (step === 3) {
            if (!formData.name) return alert("请输入项目名称");
            if (isConstruction && useExternalArchive) {
                setStep(4);
            } else {
                finishCreation();
            }
        } else if (step === 4) {
            if (!isSigned) return alert("请完成档案承诺书的签署或上传");
            setStep(5);
            setTimeout(() => {
                setAuditStatus('approved');
            }, 2500);
        } else if (step === 5 && auditStatus === 'approved') {
            finishCreation();
        }
    };

    const handleBack = () => {
        if (step === 5) setStep(4);
        else if (step === 4) setStep(3);
        else if (step === 3) {
            if (hasSubTypes) setStep(2);
            else setStep(1);
        }
        else if (step === 2) setStep(1);
    };

    const finishCreation = () => {
        const typeLabel = activeTypeObj?.label || '其他档案';
        const subTypeLabel = activeTypeObj?.children?.find(c => c.id === selectedSubType)?.label;
        const fullType = subTypeLabel ? `${typeLabel} \\ ${subTypeLabel}` : typeLabel;

        onFinish({
            id: resumeProject?.id || `new_archive_${Date.now()}`,
            name: formData.name,
            status: resumeProject?.status || 'processing',
            progress: resumeProject?.progress || 0,
            stage: resumeProject?.stage || '创建中',
            tags: resumeProject?.tags || ['归档', typeLabel],
            issues: resumeProject?.issues || ['✅ 基础档案库已建立'],
            archiveType: resumeProject?.archiveType || fullType,
            regNo: isConstruction ? '2025-0005' : undefined,
            organizationId: resumeProject?.organizationId || identity?.organization?.id,
            isManaged: resumeProject?.isManaged ?? true,
            memberCount: resumeProject?.memberCount || (identity?.organization?.id === 'org_wuwu' ? 3 : identity?.organization?.id === 'org_qt' ? 2 : identity?.organization?.id === 'org_cs' ? 2 : 1),
            assignedReviewer: resumeProject?.assignedReviewer || (useExternalArchive ? activeTargetArchive.reviewer : '兰台本地直属区'),
            licenceNo: useExternalArchive ? formData.permitNo : '无外部关联（仅存兰台本地）',
            address: formData.address,
            constructionUnit: formData.constructionUnit || identity?.organization?.name || '',
            designUnit: formData.designUnit,
        });
    };

    const isEsignSupported = archiveRegion === '昆山';

    return (
        <div className={isFullWorkspace ? "w-full h-full flex flex-col" : "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"}>
            <div className={`bg-white flex flex-col overflow-hidden transition-all duration-300 border-t-4 border-primary ${
                isFullWorkspace 
                    ? 'w-full h-full rounded-2xl border border-slate-200 shadow-md' 
                    : `rounded-lg shadow-2xl animate-in zoom-in-95 ${step <= 1 ? 'w-[900px] h-[600px]' : 'w-[800px] h-[650px]'}`
            }`}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-blue-50/50">
                    <div>
                        <div className="text-[10px] text-primary font-bold uppercase tracking-wide mb-1 flex items-center gap-1.5 flex-wrap">
                            <span className={`w-1.5 h-1.5 rounded-full ${useExternalArchive ? 'bg-primary animate-pulse' : 'bg-green-500'} shrink-0`}></span>
                            <span>当前归档目标：</span>
                            {useExternalArchive ? (
                                <>
                                    <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-extrabold">{archiveName}</span>
                                    <span className="text-slate-500 font-semibold">(已对接外部档案馆)</span>
                                    <span className="text-slate-400 font-normal">({selectedAssociatedId ? `通道ID: ${selectedAssociatedId}` : ''})</span>
                                    <span className="bg-green-100 text-green-800 text-[9px] font-bold px-1.5 py-0.5 rounded">兰台同步双向备份 1:1</span>
                                </>
                            ) : (
                                <>
                                    <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-extrabold">{archiveName}</span>
                                    <span className="text-slate-500 font-semibold">(企业直属安全存证)</span>
                                    <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded">100% 兰台独立存储</span>
                                </>
                            )}
                        </div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center">
                            <Archive className="w-5 h-5 mr-2 text-primary" />
                            新建档案项目
                        </h2>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <StepDot number={1} label="档案分类" active={step >= 1} current={step === 1 || step === 2} />
                            <div className={`w-5 h-[2px] ${step >= 3 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                            <StepDot number={2} label="基本信息" active={step >= 3} current={step === 3} />
                            {isConstruction && useExternalArchive && (
                                <>
                                    <div className={`w-5 h-[2px] ${step >= 4 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                                    <StepDot number={3} label="签署档案承诺书" active={step >= 4} current={step === 4} />
                                    <div className={`w-5 h-[2px] ${step >= 5 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                                    <StepDot number={4} label="审核登记" active={step >= 5} current={step === 5} />
                                </>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} title="关闭" className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
                </div>

                {/* Body */}
                <div className="flex-1 p-8 overflow-y-auto bg-[#f8fafc]">
                    
                    {/* STEP 1: Dynamic Primary Type Selection */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-1.5">请选择档案大类</h3>
                                <p className="text-slate-400 text-xs">
                                    {useExternalArchive ? `正在加载【${archiveName}】所允许的接收类别规范` : '正使用本地兰台全景目录（无类型受限）'}
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                {filteredTypes.map((type) => (
                                    <div 
                                        key={type.id}
                                        onClick={() => {
                                            setSelectedType(type.id);
                                            if (type.children && type.children.length > 0) {
                                                setStep(2);
                                            } else {
                                                setStep(3);
                                            }
                                        }}
                                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-orange-400 hover:shadow-md cursor-pointer transition-all flex flex-col items-center text-center group"
                                    >
                                        <div className={`w-12 h-12 rounded-full ${type.bg} ${type.color} flex items-center justify-center mb-4.5 group-hover:scale-108 transition-transform`}>
                                            <type.icon className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-sm mb-1">{type.label}</h4>
                                        <p className="text-xs text-slate-400 font-normal">{type.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Secondary Type Selection */}
                    {step === 2 && activeTypeObj?.children && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                             <div className="text-center mb-6">
                                <div className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 bg-slate-100 rounded-full text-xs text-slate-500 cursor-pointer hover:bg-slate-200" onClick={() => setStep(1)}>
                                    <ArrowLeft className="w-3 h-3" /> 返回上级：{activeTypeObj.label}
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">请选择子类别</h3>
                                <p className="text-slate-400 text-xs">进一步细分类型以适配接收元数据规范</p>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                {activeTypeObj.children.map((sub) => (
                                    <div 
                                        key={sub.id}
                                        onClick={() => {
                                            setSelectedSubType(sub.id);
                                            setStep(3);
                                        }}
                                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-orange-400 hover:shadow-md cursor-pointer transition-all flex items-center group animate-in zoom-in-95 duration-200"
                                    >
                                        <div className={`w-10 h-10 rounded-full ${activeTypeObj.bg} ${activeTypeObj.color} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0`}>
                                            <FileBadge className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-bold text-slate-800 text-sm leading-tight">{sub.label}</h4>
                                            <p className="text-[11px] text-slate-400 mt-0.5">立项进行档案采集</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-primary transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Basic Info */}
                    {step === 3 && (
                        <div className="space-y-6">
                            {isConstruction && (
                                <div className="flex justify-between items-center bg-orange-50 p-3 rounded border border-orange-100 mb-6">
                                    <span className="text-sm text-orange-850">💡 提示：本流程用于正式档案移交，数据结构将严格遵循GB50328标准。</span>
                                    <button 
                                        type="button"
                                        onClick={handleImport}
                                        disabled={isLoading}
                                        className="flex items-center px-3 py-1.5 bg-white border border-orange-200 text-orange-700 rounded text-sm hover:bg-orange-50 shadow-sm transition-colors cursor-pointer"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                                        智能一键导入
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                                <div className="col-span-2">
                                    <Label required>项目名称 {isConstruction ? '(立项名)' : ''}</Label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:ring-orange-500 focus:border-primary"
                                        placeholder="请输入项目名称"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                
                                {isConstruction ? (
                                    <>
                                        <div>
                                            <Label required>立项文号 / 代码</Label>
                                            <input 
                                                title="立项文号/代码"
                                                type="text" 
                                                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:ring-orange-500 focus:border-primary"
                                                value={formData.code}
                                                onChange={e => setFormData({...formData, code: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <Label required>选择档案馆区域</Label>
                                            <div className="w-full border border-slate-200 bg-slate-100 rounded px-3 py-2 text-xs text-slate-700 flex justify-between items-center cursor-not-allowed font-medium">
                                                <span>{archiveRegion}</span>
                                                <span className="text-[10px] bg-slate-200 px-1.5 rounded-sm">级联定位</span>
                                            </div>
                                        </div>
                                        
                                        <div className="col-span-2 bg-gradient-to-r from-orange-50/20 to-amber-50/35 p-4 rounded-lg border border-amber-100">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <Label required>施工许可证号 (Simulated Construction Licence)</Label>
                                                <button
                                                    type="button"
                                                    onClick={() => triggerGenerateSimulatedPermitNo(archiveRegion === '常熟' ? '320581' : '320583')}
                                                    className="text-[11px] font-bold text-orange-850 hover:text-orange-950 hover:underline flex items-center gap-1 cursor-pointer"
                                                >
                                                    <span>✨ 🪄 模拟许可证号 rules</span>
                                                </button>
                                            </div>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    title="施工许可证号"
                                                    className="flex-1 border border-amber-200 rounded px-3 py-2 font-mono text-xs tracking-wide bg-white focus:ring-orange-500 focus:border-primary text-slate-800"
                                                    value={formData.permitNo}
                                                    onChange={e => setFormData({...formData, permitNo: e.target.value})}
                                                    placeholder="请输入 3205* 许可证号"
                                                />
                                                <div className="text-[10px] text-amber-900 p-2 bg-amber-55 rounded border border-amber-100/50 flex flex-col justify-center text-left whitespace-nowrap">
                                                    区域规则首部: <span className="font-bold">{archiveRegion === '常熟' ? '320581' : '320583'}</span> ({archiveRegion})
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <Label>工程地点</Label>
                                            <input 
                                                type="text" 
                                                title="工程地点"
                                                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:ring-orange-500 focus:border-primary"
                                                value={formData.address}
                                                onChange={e => setFormData({...formData, address: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <Label>建设单位</Label>
                                            <input 
                                                type="text" 
                                                title="建设单位"
                                                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:ring-orange-500 focus:border-primary"
                                                value={formData.constructionUnit}
                                                onChange={e => setFormData({...formData, constructionUnit: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <Label>设计单位</Label>
                                            <input 
                                                type="text" 
                                                title="设计单位"
                                                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:ring-orange-500 focus:border-primary"
                                                value={formData.designUnit}
                                                onChange={e => setFormData({...formData, designUnit: e.target.value})}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="col-span-2">
                                            <Label>项目描述 / 备注</Label>
                                            <textarea 
                                                className="w-full border border-slate-200 rounded px-3 py-2 h-24 resize-none focus:ring-orange-500 focus:border-primary"
                                                placeholder="简要描述项目内容..."
                                                readOnly
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Commitment Letter (Construction Only) */}
                    {step === 4 && isConstruction && useExternalArchive && (
                        <div className="flex flex-col flex-1 min-h-0">
                            <div className="mb-3 flex flex-row justify-between items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-slate-800">签署《建设工程档案报送责任承诺书》</h3>
                                    <span className="text-xs text-primary font-semibold">推荐使用在线签章</span>
                                </div>
                                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => { setSignMethod('online'); setIsSigned(false); }}
                                        className={`relative px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                            signMethod === 'online'
                                                ? 'bg-white text-primary shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        在线签章
                                        {signMethod === 'online' && (
                                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] px-1 rounded-full font-bold">荐</span>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setSignMethod('client'); setIsSigned(false); }}
                                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                            signMethod === 'client'
                                                ? 'bg-white text-primary shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        客户端签章
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setSignMethod('upload'); setIsSigned(false); }}
                                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                            signMethod === 'upload'
                                                ? 'bg-white text-primary shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        纸质上传
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 border rounded-lg bg-slate-50 p-3 flex flex-col items-center relative overflow-hidden min-h-0">
                                {isSigned ? (
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="text-center animate-in fade-in zoom-in">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                                                <ShieldCheck className="w-8 h-8" />
                                            </div>
                                            <h4 className="font-bold text-slate-800">已完成签署</h4>
                                            <p className="text-sm text-slate-500 mb-4">
                                                {signMethod === 'online' ? '在线签章已提交' : signMethod === 'client' ? '客户端签章已完成' : '承诺书扫描件已上传'}
                                            </p>
                                            <button 
                                                onClick={() => setIsSigned(false)}
                                                className="text-primary text-sm hover:underline"
                                            >
                                                重新签署/上传
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full max-w-4xl flex flex-col items-center gap-3 flex-1 min-h-0">
                                        {/* Archive Notification */}
                                        <div className="w-full bg-white shadow-md border border-slate-200 p-4 rounded-lg">
                                            <div className="font-serif text-center font-bold text-base mb-3">昆山市建设工程档案告知书</div>
                                            <div className="text-[11px] leading-relaxed text-slate-600 space-y-2 text-justify">
                                                <p>根据《建设工程质量管理条例》《江苏省工程建设管理条例》《江苏省村镇规划建设管理条例》《城市建设档案管理规定》《城市地下管线工程档案管理办法》等法规和江苏省城建档案管理的相关规定，现将下列事项告知你单位：</p>
                                                <p>1 组织工程竣工验收前，应按《建设工程文件归档规范》GB/T 50328、《房屋建筑和市政基础设施工程档案资料管理规范》DGJ32/TJ 143的要求将全部文件材料收集齐全并完成工程档案组卷。</p>
                                                <p>2 在组织竣工验收后，应提请城建档案管理机构对工程档案进行验收，办理验收手续。</p>
                                                <p>3 在工程档案验收合格后，按规定向城建档案管理机构移交符合规定的工程档案，办理移交手续。</p>
                                            </div>
                                            <div className="text-right text-[11px] text-slate-500 mt-4">昆山市城建档案馆</div>
                                        </div>

                                        {/* 在线签章 */}
                                        {signMethod === 'online' && (
                                            <div className="flex items-center justify-center gap-3 w-full max-w-4xl">
                                                <div className="flex items-center gap-2 bg-white border border-blue-100 rounded-lg py-2 px-3 shadow-xs">
                                                    <div className="w-7 h-7 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-[11px] font-semibold text-slate-800 leading-tight">无需实体 UKey</div>
                                                        <div className="text-[9px] text-slate-400 leading-tight">浏览器即可签署</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 bg-white border border-blue-100 rounded-lg py-2 px-3 shadow-xs">
                                                    <div className="w-7 h-7 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-[11px] font-semibold text-slate-800 leading-tight">多系统支持</div>
                                                        <div className="text-[9px] text-slate-400 leading-tight">Windows / macOS / 信创</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 bg-white border border-blue-100 rounded-lg py-2 px-3 shadow-xs">
                                                    <div className="w-7 h-7 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-[11px] font-semibold text-slate-800 leading-tight">零安装零驱动</div>
                                                        <div className="text-[9px] text-slate-400 leading-tight">无需下载客户端软件</div>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => { alert('🖊️ 跳转至第三方签章平台完成在线签章。'); setIsSigned(true); }}
                                                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover shadow-md transition-all cursor-pointer text-sm font-bold shrink-0"
                                                >
                                                    立刻签章
                                                </button>
                                            </div>
                                        )}

                                        {/* 客户端签章 */}
                                        {signMethod === 'client' && (
                                            <div className="flex items-center justify-center gap-3 w-full max-w-4xl">
                                                <button
                                                    type="button"
                                                    onClick={() => { alert('已在 Windows 客户端中完成签章操作。'); setIsSigned(true); }}
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-semibold"
                                                >
                                                    🖥️ 启动客户端签章
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { alert('将下载签章客户端安装包（仅支持 Windows 系统）'); }}
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-semibold"
                                                >
                                                    ⬇️ 下载签章客户端工具
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { window.open('https://sign.qianyi.vip/ukey', '_blank'); }}
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-semibold"
                                                >
                                                    🛒 购买天威UKey签章
                                                </button>
                                            </div>
                                        )}

                                        {/* 纸质上传 */}
                                        {signMethod === 'upload' && (
                                            <div className="flex gap-4">
                                                <button type="button" className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded hover:bg-slate-50 cursor-pointer text-xs font-semibold">
                                                    <Download className="w-4 h-4 mr-2" /> 下载承诺书模板
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsSigned(true)}
                                                    className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover shadow-md cursor-pointer text-xs font-semibold"
                                                >
                                                    <Upload className="w-4 h-4 mr-2" /> 上传盖章扫描件
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 5: Audit Result (Construction Only) */}
                    {step === 5 && isConstruction && useExternalArchive && (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            {auditStatus === 'pending' ? (
                                <div className="animate-in fade-in">
                                    <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">正在提交档案馆审核...</h3>
                                    <p className="text-slate-500">系统正在自动对接 {archiveName} 监管平台</p>
                                </div>
                            ) : (
                                <div className="animate-in fade-in zoom-in">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">审核通过！立项登记完成</h3>
                                    <p className="text-slate-500 mb-8">项目已成功立项，状态已变更为 <span className="text-primary font-bold">档案整理</span>。</p>
                                    
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 max-w-md mx-auto mb-8 text-left">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-slate-500">项目名称</span>
                                            <span className="font-bold text-slate-800">{formData.name}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-slate-500">档案登记号</span>
                                            <span className="font-bold text-primary text-lg">2025-0005</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">归属档案馆</span>
                                            <span className="text-slate-800">{archiveName}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
                    <div className="text-[11px] text-slate-400 select-none">
                        {step === 1 && "① 正在分类主要档案项目类别"}
                        {step === 2 && "② 正在对元数据规范进行细化"}
                        {step === 3 && "③ 请填写项目核心的要素登记"}
                        {step === 4 && "④ 正在完成关联上报前置信用承诺"}
                        {step === 5 && "⑤ 对接档案局一体化接收接口"}
                    </div>
                    <div className="flex gap-3 items-center">
                        {step > 1 && ((useExternalArchive && step < 5) || (!useExternalArchive && step < 4)) && (
                            <button 
                                onClick={handleBack}
                                className="px-4 py-2 border border-slate-200 rounded text-slate-700 hover:bg-slate-100 transition-colors text-xs font-semibold cursor-pointer"
                            >
                                上一步
                            </button>
                        )}
                        {step === 1 || step === 2 ? (
                            <span className="text-slate-400 text-xs select-none">请点击大类/子类卡片以继续</span>
                        ) : step === 3 ? (
                            <button 
                                onClick={handleNext}
                                className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-hover shadow-sm transition-colors text-xs font-bold cursor-pointer"
                            >
                                {(isConstruction && useExternalArchive) ? '签署承诺书' : '确认并发起本地建库'}
                            </button>
                        ) : step === 4 ? (
                            <button 
                                onClick={handleNext}
                                className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-hover shadow-sm transition-colors text-xs font-bold cursor-pointer"
                            >
                                下一步：提交审核
                            </button>
                        ) : (
                             <button 
                                onClick={handleNext}
                                disabled={auditStatus === 'pending'}
                                className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-hover shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-semibold cursor-pointer font-bold"
                            >
                                {auditStatus === 'pending' ? '同步对接中...' : '查看我的著录'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewProjectWizard;
