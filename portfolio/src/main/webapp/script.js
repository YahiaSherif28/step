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
 document.getElementById("ticButton").addEventListener("click",initTic);
function addRandomGreeting() {
  const greetings =
      ['Balabizo', 'Educated Noodle', 'That\'s rough buddy', 'YNWA'];

  // Pick a random greeting.
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Add it to the page.
  const greetingContainer = document.getElementById('greeting-container');
  greetingContainer.innerText = greeting;
}
let turn;
function initTic(){
  turn = 'X';
  var tic = document.getElementById("tic");
  tic.appendChild(document.createTextNode("AAAA"));
  var paper = document.createElement("div");
  paper.classList.add("paper");
  tic.appendChild(paper);
  var boxGrid = Array(3).fill(Array(3).fill(""));
  var checkGrid = Array(3).fill(Array(3).fill(""));
  for(var i=0;i<3;i++){
    boxGrid[i]=[];
    checkGrid[i] = [];
    for(var j=0;j<3;j++){
      boxGrid[i][j] = document.createElement("div");
     
      boxGrid[i][j].classList.add("box");
      boxGrid[i][j].style.fontSize = "20px";
      boxGrid[i][j].myRow=i;
      boxGrid[i][j].myColumn=j;
      
      boxGrid[i][j].addEventListener("click",play);
      paper.appendChild(boxGrid[i][j]);
    }
  }
  function play() {
    var i = this.myRow;
    var j = this.myColumn;
    if(checkGrid[i][j]!='X' && checkGrid[i][j]!='O' ){
      checkGrid[i][j]=turn;
      boxGrid[i][j].appendChild(document.createTextNode(turn));
      turn = (turn ==='O'?'X':'O');
    }
  }
  
  
  this.remove();
}
