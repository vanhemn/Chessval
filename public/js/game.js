var matrix = [];
for(var i=0; i<10; i++) {
	matrix[i] = [];
	for(var j=0; j<10; j++) {
		matrix[i][j] = null;
	}
}

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

	place: (prev, next, obj) => {
		if (prev) {
			console.log($("#g_"+prev.x+"_"+prev.y).children()[0].children()[0].remove());
		}
		if (next) {
			obj.x = next.x;
			obj.y = next.y;
			matrix[next.y][next.x] = obj;
			let img = $(`<img width="100%" src="/img/units/`+obj.img+`_`+color+`.png"><span class='lifebar lifefull'>`+obj.life+`/`+obj.maxLife+`</span>`);
			console.log(img)
			img.click((e) => {
				/*reset*/
				$("td div").removeClass("movepreview");
				$("#info").hide();
				$("td div").removeClass("select");

				fillInfo(obj);
				$(e.target).parent().addClass("select");
				$("#info").show();
				var p = $(e.target).parent().parent();
				title = p.attr('id').split('_');
				drawRange(matrix[title[2]][title[1]], game.findRange({x: title[1], y:title[2]}, matrix[title[2]][title[1]].move), matrix[title[2]][title[1]].move);
			})

			let div = $("#g_"+next.x+"_"+next.y).children()[0]
			$(div).append(img)
		}
	}
}

function drawRange (tile, array) {
	var finder = new PF.AStarFinder();
	for (let a of array){
		var grid = new PF.Grid(matrix);
		var path = finder.findPath(tile.x, tile.y, a[0], a[1], grid);
		if (path.length <= tile.move + 1 && matrix[a[1]][a[0]] == null)
			$("#g_"+a[0]+"_"+a[1]+" div").addClass("movepreview");
	}
}

function fillInfo(obj){
	$("#life").html(obj.life+"/"+obj.maxLife);
	$("#range").html(obj.range);
	$("#move").html(obj.move);
	$("#damage").html(obj.damage);
	$("#name").html(obj.name)
}