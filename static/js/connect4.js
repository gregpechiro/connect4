// 263 -
// initial ize global variables

// this is the total number of squares tall the board will be
var height = 6;
// this is the total number of squares wide the board will be
var width = 7;
// this is the size in pixels one side of a square will be
var squareSize = 90;
// this is where the game data will be stored.
// it used to check if there is a win
// it will become a 2d array
var game = [];
// this is the player setup containing the player name and token color
var players = [
    {
        'name': 'player 1',
        'color': 'red'
    },
    {
        'name': 'player 2',
        'color': 'black'
    }
];
// this is whos turn it currently is. it is the index of the player in the array above
var whosTurn = 0;
// thi isthe totalt nuber of turns in the game
var turns = 0;
// this says when the game is over
var gameover = false;
// this locks the actions buttons when needed
var lock = false;

// create gen board funciton.
// when this runs it will create a playing board based on the height and width specified
// and size it based on the current window size.
// this must be called some time before the game starts
// it can be called directly at the end of this file or by another function that sets uo the playing parameters

function genBoard() {
    // get the 2 different potentioal sizes for a game square
    // (the size is the length of one side)
    // one based on the window height and one based on the window width

    // add 20 pixels for some margin above and bellow
    // add 2 pixels per square for a border
    tempSquareSizeH = Math.floor((window.innerHeight - (20 + (height * 2))) / (height + 1));

    // add 500 pixels to leave room for the display
    // add 2 pixels per square for a border
    tempSquareSizeW = Math.floor((window.innerWidth - (500 + (width * 2))) / width);
    bw = document.body.clientWidth;

    // compair the 2 possible square sizes and keep the one that is smaller to ensure the generated board
    // will fit within the window height AND width
    squareSize = (tempSquareSizeH < tempSquareSizeW) ? tempSquareSizeH : tempSquareSizeW;

    /*
    this is long hand for the ternary operator above
    they will both work and do the EXACT same thing

    if (tempSquareSizeH < tempSquareSizeW) {
        squareSize = tempSquareSizeH;
    } else {
        squareSize = tempSquareSizeW;
    }

    */

    // once the spuare size is set calulate the total board width
    // the total width is the square size plus 2 for a 2 pixel border per square (1 pixel per side)
    // the multiply by the total number of squares wide
    var boardWidth = ((squareSize + 2) * width);

    // calulate the space on either side of the board by adding 2 pixels to the board width
    // (1 pixel border around the whole board)
    // next subtract that from the total window width
    // then divide by 2 so the board will be centered
    var spacerWidth = (document.body.clientWidth - (boardWidth + 2)) / 2;

    // create severale empty divs
    // content will be added to these later
    // create them all at the appropriate size

    // this div will display whos turn it is and whether some some won or if there is a draw
    var display = document.getElementById('display');
    display.style.width = spacerWidth + 'px';
    display.style.height = squareSize + 'px';
    display.style.display = 'inline-block';
    display.style.verticalAlign = 'top';

    // this div will have all of the action buttons in it to insert a token into that row
    var action = document.getElementById('action');
    action.style.width = boardWidth + 'px';
    action.style.height = squareSize + 'px';
    action.style.display = 'inline-block';
    action.style.verticalAlign = 'top';

    // this  div pushes the board out from the left to align it properly
    var spacer = document.getElementById('spacer');
    spacer.style.width = spacerWidth + 'px';
    spacer.style.display = 'inline-block';

    // this div is the actual game board
    // all of the squares will be generated in here
    var board = document.getElementById('board');
    board.style.width = boardWidth + 'px';
    board.style.height = ((squareSize + 2) * height) + 'px';
    board.style.border = '1px solid black';
    board.style.display = 'inline-block';

    // first loop over the number of squares tall the board is
    for (var i = 0; i < height; i ++) {
        // for every square high push a new empty array on to our game array
        // then create a row
        game.push([]);
        var row = document.createElement('div');
        row.style.height = (squareSize + 2) + 'px';
        // for every row loop over the number of su=quares wide the board is
        for (var j = 0; j < width; j++) {
            // for every column in every row push 0 on to that row's array
            game[i].push(0);
            // if i == 0 we are on the first row
            if (i == 0) {
                // create an empty div with a button inside
                // this will be the insert into column button
                var div = document.createElement('div');
                div.style.display = 'inline-block';
                div.style.width = (squareSize + 2) + 'px';
                var button = document.createElement('button');
                var text = document.createTextNode('Insert');
                button.appendChild(text);
                button.id = j;
                button.className += 'insert';
                // set what happens when the button is clicked
                // SEE insertClick funciton
                button.onclick = insertClick;
                div.appendChild(button);
                div.style.textAlign = 'center';
                // add the square to the actin div
                action.appendChild(div);
            }
            // create an individual square
            // one square gets created per row per column
            var square = document.createElement('div');
            square.style.width = squareSize + 'px';
            square.style.height = squareSize + 'px';
            square.style.border = '1px solid black';
            square.style.display = 'inline-block';
            square.id = i +'-' + j;
            // add the square to the row
            row.appendChild(square);
        }
        // add the row to the board
        board.appendChild(row);
    }
}

