import React from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { TempSignupProvider } from '../contexts/TempSignupContext';
import { View, ActivityIndicator, Text } from 'react-native';

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

  React.useEffect(() => {
    console.log('[AuthRedirector] State:', { hasUser: !!user, loading, segments });
    if (loading) return;

    const segment = segments[0] as string | undefined;
    const isAuthPage = segment === 'login' || segment === 'signup';
    const isIndexPage = !segment || segment === 'index';
    const isDashboardPage = ['orphan', 'donor', 'volunteer', 'admin', 'orphanage'].includes(segment || '');

    if (user && (isAuthPage || isIndexPage)) {
      console.log('[AuthRedirector] Logged in, redirecting to dashboard...');
      let redirectPath = '/role';
      if (user.role === 'orphan') redirectPath = '/orphan';
      else if (user.role === 'donor') redirectPath = '/donor';
      else if (user.role === 'volunteer') redirectPath = '/volunteer';
      else if (user.role === 'orphanage') redirectPath = '/orphanage';
      else if (user.role === 'admin') redirectPath = '/admin';

      router.replace(redirectPath as any);
    } else if (!user && isDashboardPage) {
      console.log('[AuthRedirector] Logged out, redirecting to login...');
      router.replace('/login');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <TempSignupProvider>
        <AuthRedirector>
          <RootLayoutNav />
        </AuthRedirector>
      </TempSignupProvider>
    </AuthProvider>
  );
}

