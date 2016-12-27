# Chess

Chess for your browser, featuring different algorithms to play against and a two-player mode. This was a small project for myself during winter holiday to get my feet wet with JavaScript and HTML. View it here: [https://hreherch.github.io/Chess/](https://hreherch.github.io/Chess/).

### Testing

These files have been tested on Firefox and Chrome browsers, with a a large focus on Chrome. The intention for this project was for personal use so extensive testing on a wide variety of browsers was not done. 

# Files 

### index.html

The html for the project. The chessboard view is set up here.

### chess.js

Handles most of the model of the chessboard. Takes an OO approach.

### chessAI.js

Depending on the selected mode for the AI, selects and makes a move for black. Depends entirely on chess.js.

# Info

### Board Storage

The chess board is stored as a 64 element array, with piece objects (or null) taking up each space. This potentially has room for improvement, considering the use of [bitboards](https://en.wikipedia.org/wiki/Board_representation_(chess)#Bitboard) to store board information.

### Heuristic

The board heuristic uses a simple weighted sum: (value of all black pieces) - (value of all white pieces), with traditional values of K=200, Q=9, Pawn=1, [and so on](http://www.gamecolony.com/chesspieces.html). Because the board does not store information about what pieces it has still, the evaluation function must go through every tile and make this sum, leaving room for optimization. 

# License

This project is licenced under the MIT License - see [LICENSE](LICENSE).
