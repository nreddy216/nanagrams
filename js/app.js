//Global variables that will be used throughout entire program
var Board = {};

var boardDimension = 7; //todo: can be a prompt for user to choose their own board size
var boardSize = Math.pow(boardDimension, 2); //squares the board dim to get the whole size

for(var i=1; i<=boardSize; i++){ //fill board with nulls
  Board[i] = null;
}

//==============================================================================


// WHEN DOCUMENT IS CALLED
$(document).ready(function(){


  //start timer ---------------------------------------------------------------------

  var timer = setInterval(countdown, 1000);

  // ---------------------------------------------------------------------

  //instructions modal
  $("#help-btn").click(function(){
    clearInterval(timer); //pauses timer while open
    $("#helpModal").modal();
    $("#close-help-modal").click(function(){
      timer = setInterval(countdown, 1000); //resumes timer when closed
    });
  });


  //generate the board based on the boardDimension (global var at top)
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

  //making "dump" button active
  dump();


  $(".peel-btn").bind('click', peelClick);


});

function peelClick(){

    findLetters();


    // console.log("AFTER PEEL:", allLettersSum(allLetters));
    wordCorrect();


    //how many tiles are NOT on the board and in the tile pile?
    var tilePileNum = $('.letters').children().length;

    // console.log("TILE PILE ", tilePileNum);

    if(tilePileNum === 0){
      $('.peel-btn').addClass('peel-btn-yellow');
      peel();
    } else {
      $('.peel-btn').removeClass('peel-btn-yellow');
    }


    // console.log("BEFORE ", allLettersSum(allLetters));


}


///Countdown function in set interval for timer
//==============================================================================

//gets whatever num of seconds is in div

function countdown(){

      var counter = Number($('#seconds-left').text());

      counter--;

      if (counter >= 0) {
        $("#seconds-left").html(counter);
      }
      if (counter < 10 && counter >= 0){
        $("#seconds-left").html("0" + counter); //adds 0 to single digit seconds
      }
      // Display 'counter' wherever you want to display it.
      if (counter===0) {

          //after time is up, modal pops up telling player if they won or lost
          //default is "you lost" :)
          $("#resultModal").modal();

      }

}




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

  // console.log("BOARD AFTER UPDATE ", Board);
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

  // console.log(" VERTICAL ALL WORDS ", allWordsArray);

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
    for(var i=low; i<=(boardSize-boardDimension + 1)+high; i+=boardDimension){
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

  // console.log(" HORIZONTAL ALL WORDS ", allWordsArray);

  return allWordsArray;
}

//==============================================================================



function wordCorrect(peelOn){

  var notWordsArray = [];

  //concatenates both horiz and vert word arrays
  allWordsArrayVert = wordLoggerVertical();
  allWordsArrayHoriz = wordLoggerHorizontal();
  allWordsArray = allWordsArrayVert.concat(allWordsArrayHoriz);

  //all the words on board
  console.log("ALL ALL WORDS ", allWordsArray);

  //hit WORDNIK API in order to see whehter the word is in the dictionary
  allWordsArray.forEach(function(madeWord){
    //checks whether the word is in the dictionary API
    var endpoint = "http://api.wordnik.com/v4/word.json/" + madeWord + "/definitions?useCanonical=false&includeSuggestions=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
    $.ajax({
      type: 'GET',
      url: endpoint,
      async: false,
      dataType: 'json'})
      .then(function(data) {
        if(data.length > 0) { //is a word
          console.log("This word is real");

        } else { //is NOT a word

          notWordsArray.push(madeWord);
        }
      });
  });

  console.log(" NOT WORdS ", notWordsArray);

  $(".word-result").html("<p></p>");

  if(notWordsArray.length > 0 ){

    notWordsArray.forEach(function(notWord){
      $(".word-result").append("<p>" + notWord + " is not a real word </p>");
    });

  }

  // WIN EXPRESSION!!!!!!!!!!============================!!!!!!!!!!!!!!!!!!!!!!!!
  if(allLettersSum(allLetters)===0 && notWordsArray.length===0){
    $(".win-or-lose").html("<p>You win!!</p>");
  }

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
  // console.log(shuffledArray);

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
      // console.log(ui.draggable.prop('id'));

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

        //TIMER reduce by 5 with each dump
        var counter = Number($('#seconds-left').text());
        $('#seconds-left').html(counter - 5);
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

  var tilePileNum = $('.letters').children().length;
  // console.log("TILE PILE NUM "  + tilePileNum);

  for(var key in Board){
    if(Board[key]){
      // console.log("NUMBER BOARD KEY ", Board[key]);
      total+= Number(Board[key]);
    }
    // console.log("BOARD KEY WIN " + total);
  }
  if(total===17){
    console.log("THIS IS A WIN");
  }
}

//==============================================================================
