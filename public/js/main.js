const params ={};location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){params[k]=v})
const socket = io.connect('http://localhost:8080');
$('#text').keypress(function (e) {
  if (e.which == 13) {
    socket.emit('chat', $('#text').val());
    $('#text').val("");
    return false;
  }
});

socket.on('connect', () => {
	let room = (window.location.href.split("/")).pop()
	if (room) {
	  	socket.emit("start", {room: room})
	} 
	if (localStorage.getItem("displayname")) {
		socket.emit("displayname", {displayname: localStorage.getItem("displayname")})
	}
});

socket.on('chat', (data) => {
	  		$('#chat').append('<li class="collection-item grey-text text-darken-3">'+data.id.substring(0,12)+" : "+data.msg+'</li>')	
	  	$('.chatbox').scrollTop($('.chatbox').height());
	  })
