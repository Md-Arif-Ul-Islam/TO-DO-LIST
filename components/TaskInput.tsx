import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TaskInputProps {
  onAddTask: (text: string, date: Date) => void;
  isDark: boolean;
}

export default function TaskInput({ onAddTask, isDark }: TaskInputProps) {
  const [text, setText] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');

  const handleAddTask = () => {
    if (text.trim().length === 0) {
      setError('Task cannot be empty');
      return;
    }
    onAddTask(text, date);
    setText('');
    setError('');
  };

  const onChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, isDark && styles.darkInputContainer]}>
        <TextInput
          style={[styles.input, isDark && styles.darkInput]}
          placeholder="Add a new task"
          placeholderTextColor={isDark ? '#666666' : '#999999'}
          value={text}
          onChangeText={(value) => {
            setText(value);
            setError('');
          }}
        />
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar" size={24} color={isDark ? '#FFFFFF' : '#007AFF'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  darkInputContainer: {
    backgroundColor: '#1C1C1E',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    color: '#000000',
  },
  darkInput: {
    color: '#FFFFFF',
  },
  dateButton: {
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    marginTop: 5,
    fontSize: 12,
  },
});