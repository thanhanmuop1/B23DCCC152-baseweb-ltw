import React, { useState, useEffect } from 'react';
import { Card, Table, Progress, Button, Modal, Form, InputNumber, Select, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import moment from 'moment';

interface Subject {
	id: string;
	name: string;
	description?: string;
	monthlyTarget?: number;
}

interface LearningSession {
	id: string;
	subjectId: string;
	date: string;
	duration: number;
	content: string;
	notes?: string;
}

const StatisticsPage: React.FC = () => {
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [sessions, setSessions] = useState<LearningSession[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		// Load data from localStorage
		const storedSubjects = localStorage.getItem('subject_categories');
		if (storedSubjects) {
			setSubjects(JSON.parse(storedSubjects));
		}

		const storedSessions = localStorage.getItem('learning_sessions');
		if (storedSessions) {
			setSessions(JSON.parse(storedSessions));
		}
	}, []);

	// Tính tổng thời gian học cho mỗi môn
	const calculateTotalDuration = (subjectId: string) => {
		return sessions
			.filter((session) => session.subjectId === subjectId)
			.reduce((total, session) => total + session.duration, 0);
	};

	// Tính toán thời gian học và tiến độ trong tháng hiện tại
	const calculateMonthlyProgress = (subjectId: string) => {
		const currentMonth = moment().startOf('month');
		const monthlyDuration = sessions
			.filter((session) => session.subjectId === subjectId && moment(session.date).isSameOrAfter(currentMonth))
			.reduce((total, session) => total + session.duration, 0);

		const subject = subjects.find((s) => s.id === subjectId);
		const target = subject?.monthlyTarget || 0;

		// Tính số ngày đã qua trong tháng
		const daysInMonth = moment().daysInMonth();
		const daysPassed = moment().date();

		// Tính mục tiêu cần đạt tới thời điểm hiện tại
		const targetUntilNow = target ? Math.round((target * daysPassed) / daysInMonth) : 0;

		return {
			duration: monthlyDuration,
			target,
			targetUntilNow,
			daysLeft: daysInMonth - daysPassed,
			percent: targetUntilNow ? Math.min(Math.round((monthlyDuration / targetUntilNow) * 100), 100) : 0,
		};
	};

	const subjectStatistics = subjects.map((subject) => {
		const progress = calculateMonthlyProgress(subject.id);
		const totalDuration = calculateTotalDuration(subject.id);
		const sessionCount = sessions.filter((session) => session.subjectId === subject.id).length;

		// Tính thời gian cần học mỗi ngày để đạt mục tiêu
		const remainingDuration = progress.target - progress.duration;
		const dailyRequired = progress.daysLeft > 0 ? Math.ceil(remainingDuration / progress.daysLeft) : 0;

		return {
			name: subject.name,
			totalDuration,
			sessionCount,
			monthlyDuration: progress.duration,
			monthlyTarget: progress.target,
			targetUntilNow: progress.targetUntilNow,
			monthlyProgress: progress.percent,
			dailyRequired: dailyRequired > 0 ? dailyRequired : 0,
		};
	});

	const handleEditTarget = (record: any) => {
		const subject = subjects.find((s) => s.name === record.name);
		if (subject) {
			setEditingSubject(subject);
			form.setFieldsValue({
				subjectId: subject.id,
				monthlyTarget: subject.monthlyTarget,
			});
			setIsModalVisible(true);
		}
	};

	const handleModalOk = () => {
		form.validateFields().then((values) => {
			const newSubjects = subjects.map((subject) =>
				subject.id === values.subjectId ? { ...subject, monthlyTarget: values.monthlyTarget } : subject,
			);

			localStorage.setItem('subject_categories', JSON.stringify(newSubjects));
			setSubjects(newSubjects);
			setIsModalVisible(false);
			message.success('Cập nhật mục tiêu thành công');
		});
	};

	return (
		<>
			<Card title='Thống kê học tập'>
				<Table
					dataSource={subjectStatistics}
					columns={[
						{
							title: 'Môn học',
							dataIndex: 'name',
						},
						{
							title: 'Tổng thời gian (phút)',
							dataIndex: 'totalDuration',
						},
						{
							title: 'Số buổi học',
							dataIndex: 'sessionCount',
						},
						{
							title: 'Mục tiêu tháng này',
							dataIndex: 'monthlyTarget',
							render: (target: number, record: any) => (
								<span>
									{target ? `${target} phút` : 'Chưa đặt'}
									<Button type='link' icon={<EditOutlined />} onClick={() => handleEditTarget(record)} />
								</span>
							),
						},
						{
							title: 'Đã học / Mục tiêu hiện tại',
							key: 'currentProgress',
							render: (_, record: any) => `${record.monthlyDuration} / ${record.targetUntilNow} phút`,
						},
						{
							title: 'Tiến độ tháng này',
							key: 'progress',
							render: (_, record: any) => (
								<div style={{ minWidth: 200 }}>
									<Progress
										percent={record.monthlyProgress}
										format={(percent) => `${percent}%`}
										status={
											record.monthlyProgress >= 100 ? 'success' : record.monthlyProgress >= 80 ? 'active' : 'exception'
										}
									/>
									{record.dailyRequired > 0 && (
										<div style={{ fontSize: '12px', color: '#999' }}>
											Cần học thêm: {record.dailyRequired} phút/ngày
										</div>
									)}
								</div>
							),
						},
					]}
					pagination={false}
				/>
			</Card>

			<Modal
				title='Đặt mục tiêu học tập'
				visible={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='subjectId' hidden>
						<InputNumber />
					</Form.Item>

					<Form.Item
						name='monthlyTarget'
						label='Mục tiêu thời gian học (phút/tháng)'
						rules={[{ required: true, message: 'Vui lòng nhập mục tiêu học tập' }]}
						tooltip='Ví dụ: 1200 phút = 20 giờ/tháng ≈ 40 phút/ngày'
					>
						<InputNumber min={1} style={{ width: '100%' }} placeholder='Nhập số phút muốn học trong tháng' />
					</Form.Item>

					<div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
						{form.getFieldValue('monthlyTarget') && (
							<>
								<div>≈ {Math.round(form.getFieldValue('monthlyTarget') / moment().daysInMonth())} phút/ngày</div>
								<div>≈ {Math.round(form.getFieldValue('monthlyTarget') / 60)} giờ/tháng</div>
							</>
						)}
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default StatisticsPage;
