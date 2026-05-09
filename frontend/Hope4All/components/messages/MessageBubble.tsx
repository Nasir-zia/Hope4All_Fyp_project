import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert } from 'react-native';

import { getDownloadableUrl } from '../../utils/cloudinaryUtils';

import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface MessageBubbleProps {
  item: any;
  isMine: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ item, isMine }) => {
  return (
    <Animated.View 
      entering={isMine ? FadeInRight : FadeInLeft} 
      style={[styles.msgWrapper, isMine ? styles.msgMine : styles.msgTheirs]}
    >
      <View
        style={[styles.msgBubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}
      >
        {item.type === 'image' && item.fileUrl && (
          <TouchableOpacity 
            onPress={async () => {
              try {
                if (item.fileUrl) await Linking.openURL(getDownloadableUrl(item.fileUrl));
              } catch (e) {
                Alert.alert('Error', 'Could not open image.');
              }
            }}
          >
            <Image source={{ uri: item.fileUrl }} style={styles.msgImage} resizeMode="cover" />
          </TouchableOpacity>
        )}

        {item.type === 'file' && item.fileUrl && (
          <TouchableOpacity 
            style={[styles.fileContainer, isMine ? styles.fileMine : styles.fileTheirs]} 
            onPress={async () => {
              try {
                if (item.fileUrl) await Linking.openURL(getDownloadableUrl(item.fileUrl));
              } catch (e) {
                Alert.alert('Error', 'Could not open file.');
              }
            }}
          >
            <Ionicons name="document-attach" size={24} color={isMine ? "#fff" : "#00C2E0"} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.fileName, isMine ? styles.textMine : styles.textTheirs]} numberOfLines={1}>
                {item.fileName || 'Document'}
              </Text>
              <Text style={[styles.fileSize, isMine ? styles.timeMine : styles.timeTheirs]}>Click to download</Text>
            </View>
          </TouchableOpacity>
        )}
        {item.message ? (
          <Text style={[styles.msgText, isMine ? styles.textMine : styles.textTheirs]}>
            {item.message}
          </Text>
        ) : null}
      </View>
      <Text style={[styles.msgTime, isMine ? styles.timeMine : styles.timeTheirs]}>
        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  msgWrapper: { marginBottom: 16, maxWidth: '80%' },
  msgMine: { alignSelf: 'flex-end' },
  msgTheirs: { alignSelf: 'flex-start' },
  msgBubble: { 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  bubbleMine: { 
    backgroundColor: '#00C2E0', 
    borderTopRightRadius: 4 
  },
  bubbleTheirs: { 
    backgroundColor: '#f1f5f9', 
    borderTopLeftRadius: 4 
  },
  msgText: { fontSize: 15, lineHeight: 22, fontWeight: '500' },
  textMine: { color: '#fff' },
  textTheirs: { color: '#1e293b' },
  msgTime: { 
    fontSize: 10, 
    marginTop: 4, 
    marginHorizontal: 4,
    color: '#94a3b8',
    fontWeight: '600'
  },
  timeMine: { alignSelf: 'flex-end' },
  timeTheirs: { alignSelf: 'flex-start' },
  msgImage: { width: 200, height: 200, borderRadius: 16, marginBottom: 8 },
  fileContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 12, marginBottom: 8, minWidth: 150 },
  fileMine: { backgroundColor: 'rgba(255,255,255,0.2)' },
  fileTheirs: { backgroundColor: 'rgba(0,194,224,0.05)' },
  fileName: { fontSize: 14, fontWeight: '700' },
  fileSize: { fontSize: 10 },
});
