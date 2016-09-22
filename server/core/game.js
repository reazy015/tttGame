var Board = require('./board.js');

function Game(player1, player2, size) {
  this.player1 = {
    id: player1.id,
    name: player1.name,
    symbol: 'X'
  };
  this.player2 = {
    id: player2.id,
    name: player2.name,
    symbol: 'O'
  };
  this.whoseTurn = this.player1.id;
  this.board = new Board(size);
  this.id = Date.now(); // в качетсве id берем текующее время
  this.gameOver = false;
  this.winner = undefined;
}

Game.prototype.move = function(player, coords) {
  // Если игра закончена, ход отменить
  if (this.gameOver) { throw Error('Game over!'); }
  // Если ход делается не в свой черед, ход отменить
  if (player.id !== this.whoseTurn) { throw Error('Move out of turn not allowed'); }

  // поменять доску
  this.board.move(coords.x, coords.y, player.symbol);

  // проверка хода(кто ходит)
  this.whoseTurn = player.id === this.player1.id ? this.player2.id : this.player1.id;

  // если игра закончена
  if (this.board.winningSymbol === this.player1.symbol) {
    this.gameOver = true;
    this.winner = this.player1;
  }
  else if (this.board.winningSymbol === this.player2.symbol) {
    this.gameOver = true;
    this.winner = this.player2;
  }
  else if (this.board.winningSymbol === 'draw') {
    this.gameOver = true;
  }
};


module.exports = Game;
