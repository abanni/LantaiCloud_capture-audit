import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import ProjectsList from '../../components/integrator/ProjectsList';

// Mock UserSwitcher
vi.mock('../../components/common/UserSwitcher', () => ({
  default: ({ identity }: any) => <div data-testid="user-switcher-mock">{identity.user.name}</div>
}));

// Mock child modals
vi.mock('../../components/integrator/modals/CommitmentSigningModal', () => ({
  default: ({ isOpen }: any) => isOpen ? <div data-testid="commitment-modal">承诺书</div> : null
}));

vi.mock('../../components/integrator/modals/DeleteProjectModal', () => ({
  default: ({ isOpen }: any) => isOpen ? <div data-testid="delete-modal">删除</div> : null
}));

vi.mock('../../components/integrator/modals/UnitEngineeringManager', () => ({
  default: ({ isOpen }: any) => isOpen ? <div data-testid="unit-modal">单位工程管理</div> : null
}));

describe('ProjectsList', () => {
  const mockProject = {
    id: '1',
    name: '测试项目',
    status: 'processing' as const,
    progress: 50,
    stage: '创建中',
    tags: ['测试'],
    issues: [],
    organizationId: 'org_test',
    isManaged: true,
    memberCount: 2,
    isCommitmentSigned: false,
    isCommitmentApproved: false,
    archiveName: '测试档案馆',
    archiveType: '建设工程-房屋建筑',
    units: [
      { id: 'u-1', name: '单位工程1', code: 'TEST-001', volumes: [], stage: '整理中' as const, progress: 30 }
    ]
  };

  const defaultProps = {
    identity: {
      id: 'identity-1',
      user: { id: 'u1', name: '张三', role: 'admin', email: 'test@test.com', avatarBg: '#1890ff', joinDate: '2026-01-01', status: 'active' as const },
            organization: { id: 'org_test', name: '无无科技', type: 'ENTERPRISE' as const },
      role: '管理员'
    },
    identities: [],
    setCurrentIdentity: vi.fn(),
    projects: [mockProject],
    setProjects: vi.fn()
  };

  it('renders the table with project data', () => {
    render(
      <HashRouter>
        <ProjectsList {...defaultProps} />
      </HashRouter>
    );
    expect(screen.getByText('测试项目')).toBeInTheDocument();
  });

  it('renders tab filters', () => {
    render(
      <HashRouter>
        <ProjectsList {...defaultProps} />
      </HashRouter>
    );
    // Tab text uses format like "全部关联项目(1)" or "全部关联项目(0)"
    expect(screen.getByText(/全部关联项目/)).toBeInTheDocument();
    expect(screen.getByText(/我管理/)).toBeInTheDocument();
    expect(screen.getByText(/我参与/)).toBeInTheDocument();
  });

  it('shows "继续创建" button for projects in "创建中" stage', () => {
    render(
      <HashRouter>
        <ProjectsList {...defaultProps} />
      </HashRouter>
    );
    expect(screen.getByText('继续创建')).toBeInTheDocument();
  });

  it('filters projects by search term', () => {
    render(
      <HashRouter>
        <ProjectsList {...defaultProps} />
      </HashRouter>
    );
    const searchInput = screen.getByPlaceholderText('检索项目名称、许可证、建设单位...');
    fireEvent.change(searchInput, { target: { value: '不存在的项目' } });
    // After filtering with no match, the empty state should show
    expect(screen.getByText(/暂无满足筛选条件的档案项目/i)).toBeInTheDocument();
  });
});
