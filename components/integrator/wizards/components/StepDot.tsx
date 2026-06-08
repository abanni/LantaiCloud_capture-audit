import React from 'react';

interface StepDotProps {
    number: number;
    label: string;
    active: boolean;
    current: boolean;
}

const StepDot: React.FC<StepDotProps> = ({ number, label, active, current }) => (
    <div className={`flex items-center ${active ? 'text-primary' : 'text-slate-400'}`}>
        <div className={`
            w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mr-2
            ${active ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'bg-slate-100 text-slate-400'}
        `}>
            {number}
        </div>
        <span className={`text-sm ${current ? 'font-bold text-slate-800' : 'font-medium'}`}>{label}</span>
    </div>
);

export default StepDot;
