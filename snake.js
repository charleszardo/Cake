(function () {
	if (typeof SnakeGame = "undefined"){
		window.SnakeGame = {};
	}
	
	var Coord = SnakeGame.Coord = function (x, y) {
		this.x = x;
		this.y = y;
	};
	
	Coord.prototype.plus = function (coord2) {
		return new Coord(this.x + coord2.x, this.y + coord2.y);
	}
	
	var Snake = SnakeGame.Snake = function (board) {
		this.dir = "N";
		this.board = board;
		
	}
}


)

var x = new Coord(1, 2)