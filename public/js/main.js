const socket = io.connect('http://localhost:8080');
$('#text').keypress(function (e) {
  if (e.which == 13) {
    socket.emit('chat', $('#text').val());
    $('#text').val("");
    return false;
  }
});

socket.on('connect', () => {
	  socket.on('chat', (data) => {
	  	$('#chat').append('<li class="collection-item">'+data+'</li>')
	  })
});