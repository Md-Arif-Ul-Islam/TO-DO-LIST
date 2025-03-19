import React from 'react';
import { View, Text, StyleSheet, Switch, useColorScheme, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <Text style={[styles.title, isDark && styles.darkText]}>Settings</Text>
      
      <View style={[styles.section, isDark && styles.darkSection]}>
        <View style={styles.settingItem}>
          <Text style={[styles.settingText, isDark && styles.darkText]}>System Theme</Text>
          <Text style={[styles.settingValue, isDark && styles.darkText]}>
            {isDark ? 'Dark' : 'Light'}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.signOutButton, isDark && styles.darkSignOutButton]}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000',
    padding: 20,
  },
  darkText: {
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    padding: 15,
  },
  darkSection: {
    backgroundColor: '#1C1C1E',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingText: {
    fontSize: 17,
    color: '#000000',
  },
  settingValue: {
    fontSize: 17,
    color: '#8E8E93',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  darkSignOutButton: {
    backgroundColor: '#FF453A',
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});