// this function runs when an insert button is clicked
function insertClick() {
    // only proceed if the game is NOT over and if the insert is NOT locked
    if (!gameover && !lock) {
        // lock the insert so no other insert button can be cicked until it is finished
        lock = true;
        // get the column number that was clicked from the button id
        var column =+ this.id;
        // loop over all of the rows
        for (var row = 0; row < game.length; row++) {
            // check the square to see if its empty
            // use the game 2d array to compair the value at the row and column indices
            // if it is 0 then it is empty
            if (game[row][column] == 0) {
                // run a function after a certain amount of time to generate a token
                // the pause is so we can see the token annimation.
                // the token will appear to be falling by removing generating a token in a square
                // remove a token from the square above it if there is one
                // pause 100 miliseconds then repeat
                // this has to be in an anonymous function to preserve variable state
                (function (row, column, whosTurn) {
                    window.setTimeout(function() {
                        // SEE genToken function
                        genToken(row, column, whosTurn);
                    }, (row * 100));
                })(row, column, whosTurn);
            } else {
                // break the loop if the square is full
                break;
            }
        }
        // run a function after a certain amount of time to finish the insert
        window.setTimeout(function() {
            continueInsert(row, column)
        }, row * 100);
    }
}

// continue the insert
function continueInsert(row, column) {
    // mark the game 2d array to the player who just took there turn
    // insert the players index + 1 at the game row and column
    // (0 is reserved for no mark)
    game[row-1][column] = whosTurn + 1;
    turns++;
    if (turns >= 7) {
        if (checkWin()) {
            gameover = true;
            updateDisplay('The winner is ' + players[whosTurn].name + '!<br><br>');
            genEndGameButtons();
            lock = false;
            return
        }
    }
    if (turns == height * width) {
        gameover = true;
        updateDisplay('It is a draw!<br><br>');
        genEndGameButtons();
        lock = false;
        return;
    }
    whosTurn = (whosTurn == 0) ? 1 : 0;
    updateDisplay('It is ' + players[whosTurn].name + '\'s turn');
    lock = false;
}

function genToken(row, column, whosTurn) {
    var token = document.createElement('div');
    token.style.height = squareSize + 'px';
    token.style.width = squareSize + 'px';
    token.style.borderRadius = '50%';
    token.style.backgroundColor = players[whosTurn].color;
    var square = document.getElementById(row + '-' + column);
    square.appendChild(token);
    if (row > 0) {
        var prevSquare = document.getElementById((row -1) + '-' + column);
        prevSquare.removeChild(prevSquare.childNodes[0]);
    }
}

