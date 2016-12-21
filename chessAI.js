var decide = function( boardState ) {
    action = max( boardState.clone(), 0 );
    if (action == "checkmate") {
        writeMessage( "Checkmate. Good job." );
        return;
    }
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
        for (var j = 0; j < possibleMoves.length; j++ ) {
            fromTile = getTileName(currentLoc);
            toTile = getTileName(possibleMoves[j]);
            actions.push( [fromTile, toTile] );
        }
    }
    if (actions.length == 0) {
        return "checkmate";
    }
    // pick initial action that is legal.
    var bestAction = [];
    var bestValue = -10000;
    for (var i = 0; i < actions.length; i++ ) {
        var clonedBoard = board.clone();
        if (!clonedBoard.movePiece( actions[i][0], actions[i][1] )) {
            console.log( "returned false!" );
            continue;
        }
        var value = clonedBoard.getValue();
        console.log( "produced value: " + value + " current value: " + bestValue );
        if (value == bestValue) {
            bestAction.push( actions[i] );
            console.log( "Added the action: " + actions[i][0] + " -> " + actions[i][1] );
        }
        else if (value > bestValue) {
            bestAction = [];
            bestValue = value;
            console.log( "New best action: " + actions[i][0] + " -> " + actions[i][1] );
            bestAction.push( actions[i] );
        }
    }
    return bestAction[Math.floor( Math.random() * bestAction.length )];
}