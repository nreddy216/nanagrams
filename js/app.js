
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
// DICTIONARY CHECK

//take values of images
//push them onto an array
//join the array
//check if the dictionary has the word
//if so, return true, if not, return false

var dictionaryArray = ["ban", "nab"];

// RUNNING
$(document).ready(function(){

    setEventListeners();
    // setEventListeners();

});
