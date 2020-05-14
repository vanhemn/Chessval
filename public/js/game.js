const game = {
	
	/*10 = terrain lenght*/
	findRange: (tile, range) => {
		var tiles = [];

		let starty = Math.max(0,(tile.y - range));
		let endy = Math.min(gameData.rules.size - 1, (tile.y + range));

		for(let row = starty ; row <= endy ; row++){

			let xrange = range - Math.abs(row - tile.y);

			let startx = Math.max(0,      (tile.x - xrange));
			let endx = Math.min(gameData.rules.size - 1, (tile.x + xrange));

			for(let col = startx ; col <= endx ; col++){
				tiles.push([col,row]);
			}
		}

		return tiles;
	},

	place: (prev, obj, data) => {
		clean();
		$("#info").hide();
		gameData = data;
		if (prev) {
			let div = $("#g_"+prev.x+"_"+prev.y).children()[0];
			$(div).children().remove();
		}
		let img = $(`<img width="100%" src="/img/units/`+obj.img+`_`+gameData.players[obj.playerId].color+`.png"><span class='lifebar lifefull'>`+obj.life+`/`+obj.maxLife+`</span>`);
		img.click((e) => {
			var p = $(e.target).parent().parent();
			//move
			if (obj.playerId == socket.id) {
				clean();
				$("#info").hide();
				fillInfo(obj);
				$(e.target).parent().addClass("select");
				$("#info").show();
				title = p.attr('id').split('_');
				drawMove(obj, game.findRange({x: title[1], y:title[2]}, obj.move));
				drawRange(obj, game.findRange({x: title[1], y:title[2]}, obj.range));
				//atack
			} else if ($(e.target).parent().hasClass('rangepreview')) {
				console.log("attack if")
				let adr = p.attr('id').split('_');
				console.log($(e.target).parent().attr('target-by'))
				let from = JSON.parse($(e.target).parent().attr('target-by'))
				socket.emit("attack", {from: from, target: {x:adr[1], y:adr[2]}});
				clean();
				$("#info").hide();
				//autre
			} else {
				clean();
				$("#info").hide();
			}
		})

		let div = $("#g_"+obj.position.x+"_"+obj.position.y).children()[0];
		$(div).append(img);
	},

	takeDmg(obj, data) {
		gameData = data;
		if (obj.life <= 0) $("#g_"+obj.position.x+"_"+obj.position.y+" div").children().remove();
		else $("#g_"+obj.position.x+"_"+obj.position.y+" div span").html(obj.life+'/'+obj.maxLife);
		if (obj.life != obj.maxLife) {
			$("#g_"+obj.position.x+"_"+obj.position.y+" div span").removeClass("lifefull").addClass("lifelow");
		}
	}
}

function drawMove (tile, array) {
	var finder = new PF.AStarFinder();
	for (let a of array) {
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

function drawRange (tile, array) {
	for (let a of array) {
		if (gameData.matrix[a[1]][a[0]] && gameData.matrix[a[1]][a[0]].playerId != socket.id)
			$("#g_"+a[0]+"_"+a[1]+" div").addClass("rangepreview");
		$("#g_"+a[0]+"_"+a[1]+" div").attr("target-by", JSON.stringify(tile.position));
	}
	// $(".rangepreview img").click((e)=>{
	// 	console.log("onclick")
	// 	clean();
	// 	let adr = $(e.target).parent().parent().attr('id').split('_');
	// 	socket.emit("attack", {object: tile, target: {x:adr[1], y:adr[2]}});
	// })
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
	$(".rangepreview").off("click");
	$("td div").removeClass("movepreview");
	$("td div").removeAttr("target-by");
	$("td div").removeClass("rangepreview");
	$("td div").removeClass("select");
}