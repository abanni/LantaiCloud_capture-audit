import React, { useState } from 'react';
import { ArchiveItem, SubmittedDocument, ProjectFilterCriteria } from './auditTypes';
import { FileText, MapPin, BadgeCheck, X, Filter, FolderPlus } from 'lucide-react';
import { ProjectFilter, filterArchives } from './Shared';

const DocItem: React.FC<{ doc: SubmittedDocument }> = ({ doc }) => (
    <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-350 hover:shadow-sm transition-all group">
        <div className="flex items-center gap-2.5 overflow-hidden">
             <div className="bg-red-50 text-red-650 p-2 rounded-lg shrink-0">
                 <FileText size={18} />
             </div>
             <div className="min-w-0">
                 <p className="text-xs font-bold text-slate-800 truncate">{doc.name}</p>
                 <div className="flex items-center gap-1.5 mt-1">
                    {doc.required && <span className="text-[9px] bg-red-100 text-red-600 px-1 rounded font-bold border border-red-200">受控硬移交</span>}
                    <span className="text-[10px] text-slate-400 font-mono">{doc.uploadDate}</span>
                 </div>
             </div>
        </div>
        <div className="flex gap-2 shrink-0">
            <button 
                onClick={() => alert(`正在加载【${doc.name}】进行双层红章OCR对齐验证...`)}
                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-105 hover:text-blue-700 text-blue-600 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
            >
                阅
            </button>
        </div>
    </div>
);

const TableRow = ({ label, value, colSpan = 1 }: { label: string, value: string | number | undefined, colSpan?: number }) => {
    const spanClass = colSpan === 2 ? 'col-span-2' : 'col-span-1';
    return (
        <div className={`${spanClass} flex border-b border-r border-slate-200 last:border-r-0`}>
            <div className="w-28 bg-slate-50/80 p-2.5 text-[10px] text-slate-500 font-bold flex items-center border-r border-slate-200 shrink-0 uppercase tracking-wider">
                {label}
            </div>
            <div className="flex-1 p-2.5 text-xs text-slate-805 leading-relaxed font-semibold break-all flex items-center bg-white">
                {value || "/"}
            </div>
        </div>
    );
};

