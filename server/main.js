exports = module.exports = function(io) {
  var PlayerQueue = require('./core/player_queue');
  var Game = require('./core/game');
  const BOARD_SIZE = 3; 

  var playerQueue = new PlayerQueue();
  var currentGames = {};

  // Кода выбраны два игрока запускается соотвествующая колбэк функция
  playerQueue.startPolling(2000, function(player1, player2) {
    var newGame = new Game(player1, player2, BOARD_SIZE);
    if (!currentGames[newGame.id]) {
      currentGames[newGame.id] = newGame;
    }

    // Информацаия для игроков, чтобы они знали, что они в игре
    // Отправить:
    const data = {
      player1:     newGame.player1,
      player2:     newGame.player2,
      whoseTurn:   newGame.whoseTurn,
      boardLayout: newGame.board.squares,
      gameId:      newGame.id
    };

    io.to(player1.id).to(player2.id).emit('game created', data);
    console.log(currentGames);
  });
  // При наступлении события 'connection' сообщить в консоль
  io.on('connection', function(socket) {
    console.log('Client connected with ID:', socket.id);

    socket.on('disconnect', function() {
      console.log('Client disconnected with ID:', socket.id);
      // Если покинул, находясь в очереди, то просто удалить
      if (playerQueue.removePlayer(socket.id)) {
        console.log('Removed player', socket.id);
      }
      // Если в игре, то сгенерировать событие в для других игроков
      for (var game in currentGames) {
        if (currentGames.hasOwnProperty(game)) {
          var thisGame = currentGames[game];
          if (thisGame.player1.id === socket.id) {
            // сгенерировать для второго игрока
            io.to(thisGame.player2.id).emit('player disconnect');
            // закончить игру (kill)
            delete currentGames[game];
          }
          else if (thisGame.player2.id === socket.id) {
            io.to(thisGame.player1.id).emit('player disconnect');
            delete currentGames[game];
          }
          console.log(currentGames);
        }
      }
    });

    socket.on('join queue', function(data) {
      if (data) {
        const player = {
          id: socket.id,
          name: data.name
        };
        playerQueue.addPlayer(player);
        console.log('Player joined queue', socket.id);
        io.to(socket.id).emit('join success', {success: 'success'});
      }
      console.log('Player queue:', playerQueue.queue);

    });

    socket.on('make move', function(data) {
      const game = currentGames[data.gameId];
      game.move(data.player, data.coords);

      console.log('Game: ' + game.id);
      console.log(data.player.name + ' made a move');
      console.log('Board: \n' + game.board.squares);

      const moveResponse = {
        whoseTurn: game.whoseTurn,
        newLayout: game.board.squares
      };
      io.to(game.player1.id).to(game.player2.id).emit('move made', moveResponse);

      // Проверка, закончена ли игра
      if (game.gameOver && game.winner) {
        console.log('Game ' + game.id + ' FINISHED');
        console.log('Winner: ' + game.winner.name);

        // сгенерировать для всех игроков
        io.to(game.player1.id).to(game.player2.id).emit('game over', game.winner);
        // закончить игру
        delete currentGames[data.gameId];
      }
      else if (game.gameOver && !game.winner) { //draw
        console.log('Game ' + game.id + ' FINISHED');
        console.log('DRAW');
        // сгенерировать для всех игроков
        io.to(game.player1.id).to(game.player2.id).emit('game over', game.winner);
        // закончить игру
        delete currentGames[data.gameId];
      }
    });
  });
};
