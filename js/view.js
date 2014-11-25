(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }
		
  var View = SnakeGame.View = function ($el, highScore) {
		var img = new Image();
		img.src = "./images/drakeface.png";
    this.$el = $el;
		this.paused = true;
		this.highScore = highScore;
		this.inPlay = false;
    this.board = new SnakeGame.Board(18);
		this.beginScreen();
  };

  View.KEYS = {
    38: "U",
    39: "R",
    40: "D",
    37: "L"
  };

  View.STEP_MILLIS = 100;
	
	View.prototype.beginScreen = function () {
		($(".modal").toggleClass("is-active"));
		$(window).on("keydown", this.handleStartKeyEvent.bind(this));
	};
	
  View.prototype.handleStartKeyEvent = function (event) {
		if (event.keyCode == 32){
			event.preventDefault();
			this.start();
    } else {
      // inactive key, ignore.
    }
  };
	
	View.prototype.start = function () {
		($(".modal").toggleClass("is-active"));
		($(".start").removeClass("modal-display"));
		($(".start").removeClass("current"));
		($(".pause").addClass("current"));
		$(window).off()
		this.paused = false;
		this.inPlay = true;
		
    this.intervalId = window.setInterval(
      this.step.bind(this),
      View.STEP_MILLIS
    );
		
    $(window).on("keydown", this.handleKeyEvent.bind(this));
	};
	

  View.prototype.handleKeyEvent = function (event) {
		if (event.keyCode == 32 && !this.inPlay){
			this.reset(this.highScore);
		} else if (event.keyCode == 32){
			event.preventDefault();
			this.handlePause();
		} else if (View.KEYS[event.keyCode]) {
			event.preventDefault();
      this.board.snake.turn(View.KEYS[event.keyCode]);
    } else {
      // inactive key, ignore.
    }
  };
	
	View.prototype.handlePause = function () {
		this.paused = !this.paused;
		($(".modal").toggleClass("is-active"));
	}

  View.prototype.render = function () {

    var view = this;
    var board = view.board;

    var cellsMatrix = buildCellsMatrix();
		
    board.snake.segments.forEach(function (seg) {
      cellsMatrix[seg.x][seg.y].addClass("snake");
    });
		
		var headIdx = board.snake.segments.length - 1;
		var head = board.snake.segments[headIdx];
		if (head){ 
			cellsMatrix[head.x][head.y].addClass("drake");
		}
		
		$( "li#points" ).text( "Points " + this.board.points );
		$( "li#high_score").text( "High Score " + this.highScore );

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
	
	View.prototype.reset = function (highScore) {
		($(".modal-display").toggleClass("current"));
		($(".modal").toggleClass("is-active"));
		this.paused = false;
		this.inPlay = true;
		this.highScore = highScore;
		this.board = new SnakeGame.Board(18);
		$(".reset").off();
		$(window).off();
    this.intervalId = window.setInterval(
      this.step.bind(this),
      View.STEP_MILLIS
    );
		
    $(window).on("keydown", this.handleKeyEvent.bind(this));
	};
	
	View.prototype.over = function () {
		this.inPlay = false;
		window.clearInterval(this.intervalId);
		
		($(".modal").toggleClass("is-active"));
		($(".modal-display").toggleClass("current"));
		
		if (this.board.points > this.highScore) {
			this.highScore = this.board.points;
		}
		
		var currentView = this;

		$(".reset").click(function() {
			currentView.reset(currentView.highScore);	
		})
	}
	
  View.prototype.step = function () {
		if (this.paused) {
			// do nothing, wait to unpause
		} else if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
    } else {
			this.over();
    }
  };
	
	
})();