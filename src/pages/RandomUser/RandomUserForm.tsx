import { Button, Form, Input } from 'antd';
import type { FC } from 'react';

interface RandomUserFormProps {
	row?: RandomUser.Record;
	isEdit: boolean;
	setVisible: (visible: boolean) => void;
	getDataUser: () => void;
}

const RandomUserForm: FC<RandomUserFormProps> = ({ row, isEdit, setVisible, getDataUser }) => {
	const [form] = Form.useForm();

	const onFinish = (values: any) => {
		if (isEdit) {
			const dataLocal: any = JSON.parse(localStorage.getItem('data') as any);
			const newData = dataLocal.map((item: any) => {
				if (item.address === row?.address) {
					return values;
				}
				return item;
			});
			localStorage.setItem('data', JSON.stringify(newData));
		} else {
			const dataLocal: any = JSON.parse(localStorage.getItem('data') as any) || [];
			dataLocal.push(values);
			localStorage.setItem('data', JSON.stringify(dataLocal));
		}
		getDataUser();
		setVisible(false);
	};

	return (
		<Form form={form} initialValues={row} onFinish={onFinish} layout='vertical'>
			<Form.Item label='Address' name='address' rules={[{ required: true, message: 'Please input address!' }]}>
				<Input />
			</Form.Item>
			<Form.Item label='Balance' name='balance' rules={[{ required: true, message: 'Please input balance!' }]}>
				<Input />
			</Form.Item>
			<Form.Item>
				<Button type='primary' htmlType='submit'>
					{isEdit ? 'Update' : 'Submit'}
				</Button>
			</Form.Item>
		</Form>
	);
};

export default RandomUserForm;
