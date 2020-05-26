'use strict';
const PF = require('pathfinding');

// add turn player turn with id i think
module.exports = class Game {
	matrix = [];
	rules = require("../config/game.json")
	players = {};
	phase = "BUY" /*BUY/PLAY/WIN*/
	player_turn = null; /*Player can play here*/

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
				p = new Player(name,"b",this.rules.gold);
			if (Object.keys(this.players).length == 1)
				p = new Player(name,"n",this.rules.gold);
			this.players[id] = p;
		}
	}

	/*not used*/
	removePlayer(id) {
		delete this.players[id];
	}

	/* start game with turn*/
	readyToPlay(playerId) {
		let count = 0;
		if (this.players[playerId])
			this.players[playerId].rdy = true;
		for (let o of this.players) {
			if (o.rdy = true) count++;
		}
		if (count == this.players.length)
			this.phase = "PLAY";
	}	

	/*create and place piece add price check ONLY on BUY phase*/
	createPiece(playerId, piece_name, position) {
		if (this.matrix[position.y][position.x] == null && this.phase == "BUY" && this.players[playerId] && this.rules.units[piece_name] && this.players[playerId].gold - this.rules.units[piece_name].price >= 0) {
			this.players[playerId].gold -= this.rules.units[piece_name].price
			let piece = Object.assign({}, this.rules.units[piece_name]);
			piece.playerId = playerId;
			piece.position = position;
			this.matrix[position.y][position.x] = piece;
			return piece;
		}
		return null;	
	}

	/*move existing piece*/
	/* on BUY free move on 3 first row | on PLAY One move per turn*/
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
		if (path.length != 0 && path.length <= move + 1){
			return true;
		}
		return false;
	}

	checkRange (to, from, range) {
		let starty = Math.max(0,(from.y - range));
		let endy = Math.min(this.rules.size - 1, (from.y + range));

		for(let row = starty ; row <= endy ; row++){

			let xrange = range - Math.abs(row - from.y);
			let startx = Math.max(0,      (from.x - xrange));
			let endx = Math.min(this.rules.size - 1, (from.x + xrange));

			for(let col = startx ; col <= endx ; col++){
				if (col == to.x && row == to.y) {
					console.log("attack ok");
					return true;
				}
			}
		}

		return false;
	}

	/* ONLY on PLAY attack end turn (1move and one atatck with same piece)*/
	attack (playerId, from, obj) {
		console.log("on attack")
		let piece = this.matrix[from.y][from.x];
		let target = this.matrix[obj.y][obj.x];
		if (piece && piece.playerId == playerId 
			&& target && target.playerId != playerId 
			&& this.checkRange(piece.position, target.position, piece.range)) {
			console.log("in if")
			target.life -= piece.damage;
			if (target.life <= 0) this.matrix[target.position.y][target.position.x] = null;
			return target;
		}
		return null;
	}
}

class Player {
	name;
	color;
	gold;
	rdy = false;
	constructor(name, color, gold) {
		this.name = name;
		this.color = color;
		this.gold = gold
	}
}
