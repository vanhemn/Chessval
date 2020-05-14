const Game = require('./../src/game.js');
module.exports = function(socket, io) {
	socket.on('start', (data) => {
		/*clear old list*/
		for (const room of socket.roomslist) {
			socket.leave(room)
		}
		socket.roomslist.push(data.room)
		/*join room*/
		socket.join(data.room);
		/*set game room*/
		socket.mainroom = data.room;
		let room = io.sockets.adapter.rooms[socket.mainroom];

		if (!room.game)
			room.game = new Game();

		room.game.addPlayer(socket.id, socket.id)

		if (Object.keys(room.game.players).length == 2) {
			console.log("start game")
			io.to(socket.mainroom).emit('start', room.game);
		}
	});

	socket.on("debug" , data => {
		let piece =  io.sockets.adapter.rooms[socket.mainroom].game.createPiece(socket.id, data.name, data.pos)
		if (piece){
			io.to(socket.mainroom).emit('appendPiece', {obj: piece, game: io.sockets.adapter.rooms[socket.mainroom].game});
		}	
	})

	socket.on('move', (data) => {
		let rep = io.sockets.adapter.rooms[socket.mainroom].game.movePiece(socket.id, data.to, data.object)
		if (rep) {
			rep.game = io.sockets.adapter.rooms[socket.mainroom].game
			io.to(socket.mainroom).emit('move', rep);
		}	
	})

	socket.on('attack', (data) => {
		console.log(data)
		let rep = io.sockets.adapter.rooms[socket.mainroom].game.attack(socket.id, data.from, data.target)
		if (rep) {
			io.to(socket.mainroom).emit('attack', {obj: rep, game: io.sockets.adapter.rooms[socket.mainroom].game});
		}	
	})

}