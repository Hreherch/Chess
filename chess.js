/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * MIT License
 *
 * Copyright (c) 2017 Bennett Hreherchuk
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

/* 
 * Aids in keeping a standard variable set for pieces and for getting the
 * HTML for the piece's image.
 */ 
var Images = {
    black: "black",
    white: "white",
    pawn: "pawn",
    rook: "rook",
    knight: "knight",
    bishop: "bishop",
    king: "king",
    queen: "queen",
    getImgHTML: function( color, piece ) {
        return '<img class="chessboard-piece" src="pieces/' + color + '-' + piece + '.png"></img>'
    },
}

/* Functions that return the magnitude of distance for their respective axis
 * for a given coordinate.
 */
var getDeltaX = function( oldCoord, newCoord ) {
    return Math.abs( oldCoord[0] - newCoord[0] );
}
var getDeltaY = function( oldCoord, newCoord ) {
    return Math.abs( oldCoord[1] - newCoord[1] )
}

/*
 * Simple factory for cloning a piece and associating it with the specified board.
 */
var clonePiece = function( piece, board ) {
    if (piece == null) {
        return null;
    } else if (piece.sName == "") {
        var newPiece = new Pawn( piece.color, board );
    } else if (piece.sName == "R") {
        var newPiece = new Rook( piece.color, board );
    } else if (piece.sName == "K") {
        var newPiece = new King( piece.color, board );
    } else if (piece.sName == "Q") {
        var newPiece = new Queen( piece.color, board ); 
    } else if (piece.sName == "N") {
        var newPiece = new Knight( piece.color, board );
    } else if (piece.sName == "B") {
        var newPiece = new Bishop( piece.color, board );
    }
     newPiece.hasMovedYet = piece.hasMovedYet;
     return newPiece;
}

function Pawn( color, boardPlacedOn ) {
    this.name = Images.pawn;
    this.value = 1;             // Value of the piece, for heuristics 
    this.sName = "";            // Shorthand name for chess notation
    this.color = color; 
    this.board = boardPlacedOn;
    this.hasMovedYet = false;   // For determining if it can move 2 tiles
    
    this.getImgHTML = function() { return Images.getImgHTML( this.color, this.name ); };
    
    this.validateMove = function( oldCoord, newCoord ) {
        if (newCoord[0] < 0 || newCoord[0] > 7) { return false; }
        if (newCoord[1] < 0 || newCoord[1] > 7) { return false; }
        
        // white and black pawns can only move in a certain direction
        if (oldCoord[1] < newCoord[1] && this.color == Images.white) { return false; } 
        else if (oldCoord[1] > newCoord[1] && this.color == Images.black) { return false; }
        
        var deltaX = getDeltaX( oldCoord, newCoord );
        var deltaY = getDeltaY( oldCoord, newCoord );
        
        // can only move two spaces on initial move.
        if (deltaY == 2) {
            if (this.hasMovedYet) { return false; }
            else if (deltaX != 0) { return false; }
            else if (this.board.getObjectAtCoord(newCoord) != null) { return false; }
            
            // Check that the pawn is not jumping over a piece
            if (this.color == this.board.white) {
                var checkBetween = [newCoord[0], newCoord[1]+1];
                if (this.board.getObjectAtCoord( checkBetween ) != null) { return false; }
            } else {
                var checkBetween = [newCoord[0], newCoord[1]-1];
                if (this.board.getObjectAtCoord( checkBetween ) != null) { return false; }
            }
            
            // update en passant checks on the board 
            // TODO: Make this rely soley on coordinates (?)
            if (this.color == Images.white) {
                this.board.enPassantCoord = [newCoord[0], newCoord[1]+1];
            } else {
                this.board.enPassantCoord = [newCoord[0], newCoord[1]-1];
            }
            this.board.enPassantPiece = this;
            return true;
        }
        
        // can only move one space forward thereafter. 
        if (deltaY != 1) { return false; }
        
        var piece = this.board.getObjectAtCoord(newCoord);
        if (deltaX == 0) {
            if (piece != null) { return false; }
            return true;
        }
        if (deltaX != 1) { return false; }
        if (piece == null) { 
            // check if the en passant rule is being exercised
            if (this.board.enPassantPiece == null) { return false; }
            else if (newCoord[0] == this.board.enPassantCoord[0]
                     && newCoord[1] == this.board.enPassantCoord[1]) {
                this.board.enPassantRemove();
                return true;
            }
            return false;
        }
        if (piece.color == this.color) { return false; }
        return true;
    };
    
    this.getPossibleMoves = function( oldCoord ) {
        var x = oldCoord[0];
        var y = oldCoord[1];
        var list = [];
        if (this.validateMove(oldCoord, [x, y+1])) { list.push([x, y+1]); }
        if (this.validateMove(oldCoord, [x, y+2])) { list.push([x, y+2]); }
        if (this.validateMove(oldCoord, [x+1, y+1])) { list.push([x+1, y+1]); }
        if (this.validateMove(oldCoord, [x-1, y+1])) { list.push([x-1, y+1]); }
        return list;
    };
}

