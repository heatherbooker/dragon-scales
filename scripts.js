window.addEventListener('load', function() {

  const scaleOptions = ['A♭', 'A', 'B♭', 'B', 'C', 'C♯', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯'];

  function getRandomScale() {
    return scaleOptions[Math.floor(Math.random()*scaleOptions.length)];
  }
  
  document.querySelector('#go-button').onclick = function() {
    document.querySelector('#scale-flavour').textContent = getRandomScale();
  };

});
