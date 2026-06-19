import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Building2 } from 'lucide-react';
import { ArchiveTenant } from '../../types';

interface ArchiveSwitcherProps {
    archives: ArchiveTenant[];
    currentArchiveId: string;
    onSwitch: (id: string) => void;
}

const ArchiveSwitcher: React.FC<ArchiveSwitcherProps> = ({
    archives,
    currentArchiveId,
    onSwitch,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const current = archives.find(a => a.id === currentArchiveId) || archives[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-50 px-2.5 py-1.5 rounded-lg transition-all border border-slate-200 shadow-sm hover:border-slate-200 text-left cursor-pointer outline-none"
            >
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate">
                    {current.name}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        切换档案馆
                    </div>
                    <div className="p-1 space-y-0.5">
                        {archives.map((archive) => (
                            <button
                                key={archive.id}
                                onClick={() => {
                                    onSwitch(archive.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-left transition-colors cursor-pointer ${
                                    archive.id === currentArchiveId
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                    archive.id === 'default'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-amber-100 text-amber-600'
                                }`}>
                                    {archive.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="truncate">{archive.name}</div>
                                    <div className="text-[9px] text-slate-400 font-medium">
                                        {archive.id === 'default' ? 'SaaS 通用' : archive.region}
                                    </div>
                                </div>
                                {archive.id === currentArchiveId && (
                                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArchiveSwitcher;
