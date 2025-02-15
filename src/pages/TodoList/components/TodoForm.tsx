import { Button, Form, Input } from 'antd';
import { useModel } from 'umi';

const TodoForm = () => {
	const [form] = Form.useForm();
	const { addTodo } = useModel('todolist');

	const onFinish = (values: { title: string }) => {
		addTodo(values.title);
		form.resetFields();
	};

	return (
		<Form form={form} onFinish={onFinish} layout='inline' style={{ marginBottom: 16 }}>
			<Form.Item name='title' rules={[{ required: true, message: 'Please input your todo!' }]} style={{ flex: 1 }}>
				<Input placeholder='What needs to be done?' />
			</Form.Item>
			<Form.Item>
				<Button type='primary' htmlType='submit'>
					Add Todo
				</Button>
			</Form.Item>
		</Form>
	);
};

export default TodoForm;
