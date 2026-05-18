import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTempSignup } from "@/contexts/TempSignupContext";
import { signupApi } from "@/constants/api";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from 'expo-haptics';
import BackButton from "@/components/BackButton";

export default function RoleScreen() {
  const { user, login, logout } = useAuth();
  const { tempData, setTempData } = useTempSignup();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState("orphan");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tempData) {
      // Signup flow - temp data present
    }
    if (user?.role && !tempData) {
      setSelected(user.role);
    }
  }, [user, tempData]);

  interface CardProps {
    type: string;
    title: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
  }

  const Card = ({ type, title, desc, icon, color }: CardProps) => {
    const isActive = selected === type;

    return (
      <TouchableOpacity
        onPress={() => {
          setSelected(type);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        style={[
          styles.card,
          { borderColor: isActive ? color : "#ddd" },
        ]}
      >
        {/* Left Icon */}
        <View style={[styles.iconBox, { backgroundColor: color + "20" }]}>
          {icon}
        </View>

        {/* Text */}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.desc}>{desc}</Text>
        </View>

        {/* Right Circle */}
        <View
          style={[
            styles.circle,
            { backgroundColor: isActive ? color : "#eee" },
          ]}
        />
      </TouchableOpacity>
    );
  };

  const handleContinue = async () => {
    if (!selected) {
      Alert.alert('Error', 'Please select a role');
      return;
    }

    if (tempData) {
      // Complete signup
      setLoading(true);
      try {
        const response = await signupApi({
          username: tempData.username,
          email: tempData.email,
          password: tempData.password,
          role: selected,
        });
        
        setTempData(null);
        Alert.alert('Success', 'Account created! Welcome to Hope4All.');
        
        // Log in the user immediately (since they are pre-verified)
        await login(response.token || '', response.user as any);

        // Redirect to the appropriate dashboard instead of profile-setup
        switch (selected) {
          case 'orphan': router.replace('/orphan' as any); break;
          case 'donor': router.replace('/donor' as any); break;
          case 'volunteer': router.replace('/volunteer' as any); break;
          case 'orphanage': router.replace('/orphanage' as any); break;
          case 'admin': router.replace('/admin' as any); break;
          default: router.replace('/login' as any);
        }
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Signup failed');
      } finally {
        setLoading(false);
      }
    } else {
      // Post-login role selection
      switch (selected) {
        case 'orphan':
          router.push('/orphan');
          break;
        case 'donor':
          router.push('/donor');
          break;
        case 'volunteer':
          router.push('/volunteer');
          break;
        case 'orphanage':
          router.push('/orphanage');
          break;
        case 'admin':
          router.push('/admin');
          break;
        default:
          Alert.alert('Error', 'Please select a role');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['right', 'bottom', 'left']}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={[styles.logoutButton, { top: Math.max(insets.top, 20) }]} 
        onPress={() => {
          Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: logout }
          ]);
        }}
      >
        <Ionicons name="log-out-outline" size={24} color="#333" />
      </TouchableOpacity>
        <BackButton />
        <Text style={[styles.heading, { marginTop: Math.max(insets.top + 20, 60) }]}>Choose Your Role</Text>
      <Text style={styles.sub}>
        Select how you would like to Help in Hope4All
      </Text>

      <Card
        type="orphan"
        title="Orphan"
        desc="Request educational support and access learning  resources"
        color="#4da6ff"
        icon={<Ionicons name="school-outline" size={24} color="#4da6ff" />}
      />

      <Card
        type="donor"
        title="Donor"
        desc="Support orphans education "
        color="#ff66b2"
        icon={<Ionicons name="heart-outline" size={24} color="#ff66b2" />}
      />

      <Card
        type="volunteer"
        title="Volunteer"
        desc="Help distribute educational materials and support"
        color="#33cc99"
        icon={<FontAwesome5 name="hand-holding-heart" size={20} color="#33cc99" />}
      />

      <Card
        type="orphanage"
        title="Orphanage"
        desc="Manage your institution and request support for children"
        color="#9333ea"
        icon={<Ionicons name="business-outline" size={24} color="#9333ea" />}
      />

        {/* Continue Button */}
        <TouchableOpacity 
          style={[
            styles.continueBtn,
            { bottom: Math.max(insets.bottom, 20),
              backgroundColor: 
                selected === 'orphan' ? '#4da6ff' : 
                selected === 'donor' ? '#ff66b2' : 
                selected === 'volunteer' ? '#33cc99' : '#9333ea' 
            },
            loading && { opacity: 0.6 }
          ]}
          onPress={handleContinue}
          disabled={loading}
        >
          <Text style={styles.continueText}>{loading ? 'Loading...' : `Continue as ${selected.charAt(0).toUpperCase() + selected.slice(1)}`}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  logoutButton: {
    position: 'absolute',
    right: 20,
    top: 50,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 20,
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#0077cc",
    marginTop: 60,
    marginBottom: 10,
  },

  sub: {
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    marginTop: 15,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },

  desc: {
    fontSize: 13,
    color: "#666",
  },

  circle: {
    width: 25,
    height: 25,
    borderRadius: 50,
  },

  continueBtn: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    padding: 18,
    borderRadius: 25,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },

  continueText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});

