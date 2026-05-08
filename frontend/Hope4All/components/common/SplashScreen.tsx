import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);
  const textOpacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#111827', '#FF6B35', '#4ECDC4']}
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.iconCircle}>
            <FontAwesome5 name="hands-helping" size={80} color="#fff" />
          </View>
          
          <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
            <Text style={styles.title}>Hope4All</Text>
            <View style={styles.divider} />
            <Text style={styles.subtitle}>Bringing Hope to Every Heart</Text>
          </Animated.View>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by Hope Foundation</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  divider: {
    width: 80,
    height: 3,
    backgroundColor: '#4ECDC4', // Teal accent
    borderRadius: 2,
    marginVertical: 15,
    opacity: 0.9,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 1,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    letterSpacing: 1,
  },
});

export default SplashScreen;
