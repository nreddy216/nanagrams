var endpoint = "http://www.dictionaryapi.com/api/v1/references/collegiate/xml/test?key=7f893f93-a4fb-41a8-8a3b-a91ef7913984";


// $.get(endpoint, function(response){
//    window.newData = response;
// });

$.ajax({
  type: 'GET',
  url: endpoint,
  dataType: 'json',
  success: function(data) {
    //celebrate!
    console.log(data);
  }
});
