import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

const Page: React.FC = () => {
  const handleLogin = () => {
    router.push('/login' as any);
  };

  const handleSignup = () => {
    router.push('/signup' as any);
  };

  const handleImageError = () => {
    // Fallback image or state could be handled here
    console.log('Image load error');
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['right', 'bottom', 'left']}>
      <View style={styles.container}>
        
        {/* Top Image */}
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1588072432836-e10032774350",
          }}
          style={styles.image}
          onError={handleImageError}
        />

        {/* Title */}
        <Text style={styles.title}>Welcome to Hope4All</Text>

        {/* Description */}
        <Text style={styles.description}>
          Empowering education for orphans in Pakistan.{`\n`}
          Together, we can build brighter futures through learning{`\n`}
          and compassion.
        </Text>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {/* Signup Button */}
        <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default Page;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#007bff",
    marginBottom: 10,
  },

  description: {
    textAlign: "center",
    fontSize: 14,
    color: "#444",
    marginBottom: 30,
    lineHeight: 20,
  },

  loginBtn: {
    width: "100%",
    backgroundColor: "#0d8ddb",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  signupBtn: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#0d8ddb",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },

  signupText: {
    color: "#0d8ddb",
    fontSize: 16,
    fontWeight: "600",
  },
});

