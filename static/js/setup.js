
// create the start game button
var startButton = document.getElementById('startGame');

// add a click action to the start button
startButton.onclick = function() {
    // run function on click see startGame function
    startGame();
}

// this isthe start game function
// it setups up the variables needed based on the user input
// then triggers the game tostart
function startGame() {
    // get the error div
    var error = document.getElementById('setupError');
    // set the text to nothing
    error.innerText = '';
    // get player 1 name from the input value
    var player1Name = document.getElementById('p1Name').value;
    // check if the player 1 name is empty
    if (player1Name == '') {
        // set the error for an empty input
        error.innerText = 'All fields must be filled out';
        // exit funciton
        return
    }
    // get player 2 name from the input value
    var player2Name = document.getElementById('p2Name').value;
    // check if the player 2 name is empty
    if (player2Name == '') {
        // set the error for an empty input
        error.innerText = 'All fields must be filled out';
        // exit the function
        return
    }
    // check if the player names are the same
    if (player1Name == player2Name) {
        // set the error for matching names
        error.innerText = 'Player names must be different';
        // exit the function
        return
    }
    // get the height of the board from the input
    // the `=+` is a little trick that will convert the string from the input
    // to a javascript nuber
    height =+ document.getElementById('height').value;
    // check if the height is empty
    if (height == '') {
        // set the error for an emty input
        error.innerText = 'All fields must be filled out';
        // exit the function
        return
    }
    // check if the height is less than 4
    if (height < 4) {
        // set the error for minimun dimensions
        error.innerText = 'Minimum dimensions are 4 x 4';
        // exit the function
        return
    }
    // get the width of the board from the input
    // the `=+` is a little trick that will convert the string from the input
    // to a javascript nuber
    width =+ document.getElementById('width').value;
    // check if the width is empty
    if (width == '') {
        // set the error for an empty input
        error.innerText = 'All fields must be filled out';
        // exit the funciton
        return
    }
    // check if the width is less than 4
    if (width < 4) {
        // set the error for minimum dimensions
        error.innerText = 'Minimum dimensions are 4 x 4';
        // exit the function
        return
    }
    // check if the width is greater than 16
    if (width > 16) {
        // set the error for maximum dimensions
        error.innerText = 'Maximum dimensions are 11 x 16';
        // exit the function
        return
    }
    // check if the height is greater than 11
    if (height > 11) {
        // set the error for maxiun dimensions
        error.innerText = 'Maximum dimensions are 11 x 16';
        // exit the function
        return
    }
    // get both players' colors from the inputs
    var player1Color = document.getElementById('p1Color').value;
    var player2Color = document.getElementById('p2Color').value;
    // check if the colors are the same
    if (player1Color == player2Color) {
        // set the error for matching colors
        error.innerText = 'Player colors must be different';
        // exit the function
        return
    }
    // get the starting player radio buttons
    var starters = document.querySelectorAll('#whoStarts');
    // loop over list of players
    for (var i = 0; i < starters.length; i++) {
        // check if the current player is checked
        if (starters[i].checked) {
            // get the player who will start from the input
            whosTurn =+ starters[i].value;
            // exit the for loop
            break;
        }
    }
    // set the players' names and colors into the player
    // setup list of maps
    players[0].name = player1Name;
    players[0].color = player1Color;
    players[1].name = player2Name;
    players[1].color = player2Color;

    // get the setup div
    var setup = document.getElementById('setup');
    // hide the setup by setting the display to none
    setup.style.display = 'none';

    // get the board div
    var board = document.getElementById('game');
    // show the board div by giving the display property a value
    board.style.display = 'block';

    // run the restart function which will also start the game
    // see restart function
    restart();
}