function Rook( color, boardPlacedOn ) {
    this.name = Images.rook;
    this.value = 5;
    this.sName = "R";
    this.color = color;
    this.board = boardPlacedOn;
    this.hasMovedYet = false;
    
    this.getImgHTML = function() { return Images.getImgHTML( this.color, this.name ); };
    
    this.validateMove = function( oldCoord, newCoord ) {
        if (newCoord[0] < 0 || newCoord[0] > 7) { return false; }
        if (newCoord[1] < 0 || newCoord[1] > 7) { return false; }
        
        var deltaX = getDeltaX( oldCoord, newCoord );
        var deltaY = getDeltaY( oldCoord, newCoord );
        
        if ( deltaX != 0 && deltaY != 0 ) { return false; }
        if ( deltaX == 0 ) {
            var d = deltaY;
            var movementX = 0;
            if (oldCoord[1] < newCoord[1]) {
                var movementY = 1;
            } else {
                var movementY = -1;
            }
        }
        else if ( deltaY == 0 ) {
            var d = deltaX;
            var movementY = 0;
            if (oldCoord[0] < newCoord[0]) {
                var movementX = 1;
            } else {
                var movementX = -1;
            }
        }
        for (var i = 1; i < d; i++ ) {
            var currentCoord = [oldCoord[0] + (i * movementX), 
                                oldCoord[1] + (i * movementY)];
            if (this.board.getObjectAtCoord( currentCoord ) != null) { return false; }
        }
        var piece = this.board.getObjectAtCoord( newCoord );
        if (piece == null) { return true; }
        if (piece.color == this.color) { return false; }
        return true;
    };
    
    this.getPossibleMoves = function( oldCoord ) {
        var x = oldCoord[0];
        var y = oldCoord[1];
        var list = [];
        var oldMovedYet = this.hasMovedYet;
        for (var i = 0; i < 8; i++) {
            if (this.validateMove(oldCoord, [x, i])) { list.push([x, i]); }
            if (this.validateMove(oldCoord, [i, y])) { list.push([i, y]); }
        }
        return list;
    };
}

function Knight( color, boardPlacedOn ) {
    this.name = Images.knight;
    this.value = 3;
    this.sName = "N";
    this.color = color;
    this.board = boardPlacedOn;
    this.hasMovedYet = false;
    
    this.getImgHTML = function() { return Images.getImgHTML( this.color, this.name ); };
    
    this.validateMove = function( oldCoord, newCoord ) {
        if (newCoord[0] < 0 || newCoord[0] > 7) { return false; }
        if (newCoord[1] < 0 || newCoord[1] > 7) { return false; }
        
        var deltaX = getDeltaX( oldCoord, newCoord );
        var deltaY = getDeltaY( oldCoord, newCoord );
        if ( (deltaX == 1 && deltaY == 2) || (deltaX == 2 && deltaY == 1) ) {
            var piece = this.board.getObjectAtCoord(newCoord);
            if (piece != null) {
                if (piece.color != this.color) { return true; }
            } else {
                return true;
            }
        }
        return false;
    };
    
    this.getPossibleMoves = function( oldCoord ) {
        var x = oldCoord[0];
        var y = oldCoord[1];
        var list = [];
        
        if (this.validateMove(oldCoord, [x+1, y+2])) { list.push([x+1, y+2]); }
        if (this.validateMove(oldCoord, [x+1, y-2])) { list.push([x+1, y-2]); }
        if (this.validateMove(oldCoord, [x+2, y+1])) { list.push([x+2, y+1]); }
        if (this.validateMove(oldCoord, [x+2, y-1])) { list.push([x+2, y-1]); }
        if (this.validateMove(oldCoord, [x-1, y+2])) { list.push([x-1, y+2]); }
        if (this.validateMove(oldCoord, [x-1, y-2])) { list.push([x-1, y-2]); }
        if (this.validateMove(oldCoord, [x-2, y+1])) { list.push([x-2, y+1]); }
        if (this.validateMove(oldCoord, [x-2, y-1])) { list.push([x-2, y-1]); }
        
        return list;
    };
}

