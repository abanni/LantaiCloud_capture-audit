import { Project } from '../types';

export interface ProjectMessage {
  id: string;
  title: string;
  content: string;
  isRead: boolean;
  operationTime: string;
}

// 按项目 ID 组织消息
const MOCK_MESSAGES: Record<string, ProjectMessage[]> = {
  '1': [
    { id: 'm1_1', title: '归档、组卷审核', content: '归档组卷档案入库审核结果：通过', isRead: false, operationTime: '2025-10-13 10:41:14' },
    { id: 'm1_2', title: '归档、组卷审核', content: '归档组卷馆藏复审核结果：通过', isRead: false, operationTime: '2025-09-19 14:50:18' },
    { id: 'm1_3', title: '归档、组卷审核', content: '归档组卷馆藏复审核结果：通过', isRead: false, operationTime: '2025-09-19 14:10:54' },
    { id: 'm1_4', title: '归档、组卷审核', content: '归档组卷管理复审核结果：通过', isRead: false, operationTime: '2025-09-19 09:28:07' },
    { id: 'm1_5', title: '归档、组卷审核', content: '归档组卷业务复审核结果：通过', isRead: false, operationTime: '2025-09-19 09:24:51' },
    { id: 'm1_6', title: '归档、组卷审核', content: '归档组卷接收登记审核结果：通过', isRead: false, operationTime: '2025-09-19 09:24:38' },
    { id: 'm1_7', title: '归档、组卷审核', content: '归档组卷科初审核结果：通过', isRead: false, operationTime: '2025-09-17 14:01:05' },
    { id: 'm1_8', title: '归档、组卷审核', content: '归档组卷窗口初审核结果：通过', isRead: false, operationTime: '2025-09-17 11:21:13' },
    { id: 'm1_9', title: '归档、组卷审核提交', content: '归档、组卷审核提交', isRead: false, operationTime: '2025-09-17 11:10:07' },
    { id: 'm1_10', title: '取消审核', content: '修改', isRead: false, operationTime: '2025-09-17 09:57:17' },
    { id: 'm1_11', title: '归档、组卷审核', content: '归档组卷科初审核结果：通过', isRead: true, operationTime: '2025-09-15 14:01:05' },
    { id: 'm1_12', title: '归档、组卷审核', content: '归档组卷窗口初审核结果：退回修改', isRead: true, operationTime: '2025-09-14 11:21:13' },
  ],
  '2': [
    { id: 'm2_1', title: '归档、组卷审核', content: '归档组卷档案入库审核结果：通过', isRead: false, operationTime: '2025-10-10 09:30:00' },
    { id: 'm2_2', title: '归一化核查', content: '著录端提交组卷数据，等待审核端归一化核查', isRead: false, operationTime: '2025-10-08 16:20:00' },
    { id: 'm2_3', title: '归档、组卷审核', content: '归档组卷管理复审核结果：通过', isRead: false, operationTime: '2025-10-05 11:15:00' },
    { id: 'm2_4', title: '承诺书审核', content: '建设工程报送责任承诺书已签章并获档案馆批准', isRead: true, operationTime: '2025-09-28 10:00:00' },
  ],
  '3': [
    { id: 'm3_1', title: '归档、组卷审核', content: '归档组卷窗口初审核结果：通过', isRead: false, operationTime: '2025-09-25 14:30:00' },
    { id: 'm3_2', title: '接收凭证签章', content: '档案馆已发起接收凭证签章，请建设单位确认签署', isRead: false, operationTime: '2025-09-24 10:15:00' },
  ],
  '5': [
    { id: 'm5_1', title: '承诺书审核', content: '建设工程报送责任承诺书已签章并获档案馆批准', isRead: true, operationTime: '2025-09-20 09:00:00' },
    { id: 'm5_2', title: '接收凭证签章', content: '档案馆已发起接收凭证签章，请建设单位确认签署', isRead: false, operationTime: '2025-09-24 10:15:00' },
  ],
};

export function getProjectMessages(projectId: string): ProjectMessage[] {
  return (MOCK_MESSAGES[projectId] || []).sort(
    (a, b) => new Date(b.operationTime).getTime() - new Date(a.operationTime).getTime()
  );
}

export function hasUnreadMessages(projectId: string): boolean {
  return (MOCK_MESSAGES[projectId] || []).some(m => !m.isRead);
}

export function getReceiptSignMessage(projectId: string): ProjectMessage | undefined {
  return (MOCK_MESSAGES[projectId] || []).find(
    m => m.title === '接收凭证签章' && !m.isRead
  );
}

export function markMessageAsRead(messageId: string): void {
  for (const projectId in MOCK_MESSAGES) {
    MOCK_MESSAGES[projectId] = MOCK_MESSAGES[projectId].map(m =>
      m.id === messageId ? { ...m, isRead: true } : m
    );
  }
}
