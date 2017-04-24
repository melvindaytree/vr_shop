$.ajax({
  dataType: "json",
  url: "/blog/vr/tests/json/items.json",
  success: function(data) {
    $.each(data, function() {
        count = 0;

  $.each(this, function(k, value) {
      
    console.log(k + '=' + name);
    var ul = $('ul');
    var li = document.createElement("li");
    li.append(k + '=' + name);
    ul.append(li);

    if (value === "name") {
        document.querySelector('#name' + count +' ').setAttribute('text', 'color:black; opacity:1; width:3.5; align:center; value:'+ name + ';');
    }

    else if (value === "price") {
        document.querySelector('#price' + count +' ').setAttribute('text', 'color:black; opacity:1; width:3.5; align:center; value:'+ name + ';');
    }

    else {

        document.querySelector('#img' + count +' ').setAttribute('src', 'http://melvindaytree.com/blog/vr/img/'+ name +''+ count + '.jpeg');
    }
  });

  console.log(count);
  count ++;

});
  }
});
