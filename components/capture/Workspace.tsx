
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { ArchiveProjectData, ArchiveLevel, ArchiveFile, ArchiveVolume } from '../../types';

import CloudDriveView from './workspace/Step1_CloudDrive';
import ClassificationView from './workspace/Step2_Classification';
import OrganizationView from './workspace/Step3_Organization';
import TransferAuditView from './workspace/Step4_Audit';
import MetadataModal from './workspace/MetadataModal';

// Mock Data for Step 3
const INITIAL_ARCHIVE_DATA: ArchiveProjectData = {
    id: 'PROJ-001',
    name: '昆山开发区城市广场地下主体工程',
    code: '32058320255074',
    units: [
        {
            id: 'UNIT-001',
            name: '18#楼',
            code: 'GC-01',
            volumes: [
                {
                    id: 'VOL-001',
                    title: '施工管理文件 (第一卷)',
                    archiveCode: 'A-01-01',
                    boxNumber: '001',
                    status: 'open',
                    fileCount: 3,
                    files: [
                        { id: 'F1', seq: 1, code: 'SG-001', name: '工程概况表', pages: 1, date: '2024-01-10', author: '中建三局' },
                        { id: 'F2', seq: 2, code: 'SG-002', name: '施工现场质量管理检查记录', pages: 2, date: '2024-01-12', author: '中建三局' },
                        { id: 'F3', seq: 3, code: 'SG-003', name: '施工许可证_副本', pages: 5, date: '2024-01-05', author: '住建局' },
                    ]
                },
                {
                    id: 'VOL-002',
                    title: '施工技术文件',
                    archiveCode: 'A-01-02',
                    boxNumber: '002',
                    status: 'open',
                    fileCount: 0,
                    files: []
                }
            ]
        }
    ]
};

type AuditStatus = 'idle' | 'submitted' | 'locked' | 'rejected' | 'approved';

