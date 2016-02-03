
//selects the ID of the letter
//saves the ID as 'last selected letter'
//the next place clicked then inputs the image into the box

//WORKING!!!!
var lastClicked;

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
var dictionaryArray = ["ban", "nab"];

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

  //VERTICALLY - column by column
  var low= 1;
  var high = 0;

  //goes through the whole board column by column, left > right
  while(high<=36){
    var word = "";
    for(var i=0+low; i<=31+high; i+=6){
      if(typeof Board[i]==="string"){
        word+=Board[i];
      }
    }
    low = low + 6;
    high = high + 1;

    if(word!=="" && word.length>1){
      allWordsArray.push(word);
    }

  }

  return allWordsArray;
}

function dictionaryCheck(){
  //CHECKS IF WORD IS IN DICTIONARY

  allWordsArray = wordLoggerHorizontal();

  for(var i=0; i<allWordsArray.length;i++){
    if(dictionaryArray.indexOf(allWordsArray[i])> -1){
      console.log("This word is correct: " + allWordsArray[i]);
    }
    else{
      console.log("This word is not correct: " + allWordsArray[i]);
    }
  }



}






// RUNNING
$(document).ready(function(){

    setEventListeners();

    $(".title").click(function(){
        findLetters();
        dictionaryCheck();
        console.log(Board);
    });




});
