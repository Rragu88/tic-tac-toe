const Player = (sign) => {
    this.sign = sign;

    const getSign = () => {
        return sign;
    };

    return { getSign };
}

const gameBoard = (() => {
    const board = ['', '', '', '', '', '', '', '', ''];

    const setField = (index, sign) => {
        console.log(index);
        if (index > board.length) return;
        board[index] = sign;
        console.log(board);
    };

    const getField = (index) => {
        if (index > board.length) return;
        return board[index];
    };

    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    return { setField, getField, reset };
})();

const displayController = (() => {
    const gridElements = document.querySelectorAll('.grid-element');
    const messageElement = document.getElementById('message');
    const restartBtn = document.getElementById('restart-btn');

    gridElements.forEach((field) =>
        field.addEventListener('click', (e) => {
            if (gameController.getIsOver() || e.target.textContent !== "") return;
            gameController.playRound(parseInt(e.target.dataset.index));
            updateGameboard();
        })
    );

    restartBtn.addEventListener('click', (e) => {
        gameBoard.reset();
        gameController.reset();
        updateGameboard();
        setMessageElement(`Player X's Turn`);       
    });

    const updateGameboard = () => {
        for (let i = 0; i < gridElements.length; i++) {
            gridElements[i].textContent = gameBoard.getField(i);
        }
    };

    const setResultMessage = (winner) => {
        if (winner === 'Draw') {
            setMessageElement(`It's a draw!`);
        } else {
            setMessageElement(`Player ${winner} has won!`);
        }
    };

    const setMessageElement = (message) => {
        messageElement.textContent = message;
    };

    return { setResultMessage, setMessageElement };
})();

const gameController = (() => {
    const playerX = Player('X');
    const playerO = Player('Y');
    let round = 1;
    let isOver = false;

    const playRound = (fieldIndex) => {
        gameBoard.setField(fieldIndex, getCurrentPlayerSign());
        if (checkWinner(fieldIndex)) {
            displayController.setResultMessage(getCurrentPlayerSign());
            isOver = true;
            return;
        }
        if (round === 9) {
            displayController.setResultMessage('Draw');
            isOver = true;
            return;
        }
        round++;
        displayController.setMessageElement(`Player ${getCurrentPlayerSign()}'s turn`);
    };

    const getCurrentPlayerSign = () => {
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
    };

    const checkWinner = (fieldIndex) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        return winConditions
            .filter((combination) => combination.includes(fieldIndex))
            .some((possibleCombination) =>
                possibleCombination.every(
                    (index) => gameBoard.getField(index) === getCurrentPlayerSign()
                )
            );
    };

    const getIsOver = () => {
        return isOver;
    }

    const reset = () => {
        round = 1;
        isOver = false;
    }

    return { playRound, getIsOver, reset };
})();