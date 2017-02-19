console.log("g");

var swap = document.querySelector('#swap');
swap.addEventListener('click', function () {
  console.log("blah");
  document.querySelector('#testimg').setAttribute('src', 'http://melvindaytree.com/blog/vr/img/shoe3.png');
  document.querySelector('#image-360').setAttribute('color', '#6EBAA7');
});