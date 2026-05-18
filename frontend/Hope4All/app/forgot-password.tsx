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
import { router } from 'expo-router';
import { apiClient } from '@/utils/apiClient';
import * as Haptics from 'expo-haptics';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Handle timer for resend cooldown
  useEffect(() => {
    let interval: any;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, step]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
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
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');
  const combinedOtp = otp.join('');

  const handleRequestOTP = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient('/auth/forgot-password', {
        method: 'POST',
        body: { email },
      });
      
      if (res.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setStep(2);
        setTimer(60);
        setCanResend(false);
      } else {
        Alert.alert('Error', res.message || 'Could not send OTP');
        // Keep step 2 transition for testing if email fails
        setStep(2);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!isOtpComplete || !newPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient('/auth/reset-password', {
        method: 'POST',
        body: { email, otp: combinedOtp, newPassword },
      });

      if (res.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Password reset successfully!', [
          { text: 'Login Now', onPress: () => router.replace('/login') }
        ]);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Error', res.message || 'Reset failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['right', 'bottom', 'left']}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name={step === 1 ? "lock-open-outline" : "key-outline"} size={40} color="#0d8ddb" />
        </View>
        <Text style={styles.title}>{step === 1 ? 'Forgot Password?' : 'Reset Password'}</Text>
        <Text style={styles.subtitle}>
          {step === 1 
            ? "Enter your email address and we'll send you an OTP to reset your password." 
            : `Enter the code sent to ${email} and your new password.`}
        </Text>
      </View>

      <View style={styles.form}>
        {step === 1 ? (
          <>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={[styles.primaryBtn, loading && styles.disabledBtn]} 
              onPress={handleRequestOTP}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Send Reset Code</Text>}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.otpRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={[styles.otpInput, digit !== '' && styles.otpInputActive]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="numeric"
                  maxLength={index === 0 ? 6 : 1}
                  editable={!loading}
                />
              ))}
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={[styles.primaryBtn, (!isOtpComplete || !newPassword || loading) && styles.disabledBtn]} 
              onPress={handleResetPassword}
              disabled={!isOtpComplete || !newPassword || loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Reset Password</Text>}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              {canResend ? (
                <TouchableOpacity onPress={handleRequestOTP} disabled={loading}>
                  <Text style={styles.resendLink}>Resend Code</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.timerText}>Resend in {timer}s</Text>
              )}
            </View>
          </>
        )}
      </View>

      <TouchableOpacity 
        style={styles.backBtn} 
        onPress={() => step === 2 ? setStep(1) : router.replace('/login')}
        disabled={loading}
      >
        <Ionicons name="arrow-back" size={16} color="#94a3b8" />
        <Text style={styles.backBtnText}>Back to {step === 2 ? 'Email' : 'Login'}</Text>
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
  form: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#1e293b',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
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
  primaryBtn: {
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
    marginTop: 8,
  },
  disabledBtn: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  resendContainer: {
    marginTop: 24,
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
