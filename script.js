// O => 0 X => 1 . Property name player.sign

const player = (name, sign, score = 0) => {
    return { name, sign, score };
}


const board = (function(){
    const squares = ['undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined','undefined','undefined','undefined',];
    let winStatus = "";

    const render = (node, sign) => {
        node.textContent = sign ? 'X' : 'O';
    }

    const update = (node, player) => {
        if (squares[node.id] === 'undefined'){
            squares[node.id] = player.sign;
            render(node, player.sign);
            checkWinStatus(player);
            return true;
        }
        return false;
    }

    const checkWinStatus = (player) => {
        if ((squares[0] === player.sign && squares[1] === player.sign && squares[2] === player.sign) ||
            (squares[3] === player.sign && squares[4] === player.sign && squares[5] === player.sign) ||
            (squares[6] === player.sign && squares[7] === player.sign && squares[8] === player.sign) ||
            (squares[0] === player.sign && squares[3] === player.sign && squares[6] === player.sign) ||
            (squares[1] === player.sign && squares[4] === player.sign && squares[7] === player.sign) ||
            (squares[2] === player.sign && squares[5] === player.sign && squares[8] === player.sign) ||
            (squares[0] === player.sign && squares[4] === player.sign && squares[8] === player.sign) ||
            (squares[2] === player.sign && squares[4] === player.sign && squares[6] === player.sign)){
            winStatus  =`${player.name} won!`;
        }
        else if (!(squares.includes('undefined'))){
            winStatus = "It's a draw";
        };
    }

    const clear = () => {
        const domSquares = document.querySelectorAll(".square");
        domSquares.forEach(square => square.textContent = "");
        for (let i = 0; i < squares.length; i++){
            squares[i] = "undefined";
        }
        winStatus = "";
    }

    const getWinStatus= () => {
        return winStatus;
    }

    return { update, clear, getWinStatus,};
})();


const game = (function() {
    let currentPlayer;
    let player1;
    let player2;
    const squares = document.querySelectorAll('.square');
    const newGameButton = document.querySelector('.new-game-button');
    const newRoundButton = document.querySelector('.new-round-button');
    const player1name = document.getElementById('player1-name-display');
    const player1score = document.getElementById('player1-score-display');
    const player2name = document.getElementById('player2-name-display');
    const player2score = document.getElementById('player2-score-display');

    const makeMove =  function(e) {
        if(board.update(this, currentPlayer)){
            if (board.getWinStatus() !== ""){
                unbindSquares();
                if (board.getWinStatus() !== "It's a draw"){
                    currentPlayer.score++;
                    displayScores();
                }
            }
            currentPlayer = (currentPlayer === player1) ? player2 : player1;
        };
    }

    const bindSquares = () => {
        squares.forEach(square => square.addEventListener('click', makeMove));
    }

    const unbindSquares = () => {
        squares.forEach(square => square.removeEventListener('click', makeMove));
    }

    const newGame = () => {
        board.clear();
        preGameLobby.newLobby();
    }
   
    const newRound = () => {
        board.clear();
        bindSquares();
    }

    const displayNames = () => {
        player1name.textContent = player1.name;
        player2name.textContent = player2.name;
    }

    const displayScores = () => {
        player1score.textContent = player1.score;
        player2score.textContent = player2.score;
    }

    const bindButtons = () => {
        newRoundButton.addEventListener('click', newRound);
        newGameButton.addEventListener('click', newGame);
    }

    const init = (p1, p2) => {
        player1 = p1;
        player2 = p2;
        currentPlayer = player1;
        bindSquares();
        displayNames();
        displayScores();
    }

    bindButtons();
    return {init};

})();


const preGameLobby = (function(){

    const name1 = document.getElementById("player1-name");
    const name2 = document.getElementById("player2-name");
    const newGameButton = document.querySelector('.lobby__button');
    const lobbyPopup = document.querySelector('.lobby');
    
    const newGame = (e) => {
        e.preventDefault();
        let player1 = player(name1.value, 1);
        let player2 = player(name2.value, 0);
        game.init(player1, player2);
        lobbyPopup.classList.toggle('open');
    }

    newGameButton.addEventListener('click', newGame);

    const newLobby = () => {
        lobbyPopup.classList.toggle('open');
        name1.value = "";
        name2.value = "";
    }
    
    newLobby();
    return {newLobby};
})();