function checkWin() {
    for (var row = height - 1; row >= 0; row--) {
        for (var column = 0; column < width; column++) {
            if (row > 2) {
                // compair up
                if (game[row][column] !=0 && game[row][column] == game[row - 1][column] && game[row - 1][column] == game[row - 2][column] && game[row - 2][column] == game[row - 3][column]) {
                    document.getElementById(row + '-' + column).style.backgroundColor = 'yellow';
                    document.getElementById((row - 1) + '-' + column).style.backgroundColor = 'yellow';
                    document.getElementById((row - 2) + '-' + column).style.backgroundColor = 'yellow';
                    document.getElementById((row - 3) + '-' + column).style.backgroundColor = 'yellow';
                    return true;
                }
            }
            if (column < (width - 3)) {
                // compair right
                if (game[row][column] !=0 && game[row][column] == game[row][column + 1] && game[row][column + 1] == game[row][column + 2] && game[row][column + 2] == game[row][column + 3]) {
                    document.getElementById(row + '-' + column).style.backgroundColor = 'yellow';
                    document.getElementById(row + '-' + (column + 1)).style.backgroundColor = 'yellow';
                    document.getElementById(row + '-' + (column + 2)).style.backgroundColor = 'yellow';
                    document.getElementById(row + '-' + (column + 3)).style.backgroundColor = 'yellow';
                    return true;
                }
            }
            if (row > 2 && column < (width - 3)) {
                // compair up-right diagonal
                if (game[row][column] !=0 && game[row][column] == game[row - 1][column + 1] && game[row - 1][column + 1] == game[row - 2][column + 2] && game[row - 2][column + 2] == game[row - 3][column + 3]) {
                    document.getElementById(row + '-' + column).style.backgroundColor = 'yellow';
                    document.getElementById((row - 1) + '-' + (column + 1)).style.backgroundColor = 'yellow';
                    document.getElementById((row - 2) + '-' + (column + 2)).style.backgroundColor = 'yellow';
                    document.getElementById((row - 3) + '-' + (column + 3)).style.backgroundColor = 'yellow';
                    return true;
                }
            }
            if (row < (height - 3) && column < (width-3)) {
                // compair down-right diagonal
                if (game[row][column] !=0 && game[row][column] == game[row + 1][column + 1] && game[row + 1][column + 1] == game[row + 2][column + 2] && game[row + 2][column + 2] == game[row + 3][column + 3]) {
                    document.getElementById(row + '-' + column).style.backgroundColor = 'yellow';
                    document.getElementById((row + 1) + '-' + (column + 1)).style.backgroundColor = 'yellow';
                    document.getElementById((row + 2) + '-' + (column + 2)).style.backgroundColor = 'yellow';
                    document.getElementById((row + 3) + '-' + (column + 3)).style.backgroundColor = 'yellow';
                    return true;
                }
            }
        }
    }
    return false;
}

function updateDisplay(message) {
    var display = document.getElementById('display');
    display.style.color = players[whosTurn].color;
    display.innerHTML = message;
}

function genEndGameButtons() {
    var display = document.getElementById('display');
    var rematchButton = document.createElement('button');
    rematchButton.innerText = 'Rematch';
    rematchButton.onclick = function() {
        drop(0);
    }
    display.appendChild(rematchButton);
    var startOverButton = document.createElement('button');
    startOverButton.innerText = 'Start Over';
    startOverButton.onclick = startOver;
    display.appendChild(startOverButton);
}

function drop(count) {
    for (var row = height-1; row >= 0; row--) {
        for (var column = 0; column < width; column++) {
            var square = document.getElementById(row + '-' + column);
            var token = '';
            var backGround = '';
            if (row > 0) {
                var prevSquare = document.getElementById((row - 1) + "-" + column);
                token = prevSquare.innerHTML;
                backGround = prevSquare.style.backgroundColor;
            }
            square.innerHTML = token;
            square.style.backgroundColor = backGround;
        }
    }
    count++;
    if (count > height -1) {
        whosTurn = (whosTurn == 0) ? 1 : 0;
        restart()
        return
    }
    window.setTimeout(function() {
        drop(count)
    }, 150);
}

function restart() {
    game = [];
    document.getElementById('action').innerHTML = '';
    document.getElementById('board').innerHTML = '';
    turns = 0;
    gameover = false;
    genBoard();
    updateDisplay('It is ' + players[whosTurn].name + '\'s turn');
}

function startOver() {
    var board = document.getElementById('game');
    board.style.display = 'none';

    var setup = document.getElementById('setup');
    setup.style.display = 'block';
}