function Bishop( color, boardPlacedOn ) {
    this.name = Images.bishop;
    this.value = 3;
    this.sName = "B";
    this.color = color;
    this.board = boardPlacedOn;
    this.hasMovedYet = false;
    
    this.getImgHTML = function() { return Images.getImgHTML( this.color, this.name ); };
    
    this.validateMove = function( oldCoord, newCoord ) {
        if (newCoord[0] < 0 || newCoord[0] > 7) { return false; }
        if (newCoord[1] < 0 || newCoord[1] > 7) { return false; }
        
        var deltaX = getDeltaX( oldCoord, newCoord );
        var deltaY = getDeltaY( oldCoord, newCoord );
        if (deltaX != deltaY) { return false; }
        
        // Determine the 'movement' of the piece
        if ( oldCoord[0] < newCoord[0] ) { var movementX = 1; } 
        else { var movementX = -1; }
        if ( oldCoord[1] < newCoord[1] ) { var movementY = 1; } 
        else { var movementY = -1; }
        
        // Check that we are not 'jumping' over pieces
        for (var i = 1; i < deltaX; i++ ) {
            var currentCoord = [oldCoord[0] + (i * movementX), 
                                oldCoord[1] + (i * movementY)];
            if (this.board.getObjectAtCoord( currentCoord ) != null) { return false; }
        }
        
        var piece = this.board.getObjectAtCoord(newCoord);
        if( piece != null ) {
            if (piece.color == this.color) { return false; }
        }
        return true; 
    };
    
    this.getPossibleMoves = function( oldCoord ) {
        var x = oldCoord[0];
        var y = oldCoord[1];
        var list = [];
        
        for(var i = 0; i < 8; i++ ) {
            if (this.validateMove(oldCoord, [x+i, y+i])) { list.push([x+i, y+i]); }
            if (this.validateMove(oldCoord, [x-i, y-i])) { list.push([x-i, y-i]); }
            if (this.validateMove(oldCoord, [x+i, y-i])) { list.push([x+i, y-i]); }
            if (this.validateMove(oldCoord, [x-i, y+i])) { list.push([x-i, y+i]); }
            // loop invariant (?) if all 4 return false, we will not add any more moves.
        }
        return list;
    };
}

function King( color, boardPlacedOn ) {
    this.name = Images.king;
    this.value = 200;
    this.sName = "K";
    this.color = color;
    this.board = boardPlacedOn;
    this.hasMovedYet = false;
    
    this.getImgHTML = function() { return Images.getImgHTML( this.color, this.name ); };
    
    this.validateMove = function( oldCoord, newCoord ) {
        if (newCoord[0] < 0 || newCoord[0] > 7) { return false; }
        if (newCoord[1] < 0 || newCoord[1] > 7) { return false; }
        
        var deltaX = getDeltaX( oldCoord, newCoord );
        var deltaY = getDeltaY( oldCoord, newCoord );
        if ( !this.hasMovedYet && deltaX == 2 && deltaY == 0 ) {
            return ChessBoard.castle( this.color, newCoord );
        }
        
        if (deltaX > 1 || deltaY > 1) { return false; }
        
        var piece = ChessBoard.getObjectAtCoord( newCoord );
        if (piece == null) { return true; }
        if (piece.color == this.color) { return false; }
        return true;
    };
    
    this.getPossibleMoves = function( oldCoord ) {
        var x = oldCoord[0];
        var y = oldCoord[1];
        var list = [];
        
        var xAr = [0, 0, 1, -1, -1, 1, -1, 1, 2, -2];
        var yAr = [1, -1, 0, 0, -1, 1, 1, -1, 0, 0];
        
        for (var i = 0; i < xAr.length; i++) {
            if (this.validateMove(oldCoord, [x+xAr[i], y+yAr[i]])) { list.push([x+xAr[i], y+yAr[i]]); }
        }
        
        return list;
    };
}

