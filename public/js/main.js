const params ={};location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){params[k]=v})
const socket = io.connect('loaclhost:8080');
let gameData;
let color;


$('#text').keypress(function (e) {
	if (e.which == 13) {
		socket.emit('chat', $('#text').val());
		$('#text').val("");
		return false;
	}
});

socket.on('connect', () => {
	let room = (window.location.href.split("/")).pop()
	socket.emit("displayname", {displayname: localStorage.getItem("displayname")})
	if (room) {
		socket.emit("start", {room: room})
	} 
	
});

socket.on('start', (data) => {
	gameData = data
})

socket.on('chat', (data) => {
	$('#chat').append('<li class="collection-item grey-text text-darken-3">'+data.id.substring(0,12)+" : "+data.msg+'</li>')	
	$('.chatbox').scrollTop($('.chatbox').height());
})

socket.on('appendPiece', (data) => {
	game.place(null, data.obj, data.game)
})

socket.on('move', (data) => {
	game.place(data.from, data.obj, data.game)
})

/*crée selon la taille coter serveur*/
function resize_table_chess( id )
{
	$(id).width( 'auto' ).height( 'auto' );
  // $(id+' td, '+id+' th').width( 'auto' ).height( 'auto' ).css({ 'font-size':0.1+'em' });
  // on redimensionne pour que le plateau tienne dans la fenêtre
  var sizT = Math.max( Math.max( $(id).width(), $(id).height()), Math.min( $(window).width(), $(window).height())- 60 ); // -40px : marge
  $(id).width( sizT ).height( sizT );
  // on redimensionne les cases ET les pièces du jeu
  var maxWH = sizT/10; // 10x10 cases
  $(id+' td ').width( maxWH ).height( maxWH );
  $(id+' td div').width( maxWH ).height( maxWH );
  // $(id+' td').css({ 'font-size':Math.floor(100*maxWH/16/1.4)/100+'em' });
  // $(id+' th').css({ 'font-size':Math.floor(100*maxWH/16/2.5)/100+'em' });
};
resize_table_chess('.chess_table');
