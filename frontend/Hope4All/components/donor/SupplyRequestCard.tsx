import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SupplyRequestCardProps {
  request: any;
  isSelected: boolean;
  onPress: () => void;
}

export const SupplyRequestCard: React.FC<SupplyRequestCardProps> = ({ request, isSelected, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.requestBubble, isSelected && styles.requestBubbleSelected]}
      onPress={onPress}
    >
      <Ionicons 
        name={request.type === 'stationery' ? 'pencil' : request.type === 'uniforms' ? 'shirt' : 'book'} 
        size={24} 
        color={isSelected ? "#fff" : "#0077cc"} 
      />
      <Text style={[styles.reqType, isSelected && styles.reqTextWhite]}>
        {request.type?.toUpperCase()}
      </Text>
      <Text style={[styles.reqName, isSelected && styles.reqTextWhite]} numberOfLines={1}>
        {request.orphanId?.name || 'Child'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  requestBubble: {
    backgroundColor: '#f5f7fa',
    padding: 15,
    borderRadius: 15,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#e1e5eb',
    width: 160,
  },
  requestBubbleSelected: {
    backgroundColor: '#0077cc',
    borderColor: '#0077cc',
  },
  reqType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0077cc',
    marginTop: 5,
  },
  reqName: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  reqTextWhite: {
    color: '#fff',
  },
});