export const AuditRegistrationView = ({ 
    archives, 
    onRegister 
}: { 
    archives: ArchiveItem[], 
    onRegister: (id: string, num: string) => void 
}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [activeItem, setActiveItem] = useState<ArchiveItem | null>(null);
    const [regNum, setRegNum] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState<ProjectFilterCriteria>({});
    
    // Show only the ones awaiting registration
    const baseNewArchives = archives.filter(a => a.stage === "REGISTER");
    const filteredArchives = filterArchives(baseNewArchives, filterCriteria);

    const openRegister = (item: ArchiveItem) => {
        setActiveItem(item);
        const seq = String(Math.floor(Math.random() * 9000 + 1000));
        setRegNum(`${new Date().getFullYear()}-${seq}`);
        setModalOpen(true);
    };

    const submitRegister = () => {
        if (activeItem && regNum) {
            onRegister(activeItem.id, regNum);
            setModalOpen(false);
            alert("档案移交登记及审核人员分拨配给大盘完成！");
        }
    };
    
    const handleReturn = () => {
        const reason = prompt("请输入不予登记退回修改的补充理由：");
        if (reason) {
            alert(`已退回，整改通知已下发给经办人。`);
            setModalOpen(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            
            {/* Filter Panel */}
            {showFilter && (
                <div className="px-4 pt-4 shrink-0">
                    <ProjectFilter 
                        onFilter={setCriteria => { setFilterCriteria(setCriteria); }} 
                        onReset={() => { setFilterCriteria({}); }}
                    />
                </div>
            )}

            {/* Grid list or Empty state */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-[#fcfdfe] border-b border-slate-200 text-slate-500 font-bold">
                            <tr>
                                <th className="p-4 w-1/3">档案项目名册名称</th>
                                <th className="p-4">受控施工许可证号</th>
                                <th className="p-4">报建申报主体/单位</th>
                                <th className="p-4 w-32">报备提交日期</th>
                                <th className="p-4 text-right w-36">操作项</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                            {filteredArchives.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-slate-400 font-semibold text-xs border-dashed border-2 m-4 bg-slate-50/50">
                                        由于今日没有待签收移交的建设案卷包，暂不提供登记服务。
                                    </td>
                                </tr>
                            ) : (
                                filteredArchives.map((a: ArchiveItem) => (
                                    <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800">{a.projectInfo.projectName}</div>
                                            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                                <MapPin size={11} className="text-slate-400" /> {a.projectInfo.location}
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono font-bold text-slate-700">
                                            {a.projectInfo.permitNumber}
                                        </td>
                                        <td className="p-4 text-slate-650 max-w-xs truncate" title={a.projectInfo.constructionUnit}>
                                            {a.projectInfo.constructionUnit}
                                        </td>
                                        <td className="p-4 font-mono text-slate-600">{a.submissionDate.split(' ')[0]}</td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => openRegister(a)}
                                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-all shadow shadow-blue-100 cursor-pointer"
                                            >
                                                登记分配审查
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination footer */}
            <div className="bg-white p-4 border-t border-slate-200 flex items-center justify-end gap-3 text-xs text-slate-600 shrink-0">
                <span>共 <strong>{filteredArchives.length}</strong> 条记录</span>
            </div>

            {/* Large Metadata Registration & Assignment Modal */}
            {modalOpen && activeItem && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
                        
                        {/* Title block */}
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">项目详情</h3>
                            </div>
                            <button onClick={() => setModalOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 transition cursor-pointer" title="关闭">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Grid form matrix */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                            
                            <section>
                                <h4 className="text-xs font-black text-slate-700 border-l-4 border-blue-600 pl-2.5 mb-4 uppercase tracking-wider">
                                    项目基本信息
                                </h4>
                                <div className="border border-slate-200 rounded-xl overflow-hidden grid grid-cols-2 bg-white shadow-sm font-sans">
                                     <TableRow label="项目工程名称" value={activeItem.projectInfo.projectName} colSpan={2} />
                                     <TableRow label="系统分配档号" value={regNum} colSpan={2} />
                                     <TableRow label="项目代码" value={activeItem.projectInfo.projectCode} />
                                     <TableRow label="规划许可证件号" value={activeItem.projectInfo.planningPermitNumber} />
                                     <TableRow label="项目核准文批号" value={activeItem.projectInfo.approvalNumber} />
                                     <TableRow label="质监号（编号）" value={activeItem.projectInfo.qualityNumber} />
                                     <TableRow label="用地规准许可证号" value={activeItem.projectInfo.landPermitNumber} />
                                     {/* 规划审批批复关口（已删除） */}
                                     <TableRow label="建设报建地点" value={activeItem.projectInfo.location} colSpan={2} />
                                     <TableRow label="建设单位" value={activeItem.projectInfo.constructionUnit} />
                                     <TableRow label="施工单位" value={activeItem.projectInfo.constructionCompany} />
                                     <TableRow label="监理机构" value={activeItem.projectInfo.supervisorUnit} />
                                     <TableRow label="勘察单位" value={activeItem.projectInfo.surveyUnit} />
                                     <TableRow label="设计单位" value={activeItem.projectInfo.designUnit} />
                                     <TableRow label="项目负责人" value={activeItem.projectInfo.projectManager} />
                                     <TableRow label="负责人电话" value={activeItem.projectInfo.managerPhone} />
                                     <TableRow label="工程造价" value={activeItem.projectInfo.totalCost} />
                                     <TableRow label="经办人" value="李汉文" />
                                     <TableRow label="建筑面积" value={activeItem.projectInfo.totalArea ? activeItem.projectInfo.totalArea + '㎡' : '/'} />
                                     <TableRow label="提交日期" value="2026-06-07 09:24" colSpan={2} />
                                </div>
                            </section>

                            {/* Documents check */}
                            <section>
                                <h4 className="text-xs font-black text-slate-700 border-l-4 border-orange-500 pl-2.5 mb-4 uppercase tracking-wider">
                                    上传附件
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeItem.submissionDocs.map((doc, idx) => (
                                        <DocItem key={idx} doc={doc} />
                                    ))}
                                </div>
                            </section>

                        </div>

                        {/* Assign and Reviewer Selector */}
                        <div className="p-6 border-t border-slate-200 bg-slate-50 shrink-0 select-none">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                                <div>
                                     <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1.5">
                                        选择分管审核人
                                     </label>
                                     <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white focus:ring-1 focus:ring-blue-500 font-semibold outline-none text-slate-800 shadow-inner" title="分管审核人">
                                         <option>张三 (6)</option>
                                         <option>李四 (3)</option>
                                         <option>徐琴 (2)</option>
                                     </select>
                                </div>
                                
                                <div>
                                     <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1.5">
                                        修改意见
                                     </label>
                                     <textarea
                                         className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white focus:ring-1 focus:ring-blue-500 outline-none text-slate-800 shadow-inner resize-none"
                                         rows={2}
                                         placeholder="请输入修改意见（选填）"
                                         title="修改意见"
                                     />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 text-xs font-bold">
                                <button 
                                    onClick={() => setModalOpen(false)} 
                                    className="px-5 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                                >
                                    取消
                                </button>
                                <button 
                                    onClick={handleReturn}
                                    className="px-5 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 border border-amber-200 transition cursor-pointer"
                                >
                                    退回修改
                                </button>
                                <button 
                                    onClick={submitRegister}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow shadow-blue-100 transition cursor-pointer"
                                >
                                    准予登记
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};
