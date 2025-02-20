import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Select, DatePicker, InputNumber, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

interface Subject {
	id: string;
	name: string;
	description?: string;
	monthlyTarget?: number; // Mục tiêu số phút học mỗi tháng
}

interface LearningSession {
	id: string;
	subjectId: string;
	date: string;
	duration: number; // Thời lượng học (phút)
	content: string; // Nội dung đã học
	notes?: string; // Ghi chú
}

const LearningProgress: React.FC = () => {
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [sessions, setSessions] = useState<LearningSession[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingSession, setEditingSession] = useState<LearningSession | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		// Load subjects from localStorage
		const storedSubjects = localStorage.getItem('subject_categories');
		if (storedSubjects) {
			setSubjects(JSON.parse(storedSubjects));
		}

		// Load learning sessions from localStorage
		const storedSessions = localStorage.getItem('learning_sessions');
		if (storedSessions) {
			setSessions(JSON.parse(storedSessions));
		}
	}, []);

	const saveSessionsToLocalStorage = (newSessions: LearningSession[]) => {
		localStorage.setItem('learning_sessions', JSON.stringify(newSessions));
		setSessions(newSessions);
	};

	const handleAdd = () => {
		setEditingSession(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEdit = (record: LearningSession) => {
		setEditingSession(record);
		form.setFieldsValue({
			...record,
			date: moment(record.date),
		});
		setIsModalVisible(true);
	};

	const handleDelete = (id: string) => {
		const newSessions = sessions.filter((session) => session.id !== id);
		saveSessionsToLocalStorage(newSessions);
		message.success('Xóa buổi học thành công');
	};

	const handleModalOk = () => {
		form.validateFields().then((values) => {
			const sessionData = {
				...values,
				id: editingSession?.id || Date.now().toString(),
				date: values.date.format('YYYY-MM-DD HH:mm:ss'),
			};

			let newSessions;
			if (editingSession) {
				newSessions = sessions.map((session) => (session.id === editingSession.id ? sessionData : session));
				message.success('Cập nhật buổi học thành công');
			} else {
				newSessions = [...sessions, sessionData];
				message.success('Thêm buổi học thành công');
			}

			saveSessionsToLocalStorage(newSessions);
			setIsModalVisible(false);
		});
	};

	const getSubjectName = (subjectId: string) => {
		return subjects.find((subject) => subject.id === subjectId)?.name || '';
	};

	const columns = [
		{
			title: 'Môn học',
			dataIndex: 'subjectId',
			key: 'subjectId',
			render: (subjectId: string) => getSubjectName(subjectId),
		},
		{
			title: 'Thời gian',
			dataIndex: 'date',
			key: 'date',
			render: (date: string) => moment(date).format('HH:mm DD/MM/YYYY'),
			sorter: (a: LearningSession, b: LearningSession) => moment(a.date).unix() - moment(b.date).unix(),
		},
		{
			title: 'Thời lượng (phút)',
			dataIndex: 'duration',
			key: 'duration',
			sorter: (a: LearningSession, b: LearningSession) => a.duration - b.duration,
		},
		{
			title: 'Nội dung đã học',
			dataIndex: 'content',
			key: 'content',
			width: 300,
			ellipsis: true,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'notes',
			key: 'notes',
			width: 200,
			ellipsis: true,
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 150,
			render: (_: any, record: LearningSession) => (
				<span>
					<Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa buổi học này?'
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

	// Tính tổng thời gian học cho mỗi môn
	const calculateTotalDuration = (subjectId: string) => {
		return sessions
			.filter((session) => session.subjectId === subjectId)
			.reduce((total, session) => total + session.duration, 0);
	};

	return (
		<>
			<Card title='Chi tiết các buổi học'>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
					Thêm buổi học
				</Button>

				<Table columns={columns} dataSource={sessions} rowKey='id' pagination={{ pageSize: 10 }} />

				<Modal
					title={editingSession ? 'Sửa buổi học' : 'Thêm buổi học mới'}
					visible={isModalVisible}
					onOk={handleModalOk}
					onCancel={() => setIsModalVisible(false)}
					width={600}
				>
					<Form form={form} layout='vertical'>
						<Form.Item name='subjectId' label='Môn học' rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}>
							<Select placeholder='Chọn môn học'>
								{subjects.map((subject) => (
									<Select.Option key={subject.id} value={subject.id}>
										{subject.name}
									</Select.Option>
								))}
							</Select>
						</Form.Item>

						<Form.Item
							name='date'
							label='Thời gian học'
							rules={[{ required: true, message: 'Vui lòng chọn thời gian học' }]}
						>
							<DatePicker showTime format='HH:mm DD/MM/YYYY' style={{ width: '100%' }} />
						</Form.Item>

						<Form.Item
							name='duration'
							label='Thời lượng (phút)'
							rules={[{ required: true, message: 'Vui lòng nhập thời lượng học' }]}
						>
							<InputNumber min={1} style={{ width: '100%' }} />
						</Form.Item>

						<Form.Item
							name='content'
							label='Nội dung đã học'
							rules={[{ required: true, message: 'Vui lòng nhập nội dung đã học' }]}
						>
							<Input.TextArea rows={4} />
						</Form.Item>

						<Form.Item name='notes' label='Ghi chú'>
							<Input.TextArea rows={3} />
						</Form.Item>
					</Form>
				</Modal>
			</Card>
		</>
	);
};

export default LearningProgress;
