var wrong = new Audio('sound/wrong.mp3');
var right = new Audio('sound/right.mp3');

document.addEventListener('DOMContentLoaded', startGame);

const amountOfWordToSearchFor= 9;
const words =  
[
    'cat', 'dog', 'mouse', 'bird', 'horse', 'donkey', 'frog', 'rabbit', 'snake', 'program',
    'rich', 'love', 'computer', 'water', 'crayon', 'tissue', 'glass', 'phone', 'chair', 'game',
    'bond', 'funny', 'rule', 'rose', 'note', 'film', 'luck','data','pencil','towel','paper','crush','plan',
    'gold','leap','benz','honda','tesla','crop','gutless','erratic','detox','grief','waddle'
];

let myWordshuffle = [];


for(i=0; i < 10; i++ ){
    myWordshuffle.push(words[Math.floor(Math.random()*words.length)]);
    console.log(Math.floor(Math.random()*words.length));
}

const eles = {};
const game = { r: 5, c: 5, w: 100, x: '', y: '', arr: [], placeWords: [], boardArray: [] };
const placeWords = [];
let myWords = [...new Set(myWordshuffle)];

function startGame() {

    eles.gameArea = document.querySelector('.gameArea');
    eles.gridContainer = document.createElement('div');
    eles.gridContainer.style.margin = "auto";
    eles.message = document.createElement('div');
    eles.message.classList.add('message');
    eles.gridContainer.classList.add('gridContainer');
    eles.gameArea.append(eles.message);
    eles.gameArea.append(eles.gridContainer);

    game.r = 9; //number of rows
    game.c = 9; //number of columns
    eles.gameArea.style.width = (game.c * game.w + 50) + 'px';
    game.x = '';
    game.y = '';
    game.boardArray.length = 0;
    game.arr.length = 0;
    game.arr.length = game.r * game.c;
    game.placeWords.length = 0;

    for (let i = 0; i < game.arr.length; i++) {
        game.arr[i] = '-';
    }

    for (let xx = 0; xx < game.r; xx++) {
        game.x += ' auto '
    }

    for (let yy = 0; yy < game.r; yy++) {
        game.y += ' auto '
    }

    // console.log(game);
    eles.gridContainer.style.gridTemplateColumns = game.x;
    eles.gridContainer.style.gridTemplateRows = game.y;

    myWords.forEach((val, index) => {
        let temp = placeWord(val);
        if (temp) {
            game.placeWords.push({
                word: val,
                pos: temp
            });
        }

    })


    addLetters(); //add random letters to empty column
    buildBoard();
    //words to search for
    wordToFind = document.querySelector('.wordToFind');
    game.placeWords.forEach((w) => {
        w.ele = document.createElement('span');
        w.ele.classList.add('myListSub')
        w.ele.textContent = w.word;
        w.ele.arr = w.pos;
        wordToFind.append(w.ele);
    })

    // console.log(game);
}

function addLetters() {
    for (let i = 0; i < game.arr.length; i++) {
        if (game.arr[i] == '-') {
            game.arr[i] = randomLetter();
        }
    }
}

function randomLetter() {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.toLowerCase().split('')[Math.floor(Math.random() * 26)];
}

function placeWord(word) {
    let placedOkay = false;
    let cnt = 300;
    word = (Math.random() > 0.5) ? word : word.split('').reverse().join('');
    // console.log(word);
    while (!placedOkay && cnt > 0) { //place word
        cnt--;
        let pos = { col: 0, row: 0 }
        let direction = (Math.random() > 0.5) ? true : false;
        if (direction && word.length <= game.c) {
            pos.col = findStartPos(word.length, game.c); // A bunch of potential position we can start the words
            pos.row = Math.floor(Math.random() * game.r);
            placedOkay = xPlace(pos, word);
            // console.log(pos);
        } else if (!direction && word.length <= game.r) { //do it on the vertical axis
            pos.row = findStartPos(word.length, game.r); // A bunch of potential position we can start the words
            pos.col = Math.floor(Math.random() * game.c);
            placedOkay = yPlace(pos, word);
        }
    }
    return placedOkay;
}

function yPlace(cor, word) { //place valid words on the Y-axis grid (Words to be found)
    let start = (cor.row * game.c) + cor.col;
    let okayCounter = 0;
    let indexPlaced = [];
    for (let i = 0; i < word.length; i++) {
        if (game.arr[start + (i * game.c)] == '-') {
            okayCounter++;
        }
    }

    if (okayCounter == word.length) {
        for (let i = 0; i < word.length; i++) {
            if (game.arr[start + (i * game.c)] == '-') {
                game.arr[start + (i * game.c)] = word[i];
                indexPlaced.push(start + (i * game.c));
            }
        }
        return indexPlaced;
    }
    return false;
}

function xPlace(cor, word) { //place valid words on the X axis grid (Words to be found)
    let start = (cor.row * game.c) + cor.col;
    let okayCounter = 0;
    let indexPlaced = [];
    for (let i = 0; i < word.length; i++) {
        if (game.arr[start + i] == '-') {
            okayCounter++;
        }
    }

    if (okayCounter == word.length) {
        for (let i = 0; i < word.length; i++) {
            if (game.arr[start + i] == '-') {
                game.arr[start + i] = word[i];
                indexPlaced.push(start + (i));
            }
        }
        return indexPlaced;
    }
    return false;

}

function findStartPos(wordVal, totalVal) {
    return Math.floor(Math.random() * (totalVal - wordVal + 1));

}

function buildBoard() {
    eles.gridContainer.innerHTML = '';
    game.arr.forEach((ele, index) => {
        let div = document.createElement('div');
        div.textContent = ele;
        div.classList.add('grid-item');
        eles.gridContainer.append(div);
        div.addEventListener('click', (e) => {
            console.log(index);
            console.log(game.arr[index]);
            game.boardArray[index] = true;
            let checker = { found: 0, word: '' }
            game.placeWords.forEach((w) => {
                if (w.pos.includes(index)) {
                    checker.found++;
                    checker.word = w.word;
                }
                console.log(checker);
            });
                right.pause();
                right.currentTime = 0;
                wrong.pause();
                wrong.currentTime = 0;

            if (checker.found > 0) {
                div.style.backgroundColor = 'green';
                div.style.color = 'white';
                //play sound
                right.play();
            } else {
                // div.style.backgroundColor = 'red';
                //play sound
                wrong.play();
            }

            foundChecker();
        })
    })
}



function foundChecker() {
    game.placeWords.forEach((w, ind) => {
        //console.log(w.pos)
        let checker = 0;
        game.boardArray.forEach((val, index) => {
            //console.log(val)
            if (w.pos.includes(index)) {
                checker++
            }
        })

        if (checker == w.word.length) {
            w.ele.style.color = "red";
            w.ele.style.textDecoration = "line-through";
        }
    })

    checkWinner();
}


function checkWinner() {
    let counter = 0;
    game.placeWords.forEach((w, ind) => {
        if (w.ele.style.textDecoration == 'line-through') {
            counter++;
        }
    })

    log(game.placeWords.length - counter + ' Words Left');
    if ((game.placeWords.length - counter) == 0 || game.placeWords.length == 0) {
        log('Congratulations, You Won !!!');
        eles.gridSize.style.display = 'inline-block';
        eles.btn.style.display = 'inline-block';
    }

}

function log(mes) {
    eles.message.innerHTML = mes;
}