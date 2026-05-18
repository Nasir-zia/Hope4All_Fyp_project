import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated, Text, Dimensions, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'logo' | 'islamic'>('logo');
  const insets = useSafeAreaInsets();
  
  // Animation values for Logo Stage
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;

  // Animation values for Islamic Stage
  const islamicFade = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (stage === 'logo') {
      // Reset animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.3);
      textOpacity.setValue(0);
      btnOpacity.setValue(0);

      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 900,
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
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(btnOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Islamic stage animations
      islamicFade.setValue(0);
      cardScale.setValue(0.9);
      
      Animated.parallel([
        Animated.timing(islamicFade, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();

      // Loop pulsing effect for Enter App button
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.03,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      ).start();
    }
  }, [stage]);

  const handleNext = () => {
    setStage('islamic');
  };

  const handleBack = () => {
    setStage('logo');
  };

  const handleFinish = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a1120', '#0f2038', '#080d1a']}
        style={styles.gradient}
      >
        {stage === 'logo' ? (
          // STAGE 1: Logo & Welcome
          <View style={styles.contentContainer}>
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
                <FontAwesome5 name="hands-helping" size={80} color="#0088ff" />
              </View>
              
              <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
                <Text style={styles.title}>Hope4All</Text>
                <View style={styles.divider} />
                <Text style={styles.subtitle}>Bringing Hope to Every Heart</Text>
              </Animated.View>
            </Animated.View>

            {/* Next Button */}
            <Animated.View style={[styles.btnWrapper, { opacity: btnOpacity }]}>
              <TouchableOpacity activeOpacity={0.8} onPress={handleNext}>
                <LinearGradient
                  colors={['#0088ff', '#005fa3']}
                  style={styles.nextBtn}
                >
                  <Text style={styles.nextBtnText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        ) : (
          // STAGE 2: Quran / Hadith Verse
          <Animated.View style={[styles.islamicContainer, { opacity: islamicFade, paddingTop: Math.max(insets.top + 60, 90) }]}>
            {/* Back Button positioned safely higher up */}
            <TouchableOpacity 
              style={[styles.backBtn, { top: Math.max(insets.top + 10, 30) }]} 
              onPress={handleBack} 
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <Animated.View style={[styles.quoteCard, { transform: [{ scale: cardScale }] }]}>
              <View style={styles.quoteHeader}>
                <FontAwesome5 name="quran" size={24} color="#eab308" />
                <Text style={styles.quoteHeaderTitle}>Blessings of Caring for Orphans</Text>
              </View>

              <ScrollView style={styles.quoteScroll} showsVerticalScrollIndicator={false}>
                {/* Arabic Hadith in Gold */}
                <Text style={styles.arabicText}>
                  « أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ كَهَاتَيْنِ »
                </Text>

                {/* Urdu Translation */}
                <View style={styles.translationContainer}>
                  <Text style={styles.langLabel}>اردو ترجمہ</Text>
                  <Text style={styles.urduText}>
                    رسول اللہ ﷺ نے فرمایا: "میں اور یتیم کی کفالت کرنے والا جنت میں اس طرح ساتھ ہوں گے جیسے یہ دو انگلیاں (شہادت اور بیچ کی انگلی) پاس پاس ہیں۔"
                  </Text>
                </View>

                {/* English Translation */}
                <View style={[styles.translationContainer, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
                  <Text style={styles.langLabel}>ENGLISH TRANSLATION</Text>
                  <Text style={styles.englishText}>
                    The Prophet (ﷺ) said: &quot;I and the one who cares for an orphan will be in Paradise like this,&quot; and he held his index and middle fingers close together.
                  </Text>
                  <Text style={styles.sourceText}>— Sahih Al-Bukhari 5304</Text>
                </View>
              </ScrollView>
            </Animated.View>

            {/* Enter App Button Pushed to the Bottom */}
            <Animated.View style={[styles.enterBtnWrapper, { transform: [{ scale: pulseAnim }], marginBottom: Math.max(insets.bottom + 20, 40) }]}>
              <TouchableOpacity activeOpacity={0.8} onPress={handleFinish}>
                <LinearGradient
                  colors={['#0088ff', '#005fa3']}
                  style={styles.enterBtn}
                >
                  <Text style={styles.enterBtnText}>Get Started</Text>
                  <FontAwesome5 name="heart" size={16} color="#fff" style={{ marginLeft: 8 }} />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}

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
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  divider: {
    width: 80,
    height: 3,
    backgroundColor: '#0088ff', 
    borderRadius: 2,
    marginVertical: 15,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 1,
    fontWeight: '500',
  },
  btnWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
    shadowColor: '#0088ff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  // Islamic Quote Screen Styles
  islamicContainer: {
    flex: 1,
    paddingHorizontal: 25,
    alignItems: 'center',
    width: '100%',
  },
  backBtn: {
    position: 'absolute',
    left: 25,
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quoteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 24,
    width: '100%',
    maxHeight: height * 0.48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 15,
    marginBottom: 15,
  },
  quoteHeaderTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  quoteScroll: {
    flexGrow: 0,
  },
  arabicText: {
    color: '#eab308',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 45,
    marginVertical: 15,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : 'serif',
  },
  translationContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    paddingBottom: 15,
    marginBottom: 15,
  },
  langLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  urduText: {
    color: '#e2e8f0',
    fontSize: 17,
    lineHeight: 28,
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'Jameel Noori Nastaleeq' : 'serif',
  },
  englishText: {
    color: '#cbd5e1',
    fontSize: 13.5,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  sourceText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    marginTop: 6,
    textAlign: 'right',
  },
  enterBtnWrapper: {
    width: '100%',
    marginTop: 'auto',
  },
  enterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#0088ff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  enterBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: 11,
    letterSpacing: 1,
  },
});

export default SplashScreen;
