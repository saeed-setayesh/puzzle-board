// Calling when page is loaded
(() => {
  let state = 1;

  let board = document.getElementById("board");

  // Creates
  fix(3, 3, 15, "80");

  // Randomize
  randomize();

  // Listens for click on tail
  board.addEventListener("click", function (e) {
    if (state == 1) {
      // adding animation
      board.className = "animate";
      shiftCell(e.target);
    }
  });

  document.getElementById("fix").addEventListener("click", submitConfig);
  document.getElementById("randomize").addEventListener("click", randomize);
  document.getElementById("submit").addEventListener("click", submitConfig);

  let sizeofTiles = document.getElementById("tiles");
  let height = document.getElementById("height");
  let width = document.getElementById("width");

  function fix(height, weight, whole, tile) {
    if (state == 0) {
      return;
    }

    board.innerHTML = "";

    let n = 1;
    for (let i = 0; i <= height; i++) {
      for (let j = 0; j <= weight; j++) {
        let cell = document.createElement("span");
        cell.id = "cell-" + i + "-" + j;
        cell.style.height = `${tile}px`;
        cell.style.width = `${tile}px`;
        cell.style.left = j * tile + 1 * j + 1 + "px";
        cell.style.top = i * tile + 1 * i + 1 + "px";

        if (n <= whole) {
          cell.classList.add("number");
          cell.innerHTML = (n++).toString();
        } else {
          cell.className = "empty";
        }

        board.appendChild(cell);
      }
    }
  }

  function submitConfig() {
    let heightParse = JSON.parse(height.value);
    let widthParse = JSON.parse(width.value);

    fix(
      heightParse,
      widthParse,
      (heightParse + 1) * (widthParse + 1) - 1,
      sizeofTiles.value
    );
  }

  function shiftCell(cell) {
    // Checks if selected cell has number
    if (cell.clasName != "empty") {
      // Tries to get empty adjacent cell
      let emptyCell = getEmptyAdjacentCell(cell);

      if (emptyCell) {
        // Temporary data
        let tmp = { style: cell.style.cssText, id: cell.id };

        // Exchanges id and style values
        cell.style.cssText = emptyCell.style.cssText;
        cell.id = emptyCell.id;
        emptyCell.style.cssText = tmp.style;
        emptyCell.id = tmp.id;

        if (state == 1) {
          // Checks the order of numbers
          setTimeout(ordering, 150);
        }
      }
    }
  }

  // Gets specific cell by row and column
  function findTail(row, col) {
    return document.getElementById("cell-" + row + "-" + col);
  }

  //Gets empty cell

  function getEmptyCell() {
    return board.querySelector(".empty");
  }

  // Gets empty adjacent cell if it exists
  function getEmptyAdjacentCell(cell) {
    // Gets all adjacent cells
    let adjacent = getAdjacentCells(cell);

    // Searches for empty cell
    for (let i = 0; i < adjacent.length; i++) {
      if (adjacent[i].className == "empty") {
        return adjacent[i];
      }
    }

    // Empty adjacent cell was not found
    return false;
  }

  function getAdjacentCells(cell) {
    let heightParse = JSON.parse(height.value);
    let widthParse = JSON.parse(width.value);
    let id = cell.id.split("-");

    // Gets cell position indexes
    let row = parseInt(id[1]);
    let col = parseInt(id[2]);

    let adjacent = [];

    // Gets all possible adjacent cells
    if (row < heightParse) {
      adjacent.push(findTail(row + 1, col));
    }
    if (row > 0) {
      adjacent.push(findTail(row - 1, col));
    }
    if (col < widthParse) {
      adjacent.push(findTail(row, col + 1));
    }
    if (col > 0) {
      adjacent.push(findTail(row, col - 1));
    }

    return adjacent;
  }

  function ordering() {
    let heightParse = JSON.parse(height.value);
    let widthParse = JSON.parse(width.value);
    if (findTail(heightParse, widthParse).className != "empty") {
      return;
    }

    let n = 1;
    // Goes through all cells and checks numbers
    for (let i = 0; i <= heightParse; i++) {
      for (let j = 0; j <= widthParse; j++) {
        if (n <= 15 && findTail(i, j).innerHTML != n.toString()) {
          // Order is not correct
          return;
        }
        n++;
      }
    }

    // board is fixd, offers to randomize it
    if (confirm("You did it! \nPlay Again??")) {
      randomize();
    }
  }

  function randomize() {
    if (state == 0) {
      return;
    }

    board.removeAttribute("class");
    state = 0;

    let previousCell;
    let i = 1;
    let interval = setInterval(function () {
      if (i <= 200) {
        let adjacent = getAdjacentCells(getEmptyCell());
        if (previousCell) {
          for (let j = adjacent.length - 1; j >= 0; j--) {
            if (adjacent[j].innerHTML == previousCell.innerHTML) {
              adjacent.splice(j, 1);
            }
          }
        }
        // Gets random adjacent cell and memorizes it for the next iteration
        previousCell = adjacent[rand(0, adjacent.length - 1)];
        shiftCell(previousCell);
        i++;
      } else {
        clearInterval(interval);
        state = 1;
      }
    }, 5);
  }

  //randomize
  function rand(from, to) {
    return Math.floor(Math.random() * (to - from + 1)) + from;
  }
})();
