import React from 'react';
import {
    Crown, Sparkles, Database, Users, Award
} from 'lucide-react';

interface CurrentVersionTabProps {
    currentVersion: 'free' | 'team' | 'pro' | 'enterprise';
    teamMemberCount?: number;
}

const versionLabel: Record<string, string> = {
    free: '免费版', team: '团队版', pro: '专业版', enterprise: '企业版',
};

const CurrentVersionTab: React.FC<CurrentVersionTabProps> = ({ currentVersion, teamMemberCount = 0 }) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4 flex-wrap gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-amber-500 fill-amber-400" />
                        <h3 className="text-base font-bold text-slate-800">当前运行版本及资源用量</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">您当前租户正在使用{versionLabel[currentVersion]}的企业治理资源方案</p>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>当前版本: {versionLabel[currentVersion]}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    );
};

export default CurrentVersionTab;
