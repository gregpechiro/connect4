
var startButton = document.getElementById('startGame');
startButton.onclick = function() {
    console.log('clicked');
    startGame();
}

function startGame() {
    var error = document.getElementById('setupError');
    error.innerText = '';
    var player1Name = document.getElementById('p1Name').value;
    if (player1Name == '') {
        error.innerText = 'All fields must be filled out';
        return
    }
    var player2Name = document.getElementById('p2Name').value;
    if (player2Name == '') {
        error.innerText = 'All fields must be filled out';
        return
    }
    height =+ document.getElementById('height').value;
    if (height == '') {
        error.innerText = 'All fields must be filled out';
        return
    }
    if (height < 4) {
        error.innerText = 'Minimum dimensions are 4 x 4';
        return
    }
    width =+ document.getElementById('width').value;
    if (width == '') {
        error.innerText = 'All fields must be filled out';
        return
    }
    if (width < 4) {
        error.innerText = 'Minimum dimensions are 4 x 4';
        return
    }
    var player1Color = document.getElementById('p1Color').value;
    var player2Color = document.getElementById('p2Color').value;
    if (player1Color == player2Color) {
        error.innerText = 'Player colors must be different';
        return
    }
    var starters = document.querySelectorAll('#whoStarts');
    for (var i = 0; i < starters.length; i++) {
        if (starters[i].checked) {
            whosTurn =+ starters[i].value;
            break;
        }
    }
    players[0].name = player1Name;
    players[0].color = player1Color;
    players[1].name = player2Name;
    players[1].color = player2Color;

    var setup = document.getElementById('setup');
    setup.style.display = 'none';

    var board = document.getElementById('game');
    board.style.display = 'block';

    restart();

}
