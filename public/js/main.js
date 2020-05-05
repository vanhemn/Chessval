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

function resize_table_chess( id )
{
  $(id).width( 'auto' ).height( 'auto' );
  $(id+' td, '+id+' th').width( 'auto' ).height( 'auto' ).css({ 'font-size':0.1+'em' });
  // on redimensionne pour que le plateau tienne dans la fenêtre
  var sizT = Math.max( Math.max( $(id).width(), $(id).height()), Math.min( $(window).width(), $(window).height())- 60 ); // -40px : marge
  $(id).width( sizT ).height( sizT );
  // on redimensionne les cases ET les pièces du jeu
  var maxWH = sizT/10; // 10x10 cases
  $(id+' td, '+id+' th').width( maxWH ).height( maxWH );
  $(id+' td').css({ 'font-size':Math.floor(100*maxWH/16/1.4)/100+'em' });
  $(id+' th').css({ 'font-size':Math.floor(100*maxWH/16/2.5)/100+'em' });
};
$(window).on( 'load resize', function(){
	resize_table_chess('.chess_table');
});