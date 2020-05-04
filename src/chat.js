module.exports = function(socket, io) {
	socket.on('chat', (data) => { io.emit('chat', {id: socket.id, msg: data}) });
}