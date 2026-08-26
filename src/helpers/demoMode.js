import { useLocation } from 'react-router';
import { useMemo } from 'react';

/**
 * Custom hook to determine if the app is running in demo mode.
 * Demo mode is activated when the URL contains a query parameter
 * `demo` (any truthy value, e.g. `?demo=maj-priznania`). It also falls back
 * to `localStorage` so the flag persists across navigation.
 */
export const useDemoMode = () => {
    const location = useLocation();

    const isDemo = useMemo(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('demo')) {
            localStorage.setItem('demoMode', 'true');
            return true;
        }
        return localStorage.getItem('demoMode') === 'true';
    }, [location.search]);

    return isDemo;
};
