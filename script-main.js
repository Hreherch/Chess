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

function Pawn( color ) {
    this.name = Images.pawn;
    this.color = color;
    this.getImgHTML = function() { return Images.getImgHTML( this.color, this.name ); };
}

function Rook( color ) {
    this.name = Images.rook;
    this.color = color;
    this.getImgHTML = function() { return Images.getImgHTML( this.color, this.name ); };
}

function Knight( color ) {
    this.name = Images.knight;
    this.color = color;
    this.getImgHTML = function() { return Images.getImgHTML( this.color, this.name ); };
    this.validateMove = function( oldCoord, newCoord ) {
        oldx = oldCoord[0];
        oldy = oldCoord[1];
        newx = newCoord[0];
        newy = newCoord[1];
        deltaX = Math.abs( oldx - newx );
        deltaY = Math.abs( oldy - newy );
        if ( deltaX == 1 && deltaY == 2 ) { return true; }
        if ( deltaX == 2 && deltaY == 1 ) { return true; }
        return false;
    }
}

function Bishop( color ) {
    this.name = Images.bishop;
    this.color = color;
    this.getImgHTML = function() { return Images.getImgHTML( this.color, this.name ); };
}

function King( color ) {
    this.name = Images.king;
    this.color = color;
    this.getImgHTML = function() { return Images.getImgHTML( this.color, this.name ); };
}

function Queen( color ) {
    this.name = Images.queen;
    this.color = color;
    this.getImgHTML = function() { return Images.getImgHTML( this.color, this.name ); };
}

var ChessBoard = {
    board: [],
    initBoard: function() {
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
    },
    
    drawBoard: function() {
        for ( var i = 0; i < 8; i++ ) {
            for ( var j = 0; j < 8; j++ ) {
                var piece = this.board[i][j];
                var tilename = getTileName([i, j]);
                if (piece == null) { 
                    removeTileImage( tilename ); 
                } else {
                    setTileImage( tilename, piece.color, piece.name );
                }
            }
        }
    },
    
    movePiece: function( fromTilename, toTilename ) {
        console.log( fromTilename, toTilename );
        var fromCoord = getTileCoord( fromTilename );
        var fromPiece = this.getObjectAtCoord( fromCoord );
        var toCoord = getTileCoord( toTilename );
        var toPiece = this.getObjectAtCoord( toCoord );
        console.log( toCoord, fromCoord );
        // should check color and capture or deny?
        if (toPiece != null) { return; }
        if ( fromPiece.validateMove( fromCoord, toCoord ) ) {
            this.board[toCoord[0]][toCoord[1]] = this.board[fromCoord[0]][fromCoord[1]];
            this.board[fromCoord[0]][fromCoord[1]] = null;
            this.drawBoard();
        }
    },
    
    getObjectAtCoord: function( coords ) {
        return this.board[coords[0]][coords[1]];
    },
}

var ChessBoardSelector = {
    lastTileSelected: null,
    lastTileSelected_value: null,
}

var removeTileImage = function( tilename ) {
    document.getElementById( tilename ).innerHTML = null;
}

var setTileImage = function( tilename, color, piece ) {
    document.getElementById( tilename ).innerHTML = Images.getImgHTML( color, piece );
}

// expects [row, column]
var getTileName = function( coords ) {
    letters = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];
    row = coords[0];
    col = coords[1];
    return letters[col] + (row + 1);
}

var getTileCoord = function( tilename ) {
    letters = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];
    letter = tilename[0];
    col = letters.indexOf( letter );
    row = parseInt( tilename[1] );
    return [row-1, col];
}

var getTileElement = function( tilename ) {
    return document.getElementById( tilename );
}

var clickedTile = function( tilename ) {
    var lastTileName = ChessBoardSelector.lastTileSelected;
    if (lastTileName != null) { var lastTile = getTileElement(lastTileName); }
    if (lastTileName == tilename) {
        lastTile.style = ChessBoardSelector.lastTileSelected_value;
        ChessBoardSelector.lastTileSelected = null;
        ChessBoardSelector.lastTileSelected_value = null;
        return;
    }
    if (lastTile != null) {
        ChessBoard.movePiece( lastTileName, tilename );
        lastTile.style = ChessBoardSelector.lastTileSelected_value;
        ChessBoardSelector.lastTileSelected = null;
        ChessBoardSelector.lastTileSelected_value = null;
        return;
    }
    // 
    var tile = getTileElement( tilename );
    ChessBoardSelector.lastTileSelected = tilename;
    ChessBoardSelector.lastTileSelected_value = tile.style;
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

document.addEventListener( 'DOMContentLoaded', initBoard, false );