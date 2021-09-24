window.addEventListener('load', function() {

  //const scaleOptions = ['A♭', 'A', 'B♭', 'B', 'C', 'C♯', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯'];
  let mostRecent = null;

  const scalesByDifficulty = [
    ['C+']
  ];
  scalesByDifficulty[1] = scalesByDifficulty[0].concat(['G+']);
  scalesByDifficulty[2] = scalesByDifficulty[1].concat(['F+']);
  scalesByDifficulty[3] = scalesByDifficulty[2].concat(['D+']);
  scalesByDifficulty[4] = scalesByDifficulty[3].concat(['B♭+']);

  function getRandomScale(difficulty) {
    console.log(difficulty);
    const scales = scalesByDifficulty[difficulty];
    console.log(scales);
    const numScales = scales.length;
    let scale = scales[Math.floor(Math.random()*numScales)];
    while (scale === mostRecent) {
      scale = scales[Math.floor(Math.random()*numScales)];
    }
    mostRecent = scale;
    return scale;
  }

  const difficultyInput = document.querySelector('#difficulty-input');
  difficultyInput.max = scalesByDifficulty.length - 1;
  
  document.querySelector('#go-button').onclick = function() {
    const difficulty = difficultyInput.value;
    document.querySelector('#scale-flavour').textContent = getRandomScale(difficulty);
  };

});
