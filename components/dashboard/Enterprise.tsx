import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Building2, Users, Shield, CheckCircle, ExternalLink, 
    Plus, Shuffle, X, Smartphone, UploadCloud, Check, 
    Info, AlertCircle, Trash2, KeyRound, CreditCard, FileText,
    Crown, Database, Award, QrCode, ClipboardList, CheckCircle2,
    Clock, RefreshCw, Zap, Headphones, Sparkles, AlertTriangle,
    Eye, EyeOff, Link, Lock, ArrowLeftRight, FolderTree, Layers, Settings, FileText as FileTextIcon
} from 'lucide-react';
import { TeamMember, Identity, Organizations } from '../../types';
import UserSwitcher from '../common/UserSwitcher';
import BasicInfoTab from './enterprise-tabs/BasicInfoTab';
import TeamTab from './enterprise-tabs/TeamTab';
import SecurityTab from './enterprise-tabs/SecurityTab';
import VersionTab from './enterprise-tabs/VersionTab';
import CurrentVersionTab from './enterprise-tabs/CurrentVersionTab';
import ExternalArchivesTab from './enterprise-tabs/ExternalArchivesTab';
import ArchiveInfoTab from './enterprise-tabs/ArchiveInfoTab';
import ArchiveTemplateTab from './enterprise-tabs/ArchiveTemplateTab';
import AuditFlowConfigTab from './enterprise-tabs/AuditFlowConfigTab';
import ProjectTypeConfigTab from './enterprise-tabs/ProjectTypeConfigTab';
import EngineeringTypeTab from './enterprise-tabs/EngineeringTypeTab';
import ProjectTypeTreeTab from './enterprise-tabs/ProjectTypeTreeTab';

interface EnterpriseProps {
    identity: Identity;
    identities: Identity[];
    setIdentities: React.Dispatch<React.SetStateAction<Identity[]>>;
    setCurrentIdentity: (identity: Identity) => void;
}

