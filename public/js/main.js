const params ={};location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){params[k]=v})
const socket = io.connect('http://localhost:8080');
const color = "n"

/*==========expériment========*/

/*generate matrix*/


/*test*/


let arc = {
	"price": 125,
	"name":"Archer",
			"life": 8,
			"maxLife": 10,
			"range": 3,
			"move": 2,
			"damage": 10,
			"text": null,
			"img": "archer"
		}
let Chevalier = {
			"name": "Chevalier",
			"price": 150,
			"maxLife": 20,
			"life": 20,
			"range": 1,
			"move": 4,
			"damage": 20,
			"text": null,
			"img": "chevalier"
		}
game.place(null, {x:0,y:0}, Object.assign({}, arc))
game.place(null, {x:5,y:5},  Object.assign({}, Chevalier))
game.place(null, {x:0,y:9},  Object.assign({}, Chevalier))
let raf = Object.assign({}, arc)
raf.life = 1
game.place(null, {x:5,y:3},  raf)





/*=========================*/



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
