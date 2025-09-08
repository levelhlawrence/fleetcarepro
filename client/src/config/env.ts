// Environment configuration
const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  
  // Authentication Configuration
  TOKEN_STORAGE_KEY: 'accessToken',
  REFRESH_TOKEN_STORAGE_KEY: 'refreshToken',
  USER_STORAGE_KEY: 'user',
  
  // App Configuration
  APP_NAME: 'FleetCare Pro',
  APP_VERSION: '1.0.0',
};

export default config;
