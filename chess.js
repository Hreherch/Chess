// helloworld

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

var getDeltaX = function( oldCoord, newCoord ) {
    return Math.abs( oldCoord[0] - newCoord[0] );
}

var getDeltaY = function( oldCoord, newCoord ) {
    return Math.abs( oldCoord[1] - newCoord[1] )
}

function Pawn( color ) {
    this.name = Images.pawn;
    this.sName = "";
    this.color = color;
    this.movedYet = false;
    this.getImgHTML = function() { return Images.getImgHTML( this.color, this.name ); };
    this.validateMove =function( oldCoord, newCoord ) {
        var oldMovedYet = this.movedYet;
        if (newCoord[0] < 0 || newCoord[0] > 7) { return false; }
        if (newCoord[1] < 0 || newCoord[1] > 7) { return false; }
        // white and black pawns can only move in a certain direction
        if (oldCoord[1] < newCoord[1] && this.color == Images.white) { 
            return false;
        } else if (oldCoord[1] > newCoord[1] && this.color == Images.black) {
            return false;
        }
        var deltaX = getDeltaX( oldCoord, newCoord );
        var deltaY = getDeltaY( oldCoord, newCoord );
        // can only move two spaces on initial move.
        if (deltaY == 2) {
            if (oldMovedYet) { return false; }
            else if (deltaX != 0) { return false; }
            else if (ChessBoard.getObjectAtCoord(newCoord) != null) { return false; }
            if (this.color == ChessBoard.white) {
                var checkBetween = [newCoord[0], newCoord[1]+1];
                if (ChessBoard.getObjectAtCoord( checkBetween ) != null) { return false; }
            } else {
                var checkBetween = [newCoord[0], newCoord[1]-1];
                if (ChessBoard.getObjectAtCoord( checkBetween ) != null) { return false; }
            }
            this.movedYet = true;
            if (this.color == Images.white) {
                ChessBoard.enPassantCoord = [newCoord[0], newCoord[1]+1];
            } else {
                ChessBoard.enPassantCoord = [newCoord[0], newCoord[1]-1];
            }
            ChessBoard.enPassantPiece = this;
            return true;
        }
        // can only move one space forward thereafter. 
        if (deltaY != 1) { return false; }
        var piece = ChessBoard.getObjectAtCoord(newCoord);
        if (deltaX == 0) {
            if (piece != null) { return false; }
            this.movedYet = true;
            return true;
        }
        if (deltaX != 1) { return false; }
        if (piece == null) { 
            console.log( "enPassant", newCoord, ChessBoard.enPassantCoord );
            if (ChessBoard.enPassantPiece == null) { return false; }
            else if (newCoord[0] == ChessBoard.enPassantCoord[0]
                     && newCoord[1] == ChessBoard.enPassantCoord[1]) {
                ChessBoard.enPassantRemove();
                return true;
            }
            return false;
        }
        if (piece.color == this.color) { return false; }
        this.movedYet = true;
        return true;
    };
    this.getPossibleMoves = function( oldCoord ) {
        var x = oldCoord[0];
        var y = oldCoord[1];
        var oldMovedYet = this.movedYet;
        var list = [];
        if (this.validateMove(oldCoord, [x, y+1])) { list.push([x, y+1]); }
        this.movedYet = oldMovedYet;
        if (this.validateMove(oldCoord, [x, y+2])) { list.push([x, y+2]); }
        this.movedYet = oldMovedYet;
        if (this.validateMove(oldCoord, [x+1, y+1])) { list.push([x+1, y+1]); }
        this.movedYet = oldMovedYet;
        if (this.validateMove(oldCoord, [x-1, y+1])) { list.push([x-1, y+1]); }
        this.movedYet = oldMovedYet;
        return list;
    };
}

function Rook( color ) {
    this.name = Images.rook;
    this.sName = "R";
    this.color = color;
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
            if (ChessBoard.getObjectAtCoord( currentCoord ) != null) { return false; }
        }
        var piece = ChessBoard.getObjectAtCoord( newCoord );
        if (piece == null) { 
            this.hasMovedYet = true;
            return true; 
        }
        if (piece.color == this.color) { return false; }
        this.hasMovedYet = true;
        return true;
    };
    this.getPossibleMoves = function( oldCoord ) {
        var x = oldCoord[0];
        var y = oldCoord[1];
        var list = [];
        var oldMovedYet = this.hasMovedYet;
        for (var i = 0; i < 8; i++) {
            if (this.validateMove(oldCoord, [x, i])) { list.push([x, i]); }
            this.hasMovedYet = oldMovedYet;
            if (this.validateMove(oldCoord, [i, y])) { list.push([i, y]); }
            this.hasMovedYet = oldMovedYet;
        }
        return list;
    };
}

