import React from 'react';
import { Bell } from 'lucide-react';
import { Identity, ArchiveTenant } from '../../types';
import UserSwitcher from './UserSwitcher';
import ArchiveSwitcher from './ArchiveSwitcher';

interface TopBarProps {
    title: string;
    identity: Identity;
    identities?: Identity[];
    setCurrentIdentity?: (identity: Identity) => void;
    showNotification?: boolean;
    hasUnread?: boolean;
    onNotificationClick?: () => void;
    archives?: ArchiveTenant[];
    currentArchiveId?: string;
    onArchiveSwitch?: (id: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({
    title,
    identity,
    identities,
    setCurrentIdentity,
    showNotification = false,
    hasUnread = false,
    onNotificationClick,
    archives = [],
    currentArchiveId = 'default',
    onArchiveSwitch,
}) => {
    return (
        <header className="h-14 bg-white border-b border-border flex items-center justify-between px-5 shrink-0 sticky top-0 z-10">
            <h1 className="text-sm font-bold text-text-primary">{title}</h1>
            <div className="flex items-center gap-2">
                <ArchiveSwitcher
                    archives={archives}
                    currentArchiveId={currentArchiveId}
                    onSwitch={onArchiveSwitch || (() => {})}
                />
                {showNotification && (
                    <button
                        onClick={onNotificationClick}
                        className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-primary"
                    >
                        <Bell className="w-4.5 h-4.5" />
                        {hasUnread && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-white" />
                        )}
                    </button>
                )}
                <UserSwitcher
                    identity={identity}
                    identities={identities || []}
                    setCurrentIdentity={setCurrentIdentity || (() => {})}
                />
            </div>
        </header>
    );
};

export default TopBar;
