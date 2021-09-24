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
  scalesByDifficulty[5] = scalesByDifficulty[4].concat(['A+']);
  scalesByDifficulty[6] = scalesByDifficulty[5].concat(['E♭+']);
  scalesByDifficulty[7] = scalesByDifficulty[6].concat(['E+']);
  scalesByDifficulty[8] = scalesByDifficulty[7].concat(['A♭+']);
  scalesByDifficulty[9] = scalesByDifficulty[8].concat(['B+']);
  scalesByDifficulty[10] = scalesByDifficulty[9].concat(['D♭+']);
  scalesByDifficulty[11] = scalesByDifficulty[10].concat(['F♯+']);

  function getRandomScale(difficulty) {
    const scales = scalesByDifficulty[difficulty];
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
