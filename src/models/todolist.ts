import { useState } from 'react';

export interface ITodo {
	id: string;
	title: string;
	completed: boolean;
	createdAt: string;
}

export default () => {
	const [todos, setTodos] = useState<ITodo[]>(() => {
		const savedTodos = localStorage.getItem('todos');
		return savedTodos ? JSON.parse(savedTodos) : [];
	});

	const addTodo = (title: string) => {
		const newTodo: ITodo = {
			id: Date.now().toString(),
			title,
			completed: false,
			createdAt: new Date().toISOString(),
		};
		const updatedTodos = [...todos, newTodo];
		setTodos(updatedTodos);
		localStorage.setItem('todos', JSON.stringify(updatedTodos));
	};

	const toggleTodo = (id: string) => {
		const updatedTodos = todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
		setTodos(updatedTodos);
		localStorage.setItem('todos', JSON.stringify(updatedTodos));
	};

	const deleteTodo = (id: string) => {
		const updatedTodos = todos.filter((todo) => todo.id !== id);
		setTodos(updatedTodos);
		localStorage.setItem('todos', JSON.stringify(updatedTodos));
	};

	const editTodo = (id: string, newTitle: string) => {
		const updatedTodos = todos.map((todo) => (todo.id === id ? { ...todo, title: newTitle } : todo));
		setTodos(updatedTodos);
		localStorage.setItem('todos', JSON.stringify(updatedTodos));
	};

	return {
		todos,
		addTodo,
		toggleTodo,
		deleteTodo,
		editTodo,
	};
};
