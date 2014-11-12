(function (){
	if (typeof SnakeGame == "undefined") {
		window.SnakeGame = {};
	}
	
	var View = SnakeGame.View = function ($el) {
		this.$el = $el;
		
		this.board = new SnakeGame.Board(20);
		this.intervalid = window.setInterval(
			this.step.bind(this),
			View.STEP_MILLIS
		);
		
		$(window).on("keydown", this.handleKeyEvent.bind(this));
	};
	
	View.KEYS = {
		38: "U",
		39: "R",
		40: "D",
		37: "L"
	};
	
	View.STEP_MILLIS = 100;
	
	View.prototype.handleKeyEvent = function (event) {
		if (View.KEYS[event.keyCode]) {
			this.board.snake.turn(View.KEYS[event.keyCode]);
		} else {
			
		}
	};
})();