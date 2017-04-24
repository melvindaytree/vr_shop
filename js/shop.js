console.log("g");

var swap = document.querySelector('#swap');
swap.addEventListener('click', function () {
  console.log("blah");
  document.querySelector('#img7').setAttribute('src', 'http://melvindaytree.com/blog/vr/img/shoe3.png');
   document.querySelector('#name1').setAttribute('value', 'Green');
 // document.querySelector('#image-360').setAttribute('color', '#6EBAA7');
});



//This function loops through all the pictures in the img dir and displays them after the click below
function loopImg(name) {
    for (x = 1; x < 9; x++) {
        document.querySelector('#img' + x +' ').setAttribute('src', 'http://melvindaytree.com/blog/vr/img/'+ name +''+ x + '.jpeg');
        //document.querySelector('#name' + x +' ').setAttribute('text', 'color:black; opacity:1; width:3.5; align:center; value:Greenshoes;');
        };
}

//This function gets the json data from an ajax request and then puts them into the scene
function getJsonImg(path) {

    //count the item name starting from 1      
    var itemCount = 1;

        $.ajax({
  dataType: "json",
  url: path,
  success: function(data) {
    $.each(data, function() {
        

  $.each(this, function(k, value) {
      
    //console.log(k + '=' + value);
    console.log("before" + itemCount);

    if (k === "name") {
        document.querySelector('#name' + itemCount +' ').setAttribute('text', 'color:black; opacity:1; width:3.5; align:center; value:'+ value + ';');
    }

    else if (k === "price") {
        document.querySelector('#price' + itemCount +' ').setAttribute('text', 'color:black; opacity:1; width:3.5; align:center; value:'+ value + ';');
    }

    else {

        document.querySelector('#img' + itemCount +' ').setAttribute('src', 'http://melvindaytree.com/blog/vr/img/'+ value);
            console.log("after" + itemCount);
            itemCount++;
    }


  });

  

});
  }
});
}

var count = 0;
var switches = document.querySelector('#switch');

switches.addEventListener('click', function () {
  switch(count) {
      case 0:     
        getJsonImg("/blog/vr/json/nike.json");
        count ++;  
        break;

    case 1:
       getJsonImg("/blog/vr/json/items.json");
      count ++;
      break;

      default:
      loopImg("mk");
      count = 0;
      break; 

}
});

var style = document.querySelector('#style');
style.addEventListener('click', function () {

}

