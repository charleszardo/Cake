(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var View = SnakeGame.View = function ($el) {
    this.$el = $el;

    this.board = new SnakeGame.Board(20);
    this.intervalId = window.setInterval(
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
      // ignore.
    }
  };

  View.prototype.render = function () {

    var view = this;
    var board = view.board;

    var cellsMatrix = buildCellsMatrix();
		
    board.snake.segments.forEach(function (seg) {
      cellsMatrix[seg.x][seg.y].addClass("snake");
    });
		
		$( "li#points" ).text( "Points " + this.board.points );
		
		// console.log(board.snake.segments)

    cellsMatrix[board.apple.position.x][board.apple.position.y].addClass("apple");

    this.$el.empty();
    cellsMatrix.forEach(function (row) {
      var $rowEl = $('<div class="row"></div>');
      row.forEach(function ($cell) { $rowEl.append($cell) });
      view.$el.append($rowEl);
    });

    function buildCellsMatrix () {
      var cellsMatrix = [];
      for (var i = 0; i < board.dim; i++) {
        var cellsRow = [];
        for (var j = 0; j < board.dim; j++) {
          cellsRow.push($('<div class="cell"></div>'));
        }
        cellsMatrix.push(cellsRow);
      }

      return cellsMatrix;
    }
  };

  View.prototype.step = function () {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
    } else {
      var c = confirm("You lose!  Play again?");
      window.clearInterval(this.intervalId);
			this.board.points = 0;
			if (c == true) {
				new SnakeGame.View($("#grid"));
			}
    }
  };
})();