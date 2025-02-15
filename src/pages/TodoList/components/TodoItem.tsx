import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, List, Typography, Modal, Input, Form } from 'antd';
import type { ITodo } from '@/models/todolist';
import styles from './TodoItem.less';
import { useState } from 'react';

interface TodoItemProps {
	todo: ITodo;
	onToggle: (id: string) => void;
	onDelete: (id: string) => void;
	onEdit: (id: string, newTitle: string) => void;
}

const TodoItem = ({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [form] = Form.useForm();

	const handleEdit = () => {
		form.setFieldsValue({ title: todo.title });
		setIsEditing(true);
	};

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			onEdit(todo.id, values.title);
			setIsEditing(false);
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	return (
		<>
			<List.Item
				actions={[
					<Button
						key='toggle'
						type='text'
						icon={<CheckOutlined />}
						onClick={() => onToggle(todo.id)}
						className={todo.completed ? styles.completedButton : ''}
					/>,
					<Button key='edit' type='text' icon={<EditOutlined />} onClick={handleEdit} />,
					<Button key='delete' type='text' danger icon={<DeleteOutlined />} onClick={() => onDelete(todo.id)} />,
				]}
			>
				<Typography.Text delete={todo.completed} className={todo.completed ? styles.completedText : ''}>
					{todo.title}
				</Typography.Text>
			</List.Item>

			<Modal title='Edit Todo' visible={isEditing} onOk={handleOk} onCancel={() => setIsEditing(false)}>
				<Form form={form}>
					<Form.Item name='title' rules={[{ required: true, message: 'Please input your todo!' }]}>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default TodoItem;
