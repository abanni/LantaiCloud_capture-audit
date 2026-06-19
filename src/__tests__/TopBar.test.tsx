import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import TopBar from '../../components/common/TopBar';

// Mock UserSwitcher since it has complex internal state
vi.mock('../../components/common/UserSwitcher', () => ({
  default: ({ identity }: any) => <div data-testid="user-switcher">{identity.user.name}</div>
}));

describe('TopBar', () => {
  const defaultProps = {
    identity: {
      id: 'identity-1',
      user: { id: 'u1', name: '张三', role: 'admin', email: 'test@test.com', avatarBg: '#1890ff', joinDate: '2026-01-01', status: 'active' as const },
            organization: { id: 'org_test', name: '无无科技', type: 'ENTERPRISE' as const },
      role: '管理员'
    },
    title: '档案审核'
  };

  it('renders the page title', () => {
    render(
      <HashRouter>
        <TopBar {...defaultProps} />
      </HashRouter>
    );
    expect(screen.getByText('档案审核')).toBeInTheDocument();
  });

  it('renders UserSwitcher', () => {
    render(
      <HashRouter>
        <TopBar {...defaultProps} />
      </HashRouter>
    );
    expect(screen.getByTestId('user-switcher')).toBeInTheDocument();
    expect(screen.getByTestId('user-switcher')).toHaveTextContent('张三');
  });
});
