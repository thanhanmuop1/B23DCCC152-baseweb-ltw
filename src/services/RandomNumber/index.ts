import { useState } from 'react';

const useRandomNumber = () => {
	const [randomNumber, setRandomNumber] = useState<number>(0);
	const [guessCount, setGuessCount] = useState<number>(0);
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [message, setMessage] = useState<string>('');
	const [isWin, setIsWin] = useState<boolean>(false);

	const initGame = () => {
		const newNumber = Math.floor(Math.random() * 100) + 1;
		setRandomNumber(newNumber);
		setGuessCount(0);
		setGameOver(false);
		setMessage('Hãy đoán một số từ 1 đến 100');
		setIsWin(false);
		console.log('Số cần đoán:', newNumber);
	};

	const makeGuess = (guessNumber: number) => {
		if (gameOver) return;

		const newGuessCount = guessCount + 1;
		setGuessCount(newGuessCount);

		if (guessNumber === randomNumber) {
			setMessage('Chúc mừng! Bạn đã đoán đúng!');
			setGameOver(true);
			setIsWin(true);
		} else if (newGuessCount >= 10) {
			setMessage(`Bạn đã hết lượt! Số đúng là ${randomNumber}.`);
			setGameOver(true);
		} else if (guessNumber < randomNumber) {
			setMessage('Bạn đoán quá thấp!');
		} else {
			setMessage('Bạn đoán quá cao!');
		}
	};

	return {
		guessCount,
		gameOver,
		message,
		isWin,
		initGame,
		makeGuess,
	};
};

export default useRandomNumber;
