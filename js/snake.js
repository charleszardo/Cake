(function () {
	if (typeof SnakeGame === "undefined"){
		window.SnakeGame = {};
	};
	
	var Coord = SnakeGame.Coord = function (x, y) {
		this.x = x;
		this.y = y;
	};
	
	Coord.prototype.equals = function (coord2) {
		return (this.x == coord2.x) && (this.y == coord2.y);
	};
	
	Coord.prototype.plus = function (coord2) {
		return new Coord(this.x + coord2.x, this.y + coord2.y);
	};
	
	Coord.prototype.isOpposite = function (coord2) {
		return (this.x == (-1 & coord2.x)) && (this.y == (-1 * coord2.y));
	};
	
	var Apple = SnakeGame.Apple = function (board) {
		this.board = board;
		this.place();
	};
	
	Apple.prototype.place = function () {
		var x = Math.floor(Math.random() * this.board.dim);
		var y = Math.floor(Math.random() * this.board.dim);
		
		var pos = new Coord(x, y);
		while (!this.board.emptyCell(pos)){
			var pos = new Coord(x, y);
		};
		
		// this.position = new Coord(x, y);
		this.position = pos;
	};
	
	var Snake = SnakeGame.Snake = function (board) {
		this.dir = "U";
		this.board = board;
		
		var start = new Coord(board.dim / 2, board.dim / 2);
		this.segments = [start];
		
		this.growths = 0;	
	};
	
	Snake.DIFFS = {
		"U": new Coord(-1, 0),
		"R": new Coord(0, 1),
		"D": new Coord(1, 0),
		"L": new Coord(0, -1)
	};
	
	Snake.prototype.head = function () {
		return this.segments[this.segments.length - 1];
	};
	
	Snake.prototype.eat = function () {
		if (this.head().equals(this.board.apple.position)){
			this.growths += 1;
			this.board.points += 1;
			return true;
		} else {
			return false;
		}
	};
	
	Snake.prototype.validMove = function () {
		var head = this.head();
		
		if (!this.board.validPos(this.head())) {
			return false;
		}
		
		for (var i = 0; i < this.segments.length - 1; i++){
			if (this.segments[i].equals(head)){
				return false;
			}
		};
		
		return true;
	};
		
	Snake.prototype.move = function () {
		this.segments.push(this.head().plus(Snake.DIFFS[this.dir]));
		
		if (this.eat()) {
			this.board.apple.place();
		}
		
		if (this.growths > 0) {
			this.growths -= 1;
		} else {
			this.segments.shift();
		}
		
		if (!this.validMove()) {
			this.segments = [];
		}
	};
	
	Snake.prototype.turn = function (dir) {
		if ((this.segments.length > 1) && 
			Snake.DIFFS[this.dir].isOpposite(Snake.DIFFS[dir])) {
			return;
			} else {
				this.dir = dir;
			}
	};
	
	var Board = SnakeGame.Board = function (dim) {
		this.dim = dim;
		this.points = 0;
		
		this.apple = new Apple(this);
		this.snake = new Snake(this);
	};
	
	Board.BLANK_SYM = ".";

	Board.blankGrid = function (dim) {
		var grid = [];
		
		for (var i = 0; i < dim; i++) {
			var row = [];
			for (var j = 0; j < dim; j++) {
				row.push(Board.BLANK_SYM);
			}
			grid.push(row);
		}
		
		return grid;
	};
	
	Board.prototype.emptyCell = function (cell) {
		var currentBoard = this;
		console.log(this.snake)
		if (this.snake){
			currentBoard.snake.segments.forEach(function (segment) {
				if (segment.equals(cell)){
					return false;
				}
			});
		}
		
		if (this.apple){
			if (currentBoard.apple.position.equals(cell)){
				return false;
			}
		}
		
		return true;
	}
	
	Board.prototype.render = function () {
		var grid = Board.blankGrid(this.dim);
		
		this.snake.segments.forEach(function (segment) {
			grid[segment.x][segment.y] = "X";
		});
		
		grid[this.apple.position.x][this.apple.position.y] = "A";
		
		var rowStrs = []
		grid.map(function (row) {
			return row.join("");
		}).join("\n");
	};
	
	Board.prototype.validPos = function (pos){
		return (pos.x >= 0) && (pos.x < this.dim) && (pos.y >= 0) && (pos.y < this.dim);
	};
	
})();