import { Button, Form, InputNumber, Space } from 'antd';
import type { FC } from 'react';

interface RandomNumberFormProps {
	onFinish: (values: { number: number }) => void;
	disabled: boolean;
}

const RandomNumberForm: FC<RandomNumberFormProps> = ({ onFinish, disabled }) => {
	const [form] = Form.useForm();

	return (
		<Form
			form={form}
			onFinish={(values) => {
				onFinish(values);
				form.resetFields();
			}}
			className='guess-form'
		>
			<Space size='middle'>
				<Form.Item
					name='number'
					rules={[
						{ required: true, message: 'Vui lòng nhập số!' },
						{ type: 'number', min: 1, max: 100, message: 'Vui lòng nhập số từ 1 đến 100!' },
					]}
					style={{ marginBottom: 0 }}
				>
					<InputNumber
						placeholder='Nhập số từ 1-100'
						disabled={disabled}
						style={{ width: '150px' }}
						size='large'
						min={1}
						max={100}
					/>
				</Form.Item>
				<Form.Item style={{ marginBottom: 0 }}>
					<Button type='primary' htmlType='submit' disabled={disabled} size='large'>
						Đoán Số
					</Button>
				</Form.Item>
			</Space>
		</Form>
	);
};

export default RandomNumberForm;