function Queen( color, boardPlacedOn ) {
    this.name = Images.queen;
    this.value = 9;
    this.sName = "Q";
    this.color = color;
    this.board = boardPlacedOn;
    this.hasMovedYet = false;
    this.rook = new Rook( color, boardPlacedOn );
    this.bishop = new Bishop( color, boardPlacedOn );
    
    this.getImgHTML = function() { return Images.getImgHTML( this.color, this.name ); };
    
    this.validateMove = function( oldCoord, newCoord ) {
        if ( this.hasMovedYet && !(this.rook.hasMovedYet || this.bishop.hasMovedYet) ) {
            this.rook.hasMovedYet = true;
            this.bishop.hasMovedYet = true;
        }
        return this.rook.validateMove( oldCoord, newCoord ) || 
               this.bishop.validateMove( oldCoord, newCoord );
    };
    
    this.getPossibleMoves = function( oldCoord ) {
        var rookList = this.rook.getPossibleMoves( oldCoord );
        var bishopList = this.bishop.getPossibleMoves( oldCoord );
        return bishopList.concat(rookList);
    };
}

function Board() {
    this.board = [];
    this.drawing = false;
    this.lastMove = null;
    this.white = Images.white;
    this.black = Images.black;
    this.player = Images.white;
    this.enPassantPiece = null;
    this.enPassantCoord = null;
    this.initBoard = function() {
        this.board = [];
        this.board.push([new Rook( Images.black, this ),   new Knight( Images.black, this ), 
                         new Bishop( Images.black, this ), new King( Images.black, this ), 
                         new Queen( Images.black, this ),  new Bishop( Images.black, this ), 
                         new Knight( Images.black, this ), new Rook( Images.black, this ) ]);
                         
        this.board.push([new Pawn( Images.black, this ), new Pawn( Images.black, this ), 
                         new Pawn( Images.black, this ), new Pawn( Images.black, this ), 
                         new Pawn( Images.black, this ), new Pawn( Images.black, this ), 
                         new Pawn( Images.black, this ), new Pawn( Images.black, this ) ]);
                         
        this.board.push([ null, null, null, null, null, null, null, null ]);
        this.board.push([ null, null, null, null, null, null, null, null ]);
        this.board.push([ null, null, null, null, null, null, null, null ]);
        this.board.push([ null, null, null, null, null, null, null, null ]);
        
        this.board.push([new Pawn( Images.white, this ), new Pawn( Images.white, this ), 
                         new Pawn( Images.white, this ), new Pawn( Images.white, this ), 
                         new Pawn( Images.white, this ), new Pawn( Images.white, this ), 
                         new Pawn( Images.white, this ), new Pawn( Images.white, this ) ]);
                         
        this.board.push([new Rook( Images.white, this ), new Knight( Images.white, this ), 
                         new Bishop( Images.white, this ), new King( Images.white, this ), 
                         new Queen( Images.white, this ), new Bishop( Images.white, this ), 
                         new Knight( Images.white, this ), new Rook( Images.white, this )  ]);
    };
    
    this.drawBoard = function() {
        if (!this.drawing) { return; }
        for ( var i = 0; i < 8; i++ ) {
            for ( var j = 0; j < 8; j++ ) {
                var piece = this.board[j][i];
                var tilename = getTileName([i, j]);
                if (piece == null) { 
                    removeTileImage( tilename ); 
                } else {
                    setTileImage( tilename, piece.color, piece.name );
                }
            }
        }
    };
    
    this.movePiece = function( fromTilename, toTilename ) {
        var clearEnPassant = false;
        if (this.enPassantPiece != null) { clearEnPassant = true; }
        console.log( "attempting to move", fromTilename, "to", toTilename );
        var fromCoord = getTileCoord( fromTilename );
        var fromPiece = this.getObjectAtCoord( fromCoord );
        if (fromPiece == null) { return false; }
        if (fromPiece.color != this.player) { return false; }
        var toCoord = getTileCoord( toTilename );
        var toPiece = this.getObjectAtCoord( toCoord );
        if ( fromPiece.validateMove( fromCoord, toCoord ) ) {
            // TODO: Does not account for castling 
            writeMessage( "" );
            var toCoordOldValue = this.board[toCoord[1]][toCoord[0]];
            this.board[toCoord[1]][toCoord[0]] = this.board[fromCoord[1]][fromCoord[0]];
            this.board[fromCoord[1]][fromCoord[0]] = null;
            if (this.check( this.player )) {
                this.board[fromCoord[1]][fromCoord[0]] = this.board[toCoord[1]][toCoord[0]];
                this.board[toCoord[1]][toCoord[0]] = toCoordOldValue;
                if (this.drawing) {
                    writeMessage( "That would put you in check, Player." );
                }
                return false;
            }
            if (this.drawing) {
                if (this.lastMove != null) {
                    var thisMove = fromPiece.sName + toTilename + this.checkPromotion( fromPiece, toCoord );
                    writeMove( this.lastMove, thisMove );
                    this.lastMove = null;
                } else {
                    this.lastMove = fromPiece.sName + toTilename + this.checkPromotion( fromPiece, toCoord );
                }
            } else {
                this.checkPromotion( fromPiece, toCoord );
            }
            if( clearEnPassant ) {
                this.enPassantCoord = null;
                this.enPassantPiece = null;
            }
            this.board[toCoord[1]][toCoord[0]].hasMovedYet = true;
            this.drawBoard();
            this.switchPlayer();
            if (fromPiece != null) {return true}
        }
        return false;
    };
    
    this.checkPromotion = function( fromPiece, toCoord ) {
        if (fromPiece instanceof Pawn) {
            if (fromPiece.color == this.white) {
                if (toCoord[1] == 0) {
                    this.board[toCoord[1]][toCoord[0]] = new Queen( this.white );
                    return "Q";
                }
            } else {
                if (toCoord[1] == 7) {
                    this.board[toCoord[1]][toCoord[0]] = new Queen( this.black );
                    return "Q";
                }
            }
        }
        return "";
    };
    
    this.enPassantRemove = function() {
        for ( var i = 0; i < 8; i++ ) {
            for ( var j = 0; j < 8; j++ ) {
                var piece = this.board[i][j];
                if (piece == this.enPassantPiece) {
                    this.board[i][j] = null;
                    this.drawBoard();
                    return;
                }
            }
        }
    };
    
    this.switchPlayer = function() {
        var elem = document.getElementById( "move-indicator" );
        if (this.player == this.white) {
            this.player = this.black;
            elem.innerHTML = "Black's move.";
            decide(this);
        } else {
            this.player = this.white;
            if (this.drawing) { elem.innerHTML = "White's move."; }
        }
    };
    
    this.castle = function( color, newPosition ) {
        var shortCastle = newPosition[0] < 3;
        var currentCoord = [3, 0];
        if (color == this.white) {
            currentCoord = [3, 7]
        }
        var x = currentCoord[0];
        var y = currentCoord[1];
        if (shortCastle) {
            if (this.board[y][x-1] != null) { return false; }
            if (this.board[y][x-2] != null) { return false; }
            var rook = this.board[y][x-3];
            if (rook == null) { return false; }
            if (rook.hasMovedYet) { return false; }
            this.board[y][x-3] = null;
            this.board[y][x-1] = rook;
            rook.hasMovedYet = true;
            var king = this.board[y][x];
            king.hasMovedYet = true;
            return true;
        } else {
            if (this.board[y][x+1] != null) { return false; }
            if (this.board[y][x+2] != null) { return false; }
            if (this.board[y][x+3] != null) { return false; }
            var rook = this.board[y][x+4];
            if (rook == null) { return false; }
            if (rook.hasMovedYet) { return false; }
            this.board[y][x+1] = rook;
            this.board[y][x+4] = null;
            rook.hasMovedYet = true;
            var king = this.board[y][x];
            king.hasMovedYet = true;
            return true;
        }
    };
    
    this.getObjectAtCoord = function( coords ) {
        return this.board[coords[1]][coords[0]];
    };
    
    this.getAllObjects = function( color ) {
        var list = [];
        for ( var i = 0; i < 8; i++ ) {
            for ( var j = 0; j < 8; j++ ) {
                var piece = this.getObjectAtCoord( [i, j] );
                if (piece == null) { continue; }
                if (piece.color == color) {
                    list.push( [piece, [i, j]] );
                }
            }
        }
        return list;
    };
    
    this.kingPosition = function( color ) {
        for ( var i = 0; i < 8; i++ ) {
            for ( var j = 0; j < 8; j++ ) {
                var piece = this.getObjectAtCoord( [i, j] );
                if (piece != null) {
                    if (piece.color == color && piece.sName == 'K') {
                        return [i, j];
                    }
                }
            }
        }
    };
    
    this.check = function( color ) {
        var kingPos = this.kingPosition( color );
        if (color == this.white) {
            var opposingPieces = this.getAllObjects( this.black );
        } else {
            var opposingPieces = this.getAllObjects( this.white );
        }
        for (var i = 0; i < opposingPieces.length; i++ ) {
            if (opposingPieces[i][0].validateMove( opposingPieces[i][1], kingPos )) { return true; }
        }
        return false;
    };
    
    this.clone = function() {
        var clone = new Board();
        clone.initBoard();
        for ( var i = 0; i < 8; i++ ) {
            for ( var j = 0; j < 8; j++ ) {
                clone.board[i][j] = clonePiece(this.board[i][j]);
            }
        }
        // TODO issues with En Passant?
        clone.player = this.player;
        return clone;
    };
    
    this.getValue = function() {
        var sum = 0;
        for ( var i = 0; i < 8; i++ ) {
            for ( var j = 0; j < 8; j++ ) {
                var piece = this.getObjectAtCoord( [i, j] );
                if (piece == null) { continue; }
                if (piece.color == this.black) { var modifier = 1; }
                else { var modifier = -1; }
                sum += (piece.value * modifier);
            }
        }
        return sum;
    };
}

