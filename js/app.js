//CURRENTLY WORKING
var lastClicked;

//you can click on a letter,
//click on the spot you want the letter to go,
//repeat
function setEventListeners() {
  $(".letter").on("click", function(event) {
    lastClicked = event.target;
  });
  $(".cell").on("click", function(event) {
    $(event.target).append(lastClicked)
    console.log(lastClicked);
  })
}

//////////////////////////////////////////

// DRAG AND DROP VERSION USING JQUERY UI

// function init(){
//   $(".letter img").draggable(
//     {
//       containment: '.board',
//       cursor: 'move',
//       snap: ".cell",
//     }
//   );

//   $(".cell").droppable({
//     drop: function(event, ui){
//       var cell = $(this);
//       // $(this).find("img");
//       // $(this).append("hi");
//       handleDropEvent(event, ui, cell);
//     }
//   });
// };
//
// function handleDropEvent(event, ui, cell){
//   var tile = ui.draggable;
//
//   cell.append(tile);
//   console.log(cell);
//   // alert("The square with ID " + draggable.attr('id') + " was dropped on me!");
// }
//
//

/////////////////////////////////////////////

///2D ARRAY CREATION

//36 value board - NEEDED?
var Board = {};

for(var i=1; i<=36; i++){
  Board[i] = null;
}

//todo - if the index is now empty (and was assigned a letter),
//then make it empty again
function updateBoard(index){

  //gets the letter of the index selected
  var letterInBox = $("#"+index).children().attr("value");

  //if the type of the element in the box is a string
  //then it updates the board
  if(typeof letterInBox === "string"){
    Board[index] = letterInBox;
  }
  //otherwise, it replaces the board's value to null
  else{
      Board[index]=null;
  }
}



// DICTIONARY CHECK

//take values of images
//push them onto an array
//join the array
//check if the dictionary has the word
//if so, return true, if not, return false

//fake dictionary
var dictionaryArray = ["ban", "nab", "an", "sad"];

//only searches for word in the first column ("row")
function findLetters(){
  var low= 0;
  var high = 0;
  var inc = 6;

  //goes through the whole board column by column, left > right
  //adds each value to the Board object
  while(high<36){
    for(var i=0+low; i<6+high; i++){

        //gets the div by its number ID, gets it child (the image)
        //and gets the value
        updateBoard(i);
    }

    low = low + inc;
    high = high + inc;
  }

}

//todo: COMBINE THE VERTICAL & HORIZONTAL INTO ONE function
//POTENTIALLY DO THIS IN A WAY WHERE THE GRID CAN BE n x n!
function wordLoggerVertical(){
  var allWordsArray = [];

  //VERTICALLY - column by column
  var low= 0;
  var high = 0;
  var inc = 6;

  //goes through the whole board column by column, left > right
  while(high<36){
    var word = "";
    for(var i=1+low; i<=6+high; i++){
      if(typeof Board[i]==="string"){
        word+=Board[i];
      }
    }
    low = low + inc;
    high = high + inc;

    if(word!=="" && word.length>1){
      allWordsArray.push(word);
    }

  }

  return allWordsArray;
}

function wordLoggerHorizontal(){
  var allWordsArray = [];

  //Horizontally
  var low= 0;
  var high = 0;
  var inc = 1;

  //goes through the whole board column by column, left > right
  //NUMBERS COUNT DOWN VERTICALLY so to move horiz, +6 is necessary
  while(high<=36 && low<=6){
    var word = "";
    for(var i=1+low; i<=31+high; i+=6){
      if(typeof Board[i]==="string"){
          word+=Board[i];
      }
    }
    low = low + inc;
    high = high + inc;

    if(word!=="" && word.length>1){
      allWordsArray.push(word);
    }

  }

  return allWordsArray;
}

function dictionaryCheck(){
  //concatenates both horiz and vert word arrays
  allWordsArrayVert = wordLoggerVertical();
  allWordsArrayHoriz = wordLoggerHorizontal();
  allWordsArray = allWordsArrayVert.concat(allWordsArrayHoriz);

  for(var i=0; i<allWordsArray.length;i++){
    //checks whether the word is in the dictionary
    if(dictionaryArray.indexOf(allWordsArray[i])> -1){
      console.log("This word is correct: " + allWordsArray[i]);
      // return true;
    }
    else{
      console.log("This word is not correct: " + allWordsArray[i]);
      // return false;
    }
  }

}



function appendTile(letter){
  var letterImg = $('<img>');
  letterImg.attr('src', "images/tiles/tiles-"+letter+".svg");
  letterImg.attr('id', letter);
  letterImg.attr('value', letter);
  letterImg.attr('class', "letter");
  $(".letters").append(letterImg);

}


//similar to bubble sort but randomizes
function shuffle(array){
  var currentIndex = array.length;
  var tempValue;
  var randomIndex;

  //while there are still elements to shuffle
  while (currentIndex !== 0){
    //picks a remaining element
    randomIndex = Math.floor(Math.random()*currentIndex);
    currentIndex -= 1;

    tempValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = tempValue;
  }

  return array;
}


function peel(){

  var letterArray = ["a","a","d","e","e","e","g","i","i","l","n","o","o","r","s","t","u"];

  var shuffledArray = shuffle(letterArray);

  //if there's nothing in the shuffledArray, it doesn't peel anymore
  if(shuffledArray.length<1){
    return;
  }

  var random = Math.floor(Math.random()*(shuffledArray.length));

  var selectedLetter = shuffledArray[random];

  //gets index of the selected letter
  var index = shuffledArray.indexOf(selectedLetter);

  //removes the selected letter from array
  shuffledArray.splice(index, 1);
  appendTile(selectedLetter);

};





// RUNNING
$(document).ready(function(){

    for(var i=0; i<6;i++){
      peel();
    }

    setEventListeners();
    findLetters();


    $(".peel-btn").click(function(){
        findLetters();
        dictionaryCheck();
        peel();
        setEventListeners();
        // console.log(Board);

    });


});
