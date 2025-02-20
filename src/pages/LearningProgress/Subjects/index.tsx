import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Popconfirm, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface Subject {
	id: string;
	name: string;
	description?: string;
	monthlyTarget?: number; // Mục tiêu số phút học mỗi tháng
}

const SubjectsPage: React.FC = () => {
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const [editingId, setEditingId] = useState<string | null>(null);

	useEffect(() => {
		// Load subjects from localStorage
		const storedSubjects = localStorage.getItem('subject_categories');
		if (storedSubjects) {
			setSubjects(JSON.parse(storedSubjects));
		}
	}, []);

	const saveToLocalStorage = (newSubjects: Subject[]) => {
		localStorage.setItem('subject_categories', JSON.stringify(newSubjects));
		setSubjects(newSubjects);
	};

	const handleAdd = () => {
		setEditingId(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEdit = (record: Subject) => {
		setEditingId(record.id);
		form.setFieldsValue(record);
		setIsModalVisible(true);
	};

	const handleDelete = (id: string) => {
		const newSubjects = subjects.filter((subject) => subject.id !== id);
		saveToLocalStorage(newSubjects);
		message.success('Xóa môn học thành công');
	};

	const handleModalOk = () => {
		form.validateFields().then((values) => {
			const newSubject = {
				...values,
				id: editingId || Date.now().toString(),
			};

			let newSubjects;
			if (editingId) {
				newSubjects = subjects.map((subject) => (subject.id === editingId ? newSubject : subject));
				message.success('Cập nhật môn học thành công');
			} else {
				newSubjects = [...subjects, newSubject];
				message.success('Thêm môn học thành công');
			}

			saveToLocalStorage(newSubjects);
			setIsModalVisible(false);
		});
	};

	const columns = [
		{
			title: 'Tên môn học',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: Subject) => (
				<span>
					<Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa môn học này?'
						onConfirm={() => handleDelete(record.id)}
						okText='Có'
						cancelText='Không'
					>
						<Button type='link' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</span>
			),
		},
	];

	return (
		<Card title='Quản lý danh mục môn học'>
			<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
				Thêm môn học
			</Button>

			<Table columns={columns} dataSource={subjects} rowKey='id' />

			<Modal
				title={editingId ? 'Sửa môn học' : 'Thêm môn học mới'}
				visible={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='name' label='Tên môn học' rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}>
						<Input />
					</Form.Item>
					<Form.Item name='description' label='Mô tả'>
						<Input.TextArea />
					</Form.Item>
					<Form.Item
						name='monthlyTarget'
						label='Mục tiêu học tập (phút/tháng)'
						tooltip='Số phút muốn học trong một tháng'
					>
						<InputNumber min={1} style={{ width: '100%' }} placeholder='Ví dụ: 1200 phút = 20 giờ/tháng' />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default SubjectsPage;
