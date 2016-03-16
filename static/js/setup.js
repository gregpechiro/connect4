var numPlayers = 2;

var addPlayerBUtton = document.getElementById("addPlayer");
addPlayerBUtton.onclick = addPlayer;

function addPlayer() {
    if (numPlayers == 4) {
        // get the error div
        var error = document.getElementById('setupError');
        error.innerText = 'Maximum number of players (4) has been reached';
        return;
    }
    numPlayers++;

    var player = document.createElement('p');
    var id = numPlayers;
    player.id = id;

    var playerLabel = document.createElement('label');
    playerLabel.id = 'playerLabel';
    playerLabel.innerText = 'Player ' + numPlayers;

    var br = document.createElement('br');

    var nameLabel = document.createElement('label');
    nameLabel.innerHTML = 'Name: ';

    var nameInput = document.createElement('input');
    nameInput.id = 'nameInput';
    nameInput.type = 'text';
    nameInput.placeholder = 'Name';
    nameInput.value = 'Player ' + numPlayers;

    var colorLabel = document.createElement('label');
    colorLabel.innerText = ' Color: ';

    var colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = getColor();

    var space = document.createElement('span');
    space.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;';

    var removePlayerButton = document.createElement('button');
    removePlayerButton.id = id;
    removePlayerButton.innerText = 'Remove';
    removePlayerButton.onclick = removePlayer;

    player.appendChild(playerLabel);
    player.appendChild(br);
    player.appendChild(nameLabel);
    player.appendChild(nameInput);
    player.appendChild(colorLabel);
    player.appendChild(colorInput);
    player.appendChild(space);
    player.appendChild(removePlayerButton)

    var playerSetup = document.getElementById('players');
    playerSetup.appendChild(player);

    var start = document.createElement('span');
    start.id = id;

    var startLabel = document.createElement('label');
    startLabel.id = 'startLabel';
    startLabel.innerText= ' Player ' + numPlayers + ': ';

    var startInput = document.createElement('input');
    startInput.type = 'radio';
    startInput.id = 'whoStarts';
    startInput.name = 'whoStarts';
    startInput.value = numPlayers - 1;

    start.appendChild(startLabel);
    start.appendChild(startInput);

    var whoStarts = document.getElementById('starts');
    whoStarts.appendChild(start);
}

function removePlayer() {
    var id = this.id
    var player = document.querySelector('p[id="' + id + '"]');
    var start = document.querySelector('span[id="' + id + '"]');

    var playerSetup = document.getElementById('players');
    playerSetup.removeChild(player);

    var whoStarts = document.getElementById('starts');
    whoStarts.removeChild(start);

    if (id == 3 && numPlayers == 4) {
        var nextPlayer = document.querySelector('p[id="4"]');
        var nextPlayerLabel = nextPlayer.querySelector('#playerLabel');
        nextPlayerLabel.innerText = 'Player 3';
        var nextNameInput = nextPlayer.querySelector('#nameInput');
        if (nextNameInput.value == 'Player 4') {
            nextNameInput.value = 'Player 3';
        }
        nextPlayer.id = 3;

        var nextStart = document.querySelector('span[id="4"]');
        var nextStartLabel = nextStart.querySelector('#startLabel');
        nextStartLabel.innerText = 'Player 3';
        var nextStartInput = nextStart.querySelector('#whoStarts');
        nextStartInput.value = '2';
        nextStart.id = '3';

        var nextRemoveButton = document.querySelector('button[id="4"]');
        nextRemoveButton.id = 3;
    }



    numPlayers--;
}

// get the start game button
var startButton = document.getElementById('startGame');

// add a click action to the start button
startButton.onclick = function() {
    // run function on click see startGame function
    startGame();
}

function getColor() {
    var c = '#' + Math.floor(Math.random()*16777215).toString(16);
    while (c.length < 7) {
        c = c + '0';
    }
    if (c == '#000000' || c == '#ff0000') {
        c = getColor();
    }
    return c;
}

// this isthe start game function
// it setups up the variables needed based on the user input
// then triggers the game tostart
function startGame() {
    // get the error div
    var error = document.getElementById('setupError');
    // set the text to nothing
    error.innerText = '';

    var nameInputs = document.querySelectorAll('div#players input[type="text"]');
    var names = {};
    for (var i = 0; i < nameInputs.length; i++) {
        var name = nameInputs[i].value
        if (name == '') {
            error.innerText = 'All fields must be filled out';
            return
        }
        names[name] = 1;
    }
    if (Object.keys(names).length != numPlayers) {
        error.innerText = 'Player names must be different';
        return
    }

    var colorInputs = document.querySelectorAll('div#players input[type="color"]');
    colors = {};
    for (var i = 0; i < nameInputs.length; i++) {
        var color = colorInputs[i].value
        colors[color] = 1;
    }
    if (Object.keys(colors).length != numPlayers) {
        error.innerText = 'Player colors must be different';
        return
    }





    // get player 1 name from the input value
    /*var player1Name = document.getElementById('p1Name').value;
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
    }*/


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

    /*
    // get both players' colors from the inputs
    var player1Color = document.getElementById('p1Color').value;
    var player2Color = document.getElementById('p2Color').value;
    // check if the colors are the same
    if (player1Color == player2Color) {
        // set the error for matching colors
        error.innerText = 'Player colors must be different';
        // exit the function
        return
    }*/


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
    for (var i = 0; i < nameInputs.length; i++) {
        var player = {};
        player.name = nameInputs[i].value;
        player.color = colorInputs[i].value;
        players.push(player);
    }


    /*
    players[0].name = player1Name;
    players[0].color = player1Color;
    players[1].name = player2Name;
    players[1].color = player2Color;
    */

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
