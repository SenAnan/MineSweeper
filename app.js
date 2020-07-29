const grid = document.querySelector('.grid');

const width = 10;
const bombCount = Math.floor((width * width) / 5);
let flags = 0;
document.documentElement.style.setProperty('--grid-width', width);
const squares = [];
flagSquares = [];
let isGameOver = false;

const addFlag = (e) => {
	e.preventDefault();
	const square = e.target;
	if (isGameOver) return;
	if (square.classList.contains('checked')) return;
	if (!square.classList.contains('flag') && flags < bombCount) {
		square.classList.add('flag');
		square.textContent = 'FLAG';
		flags++;
		flagSquares.push(parseInt(square.id));
		checkForWin();
	} else {
		square.classList.remove('flag');
		square.textContent = '';
		const j = flagSquares.indexOf(parseInt(square.id));
		console.log(j);
		if (j != -1) flagSquares.splice(j, 1);
		flags--;
	}
};

const createBoard = () => {
	const bombsArray = Array(bombCount).fill('bomb');
	const emptyArray = Array(width * width - bombCount).fill('valid');

	const gameArray = emptyArray.concat(bombsArray);

	for (let i = gameArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * i);
		const temp = gameArray[i];
		gameArray[i] = gameArray[j];
		gameArray[j] = temp;
	}

	for (let i = 0; i < width * width; i++) {
		const square = document.createElement('div');
		square.setAttribute('id', i);
		square.classList.add(gameArray[i]);
		grid.appendChild(square);
		squares.push(square);
		square.addEventListener('click', reveal);
		square.addEventListener('contextmenu', addFlag);
	}

	for (let i = 0; i < squares.length; i++) {
		if (squares[i].classList.contains('bomb')) {
			squares[i].setAttribute('data', 0);
			continue;
		}
		const lefty = i % width === 0;
		const righty = i % width === width - 1;
		let count = 0;

		// Check top-left
		if (!lefty && i - width - 1 >= 0 && squares[i - width - 1].classList.contains('bomb'))
			count++;
		// Check top
		if (i - width >= 0 && squares[i - width].classList.contains('bomb')) count++;
		// Check top right
		if (!righty && i - width + 1 >= 0 && squares[i - width + 1].classList.contains('bomb'))
			count++;
		// Check left
		if (!lefty && squares[i - 1].classList.contains('bomb')) count++;
		// Check right
		if (!righty && squares[i + 1].classList.contains('bomb')) count++;
		// Check bottom left
		if (
			!lefty &&
			i + width - 1 <= width * width - 1 &&
			squares[i + width - 1].classList.contains('bomb')
		)
			count++;
		// Check bottom
		if (i + width <= width * width - 1 && squares[i + width].classList.contains('bomb'))
			count++;
		// Check bottom right
		if (
			!righty &&
			i + width + 1 <= width * width - 1 &&
			squares[i + width + 1].classList.contains('bomb')
		)
			count++;

		squares[i].setAttribute('data', count);
	}
};

const reveal = (e) => {
	let square = e;
	if (e.target) square = e.target;
	if (isGameOver || square.classList.contains('checked') || square.classList.contains('flag'))
		return;
	if (square.classList.contains('bomb')) {
		gameOver();
		return;
	}
	const total = square.getAttribute('data');
	square.classList.add('checked');
	if (total != 0) {
		square.textContent = total;
	} else {
		checkSquare(square);
	}
};

const checkSquare = (square) => {
	const i = parseInt(square.id);
	const lefty = i % width === 0;
	const righty = i % width === width - 1;

	if (!lefty && i - width - 1 >= 0) {
		reveal(squares[i - width - 1]);
	}
	if (i - width >= 0) {
		reveal(squares[i - width]);
	}
	if (!righty && i - width + 1 >= 0) {
		reveal(squares[i - width + 1]);
	}
	if (!lefty) {
		reveal(squares[i - 1]);
	}
	if (!righty) {
		reveal(squares[i + 1]);
	}
	if (!lefty && i + width - 1 <= width * width - 1) {
		reveal(squares[i + width - 1]);
	}
	if (i + width < width * width - 1) {
		reveal(squares[i + width]);
	}
	if (!righty && i + width + 1 <= width * width - 1) {
		reveal(squares[i + width + 1]);
	}
};

const gameOver = () => {
	console.log('BOOM! Game Over!');
	isGameOver = true;
	squares.forEach((el) => {
		if (el.classList.contains('bomb')) {
			el.textContent = 'BOMB';
			if (el.classList.contains('flag')) {
				el.classList.add('defused');
			} else {
				el.classList.add('blown');
			}
		}
	});
};

const checkForWin = () => {
	if (flags == bombCount) {
		for (i = 0; i < flags - 1; i++) {
			if (!squares[flagSquares[i]].classList.contains('bomb')) {
				return false;
			}
		}
		console.log('YOU WIN');
		isGameOver = true;
	} else {
		for (let i = 0; i < squares.length - 1; i++) {
			if (squares[i].classList.contains('checked')) continue;
			if (squares[i].classList.contains('flag') && !squares[i].classList.contains('bomb'))
				return false;
			if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb'))
				continue;
			if (squares[i].getAttribute('data') != 0) return false;
		}
		console.log('YOU WIN');
		isGameOver = true;
	}
};

createBoard();
