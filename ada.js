class TrieNode {
  constructor(char) {
    this.children = [];
    for (var i = 0; i < 26; i++) {
      this.children[i] = null;
    }
    this.isEndWord = 0;
    this.char = char;
    this.word = "";
  }
}
class Trie {
  constructor() {
    this.root = new TrieNode("/");
  }
  getIndex(t) {
    return t.charCodeAt(0) - "a".charCodeAt(0);
  }
  insert(key) {
    let currentNode = this.root;
    let index = 0;
    for (let i = 0; i < key.length; i++) {
      index = this.getIndex(key[i]);

      if (currentNode.children[index] === null) {
        currentNode.children[index] = new TrieNode(key[i]);
        console.log(String(key[i]) + " inserted");
      }
      currentNode = currentNode.children[index];
    }
    currentNode.isEndWord = 1;
    currentNode.word = key;
    console.log("'" + key + "' inserted");
  }
}
//DELAYED COLOR CHANGE FUNCTION
function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
//RESET COLOR FUNCTION
let boxes = document.querySelectorAll(".col");
function resetColor() {
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].classList.remove("colGreen");
    boxes[i].classList.remove("colRed");
  }
}
let answersList = document.querySelector("#answersList");
let board = [
  ["o", "a", "a", "n"],
  ["e", "t", "a", "e"],
  ["i", "h", "k", "r"],
  ["i", "f", "l", "v"],
];
let words = ["oath", "pea", "eat", "rain"];

async function solve(i, j, r, c, answer, current) {
  let index = board[i][j].charCodeAt() - "a".charCodeAt();
  let input = (i * 10 + j).toString().padStart(2, "0");
  if (board[i][j] === "#" || current.children[index] === null) {
    if (current.children[index] === null) {
      document.getElementById(input).classList.remove("colGreen");
      document.getElementById(input).classList.add("colRed");
      await sleep(900);
    }
    return 0;
  }
  // let box = document.getElementById(input);
  let box = document.getElementById(input);
  box.classList.remove("colRed");
  box.classList.add("colGreen");
  await sleep(900);
  current = current.children[index];
  if (current.isEndWord > 0) {
    answer.push(current.word);
    current.isEndWord = 0;
    //creating an element
    let newAnswer = document.createElement("li");
    newAnswer.innerText = current.word;
    answersList.appendChild(newAnswer);
    //finishing
    await sleep(1000);
    resetColor();
  }
  let ch = board[i][j];
  board[i][j] = "#";
  if (i > 0) {
    await solve(i - 1, j, r, c, answer, current);
  }
  if (i < r - 1) {
    await solve(i + 1, j, r, c, answer, current);
  }
  if (j > 0) {
    await solve(i, j - 1, r, c, answer, current);
  }
  if (j < c - 1) {
    if ((await solve(i, j + 1, r, c, answer, current)) === 0) {
      document.getElementById(input).classList.remove("colGreen");
      document.getElementById(input).classList.add("colRed");
    }
  }
  board[i][j] = ch;
  return 1;
}
async function findWords() {
  let r = board.length;
  let c = board[0].length;
  let trie = new Trie();
  for (let i = 0; i < words.length; i++) {
    trie.insert(words[i]);
  }
  let answer = new Array();
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      await solve(i, j, r, c, answer, trie.root);
      resetColor();
    }
  }
  return answer;
}
async function getAnswer() {
  resetColor();
  let answers = await findWords();
  console.log(answers);
}
let searchBtn = document.getElementById("btn");
searchBtn.addEventListener("click", getAnswer);
