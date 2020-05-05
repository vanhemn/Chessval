module.exports = function(socket, io) {
	socket.on('chat', (data) => {
		if (!socket.displayname) {
			socket.displayname = socket.id;
		}
		io.to(socket.mainroom).emit('chat', {id: socket.displayname, msg: data}) 
	});
	socket.on('displayname', (data) => { 
		socket.displayname = data.displayname; 
	});
}