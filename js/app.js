//INITIAL METHOD BEFORE DRAG AND DROP
// var lastClicked;

//you can click on a letter,
//click on the spot you want the letter to go,
//repeat
// function setEventListeners() {
//   $(".letter").on("click", function(event) {
//     lastClicked = event.target;
//   });
//   $(".cell").on("click", function(event) {
//     $(event.target).append(lastClicked)
//     console.log(lastClicked);
//   })
// }

//////////////////////////////////////////

// DRAG AND DROP VERSION USING JQUERY UI

function dragAndDropInit(){

  $(".letter").draggable(
    {
      cursor: 'move',
      helper: "clone"

    }
  );

  $(".cell").droppable({
    drop: function(event, ui){
      ui.draggable.detach().appendTo($(this));
    }
  });

  $(".tile-pile").droppable({
    drop: function(event, ui){
      ui.draggable.detach().appendTo($(this));
    }
  });
};

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


//only searches for word in the first column
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

  console.log(allWordsArray);

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
      if(typeof Board[i]==="string" && (typeof Board[i-6]==="string" || typeof Board[i+6]==="string")){
          word+=Board[i];

          if(typeof Board[i+6]!=="string"){
            allWordsArray.push(word);
            var word="";
          }
        }
      }

    low = low + inc;
    high = high + inc;

  }
    console.log(allWordsArray);
    return allWordsArray;
}


function wordCorrect(){
  //concatenates both horiz and vert word arrays
  allWordsArrayVert = wordLoggerVertical();
  allWordsArrayHoriz = wordLoggerHorizontal();
  allWordsArray = allWordsArrayVert.concat(allWordsArrayHoriz);


  for(var i=0; i<allWordsArray.length;i++){
    //checks whether the word is in the dictionary API
      isWord(allWordsArray[i], notifyUser);
      // console.log("WORD CHECK " + allWordsArray[i]);

      if(notifyUser(isWord(allWordsArray[i]))===false){
        notWordsArray.push(allWordsArray[i]);
      }
  }

}

var notWordsArray = [];

//callback function for AJAX request
function notifyUser(isWord) {
if(isWord===false){
  $('.word-result').html("At least one o' these ain't a word, SONNY BOY! No peeling.<p></p>");
  $('.word-result').toggleClass("wrong");
  return false;
}
else{
    // console.log("This word is real");
    $('.word-result').html("WOOPAH! Keep moving!<p></p>");
    $('.word-result').removeClass("wrong");
    return true;

    // $(".letter").toggleClass("wrong");

  }
}

//searchTerm is the word that is created
//cb is the callback function "notifyUser(isWord)"
function isWord(searchTerm, cb) {

  var endpoint = "http://api.wordnik.com/v4/word.json/" + searchTerm + "/definitions?useCanonical=false&includeSuggestions=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
  $.ajax({
    type: 'GET',
    url: endpoint,
    dataType: 'json',
    success: function(data) {
      // console.log("results:", data.length);
      // console.log("word: "+ searchTerm);
      if(data.length > 0) {
        cb(true);
      } else {
        cb(false);
      }
    }
  });
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


function appendTile(letter){
  var letterImg = $('<img>');
  letterImg.attr('src', "images/tiles/tiles-"+letter+".svg");
  letterImg.attr('id', letter);
  letterImg.attr('value', letter);
  letterImg.attr('class', "letter");
  $(".letters").append(letterImg);

}




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



function peel(){
  var shuffledArray = shuffle(letterArray);

  //if there's nothing in the shuffledArray, it doesn't peel anymore
  if(allLettersSum(allLetters)<1){
    $('.peel-btn').removeClass("peel-btn-purple");
    $('.peel-btn').addClass("peel-btn-grey");
    return;
  }
  else{
    var random = Math.floor(Math.random()*(shuffledArray.length));

    var selectedLetter = shuffledArray[random];

    //gets index of the selected letter
    var index = shuffledArray.indexOf(selectedLetter);

    //removes the selected letter from array
    shuffledArray.splice(index, 1);

    allLetters[selectedLetter]-=1;

    appendTile(selectedLetter);

  }

  dragAndDropInit();
  console.log(shuffledArray);

};

var dumpedLetter;

function dump(){
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


      $(this).addClass("hoverdump");
      $(this).removeClass("normaldump");
    },
    drop: function(event, ui){


      // console.log(ui.draggable + " DRAGGABLE DUMP")
      $(this).addClass("normaldump");
      $(this).removeClass("hoverdump");

      // console.log(allLettersSum(allLetters));
      // console.log(allLetters);

      if(allLettersSum(allLetters)>1){
        //push the dumped letter back onto the array + object
        letterArray.push(ui.draggable.prop('id'));
        allLetters[ui.draggable.prop('id')]+=1;

        //detach and fadeout
        ui.draggable.detach();
        ui.draggable.fadeOut("slow",function(){
          for(var i=0; i<3; i++){
            peel();
          }
        });
      }
      else{
        $('.dump-btn').css("background-color", "grey");

      }
    }
  });


}

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

function timer(){
  var day = new Date();
  var today = day.now();
  $('.clock').countdown(today + "00:00:40", function(event) {
    var totalSeconds = event.offset.seconds;
    $(this).html(event.strftime(totalSeconds + '%S sec'));
  });
}


// RUNNING
$(document).ready(function(){

  // timer();

  //# of tiles
  console.log(allLettersSum(allLetters));

    for(var i=0; i<6;i++){
      peel();
    }

    dragAndDropInit();
    findLetters();
    dump();

    $(".peel-btn").click(function(){
        // win();
        findLetters();
        peel();

        console.log(allLettersSum(allLetters));
        wordCorrect();

        console.log("THESE ARENT WORDS " + notWordsArray);


    });



});
