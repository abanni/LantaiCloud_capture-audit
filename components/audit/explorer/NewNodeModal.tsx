import React from 'react';

export interface NewNodeModalProps {
    open: boolean;
    mode: 'ACCEPTANCE' | 'RECEIPT';
    numberInput: string;
    setNumberInput: (val: string) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

/**
 * NewNodeModal — Flow action opinion modal for acceptance/receipt number input.
 * Extracted from the original ArchiveExplorer.tsx inline modal at lines 780-813.
 * To generalize into a "new folder/file" modal, swap the title/input-label props.
 */
export const NewNodeModal: React.FC<NewNodeModalProps> = ({
    open,
    mode,
    numberInput,
    setNumberInput,
    onConfirm,
    onCancel,
}) => {
    if (!open) return null;

    const title =
        mode === 'ACCEPTANCE' ? '生成易地建设审批意见书' : '生成档案接收电子证明联';
    const label =
        mode === 'ACCEPTANCE' ? '审核意见批复决文号' : '接收锁定证书散列号';
    const buttonLabel = '打引批复件';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-[360px] p-5 animate-in zoom-in-95 duration-150">
                <h3 className="text-sm font-bold mb-3 text-slate-800">{title}</h3>
                <div className="mb-5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        {label}
                    </label>
                    <input
                        type="text"
                        value={numberInput}
                        onChange={(e) => setNumberInput(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-800 bg-slate-50 focus:ring-1 focus:ring-blue-500 outline-none font-bold"
                        title={label}
                        placeholder={`请输入${label}`}
                    />
                </div>
                <div className="flex justify-end gap-2 text-xs">
                    <button
                        onClick={onCancel}
                        className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold"
                    >
                        取消
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow shadow-blue-100 cursor-pointer"
                    >
                        {buttonLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};
