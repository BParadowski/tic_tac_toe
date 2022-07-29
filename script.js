// O => 0 X => 1 . Property name player.sign

const player = (name, sign, score = 0, isComputer = false, ai = false) => {
    return { name, sign, score, isComputer, ai };
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

    const getWinStatus = () => {
        return winStatus;
    }

    const getEmptySquares = () => {
        let emptySquares = [];
        squares.forEach((square,index) => {
            if(square === 'undefined'){ 
            emptySquares.push(index);
        }
    });
        return emptySquares;
    }

    const getCurrentBoard = () =>{ 
        return squares;
    }

    return { update, clear, getWinStatus, getEmptySquares, getCurrentBoard};
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
    const gameLayout = document.querySelector('.layout');
    const gameMessage = document.querySelector('.message');

    const makeMove =  function(e) {
        if(board.update(this, currentPlayer)){
            if (board.getWinStatus() !== ""){
                unbindSquares();
                displayWinMessage();
                if (board.getWinStatus() !== "It's a draw"){
                    currentPlayer.score++;
                    displayScores();   
                }
                currentPlayer = (currentPlayer === player1) ? player2 : player1;
                return undefined;
            }
            currentPlayer = (currentPlayer === player1) ? player2 : player1;
            if (currentPlayer.isComputer){
                computerMove();
            }
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
        gameLayout.classList.remove('open');
        gameMessage.classList.remove('open');
    }
   
    const newRound = () => {
        board.clear();
        bindSquares();
        gameMessage.classList.remove('open');
        if (currentPlayer.isComputer){
            computerMove();
        }
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

    const displayWinMessage = () => {
        gameMessage.textContent =  board.getWinStatus();
        gameMessage.classList.add('open');
    }

    const computerMove = () => {
        const move = () => {
            let computerChoice;
            if (currentPlayer.ai){
            computerChoice = ai.produceMove(currentPlayer);
            }
            else{
            let emptySquares = board.getEmptySquares();
            computerChoice = emptySquares[Math.floor(Math.random()*emptySquares.length)];
            }
            const domSquare = document.getElementById(computerChoice);
            makeMove.call(domSquare);
        }
        setTimeout(move, 500);
    }

    const init = (p1, p2) => {
        player1 = p1;
        player2 = p2;
        currentPlayer = player1;
        bindSquares();
        displayNames();
        displayScores();
        gameLayout.classList.add('open');
        if (currentPlayer.isComputer){
            computerMove();
        }
    }

    bindButtons();
    return {init, computerMove};

})();


const preGameLobby = (function(){

    let cpStatus1 = false;
    let cpStatus2 = false;
    const name1 = document.getElementById("player1-name");
    const name2 = document.getElementById("player2-name");
    const newGameButton = document.querySelector('.lobby__button');
    const lobbyPopup = document.querySelector('.lobby');
    const compBtn1 = document.getElementById('comp-buttton-1')
    const compBtn2 = document.getElementById('comp-buttton-2')

    
    const newGame = (e) => {
        e.preventDefault();
        let player1 = player(name1.value, 1, 0, cpStatus1);
        let player2 = player(name2.value, 0, 0, cpStatus2, true);
        game.init(player1, player2);
        lobbyPopup.classList.toggle('open');
    }

    newGameButton.addEventListener('click', newGame);

    const setComputer1 = () => {
        cpStatus1 = cpStatus1 ? false : true;
        compBtn1.classList.toggle('selected');
        name1.disabled = name1.disabled  ? false : true;
        if (cpStatus1 && cpStatus2){
            name1.value = 'Computer 1';
            name2.value = 'Computer 2';
        }
        else{
            name1.value =  name1.value === "" ? "Computer" : "";
        }
        if (cpStatus2 && !cpStatus1 && name2.value  !== 'Computer'){
            name2.value = 'Computer';
        }
    }

    const setComputer2 = () => {
        cpStatus2 = cpStatus2 ? false : true;
        compBtn2.classList.toggle('selected');
        name2.disabled  = name2.disabled  ? false : true;
        if (cpStatus1 && cpStatus2){
            name1.value = 'Computer 1';
            name2.value = 'Computer 2';
        }
        else{
            name2.value =  name2.value === "" ? "Computer" : "";
        }
        if (cpStatus1 && !cpStatus2 && name1.value  !== 'Computer'){
            name1.value = 'Computer';
        }
    }

    compBtn1.addEventListener('click', setComputer1);
    compBtn2.addEventListener('click', setComputer2);

    const newLobby = () => {
        lobbyPopup.classList.toggle('open');
        if (cpStatus1){
            setComputer1();
        }
        if (cpStatus2){
            setComputer2();
        }
        name1.value = "";
        name2.value = "";
    }
    
    newLobby();
    return {newLobby};
})();

const ai = (function(){
    let evaluatedBoard;

    const produceMove = (player) => {
        evaluatedBoard = board.getCurrentBoard();
        let playerAi = player;
        console.log(playerAi);
        let recommendedIndex = max(playerAi.sign);
        return recommendedIndex[1]; 
        // max returns an array [ result of best move, index of best move]
    } 

    const max = (sign) => {
        let index;
        let maxValue = -2;
        let result = checkWinStatus(sign);

        if (result === 'win'){
            return [1, 0];
        }
        else if (result === 'draw'){
            return [0, 0];
        }

        else if (result === "loss"){
            return [-1, 0];
        }

        for (let i = 0; i < 9; i++){
            if (evaluatedBoard[i] === 'undefined'){
                evaluatedBoard[i] = sign;
                let effects = min(sign);
                
                if (effects[0] > maxValue){
                    maxValue = effects[0];
                    index = i;
                }

                evaluatedBoard[i] = 'undefined';
            } 
        }
        return [maxValue, index]
    }

    const min = (sign) => {
// reversing the sign to "play-test" as AI's enemy
        let reversedSign = sign === 1 ? 0 : 1;

        let index;
        let minValue = 2;
        let result = checkWinStatus(reversedSign);

        if (result === 'win'){
            return [-1, 0];
        }
        else if (result === 'draw'){
            return [0, 0];
        }
        else if (result === "loss"){
            return [1, 0];
        }

        for (let i = 0; i < 9; i++){
            if (evaluatedBoard[i] === 'undefined'){
                evaluatedBoard[i] = reversedSign;
// reversing the sign again to simulate max-ing from AI's perspective again
                let effects = max(sign)

                if (effects[0] < minValue){
                    minValue = effects[0];
                    index = i;
                }
                evaluatedBoard[i] = 'undefined';
            } 
        }
        return [minValue, index]
    }

    const checkWinStatus = (sign) => {

        let reversedSign = sign === 1 ? 0 : 1;

        if ((evaluatedBoard[0] === sign && evaluatedBoard[1] === sign && evaluatedBoard[2] === sign) ||
            (evaluatedBoard[3] === sign && evaluatedBoard[4] === sign && evaluatedBoard[5] === sign) ||
            (evaluatedBoard[6] === sign && evaluatedBoard[7] === sign && evaluatedBoard[8] === sign) ||
            (evaluatedBoard[0] === sign && evaluatedBoard[3] === sign && evaluatedBoard[6] === sign) ||
            (evaluatedBoard[1] === sign && evaluatedBoard[4] === sign && evaluatedBoard[7] === sign) ||
            (evaluatedBoard[2] === sign && evaluatedBoard[5] === sign && evaluatedBoard[8] === sign) ||
            (evaluatedBoard[0] === sign && evaluatedBoard[4] === sign && evaluatedBoard[8] === sign) ||
            (evaluatedBoard[2] === sign && evaluatedBoard[4] === sign && evaluatedBoard[6] === sign)){
            return 'win';
        }
        else if ((evaluatedBoard[0] === reversedSign && evaluatedBoard[1] === reversedSign && evaluatedBoard[2] === reversedSign)||
                (evaluatedBoard[3] === reversedSign && evaluatedBoard[4] === reversedSign && evaluatedBoard[5] === reversedSign) ||
                (evaluatedBoard[6] === reversedSign && evaluatedBoard[7] === reversedSign && evaluatedBoard[8] === reversedSign) ||
                (evaluatedBoard[0] === reversedSign && evaluatedBoard[3] === reversedSign && evaluatedBoard[6] === reversedSign) ||
                (evaluatedBoard[1] === reversedSign && evaluatedBoard[4] === reversedSign && evaluatedBoard[7] === reversedSign) ||
                (evaluatedBoard[2] === reversedSign && evaluatedBoard[5] === reversedSign && evaluatedBoard[8] === reversedSign) ||
                (evaluatedBoard[0] === reversedSign && evaluatedBoard[4] === reversedSign && evaluatedBoard[8] === reversedSign) ||
                (evaluatedBoard[2] === reversedSign && evaluatedBoard[4] === reversedSign && evaluatedBoard[6] === reversedSign)){
                return 'loss';
        }
        else if (!(evaluatedBoard.includes('undefined'))){
            return 'draw';
        };
        return "";
    }

    return {produceMove};
})();