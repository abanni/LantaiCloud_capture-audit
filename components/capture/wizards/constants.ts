import { Building2, Landmark, Video, BookOpen, Microscope, Calculator } from 'lucide-react';

export const EXTERNAL_ARCHIVES = [
    { id: 'ks-urban', name: '昆山市城建档案馆', reviewer: '昆山/徐琴', region: '昆山', code: '320583' },
    { id: 'cs-urban', name: '常熟市城市建设档案馆', reviewer: '常熟/袁翔', region: '常熟', code: '320581' },
];

export interface ArchiveType {
    id: string;
    label: string;
    sub: string;
    icon: any;
    color: string;
    bg: string;
    children?: { id: string; label: string }[];
}

export const ARCHIVE_TYPES: ArchiveType[] = [
    {
        id: 'construction',
        label: '建设工程档案',
        sub: '房屋建筑、市政公用、市政配套',
        icon: Building2,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        children: [
            { id: 'housing', label: '房屋建筑工程' },
            { id: 'municipal_public', label: '市政公用工程' },
            { id: 'municipal_support', label: '市政配套工程' },
            { id: 'transport', label: '交通运输工程' }
        ]
    },
    {
        id: 'management',
        label: '建设管理档案',
        sub: '招投标、质量监督、园林、村镇',
        icon: Landmark,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        children: [
            { id: 'bidding', label: '招投标档案' },
            { id: 'quality', label: '质量监督档案' },
            { id: 'garden', label: '园林绿化档案' },
            { id: 'village', label: '村镇建设档案' }
        ]
    },
    { id: 'media', label: '声像档案', sub: '工程照片、录音、录像', icon: Video, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'admin', label: '文书档案', sub: '行政文书、党务文书', icon: BookOpen, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'tech', label: '科技档案', sub: '科研项目、设备仪器', icon: Microscope, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: 'account', label: '会计档案', sub: '会计凭证、会计账簿', icon: Calculator, color: 'text-pink-600', bg: 'bg-pink-50' },
];
