// O => 0 X => 1 . Property name player.sign

const player = (name, sign) => {
    return { name, sign };
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
            board.winStatus  =`${player.name} won!`;
            console.log(winStatus);
        }
        else if (!(squares.includes('undefined'))){
            board.winStatus = "It's a draw";
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
    return { update, clear, winStatus,};
})();

const game = (player1, player2) => {
    let currentPlayer;
    currentPlayer = player1;

    const squares = document.querySelectorAll('.square');
    squares.forEach(square => square.addEventListener('click', makeMove));

    function makeMove(e){
        if(board.update(this, currentPlayer)){
            currentPlayer = (currentPlayer === player1) ? player2 : player1;

        };
}
}

const preGameLobby = function(){
    let player1;
    let player2;

    game(player1, player2);
}
