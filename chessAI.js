var decide = function( boardState ) {
    var pieces = boardState.getAllObjects( boardState.black );
    var actions = [];
    for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i][0];
        var currentLoc = pieces[i][1];
        var possibleMoves = piece.getPossibleMoves( currentLoc );
        console.log( "production", piece, possibleMoves );
        for (var j = 0; j < possibleMoves.length; j++ ) {
            fromTile = getTileName(currentLoc);
            toTile = getTileName(possibleMoves[j]);
            actions.push( [fromTile, toTile] );
        }
    }
    var choice = Math.floor( Math.random() * actions.length );
    var action = actions[choice];
    boardState.movePiece( action[0], action[1] );
}