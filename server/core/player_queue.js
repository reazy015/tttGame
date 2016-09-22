// Лист игроков формируется каждую секунду
// Объект игрока выглядит следующим образом
//    player = {
//      id: '/#JuD2NocDEVP2V1RzAAAb', (socket ID)
//      name: 'Josh',
//    }

function PlayerQueue() {
  this.queue = [];
}

PlayerQueue.prototype.addPlayer = function(player) {
  this.queue.push(player);
};

PlayerQueue.prototype.removePlayer = function(playerId) {
  for (var i = 0; i < this.queue.length; i++) {
    if (this.queue[i].id === playerId) {
      this.queue.splice(i, 1);
      return true;
    }
    else { return false; } // ни один игрок не удаляется
  }
};

PlayerQueue.prototype.startPolling = function(time, callback) {
  var queue = this.queue;
  setInterval(function () {
    // Если подключилось два игрока - останавливаемся
    if (queue.length < 2) { return; }

    // Берем двух случайных игроков и обрабатываем их колбэк функцией
    var index = Math.floor(Math.random() * queue.length);
    const player1 = queue[index];
    queue.splice(index, 1);

    index = Math.floor(Math.random() * queue.length);
    const player2 = queue[index];
    queue.splice(index, 1);

    callback(player1, player2);

  }, time);
};

module.exports = PlayerQueue;
