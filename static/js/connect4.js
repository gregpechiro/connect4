// 487 - 263
// initialize global variables

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
var players = [];
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
                // SEE insertClick function
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
        // lock the insert so no other insert button can be clicked until it is finished
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
                // the token will appear to be falling by generating a token in a square
                // remove a token from the square above it if there is one
                // pause 100 miliseconds then repeat
                // this has to be in an anonymous function to preserve variable state
                (function (row, column, whosTurn) {
                    window.setTimeout(function() {
                        // see genToken function
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
    // increment the number of turns taken
    turns++;
    // verfify the number of turns taken is greater than or equal to 7
    // (this is the minimum number of turns needed for a win)
    if (turns > (numPlayers * 3)) {
        // check for a win
        // see checkWin function
        if (checkWin()) {
            // in here someone has won
            // mark the game over
            gameover = true;
            // display the winner
            updateDisplay('The winner is ' + players[whosTurn].name + '!<br><br>');
            // display the rematch and restart buttons see genEndGameButtons function
            genEndGameButtons();
            // unlock
            lock = false;
            return
        }
    }
    // check for a tie. If the number of turns taken equals the total number
    // of squares on the board and there is no winner then there is a tie
    if (turns == height * width) {
        // in here there is a tie
        // mark the game over
        gameover = true;
        // display there is  a tie
        updateDisplay('It is a draw!<br><br>');
        // display the rematch and restart buttons see genEndGameButtons function
        genEndGameButtons();
        // unlock
        lock = false;
        return;
    }
    // at this point no one has won and there is no tie
    // switch whos turcn it is
    setWhosTurn();
    // display whos turns it is
    updateDisplay('It is ' + players[whosTurn].name + '\'s turn');
    // unlock
    lock = false;
}

// this function is responsible for annimating the tokens
// it will draw a token in the givven square then remove
// a token from the square above it if there is one.
// this will give the illusion that the token is falling
// this only draws and removes one token
// for the full effect we call it in a loop
function genToken(row, column, whosTurn) {
    // create the token div and style it
    var token = document.createElement('div');
    // set the height and width to the square size so the token fills the square
    token.style.height = squareSize + 'px';
    token.style.width = squareSize + 'px';
    // set the border radius to make it a circle
    token.style.borderRadius = '50%';
    // color the token to the player who just took their turn's color
    token.style.backgroundColor = players[whosTurn].color;
    // get the square where we want the token to go
    var square = document.getElementById(row + '-' + column);
    // append the token to the square
    square.appendChild(token);
    // check if the row we inserted into is the first row
    // we want to remove the token above the token we created next
    // this can only be done if there is a token in the row above this one
    // the only time there will not be a token above this one is if it is the first row
    if (row > 0) {
        // in here the row is not the first row
        // get the square above the current square
        var prevSquare = document.getElementById((row -1) + '-' + column);
        // remove the inner token from the square
        prevSquare.removeChild(prevSquare.childNodes[0]);
    }
}

// this function checks if anyone has won
function checkWin() {
    // loop all of the rows starting at the bottom instead of the top
    // the height - 1 will be the id of the bottom row
    for (var row = height - 1; row >= 0; row--) {
        // for every row loop the columns starting at the left
        for (var column = 0; column < width; column++) {
            // check if the current row is less than two
            // if it is less than two then there are at least three rows above it
            if (row > 2) {
                // compare up
                // compare the current square to the squares three rows above it at the same column
                if (game[row][column] !=0 && game[row][column] == game[row - 1][column] && game[row - 1][column] == game[row - 2][column] && game[row - 2][column] == game[row - 3][column]) {
                    // if they all match then there is a win
                    // highlight the matching four
                    document.getElementById(row + '-' + column).style.backgroundColor = 'yellow';
                    document.getElementById((row - 1) + '-' + column).style.backgroundColor = 'yellow';
                    document.getElementById((row - 2) + '-' + column).style.backgroundColor = 'yellow';
                    document.getElementById((row - 3) + '-' + column).style.backgroundColor = 'yellow';
                    // return true for a win
                    return true;
                }
            }
            // check if the current column is less than the width - 3
            // if it is then there are at least three columns to the right at the same row
            if (column < (width - 3)) {
                // compare right
                // compare the current square to the squares three columns
                // to the right of it at te same row
                if (game[row][column] !=0 && game[row][column] == game[row][column + 1] && game[row][column + 1] == game[row][column + 2] && game[row][column + 2] == game[row][column + 3]) {
                    // if they all match then there is a win
                    // highlight the matching four
                    document.getElementById(row + '-' + column).style.backgroundColor = 'yellow';
                    document.getElementById(row + '-' + (column + 1)).style.backgroundColor = 'yellow';
                    document.getElementById(row + '-' + (column + 2)).style.backgroundColor = 'yellow';
                    document.getElementById(row + '-' + (column + 3)).style.backgroundColor = 'yellow';
                    // return true for a win
                    return true;
                }
            }
            // check if the current row is less than two and
            // check if the current column is less than the width - 3
            // if both are true then there are at least three rows above and
            // at least three rows to the right
            if (row > 2 && column < (width - 3)) {
                // compair up-right diagonal
                // compare the current square to the three squares, up one row
                //and right one column each square
                if (game[row][column] !=0 && game[row][column] == game[row - 1][column + 1] && game[row - 1][column + 1] == game[row - 2][column + 2] && game[row - 2][column + 2] == game[row - 3][column + 3]) {
                    // if they all match then there is a win
                    // highlight the matching four
                    document.getElementById(row + '-' + column).style.backgroundColor = 'yellow';
                    document.getElementById((row - 1) + '-' + (column + 1)).style.backgroundColor = 'yellow';
                    document.getElementById((row - 2) + '-' + (column + 2)).style.backgroundColor = 'yellow';
                    document.getElementById((row - 3) + '-' + (column + 3)).style.backgroundColor = 'yellow';
                    // return true for a win
                    return true;
                }
            }
            // check if the current row is less than height - 3 and
            // check if the current column is less than the width - 3
            // if both are true then there are at least three rows below and
            // at least three rows to the right
            if (row < (height - 3) && column < (width-3)) {
                // compair down-right diagonal
                // compare the current square to the three squares, down one row
                //and right one column each square
                if (game[row][column] !=0 && game[row][column] == game[row + 1][column + 1] && game[row + 1][column + 1] == game[row + 2][column + 2] && game[row + 2][column + 2] == game[row + 3][column + 3]) {
                    // if they all match then there is a win
                    // highlight the matching four
                    document.getElementById(row + '-' + column).style.backgroundColor = 'yellow';
                    document.getElementById((row + 1) + '-' + (column + 1)).style.backgroundColor = 'yellow';
                    document.getElementById((row + 2) + '-' + (column + 2)).style.backgroundColor = 'yellow';
                    document.getElementById((row + 3) + '-' + (column + 3)).style.backgroundColor = 'yellow';
                    // return true for a win
                    return true;
                }
            }
        }
    }
    // if we are here the there is no win yet
    // return false for no win
    return false;
}

// this function displays any text passed to it in the display div
// it will also color the message to the current players color
function updateDisplay(message) {
    // get the display div
    var display = document.getElementById('display');
    // set the color to the current playes div
    display.style.color = players[whosTurn].color;
    // set the text to the message passed in
    display.innerHTML = message;
}


// this function creates the rematch and restart buttons after the game has ended
function genEndGameButtons() {
    // get the display element
    var display = document.getElementById('display');
    // create the rematch button
    var rematchButton = document.createElement('button');
    // add text to the button
    rematchButton.innerText = 'Rematch';
    // add a click action to the button
    rematchButton.onclick = function() {
        // see drop function
        drop(0);
    }
    // add the button to the display
    display.appendChild(rematchButton);
    // create the restart button
    var startOverButton = document.createElement('button');
    // add text to the button
    startOverButton.innerText = 'Start Over';
    // add a click action to the button see startOver function
    startOverButton.onclick = startOver;
    // add the button to the display
    display.appendChild(startOverButton);
}

// this function creates the end of game annimation
// it looks as if the bottomwas removed and all of the tokens dropped down
// like the real connect 4 game
// this is a recursive function it needs to run a number of times equal to the
// number of rows/height of the game board
// every time this is called it is passed the number of time it already has been called
// it starts in one square and will draw the token in the square above it into itself
// then loop over all of  the squares from the bottom right
function drop(count) {
    // loop over the height
    for (var row = height-1; row >= 0; row--) {
        // for every row loop over the width
        for (var column = 0; column < width; column++) {
            // get the square located at the row and column
            var square = document.getElementById(row + '-' + column);
            // setup the toen and background variables
            var token = '';
            var backGround = '';
            // check if we are NOT in the top row
            if (row > 0) {
                // get the square above the current square in the same column
                var prevSquare = document.getElementById((row - 1) + "-" + column);
                // set the token to the previous square's token
                token = prevSquare.innerHTML;
                // set the background to the previous square's background
                // this will allow the win highlight to drop as well
                backGround = prevSquare.style.backgroundColor;
            }
            // set the current square's token to the token
            // this will either be the a token or empty
            square.innerHTML = token;
            // set the current square's BACKGROUND to the background
            // this will either be the a the win hightlight or empty
            square.style.backgroundColor = backGround;
        }
    }
    // add to the number of times we ran this function
    count++;
    // check if the count is greater than the height -1
    if (count > height -1) {
        // switch the players turn
        setWhosTurn();
        // restart the game see  restart function
        restart()
        // exit the fdrop function
        return
    }
    // if here then the count is not greater than the height - 1
    window.setTimeout(function() {
        // run the drop function again after a given amount of time
        // passing the updated count
        drop(count)
        // the delay allows the tokens to be seen as they are dropping
    }, 150);
}

// this function restarts the game with the same settings
function restart() {
    // reset the game dta variable
    game = [];
    // clear the action button area
    document.getElementById('action').innerHTML = '';
    // clear the board area
    document.getElementById('board').innerHTML = '';
    // set the yurns to zero
    turns = 0;
    // mark game over to false
    gameover = false;
    // re-generate the game board with the current settings
    genBoard();
    // display the cirrent players turn
    updateDisplay('It is ' + players[whosTurn].name + '\'s turn');
}

// this function will allow the players to completely start over`
// they will be presented with the form originally used to set up the game
// the previous games values with still be the starting form values
function startOver() {
    // get the board
    var board = document.getElementById('game');
    // hide the board by by not displaying it
    board.style.display = 'none';
    // get the setup form
    var setup = document.getElementById('setup');
    // show the setup form by adding a display type
    setup.style.display = 'block';
    players = [];
    game = [];
    turns = 0;
    gameover = false;
}

function setWhosTurn() {
    if (whosTurn == numPlayers - 1) {
        whosTurn = 0;
        return;
    }
    whosTurn++;
}
