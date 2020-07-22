// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random greeting to the page.
 */

window.addEventListener('load',function() {
  document.getElementById('ticButton').addEventListener('click',initTic);
  document.getElementById('number-of-comments').addEventListener('change',getMessageFromServer);
  document.getElementById('delete-comments-button').addEventListener('click',clearComments);
});

function addRandomGreeting() {
  const greetings =
      ['Balabizo', 'Educated Noodle', 'That\'s rough buddy', 'YNWA'];

  // Pick a random greeting.
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Add it to the page.
  const greetingContainer = document.getElementById('greeting-container');
  greetingContainer.innerText = greeting;
}

// initializes the Tic-Tac-Toe Grid, triggered by both the play and reset buttons
function initTic() {
  let turn = 'X';
  let tic  = document.getElementById('tic');
  let paper = document.createElement('div');
  paper.classList.add('paper');
  tic.appendChild(paper);
  let boxGrid = [];
  let winnerMessage = null;
  let resetButton = null;

  // filling the tic-tac-toe grid
  for (let i=0; i<3; i++) {
    boxGrid[i] = [];
    for (let j=0; j<3; j++) {
      boxGrid[i][j] = document.createElement('div');
      boxGrid[i][j].classList.add('box');
      boxGrid[i][j].style.fontSize = '50px';
      boxGrid[i][j].myRow = i;
      boxGrid[i][j].myColumn = j;
      boxGrid[i][j].checked = null;
      boxGrid[i][j].addEventListener('click', play);
      paper.appendChild(boxGrid[i][j]);
    }
  }
  // removing button that clicked it then adding reset button
  this.remove();
  resetButton = document.createElement('button');
  resetButton.innerHTML = 'Reset';
  resetButton.addEventListener('click', reset);
  resetButton.addEventListener('click', initTic);
  tic.appendChild(resetButton);
    
  // puts X or O on the cell when it's clicked
  function play() {
    //this represents the clicked div object
    let i = this.myRow;
    let j = this.myColumn;
    
    if(this.checked === null){
      this.checked = turn;
      this.appendChild(document.createTextNode(turn));
      
      if(isGameOver(this)) {
        gameOver(turn);
      }
      turn = (turn === 'O' ? 'X' : 'O');
    }

    // checking if the row or column or diagonal is full and is the same symbol
    function isGameOver(changedCell) {
      if(changedCell.checked === boxGrid[i][(j + 1) % 3].checked && changedCell.checked === boxGrid[i][(j + 2) % 3].checked) {
        return true;
      } else if(changedCell.checked === boxGrid[(i + 1) % 3][j].checked && changedCell.checked === boxGrid[(i + 2) % 3][j].checked) {
        return true;
      } else if(boxGrid[0][0].checked !== null && boxGrid[0][0].checked === boxGrid[1][1].checked && boxGrid[0][0].checked === boxGrid[2][2].checked) {
        return true;
      } else if(boxGrid[0][2].checked !== null && boxGrid[0][2].checked === boxGrid[1][1].checked && boxGrid[0][2].checked === boxGrid[2][0].checked) {
        return true;
      }
      return false;
    }

    function gameOver(symbol) {
      paper.remove();
      winnerMessage = document.createElement("p").appendChild(document.createTextNode(`The ${symbol} player wins`));
      tic.appendChild(winnerMessage);
    }
  }
  
  // removes the winner message and the grid to setup another turn, 
  // reset button has another eventlistener calling the initTic function exactly after calling reset
  function reset() {
    if(winnerMessage !== null) 
      winnerMessage.remove();
    paper.remove();
  }
}

// call function when all elements of the window are loaded
window.addEventListener('load',getMessageFromServer);

// adds message from server to html DOM using fetch()
function getMessageFromServer() {
  let numberOfComments = document.getElementById('number-of-comments');
  fetch('/data?numberOfComments='+numberOfComments.value).then(response => response.json()).then(messagesArray => {
    let messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML='';
    messagesArray.forEach(function(message) {
      let listItem = document.createElement('li');
      listItem.innerText = message;
      messageContainer.appendChild(listItem);
    });
  });
}

function clearComments() {
  let request = new Request('\delete-data',{method: 'Post'});
  fetch(request).then(getMessageFromServer);
}