const Workspace: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState((location.state as any)?.step || 1); 
    
    // Read preselected state unit filter if any
    const [filterUnitId, setFilterUnitId] = useState<string | null>((location.state as any)?.filterUnitId || null);
    const [filterUnitName, setFilterUnitName] = useState<string | null>((location.state as any)?.filterUnitName || null);

    // CORE STATE: Project Structure (Shared between Step 2 and 3)
    const [archiveData, setArchiveData] = useState<ArchiveProjectData>(INITIAL_ARCHIVE_DATA);

    // Step 3 Selection State
    const [selectedId, setSelectedId] = useState<string>('VOL-001'); 
    const [selectedType, setSelectedType] = useState<ArchiveLevel>('volume');
    
    // Metadata Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<ArchiveLevel>('volume'); 

    // Step 4 State
    const [auditStatus, setAuditStatus] = useState<AuditStatus>('idle');
    const [auditLogs, setAuditLogs] = useState<{date: string, action: string, desc: string}[]>([]);

    // --- Actions for Structure Management ---
    const addUnit = (name: string, code: string) => {
        const newUnit = {
            id: `UNIT-${Date.now()}`,
            name: name,
            code: code,
            volumes: []
        };
        setArchiveData(prev => ({
            ...prev,
            units: [...prev.units, newUnit]
        }));
    };

    const updateUnit = (id: string, name: string) => {
        setArchiveData(prev => ({
            ...prev,
            units: prev.units.map(u => u.id === id ? { ...u, name } : u)
        }));
    };

    const deleteUnit = (id: string) => {
        if(confirm("确定要删除该工程吗？删除后不可恢复。")) {
            setArchiveData(prev => ({
                ...prev,
                units: prev.units.filter(u => u.id !== id)
            }));
        }
    };

    const addVolume = (unitId: string, title: string) => {
        setArchiveData(prev => ({
            ...prev,
            units: prev.units.map(unit => {
                if (unit.id === unitId) {
                    const newVol: ArchiveVolume = {
                        id: `VOL-${Date.now()}`,
                        title: title,
                        archiveCode: '',
                        boxNumber: '',
                        status: 'open',
                        fileCount: 0,
                        files: []
                    };
                    return {
                        ...unit,
                        volumes: [...unit.volumes, newVol]
                    };
                }
                return unit;
            })
        }));
    };

    // Helper to update file list in current volume (Step 3)
    const updateVolumeFiles = (volId: string, newFiles: ArchiveFile[]) => {
        setArchiveData(prev => ({
            ...prev,
            units: prev.units.map(unit => ({
                ...unit,
                volumes: unit.volumes.map(vol => {
                    if (vol.id === volId) {
                        return {
                            ...vol,
                            files: newFiles,
                            fileCount: newFiles.length
                        };
                    }
                    return vol;
                })
            }))
        }));
    };

    const openMetadataModal = (type: ArchiveLevel) => {
        setModalType(type);
        setModalOpen(true);
    };

    const getSelectedObject = () => {
        if (selectedType === 'project') return archiveData;
        for (const unit of archiveData.units) {
            if (selectedType === 'engineering' && unit.id === selectedId) return unit;
            for (const vol of unit.volumes) {
                if (selectedType === 'volume' && vol.id === selectedId) return vol;
            }
        }
        return null;
    };

    return (
        <div className="flex flex-col h-screen bg-bg">
            {/* Header & Stepper */}
            <div className="h-[60px] bg-white border-b border-slate-200 flex items-center px-6 shadow-sm shrink-0 z-20">
                <div 
                    className="flex items-center text-slate-500 hover:text-slate-800 cursor-pointer mr-8"
                    onClick={() => navigate('/capture-dashboard')}
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">返回主页</span>
                </div>
                
                <div className="flex-1 flex justify-center">
                    <Stepper currentStep={currentStep} setStep={setCurrentStep} />
                </div>

                <div className="flex gap-3">
                    <button className="px-4 py-1.5 border border-slate-200 rounded text-sm text-slate-600 hover:border-slate-300 bg-white">
                        保存进度
                    </button>
                    {currentStep < 4 && (
                         <button 
                            className="px-4 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary-hover shadow-sm"
                            onClick={() => setCurrentStep(prev => prev + 1)}
                         >
                            {currentStep === 1 ? '下一步: 归档整理' : currentStep === 2 ? '下一步: 案卷整理' : '下一步: 档案审核'}
                        </button>
                    )}
                </div>
            </div>

            {/* Pre-filtered unit spotlight banner */}
            {filterUnitName && (
                <div className="bg-primary px-6 py-2.5 text-white text-xs font-semibold flex items-center justify-between shadow-md shrink-0 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-indigo-800 px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-widest text-indigo-200 animate-pulse">
                            UNIT SPOTLIGHT
                        </span>
                        <span>
                            当前处于 <strong>{filterUnitName}</strong> 的独立整理流转专属通道（在此执行 整理 ➜ 审核 ➜ 归档入库 循环）。
                        </span>
                    </div>
                    <button 
                        onClick={() => { setFilterUnitId(null); setFilterUnitName(null); }}
                        className="bg-white/10 hover:bg-white/20 active:bg-white/30 px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="清除关联单元过滤器，返回建设项目全局视角"
                    >
                        <span>清除过滤</span>
                        <span>✕</span>
                    </button>
                </div>
            )}

            {/* Body Content Switched by Step */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {currentStep === 1 ? (
                    <CloudDriveView />
                ) : currentStep === 2 ? (
                    <ClassificationView 
                        archiveData={archiveData}
                        onAddUnit={addUnit}
                        onUpdateUnit={updateUnit}
                        onDeleteUnit={deleteUnit}
                    />
                ) : currentStep === 3 ? (
                    <OrganizationView 
                        data={archiveData}
                        selectedId={selectedId}
                        selectedType={selectedType}
                        onSelect={(id: string, type: ArchiveLevel) => { setSelectedId(id); setSelectedType(type); }}
                        updateFiles={updateVolumeFiles}
                        onEditMetadata={openMetadataModal}
                        onAddVolume={addVolume}
                    />
                ) : (
                    <TransferAuditView 
                        status={auditStatus}
                        setStatus={setAuditStatus}
                        logs={auditLogs}
                        setLogs={setAuditLogs}
                        onBackToEdit={() => setCurrentStep(3)}
                    />
                )}
            </div>

            {/* Metadata Modal */}
            {modalOpen && (
                <MetadataModal 
                    isOpen={modalOpen} 
                    onClose={() => setModalOpen(false)} 
                    type={modalType}
                    data={getSelectedObject()}
                />
            )}
        </div>
    );
};

const Stepper = ({ currentStep, setStep }: { currentStep: number, setStep: (s: number) => void }) => {
    const steps = ['云盘收集', '归档整理', '案卷整理', '移交审核'];
    return (
        <div className="flex items-center">
            {steps.map((label, idx) => {
                const stepNum = idx + 1;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;
                return (
                    <React.Fragment key={idx}>
                        <div className={`flex items-center cursor-pointer ${isActive ? 'text-primary font-bold' : isCompleted ? 'text-primary' : 'text-slate-400'}`} onClick={() => setStep(stepNum)}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 border ${isActive ? 'bg-primary text-white border-primary' : isCompleted ? 'bg-white text-primary border-primary' : 'bg-white text-slate-400 border-slate-200'}`}>{isCompleted ? <Check className="w-3 h-3" /> : stepNum}</div>
                            <span>{label}</span>
                        </div>
                        {idx < steps.length - 1 && (<div className={`w-12 h-[1px] mx-4 ${isCompleted ? 'bg-primary' : 'bg-slate-300'}`}></div>)}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Workspace;
