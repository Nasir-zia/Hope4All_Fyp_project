import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Platform, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

interface MessageInputProps {
  onSend: (message: string) => void;
  sending: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, sending }) => {
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<any>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setAttachment({
        uri: result.assets[0].uri,
        name: result.assets[0].uri.split('/').pop() || 'image.jpg',
        type: 'image'
      });
    }
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ 
      type: 'application/pdf',
      copyToCacheDirectory: true 
    });
    if (!result.canceled) {
      setAttachment({
        uri: result.assets[0].uri,
        name: result.assets[0].name,
        type: 'file'
      });
    }
  };

  const handleSend = async () => {
    if ((!message.trim() && !attachment) || sending) return;

    if (!attachment) {
      onSend(message);
    } else {
      // Construct FormData for attachments
      const formData = new FormData();
      formData.append('message', message.trim());
      
      const fileName = attachment.name;
      if (Platform.OS === 'web') {
        const response = await fetch(attachment.uri);
        const blob = await response.blob();
        formData.append('file', blob, fileName);
      } else {
        formData.append('file', {
          uri: Platform.OS === 'android' ? attachment.uri : attachment.uri.replace('file://', ''),
          name: fileName,
          type: attachment.type === 'image' ? 'image/jpeg' : 'application/octet-stream',
        } as any);
      }
      onSend(formData as any);
    }
    
    setMessage('');
    setAttachment(null);
  };

  return (
    <View style={styles.inputAreaWrapper}>
      {attachment && (
        <View style={styles.previewContainer}>
          {attachment.type === 'image' ? (
            <Image source={{ uri: attachment.uri }} style={styles.previewImage} />
          ) : (
            <View style={styles.filePreview}>
              <Ionicons name="document-text" size={20} color="#0077cc" />
              <Text style={styles.fileName} numberOfLines={1}>{attachment.name}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.removeBtn} onPress={() => setAttachment(null)}>
            <Ionicons name="close-circle" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.inputArea}>
        <TouchableOpacity style={styles.attachBtn} onPress={pickImage}>
          <Ionicons name="image-outline" size={22} color="#64748b" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.attachBtn} onPress={pickFile}>
          <Ionicons name="attach-outline" size={22} color="#64748b" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#94a3b8"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendBtn, (!message.trim() && !attachment || sending) && styles.sendBtnDisabled]} 
          onPress={handleSend}
          disabled={(!message.trim() && !attachment) || sending}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={(message.trim() || attachment) && !sending ? ['#4da6ff', '#0077cc'] : ['#e2e8f0', '#cbd5e1']}
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
  attachBtn: { padding: 10 },
  previewContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 12, padding: 8, marginBottom: 10, position: 'relative' },
  previewImage: { width: 50, height: 50, borderRadius: 8 },
  filePreview: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  fileName: { fontSize: 12, color: '#475569', fontWeight: '600' },
  removeBtn: { position: 'absolute', top: -5, right: -5 },
});
