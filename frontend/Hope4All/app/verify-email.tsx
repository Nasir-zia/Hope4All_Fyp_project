import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { apiClient } from '@/utils/apiClient';
import { useAuth } from '@/hooks/useAuth';
import * as Haptics from 'expo-haptics';

export default function VerifyEmailPage() {
  const params = useLocalSearchParams();
  const email = Array.isArray(params.email) ? params.email[0] : params.email;
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const { login } = useAuth();

  // Handle timer for resend cooldown
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    
    // Handle paste support (if user pastes a 6 digit code)
    if (value.length > 1) {
      const pastedData = value.trim().split('').slice(0, 6);
      pastedData.forEach((char, i) => {
        newOtp[i] = char;
      });
      setOtp(newOtp);
      Keyboard.dismiss();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');
  const combinedOtp = otp.join('');

  const handleVerify = async () => {
    if (!isOtpComplete) return;

    setLoading(true);
    try {
      const res = await apiClient('/auth/verify-email', {
        method: 'POST',
        body: { email, otp: combinedOtp },
      });

      if (res.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Email verified successfully!', [
          { 
            text: 'Continue', 
            onPress: async () => {
              await login(res.token, res.user);
              const targetPath = res.user?.role ? `/${res.user.role}` : '/login';
              router.replace(targetPath as any);
            } 
          }
        ]);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Error', res.message || 'Verification failed');
        // Force redirect for testing
        const targetPath = res.user?.role ? `/${res.user.role}` : '/login';
        router.replace(targetPath as any);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setLoading(true);
    try {
      const res = await apiClient('/auth/resend-verification', {
        method: 'POST',
        body: { email },
      });
      if (res.success) {
        Alert.alert('Sent', 'A new verification OTP has been sent to your email.');
        setTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        Alert.alert('Error', res.message || 'Could not resend OTP');
      }
    } catch (error: any) {
      Alert.alert('Error', 'An error occurred while resending the OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['right', 'bottom', 'left']}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="shield-checkmark" size={40} color="#0d8ddb" />
        </View>
        <Text style={styles.title}>Account Verification</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code we sent to:{"\n"}
          <Text style={styles.emailText}>{email}</Text>
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={[
                styles.otpInput, 
                digit !== '' && styles.otpInputActive,
                loading && styles.otpInputDisabled
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={index === 0 ? 6 : 1} // Index 0 handles paste
              selectTextOnFocus
              editable={!loading}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={[
            styles.verifyBtn, 
            (!isOtpComplete || loading) && styles.disabledBtn
          ]} 
          onPress={handleVerify}
          disabled={!isOtpComplete || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyBtnText}>Verify & Continue</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend} disabled={loading}>
              <Text style={styles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>Resend code in {timer}s</Text>
          )}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.backBtn} 
        onPress={() => router.replace('/login')}
        disabled={loading}
      >
        <Ionicons name="arrow-back" size={16} color="#94a3b8" />
        <Text style={styles.backBtnText}>Back to Login</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  emailText: {
    color: '#0d8ddb',
    fontWeight: '700',
    fontSize: 16,
  },
  form: {
    width: '100%',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  otpInputActive: {
    borderColor: '#0d8ddb',
    backgroundColor: '#fff',
  },
  otpInputDisabled: {
    opacity: 0.5,
  },
  verifyBtn: {
    backgroundColor: '#0d8ddb',
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#0d8ddb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  disabledBtn: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  resendContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  resendLink: {
    color: '#0d8ddb',
    fontSize: 15,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  timerText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  backBtn: {
    marginTop: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  backBtnText: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '700',
  },
});
