
import React from 'react';
import { 
    Folder, FileText, Image as ImageIcon, FileSpreadsheet, FileType2 
} from 'lucide-react';

// Custom icons wrapper if needed, or direct usage
export const FileCheck = ({ className }: { className?: string }) => (
    <div className={`relative inline-block ${className}`}>
        <FileText className="w-full h-full" />
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full">
            <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
        </div>
    </div>
);

export const getFileIcon = (type: string, className?: string, isDoubleLayer?: boolean) => {
    if (isDoubleLayer) {
        // We use a composed icon or just color differentiation for Double Layer
        // For simplicity in this helper, using FileType2 with green color or specific check logic
        return <FileType2 className={`${className} text-green-500`} />;
    }
    switch (type) {
        case 'folder': return <Folder className={`${className} text-yellow-500`} />;
        case 'word': return <FileText className={`${className} text-blue-500`} />;
        case 'excel': return <FileSpreadsheet className={`${className} text-green-500`} />;
        case 'pdf': return <FileType2 className={`${className} text-red-500`} />;
        case 'cad': return <ImageIcon className={`${className} text-purple-500`} />;
        case 'ofd': return <FileText className={`${className} text-primary`} />;
        case 'image': return <ImageIcon className={`${className} text-purple-500`} />;
        default: return <FileText className={`${className} text-slate-400`} />;
    }
};
