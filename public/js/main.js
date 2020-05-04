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
	  	if (socket.id == data.id)
	  		$('#chat').append('<li class="collection-item">'+data.id.substring(0,4)+" : "+data.msg+'</li>')
	  	else
	  		$('#chat').append('<li class="collection-item grey-text text-darken-3">'+data.id.substring(0,4)+" : "+data.msg+'</li>')	
	  	$('.chatbox').scrollTop($('.chatbox').height());
	  })
});