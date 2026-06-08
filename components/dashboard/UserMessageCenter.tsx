import React, { useState } from 'react';
import { 
    MessageSquare, CheckSquare, Square, Folder, Clock, 
    Inbox, X, FileText
} from 'lucide-react';

// Notification Message interface
interface UserMessage {
    id: string;
    title: string;
    content: string;
    status: 'read' | 'unread';
    time: string;
    projectName: string;
    organizationId: string;
}

interface UserMessageCenterProps {
    messages: UserMessage[];
    onMessagesChange?: React.Dispatch<React.SetStateAction<UserMessage[]>>;
    onNavigateToWorkspace?: () => void;
}

const UserMessageCenter: React.FC<UserMessageCenterProps> = ({ 
    messages,
    onMessagesChange,
    onNavigateToWorkspace
}) => {
    // Multi-select and detail viewing state for user messages
    const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
    const [viewingMessage, setViewingMessage] = useState<UserMessage | null>(null);
    const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read'>('all');

    // Secondary filter based on status (all, read, unread)
    const displayedMessages = messages.filter(m => {
        if (messageFilter === 'unread') return m.status === 'unread';
        if (messageFilter === 'read') return m.status === 'read';
        return true;
    });

    // Handle single row checkbox toggle
    const handleToggleMessageSelect = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedMessageIds(prev => 
            prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
        );
    };

    // Master checkbox select toggle
    const handleToggleAllVisible = () => {
        const visibleIds = displayedMessages.map(m => m.id);
        const allAlreadySelected = visibleIds.every(id => selectedMessageIds.includes(id));
        
        if (allAlreadySelected) {
            // Uncheck Visible
            setSelectedMessageIds(prev => prev.filter(id => !visibleIds.includes(id)));
        } else {
            // Check Visible (union)
            setSelectedMessageIds(prev => {
                const union = [...prev];
                visibleIds.forEach(id => {
                    if (!union.includes(id)) union.push(id);
                });
                return union;
            });
        }
    };

    // Batch mark selected notifications as read
    const handleBatchMarkAsRead = () => {
        if (selectedMessageIds.length === 0) return;
        if (onMessagesChange) {
            onMessagesChange(prev => prev.map(m => 
                selectedMessageIds.includes(m.id) ? { ...m, status: 'read' as const } : m
            ));
        }
        setSelectedMessageIds([]); // Reset selection
    };

    // Click on message row to open modal & auto-mark unread messages as read
    const handleMessageClick = (msg: UserMessage) => {
        setViewingMessage(msg);
        if (msg.status === 'unread' && onMessagesChange) {
            onMessagesChange(prev => prev.map(m => 
                m.id === msg.id ? { ...m, status: 'read' as const } : m
            ));
        }
    };

    return (
        <>
            {/* ADDED SECTION: 我的信息 / 消息中心 */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-base">我的信息</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">所有日常归档立轴、电子章核发、审批和外协记录，均按时间呈报</p>
                        </div>
                    </div>

                    {/* Controls and filters */}
                    <div className="flex items-center flex-wrap gap-2.5 w-full sm:w-auto">
                        {/* Filter tabs */}
                        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                            <button 
                                onClick={() => setMessageFilter('all')}
                                className={`px-3 py-1 rounded-md font-medium transition-colors ${messageFilter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                全部 ({messages.length})
                            </button>
                            <button 
                                onClick={() => setMessageFilter('unread')}
                                className={`px-3 py-1 rounded-md font-medium transition-colors ${messageFilter === 'unread' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-blue-600'}`}
                            >
                                未读 ({messages.filter(m => m.status === 'unread').length})
                            </button>
                            <button 
                                onClick={() => setMessageFilter('read')}
                                className={`px-3 py-1 rounded-md font-medium transition-colors ${messageFilter === 'read' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                已读
                            </button>
                        </div>

                        {/* Batch mark read button */}
                        <button 
                            onClick={handleBatchMarkAsRead}
                            disabled={selectedMessageIds.length === 0 || !messages.some(m => selectedMessageIds.includes(m.id) && m.status === 'unread')}
                            className="flex items-center px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed hover:border-slate-200 shadow-xs transition-colors"
                        >
                            <CheckSquare className="w-3.5 h-3.5 mr-1" />
                            批量标记已读
                        </button>
                    </div>
                </div>

                {/* Table / List representation */}
                <div className="overflow-x-auto">
                    {displayedMessages.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 bg-slate-50/25">
                                    {/* Multi-select master head */}
                                    <th className="py-3 px-4 w-[48px] text-center">
                                        <button 
                                            onClick={handleToggleAllVisible}
                                            className="text-slate-400 hover:text-primary focus:outline-none flex items-center justify-center mx-auto"
                                            title="全选当前列表"
                                        >
                                            {displayedMessages.every(m => selectedMessageIds.includes(m.id)) ? (
                                                <CheckSquare className="w-4 h-4 text-primary" />
                                            ) : selectedMessageIds.some(id => displayedMessages.map(m => m.id).includes(id)) ? (
                                                <div className="w-4 h-4 bg-primary/20 border border-primary text-primary flex items-center justify-center rounded-[3px]">
                                                    <span className="block w-2 h-0.5 bg-primary"></span>
                                                </div>
                                            ) : (
                                                <Square className="w-4 h-4 text-gray-305" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="py-3 px-4 w-[100px]">状态</th>
                                    <th className="py-3 px-4">标题 / 消息内容摘要</th>
                                    <th className="py-3 px-4 w-[240px]">关联项目</th>
                                    <th className="py-3 px-4 w-[160px] text-right">呈报时间</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedMessages.map((msg) => {
                                    const isSelected = selectedMessageIds.includes(msg.id);
                                    const isUnread = msg.status === 'unread';
                                    
                                    return (
                                        <tr 
                                            key={msg.id}
                                            onClick={() => handleMessageClick(msg)}
                                            className={`border-b border-slate-100 text-xs align-middle hover:bg-blue-50/20 cursor-pointer transition-colors ${isUnread ? 'bg-primary/5 hover:bg-primary/10' : ''}`}
                                        >
                                            {/* Checkbox select */}
                                            <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                <button 
                                                    onClick={(e) => handleToggleMessageSelect(msg.id, e)}
                                                    className="text-slate-400 hover:text-primary transition-colors focus:outline-none flex items-center justify-center mx-auto"
                                                >
                                                    {isSelected ? (
                                                        <CheckSquare className="w-4 h-4 text-primary" />
                                                    ) : (
                                                        <Square className="w-4 h-4 text-gray-305" />
                                                    )}
                                                </button>
                                            </td>
                                            
                                            {/* Unread dot indicator */}
                                            <td className="py-3 px-4">
                                                <div className="flex items-center">
                                                    {isUnread ? (
                                                        <span className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                                            未读
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 bg-slate-100 text-slate-500 border border-slate-200/50 px-2 py-0.5 rounded text-[10px]">
                                                            已读
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Text detail */}
                                            <td className="py-3 px-4">
                                                <div className="space-y-0.5 pr-4">
                                                    <div className={`text-slate-800 truncate text-[12px] ${isUnread ? 'font-bold' : 'font-medium'}`}>
                                                        {msg.title}
                                                    </div>
                                                    <div className="text-slate-400 truncate text-[11px] max-w-[500px]">
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Associated Project */}
                                            <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-medium">
                                                <div className="flex items-center gap-1 max-w-[220px] truncate" title={msg.projectName}>
                                                    <Folder className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    <span className="truncate">{msg.projectName}</span>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="py-3 px-4 text-right whitespace-nowrap text-slate-400 font-mono text-[11px]">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Clock className="w-3 h-3 text-gray-305" />
                                                    <span>{msg.time}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center text-slate-400 bg-white">
                            <Inbox className="w-8 h-8 mx-auto mb-2.5 text-slate-300" />
                            <p className="text-xs">
                                暂无符合筛选条件的信息。
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Message Detail Popup Modal (点到信息上弹出窗口显示信息内容) */}
            {viewingMessage && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity duration-300">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-zoomIn border border-slate-100">
                        {/* Modal Header */}
                        <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${viewingMessage.status === 'unread' ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">系统信件呈报</span>
                            </div>
                            <button 
                                onClick={() => setViewingMessage(null)}
                                className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none"
                                title="关闭"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-6 space-y-4.5">
                            <div>
                                <h4 className="text-base font-bold text-slate-900 leading-snug">
                                    {viewingMessage.title}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px] text-slate-500">
                                    <span className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                                        <Clock className="w-3.5 h-3.5 text-gray-40s" />
                                        {viewingMessage.time}
                                    </span>
                                    <span className="flex items-center gap-1 bg-blue-50 text-blue-750 border border-blue-150 px-2 py-0.5 rounded font-medium">
                                        <Folder className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                        项目: {viewingMessage.projectName}
                                    </span>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">具体呈报详情</label>
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-wrap">
                                    {viewingMessage.content}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs">
                            <span className="text-[10px] text-slate-400">若有紧急业务，请双击项目进入兰台云盘</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        if (onNavigateToWorkspace) onNavigateToWorkspace();
                                        setViewingMessage(null);
                                    }}
                                    className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover shadow-sm transition-colors text-xs"
                                >
                                    直接进入该项目云盘
                                </button>
                                <button 
                                    onClick={() => setViewingMessage(null)}
                                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold rounded-lg transition-colors text-xs"
                                >
                                    知道了
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserMessageCenter;
