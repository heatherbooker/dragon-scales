window.addEventListener('load', function() {

  const scaleOptions = ['A♭', 'A', 'B♭', 'B', 'C', 'C♯', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯'];
  let mostRecent = null;

  function getRandomScale() {
    let scale = scaleOptions[Math.floor(Math.random()*scaleOptions.length)];
    while (scale === mostRecent) {
      scale = scaleOptions[Math.floor(Math.random()*scaleOptions.length)];
    }
    mostRecent = scale;
    return scale;
  }
  
  document.querySelector('#go-button').onclick = function() {
    document.querySelector('#scale-flavour').textContent = getRandomScale();
  };

});
