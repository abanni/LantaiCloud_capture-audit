import React, { useState, useEffect, useRef } from 'react';
import { Identity } from '../../types';
import { AlertCircle, Check, KeyRound } from 'lucide-react';

interface SecurityTabProps {
    identity: Identity;
    onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ identity, onToast }) => {
    // Password fields state
    const [passwordFields, setPasswordFields] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Phone changing flow states
    const [newPhone, setNewPhone] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [sentCode, setSentCode] = useState<string>('');
    const [countdown, setCountdown] = useState(0);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup countdown timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Handle password update
    const handleSavePassword = () => {
        if (!passwordFields.oldPassword || !passwordFields.newPassword || !passwordFields.confirmPassword) {
            onToast('请完整填写所有的密码项', 'error');
            return;
        }
        if (passwordFields.newPassword !== passwordFields.confirmPassword) {
            onToast('两次输入的新密码不一致，请检查', 'error');
            return;
        }
        onToast('密码修改成功，安全通道已刷新！', 'success');
        setPasswordFields({ oldPassword: '', newPassword: '', confirmPassword: '' });
    };

    // Handle sending Verification Code
    const handleGetCode = () => {
        if (!newPhone.trim()) {
            onToast('请输入新手机号', 'error');
            return;
        }
        if (!/^1[3-9]\d{9}$/.test(newPhone)) {
            onToast('请输入合法的11位手机号', 'error');
            return;
        }

        setIsSendingCode(true);

        setTimeout(() => {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            setSentCode(code);
            setIsSendingCode(false);
            setCountdown(60);

            timerRef.current = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            onToast(`【兰台云短信】验证码发送成功！您的新手机验证码为: ${code}，5分钟内有效。`, 'info');
        }, 1200);
    };

    // Handle Phone updating verification
    const handleSavePhone = () => {
        if (!newPhone.trim()) {
            onToast('请输入手机号', 'error');
            return;
        }
        if (!verificationCode.trim()) {
            onToast('请输入验证码', 'error');
            return;
        }
        if (verificationCode !== sentCode) {
            onToast('验证码无效或已过期，请重新获取', 'error');
            return;
        }

        setNewPhone('');
        setVerificationCode('');
        setSentCode('');
        setCountdown(0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        onToast('绑定手机号更换成功！', 'success');
    };

    return (
        <div className="p-6 md:p-8 space-y-6">
            {/* Section: Change Phone */}
            <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-black text-slate-800">安全更换手机号码</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">更换手机后，后续的短信校验、登录授权等服务都将更新至新手机号上。</p>
            </div>

            <div className="space-y-4 max-w-lg">
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-xs space-y-1 font-medium">
                    <div className="font-bold flex items-center gap-1.5 text-amber-900 mb-1">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                        温馨提示
                    </div>
                    <p>1、为保障您的交易安全，请使用您本人实名的全新手机号码。</p>
                    <p>2、测试更换时，点击「获取验证码」后会直接在<span>屏幕正上方</span>浮窗提示仿真验证码，可以直接拷入以便完成演示闭环。</p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs font-bold text-gray-750">
                    <span className="w-24 shrink-0 md:text-right">
                        <span className="text-red-500 mr-1">*</span>新手机号码
                    </span>
                    <input
                        type="text"
                        value={newPhone}
                        onChange={e => setNewPhone(e.target.value)}
                        className="flex-1 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-primary font-bold text-slate-800 transition-colors font-mono"
                        placeholder="请输入新手机号"
                    />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs font-bold text-gray-750">
                    <span className="w-24 shrink-0 md:text-right">
                        <span className="text-red-500 mr-1">*</span>短信验证码
                    </span>
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={e => setVerificationCode(e.target.value)}
                            className="flex-1 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-primary font-bold text-slate-800 transition-colors font-mono"
                            placeholder="6位短信校验码"
                            maxLength={6}
                        />
                        <button
                            type="button"
                            disabled={countdown > 0 || isSendingCode}
                            onClick={handleGetCode}
                            className="w-36 px-3 bg-slate-150 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer select-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-center shrink-0"
                        >
                            {isSendingCode
                                ? '正在发送...'
                                : countdown > 0
                                    ? `${countdown}秒后重新获取`
                                    : '获取验证码'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="border-b border-slate-100 pb-5 flex justify-end gap-3">
                <button
                    onClick={handleSavePhone}
                    className="px-6 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
                >
                    <Check className="w-4 h-4" />
                    确认改绑新手机
                </button>
            </div>

            {/* Section: Password Update */}
            <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-black text-slate-800">修改登录密码</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">请定期修改您的密码，防止账号被盗导致企业兰台项目与重要成果泄漏。</p>
            </div>

            <div className="space-y-4 max-w-lg">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs font-bold text-gray-750">
                    <span className="w-24 shrink-0 md:text-right">
                        <span className="text-red-500 mr-1">*</span>原旧密码
                    </span>
                    <input
                        type="password"
                        value={passwordFields.oldPassword}
                        onChange={e => setPasswordFields({...passwordFields, oldPassword: e.target.value})}
                        className="flex-1 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-primary font-bold text-slate-800"
                        placeholder="请输入您的旧密码"
                    />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs font-bold text-gray-750">
                    <span className="w-24 shrink-0 md:text-right">
                        <span className="text-red-500 mr-1">*</span>新密码
                    </span>
                    <input
                        type="password"
                        value={passwordFields.newPassword}
                        onChange={e => setPasswordFields({...passwordFields, newPassword: e.target.value})}
                        className="flex-1 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-primary font-bold text-slate-800"
                        placeholder="请输入新安全密码"
                    />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs font-bold text-gray-750">
                    <span className="w-24 shrink-0 md:text-right">
                        <span className="text-red-500 mr-1">*</span>二次确认密码
                    </span>
                    <input
                        type="password"
                        value={passwordFields.confirmPassword}
                        onChange={e => setPasswordFields({...passwordFields, confirmPassword: e.target.value})}
                        className="flex-1 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-none focus:border-primary font-bold text-slate-800"
                        placeholder="请重新写一遍新密码"
                    />
                </div>
            </div>

            <div className="border-t border-slate-100 pt-5 flex justify-end gap-3">
                <button
                    onClick={handleSavePassword}
                    className="px-6 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-2"
                >
                    <KeyRound className="w-4 h-4" />
                    确认更新密码
                </button>
            </div>
        </div>
    );
};

export default SecurityTab;
