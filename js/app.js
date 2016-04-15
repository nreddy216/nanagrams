//Global variables that will be used throughout entire program
var Board = {};

var boardDimension = 7; //can be a prompt for user to choose their own board size
var boardSize = Math.pow(boardDimension, 2); //squares the board dim to get the whole size

for(var i=1; i<=boardSize; i++){
  Board[i] = null;
}

//==============================================================================

// WHEN DOCUMENT IS CALLED
$(document).ready(function(){

  //instructions modal
  $("#myBtn").click(function(){
    $("#myModal").modal();
  });

  generateBoard(boardDimension);
  //# of tiles

  console.log("BEFORE ", allLettersSum(allLetters));
  //gives you as many tiles as the board's dimension
  for(var i=0; i<boardDimension;i++){
    peel();
  }

  //initialize the dragginess & droppiness of the tiles
  dragAndDropInit();
  //initializes the values of each of the cells to null
  findLetters();
  //
  dump();

  $(".peel-btn").click(function(){
      // win();
      findLetters();
      peel();

      console.log("AFTER PEEL:", allLettersSum(allLetters));
      wordCorrect();

      console.log("THESE ARENT WORDS " + notWordsArray);

  });



});


///////////////////////////////////////////////////////////////////////////////

// DRAG AND DROP VERSION USING JQUERY UI

function dragAndDropInit(){

  //allows you to drag the letter tile
  $(".letter").draggable(
    {
      //options that jquery UI allows
      cursor: 'move',
      helper: "clone"

    }
  );

  //makes each cell able to accept the "draggable" letter
  $(".cell").droppable({
    drop: function(event, ui){
      //detach allows letter to be moved around after it's placed in a cell
      //letter appends to cell after
      ui.draggable.detach().appendTo($(this));
    }
  });

  //this allows the letter on the cell to be dragged back to the "tile pile"
  $(".tile-pile").droppable({
    drop: function(event, ui){
      ui.draggable.detach().appendTo($(this));
    }
  });
};

///Generate board made of divs
//==============================================================================

//generates divs to create board of any dimension
function generateBoard(boardDimension){
  var $board = $('.board');

  //need this in order to increment up to get the right div id numbers
  var low= 0;
  var high = 0;
  var inc = boardDimension;

  //while the highest is less than the board size
  while(high < boardSize){
    for(var i=1; i<=boardDimension; i++){
      var $col = $("<div class='col col-" + i + "'></div>");
      for(var j=1 + low ; j<=boardDimension + high; j++){
        var $cell = $("<div class='cell' id="+ j + " ></div>");
        $col.append($cell);
      }

      $board.append($col);

      low = low + inc;
      high = high + inc;
    }
  }

}

///2D ARRAY CREATION
//==============================================================================


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

//==============================================================================

//searches for all tiles that have letters in them and updates the board
function findLetters(){
  var low= 0;
  var high = 0;
  var inc = boardDimension;

  //goes through the whole board column by column, left > right
  //adds each value to the Board object
  while(high<boardSize){
    for(var i=0+low; i<boardDimension+high; i++){
        //gets the div by its number ID, gets it child (the image)
        //and gets the value
        updateBoard(i);
    }

    low = low + inc;
    high = high + inc;
  }

  console.log("BOARD AFTER UPDATE ", Board);
}

//==============================================================================

//todo: COMBINE THE VERTICAL & HORIZONTAL INTO ONE function
//POTENTIALLY DO THIS IN A WAY WHERE THE GRID CAN BE n x n!
function wordLoggerVertical(){
  var allWordsArray = [];

  //VERTICALLY - column by column
  var low= 0;
  var high = 0;
  var inc = boardDimension;

  //goes through the whole board column by column, left > right
  while(high<boardSize){
    var word = "";
    for(var i=1+low; i<=boardDimension+high; i++){
      if(typeof Board[i]==="string" && (typeof Board[i-1]==="string" || typeof Board[i+1]==="string")){
        word+=Board[i];

        if(typeof Board[i+1]!=="string"){
          allWordsArray.push(word);
          var word="";

        }
      }
    }

    low = low + inc;
    high = high + inc;

  }

  console.log(" VERTICAL ALL WORDS ", allWordsArray);

  return allWordsArray;
}

//==============================================================================

function wordLoggerHorizontal(){
  var allWordsArray = [];

  //Horizontally
  var low= 1;
  var high = 1;
  var inc = 1;

  //goes through the whole board column by column, left > right
  //NUMBERS COUNT DOWN VERTICALLY so to move horiz, +6 (or whatever boardSize) is necessary
  while(high<=boardSize && low<=boardDimension){
    var word = "";
    for(var i=low; i<=(boardSize-boardDimension)+high; i+=boardDimension){
      if(typeof Board[i]==="string" && (typeof Board[i-boardDimension]==="string" || typeof Board[i+boardDimension]==="string")){
          word+=Board[i];

          if(typeof Board[i+boardDimension]!=="string"){
            allWordsArray.push(word);
            var word="";
          }
        }
      }

    low = low + inc;
    high = high + inc;

  }

  console.log(" HORIZONTAL ALL WORDS ", allWordsArray);

  return allWordsArray;
}

