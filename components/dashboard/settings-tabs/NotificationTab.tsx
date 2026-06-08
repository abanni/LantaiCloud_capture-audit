import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationTabProps {
    onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const NotificationTab: React.FC<NotificationTabProps> = ({ onToast }) => {
    const handleSave = () => {
        onToast('通知设置保存成功！', 'success');
    };

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-black text-slate-800">通知设置</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">管理您接收系统通知的方式和频率。</p>
            </div>

            <div className="space-y-4 max-w-lg">
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <Bell className="w-4 h-4 text-slate-400" />
                        <div>
                            <p className="text-xs font-bold text-slate-800">短信通知</p>
                            <p className="text-[11px] text-slate-400">项目进度、审核结果等通知通过短信发送</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked title="短信通知开关" />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <Bell className="w-4 h-4 text-slate-400" />
                        <div>
                            <p className="text-xs font-bold text-slate-800">邮件通知</p>
                            <p className="text-[11px] text-slate-400">重要安全事件、账号变动通过邮件提醒</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked title="邮件通知开关" />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <Bell className="w-4 h-4 text-slate-400" />
                        <div>
                            <p className="text-xs font-bold text-slate-800">站内信通知</p>
                            <p className="text-[11px] text-slate-400">系统公告、工单回复等在站内信中展示</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked title="站内信通知开关" />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>

            <div className="border-t border-slate-100 pt-5 flex justify-end gap-3">
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-2"
                >
                    保存通知设置
                </button>
            </div>
        </div>
    );
};

export default NotificationTab;
