const COLORS = ["255,108,80", "5,117,18", "29,39,57", "67,189,81"];
const BUBBLE_DENSITY = 50; //количество пузырьков

//начальная позиция пузырька, его размер, скорость движения вверх, прозрачность цвета
function generateDecimalBetween(left, right) {
	return (Math.random() * (left - right) + right).toFixed(2);
}

class Bubble {
	constructor(canvas) {
		this.canvas = canvas;

		this.getCanvasSize();

		this.init();
	}

	getCanvasSize() {
		this.canvasWidth = this.canvas.clientWidth;
		this.canvasHeight = this.canvas.clientHeight;
	}

	init() {
		this.color = COLORS[Math.floor(Math.random() * COLORS.length)]; //случайный цвет из массива
		this.alpha = generateDecimalBetween(5, 10) / 10;
		this.size = generateDecimalBetween(1, 3); //размер пузырьков
		this.translateX = generateDecimalBetween(0, this.canvasWidth); //начальная позиция пузырька
		this.translateY = generateDecimalBetween(0, this.canvasHeight); //начальная позиция пузырька
		this.velocity = generateDecimalBetween(20, 40); //значение скорости
		this.movementX = generateDecimalBetween(-2, 2) / this.velocity; //дельта перемещения по оси х
		this.movementY = generateDecimalBetween(1, 20) / this.velocity; //дельта перемещения по оси у
	}

	move() {
		this.translateX = this.translateX - this.movementX;
		this.translateY = this.translateY - this.movementY;
		//возвращаем обратно на холст
		if (
			this.translateY < 0 ||
			this.translateX < 0 ||
			this.translateX > this.canvasWidth
		) {
			this.init();
			this.translateY = this.canvasHeight;
		}
	}
}
// const canvas = document.getElementById("orb-canvas");

// const bubbles = [];
// bubbles.push(new Bubble(canvas));
// bubbles.push(new Bubble(canvas));
// bubbles.push(new Bubble(canvas));

// console.log(bubbles);

//работаем с холстом, добавляем пузырьки, рисуем их, анимируем
class CanvasBackground {
	constructor(id) {
		//атрибут тега холста
		this.canvas = document.getElementById(id);
		this.ctx = this.canvas.getContext("2d");
		this.dpr = window.devicePixelRatio; //не поняла, зачем нужен, вроде для того, чтобы графика не была мыльной на экранах с высоким разрешением
	}

	start() {
		//запускает анимацию
		this.canvasSize(); //подстраивает размеры холста
		this.generateBubbles(); //создает пузырьки
		this.animate(); //анимирует пузырьки
	}

	canvasSize() {
		this.canvas.width = this.canvas.offsetWidth * this.dpr;
		this.canvas.height = this.canvas.offsetHeight * this.dpr;

		this.ctx.scale(this.dpr, this.dpr);
	}
	//один кадр анимации состоит из: очистить холст, изменить положение пузырьков, нарисовать пузырьки с новым положением, запустить аниманию

	animate() {
		this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

		this.bubblesList.forEach((bubble) => {
			bubble.move(); //изменяем положение пузырьков
			this.ctx.translate(bubble.translateX, bubble.translateY);
			this.ctx.beginPath(); //отрисовка нового пути пузырька
			this.ctx.arc(0, 0, bubble.size, 0, 2 * Math.PI); //рисуем круг
			this.ctx.fillStyle = "rgba(" + bubble.color + "," + bubble.alpha + ")"; // задаем цвет
			this.ctx.fill(); //заливаем его
			this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); //отрисовываем размер пузырька согласно размерам холста
		});

		requestAnimationFrame(this.animate.bind(this)); //запускаем анимацию
	}

	generateBubbles() {
		this.bubblesList = [];
		for (let i = 0; i < BUBBLE_DENSITY; i++) {
			this.bubblesList.push(new Bubble(this.canvas));
		}
	}
}

const canvas = new CanvasBackground("orb-canvas");
canvas.start();
