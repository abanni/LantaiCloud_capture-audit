import React, { useState, useEffect } from 'react';
import { Identity } from '../../types';
import { Save } from 'lucide-react';

interface ProfileTabProps {
    identity: Identity;
    onSaveProfile: (name: string) => void;
    onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
    onNavigatePhoneTab: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ identity, onSaveProfile, onToast, onNavigatePhoneTab }) => {
    // Personal Info State
    const [personalInfo, setPersonalInfo] = useState({
        name: identity.user.name || '张伟',
        idCard: '320583200001019999',
        phone: '15888888888',
        email: 'ry@163.com',
        gender: 'male'
    });

    // Sync state when identity changes
    useEffect(() => {
        setPersonalInfo(prev => ({
            ...prev,
            name: identity.user.name
        }));
    }, [identity]);

    const handleSaveProfile = () => {
        if (!personalInfo.name.trim()) {
            onToast('姓名不能为空哦', 'error');
            return;
        }
        onSaveProfile(personalInfo.name);
        onToast('个人资料保存成功！', 'success');
    };

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-black text-slate-800">基本资料设置</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">请保证您的业务真实信息，以便日常兰台证书和系统申报使用。</p>
            </div>

            <div className="space-y-4 max-w-lg">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs font-bold text-gray-750">
                    <span className="w-24 shrink-0 md:text-right">
                        <span className="text-red-500 mr-1">*</span>用户姓名
                    </span>
                    <input
                        type="text"
                        value={personalInfo.name}
                        onChange={e => setPersonalInfo({...personalInfo, name: e.target.value})}
                        className="flex-1 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-primary font-bold text-slate-800 transition-colors"
                        placeholder="请输入真实姓名"
                    />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs font-bold text-gray-750">
                    <span className="w-24 shrink-0 md:text-right">身份证号</span>
                    <input
                        type="text"
                        value={personalInfo.idCard}
                        onChange={e => setPersonalInfo({...personalInfo, idCard: e.target.value})}
                        className="flex-1 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-primary font-bold text-slate-800 transition-colors font-mono"
                        placeholder="请输入中国大陆身份证号"
                    />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs font-bold text-gray-750">
                    <span className="w-24 shrink-0 md:text-right">常用手机</span>
                    <div className="flex-1 flex gap-2 items-center">
                        <span className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg font-mono font-bold select-none cursor-not-allowed">
                            {personalInfo.phone}
                        </span>
                        <button
                            onClick={onNavigatePhoneTab}
                            className="text-primary hover:underline text-[11px] font-bold"
                        >
                            前往更换手机
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs font-bold text-gray-750">
                    <span className="w-24 shrink-0 md:text-right">用户邮箱</span>
                    <input
                        type="email"
                        value={personalInfo.email}
                        onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})}
                        className="flex-1 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-primary font-bold text-slate-800 transition-colors"
                        placeholder="ry@163.com"
                    />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs font-bold text-gray-750">
                    <span className="w-24 shrink-0 md:text-right">系统性别</span>
                    <div className="flex items-center gap-6 mt-1 md:mt-0">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={personalInfo.gender === 'male'}
                                onChange={() => setPersonalInfo({...personalInfo, gender: 'male'})}
                                className="text-primary focus:ring-primary w-4.5 h-4.5 cursor-pointer"
                            />
                            男
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={personalInfo.gender === 'female'}
                                onChange={() => setPersonalInfo({...personalInfo, gender: 'female'})}
                                className="text-primary focus:ring-primary w-4.5 h-4.5 cursor-pointer"
                            />
                            女
                        </label>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-100 pt-5 flex justify-end gap-3">
                <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-2"
                >
                    <Save className="w-3.5 h-3.5" />
                    保存基本信息
                </button>
            </div>
        </div>
    );
};

export default ProfileTab;
