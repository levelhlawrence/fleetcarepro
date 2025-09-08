import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../utils/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  error?: string;
  user?: any;
}

export const useAuthActions = () => {
  const { dispatch } = useAuth();

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await authAPI.login(credentials.email, credentials.password);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response,
      });

      return {
        success: true,
        user: response.user,
      };
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.data) {
        const apiErrors = error.response.data;
        if (apiErrors.detail) {
          errorMessage = apiErrors.detail;
        } else if (apiErrors.non_field_errors) {
          errorMessage = apiErrors.non_field_errors[0];
        } else if (apiErrors.message) {
          errorMessage = apiErrors.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    try {
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        return false;
      }

      const response = await authAPI.refreshToken(storedRefreshToken);
      
      dispatch({
        type: 'TOKEN_REFRESH',
        payload: { access: response.access },
      });

      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      dispatch({ type: 'LOGOUT' });
      return false;
    }
  };

  return {
    login,
    logout,
    refreshToken,
  };
};

export default useAuthActions;
