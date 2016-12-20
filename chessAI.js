var decide = function( boardState ) {
    var pieces = boardState.getAllObjects( boardState.black );
    console.log( pieces );
    var actions = [];
    for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i][0];
        var currentLoc = pieces[i][1];
        if (piece.sName == "") {
            var action = piece.getPossibleMoves( currentLoc );
            if (action.length == 0) { continue; }
            console.log( action );
            var fro = getTileName(currentLoc);
            var to = getTileName( action[0] );
            console.log( piece.sName, "attempting to go:", fro, to );
            if (!boardState.movePiece( fro, to )) { continue; }
            return;
        }
    }
}