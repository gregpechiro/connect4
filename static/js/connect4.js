
var height = 6;
var width = 7;
var squareSize = 90;
var game = [];
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
var lock = false;

function genBoard() {
    tempSquareSizeH = Math.floor((window.innerHeight - (20 + (height * 2))) / (height + 1));
    tempSquareSizeW = Math.floor((window.innerWidth - (500 + (width * 2))) / width);
    bw = document.body.clientWidth;

    squareSize = (tempSquareSizeH < tempSquareSizeW) ? tempSquareSizeH : tempSquareSizeW;

    /*
    if (tempSquareSizeH < tempSquareSizeW) {
        squareSize = tempSquareSizeH;
    } else {
        squareSize = tempSquareSizeW;
    }
    */

    var boardWidth = ((squareSize + 2) * width);
    var spacerWidth = (document.body.clientWidth - (boardWidth + 2)) / 2;

    var action = document.getElementById('action');
    action.style.width = boardWidth + 'px';
    action.style.height = squareSize + 'px';
    action.style.display = 'inline-block';
    action.style.verticalAlign = 'top';

    var display = document.getElementById('display');
    display.style.width = spacerWidth + 'px';
    display.style.height = squareSize + 'px';
    display.style.display = 'inline-block';
    display.style.verticalAlign = 'top';

    var board = document.getElementById('board');
    board.style.width = boardWidth + 'px';
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
    if (!gameover && !lock) {
        lock = true;
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
        window.setTimeout(function() {
            continueInsert(row, column)
        }, row * 100);
    }
}

function continueInsert(row, column) {
    // TODO: fix hack
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
