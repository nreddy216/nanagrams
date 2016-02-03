
//selects the ID of the letter
//saves the ID as 'last selected letter'
//the next place clicked then inputs the image into the box

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
//
// function init(){
//   $(".tile img").draggable(
//     {
//       // containment: '.board',
//       cursor: 'move',
//       // snap: ".cell",
//     }
//   );
//
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
// function playGame(){
//   // init();
//   // handleDropEvent();
//
// }


// RUNNING
$(document).ready(function(){

    setEventListeners();

});
