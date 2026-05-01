import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface MessageInputProps {
  onSend: (message: string) => void;
  sending: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, sending }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim() || sending) return;
    onSend(message);
    setMessage('');
  };

  return (
    <View style={styles.inputAreaWrapper}>
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#94a3b8"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendBtn, (!message.trim() || sending) && styles.sendBtnDisabled]} 
          onPress={handleSend}
          disabled={!message.trim() || sending}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={message.trim() && !sending ? ['#4da6ff', '#0077cc'] : ['#e2e8f0', '#cbd5e1']}
            style={styles.sendGradient}
          >
            {sending ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="send" size={20} color="#fff" />}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputAreaWrapper: { 
    paddingHorizontal: 15, 
    paddingVertical: 12, 
    backgroundColor: '#fff', 
    borderTopWidth: 1, 
    borderTopColor: '#f1f5f9' 
  },
  inputArea: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f8fafc', 
    borderRadius: 25, 
    paddingHorizontal: 5, 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  input: { 
    flex: 1, 
    fontSize: 15, 
    color: '#1e293b', 
    paddingHorizontal: 15, 
    maxHeight: 100, 
    paddingVertical: 10 
  },
  sendBtn: { width: 42, height: 42, borderRadius: 21, overflow: 'hidden', margin: 4 },
  sendGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { opacity: 0.6 },
});
