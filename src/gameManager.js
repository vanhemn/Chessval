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
	});
}