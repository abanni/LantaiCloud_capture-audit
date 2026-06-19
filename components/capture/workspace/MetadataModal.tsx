
import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, FileText, Building, Folder, Box } from 'lucide-react';
import { ArchiveLevel } from '../../../types';

interface MetadataModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: ArchiveLevel;
    data: any;
}

const MetadataModal: React.FC<MetadataModalProps> = ({ isOpen, onClose, type, data }) => {
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        // Initialize with data or mock defaults based on type
        if (type === 'project' && !data?.projectCode) {
             setFormData({
                name: data?.name || '巴城镇前进西路3090号、3052号317-334室、349-364室、417室-434室',
                address: '昆山市巴城镇前进西路3090号、3052号',
                constructionUnit: '昆山云熙酒店管理有限公司',
                constructionUnits: '苏州黑斑马建设有限公司',
                approvalUnit: '昆山市行政审批局',
                designUnit: '上海传承博华建筑规划设计有限公司',
                surveyUnit: '/',
                supervisionUnit: '/',
                totalLandArea: '12000',
                totalConstructionArea: '35000',
                projectCode: '2025-KS-001',
                landPlanningPermit: '32058320250001',
                approvalDoc: '昆行审[2025]10号',
                planningPermit: '建字第32058320250005号',
                constructionPermit: '320583202507070203',
                landUsePermit: '地字第32058320250002号',
                qualityMonitorNo: '250126',
                startDate: '2025-07-08',
                completionDate: '2027-07-07',
                retentionPeriod: '永久',
                archiveDate: '',
                transferUnit: '昆山云熙酒店管理有限公司',
                inputTime: '2025-10-13',
                totalVolumes: '5',
                textVolumes: '2',
                drawingVolumes: '3',
                totalPages: '580',
                drawingSheets: '120',
                photoSheets: '45',
                archiveNo: '',
                generalRegNo: '',
                archiveRegNo: '2025-0009',
                locationStart: 'K-01-01',
                locationEnd: 'K-01-05',
                projectManager: '张经理',
                handler: '李工',
                reviewer: '高兴全',
                inputter: '徐旋旋'
             });
        } else if (type === 'engineering' && !formData.name) {
             setFormData({
                name: data?.name || '18#楼',
                qualityMonitorNo: '250126',
                address: '同项目地址',
                constructionUnit: '苏州黑斑马建设有限公司',
                qualitySafetySupervisionUnit: '昆山市质安站',
                planningPermit: '建字第32058320250005号',
                area: '8500',
                height: '24.5',
                structureType: '框架结构',
                underGroundFloors: '1',
                aboveGroundFloors: '6',
                cost: '2980',
                startDate: '2025-07-08',
                completionDate: '2027-07-07',
                settlement: '',
                volumeCount: '2',
                textVolumes: '1',
                drawingVolumes: '1',
                textPages: '150',
                drawingSheets: '40',
                photoSheets: '20',
                baseDrawingSheets: '0',
                audioTapes: '0',
                videoTapes: '0',
                cds: '0',
                microfilm: '0',
                archiveNo: '',
                generalRegNo: '',
                retentionPeriod: '永久',
                archiveDate: '',
                locationStart: 'K-01-01',
                locationEnd: 'K-01-02',
                securityLevel: '内部',
                transferUnit: '昆山云熙酒店管理有限公司',
                inputter: '徐旋旋',
                inputTime: '2025-10-13'
             });
        } else if (type === 'volume' && !formData.title) {
            setFormData({
                title: data?.title || '建筑设计说明及图纸目录',
                author: '上海传承博华建筑规划设计有限公司',
                archiveDate: '',
                carrierType: '纸质',
                startDate: '2025-01-01',
                endDate: '2025-06-30',
                archiveNo: '',
                pages: '', // In volume pages
                retentionPeriod: '永久',
                categorySerialNo: 'A-01',
                boxSpec: '2cm',
                keywords: '图纸, 设计说明',
                remark: '',
                organizer: '徐旋旋',
                organizeDate: '2025-09-01',
                volumeType: '图纸卷',
                reviewer: '高兴全',
                reviewTime: '2025-09-05',
                totalPages: '80', // Auto sum
                unit: '张',
                textPages: '10',
                drawingSheets: '70',
                photoSheets: '0',
                fileCount: data?.fileCount || 15,
                audioTapes: '0',
                other: ''
            });
        } else if (type === 'file' && !formData.name) {
            setFormData({
                name: data?.name || '一层平面图',
                author: data?.author || '上海传承博华建筑规划设计有限公司',
                startDate: data?.date || '2025-03-01',
                endDate: '',
                pages: data?.pages || '1',
                startPage: '1',
                endPage: '1',
                pageSequence: '1',
                retentionPeriod: '永久',
                securityLevel: '内部',
                unit: '张',
                archiveNo: '',
                docNo: 'J-01',
                microfilmNo: '',
                spec: 'A1',
                carrierType: '纸质',
                keywords: '平面图',
                abstract: '',
                transferUnit: '昆山云熙酒店管理有限公司',
                inputter: 'admin',
                inputTime: '2025-11-28',
                remark: ''
            });
        } else {
            setFormData(data || {});
        }
    }, [data, type]);

    if (!isOpen) return null;

    // --- Helper Components ---
    const renderLabel = (label: string, required?: boolean) => (
        <label className="text-xs font-bold text-slate-600 h-full flex items-center justify-end pr-3 select-none text-right w-full leading-tight">
            {required && <span className="text-red-500 mr-1">*</span>}
            {label}
        </label>
    );

    const renderInput = (key: string, placeholder: string = "") => (
        <input
            type="text"
            className="w-full h-[32px] border border-slate-200 rounded px-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors placeholder-gray-300 bg-white"
            placeholder={placeholder}
            value={formData[key] || ''}
            onChange={e => setFormData({...formData, [key]: e.target.value})}
        />
    );

    const renderDateInput = (key: string, placeholder: string = "选择日期") => (
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <input
                type="text"
                className="w-full h-[32px] border border-slate-200 rounded pl-8 pr-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors bg-white placeholder-gray-300"
                value={formData[key] || ''}
                onChange={e => setFormData({...formData, [key]: e.target.value})}
                placeholder={placeholder}
            />
        </div>
    );

    const renderSelect = (key: string, options: string[], label?: string) => (
        <select
            className="w-full h-[32px] border border-slate-200 rounded px-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none bg-white text-slate-700"
            value={formData[key] || ''}
            onChange={e => setFormData({...formData, [key]: e.target.value})}
            title={label || key}
        >
            <option value="">请选择</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    );

    const Field = ({ label, required, children, colSpan = 1 }: any) => (
        <div className={`col-span-${colSpan} flex items-center`}>
            <div className="w-[110px] shrink-0">{renderLabel(label, required)}</div>
            <div className="flex-1 min-w-0">{children}</div>
        </div>
    );

    const SectionHeader = ({ title }: { title: string }) => (
        <div className="col-span-4 mt-2 mb-1 border-b border-slate-100 pb-1">
            <span className="text-xs font-bold text-primary bg-blue-50 px-2 py-0.5 rounded">{title}</span>
        </div>
    );

    // --- Forms ---

    const renderProjectForm = () => (
        <div className="grid grid-cols-4 gap-y-3 gap-x-4 p-6">
            <SectionHeader title="项目基本信息" />
            <Field label="项目名称" required colSpan={2}>{renderInput('name')}</Field>
            <Field label="项目地点" required colSpan={2}>{renderInput('address')}</Field>
            
            <Field label="建设单位" required colSpan={2}>{renderInput('constructionUnit')}</Field>
            <Field label="施工单位" required colSpan={2}>{renderInput('constructionUnits')}</Field>
            
            <Field label="立项审批单位">{renderInput('approvalUnit')}</Field>
            <Field label="设计单位">{renderInput('designUnit')}</Field>
            <Field label="勘察单位">{renderInput('surveyUnit')}</Field>
            <Field label="监理单位">{renderInput('supervisionUnit')}</Field>
            
            <Field label="总用地面积(m²)">{renderInput('totalLandArea')}</Field>
            <Field label="总建筑面积(m²)">{renderInput('totalConstructionArea')}</Field>
            <Field label="工程代码">{renderInput('projectCode')}</Field>
            <Field label="用地规划许可证号">{renderInput('landPlanningPermit')}</Field>

            <SectionHeader title="行政管理信息" />
            <Field label="立项批准文号">{renderInput('approvalDoc')}</Field>
            <Field label="工程规划许可证号">{renderInput('planningPermit')}</Field>
            <Field label="施工许可证号">{renderInput('constructionPermit')}</Field>
            <Field label="用地许可证号">{renderInput('landUsePermit')}</Field>
            <Field label="质监号">{renderInput('qualityMonitorNo')}</Field>
            <div className="col-span-3"></div>

            <SectionHeader title="项目周期信息" />
            <Field label="开工日期">{renderDateInput('startDate')}</Field>
            <Field label="竣工日期">{renderDateInput('completionDate')}</Field>
            <Field label="保管期限">{renderSelect('retentionPeriod', ['永久', '长期', '短期'])}</Field>
            <Field label="进馆日期">{renderDateInput('archiveDate')}</Field>
            <Field label="移交单位">{renderInput('transferUnit')}</Field>
            <Field label="录入时间">{renderDateInput('inputTime')}</Field>
            <div className="col-span-2"></div>

            <SectionHeader title="档案管理信息" />
            <Field label="总卷数" required>{renderInput('totalVolumes', '自动计算')}</Field>
            <Field label="文字卷">{renderInput('textVolumes')}</Field>
            <Field label="图纸卷">{renderInput('drawingVolumes')}</Field>
            <div className="col-span-1"></div>
            
            <Field label="总页数">{renderInput('totalPages')}</Field>
            <Field label="图纸张">{renderInput('drawingSheets')}</Field>
            <Field label="照片张">{renderInput('photoSheets')}</Field>
            <div className="col-span-1"></div>

            <Field label="档号">{renderInput('archiveNo')}</Field>
            <Field label="总登记号">{renderInput('generalRegNo')}</Field>
            <Field label="档案登记号">{renderInput('archiveRegNo')}</Field>
            <div className="col-span-1"></div>
            
            <Field label="存放位置起号">{renderInput('locationStart')}</Field>
            <Field label="存放位置止号">{renderInput('locationEnd')}</Field>
            <div className="col-span-2"></div>

            <SectionHeader title="责任主体信息" />
            <Field label="项目负责人">{renderInput('projectManager')}</Field>
            <Field label="经办人">{renderInput('handler')}</Field>
            <Field label="审核人">{renderInput('reviewer')}</Field>
            <Field label="录入人">{renderInput('inputter')}</Field>
        </div>
    );

    const renderEngineeringForm = () => (
        <div className="grid grid-cols-4 gap-y-3 gap-x-4 p-6">
            <SectionHeader title="工程基本信息" />
            <Field label="工程名称" required colSpan={2}>{renderInput('name')}</Field>
            <Field label="工程地点" required colSpan={2}>{renderInput('address')}</Field>
            
            <Field label="质监号" required>{renderInput('qualityMonitorNo')}</Field>
            <Field label="规划许可证号" required>{renderInput('planningPermit')}</Field>
            <Field label="施工单位" required colSpan={2}>{renderInput('constructionUnit')}</Field>

            <Field label="监督机构">{renderInput('qualitySafetySupervisionUnit')}</Field>
            <Field label="建筑面积(m²)" required>{renderInput('area')}</Field>
            <Field label="高度(m)" required>{renderInput('height')}</Field>
            <Field label="结构类型" required>{renderInput('structureType')}</Field>

            <Field label="地下层数" required>{renderInput('underGroundFloors')}</Field>
            <Field label="地上层数" required>{renderInput('aboveGroundFloors')}</Field>
            <Field label="工程造价(万)" required>{renderInput('cost')}</Field>
            <Field label="工程结算(万)">{renderInput('settlement')}</Field>

            <Field label="开工日期" required>{renderDateInput('startDate')}</Field>
            <Field label="竣工日期" required>{renderDateInput('completionDate')}</Field>
            <div className="col-span-2"></div>

            <SectionHeader title="档案实体信息" />
            <Field label="案卷数">{renderInput('volumeCount', '自动累计')}</Field>
            <Field label="文字卷" required>{renderInput('textVolumes')}</Field>
            <Field label="图纸卷" required>{renderInput('drawingVolumes')}</Field>
            <div className="col-span-1"></div>

            <Field label="文字页数">{renderInput('textPages')}</Field>
            <Field label="图纸张数">{renderInput('drawingSheets')}</Field>
            <Field label="照片张数">{renderInput('photoSheets')}</Field>
            <Field label="底图张数">{renderInput('baseDrawingSheets')}</Field>

            <Field label="录音带(盒)">{renderInput('audioTapes')}</Field>
            <Field label="录像带(盒)">{renderInput('videoTapes')}</Field>
            <Field label="光盘(张)">{renderInput('cds')}</Field>
            <Field label="微缩片(盒)">{renderInput('microfilm')}</Field>

            <SectionHeader title="保管与存放信息" />
            <Field label="档号">{renderInput('archiveNo')}</Field>
            <Field label="总登记号">{renderInput('generalRegNo')}</Field>
            <Field label="保管期限">{renderSelect('retentionPeriod', ['永久', '长期', '短期'])}</Field>
            <Field label="进馆日期">{renderDateInput('archiveDate')}</Field>
            
            <Field label="存放起号">{renderInput('locationStart')}</Field>
            <Field label="存放止号">{renderInput('locationEnd')}</Field>
            <Field label="密级">{renderSelect('securityLevel', ['公开', '内部', '秘密', '机密'])}</Field>
            <div className="col-span-1"></div>

            <SectionHeader title="责任与流程信息" />
            <Field label="移交单位">{renderInput('transferUnit')}</Field>
            <Field label="录入人">{renderInput('inputter')}</Field>
            <Field label="录入日期">{renderDateInput('inputTime')}</Field>
            <div className="col-span-1"></div>
        </div>
    );

    const renderVolumeForm = () => (
        <div className="grid grid-cols-4 gap-y-3 gap-x-4 p-6">
            <SectionHeader title="案卷基本信息" />
            <Field label="案卷题名" required colSpan={2}>{renderInput('title')}</Field>
            <Field label="编制单位">{renderInput('author')}</Field>
            <Field label="案卷档号">{renderInput('archiveNo')}</Field>

            <Field label="进馆日期">{renderDateInput('archiveDate')}</Field>
            <Field label="载体类型">{renderInput('carrierType')}</Field>
            <Field label="卷内起始日期">{renderDateInput('startDate')}</Field>
            <Field label="卷内截止日期">{renderDateInput('endDate')}</Field>

            <SectionHeader title="档案实体信息" />
            <Field label="保管期限">{renderSelect('retentionPeriod', ['永久', '长期', '短期'])}</Field>
            <Field label="大类流水号">{renderInput('categorySerialNo')}</Field>
            <Field label="盒子规格">{renderSelect('boxSpec', ['1.5cm', '2cm', '3cm', '4cm', '5cm'])}</Field>
            <Field label="卷内页数">{renderInput('pages')}</Field>
            
            <Field label="主题词" colSpan={4}>{renderInput('keywords')}</Field>
            <div className="col-span-4 flex items-start">
                <div className="w-[110px] shrink-0 pt-2">{renderLabel("附注")}</div>
                <textarea 
                    className="flex-1 h-14 border border-slate-200 rounded p-2 text-sm focus:ring-1 focus:ring-primary outline-none resize-none placeholder-gray-300"
                    value={formData.remark || ''}
                    onChange={e => setFormData({...formData, remark: e.target.value})}
                    title="附注"
                    placeholder="输入附注"
                ></textarea>
            </div>

            <SectionHeader title="整理与审核信息" />
            <Field label="整理人">{renderInput('organizer')}</Field>
            <Field label="整理日期">{renderDateInput('organizeDate')}</Field>
            <Field label="案卷类型">{renderInput('volumeType')}</Field>
            <div className="col-span-1"></div>
            
            <Field label="审核人">{renderInput('reviewer')}</Field>
            <Field label="审核日期">{renderDateInput('reviewTime')}</Field>
            <div className="col-span-2"></div>

            <SectionHeader title="文件统计信息" />
            <Field label="总页数" required>{renderInput('totalPages', '自动计算')}</Field>
            <Field label="单位">{renderInput('unit')}</Field>
            <Field label="文件数量">{renderInput('fileCount')}</Field>
            <div className="col-span-1"></div>

            <Field label="文字页数" required>{renderInput('textPages')}</Field>
            <Field label="图纸张数" required>{renderInput('drawingSheets')}</Field>
            <Field label="照片张数" required>{renderInput('photoSheets')}</Field>
            <div className="col-span-1"></div>

            <Field label="录音带(盒)">{renderInput('audioTapes')}</Field>
            <Field label="其他载体">{renderInput('other')}</Field>
            <div className="col-span-2"></div>
        </div>
    );

    const renderFileForm = () => (
        <div className="grid grid-cols-4 gap-y-3 gap-x-4 p-6">
            <SectionHeader title="文件基本信息" />
            <Field label="文件题名" required colSpan={2}>{renderInput('name')}</Field>
            <Field label="责任者">{renderInput('author')}</Field>
            <Field label="页数">{renderInput('pages')}</Field>
            
            <Field label="形成起始日期">{renderDateInput('startDate')}</Field>
            <Field label="形成截止日期">{renderDateInput('endDate')}</Field>
            <Field label="起始页">{renderInput('startPage')}</Field>
            <Field label="结束页">{renderInput('endPage')}</Field>

            <Field label="页次">{renderInput('pageSequence', '自动计算')}</Field>
            <Field label="保管期限">{renderSelect('retentionPeriod', ['永久', '长期', '短期'])}</Field>
            <Field label="密级">{renderSelect('securityLevel', ['公开', '内部', '秘密'])}</Field>
            <Field label="单位">{renderInput('unit')}</Field>

            <SectionHeader title="文件实体信息" />
            <Field label="文件档号">{renderInput('archiveNo')}</Field>
            <Field label="文图号">{renderInput('docNo')}</Field>
            <Field label="微缩号">{renderInput('microfilmNo')}</Field>
            <Field label="规格">{renderInput('spec')}</Field>
            
            <Field label="载体类型">{renderInput('carrierType')}</Field>
            <Field label="主题词" colSpan={3}>{renderInput('keywords')}</Field>
            
            <div className="col-span-4 flex items-start mt-2">
                <div className="w-[110px] shrink-0 pt-2">{renderLabel("摘要")}</div>
                <textarea 
                    className="flex-1 h-14 border border-slate-200 rounded p-2 text-sm focus:ring-1 focus:ring-primary outline-none resize-none placeholder-gray-300"
                    value={formData.abstract || ''}
                    onChange={e => setFormData({...formData, abstract: e.target.value})}
                    title="摘要"
                    placeholder="输入摘要"
                ></textarea>
            </div>

            <SectionHeader title="管理与流程信息" />
            <Field label="移交单位">{renderInput('transferUnit')}</Field>
            <Field label="录入人">{renderInput('inputter')}</Field>
            <Field label="录入日期">{renderDateInput('inputTime')}</Field>
            <div className="col-span-1"></div>

            <div className="col-span-4 flex items-start mt-2">
                <div className="w-[110px] shrink-0 pt-2">{renderLabel("附注")}</div>
                <textarea 
                    className="flex-1 h-14 border border-slate-200 rounded p-2 text-sm focus:ring-1 focus:ring-primary outline-none resize-none placeholder-gray-300"
                    value={formData.remark || ''}
                    onChange={e => setFormData({...formData, remark: e.target.value})}
                    title="附注"
                    placeholder="输入附注"
                ></textarea>
            </div>
        </div>
    );

    const getTitle = () => {
        switch(type) {
            case 'project': return '项目级元数据 (工程级著录)';
            case 'engineering': return '工程级元数据 (单位工程著录)';
            case 'volume': return '案卷级元数据 (案卷著录)';
            case 'file': return '文件级元数据 (文件著录)';
            default: return '元数据编辑';
        }
    }

    const getIcon = () => {
         switch(type) {
            case 'project': return <Box className="w-5 h-5 mr-2 text-primary" />;
            case 'engineering': return <Building className="w-5 h-5 mr-2 text-primary" />;
            case 'volume': return <Folder className="w-5 h-5 mr-2 text-primary" />;
            case 'file': return <FileText className="w-5 h-5 mr-2 text-primary" />;
            default: return null;
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
            <div className="bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 w-[1100px] max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
                    <div className="flex items-center text-lg font-bold text-slate-800">
                        {getIcon()}
                        {getTitle()}
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors" title="关闭">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto">
                    {type === 'project' && renderProjectForm()}
                    {type === 'engineering' && renderEngineeringForm()}
                    {type === 'volume' && renderVolumeForm()}
                    {type === 'file' && renderFileForm()}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
                    <button 
                        onClick={onClose} 
                        className="px-5 py-2 border border-slate-200 rounded text-sm text-slate-600 hover:bg-white transition-colors"
                    >
                        取消
                    </button>
                    <button 
                        onClick={onClose} 
                        className="px-6 py-2 bg-primary text-white rounded text-sm hover:bg-primary-hover shadow-sm flex items-center"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        保存更改
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MetadataModal;
