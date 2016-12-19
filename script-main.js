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
        this.board.push([new Rook( Images.black ), new Knight( Images.black ), new Bishop( Images.black ), new King( Images.black ), 
                         new Queen( Images.black ), new Bishop( Images.black ), new Knight( Images.black ), new Rook( Images.black ) ]);
        this.board.push([new Pawn( Images.black ), new Pawn( Images.black ), new Pawn( Images.black ), new Pawn( Images.black ), 
                         new Pawn( Images.black ), new Pawn( Images.black ), new Pawn( Images.black ), new Pawn( Images.black ) ]);
        this.board.push([ null, null, null, null, null, null, null, null ]);
        this.board.push([ null, null, null, null, null, null, null, null ]);
        this.board.push([ null, null, null, null, null, null, null, null ]);
        this.board.push([ null, null, null, null, null, null, null, null ]);
        this.board.push([new Pawn( Images.white ), new Pawn( Images.white ), new Pawn( Images.white ), new Pawn( Images.white ), 
                         new Pawn( Images.white ), new Pawn( Images.white ), new Pawn( Images.white ), new Pawn( Images.white ) ]);
        this.board.push([new Rook( Images.white ), new Knight( Images.white ), new Bishop( Images.white ), new King( Images.white ), 
                         new Queen( Images.white ), new Bishop( Images.white ), new Knight( Images.white ), new Rook( Images.white )]);
    },
    drawBoard: function() {
        for ( var i = 0; i < 8; i++ ) {
            for ( var j = 0; j < 8; j++ ) {
                var piece = this.board[i][j];
                if (piece == null) { continue; }
                setTileImage( getTileName([i, j]), piece.color, piece.name );
            }
        }
    }
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

var initBoard = function() {
    ChessBoard.initBoard();
    ChessBoard.drawBoard();
}