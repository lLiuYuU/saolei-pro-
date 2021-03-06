function renderBoard(numRows, numCols, grid) { //行，列
    let boardEl = document.querySelector("#board")

    for (let i = 0; i < numRows; i++) {
        let trEl = document.createElement("tr"); //创建tr 行
        for (let j = 0; j < numCols; j++) {
            let cellEl = document.createElement("div"); //空格，雷的位置
            cellEl.className = "cell";
            grid[i][j].cellEl = cellEl;


            cellEl.addEventListener("click", (e) => { //点击事件
                if (grid[i][j].count === -1) {
                    explode(grid, i, j, numRows, numCols) //点到雷，游戏失败
                    return alert("游戏结束！ YOU LOSS");

                }

                if (grid[i][j].count === 0) { //围绕此处全部展开
                    searchClearArea(grid, i, j, numRows, numCols);
                } else if (grid[i][j].count > 0) {
                    grid[i][j].clear = true;
                    cellEl.classList.add("clear"); //添加.clear
                    grid[i][j].cellEl.innerText = grid[i][j].count;
                    changecolor(grid, i, j);
                }
                checkAllClear(grid); //检验，当均掀开为win

                if (checkAllClear(grid) == true) {
                    alert("YOU WIN");
                }
            });
            document.oncontextmenu = function(e) {
                return false;
            }
            cellEl.addEventListener("mousedown", (e) => {
                if (e.button == 2 && grid[i][j].clear == false) {
                    grid[i][j].cellEl.classList.add("flag");
                } else if (e.button == 2) {
                    grid[i][j].cellEl.classList.remove("flag");
                    grid[i][j].flag = false;
                }
            });

            let tdEl = document.createElement("td");
            tdEl.append(cellEl);

            trEl.append(tdEl);
        }
        boardEl.append(trEl);
    }
}

function changecolor(grid, i, j) { //字体颜色
    switch (grid[i][j].count) {
        case 1:
            grid[i][j].cellEl.classList.add("one");
            break;
        case 2:
            grid[i][j].cellEl.classList.add("two");
            break;
        case 3:
            grid[i][j].cellEl.classList.add("three");
            break;
        case 4:
            grid[i][j].cellEl.classList.add("four");
            break;
        case 5:
            grid[i][j].cellEl.classList.add("five");
            break;
        case 6:
            grid[i][j].cellEl.classList.add("six");
            break;
        case 7:
            grid[i][j].cellEl.classList.add("seven");
            break;
        case 8:
            grid[i][j].cellEl.classList.add("eight");
            break;
    }


}
const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1], // TL, TOP, TOP-RIGHT 方向
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
]

function initialize(numRows, numCols, numMines) { //初始化棋盘格 均为0 nummines为雷数
    let grid = new Array(numRows); //grid  表示单元格
    for (let i = 0; i < numRows; i++) {
        grid[i] = new Array(numCols);
        for (let j = 0; j < numCols; j++) {
            grid[i][j] = {
                clear: false,
                count: 0
            };
        }
    }

    let mines = [];
    for (let k = 0; k < numMines; k++) {
        let cellSn = Math.trunc(Math.random() * numRows * numCols); //cellsn棋盘数=函数（x*行*列）
        let row = Math.trunc(cellSn / numCols); //雷所在行 除
        let col = cellSn % numCols; //雷所在列 取余

        console.log(cellSn, row, col);

        grid[row][col].count = -1;
        mines.push([row, col]);


    }

    // 计算有雷的周边为零的周边雷数
    for (let [row, col] of mines) {
        for (let [drow, dcol] of directions) { //遍历周边方向
            let cellRow = row + drow; //得到周边方向行 列坐标
            let cellCol = col + dcol;
            if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols) {
                continue;
            }
            if (grid[cellRow][cellCol].count === 0) {
                console.log("target: ", cellRow, cellCol);

                let count = 0;
                for (let [arow, acol] of directions) {
                    let ambientRow = cellRow + arow;
                    let ambientCol = cellCol + acol;
                    if (ambientRow < 0 || ambientRow >= numRows || ambientCol < 0 || ambientCol >= numCols) {
                        continue;
                    }

                    if (grid[ambientRow][ambientCol].count === -1) {
                        console.log("danger!", ambientRow, ambientCol);
                        count += 1; //如果有雷就加一个值
                    }
                }

                if (count > 0) {
                    grid[cellRow][cellCol].count = count;
                }
            }
        }

    }

    return grid;
}

function searchClearArea(grid, row, col, numRows, numCols) { //掀开周边的函数
    let gridCell = grid[row][col];
    gridCell.clear = true;
    gridCell.cellEl.classList.add("clear");

    for (let [drow, dcol] of directions) {
        let cellRow = row + drow;
        let cellCol = col + dcol;
        console.log(cellRow, cellCol, numRows, numCols);
        if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols) {
            continue;
        }

        let gridCell = grid[cellRow][cellCol];

        console.log(cellRow, cellCol, gridCell);

        if (!gridCell.clear) {
            gridCell.clear = true;
            gridCell.cellEl.classList.add("clear");
            changecolor(grid, cellRow, cellCol);
            if (gridCell.count === 0) {
                searchClearArea(grid, cellRow, cellCol, numRows, numCols);
            } else if (gridCell.count > 0) {
                gridCell.cellEl.innerText = gridCell.count;
            }
        }
    }
}

function explode(grid, row, col, numRows, numCols) { //只掀开单元格 炸
    grid[row][col].cellEl.classList.add("exploded");

    for (let cellRow = 0; cellRow < numRows; cellRow++) {
        for (let cellCol = 0; cellCol < numCols; cellCol++) {
            let cell = grid[cellRow][cellCol];
            cell.clear = true;
            cell.cellEl.classList.add('clear');

            if (cell.count === -1) {
                cell.cellEl.classList.add('landmine');
            }
        }
    }
}

function checkAllClear(grid) { //全页面展开
    for (let row = 0; row < grid.length; row++) {
        let gridRow = grid[row];
        for (let col = 0; col < gridRow.length; col++) {
            let cell = gridRow[col];
            if (cell.count !== -1 && !cell.clear) {
                return false;
            }
        }
    }

    for (let row = 0; row < grid.length; row++) {
        let gridRow = grid[row];
        for (let col = 0; col < gridRow.length; col++) {
            let cell = gridRow[col];

            if (cell.count === -1) {
                cell.cellEl.classList.add('landmine');
            }

            cell.cellEl.classList.add("success");
        }
    }

    return true;
}






function easy() { //难度easy onclick实现
    document.getElementById('board').innerHTML = "";
    let grid = initialize(9, 9, 10);
    renderBoard(9, 9, grid);

}

function normal() {
    document.getElementById('board').innerHTML = "";
    let grid = initialize(11, 11, 25);
    renderBoard(11, 11, grid);
}

function hard() {
    document.getElementById('board').innerHTML = "";
    let grid = initialize(15, 15, 30);
    renderBoard(15, 15, grid);
}
let grid = initialize(9, 9, 9);
renderBoard(9, 9, grid);