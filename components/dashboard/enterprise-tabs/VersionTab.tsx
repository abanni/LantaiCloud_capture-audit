import React, { useState } from 'react';
import {
    Crown, Check, CreditCard, X, Zap, Headphones, Sparkles, AlertTriangle,
    Database, Users, Award, CheckCircle2, ClipboardList, Clock, RefreshCw
} from 'lucide-react';

interface Order {
    id: string;
    time: string;
    creator: string;
    amount: number;
    desc: string;
    status: string;
}

interface VersionTabProps {
    currentVersion: 'free' | 'team' | 'pro' | 'enterprise';
    onChangeVersion: (newVersion: 'free' | 'team' | 'pro' | 'enterprise', price: number, desc: string) => void;
    orders: Order[];
    teamMemberCount?: number;
}

const VersionTab: React.FC<VersionTabProps> = ({ currentVersion, onChangeVersion, orders, teamMemberCount = 0 }) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentPayer, setPaymentPayer] = useState('张三');
    const [paymentDetails, setPaymentDetails] = useState<{
        version: 'free' | 'team' | 'pro' | 'enterprise';
        price: number;
        desc: string;
    }>({ version: 'enterprise', price: 12800, desc: '升级到企业版' });

    const handlePaymentClick = (version: 'free' | 'team' | 'pro' | 'enterprise', price: number, desc: string) => {
        if (version === 'free') return;
        setPaymentDetails({ version, price, desc });
        setShowPaymentModal(true);
    };

    return (
        <>
            {/* Sub 1: Current usage monitoring */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4 flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Crown className="w-5 h-5 text-amber-500 fill-amber-400" />
                            <h3 className="text-base font-bold text-slate-800">当前运行版本及资源用量</h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">您当前租户正在使用高等级的企业治理资源方案</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>当前版本: {currentVersion === 'free' ? '免费版' : currentVersion === 'team' ? '团队版' : currentVersion === 'pro' ? '专业版' : '企业版'}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Resource 1: Storage */}
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute right-3 top-3 opacity-10">
                            <Database className="w-16 h-16 text-slate-500" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">云端存储资源使用率</div>
                            <div className="text-xl font-black text-slate-800 mt-2 font-mono">
                                {currentVersion === 'free' ? '2.1 GB / 5 GB' : currentVersion === 'team' ? '18.6 GB / 50 GB' : currentVersion === 'pro' ? '214 GB / 500 GB' : '1.2 TB / 5 TB'}
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
                                <div
                                    className={`bg-primary h-1.5 rounded-full transition-all w-[${currentVersion === 'free' ? 42 : currentVersion === 'team' ? 37.2 : currentVersion === 'pro' ? 42.8 : 24}%]`}
                                ></div>
                            </div>
                        </div>
                        <div className="mt-4 border-t border-slate-100 pt-2 text-[11px] text-slate-500 space-y-1">
                            <div className="flex justify-between"><span>存储介质:</span> <strong className="text-slate-700">{currentVersion === 'free' ? '腾讯云COS 归档存储' : '腾讯云COS 标准存储'}</strong></div>
                            <div className="flex justify-between"><span>数据期效:</span> <strong className="text-slate-700">{currentVersion === 'free' ? '5年' : '服务期内长期留存'}</strong></div>
                        </div>
                    </div>

                    {/* Resource 2: Team Accounts */}
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute right-3 top-3 opacity-10">
                            <Users className="w-16 h-16 text-slate-500" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">已拥有/最大协同账号数</div>
                            <div className="text-xl font-black text-slate-800 mt-2 font-mono">
                                {teamMemberCount} / {currentVersion === 'free' ? '1' : currentVersion === 'team' ? '3' : currentVersion === 'pro' ? '10' : '50'} 个
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
                                <div
                                    className={`bg-purple-600 h-1.5 rounded-full transition-all w-[${(teamMemberCount / (currentVersion === 'free' ? 1 : currentVersion === 'team' ? 3 : currentVersion === 'pro' ? 10 : 50)) * 100}%]`}
                                ></div>
                            </div>
                        </div>
                        <div className="mt-4 border-t border-slate-100 pt-2 text-[11px] text-slate-500 space-y-1">
                            <div className="flex justify-between"><span>成员管理功能:</span> <strong className="text-slate-700">{currentVersion === 'free' ? '无' : '开启'}</strong></div>
                            <div className="flex justify-between"><span>超额增购价格:</span> <strong className="text-slate-700">{currentVersion === 'free' ? '无法增购' : currentVersion === 'team' ? '按年不可加' : currentVersion === 'pro' ? '¥ 298/个/年' : '¥ 256/个/年'}</strong></div>
                        </div>
                    </div>

                    {/* Resource 3: CA Seal and Support */}
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute right-3 top-3 opacity-10">
                            <Award className="w-16 h-16 text-slate-500" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">商事认证CA数字印章额度</div>
                            <div className="text-[11px] text-slate-700 mt-2 leading-relaxed">
                                <div className="flex justify-between py-1 border-b border-slate-200/55">
                                    <span>企业CA印章赠送:</span>
                                    <strong className="font-mono text-slate-800 font-bold">{currentVersion === 'free' ? '0 个' : '1 个 (已启用)'}</strong>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-200/55">
                                    <span>个人CA证书赠送:</span>
                                    <strong className="font-mono text-slate-800 font-bold">
                                        {currentVersion === 'free' ? '0 个' : currentVersion === 'team' ? '0 个' : currentVersion === 'pro' ? '2 个 (已启用1个)' : '9 个 (已启用4个)'}
                                    </strong>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span>私有化部署选项:</span>
                                    <strong className="text-slate-800 font-bold">{currentVersion === 'enterprise' ? '支持' : '不支持'}</strong>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 border-t border-slate-100 pt-2 text-[11px] text-slate-500 space-y-0.5">
                            <div className="flex justify-between"><span>专属在线客服:</span> <strong className="text-slate-700">常规组客</strong></div>
                            <div className="flex justify-between"><span>业务技术顾问:</span> <strong className="text-slate-700">{currentVersion === 'enterprise' ? '软件工程师专配' : '常规标准'}</strong></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub 2: Plan matrix */}
            <div>
                <div className="text-base font-bold text-slate-800 mb-2">兰台档案云系统 - 企业版本治理选择</div>
                <p className="text-xs text-slate-500 mb-4">根据大中型工程与企业实际档案留存规范，由浅入深灵活随心订购合适的企业环境：</p>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* FREE PLAN */}
                    <PlanCard
                        name="免费版"
                        tier="free"
                        version={currentVersion}
                        price="¥ 0"
                        period="/ 永久免费"
                        subtitle="适用于个人立档体验或极其微型的临时协作"
                        features={[
                            { text: '5GB 存储空间 (COS 归档)', included: true },
                            { text: '1个 协同账号', included: true },
                            { text: '无企业与个人CA赠送', included: false },
                            { text: '文件限 10个/次 上传', included: false },
                            { text: '不支持批量与归档包导出', included: false },
                            { text: '无操作审计日志留存', included: false },
                            { text: 'AI能力 仅支持限时特免', included: 'limited' as const },
                        ]}
                        buttonLabel={currentVersion === 'free' ? '当前正在使用' : '降低至免费版'}
                        disabled={currentVersion === 'free'}
                        onClick={() => handlePaymentClick('free', 0, '')}
                        isDark={false}
                    />

                    {/* TEAM PLAN */}
                    <PlanCard
                        name="团队版"
                        tier="team"
                        version={currentVersion}
                        price="¥ 1080"
                        period="/ 年"
                        subtitle="适合 3 人以下小型核心工程档案归档团队"
                        features={[
                            { text: '50GB 存储空间 (COS 标准型)', included: true },
                            { text: '3个 多账号协同与部属管理', included: true },
                            { text: '赠送 1个 企业CA专用在线证书', included: true },
                            { text: '文件增至 20个/次 上传', included: true },
                            { text: '不支持批量/扫描件批量入库', included: false },
                            { text: '开启 操作完整追踪日志审计', included: true },
                            { text: '无AI辅助支持与远程包恢复', included: false },
                        ]}
                        buttonLabel={currentVersion === 'team' ? '续费团队版' : '选择团队版'}
                        onClick={() => handlePaymentClick('team', 1080, '团队版授权激活 (年付)')}
                        isDark={false}
                    />

                    {/* PRO PLAN */}
                    <PlanCard
                        name="专业版"
                        tier="pro"
                        version={currentVersion}
                        price="¥ 2980"
                        period="/ 年"
                        subtitle="主流中大型建筑实体的档案系统推荐"
                        badge="RECOMMENDED"
                        features={[
                            { text: '500GB 云存储容量 (COS标准)', included: true },
                            { text: '10个 协作账号 (可¥298增购)', included: true },
                            { text: '赠送 1个企业CA + 2个个人CA', included: true },
                            { text: '上传无数量限制，支持文件夹', included: true },
                            { text: '智能档案批注、高阶全文检索', included: true },
                            { text: '扫描件上传、批量打包Zip下载', included: true },
                            { text: '回收站增至30天 (支持人工恢复)', included: true },
                        ]}
                        buttonLabel={currentVersion === 'pro' ? '续费专业版' : '升级至专业版'}
                        onClick={() => handlePaymentClick('pro', 2980, '专业版年度订阅续费')}
                        isDark={false}
                    />

                    {/* ENTERPRISE PLAN */}
                    <PlanCard
                        name="企业版"
                        tier="enterprise"
                        version={currentVersion}
                        price="¥ 12800"
                        period="/ 年"
                        subtitle="集团私有化或重大国家重点工程专用"
                        features={[
                            { text: '5TB 庞大存储 (支持私有化集成)', included: true },
                            { text: '50个 专属协作员账号 (CA可自购)', included: true },
                            { text: '赠送专享 1个企业CA + 9个个人CA', included: true },
                            { text: '私有系统部署，不占用公有存储', included: true },
                            { text: '支持人工数据误删底层恢复', included: true },
                            { text: '30天回收期、极速专享CDN加速', included: true },
                            { text: '配备技术顾问+资深系统工程师', included: true },
                        ]}
                        buttonLabel={currentVersion === 'enterprise' ? '当前使用中' : '特订企业版'}
                        onClick={() => handlePaymentClick('enterprise', 12800, '旗舰企业版年度开通授权')}
                        isDark={true}
                    />
                </div>
            </div>

            {/* Tab: Order History */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <div>
                        <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                            <ClipboardList className="w-5 h-5 text-primary" />
                            <span>企业中心扫码缴费账单</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">由于组织下有多个二级账号，系统列出所有产生的企业升级与CA附加服务等付款记录。</p>
                    </div>
                    <div className="text-xs text-slate-500">
                        企业组织累计付费总额: <strong className="text-primary font-mono text-sm">¥ {orders.filter(o => o.status === '已支付').reduce((sum, o) => sum + o.amount, 0)}</strong> 元
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/75">
                                <th className="py-3 px-4 border-b border-slate-200 text-xs font-bold text-slate-500">订单号</th>
                                <th className="py-3 px-4 border-b border-slate-200 text-xs font-bold text-slate-500">创建时间</th>
                                <th className="py-3 px-4 border-b border-slate-200 text-xs font-bold text-slate-500">创建人/支付人</th>
                                <th className="py-3 px-4 border-b border-slate-200 text-xs font-bold text-slate-500">订购服务项目描述</th>
                                <th className="py-3 px-4 border-b border-slate-200 text-xs font-bold text-slate-500">应付金额</th>
                                <th className="py-3 px-4 border-b border-slate-200 text-xs font-bold text-slate-500">支付状态</th>
                                <th className="py-3 px-4 border-b border-slate-200 text-xs font-bold text-slate-500">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/75 border-b border-slate-100">
                                    <td className="py-3 px-4 font-mono text-xs font-medium text-slate-700">{order.id}</td>
                                    <td className="py-3 px-4 text-xs text-slate-500 font-mono">{order.time}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">
                                                {order.creator[0]}
                                            </div>
                                            <span className="text-xs text-slate-700 font-medium">{order.creator}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-xs text-slate-800 font-semibold">{order.desc}</td>
                                    <td className="py-3 px-4 font-mono text-xs font-bold text-slate-800">¥ {order.amount}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${order.status === '已支付' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${order.status === '已支付' ? 'bg-green-500' : 'bg-amber-500 animate-ping'}`}></span>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {order.status === '未支付' ? (
                                            <button
                                                onClick={() => {
                                                    const v = order.amount === 12800 ? 'enterprise' as const : order.amount === 2980 ? 'pro' as const : 'team' as const;
                                                    setPaymentDetails({ version: v, price: order.amount, desc: order.desc });
                                                    setShowPaymentModal(true);
                                                }}
                                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded font-black text-[10px] shadow-xs cursor-pointer transition-colors"
                                            >
                                                去支付 &rarr;
                                            </button>
                                        ) : (
                                            <span className="text-slate-400 text-[11px]">无需操作</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden relative">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                            <span className="font-bold text-slate-800 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" />
                                确认支付
                            </span>
                            <button onClick={() => setShowPaymentModal(false)} className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors" title="关闭">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">订购产品</span>
                                    <span className="font-bold text-slate-800">{paymentDetails.desc}</span>
                                </div>
                                <div className="flex justify-between text-sm border-t border-slate-200 pt-2">
                                    <span className="text-slate-500">当前版本</span>
                                    <span className="font-bold text-slate-800">{paymentDetails.version === 'free' ? '免费版' : paymentDetails.version === 'team' ? '团队版' : paymentDetails.version === 'pro' ? '专业版' : '企业版'}</span>
                                </div>
                                <div className="flex justify-between text-lg border-t border-slate-200 pt-2">
                                    <span className="text-slate-500 font-medium">应付金额</span>
                                    <span className="font-extrabold text-primary">¥ {paymentDetails.price}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">支付人/操作人</label>
                                <input
                                    type="text"
                                    value={paymentPayer}
                                    onChange={(e) => setPaymentPayer(e.target.value)}
                                    className="w-full text-sm px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                                    title="支付人"
                                    placeholder="请输入支付人姓名"
                                />
                            </div>

                            {/* QR Code Placeholder */}
                            <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-6 text-center space-y-3 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-5 pointer-events-none select-none grid grid-cols-4 gap-0.5 p-4">
                                    {Array(32).fill(0).map((_, i) => (
                                        <div key={i} className={`rounded-sm ${i % 5 === 0 || i % 7 === 0 ? 'bg-slate-800' : 'bg-slate-800'} ${i % 3 === 0 ? 'bg-slate-800' : ''}`}></div>
                                    ))}
                                </div>
                                <div className="relative z-10">
                                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-inner relative">
                                        <div className="grid grid-cols-7 gap-0.5 p-2 w-full h-full">
                                            {Array(49).fill(0).map((_, i) => (
                                                <div key={i} className={`rounded-sm ${i === 24 ? 'bg-amber-400' : i % 4 === 0 || i % 7 === 0 ? 'bg-white/80' : i % 3 === 0 ? 'bg-slate-500' : 'bg-transparent'}`}></div>
                                            ))}
                                        </div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 shadow-md rounded border border-slate-200">
                                            <Crown className="w-5 h-5 text-primary" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-3">使用微信或支付宝扫码支付</p>
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-full rotate-12 shadow">
                                    支持 微信 / 支付宝
                                </div>
                            </div>

                            <div className="flex gap-4 items-center justify-center text-[11px] text-slate-500 font-medium">
                                <span className="flex items-center gap-1 text-green-600"><Check className="w-3.5 h-3.5" /> 安全加密网关</span>
                                <span>●</span>
                                <span className="flex items-center gap-1 text-blue-500"><Check className="w-3.5 h-3.5" /> 实时到账冲销</span>
                            </div>

                            <div className="pt-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChangeVersion(paymentDetails.version, paymentDetails.price, paymentDetails.desc);
                                        setShowPaymentModal(false);
                                    }}
                                    className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                                >
                                    <Check className="w-4 h-4" />
                                    我已用微信/支付宝扫码付讫 [模拟付款状态]
                                </button>
                            </div>
                        </div>

                        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                            支付过程受到国家信息安全标准与兰台档案分布式信任链加密保护
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// --- Sub-component: Plan Card ---
interface PlanFeature {
    text: string;
    included: boolean | 'limited';
}

interface PlanCardProps {
    name: string;
    tier: string;
    version: string;
    price: string;
    period: string;
    subtitle: string;
    badge?: string;
    features: PlanFeature[];
    buttonLabel: string;
    disabled?: boolean;
    onClick: () => void;
    isDark: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
    name, tier, version, price, period, subtitle, badge,
    features, buttonLabel, disabled, onClick, isDark
}) => {
    const isActive = version === tier;
    return (
        <div className={`bg-white border rounded-xl overflow-hidden p-5 flex flex-col justify-between transition-all ${
            isActive
                ? 'border-primary ring-2 ring-primary/20 shadow-md'
                : 'border-slate-200 hover:border-slate-200'
        } ${isDark ? 'bg-slate-900 text-white' : ''}`}>
            <div>
                {badge && (
                    <div className="absolute -top-1 right-2 bg-orange-500 text-white font-bold text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        {badge}
                    </div>
                )}
                <div className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-amber-400' : tier === 'free' ? 'text-slate-400' : tier === 'team' ? 'text-blue-500' : 'text-orange-500'}`}>
                    {tier === 'free' ? 'FREE' : tier === 'team' ? 'TEAM' : tier === 'pro' ? 'PROFESSIONAL' : 'ENTERPRISE'}
                </div>
                <h4 className={`text-lg font-black mt-1 mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{name}</h4>
                <div className="flex items-baseline mb-4">
                    <span className={`text-2xl font-extrabold ${isDark ? 'text-amber-400' : 'text-slate-800'}`}>{price}</span>
                    <span className="text-xs text-slate-400 ml-1">{period}</span>
                </div>
                <div className={`text-xs mb-4 border-b ${isDark ? 'text-slate-300 border-gray-800' : 'text-slate-500 border-slate-100'} pb-3`}>{subtitle}</div>

                <ul className={`text-xs space-y-2 mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                            {f.included === true ? (
                                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-amber-400' : 'text-green-500'}`} />
                            ) : f.included === 'limited' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                            ) : (
                                <X className="w-3.5 h-3.5 mr-0.5 shrink-0 text-slate-400" />
                            )}
                            <span className={f.included === false ? 'text-slate-400' : ''}>{f.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <button
                onClick={onClick}
                disabled={disabled}
                className={`w-full py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    disabled
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : isActive
                            ? isDark
                                ? 'bg-amber-400 text-slate-900 hover:bg-amber-500 font-black'
                                : 'bg-primary text-white hover:bg-primary-hover shadow-sm'
                            : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                }`}
            >
                {buttonLabel}
            </button>
        </div>
    );
};

export default VersionTab;
