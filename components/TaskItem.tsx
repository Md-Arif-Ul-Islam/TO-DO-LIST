import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TaskItemProps {
  task: {
    id: string;
    text: string;
    completed: boolean;
    date: Date;
  };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string, date: Date) => void;
  isDark: boolean;
}

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onUpdate,
  isDark,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const [editedDate, setEditedDate] = useState(new Date(task.date));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleUpdate = () => {
    if (editedText.trim()) {
      onUpdate(task.id, editedText, editedDate);
      setIsEditing(false);
    }
  };

  const onChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEditedDate(selectedDate);
    }
  };

  if (isEditing) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer]}>
        <View style={styles.editContainer}>
          <TextInput
            style={[styles.editInput, isDark && styles.darkEditInput]}
            value={editedText}
            onChangeText={setEditedText}
            autoFocus
          />
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar" size={20} color={isDark ? '#FFFFFF' : '#007AFF'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
            <Ionicons name="checkmark" size={20} color="white" />
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={editedDate}
            mode="date"
            display="default"
            onChange={onChange}
            minimumDate={new Date()}
          />
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.taskContent}>
        <Checkbox
          value={task.completed}
          onValueChange={() => onToggle(task.id)}
          color={task.completed ? '#007AFF' : undefined}
        />
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.text,
              task.completed && styles.completedText,
              isDark && styles.darkText,
            ]}>
            {task.text}
          </Text>
          <Text style={[styles.date, isDark && styles.darkDate]}>
            {new Date(task.date).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => setIsEditing(true)}
          style={styles.editButton}>
          <Ionicons name="pencil" size={20} color={isDark ? '#FFFFFF' : '#007AFF'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(task.id)}
          style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  darkContainer: {
    backgroundColor: '#1C1C1E',
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  darkText: {
    color: '#FFFFFF',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  darkDate: {
    color: '#888888',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 5,
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    color: '#000000',
  },
  darkEditInput: {
    borderColor: '#333333',
    color: '#FFFFFF',
    backgroundColor: '#2C2C2E',
  },
  dateButton: {
    padding: 5,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#4CD964',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});