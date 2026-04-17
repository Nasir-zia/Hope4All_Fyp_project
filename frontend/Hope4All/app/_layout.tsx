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
      <Stack.Screen name="admin" options={{ headerShown: false }} />
    </Stack>
  );
}

function AuthRedirector({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();

  React.useEffect(() => {
    if (loading) return;

    const segment = segments[0] as string | undefined;
    const isAuthPage = segment === 'login' || segment === 'signup';
    const isIndexPage = !segment || segment === 'index';
    const isDashboardPage = ['orphan', 'donor', 'volunteer'].includes(segment || '');

    if (user && (isAuthPage || isIndexPage)) {
      // Logged in user shouldn't see login/signup/index
      let redirectPath = '/role';
      if (user.role === 'orphan') redirectPath = '/orphan';
      else if (user.role === 'donor') redirectPath = '/donor';
      else if (user.role === 'volunteer') redirectPath = '/volunteer';
      else if (user.role === 'admin') redirectPath = '/admin';
      
      router.replace(redirectPath as any);
    } else if (!user && isDashboardPage) {
      // Guest user shouldn't see dashboards
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

  // Always return children so the Expo Router Stack is correctly mounted!
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

