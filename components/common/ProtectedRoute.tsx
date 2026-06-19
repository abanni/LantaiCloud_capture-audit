import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    /** If true, only show when user has an organization context */
    requiresOrganization?: boolean;
    /** If set, user's role must match one of these */
    allowedRoles?: string[];
    /** Fallback path when not authorized. Defaults to '/capture-dashboard' */
    fallback?: string;
}

/**
 * Route guard component that checks:
 * 1. Authentication (always required)
 * 2. Organization context (optional, for org-only pages)
 * 3. Role-based access (optional, for specific roles)
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiresOrganization = false,
    allowedRoles,
    fallback = '/capture-dashboard',
}) => {
    const { state } = useApp();
    const { isAuthenticated, currentIdentity } = state;

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (requiresOrganization && !currentIdentity?.organization) {
        return <Navigate to={fallback} replace />;
    }

    if (allowedRoles && currentIdentity && !allowedRoles.includes(currentIdentity.role)) {
        return <Navigate to={fallback} replace />;
    }

    return <>{children}</>;
};

/**
 * Higher-order component wrapper for ProtectedRoute.
 */
export const withProtection = <P extends object>(
    Component: React.ComponentType<P>,
    options?: Omit<ProtectedRouteProps, 'children'>
): React.FC<P> => {
    const Wrapped: React.FC<P> = (props) => (
        <ProtectedRoute {...options}>
            <Component {...props} />
        </ProtectedRoute>
    );
    Wrapped.displayName = `withProtection(${Component.displayName || Component.name || 'Component'})`;
    return Wrapped;
};

export default ProtectedRoute;
