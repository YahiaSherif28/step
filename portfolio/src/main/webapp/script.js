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


window.addEventListener('load', function() {
  document.getElementById('tic-button').addEventListener('click', initTic);
  document.getElementById('number-of-comments')
      .addEventListener('change', getMessageFromServer);
  document.getElementById('delete-comments-button')
      .addEventListener('click', clearComments);
  document.getElementById('greeting-button')
      .addEventListener('click', addRandomGreeting);
  createMap();
  getLoginStatus();
});

/**
 * Adds a random greeting to the page.
 */
function addRandomGreeting() {
  const greetings =
      ['Balabizo', 'Educated Noodle', 'That\'s rough buddy', 'YNWA'];

  // Pick a random greeting.
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Add it to the page.
  const greetingContainer = document.getElementById('greeting-container');
  greetingContainer.innerText = greeting;
}

/** initialize the Tic-Tac-Toe Grid,
 * triggered by both the play and reset buttons
 */
function initTic() {
  let turn = 'X';
  const tic = document.getElementById('tic');
  const paper = document.createElement('div');
  paper.classList.add('paper');
  tic.appendChild(paper);
  const boxGrid = [];
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

  /** puts X or O on the cell when it's clicked*/
  function play() {
    // this represents the clicked div object
    const i = this.myRow;
    const j = this.myColumn;

    if (this.checked === null) {
      this.checked = turn;
      this.appendChild(document.createTextNode(turn));

      if (isGameOver(this)) {
        gameOver(turn);
      }
      turn = (turn === 'O' ? 'X' : 'O');
    }

    /** checks if the row, column or diagonal is full and the same symbol
      * @return {boolean}
      * @param {object} changedCell Cell which changed to trigger the function
      */
    function isGameOver(changedCell) {
      if (changedCell.checked === boxGrid[i][(j + 1) % 3].checked &&
          changedCell.checked === boxGrid[i][(j + 2) % 3].checked) {
        return true;
      } else if (changedCell.checked === boxGrid[(i + 1) % 3][j].checked &&
          changedCell.checked === boxGrid[(i + 2) % 3][j].checked) {
        return true;
      } else if (boxGrid[0][0].checked !== null &&
          boxGrid[0][0].checked === boxGrid[1][1].checked &&
          boxGrid[0][0].checked === boxGrid[2][2].checked) {
        return true;
      } else if (boxGrid[0][2].checked !== null &&
          boxGrid[0][2].checked === boxGrid[1][1].checked &&
          boxGrid[0][2].checked === boxGrid[2][0].checked) {
        return true;
      }
      return false;
    }

    /** Displays winner message and removes the grid
     *@param {string} symbol The symbol of the winner
     */
    function gameOver(symbol) {
      paper.remove();
      winnerMessage = document.createElement('p')
          .appendChild(document.createTextNode(`The ${symbol} player wins`));
      tic.appendChild(winnerMessage);
    }
  }

  /** removes the winner message and the grid to setup another turn,
   * reset button has another eventlistener calling
   * the initTic function exactly after calling reset
   */
  function reset() {
    if (winnerMessage !== null) {
      winnerMessage.remove();
    }
    paper.remove();
  }
}

// call function when all elements of the window are loaded
window.addEventListener('load', getMessageFromServer);

/** adds message from server to html DOM using fetch()*/
function getMessageFromServer() {
  const numberOfComments = document.getElementById('number-of-comments');
  fetch('/data?numberOfComments='+numberOfComments.value)
      .then((response) => response.json()).then((messagesArray) => {
        const messageContainer = document.getElementById('message-container');
        messageContainer.innerHTML = '';
        messagesArray.forEach(function(comment) {
          const listItem = document.createElement('li');
          listItem.innerText = comment.email+': '+comment.value;
          messageContainer.appendChild(listItem);
        });
      });
}
/** Clears all comments by removing them from the datastore*/
function clearComments() {
  const request = new Request('\delete-data', {method: 'Post'});
  fetch(request).then(getMessageFromServer);
}
/** Gets JSON object 'user' by calling fetch on '/login'
 * then passes it to processLoginStatus
 */
function getLoginStatus() {
  fetch('/login').then((response) => response.json())
      .then((user) => {
        processLoginStatus(user);
      });
}
/** takes user as input and if it's logged in shows the comments form
 * and a logout link
 * else it shows a login link
 * @param {object} user JSON object which contains info about the user.
 * See LoginStatusServlet.java for more info about the object
 */
function processLoginStatus(user) {
  console.log(JSON.stringify(user));
  const loginMessage = document.createElement('a');
  document.getElementById('login-message').appendChild(loginMessage);
  loginMessage.href = user.link;
  if (user.loggedIn) {
    document.getElementById('comment-form').style.display = 'block';
    loginMessage.innerHTML = 'Log out';
  } else {
    loginMessage.innerHTML = 'Log in to write a comment';
  }
}

/** Creates map and adds it to the page and adds a bouncing marker to it */
function createMap() {
  const position = {lat: 29.987535, lng: 31.441335};
  const map = new google.maps.Map(
      document.getElementById('map'),
      {center: position, zoom: 16});
  new google.maps.Marker({
    position: position,
    map: map,
    title: 'GUC',
    animation: google.maps.Animation.BOUNCE,
  });
}