var global_chessboard = new Board();
global_chessboard.drawing = true;

var ChessBoardSelector = {
    lastTileSelected: null,
    lastTileSelected_style: null,
}

var removeTileImage = function( tilename ) {
    document.getElementById( tilename ).innerHTML = null;
}

var setTileImage = function( tilename, color, piece ) {
    document.getElementById( tilename ).innerHTML = Images.getImgHTML( color, piece );
}

// expects [column, row]
var getTileName = function( coords ) {
    letters = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];
    row = coords[1];
    col = coords[0];
    return letters[col] + (row + 1);
}

// returns [column, row]
var getTileCoord = function( tilename ) {
    letters = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];
    letter = tilename[0];
    col = letters.indexOf( letter );
    row = parseInt( tilename[1] );
    return [col, row-1];
}

var getTileElement = function( tilename ) {
    return document.getElementById( tilename );
}

var clickedTile = function( tilename ) {
    var lastTileName = ChessBoardSelector.lastTileSelected;
    if (lastTileName != null) { var lastTile = getTileElement(lastTileName); }
    if (lastTileName == tilename) {
        lastTile.style = ChessBoardSelector.lastTileSelected_style;
        ChessBoardSelector.lastTileSelected = null;
        ChessBoardSelector.lastTileSelected_style = null;
        return;
    }
    if (lastTile != null) {
        global_chessboard.movePiece( lastTileName, tilename );
        lastTile.style = ChessBoardSelector.lastTileSelected_style;
        ChessBoardSelector.lastTileSelected = null;
        ChessBoardSelector.lastTileSelected_style = null;
        return;
    }
    var coords = getTileCoord( tilename );
    var piece = global_chessboard.getObjectAtCoord( coords );
    if (piece == null) { return; }
    if (global_chessboard.player != piece.color) { return; }
    var tile = getTileElement( tilename );
    ChessBoardSelector.lastTileSelected = tilename;
    ChessBoardSelector.lastTileSelected_style = tile.style;
    tile.style.backgroundColor = "#1477CC";
    
}

var initBoard = function() {
    global_chessboard.initBoard();
    global_chessboard.drawBoard();
    for ( var i = 0; i < 8; i++ ) {
        for ( var j = 0; j < 8; j++ ) {
            var tilename = getTileName([i,j]);
            var tile = getTileElement( tilename );
            tile.setAttribute( 'onclick', 'clickedTile( "' + tilename + '" )' );
        }
    }
}

var writeMessage = function( message ) {
    var div = document.getElementById( "message-box" );
    div.innerHTML = message;
}

var writeMove = function( moveOne, moveTwo ) {
    var div = document.getElementById("move-container");
    div.innerHTML += "<p>" + moveOne + " " + moveTwo + "</p>";
    div.scrollTop = div.scrollHeight;
}

document.addEventListener( 'DOMContentLoaded', initBoard, false );