import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.replace('/(tabs)');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDark && styles.darkText]}>Welcome Back</Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={[styles.input, isDark && styles.darkInput]}
          placeholder="Email"
          placeholderTextColor={isDark ? '#666666' : '#999999'}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={[styles.input, isDark && styles.darkInput]}
          placeholder="Password"
          placeholderTextColor={isDark ? '#666666' : '#999999'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, isDark && styles.darkText]}>
            Don't have an account?{' '}
          </Text>
          <Link href="/auth/register" style={styles.link}>
            Sign Up
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  content: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#000000',
  },
  darkInput: {
    backgroundColor: '#1C1C1E',
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 15,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#000000',
  },
  link: {
    color: '#007AFF',
    fontWeight: '600',
  },
});