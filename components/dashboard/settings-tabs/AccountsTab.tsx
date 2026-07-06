import React, { useState } from 'react';
import { Trash2, RefreshCw, MessageCircle } from 'lucide-react';

interface BoundAccount {
    id: string;
    platform: 'yqt' | 'wx_mp';
    avatar: string;
    nickname: string;
    systemAccount: string;
    bindTime: string;
}

interface AccountsTabProps {
    onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const AccountsTab: React.FC<AccountsTabProps> = ({ onToast }) => {
    const [boundAccounts, setBoundAccounts] = useState<BoundAccount[]>([
        {
            id: 'b1',
            platform: 'yqt',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
            nickname: '汤伟',
            systemAccount: '1861986668717207553',
            bindTime: '2025-10-10 06:45:36'
        },
        {
            id: 'b2',
            platform: 'wx_mp',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
            nickname: 'wx_oykJG7O4ARVYqqw6zOm5',
            systemAccount: 'oykJG7O4ARVYqqw6zOm5FM...',
            bindTime: '2025-11-21 15:31:19'
        }
    ]);

    const handleUnbind = (id: string, platformLabel: string) => {
        setBoundAccounts(prev => prev.filter(account => account.id !== id));
        onToast(`${platformLabel} 账号解绑成功`, 'success');
    };

    const handleBind = (platform: 'yqt' | 'wx_mp') => {
        if (boundAccounts.some(acc => acc.platform === platform)) {
            onToast(`您已绑定过此平台的账号`, 'error');
            return;
        }

        const formattedTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
        let newAccount: BoundAccount;

        if (platform === 'yqt') {
            newAccount = {
                id: 'b_' + Math.random().toString(36).substring(2, 7),
                platform: 'yqt',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
                nickname: '虞企通用户_张伟',
                systemAccount: '1861986' + Math.floor(Math.random() * 90000000000),
                bindTime: formattedTime
            };
        } else {
            newAccount = {
                id: 'b_' + Math.random().toString(36).substring(2, 7),
                platform: 'wx_mp',
                avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
                nickname: 'wx_' + Math.random().toString(36).substring(2, 10),
                systemAccount: Math.random().toString(36).substring(2, 12) + '...',
                bindTime: formattedTime
            };
        }

        setBoundAccounts(prev => [...prev, newAccount]);
        onToast(`第三方平台 [${platform === 'yqt' ? '虞企通' : '微信公众号'}] 账号绑定成功！`, 'success');
    };

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-black text-slate-800">第三方绑定设置</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">您可以绑定以下外接平台认证通道，更加快速简易地登录兰台云。</p>
            </div>

            {/* Bound Accounts List Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                            <th className="px-4 py-3 text-center w-12 font-bold">序号</th>
                            <th className="px-4 py-3 font-bold">绑定账号平台</th>
                            <th className="px-4 py-3 text-center w-16 font-bold">头像</th>
                            <th className="px-4 py-3 font-bold">昵称</th>
                            <th className="px-4 py-3 font-bold">系统账号</th>
                            <th className="px-4 py-3 font-bold">绑定时间</th>
                            <th className="px-4 py-3 text-center w-14 font-bold">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {boundAccounts.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-slate-400 font-medium">
                                    暂无绑定的第三方账号平台
                                </td>
                            </tr>
                        ) : (
                            boundAccounts.map((account, index) => (
                                <tr key={account.id} className="hover:bg-slate-50/50 transition-colors font-medium">
                                    <td className="px-4 py-3.5 text-center font-mono text-slate-400 font-bold">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3.5 font-bold">
                                        <div className="flex items-center gap-2">
                                            {account.platform === 'yqt' ? (
                                                <div className="flex items-center gap-1.5 text-blue-650">
                                                    <div className="w-4.5 h-4.5 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
                                                        <RefreshCw className="w-2.5 h-2.5 text-blue-600 animate-spin-slow" />
                                                    </div>
                                                    <span className="text-[11px] font-bold">yqt</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-emerald-650">
                                                    <div className="w-4.5 h-4.5 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-250">
                                                        <MessageCircle className="w-2.5 h-2.5 text-emerald-600" />
                                                    </div>
                                                    <span className="text-[11px] font-bold">wx_mp</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 mx-auto bg-slate-100">
                                            {account.avatar ? (
                                                <img
                                                    src={account.avatar}
                                                    alt="third-party-avatar"
                                                    className="w-full h-full object-cover"
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-indigo-100 text-primary text-[8px] flex items-center justify-center font-black">
                                                    {account.nickname.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 font-bold text-slate-800 truncate max-w-[120px]" title={account.nickname}>
                                        {account.nickname}
                                    </td>
                                    <td className="px-4 py-3.5 font-mono text-slate-500 font-bold select-all truncate max-w-[160px]" title={account.systemAccount}>
                                        {account.systemAccount}
                                    </td>
                                    <td className="px-4 py-3.5 font-mono text-slate-400 font-bold">
                                        {account.bindTime}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <button
                                            onClick={() => handleUnbind(account.id, account.platform === 'yqt' ? '虞企通' : '微信公众号')}
                                            className="p-1 px-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                            title="解除绑定"
                                        >
                                            <Trash2 className="w-4 h-4 mx-auto" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Platform binding options */}
            <div className="space-y-4 pt-4 text-left border-t border-slate-100">
                <h3 className="text-sm font-black text-slate-800">
                    你可以绑定以下第三方帐号用于兰台云
                </h3>

                <div className="flex flex-wrap gap-8 py-2">
                    {/* Button 虞企通 (YQT Platform Binder) */}
                    <button
                        onClick={() => handleBind('yqt')}
                        className="group flex flex-col items-center gap-2 bg-transparent border-0 hover:scale-105 transition-transform cursor-pointer outline-none select-none text-center"
                    >
                        <div className="w-12 h-12 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-2xl flex items-center justify-center shadow-md transition-colors border border-[#0284c7]">
                            <RefreshCw className="w-6 h-6 animate-spin-slow" />
                        </div>
                        <span className="text-[11px] font-bold text-sky-800 group-hover:text-sky-950 transition-colors">
                            虞企通
                        </span>
                    </button>

                    {/* Button 微信公众号 (WeChat MP Binder) */}
                    <button
                        onClick={() => handleBind('wx_mp')}
                        className="group flex flex-col items-center gap-2 bg-transparent border-0 hover:scale-105 transition-transform cursor-pointer outline-none select-none text-center"
                    >
                        <div className="w-12 h-12 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-2xl flex items-center justify-center shadow-md transition-colors border border-[#22c55e]">
                            <MessageCircle className="w-6 h-6 shrink-0" />
                        </div>
                        <span className="text-[11px] font-bold text-emerald-800 group-hover:text-emerald-950 transition-colors">
                            微信公众号
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountsTab;
