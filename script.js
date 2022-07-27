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
        if (squares[0] === squares[1] === squares[2] === 1 ||
             squares[3] === squares [4] === squares[5] === 1 ||
              squares[6] === squares [7] === squares[8] === 1||
               squares[0] === squares[4] === squares[8] === 1||
                squares[2] === squares[4] === squares[6] === 1||
                 squares[0] === squares[1] === squares[2] === 0 ||
                  squares[3] === squares [4] === squares[5] === 0 ||
                   squares[6] === squares [7] === squares[8] === 0||
                    squares[0] === squares[4] === squares[8] === 0||
                     squares[2] === squares[4] === squares[6] === 0){

            winStatus = `${player.name} won!`;
        }
        else if (!(squares.includes('undefined'))){
            winStatus = "It is a draw";
        }
    }

    const clear = () => {
        const domSquares = document.querySelectorAll(".square");
        domSquares.forEach(square => square.textContent = "");
        squares.forEach(square => square = 'undefined');
        winStatus = "";
        console.log(squares)
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

game({name: "jeff",sign: 1}, {name: "Rob", sign: 0});