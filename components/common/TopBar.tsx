import React from 'react';
import { Bell } from 'lucide-react';
import { Identity } from '../../types';
import UserSwitcher from './UserSwitcher';

interface TopBarProps {
    title: string;
    identity: Identity;
    identities?: Identity[];
    setCurrentIdentity?: (identity: Identity) => void;
    showNotification?: boolean;
    hasUnread?: boolean;
    onNotificationClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
    title,
    identity,
    identities,
    setCurrentIdentity,
    showNotification = false,
    hasUnread = false,
    onNotificationClick,
}) => {
    return (
        <div className="h-16 bg-white border-b border-slate-100 flex justify-between items-center px-6 shadow-sm shrink-0 sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <h1 className="text-base font-extrabold text-slate-800 tracking-tight">{title}</h1>
            </div>
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-4 text-gray-655">
                    {showNotification && (
                        <div
                            className="flex items-center cursor-pointer hover:text-primary relative p-1.5 rounded-full hover:bg-slate-50 transition-colors"
                            onClick={onNotificationClick}
                        >
                            <Bell className="w-5 h-5" />
                            {hasUnread && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </div>
                    )}
                    <UserSwitcher
                        identity={identity}
                        identities={identities || []}
                        setCurrentIdentity={setCurrentIdentity || (() => {})}
                    />
                </div>
            </div>
        </div>
    );
};

export default TopBar;
