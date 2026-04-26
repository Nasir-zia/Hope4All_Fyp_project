import Constants from 'expo-constants';

// Dynamic IP detection for local development
const debuggerHost = Constants.expoConfig?.hostUri;
const hostIP = debuggerHost ? debuggerHost.split(':')[0] : '192.168.1.55';

export const CONFIG = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || `http://${hostIP}:5000/api`,
  SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL || `http://${hostIP}:5000`,
  ENVIRONMENT: 'development', // Toggle this for production
};
