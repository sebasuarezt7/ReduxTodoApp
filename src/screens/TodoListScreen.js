import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { addTodo, toggleTodo, deleteTodo, setFilter } from '../store/todosSlice';

const TodoListScreen = () => {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos.items);
  const filter = useSelector(state => state.todos.filter);
  const [newTodoText, setNewTodoText] = useState('');

  // --- FILTER TODOS ---
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // --- STATS ---
  const totalTodos = todos.length;
  const completedTodos = todos.filter(t => t.completed).length;
  const activeTodos = totalTodos - completedTodos;

  // --- HANDLERS ---
  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      dispatch(addTodo(newTodoText.trim()));
      setNewTodoText('');
    }
  };

  const handleToggleTodo = id => {
    dispatch(toggleTodo(id));
  };

  const handleDeleteTodo = id => {
    Alert.alert(
      'Delete Todo',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => dispatch(deleteTodo(id)), style: 'destructive' },
      ]
    );
  };

  // --- RENDER TODO ITEM ---
  const renderTodo = ({ item }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity onPress={() => handleToggleTodo(item.id)} style={styles.checkbox}>
        <Icon
          name={item.completed ? 'check-box' : 'check-box-outline-blank'}
          size={24}
          color={item.completed ? '#4CAF50' : '#999'}
        />
      </TouchableOpacity>

      <Text style={[styles.todoText, item.completed && styles.todoTextCompleted]}>
        {item.text}
      </Text>

      <TouchableOpacity onPress={() => handleDeleteTodo(item.id)} style={styles.deleteButton}>
        <Icon name="delete" size={24} color="#f44336" />
      </TouchableOpacity>
    </View>
  );

  // --- RETURN UI ---
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Redux Todo App</Text>
        <Text style={styles.stats}>
          {totalTodos} total • {activeTodos} active • {completedTodos} completed
        </Text>
      </View>

      {/* ADD TODO INPUT */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo..."
          value={newTodoText}
          onChangeText={setNewTodoText}
          onSubmitEditing={handleAddTodo}
          returnKeyType="done"
        />

        <TouchableOpacity
          style={[styles.addButton, !newTodoText.trim() && styles.addButtonDisabled]}
          onPress={handleAddTodo}
          disabled={!newTodoText.trim()}
        >
          <Icon name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* FILTER BUTTONS */}
      <View style={styles.filterContainer}>
        {['all', 'active', 'completed'].map(filterType => (
          <TouchableOpacity
            key={filterType}
            style={[styles.filterButton, filter === filterType && styles.filterButtonActive]}
            onPress={() => dispatch(setFilter(filterType))}
          >
            <Text style={[styles.filterText, filter === filterType && styles.filterTextActive]}>
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TODO LIST */}
      <FlatList
        data={filteredTodos}
        renderItem={renderTodo}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="check-circle-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No todos yet</Text>
          </View>
        }
      />
    </View>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  header: {
    backgroundColor: '#3498db',
    padding: 20,
    paddingTop: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },

  stats: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 12,
  },

  addButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButtonDisabled: {
    opacity: 0.5,
  },

  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },

  filterButtonActive: {
    backgroundColor: '#3498db',
  },

  filterText: {
    fontSize: 14,
    color: '#333',
  },

  filterTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },

  list: {
    flex: 1,
  },

  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  checkbox: {
    marginRight: 12,
    padding: 4,
  },

  todoText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },

  deleteButton: {
    padding: 8,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },

  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
  },
});

export default TodoListScreen;