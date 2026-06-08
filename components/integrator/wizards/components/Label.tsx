import React from 'react';

interface LabelProps {
    children: React.ReactNode;
    required?: boolean;
}

const Label: React.FC<LabelProps> = ({ children, required }) => (
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {required && <span className="text-red-500 mr-1">*</span>}
        {children}
    </label>
);

export default Label;