//==============================================================================

var notWordsArray = [];

function wordCorrect(){
  //concatenates both horiz and vert word arrays
  allWordsArrayVert = wordLoggerVertical();
  allWordsArrayHoriz = wordLoggerHorizontal();
  allWordsArray = allWordsArrayVert.concat(allWordsArrayHoriz);

  console.log("ALL ALL WORDS ", allWordsArray);

  allWordsArray.forEach(function(madeWord){
    //checks whether the word is in the dictionary API
    isWord(madeWord);

  });

}

//==============================================================================

var peelOn = true;

//searchTerm is the word that is created
//cb is the callback function "notifyUser(isWord)"
function isWord(searchTerm, notifyUser) {

  var endpoint = "http://api.wordnik.com/v4/word.json/" + searchTerm + "/definitions?useCanonical=false&includeSuggestions=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
  $.ajax({
    type: 'GET',
    url: endpoint,
    dataType: 'json',
    success: function(data) {
      // console.log("results:", data.length);
      // console.log("word: "+ searchTerm);
      if(data.length > 0) { //is a word
        console.log("This word is real");
        $('.word-result').html("WOOPAH! Keep moving!<p></p>");
        $('.word-result').removeClass("wrong");

        $('.peel-btn').removeClass("peel-btn-purple");

      } else { //is NOT a word
        $('.word-result').html("<p>" + searchTerm + " is not a word. No peeling.</p><p></p>");
        $('.word-result').toggleClass("wrong");


        $('.peel-btn').addClass("peel-btn-grey");
        peelOn = false;
      }
    }
  });
}


//==============================================================================

//similar to bubble sort but randomizes the letters given
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

//==============================================================================

function appendTile(letter){
  var letterImg = $('<img>');
  letterImg.attr('src', "images/tiles/tiles-"+letter+".svg");
  letterImg.attr('id', letter);
  letterImg.attr('value', letter);
  letterImg.attr('class', "letter");
  $(".letters").append(letterImg);

}

//==============================================================================

//GLOBAL LETTER ARRAY
var letterArray = ["a","a","d","e","e","e","g","i","i","l","n","o","o","r","s","t","u"];

var allLetters = {
  a:2,
  d:1,
  e: 3,
  g: 1,
  i: 2,
  l: 1,
  n: 1,
  o: 2,
  r: 1,
  s: 1,
  t: 1,
  u: 1
};

function allLettersSum(object){
  var total = 0;
  for(key in object){
    total += object[key];
  }
  return total;
}


//==============================================================================

function peel(){
  var shuffledArray = shuffle(letterArray);

  //if there's nothing in the shuffledArray, it doesn't peel anymore
  if(allLettersSum(allLetters)<1 ){
    $('.peel-btn').removeClass("peel-btn-purple");
    $('.peel-btn').addClass("peel-btn-grey");
    return;
  }
  else{
    var random = Math.floor(Math.random()*(shuffledArray.length));

    var selectedLetter = shuffledArray[random];

    //gets index of the random selected letter
    var index = shuffledArray.indexOf(selectedLetter);

    //removes the selected letter from array
    shuffledArray.splice(index, 1);

    allLetters[selectedLetter]-=1;

    appendTile(selectedLetter);

  }

  dragAndDropInit();
  console.log(shuffledArray);

};

//==============================================================================

// var dumpedLetter;

function dump(){

  //DUMP JQUERY UI INITIALIZE--------------------------------------------
  $(".letter").draggable(
    {
      cursor: 'move',
      helper: "clone"
    }
  );


  $(".dump-btn").droppable({
    activeClass: "ui-state-hover",
    hoverClass: "hoverdump",
    over: function(event, ui){
      console.log(ui.draggable.prop('id'));

      //toggles the red on hover
      $(this).addClass("hoverdump");
    },
    drop: function(event, ui){


      $(this).removeClass("hoverdump");

      if(allLettersSum(allLetters)>1){
        //push the dumped letter back onto the array + object
        letterArray.push(ui.draggable.prop('id'));
        allLetters[ui.draggable.prop('id')]+=1;

        //detach and fadeout
        ui.draggable.detach();
        ui.draggable.fadeOut("slow",function(){
          for(var i=0; i<3; i++){
            peel();  //just calls peel function 3 times
          }
        });
      }
      else{
        $('.dump-btn').css("background-color", "grey");

      }
    }
  });


}

//==============================================================================

function win(){
  total=0;
  for(var key in Board){
    if(Board[key]!==null){
      total+=1;
    }
    console.log("BOARD KEY WIN " + Board[key]);
  }
  if(total===17){
    $(".title").html("The board is filled!");
  }
}

//==============================================================================

function timer(){

  // setTimeout(1000);

  // var day = new Date();
  // var today = day.now();
  // $('.clock').countdown(today + "00:00:40", function(event) {
  //   var totalSeconds = event.offset.seconds;
  //   $(this).html(event.strftime(totalSeconds + '%S sec'));
  // });
}
