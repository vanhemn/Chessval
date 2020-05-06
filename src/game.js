
'use strict';
const PF = require('pathfinding');

// add turn player turn with id i think
module.exports = class Game {
	matrix = [];
	rules = require("../config/game.json")
	players = {};
	constructor() {
		for(var i=0; i<this.rules.size; i++) {
			this.matrix[i] = [];
			for(var j=0; j<this.rules.size; j++) {
				this.matrix[i][j] = null;
			}
		}
	}

	/*add player to the game and set color*/
	addPlayer(id, name) {
		if (Object.keys(this.players).length <= 2) {
			let p;
			if (Object.keys(this.players).length == 0)
				p = new Player(name,"b");
			if (Object.keys(this.players).length == 1)
				p = new Player(name,"n");
			this.players[id] = p;
		}
	}

	/*not used*/
	removePlayer(id) {
		delete this.players[id];
	}

	/*create and place piece*/
	createPiece(playerId, piece_name, position) {
		if (this.matrix[position.y][position.x] == null) {
			let piece = Object.assign({}, this.rules.units[piece_name]);
			piece.playerId = playerId;
			piece.position = position;
			this.matrix[position.y][position.x] = piece;
			return piece;
		}
		return null;	
	}

	/*move existing piece*/
	movePiece(playerId, to, object) {
		let piece = this.matrix[object.position.y][object.position.x]
		if (piece && piece.playerId == playerId && this.checkMove(to, piece.position, piece.move)) {
			let from = piece.position;
			piece.position = to;
			this.matrix[from.y][from.x] = null;
			this.matrix[to.y][to.x] = piece;
			return {from: from, obj: piece};
		}
		return null;
	}

	checkMove (to, from, move) {
		let finder = new PF.AStarFinder();
		let grid = new PF.Grid(Object.assign(this.matrix));
		let path = finder.findPath(from.x, from.y, to.x, to.y, grid);
		console.log(path)
		if (path.length != 0 && path.length <= move + 1){
			return true;
		}
		console.log("cant move")
		return false;
	}
}

class Player {
	name;
	color;
	constructor(name, color) {
		this.name = name;
		this.color = color;
	}
}
