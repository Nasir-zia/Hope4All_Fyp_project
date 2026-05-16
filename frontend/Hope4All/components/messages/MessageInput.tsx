import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Platform, Image, Text, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

interface MessageInputProps {
  onSend: (message: string) => void;
  sending: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, sending }) => {
  const insets = useSafeAreaInsets();
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

  const showAttachmentOptions = () => {
    if (Platform.OS === 'web') {
      if (confirm('Attach Image?')) pickImage();
    } else {
      Alert.alert('Attach', 'Choose a file type', [
        { text: 'Image', onPress: pickImage },
        { text: 'Document', onPress: pickFile },
        { text: 'Cancel', style: 'cancel' }
      ]);
    }
  };

  return (
    <View style={[styles.inputAreaWrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {attachment && (
        <View style={styles.previewContainer}>
          {attachment.type === 'image' ? (
            <Image source={{ uri: attachment.uri }} style={styles.previewImage} />
          ) : (
            <View style={styles.filePreview}>
              <Ionicons name="document-text" size={20} color="#00C2E0" />
              <Text style={styles.fileName} numberOfLines={1}>{attachment.name}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.removeBtn} onPress={() => setAttachment(null)}>
            <Ionicons name="close-circle" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.inputArea}>
        <TouchableOpacity style={styles.addBtn} onPress={showAttachmentOptions}>
          <View style={styles.addIconCircle}>
            <Ionicons name="add" size={24} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type your message"
            placeholderTextColor="#94a3b8"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.emojiBtn}>
            <Ionicons name="happy-outline" size={24} color="#00C2E0" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.sendBtn, (!message.trim() && !attachment || sending) && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={(!message.trim() && !attachment) || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#00C2E0" />
          ) : (
            <Ionicons name="send" size={22} color={message.trim() || attachment ? "#00C2E0" : "#94a3b8"} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputAreaWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    paddingTop: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    zIndex: 10,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addBtn: {
    padding: 5,
  },
  addIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00C2E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    maxHeight: 100,
    paddingVertical: 10,
    fontWeight: '500'
  },
  emojiBtn: {
    padding: 5,
  },
  sendBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendBtnDisabled: { opacity: 0.5 },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
    position: 'relative'
  },
  previewImage: { width: 50, height: 50, borderRadius: 8 },
  filePreview: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  fileName: { fontSize: 12, color: '#475569', fontWeight: '600' },
  removeBtn: { position: 'absolute', top: -5, right: -5 },
});
