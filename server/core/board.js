// Игровая доска (матрица 3*3ь можно сделать большего размера при желании)
function Board(size) {
  if(size < 3) { throw Error('Board cannot be smaller than 3x3'); }
  this.symbols = { X: 'X', O: 'O'};
  this.winningSymbol = undefined;
  this.size = size;
  this.squares = this.buildBoard();
}

// Создаем двумерный массив для игровой доски
Board.prototype.buildBoard = function() {
  var squares = [];

  for (var i = 0; i < this.size; i++) {
    var row = [];
    for (var j = 0; j < this.size; j++) {
      row.push(0);
    }
    squares.push(row);
  }

  return squares;
};

Board.prototype.move = function(x, y, symbol) {
  // проверка на валидность хода игрока
  if (x >= this.size || y >= this.size) { throw Error('Invalid move'); }
  if (!this.symbols[symbol]) { throw Error('Symbol not supported'); }

  // если клетка пустая, то ставим соответствующий игроку знак
  if (this.squares[x][y] === 0) {
    this.squares[x][y] = symbol;
  }
  else { throw Error('Space already taken'); }

  // Проверка победителя
  this.winningSymbol = this.checkWin();
};

// Вернуть символ игрока
Board.prototype.checkWin = function() {
  var currSym, i, j;

  // поверить ряды
  for (i = 0; i < this.size; i++) { // ряд
    currSym = this.squares[i][0];
    for (j = 0; j < this.size; j++)  { // смотрим слева на право
      if(this.squares[i][j] !== currSym) { break; }
      if(j === this.size - 1) { return currSym; } // конец ряда
    }
  }

  // проверить колонки
  for (i = 0; i < this.size; i++) { // колонка
    currSym = this.squares[0][i];
    for (j = 0; j < this.size; j++)  { // смотрим свеху вниз
      if(this.squares[j][i] !== currSym) { break; }
      if(j === this.size - 1) { return currSym; } // конец ряда
    }
  }

  // проверка по диагонали
  for (i = 0; i < this.size; i++) {
    currSym = this.squares[0][0];
    if(this.squares[i][i] !== currSym) { break; }
    if (i === this.size - 1) { return currSym; }
  }

  // проверка по 'анти-диагонали'
  for (i = 0, j = this.size - 1; i < this.size; i++, j--) {
    currSym = this.squares[0][this.size - 1];
    if(this.squares[i][j] !== currSym) { break; }
    if (i === this.size - 1) { return currSym; }
  }

  // проверить, если результат 'ничья'
  var foundEmpty = false;
  for (i = 0; i < this.size; i++) {
    for (j = 0; j < this.size; j++) {
      if (this.squares[i][j] === 0) {
        foundEmpty = true;
        continue;
      }
    }
  }
  if(!foundEmpty) { return 'draw'; }


};

module.exports = Board;
