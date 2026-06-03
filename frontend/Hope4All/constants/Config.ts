import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Dynamic IP detection for local development
const debuggerHost = Constants.expoConfig?.hostUri;
let hostIP = debuggerHost ? debuggerHost.split(':')[0] : '192.168.1.6';

// For Web, use localhost or the window location
if (Platform.OS === 'web') {
  hostIP = 'localhost';
}

console.log(`[Config] Running on ${Platform.OS}. Detected Host IP:`, hostIP);

export const CONFIG = {
  // Production URL (Railway)
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || `https://hope4all-production.up.railway.app/api`,
  SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL || `https://hope4all-production.up.railway.app`,

  // Local Development (Uncomment to use local IP instead)
  // API_BASE_URL: `http://${hostIP}:5000/api`,
  // SOCKET_URL: `http://${hostIP}:5000`,
  ENVIRONMENT: 'production',
};
