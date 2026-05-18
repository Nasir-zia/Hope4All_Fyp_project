import React from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { TempSignupProvider } from '../contexts/TempSignupContext';
import { View, ActivityIndicator, Text } from 'react-native';
import SplashScreen from '../components/common/SplashScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="role" options={{ headerShown: false }} />
      <Stack.Screen name="orphan" options={{ headerShown: false }} />
      <Stack.Screen name="donor" options={{ headerShown: false }} />
      <Stack.Screen name="volunteer" options={{ headerShown: false }} />
      <Stack.Screen name="orphanage" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="verify-email" options={{ headerShown: false }} />
      <Stack.Screen name="messages" options={{ headerShown: false }} />
    </Stack>
  );
}

import { useSocket } from '../hooks/messages/useSocket';
import { useMessageStore } from '../store/messageStore';

function AuthRedirector({ children }: { children: React.ReactNode }) {
  const { user, loading, token } = useAuth() as any;
  const segments = useSegments();
  const { handleIncomingMessage, fetchConversations } = useMessageStore();

  // Global Socket Connection
  const { socket } = useSocket(user?.id, user?.token || token);

  // Global Message Listener
  React.useEffect(() => {
    if (!socket) return;

    const onNewMessage = (message: any) => {
      console.log('[GlobalSocket] New message received:', message);
      // Update store (will handle adding to current chat if open)
      handleIncomingMessage(message, null); 
      // Refresh conversations list for unread counts
      fetchConversations(user?.token || token);
    };

    socket.on('new-message', onNewMessage);
    return () => {
      socket.off('new-message', onNewMessage);
    };
  }, [socket, user?.token, token]);

  const [isSplashDone, setIsSplashDone] = React.useState(false);

  const isActuallyLoading = loading || !isSplashDone;

  React.useEffect(() => {
    console.log('[AuthRedirector] State:', { hasUser: !!user, loading, isActuallyLoading, segments });
    if (isActuallyLoading) return;

    const segment = segments[0] as string | undefined;
    const isAuthPage = segment === 'login' || segment === 'signup' || segment === 'role';
    const isIndexPage = !segment || segment === 'index';
    const isProfileSetup = segment === 'profile-setup';
    const isDashboardPage = ['orphan', 'donor', 'volunteer', 'admin', 'orphanage'].includes(segment || '');

    // Redirect Logged-in users away from Auth/Index pages
    if (user && (isAuthPage || isIndexPage)) {
      console.log('[AuthRedirector] Logged in, redirecting to dashboard...');
      let redirectPath = '/login'; // Fallback
      
      if (user.role === 'orphan') redirectPath = '/orphan';
      else if (user.role === 'donor') redirectPath = '/donor';
      else if (user.role === 'volunteer') redirectPath = '/volunteer';
      else if (user.role === 'orphanage') redirectPath = '/orphanage';
      else if (user.role === 'admin') redirectPath = '/admin';

      router.replace(redirectPath as any);
      return;
    } 

    // Redirect Logged-out users away from protected pages
    if (!user && (isDashboardPage || isProfileSetup)) {
      console.log('[AuthRedirector] Logged out, redirecting to login...');
      router.replace('/login');
    }
  }, [user, loading, segments, isActuallyLoading]);

  if (isActuallyLoading) {
    return <SplashScreen onComplete={() => setIsSplashDone(true)} />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TempSignupProvider>
          <AuthRedirector>
            <RootLayoutNav />
          </AuthRedirector>
        </TempSignupProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

