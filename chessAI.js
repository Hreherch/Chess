var decide = function( boardState ) {
    action = max( boardState.clone(), 0 );
    console.log( action );
    boardState.movePiece( action[0], action[1] );
}

// performs the best action white can do and returns the value
var min = function( board, depth ) {
    
}

// performs the best action black can do and returns the value
var max = function( board, depth ) {
    var pieces = board.getAllObjects( board.black );
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
    // pick initial action that is legal.
    var clonedBoard = board.clone();
    while (true) {
        var action = actions[Math.floor(Math.random() * actions.length)];
        if (!clonedBoard.movePiece( action[0], action[1] )) {
            continue;
        }
        var bestAction = action;
        var bestValue = clonedBoard.getValue();
        break;
    }
    for (var i = 0; i < actions.length; i++ ) {
        var clonedBoard = board.clone();
        if (!clonedBoard.movePiece( actions[i][0], actions[i][1] )) {
            continue;
        }
        var value = clonedBoard.getValue();
        console.log( "produced value: " + value );
        if (value > bestValue) {
            bestValue = value;
            bestAction = actions[i];
        }
    }
    return bestAction;
}