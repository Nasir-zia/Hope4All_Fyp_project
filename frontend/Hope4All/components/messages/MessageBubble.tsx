import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

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
      <LinearGradient
        colors={isMine ? ['#4da6ff', '#0077cc'] : ['#f1f5f9', '#e2e8f0']}
        style={[styles.msgBubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}
      >
        <Text style={[styles.msgText, isMine ? styles.textMine : styles.textTheirs]}>
          {item.message}
        </Text>
        <Text style={[styles.msgTime, isMine ? styles.timeMine : styles.timeTheirs]}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  msgWrapper: { marginBottom: 12, maxWidth: '85%' },
  msgMine: { alignSelf: 'flex-end' },
  msgTheirs: { alignSelf: 'flex-start' },
  msgBubble: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleMine: { borderBottomRightRadius: 4 },
  bubbleTheirs: { borderBottomLeftRadius: 4 },
  msgText: { fontSize: 15, lineHeight: 21 },
  textMine: { color: '#fff' },
  textTheirs: { color: '#1e293b' },
  msgTime: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end', opacity: 0.7 },
  timeMine: { color: '#fff' },
  timeTheirs: { color: '#64748b' },
});
