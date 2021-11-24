//DELAYED COLOR CHANGE FUNCTION
function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
let boxes = document.querySelectorAll(".col");
function resetColor() {
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].classList.remove("colGreen");
    boxes[i].classList.remove("colRed");
    // boxes[i].style.color = "#f6f6f6";
  }
}
let answersList = document.querySelector("#answersList");
board = [
  ["o", "a", "a", "n"],
  ["e", "t", "a", "e"],
  ["i", "h", "k", "r"],
  ["i", "f", "l", "v"],
];
words = ["oath", "pea", "eat", "rain"];
async function findWords(board, words) {
  let output = new Set();
  const initials = new Map();
  for (let i = 0; i < words.length; i++) {
    let temp;
    if (initials.has(words[i][0])) temp = initials.get(words[i][0]);
    else temp = [];
    temp.push(words[i]);
    initials.set(words[i][0], temp);
  }

  const checkOrder = async function (row, col, word, tempWord, visited) {
    if (row < 0 || row >= board.length || col < 0 || col >= board[row].length) {
      return 0;
    }
    console.log(board[row][col]);
    //jugaad
    let input = (row * 10 + col).toString().padStart(2, "0");
    console.log(document.getElementById(input));
    if (board[row][col] !== word[tempWord.length]) {
      if (visited[row][col] === 1) {
        //if required
      } else {
        document.getElementById(input).classList.remove("colGreen");
        document.getElementById(input).classList.add("colRed");
        // document.getElementById(input).style.color = "#1a1a1a";
        await sleep(900);
        console.log("letter does not match");
      }
      return 0;
    }

    tempWord += board[row][col];
    let box = document.getElementById(input);
    // box.style.background = "#00ff00";
    box.classList.remove("colRed");
    box.classList.add("colGreen");
    await sleep(900);
    console.log("letter accepted");

    visited[row][col] = 1;
    if (tempWord === word) {
      console.log(tempWord);
      output.add(word);
      let newAnswer = document.createElement("li");
      newAnswer.innerText = tempWord;
      answersList.appendChild(newAnswer);
      await sleep(1000);
      resetColor();
    }

    await checkOrder(row, col + 1, word, tempWord, visited);
    await checkOrder(row, col - 1, word, tempWord, visited);
    await checkOrder(row + 1, col, word, tempWord, visited);
    if ((await checkOrder(row - 1, col, word, tempWord, visited)) === 0) {
      document.getElementById(input).classList.remove("colGreen");
      document.getElementById(input).classList.add("colRed");
      // document.getElementById(input).style.color = "#1a1a1a";
    }
    visited[row][col] = 0;
    return 1;
  };

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (initials.has(board[i][j])) {
        const listWords = initials.get(board[i][j]);
        for (let k = 0; k < listWords.length; k++) {
          const visited = new Array(board.length)
            .fill(0)
            .map(() => new Array(board[0].length).fill(0));
          const word = listWords[k];
          await checkOrder(i, j, word, "", visited);
        }
      }
    }
  }

  return Array.from(output);
}
async function getAnswer() {
  resetColor();
  let answers = await findWords(board, words);
  console.log(answers);
}
let searchBtn = document.getElementById("btn");
searchBtn.addEventListener("click", getAnswer);
