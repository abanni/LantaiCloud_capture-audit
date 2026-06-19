import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Sidebar', () => {
  const defaultProps = {
    identity: {
      id: 'identity-1',
      user: { id: 'u1', name: '测试用户', role: 'admin', email: 'test@test.com', avatarBg: '#1890ff', joinDate: '2026-01-01', status: 'active' as const },
            organization: { id: 'org_test', name: '无无科技', type: 'ENTERPRISE' as const },
      role: '管理员'
    },
    onSwitchIdentity: vi.fn(),
    currentPath: '/dashboard'
  };

  it('renders sidebar with organization name', () => {
    render(
      <HashRouter>
        <Sidebar {...defaultProps} />
      </HashRouter>
    );
    expect(screen.getByText('无无科技')).toBeInTheDocument();
  });

  it('renders main navigation items', () => {
    render(
      <HashRouter>
        <Sidebar {...defaultProps} />
      </HashRouter>
    );
    expect(screen.getByText('主页')).toBeInTheDocument();
    expect(screen.getByText('档案著录')).toBeInTheDocument();
  });

  it('renders the logo', () => {
    render(
      <HashRouter>
        <Sidebar {...defaultProps} />
      </HashRouter>
    );
    const logo = screen.getByAltText('兰台云 Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.svg');
  });
});
