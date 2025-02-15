import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, List, Typography } from 'antd';
import { ITodo } from '@/models/todolist';
import styles from './TodoItem.less';

interface TodoItemProps {
	todo: ITodo;
	onToggle: (id: string) => void;
	onDelete: (id: string) => void;
}

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
	return (
		<List.Item
			actions={[
				<Button
					type='text'
					icon={<CheckOutlined />}
					onClick={() => onToggle(todo.id)}
					className={todo.completed ? styles.completedButton : ''}
				/>,
				<Button type='text' danger icon={<DeleteOutlined />} onClick={() => onDelete(todo.id)} />,
			]}
		>
			<Typography.Text delete={todo.completed} className={todo.completed ? styles.completedText : ''}>
				{todo.title}
			</Typography.Text>
		</List.Item>
	);
};

export default TodoItem;
