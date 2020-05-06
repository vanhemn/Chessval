const game = {
	
	/*10 = terrain lenght*/
	findRange: (tile, range) => {

		var tiles = [];

		starty = Math.max(0,(tile.y - range));
		endy = Math.min(10 - 1, (tile.y + range));

		for(row = starty ; row <= endy ; row++){

			xrange = range - Math.abs(row - tile.y);

			startx = Math.max(0,      (tile.x - xrange));
			endx = Math.min(10 - 1, (tile.x + xrange));

			for(col = startx ; col <= endx ; col++){
				tiles.push([col,row]);
			}
		}

		return tiles;
	},

	place: (prev, obj, data) => {
		gameData = data
		if (prev) {
			let div = $("#g_"+prev.x+"_"+prev.y).children()[0];
			$(div).children().remove();
		}
		let img = $(`<img width="100%" src="/img/units/`+obj.img+`_`+gameData.players[obj.playerId].color+`.png"><span class='lifebar lifefull'>`+obj.life+`/`+obj.maxLife+`</span>`);
		img.click((e) => {
			clean();
			$("#info").hide();
			console.log(obj.playerId, "==", socket.id)
			if (obj.playerId == socket.id) {
				fillInfo(obj);
				$(e.target).parent().addClass("select");
				$("#info").show();
				var p = $(e.target).parent().parent();
				title = p.attr('id').split('_');
				drawRange(obj, game.findRange({x: title[1], y:title[2]}, obj.move), obj.move);
			}
		})

		let div = $("#g_"+obj.position.x+"_"+obj.position.y).children()[0]
		$(div).append(img)
	}
}

function drawRange (tile, array) {
	var finder = new PF.AStarFinder();
	for (let a of array){
		var grid = new PF.Grid(gameData.matrix);
		
		var path = finder.findPath(tile.position.x, tile.position.y, a[0], a[1], grid);
		if (path.length <= tile.move + 1 && gameData.matrix[a[1]][a[0]] == null)
			$("#g_"+a[0]+"_"+a[1]+" div").addClass("movepreview");
	}
	$(".movepreview").click((e)=>{
		clean();
		let adr = $(e.target).parent().attr('id').split('_');
		socket.emit("move", {object: tile, to: {x:adr[1], y:adr[2]}});
	})
}

function fillInfo(obj){
	$("#life").html(obj.life+"/"+obj.maxLife);
	$("#range").html(obj.range);
	$("#move").html(obj.move);
	$("#damage").html(obj.damage);
	$("#name").html(obj.name)
}


function clean() {
	$(".movepreview").off("click");
	$("td div").removeClass("movepreview");
	$("td div").removeClass("select");
}