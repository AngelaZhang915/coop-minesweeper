const rows = 10
const cols = 10
const mines = 10

let board = []
let revealed = []

function createBoard() {

    for (let r = 0; r < rows; r++) {

        board[r] = []
        revealed[r] = []

        for (let c = 0; c < cols; c++) {
            board[r][c] = 0
            revealed[r][c] = false
        }
    }

    placeMines()
    calculateNumbers()
}

function placeMines() {

    let placed = 0

    while (placed < mines) {

        let r = Math.floor(Math.random()*rows)
        let c = Math.floor(Math.random()*cols)

        if (board[r][c] !== "M") {
            board[r][c] = "M"
            placed++
        }
    }
}

function calculateNumbers() {

    const dirs = [
        [-1,-1],[-1,0],[-1,1],
        [0,-1],[0,1],
        [1,-1],[1,0],[1,1]
    ]

    for (let r=0;r<rows;r++) {
        for (let c=0;c<cols;c++) {

            if (board[r][c] === "M") continue

            let count = 0

            for (let [dr,dc] of dirs) {

                let nr = r+dr
                let nc = c+dc

                if (
                    nr>=0 && nr<rows &&
                    nc>=0 && nc<cols &&
                    board[nr][nc] === "M"
                ) count++
            }

            board[r][c] = count
        }
    }
}

function drawBoard() {

    const boardDiv = document.getElementById("board")
    boardDiv.innerHTML = ""

    for (let r=0;r<rows;r++) {
        for (let c=0;c<cols;c++) {

            const cell = document.createElement("div")
            cell.className = "cell"

            cell.onclick = () => reveal(r,c)

            if (revealed[r][c]) {
                cell.classList.add("revealed")

                if (board[r][c] === "M")
                    cell.textContent = "💣"
                else if (board[r][c] > 0)
                    cell.textContent = board[r][c]
            }

            boardDiv.appendChild(cell)
        }
    }
}

function reveal(r,c) {

    if (revealed[r][c]) return

    revealed[r][c] = true

    if (board[r][c] === "M") {
        alert("Game Over")
    }

    drawBoard()
}

createBoard()
drawBoard()