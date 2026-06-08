import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, CheckCircle2, ChevronRight, Archive } from 'lucide-react';
import { Identity, Organization, Project } from '../types';

interface UserMessage {
    id: string;
    title: string;
    content: string;
    status: 'read' | 'unread';
    time: string;
    projectName: string;
    organizationId: string;
}

interface OnboardingPanelProps {
    identity: Identity;
    identities?: Identity[];
    setIdentities?: React.Dispatch<React.SetStateAction<Identity[]>>;
    setCurrentIdentity?: (identity: Identity) => void;
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    onNewMessage?: (msg: { id: string; title: string; content: string; status: string; time: string; projectName: string; organizationId: string }) => void;
}

const OnboardingPanel: React.FC<OnboardingPanelProps> = ({
    identity,
    identities,
    setIdentities,
    setCurrentIdentity,
    setProjects,
    onNewMessage
}) => {
    const navigate = useNavigate();

    const [joinState, setJoinState] = useState<'idle' | 'submitted' | 'approved'>('idle');
    const [selectedJoinOrg, setSelectedJoinOrg] = useState('org_wuwu');
    const [regName, setRegName] = useState('江苏诚泰工程建设监理有限公司');
    const [regCode, setRegCode] = useState('91320100MAD7XE893F');
    const [isRegLoading, setIsRegLoading] = useState(false);

    return (
        <div className="space-y-6">
            {/* Under construction header - Cosmic Slate Teal style */}
            <div className="bg-[#e0f2fe]/40 border border-sky-100 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full font-bold text-[11px]">
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span>
                        未绑定组织状态 • 极速体验
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                        您好，{identity.user.name}！欢迎进入兰台云项目确权中心 📂
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                        遵循兰台自治与强约束原则，工程项目档案均须安全存证于企业或事业单位名下。您当前正以独立档案协作者（个人注册用户）身份进行自主探索。
                    </p>
                </div>
                {/* User Profile Card */}
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm w-full md:w-80 space-y-3 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-sm">
                            {identity.user.name[0]}
                        </div>
                        <div>
                            <div className="font-bold text-xs text-slate-800">{identity.user.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{identity.user.email}</div>
                        </div>
                    </div>
                    <div className="pt-2.5 border-t border-slate-100 flex justify-between text-[11px]">
                        <span className="text-slate-400">当前身份:</span>
                        <span className="font-semibold text-teal-600 bg-teal-50 border border-teal-100 px-1.5 py-0.2 rounded">{identity.role}</span>
                    </div>
                </div>
            </div>

            {/* 2 Grid Columns for Onboarding Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Onboarding Action: Apply to Join Existing Group */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                            <div className="p-2 bg-primary/10 border border-primary/20 text-primary rounded-lg">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">快捷向导一：申请接入已备案组织</h3>
                                <p className="text-[10px] text-slate-400 mt-0.5">申请绑定下方已确权的兰台云合作承办单位，即刻享受内部多端共研</p>
                            </div>
                        </div>

                        {joinState === 'idle' && (
                            <div className="space-y-4 pt-2">
                                <label className="block text-xs font-semibold text-slate-600 mb-1">选择申请加入的企业：</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {[{ id: 'org_wuwu', name: '上海无无科技有限公司', label: '无无科技 - 王钢' },
                                      { id: 'org_qt', name: '苏州清陶动力科技', label: '清陶动力 - 冯建超' },
                                      { id: 'org_cs', name: '常熟工程建设集团有限公司', label: '常熟建工 - 张三' }].map((org) => (
                                        <div 
                                            key={org.id}
                                            onClick={() => setSelectedJoinOrg(org.id)}
                                            className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                                                selectedJoinOrg === org.id 
                                                    ? 'border-primary/20 bg-primary/5 text-primary font-bold' 
                                                    : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">🏢</span>
                                                <span>{org.name}</span>
                                            </div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded ${
                                                selectedJoinOrg === org.id 
                                                    ? 'bg-indigo-100 text-primary font-bold' 
                                                    : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                {selectedJoinOrg === org.id ? '当前选中' : '点击选择'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => {
                                        setJoinState('submitted');
                                    }}
                                    className="w-full py-2.5 bg-primary hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs tracking-wider transition-all shadow-xs"
                                >
                                    立即提交入驻核验申请书
                                </button>
                            </div>
                        )}

                        {joinState === 'submitted' && (
                            <div className="space-y-4 pt-3 text-center">
                                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto text-xl animate-pulse">⏳</div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-slate-800 text-xs">申请正提报给组织管理员审核...</h4>
                                    <p className="text-[11px] text-slate-400">
                                        您已向 [<strong>
                                            {selectedJoinOrg === 'org_wuwu' ? '上海无无科技有限公司' : selectedJoinOrg === 'org_qt' ? '苏州清陶动力科技' : '常熟工程建设集团有限公司'}
                                        </strong>] 提交个人资质备案包
                                    </p>
                                </div>

                                <div className="bg-amber-50/50 rounded-lg p-3 text-left border border-amber-100 space-y-1.5 text-[10px] text-amber-800 leading-relaxed font-semibold">
                                    <div>📱 <strong>核验专线状态：</strong> 自动接入短信核发通道并挂单登记</div>
                                    <div>⏰ <strong>演示端秒审：</strong> 点击下方特权按钮可跳过管理员审批，模拟立即获批并加入该组织：</div>
                                </div>

                                <button 
                                    onClick={() => {
                                        const matchedId = identities?.find(idItem => idItem.organization?.id === selectedJoinOrg);
                                        if (matchedId && setCurrentIdentity) {
                                            const liJinInOrg: Identity = {
                                                id: `id_lijin_${selectedJoinOrg}`,
                                                user: identity.user,
                                                organization: matchedId.organization,
                                                role: '成员 (档案专家)',
                                                department: '第三方协理工程部'
                                            };
                                            if (setIdentities && identities) {
                                                const updated = identities.map(curr => curr.id === identity.id ? liJinInOrg : curr);
                                                setIdentities(updated);
                                            }
                                            setCurrentIdentity(liJinInOrg);
                                        }
                                    }}
                                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 font-bold"
                                >
                                    <CheckCircle2 className="w-4 h-4 animate-bounce" />
                                    一键极速模拟批复通过并进入该公司
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Onboarding Action: Register new enterprise */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                            <div className="p-2 bg-teal-50 border border-teal-100 text-teal-600 rounded-lg">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">快捷向导二：极速秒级注册、新建专属企业组织</h3>
                                <p className="text-[10px] text-slate-400 mt-0.5">自主申报实体，两秒完成智能确权，注册完即刻代任总裁</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2 text-xs">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">1. 新注册组织合法名称：</label>
                                <input 
                                    type="text"
                                    value={regName}
                                    onChange={(e) => setRegName(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-xs font-semibold text-slate-700"
                                    placeholder="例：江苏诚泰工程建设监理有限公司"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">2. 统一社会信用代码：</label>
                                <input 
                                    type="text"
                                    value={regCode}
                                    onChange={(e) => setRegCode(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary font-mono text-[11px] text-slate-700"
                                    placeholder="18位工商社会信用代码"
                                />
                            </div>
                            <div className="p-3 bg-teal-50/40 border border-teal-100 rounded-lg text-[10px] text-teal-800 leading-relaxed font-semibold">
                                💡 <strong>数字自治确权：</strong> 新建该组织成功后，您 ({identity.user.name}) 将直接挂载为该企业的首发 <strong>法定代表人兼管理员总裁</strong>！
                            </div>

                            <button 
                                onClick={() => {
                                    setIsRegLoading(true);
                                    setTimeout(() => {
                                        setIsRegLoading(false);
                                        const newOrg: Organization = {
                                            id: `org_auto_${Date.now()}`,
                                            name: regName,
                                            shortName: regName.slice(0, 4) || '江苏诚泰',
                                            type: 'ENTERPRISE',
                                            code: regCode,
                                            licenceFileName: '电子营业执照_核验证照.pdf',
                                            legalRep: identity.user.name,
                                            legalRepPhone: '17788888899'
                                        };
                                        
                                        const newIdentity: Identity = {
                                            id: `id_auto_${Date.now()}`,
                                            user: identity.user,
                                            organization: newOrg,
                                            role: '法定代表人',
                                            department: '总经办'
                                        };

                                        // Let's create two mock projects for this new organization to make the experience real and premium!
                                        const autoProjects: Project[] = [
                                            {
                                                id: `proj_auto_${Date.now()}_1`,
                                                name: `${regName.slice(0, 4)}工程智能化归类整理项目一标段`,
                                                status: 'processing',
                                                progress: 20,
                                                stage: '整理中',
                                                tags: ['高密整序', '自研图纸'],
                                                issues: [],
                                                organizationId: newOrg.id,
                                                isManaged: true,
                                                memberCount: 1
                                            },
                                            {
                                                id: `proj_auto_${Date.now()}_2`,
                                                name: `常熟市高新技术研发集群配套建设工程`,
                                                status: 'processing',
                                                progress: 100,
                                                stage: '已入库',
                                                tags: ['已完工'],
                                                issues: [],
                                                organizationId: newOrg.id,
                                                isManaged: true,
                                                memberCount: 1
                                            }
                                        ];

                                        setProjects(prev => [...autoProjects, ...prev]);

                                        if (onNewMessage) {
                                            onNewMessage({
                                                id: `msg_auto_${Date.now()}`,
                                                title: '工商在线实名自主核实成功申报函',
                                                content: `您成功在兰台申报了新企业"${regName}"。相关云盘网盘自动确权并已发放安全密匙。您可以直接点击首页右下方"进入云盘"进行第一笔双层OFD文件编制立卷。`,
                                                status: 'unread',
                                                time: new Date().toISOString().replace('T', ' ').substring(0, 16),
                                                projectName: '工商自主确权专卷',
                                                organizationId: newOrg.id
                                            });
                                        }

                                        if (setIdentities && identities) {
                                            setIdentities([...identities, newIdentity]);
                                        }
                                        if (setCurrentIdentity) {
                                            setCurrentIdentity(newIdentity);
                                        }
                                    }, 1205);
                                }}
                                disabled={isRegLoading || !regName || !regCode}
                                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs hover:scale-[1.01]"
                            >
                                {isRegLoading ? '两秒极速OCR核验核算中...' : '立即申报注册该企业并一键切换'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Option 3: Free sandbox playground space - Very high fidelity! */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <span className="text-lg">📂</span>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">个人自主演练：独立大客户沙箱云盘协同演练</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">独立的自由空间，无需项目授权锁，一键进入演练档案归集和双层双制合规性</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[{ name: '江苏省二星级建设工程项目电子归集通用标准.pdf', size: '2.4 MB', label: 'PDF 规范文本' },
                      { name: '江苏常昆智能化二标段平面大图纸_OFD版.ofd', size: '15.8 MB', label: '双层双制合规OFD' },
                      { name: '苏州地下交通综合管网CAD控制原图.dwg', size: '34.2 MB', label: 'CAD 工程原图' }].map((item, index) => (
                        <div 
                            key={index} 
                            className="bg-slate-50 hover:bg-slate-100 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 cursor-pointer flex items-center justify-between transition-colors group"
                            onClick={() => navigate('/workspace')}
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-xl">📄</span>
                                <div className="min-w-0 leading-tight">
                                    <div className="text-xs font-bold text-slate-700 truncate group-hover:text-primary" title={item.name}>{item.name}</div>
                                    <span className="text-[10px] text-slate-400">{item.size} • {item.label}</span>
                                </div>
                            </div>
                            <span className="text-[10px] text-primary font-bold group-hover:underline">穿透演练</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OnboardingPanel;
