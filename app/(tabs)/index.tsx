import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import TaskInput from '../../components/TaskInput';
import TaskItem from '../../components/TaskItem';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
}

export default function TodoScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    checkUser();
    fetchTasks();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace('/auth/login');
    }
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (text: string, date: Date) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ text, date, user_id: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;

      setTasks((currentTasks) => [...currentTasks, data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task?.completed })
        .eq('id', taskId);

      if (error) throw error;

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? { ...task, completed: !task.completed }
            : task
        )
      );
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateTask = async (taskId: string, text: string, date: Date) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ text, date })
        .eq('id', taskId);

      if (error) throw error;

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? { ...task, text, date }
            : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getBackgroundColors = () => {
    const hour = new Date().getHours();
    if (isDark) {
      return ['#000000', '#1a1a1a'];
    } else if (hour >= 6 && hour < 12) {
      return ['#87CEEB', '#E0FFFF']; // Morning
    } else if (hour >= 12 && hour < 18) {
      return ['#87CEFA', '#F0F8FF']; // Afternoon
    } else {
      return ['#4682B4', '#B0C4DE']; // Evening
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, isDark && styles.darkText]}>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={getBackgroundColors()}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.darkText]}>Todo List</Text>
        </View>
        <TaskInput onAddTask={addTask} isDark={isDark} />
        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onUpdate={updateTask}
              isDark={isDark}
            />
          )}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#000',
  },
});