const Enterprise: React.FC<EnterpriseProps> = ({ 
    identity, 
    identities, 
    setIdentities, 
    setCurrentIdentity 
}) => {
    const navigate = useNavigate();

    // Guard against unorganized users
    if (!identity.organization) {
        return (
            <div className="flex flex-col h-full bg-[#f0f2f5] relative">
                <div className="flex-1 p-8 flex items-center justify-center">
                    <div className="bg-white max-w-lg w-full rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-6">
                        <div className="w-16 h-16 bg-teal-50 text-teal-600 border border-teal-200 rounded-2xl flex items-center justify-center mx-auto text-2xl">🏢</div>
                        <h2 className="text-xl font-bold text-slate-800">尚未绑定企业组织</h2>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            您目前作为 <strong>独立档案协作者 ({identity.user.name})</strong> 登录。
                        </p>
                        <button onClick={() => navigate('/capture-dashboard')}
                            className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-750 shadow-sm text-sm transition-all">
                            返回首页使用向导
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isArchiveMode = !!identity.archiveOrg;

    const [activeTab, setActiveTab] = useState<'basic' | 'team' | 'security' | 'current-version' | 'version' | 'orders' | 'archives'>('basic');
    const [activeArchiveTab, setActiveArchiveTab] = useState<'archive-info' | 'archive-template' | 'audit-flow' | 'project-type-config' | 'engineering-type' | 'project-type-tree'>('archive-info');

    // --- External Archives Feature State ---
    const [associatedArchives, setAssociatedArchives] = useState<any[]>([]);
    const [selectedArchiveIdForDetails, setSelectedArchiveIdForDetails] = useState<string | null>(null);
    const [isAddingArchive, setIsAddingArchive] = useState(false);

    const FILE_TYPES_OPTIONS = [
        '城市建设档案', '建筑工程档案', '竣工验收检测报告',
        '勘察设计技术文件', '监理日志与安全卷宗', '绿化排污专项档案',
    ];

    // Load associated archives from localStorage
    useEffect(() => {
        if (!identity.organization?.id) return;
        const key = `lantes_associated_archives_${identity.organization.id}`;
        try {
            const stored = localStorage.getItem(key);
            if (stored) {
                const list = JSON.parse(stored);
                setAssociatedArchives(list);
                if (list.length > 0) setSelectedArchiveIdForDetails(list[0].associationId);
                else setSelectedArchiveIdForDetails(null);
                return;
            }
        } catch (e) { console.error(e); }

        // Default configs
        let list: any[] = [];
        if (identity.organization.id === 'org_wuwu') {
            list = [{
                associationId: 'assoc_1', archiveId: 'ks-urban',
                archiveName: '昆山市城市建设档案馆', archiveCode: '320583', region: '昆山',
                fileTypes: ['城市建设档案', '竣工验收检测报告', '监理日志与安全卷宗'],
                liaison: '昆山/李娜', syncFrequency: '实时自动上报',
                token: 'LT-TOK-KS-98321-G9', associatedDate: '2026-05-10',
                protocolVersion: 'GB50328-2014 (2019变动版规范)', status: 'active',
                remarks: '企业启用的主要关联通道，用于城建配套和综合审批数据上报'
            }];
        } else if (identity.organization.id === 'org_cs') {
            list = [{
                associationId: 'assoc_2', archiveId: 'cs-urban',
                archiveName: '常熟市国家级城建档案馆', archiveCode: '320581', region: '常熟',
                fileTypes: ['建筑工程档案', '竣工验收检测报告'],
                liaison: '常熟/许志平', syncFrequency: '每日自动上报',
                token: 'LT-TOK-CS-38291-B3', associatedDate: '2026-05-24',
                protocolVersion: 'GB50328-2014 (2019变动版规范)', status: 'active',
                remarks: '常熟地区单体建设项目的主要申报入口'
            }];
        }
        setAssociatedArchives(list);
        if (list.length > 0) setSelectedArchiveIdForDetails(list[0].associationId);
        localStorage.setItem(`lantes_associated_archives_${identity.organization.id}`, JSON.stringify(list));
    }, [identity.organization?.id]);

    const saveArchives = (list: any[]) => {
        setAssociatedArchives(list);
        if (identity.organization?.id) {
            localStorage.setItem(`lantes_associated_archives_${identity.organization.id}`, JSON.stringify(list));
        }
    };

    // --- Premium Version and Order Center ---
    const [currentVersion, setCurrentVersion] = useState<'free' | 'team' | 'pro' | 'enterprise'>('pro');
    const [orders, setOrders] = useState<any[]>([
        { id: 'LT202605012543', time: '2026-05-01 10:14', creator: '王钢', amount: 2980, desc: '专业版 - 年度订阅', status: '已支付' },
        { id: 'LT202604128912', time: '2026-04-12 16:45', creator: '丁宇宇', amount: 596, desc: '增购账号 (2个专业版协作账号)', status: '已支付' },
        { id: 'LT202606041009', time: '2026-06-04 15:40', creator: '张伟', amount: 12800, desc: '企业版 - 年度订阅安全升级', status: '未支付' }
    ]);

    const handleChangeVersion = (newVersion: 'free' | 'team' | 'pro' | 'enterprise', price: number, desc: string) => {
        const newOrder = {
            id: `LT20260604${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toISOString().replace('T', ' ').substring(0, 16),
            creator: '张伟',
            amount: price,
            desc: desc,
            status: '已支付'
        };
        setOrders(prev => [newOrder, ...prev]);
        setCurrentVersion(newVersion);
    };

    // --- Modal states ---
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSwitchModal, setShowSwitchModal] = useState(false);

    // Form states for New Enterprise
    const [newName, setNewName] = useState('');
    const [newShortName, setNewShortName] = useState('');
    const [newCode, setNewCode] = useState('');
    const [newLegal, setNewLegal] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newSms, setNewSms] = useState('');
    const [uploadedLicense, setUploadedLicense] = useState<{ name: string; size: string } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Dynamic Team members list
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

    // Custom Toast
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
        show: false, message: '', type: 'success'
    });

    const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
    };

    // Populate team list
    useEffect(() => {
        if (!identity.organization) return;
        if (identity.organization.id === 'org_wuwu') {
            setTeamMembers([
                { id: 'm1', name: '王钢', role: '法定代表人', email: '138****8888', avatarBg: 'bg-amber-600', joinDate: '2024-01-01', status: 'active', department: '总经办' },
                { id: 'm2', name: '丁宇宇', role: '管理员', email: 'ding@lantai.com', avatarBg: 'bg-orange-500', joinDate: '2024-03-15', status: 'active', department: '工程部' },
                { id: 'm3', name: '张伟', role: '管理员', email: '139****1234', avatarBg: 'bg-primary', joinDate: '2024-05-20', status: 'active', department: '工程部' },
            ]);
        } else if (identity.organization.id === 'org_qt') {
            setTeamMembers([
                { id: 'm4', name: '冯建超', role: '法定代表人', email: '158****1234', avatarBg: 'bg-amber-600', joinDate: '2024-02-10', status: 'active', department: '董事会' },
                { id: 'm5', name: '张伟', role: '成员', email: '139****1234', avatarBg: 'bg-primary', joinDate: '2024-06-01', status: 'active', department: '综合办' },
            ]);
        } else if (identity.organization.id === 'org_cs') {
            setTeamMembers([
                { id: 'm6', name: '张伟', role: '法定代表人', email: '139****1234', avatarBg: 'bg-amber-600', joinDate: '2024-05-20', status: 'active', department: '总经理办公室' },
                { id: 'm7', name: '彭勇', role: '管理员', email: 'li4@lantai.com', avatarBg: 'bg-green-600', joinDate: '2024-06-02', status: 'active', department: '总工办' },
            ]);
        } else {
            setTeamMembers([{
                id: 'm_curr', name: identity.user.name, role: identity.role as any,
                email: '139****1234', avatarBg: 'bg-primary',
                joinDate: new Date().toISOString().split('T')[0], status: 'active',
                department: identity.department || '管理层'
            }]);
        }
    }, [identity]);

    // SMS countdown
    useEffect(() => {
        if (countdown > 0) {
            timerRef.current = setTimeout(() => setCountdown(prev => prev - 1), 1000);
        }
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [countdown]);

    const handleSendCode = () => {
        if (!newPhone.trim()) { triggerToast('请输入法定代表人手机号码！', 'error'); return; }
        if (!/^1[3-9]\d{9}$/.test(newPhone)) { triggerToast('请输入有效的11位中国手机号！', 'error'); return; }
        setIsSendingCode(true);
        setTimeout(() => {
            setIsSendingCode(false);
            setCountdown(60);
            setNewSms('123456');
            triggerToast('【验证码发送成功】短信验证码 ‘123456’ 已发送至手机！', 'success');
        }, 800);
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && /jpg|jpeg|png|pdf/i.test(file.name.split('.').pop() || '')) {
            setUploadedLicense({ name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + ' MB' });
            triggerToast(`营业执照文件已载入: ${file.name}`, 'success');
        } else {
            triggerToast('仅支持上传 jpg/png/pdf 格式的文件！', 'error');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && /jpg|jpeg|png|pdf/i.test(file.name.split('.').pop() || '')) {
            setUploadedLicense({ name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + ' MB' });
            triggerToast(`营业执照文件已载入: ${file.name}`, 'success');
        } else {
            triggerToast('仅支持上传 jpg/png/pdf 格式的文件！', 'error');
        }
    };

    const handleCreateEnterprise = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) { triggerToast('请输入企业完整名称！', 'error'); return; }
        if (!newShortName.trim()) { triggerToast('请输入企业简称！', 'error'); return; }
        if (newShortName.length > 6) { triggerToast('企业简称最多支持6个汉字！', 'error'); return; }
        if (!newCode.trim()) { triggerToast('请输入统一社会信用代码/组织机构代码！', 'error'); return; }
        if (!uploadedLicense) { triggerToast('请选择并上传您的营业执照！', 'error'); return; }
        if (!newLegal.trim()) { triggerToast('请输入法定代表人姓名！', 'error'); return; }
        if (!newPhone.trim()) { triggerToast('请输入法定代表人手机！', 'error'); return; }
        if (!newSms.trim() || newSms !== '123456') { triggerToast('请输入正确的验证码！(默认：123456)', 'error'); return; }

        const newOrg: Organizations = {
            id: `org_new_${Date.now()}`, name: newName, shortName: newShortName,
            type: 'ENTERPRISE', code: newCode, licenceFileName: uploadedLicense.name,
            legalRep: newLegal, legalRepPhone: newPhone
        };
        const newIdObj: Identity = {
            id: `id_new_${Date.now()}`, user: identity.user,
            organization: newOrg, role: '法定代表人', department: '总经办'
        };
        setIdentities(prev => [...prev, newIdObj]);
        setCurrentIdentity(newIdObj);
        setNewName(''); setNewShortName(''); setNewCode(''); setNewLegal('');
        setNewPhone(''); setNewSms(''); setUploadedLicense(null); setShowAddModal(false);
        triggerToast(`企业「${newName}」创建成功，已自动切换到该租户身份。`, 'success');
    };

    const handleSelectCompanyContext = (chosenId: Identity) => {
        setCurrentIdentity(chosenId);
        setShowSwitchModal(false);
        triggerToast(`成功切换上下文环境至: ${chosenId.organization?.name || '个人工作台'}`, 'success');
    };

    const getRoleTagColor = (role: string) => {
        switch (role) {
            case '法定代表人': case '拥有者': return 'bg-amber-50 text-amber-600 border border-amber-200';
            case '管理员': return 'bg-blue-50 text-blue-600 border border-blue-200';
            default: return 'bg-slate-100 text-slate-600 border border-slate-200';
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f0f2f5] relative">
            {/* Toast */}
            {toast.show && (
                <div className="absolute top-20 right-6 z-50 animate-bounce flex items-center gap-3 p-4 bg-white rounded-lg shadow-xl border-l-4 border-primary min-w-[320px] max-w-[480px]">
                    {toast.type === 'success' ? (
                        <div className="p-1 bg-green-100 text-green-600 rounded-full"><Check className="w-4 h-4" /></div>
                    ) : toast.type === 'error' ? (
                        <div className="p-1 bg-red-100 text-red-600 rounded-full"><AlertCircle className="w-4 h-4" /></div>
                    ) : (
                        <div className="p-1 bg-blue-100 text-blue-600 rounded-full"><Info className="w-4 h-4" /></div>
                    )}
                    <div className="flex-1 text-sm text-slate-700 font-medium break-all pr-2">{toast.message}</div>
                    <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="text-slate-400 hover:text-slate-600 text-xs shrink-0">&times;</button>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="w-full">
                    <div className="grid grid-cols-[240px_1fr] gap-6 items-start">
                        
                        {/* Left Panel */}
                        <div className="space-y-4">
                            {isArchiveMode ? (
                                <>
                                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
                                        <div className="px-5 py-3 bg-emerald-50/50 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                            <span>档案馆基础治理</span>
                                        </div>
                                        <MenuLink active={activeArchiveTab === 'archive-info'} onClick={() => setActiveArchiveTab('archive-info')} label="档案馆信息" icon={<Building2 className="w-4 h-4" />} />
                                        <MenuLink active={activeArchiveTab === 'archive-template'} onClick={() => setActiveArchiveTab('archive-template')} label="档案馆模板" icon={<FileTextIcon className="w-4 h-4" />} />
                                        <MenuLink active={activeArchiveTab === 'audit-flow'} onClick={() => setActiveArchiveTab('audit-flow')} label="审核流程配置" icon={<Settings className="w-4 h-4" />} />
                                    </div>

                                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
                                        <div className="px-5 py-3 bg-emerald-50/50 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <FolderTree className="w-3.5 h-3.5 text-slate-400" />
                                            <span>项目类型管理</span>
                                        </div>
                                        <MenuLink active={activeArchiveTab === 'project-type-config'} onClick={() => setActiveArchiveTab('project-type-config')} label="项目类型配置" icon={<FolderTree className="w-4 h-4" />} />
                                        <MenuLink active={activeArchiveTab === 'engineering-type'} onClick={() => setActiveArchiveTab('engineering-type')} label="工程类型" icon={<Layers className="w-4 h-4" />} />
                                        <MenuLink active={activeArchiveTab === 'project-type-tree'} onClick={() => setActiveArchiveTab('project-type-tree')} label="项目类型树" icon={<FileTextIcon className="w-4 h-4" />} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
                                        <div className="px-5 py-3 bg-slate-50/50 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                            <span>企业基础治理</span>
                                        </div>
                                        <MenuLink active={activeTab === 'basic'} onClick={() => setActiveTab('basic')} label="基本信息" icon={<Building2 className="w-4 h-4" />} />
                                        <MenuLink active={activeTab === 'team'} onClick={() => setActiveTab('team')} label="团队成员" icon={<Users className="w-4 h-4" />} />
                                        <MenuLink active={activeTab === 'security'} onClick={() => setActiveTab('security')} label="安全管理" icon={<Shield className="w-4 h-4" />} />
                                    </div>

                                    {!isArchiveMode && !!identity.organization && (
                                        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200 p-3.5 space-y-3">
                                            <div className="px-1 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                <Database className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span>关联外部档案馆</span>
                                            </div>
                                            <button onClick={() => { setActiveTab('archives'); setIsAddingArchive(true); }}
                                                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed border-slate-200 hover:border-primary text-slate-600 hover:text-primary text-xs font-bold rounded-lg transition-all cursor-pointer bg-slate-50 hover:bg-slate-50/20">
                                                <Plus className="w-3.5 h-3.5 shrink-0" />新增关联档案馆
                                            </button>
                                            {associatedArchives.map((assoc) => {
                                                const isSelected = activeTab === 'archives' && !isAddingArchive && selectedArchiveIdForDetails === assoc.associationId;
                                                return (
                                                    <button key={assoc.associationId}
                                                        onClick={() => { setActiveTab('archives'); setIsAddingArchive(false); setSelectedArchiveIdForDetails(assoc.associationId); }}
                                                        className={`w-full text-left px-2 py-1.5 rounded text-xs font-semibold flex items-center gap-2 transition-all group ${isSelected ? 'bg-primary-light text-primary font-bold' : 'hover:bg-slate-100 text-slate-700'}`}>
                                                        <Database className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-primary' : 'text-slate-400 group-hover:text-primary transition'}`} />
                                                        <span className="truncate">{assoc.archiveName}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
                                        <div className="px-5 py-3 bg-slate-50/50 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Crown className="w-3.5 h-3.5 text-slate-400" />
                                            <span>版本 & 订单</span>
                                        </div>
                                        <MenuLink active={activeTab === 'current-version'} onClick={() => setActiveTab('current-version')} label="当前版本" icon={<Crown className="w-4 h-4" />} />
                                        <MenuLink active={activeTab === 'version'} onClick={() => setActiveTab('version')} label="版本管理" icon={<Zap className="w-4 h-4" />} />
                                        <MenuLink active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} label="我的订单" icon={<ClipboardList className="w-4 h-4" />} />
                                    </div>

                                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
                                        <div className="px-5 py-3 bg-slate-50/50 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
                                            <span>企业切换</span>
                                        </div>
                                        {identities.filter(id => id.organization && id.organization.id !== identity.organization?.id).slice(0, 3).map((idObj) => (
                                            <button key={idObj.id} onClick={() => handleSelectCompanyContext(idObj)}
                                                className="w-full text-left px-6 py-3 text-xs border-l-4 border-transparent hover:bg-slate-50 hover:border-primary hover:text-primary transition-all flex items-center gap-3 cursor-pointer">
                                                <div className="w-7 h-7 bg-slate-100 rounded-md flex items-center justify-center text-xs shrink-0">🏢</div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-semibold text-slate-800 truncate">{idObj.organization?.shortName || idObj.organization?.name}</div>
                                                    <div className="text-[10px] text-slate-400">{idObj.role}</div>
                                                </div>
                                            </button>
                                        ))}
                                        <button onClick={() => setShowSwitchModal(true)}
                                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 border-t border-slate-100 text-slate-500 hover:text-primary text-xs font-bold transition-all cursor-pointer hover:bg-slate-50">
                                            <Shuffle className="w-3.5 h-3.5" />切换更多
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right Details Panel */}
                        <div className="space-y-6">
                            {isArchiveMode ? (
                                <>
                                    {activeArchiveTab === 'archive-info' && <ArchiveInfoTab />}
                                    {activeArchiveTab === 'archive-template' && <ArchiveTemplateTab />}
                                    {activeArchiveTab === 'audit-flow' && <AuditFlowConfigTab />}
                                    {activeArchiveTab === 'project-type-config' && <ProjectTypeConfigTab />}
                                    {activeArchiveTab === 'engineering-type' && <EngineeringTypeTab />}
                                    {activeArchiveTab === 'project-type-tree' && <ProjectTypeTreeTab />}
                                </>
                            ) : (
                                <>
                                    {activeTab === 'basic' && <BasicInfoTab identity={identity} />}
{activeTab === 'team' && <TeamTab identity={identity} teamMembers={teamMembers} />}
                            {activeTab === 'security' && <SecurityTab identity={identity} />}
                                    {activeTab === 'current-version' && (
                                        <CurrentVersionTab
                                            currentVersion={currentVersion}
                                            teamMemberCount={teamMembers.length}
                                        />
                                    )}
                                    {activeTab === 'version' && (
                                        <VersionTab
                                            currentVersion={currentVersion}
                                            onChangeVersion={handleChangeVersion}
                                            orders={orders}
                                            teamMemberCount={teamMembers.length}
                                        />
                                    )}
                                    {activeTab === 'orders' && (
                                        <VersionTab
                                            currentVersion={currentVersion}
                                            onChangeVersion={handleChangeVersion}
                                            orders={orders}
                                            teamMemberCount={teamMembers.length}
                                            showOrdersOnly={true}
                                        />
                                    )}
                                    {activeTab === 'archives' && !!identity.organization && (
                                        <ExternalArchivesTab
                                            associatedArchives={associatedArchives}
                                            isAddingArchive={isAddingArchive}
                                            setIsAddingArchive={setIsAddingArchive}
                                            selectedArchiveIdForDetails={selectedArchiveIdForDetails}
                                            setSelectedArchiveIdForDetails={setSelectedArchiveIdForDetails}
                                            onSaveArchives={saveArchives}
                                            onToast={triggerToast}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Enterprise Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8 shrink-0">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-primary" />
                                <span className="font-bold text-slate-800 text-base">企业商事自治实名注册</span>
                            </div>
                            <button onClick={() => setShowAddModal(false)} title="关闭"
                                className="p-1 px-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateEnterprise} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">企业名称 <span className="text-red-500 font-bold">*</span></label>
                                <input type="text" required placeholder="请输入工商营业执照上的企业完整名称" value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full text-sm px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-400" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                                        <span>企业简称 <span className="text-red-500 font-bold">*</span></span>
                                        <span className={`text-xs ${newShortName.length > 6 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>{newShortName.length}/6 汉字</span>
                                    </label>
                                    <input type="text" required maxLength={6} placeholder="最多6个汉字简称" value={newShortName}
                                        onChange={(e) => setNewShortName(e.target.value)}
                                        className="w-full text-sm px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-400 font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">组织机构代码 <span className="text-red-500 font-bold">*</span></label>
                                    <input type="text" required placeholder="请输入18位社会统一信用代码" value={newCode}
                                        onChange={(e) => setNewCode(e.target.value)}
                                        className="w-full text-sm px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-400 font-mono" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">法定代表人姓名 <span className="text-red-500 font-bold">*</span></label>
                                    <input type="text" required placeholder="请输入法定代表人真实姓名" value={newLegal}
                                        onChange={(e) => setNewLegal(e.target.value)}
                                        className="w-full text-sm px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">法定代表人手机号码 <span className="text-red-500 font-bold">*</span></label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <span className="absolute left-3.5 top-3.5 text-slate-400 text-xs pointer-events-none"><Smartphone className="w-3.5 h-3.5" /></span>
                                            <input type="tel" required placeholder="11位手机号" value={newPhone}
                                                onChange={(e) => setNewPhone(e.target.value)}
                                                className="w-full text-sm pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">短信验证码 <span className="text-red-500 font-bold">*</span></label>
                                    <div className="flex gap-2">
                                        <input type="text" required placeholder="验证码" value={newSms}
                                            onChange={(e) => setNewSms(e.target.value)}
                                            className="flex-1 text-sm px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" />
                                        <button type="button" onClick={handleSendCode} disabled={countdown > 0 || isSendingCode}
                                            className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
                                            {isSendingCode ? '发送中...' : countdown > 0 ? `${countdown}s` : '获取验证码'}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">营业执照 <span className="text-red-500 font-bold">*</span></label>
                                    <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                                        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary-light' : 'border-slate-200 hover:border-slate-300 bg-slate-50'}`}
                                        onClick={() => document.getElementById('license-upload')?.click()}>
                                        {uploadedLicense ? (
                                            <div className="text-xs text-slate-700 font-medium">
                                                <FileText className="w-5 h-5 mx-auto mb-1 text-primary" />
                                                {uploadedLicense.name}<br />
                                                <span className="text-slate-400">{uploadedLicense.size}</span>
                                            </div>
                                        ) : (
                                            <div className="text-xs text-slate-500">
                                                <UploadCloud className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                                                拖拽或点击上传<br />
                                                <span className="text-slate-400">支持 jpg/png/pdf</span>
                                            </div>
                                        )}
                                        <input id="license-upload" type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileSelect} className="hidden" title="上传营业执照" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                                <button type="button" onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border border-slate-200 rounded text-sm text-slate-700 hover:bg-slate-50 bg-white">取消</button>
                                <button type="submit"
                                    className="px-6 py-2 bg-primary text-white rounded text-sm font-semibold hover:bg-primary-hover shadow-sm">提交企业注册</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Switch Enterprise Modal */}
            {showSwitchModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
                        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Shuffle className="w-5 h-5 text-primary" />
                                <span className="font-bold text-slate-800">切换企业/组织上下文</span>
                            </div>
                            <button onClick={() => setShowSwitchModal(false)} title="关闭"
                                className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-4 space-y-1 max-h-80 overflow-y-auto">
                            {identities.filter(id => id.organization && id.organization.id !== identity.organization?.id).map((idObj) => (
                                <button key={idObj.id}
                                    onClick={() => handleSelectCompanyContext(idObj)}
                                    className="w-full text-left p-3 rounded-lg hover:bg-primary-light hover:text-primary transition-colors flex items-center gap-3 group cursor-pointer">
                                    <div className="w-9 h-9 bg-slate-200 rounded-lg flex items-center justify-center text-base shrink-0">🏢</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-slate-800 group-hover:text-primary truncate">{idObj.organization?.name}</div>
                                        <div className="text-xs text-slate-500">{idObj.role} · {idObj.department || '未分配'}</div>
                                    </div>
                                </button>
                            ))}
                            {identities.filter(id => id.organization && id.organization.id !== identity.organization?.id).length === 0 && (
                                <div className="text-center py-8 text-slate-400 text-sm">没有其他可切换的企业组织</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MenuLink = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) => (
    <div onClick={onClick}
        className={`flex items-center px-6 py-4 cursor-pointer text-sm border-l-4 transition-all
            ${active ? 'bg-primary-light text-primary border-primary font-bold' : 'border-transparent text-slate-700 hover:bg-slate-50'}`}>
        <span className="mr-3 opacity-80">{icon}</span>
        {label}
    </div>
);

export default Enterprise;
