class Square {
    static empty = null;
    static player = 'x';
    static program = 'circle';

    constructor() {
        this.value = Square.empty;
    }

    isEmpty() {
        return this.value === Square.empty;
    }
}

export class Game {
    static winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6]
    ];
    static playerMark = Square.player;
    static programMark = Square.program;

    constructor() {
        this.newGame();
    }

    newGame() {
        this.squares = new Array(9).fill().map(() => new Square());
        this.inProgress = true;
        this.playersTurn = true;
        this.hardMode = null;
        this.winner = null;
        this.movesMade = 0;
    }

    makeMove(index, player) {
        this.squares[index].value = player;
        this.movesMade++;
        this.playersTurn = !this.playersTurn;

        if (this.isGameOver()) {
            this.inProgress = false;
            this.winner = this.whoWon();
        }
    }

    playersMove(index) {
        if (this.squares[index].isEmpty()) {
            this.makeMove(index, Square.player)
            if (this.inProgress) this.programsMove();
        }
    }

    programsMoveHardMode() {
        const prioritySet = [[], []];

        for (let line of Game.winningCombinations) {
            let emptySquares = [];
            let playersSquaresCounter = 0;
            let programsSquaresCounter = 0;

            for (let i of line) {
                if (this.squares[i].isEmpty()) emptySquares.push(i);
                if (this.squares[i].value === Square.player) playersSquaresCounter++;
                if (this.squares[i].value === Square.program) programsSquaresCounter++;
            }

            if (playersSquaresCounter === 2) prioritySet[1].push(...emptySquares);
            else if (programsSquaresCounter === 2) prioritySet[1].push(...emptySquares);
            else prioritySet[0].push(...emptySquares);
        }

        let prioritySetIndex = prioritySet[1].length > 0 ? 1 : 0;

        const squareIndex = Math.floor(Math.random() * prioritySet[prioritySetIndex].length);

        const index = prioritySet[prioritySetIndex][squareIndex];

        this.makeMove(index, Square.program);
    }

    programsMoveLightMode() {
        let emptySquares = [];

        for (let i = 0; i < this.squares.length; i++) {
            if (this.squares[i].isEmpty()) emptySquares.push(i);
        }

        const squareIndex = Math.floor(Math.random() * emptySquares.length);

        const index = emptySquares[squareIndex];
        this.makeMove(index, Square.program);
    }

    programsMove() {
        if (this.hardMode === null) {
            this.hardMode = (Math.random() < 0.75);
        }

        if (this.hardMode) {
            this.programsMoveHardMode();
        } else {
            this.programsMoveLightMode();
        }
    }

    isGameOver() {
        for (let line of Game.winningCombinations) {
            if (
                this.squares[line[0]].value !== Square.empty
                && this.squares[line[0]].value === this.squares[line[1]].value
                && this.squares[line[0]].value === this.squares[line[2]].value
            ) {
                return true;
            } else if (this.movesMade >= 9) {
                return true;
            }
        }
        return false;
    }

    whoWon() {
        for (let line of Game.winningCombinations) {
            if (
                this.squares[line[0]].value === Square.player
                && this.squares[line[0]].value === this.squares[line[1]].value
                && this.squares[line[0]].value === this.squares[line[2]].value
            ) {
                return Square.player;
            } else if (
                this.squares[line[0]].value === Square.program
                && this.squares[line[0]].value === this.squares[line[1]].value
                && this.squares[line[0]].value === this.squares[line[2]].value
            ) {
                return Square.program;
            }
        }
    }
}