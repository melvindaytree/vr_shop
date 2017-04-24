console.log("new");
var sphere = document.querySelector('a-sphere');
sphere.addEventListener('click', function () {
  console.log("blah");
  document.querySelector('#image-360').setAttribute('color', '#6EBAA7');
  document.querySelector('#txt').setAttribute('text', 'color:black; opacity:1; width:3.5; align:center; value:Greenshoes;');
});

//write function to only lets you enter one value from the setAttribute field