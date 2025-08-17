import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

export function useNavigationHistory() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateBack = useCallback(() => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to home page if no history
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const navigateToWithState = useCallback((path: string, state?: any) => {
    navigate(path, { state: { from: location, ...state } });
  }, [navigate, location]);

  const getReturnPath = useCallback(() => {
    return location.state?.from?.pathname || '/dashboard';
  }, [location.state]);

  return {
    navigateBack,
    navigateToWithState,
    getReturnPath,
    currentLocation: location
  };
}
