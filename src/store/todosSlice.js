import {createSlice} from '@reduxjs/toolkit';
const initialState = {
 items: [
 {id: 1, text: 'Learn Redux', completed: false},
 {id: 2, text: 'Build Todo App', completed: false},
 {id: 3, text: 'Master State Management', completed: false},
 ],
 filter: 'all', // 'all', 'active', 'completed'
};
const todosSlice = createSlice({
 name: 'todos',
 initialState,
 reducers: {
 addTodo: (state, action) => { 
 state.items.push({
 id: Date.now(),
 text: action.payload,
 completed: false,
 });
 },

 toggleTodo: (state, action) => {
 const todo = state.items.find(t => t.id === action.payload);
 if (todo) {
 todo.completed = !todo.completed;
 }
 },

 deleteTodo: (state, action) => {
 state.items = state.items.filter(t => t.id !== action.payload);
 },

 setFilter: (state, action) => {
 state.filter = action.payload;
 },
 },
});
export const {addTodo, toggleTodo, deleteTodo, setFilter} = todosSlice.actions;
export default todosSlice.reducer;