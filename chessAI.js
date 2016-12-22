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
 * File has dependency on chess.js
 */
 
var AIoption = "random";
 
var updateAIoption = function() {
    radioButtons = document["ai_option_form"]["ai_option"]
    for (var i = 0; i < radioButtons.length; i++ ) {
        if (radioButtons[i].checked) {
            AIoption = radioButtons[i].value;
        }
    }
}

var getActions = function( board, color ) {
    var pieces = board.getAllObjects( color );
    //console.log( pieces );
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
    return actions;
}

var action = [];

var decide = function( boardState ) {
    // gets [ actionset, value ];
    if (AIoption == "2-player") {
        return;
    } else if (AIoption == "random") {
        random( boardState.clone() )
    } else if (AIoption == "greedy") {
        max( boardState.clone(), 0 );
    } else if (AIoption == "minimax") {
        max( boardState.clone(), 2 );
    } else if (AIoption == "alphabeta") {
        alert( "alphabeta NYI" );
        return;
    }
    
    if (action == "checkmate") {
        writeMessage( "Checkmate. Good job." );
        return;
    }
    
    boardState.movePiece( action[0], action[1] );
}

var random = function( board ) {
    actions = getActions( board, board.black );
    
    // Fisher-Yates Shuffle
    for (var i = (actions.length-1); i > 0; i-- ) {
        j = Math.floor( Math.random() * i );
        oldi = actions[i];
        actions[i] = actions[j];
        actions[j] = oldi;
    }
    for (var i = 0; i < actions.length; i++ ) {
        if (!board.movePiece( actions[i][0], actions[i][1] )) {
            continue;
        }
        action = actions[i];
        return;
    }
    action = "checkmate";
    return;
}

// performs the best action white can do and returns the value (does not prune)
var min = function( board, depth ) {
    console.log( "called min with depth " + depth );
    var actions = getActions( board, board.white );
    if (actions.length == 0) { return 10000; }
    var bestAction = [];
    var worstValue = 10000;
    for (var i = 0; i < actions.length; i++ ) {
        var clonedBoard = board.clone();
        if (!clonedBoard.movePiece( actions[i][0], actions[i][1] )) {
            //console.log( "returned false!" );
            continue;
        }
        if (depth == 0) {
            var value = clonedBoard.getValue();
        } else {
            var d = depth - 1;
            var value = max( clonedBoard, d );
        }
        //console.log( "produced value: " + value + " current value: " + worstValue );
        if (value == worstValue) {
            bestAction.push( [actions[i], value] );
            //console.log( "Added the action: " + actions[i][0] + " -> " + actions[i][1] );
        }
        else if (value < worstValue) {
            worstValue = [];
            worstValue = value;
            //console.log( "New best minimizing action: " + actions[i][0] + " -> " + actions[i][1] );
            bestAction.push( [actions[i], value] );
        }
    }
    if (bestAction.length == 0) { return 10000; }
    return bestAction[Math.floor( Math.random() * bestAction.length )][1];
}

// performs the best action black can do and returns the value (does not prune)
var max = function( board, depth ) {
    console.log( "called max with depth " + depth );
    var actions = getActions( board, board.black );
    if (actions.length == 0) { 
        action = "checkmate"; 
        return -10000;
    }
    var bestAction = [];
    var bestValue = -10000;
    for (var i = 0; i < actions.length; i++ ) {
        var clonedBoard = board.clone();
        if (!clonedBoard.movePiece( actions[i][0], actions[i][1] )) {
            //console.log( "returned false!" );
            continue;
        }
        if (depth == 0) {
            var value = clonedBoard.getValue();
        } else {
            var d = depth - 1;
            var value = min( clonedBoard, d );
        }
        //console.log( "produced value: " + value + " current value: " + bestValue );
        if (value == bestValue) {
            bestAction.push( [actions[i], value] );
            //console.log( "Added the action: " + actions[i][0] + " -> " + actions[i][1] );
        }
        else if (value > bestValue) {
            bestAction = [];
            bestValue = value;
            //console.log( "New best maximizing action: " + actions[i][0] + " -> " + actions[i][1] );
            bestAction.push( [actions[i], value] );
        }
    }
    if (bestAction.length == 0) { 
        action = "checkmate"; 
        return;
    }
    var i = Math.floor( Math.random() * bestAction.length );
    action = bestAction[i][0];
    return bestAction[i][1];
}