function Knight( color ) {
    this.name = Images.knight;
    this.sName = "N";
    this.color = color;
    this.getImgHTML = function() { return Images.getImgHTML( this.color, this.name ); };
    this.validateMove = function( oldCoord, newCoord ) {
        if (newCoord[0] < 0 || newCoord[0] > 7) { return false; }
        if (newCoord[1] < 0 || newCoord[1] > 7) { return false; }
        var deltaX = getDeltaX( oldCoord, newCoord );
        var deltaY = getDeltaY( oldCoord, newCoord );
        if ( (deltaX == 1 && deltaY == 2) || (deltaX == 2 && deltaY == 1) ) {
            var piece = ChessBoard.getObjectAtCoord(newCoord);
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

function Bishop( color ) {
    this.name = Images.bishop;
    this.sName = "B";
    this.color = color;
    this.getImgHTML = function() { return Images.getImgHTML( this.color, this.name ); };
    this.validateMove = function( oldCoord, newCoord ) {
        if (newCoord[0] < 0 || newCoord[0] > 7) { return false; }
        if (newCoord[1] < 0 || newCoord[1] > 7) { return false; }
        var deltaX = getDeltaX( oldCoord, newCoord );
        var deltaY = getDeltaY( oldCoord, newCoord );
        if (deltaX != deltaY) { return false; }
        if ( oldCoord[0] < newCoord[0] ) {
            var movementX = 1;
        } else {
            var movementX = -1;
        }
        if ( oldCoord[1] < newCoord[1] ) {
            var movementY = 1;
        } else {
            var movementY = -1;
        }
        for (var i = 1; i < deltaX; i++ ) {
            var currentCoord = [oldCoord[0] + (i * movementX), 
                                oldCoord[1] + (i * movementY)];
            if (ChessBoard.getObjectAtCoord( currentCoord ) != null) { return false; }
        }
        var piece = ChessBoard.getObjectAtCoord(newCoord);
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
        }
        return list;
    };
}

function King( color ) {
    this.name = Images.king;
    this.sName = "K";
    this.color = color;
    this.hasMovedYet = false;
    this.getImgHTML = function() { return Images.getImgHTML( this.color, this.name ); };
    this.validateMove = function( oldCoord, newCoord ) {
        if (newCoord[0] < 0 || newCoord[0] > 7) { return false; }
        if (newCoord[1] < 0 || newCoord[1] > 7) { return false; }
        var deltaX = getDeltaX( oldCoord, newCoord );
        var deltaY = getDeltaY( oldCoord, newCoord );
        if ( !this.hasMovedYet && deltaX == 2 && deltaY == 0 ) {
            console.log( "castling" );
            return ChessBoard.castle( this.color, newCoord );
        }
        if (deltaX > 1 || deltaY > 1) {
            return false;
        }
        var piece = ChessBoard.getObjectAtCoord( newCoord );
        if (piece == null) {
            this.hasMovedYet = true;
            return true; 
        }
        if (piece.color == this.color) { return false; }
        this.hasMovedYet = true;
        return true;
    };
    this.getPossibleMoves = function( oldCoord ) {
        var x = oldCoord[0];
        var y = oldCoord[1];
        var list = [];
        var oldMovedYet = this.hasMovedYet;
        
        var xAr = [0, 0, 1, -1, -1, 1, -1, 1, 2, -2];
        var yAr = [1, -1, 0, 0, -1, 1, 1, -1, 0, 0];
        
        for (var i = 0; i < xAr.length; i++) {
            if (this.validateMove(oldCoord, [x+xAr[i], y+yAr[i]])) { list.push([x+xAr[i], y+yAr[i]]); }
            this.hasMovedYet = oldMovedYet;
        }
        
        return list;
    };
}

function Queen( color ) {
    this.name = Images.queen;
    this.sName = "Q";
    this.color = color;
    this.rook = new Rook( color );
    this.bishop = new Bishop( color );
    this.getImgHTML = function() { return Images.getImgHTML( this.color, this.name ); };
    this.validateMove = function( oldCoord, newCoord ) {
        return this.rook.validateMove( oldCoord, newCoord ) || 
               this.bishop.validateMove( oldCoord, newCoord );
    };
    this.getPossibleMoves = function( oldCoord ) {
        var rookList = this.rook.getPossibleMoves( oldCoord );
        var bishopList = this.bishop.getPossibleMoves( oldCoord );
        console.log( bishopList );
        console.log( rookList );
        return bishopList.concat(rookList);
    };
}

function Board() {
    this.board = [];
    this.lastMove = null;
    this.white = Images.white;
    this.black = Images.black;
    this.player = Images.white;
    this.enPassantPiece = null;
    this.enPassantCoord = null;
    this.initBoard = function() {
        this.board = [];
        this.board.push([new Rook( Images.black ),   new Knight( Images.black ), 
                         new Bishop( Images.black ), new King( Images.black ), 
                         new Queen( Images.black ),  new Bishop( Images.black ), 
                         new Knight( Images.black ), new Rook( Images.black ) ]);
                         
        this.board.push([new Pawn( Images.black ), new Pawn( Images.black ), 
                         new Pawn( Images.black ), new Pawn( Images.black ), 
                         new Pawn( Images.black ), new Pawn( Images.black ), 
                         new Pawn( Images.black ), new Pawn( Images.black ) ]);
                         
        this.board.push([ null, null, null, null, null, null, null, null ]);
        this.board.push([ null, null, null, null, null, null, null, null ]);
        this.board.push([ null, null, null, null, null, null, null, null ]);
        this.board.push([ null, null, null, null, null, null, null, null ]);
        
        this.board.push([new Pawn( Images.white ), new Pawn( Images.white ), 
                         new Pawn( Images.white ), new Pawn( Images.white ), 
                         new Pawn( Images.white ), new Pawn( Images.white ), 
                         new Pawn( Images.white ), new Pawn( Images.white ) ]);
                         
        this.board.push([new Rook( Images.white ), new Knight( Images.white ), 
                         new Bishop( Images.white ), new King( Images.white ), 
                         new Queen( Images.white ), new Bishop( Images.white ), 
                         new Knight( Images.white ), new Rook( Images.white )  ]);
    };
    
    this.drawBoard = function() {
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
        console.log( fromTilename, toTilename );
        var fromCoord = getTileCoord( fromTilename );
        var fromPiece = this.getObjectAtCoord( fromCoord );
        if (fromPiece == null) { return false; }
        if (fromPiece.color != this.player) { return false; }
        var toCoord = getTileCoord( toTilename );
        var toPiece = this.getObjectAtCoord( toCoord );
        console.log( fromCoord, toCoord );
        console.log( fromPiece, toPiece );
        if ( fromPiece.validateMove( fromCoord, toCoord ) ) {
            this.board[toCoord[1]][toCoord[0]] = this.board[fromCoord[1]][fromCoord[0]];
            this.board[fromCoord[1]][fromCoord[0]] = null;
            if (this.lastMove != null) {
                var thisMove = fromPiece.sName + toTilename + this.checkPromotion( fromPiece, toCoord );
                writeMove( this.lastMove, thisMove );
                this.lastMove = null;
            } else {
                this.lastMove = fromPiece.sName + toTilename + this.checkPromotion( fromPiece, toCoord );
            }
            if( clearEnPassant ) {
                this.enPassantCoord = null;
                this.enPassantPiece = null;
            }
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
            elem.innerHTML = "White's move.";
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
        console.log( list );
        return list;
    };
}

var ChessBoard = new Board();

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
        ChessBoard.movePiece( lastTileName, tilename );
        lastTile.style = ChessBoardSelector.lastTileSelected_style;
        ChessBoardSelector.lastTileSelected = null;
        ChessBoardSelector.lastTileSelected_style = null;
        return;
    }
    var coords = getTileCoord( tilename );
    var piece = ChessBoard.getObjectAtCoord( coords );
    if (piece == null) { return; }
    if (ChessBoard.player != piece.color) { return; }
    var tile = getTileElement( tilename );
    ChessBoardSelector.lastTileSelected = tilename;
    ChessBoardSelector.lastTileSelected_style = tile.style;
    tile.style.backgroundColor = "#1477CC";
    
}

var initBoard = function() {
    ChessBoard.initBoard();
    ChessBoard.drawBoard();
    for ( var i = 0; i < 8; i++ ) {
        for ( var j = 0; j < 8; j++ ) {
            var tilename = getTileName([i,j]);
            var tile = getTileElement( tilename );
            tile.setAttribute( 'onclick', 'clickedTile( "' + tilename + '" )' );
        }
    }
}

var writeMove = function( moveOne, moveTwo ) {
    var div = document.getElementById("move-container");
    div.innerHTML += "<p>" + moveOne + " " + moveTwo + "</p>";
    div.scrollTop = div.scrollHeight;
}

document.addEventListener( 'DOMContentLoaded', initBoard, false );