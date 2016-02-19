
var height = 6;
var width = 7;
var squareSize = 90;
var game = [];
var tokens = ['none', 'red', 'black'];
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
var whosTurn = 0;
var turns = 0;
var gameover = false;

function genBoard() {
    squareSize = Math.floor((window.innerHeight - (20 + (height * 2))) / (height + 1));
    console.log(window.innerHeight - 20);
    var boardWidth = ((squareSize + 2) * width);
    var spacerWidth = (document.body.clientWidth - (boardWidth + 2)) / 2;

    var action = document.getElementById('action');
    action.style.width = board + 'px';
    action.style.height = squareSize + 'px';
    action.style.display = 'inline-block';
    action.style.verticalAlign = 'top';

    var display = document.getElementById('display');
    display.style.width = (spacerWidth) + 'px';
    display.style.height = squareSize + 'px';
    display.style.display = 'inline-block';
    display.style.verticalAlign = 'top';

    var board = document.getElementById('board');
    board.style.width = (boardWidth) + 'px';
    board.style.height = ((squareSize + 2) * height) + 'px';
    board.style.border = '1px solid black';
    board.style.display = 'inline-block';

    var spacer = document.getElementById('spacer');
    spacer.style.width = spacerWidth + 'px';
    spacer.style.display = 'inline-block';


    for (var i = 0; i < height; i ++) {
        game.push([]);
        var row = document.createElement('div');
        row.style.height = (squareSize + 2) + 'px';
        for (var j = 0; j < width; j++) {
            game[i].push(0);
            if (i == 0) {
                var div = document.createElement('div');
                div.style.display = 'inline-block';
                div.style.width = (squareSize + 2) + 'px';
                var button = document.createElement('button');
                var text = document.createTextNode('Insert');
                button.appendChild(text);
                button.id = j;
                button.className += 'insert';
                button.onclick = insertClick;
                div.appendChild(button);
                div.style.textAlign = 'center';
                action.appendChild(div);
            }
            var square = document.createElement('div');
            square.style.width = squareSize + 'px';
            square.style.height = squareSize + 'px';
            square.style.border = '1px solid black';
            square.style.display = 'inline-block';
            square.id = i +'-' + j;
            row.appendChild(square);
        }
        board.appendChild(row);
    }
}

function insertClick() {
    if (!gameover) {
        var column =+ this.id;
        for (var row = 0; row < game.length; row++) {
            if (game[row][column] == 0) {
                (function (row, column, whosTurn) {
                    window.setTimeout(function() {
                        genToken(row, column, whosTurn);
                    }, (row * 100));
                })(row, column, whosTurn);
            } else {
                break;
            }
        }
        // TODO: fix hack
        game[row-1][column] = whosTurn +1;
        turns++;
        if (turns >= 7) {
            if (checkWin()) {
                gameover = true;
                win();
                return
            }
        }
        if (turns == height * width) {
            gameover = true;
            draw()
            return;
        }
        whosTurn = (whosTurn == 0) ? 1 : 0;
        displayTurn();
    }
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
            // compair up
            if (row > (height - 4)) {
                if (game[row][column] !=0 && game[row][column] == game[row - 1][column] && game[row - 1][column] == game[row - 2][column] && game[row - 2][column] == game[row - 3][column]) {
                    console.log('up');
                    return true;
                }
            }
            if (column < (width - 3)) {
                // compair right
                if (game[row][column] !=0 && game[row][column] == game[row][column + 1] && game[row][column + 1] == game[row][column + 2] && game[row][column + 2] == game[row][column + 3]) {
                    console.log('right');
                    return true;
                }
            }
            if (row > (height - 4) && column < (width - 3)) {
                // compair up-right diagonal
                if (game[row][column] !=0 && game[row][column] == game[row - 1][column + 1] && game[row - 1][column + 1] == game[row - 2][column + 2] && game[row - 2][column + 2] == game[row - 3][column + 3]) {
                    console.log('up-right diag');
                    return true;
                }
            }
            if (row < (height - 3) && column < (width-3)) {
                // compair down-right diagonal
                if (game[row][column] !=0 && game[row][column] == game[row + 1][column + 1] && game[row + 1][column + 1] == game[row + 2][column + 2] && game[row + 2][column + 2] == game[row + 3][column + 3]) {
                    console.log('down-right diag');
                    return true;
                }
            }
        }
    }
    return false;
}

function displayTurn() {
    var display = document.getElementById('display');
    display.style.color = players[whosTurn].color;
    display.innerText = 'It is ' + players[whosTurn].name + '\'s turn';
}

function win() {
    var display = document.getElementById('display');
    display.style.color = players[whosTurn].color;
    display.innerHTML = 'The winner is ' + players[whosTurn].name + '!<br><br>';
    var restartButton = document.createElement('button');
    restartButton.innerText = 'Restart';
    restartButton.onclick = function() {
        drop(0);
    }
    display.appendChild(restartButton);
}

function draw() {
    var display = document.getElementById('display');
    display.style.color = players[whosTurn].color;
    display.innerHTML = 'It is a draw!<br><br>';
    var restartButton = document.createElement('button');
    restartButton.innerText = 'Restart';
    restartButton.onclick = function() {
        drop(0);
    }
    display.appendChild(restartButton);
}

function restart() {
    whosTurn = (whosTurn == 0) ? 1 : 0;
    game = [];
    document.getElementById('action').innerHTML = '';
    document.getElementById('board').innerHTML = '';
    genBoard();
    turns = 0;
    gameover = false;
    var display = document.getElementById('display');
    display.style.color = players[whosTurn].color;
    display.innerText = 'It is ' + players[whosTurn].name + '\'s turn';
}

function drop(count) {
    if (count > height) {
        restart()
        return
    }
    for (var row = height-1; row >= 0; row--) {
        for (var column = 0; column < width; column++) {
            var square = document.getElementById(row + '-' + column);
            var token = '';
            if (row > 0) {
                var token = document.getElementById((row - 1) + "-" + column).innerHTML;
            }
            square.innerHTML = token;
        }
    }
    count++
    if (count > height) {
        restart()
        return
    }
    window.setTimeout(function() {
        drop(count)
    }, 150);
}

genBoard();
displayTurn();
