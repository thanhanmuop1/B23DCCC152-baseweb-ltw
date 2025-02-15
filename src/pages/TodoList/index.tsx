import { Card, List, Typography } from 'antd';
import { useModel } from 'umi';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import styles from './index.less';

const TodoList = () => {
	const { todos, toggleTodo, deleteTodo } = useModel('todolist');

	const completedCount = todos.filter((todo) => todo.completed).length;

	return (
		<Card className={styles.container}>
			<Typography.Title level={2} className={styles.title}>
				Todo List
			</Typography.Title>

			<TodoForm />

			<List
				className={styles.list}
				itemLayout='horizontal'
				dataSource={todos}
				renderItem={(todo) => <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />}
				footer={
					<div className={styles.footer}>
						<Typography.Text type='secondary'>
							{completedCount} of {todos.length} completed
						</Typography.Text>
					</div>
				}
			/>
		</Card>
	);
};

export default TodoList;
