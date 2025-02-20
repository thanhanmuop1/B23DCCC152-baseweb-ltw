import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, Progress, Space, Alert, Typography } from 'antd';
import { useEffect } from 'react';
import useRandomNumber from '@/services/RandomNumber';
import RandomNumberForm from './form';

const { Title } = Typography;

const RandomNumber: React.FC = () => {
	const { guessCount, gameOver, message, isWin, initGame, makeGuess } = useRandomNumber();

	useEffect(() => {
		initGame();
	}, []);

	const handleGuess = (values: { number: number }) => {
		makeGuess(values.number);
	};

	return (
		<PageContainer>
			<Card
				title={
					<Title level={3} style={{ margin: 0, textAlign: 'center' }}>
						Trò Chơi Đoán Số
					</Title>
				}
				extra={
					<Button type='primary' onClick={initGame} size='large'>
						Chơi Lại
					</Button>
				}
				style={{ maxWidth: 800, margin: '0 auto' }}
				className='game-card'
			>
				<Space direction='vertical' style={{ width: '100%' }} size='large' align='center'>
					<Alert
						message={message}
						type={isWin ? 'success' : gameOver ? 'error' : 'info'}
						showIcon
						style={{ width: '100%' }}
						className='game-alert'
					/>

					<div className='progress-container'>
						<Progress
							type='circle'
							percent={(guessCount / 10) * 100}
							format={() => (
								<div className='progress-text'>
									<div>{10 - guessCount}</div>
									<div style={{ fontSize: '14px' }}>lượt còn lại</div>
								</div>
							)}
							status={gameOver ? (isWin ? 'success' : 'exception') : 'active'}
						/>
					</div>

					<div className='form-container'>
						<RandomNumberForm onFinish={handleGuess} disabled={gameOver} />
					</div>

					{guessCount > 0 && (
						<div className='guess-count'>
							Số lần đã đoán: <strong>{guessCount}/10</strong>
						</div>
					)}
				</Space>
			</Card>
		</PageContainer>
	);
};

export default RandomNumber;
