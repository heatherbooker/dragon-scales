window.addEventListener('load', function() {

  //const scaleOptions = ['A♭', 'A', 'B♭', 'B', 'C', 'C♯', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯'];

  const letterNames = {
    'A♭': 0.6,
    'A': 0.2,
    'B♭': 0.5,
    'B': 0.6,
    'C': 0.2,
    'C♯': 0.7,
    'D♭': 0.7,
    'D': 0.3,
    'E♭': 0.3,
    'E': 0.4,
    'F': 0.4,
    'F♯': 0.7,
    'G': 0.3,
    'G♯': 0.7
  };

  const scaleTypes = {
    ionian: 0.1,
    melodic_minor: 0.3,
    harmonic_minor: 0.4,

    // modes of ionian
    aeolian: 0.15,
    dorian: 0.18,
    phrygian: 0.4,
    lydian: 0.25,
    mixolydian: 0.2,
    locrian: 0.5,

    // modes of melodic minor
    melodic_minor_mode_2: 0.7,
    melodic_minor_mode_3: 0.7,
    homeric: 0.5,
    melodic_minor_mode_5: 0.7,
    half_diminished: 0.4,
    altered_dominant: 0.4,


    // others
    pentatonic: 0.4,
    whole_tone: 0.4,
    chromatic: 0.3,
    octatonic_dominant: 0.5,
    octatonic_diminished: 0.6,

  };

  function getLetterName() {
    var keys = Object.keys(letterNames);
    return keys[Math.floor(keys.length * Math.random())];
  };

  function getRandomProperty(dict) {
    var keys = Object.keys(dict);
    return keys[Math.floor(keys.length * Math.random())];
  };

  function getScaleTypeAccordingToCheckboxes(scalies) {
    let scaletype = getRandomProperty(scaleTypes);

    if (scaletype === "ionian" && ! scalies["majors"]) {
      return getScaleTypeAccordingToCheckboxes(scalies);
    }

    if ([ "melodic_minor", 
          "harmonic_minor"
        ].includes(scaletype) && ! scalies["both-minors"]) {
      return getScaleTypeAccordingToCheckboxes(scalies);
    }

    if (scaletype.includes("octatonic") && ! scalies["octatonic"]) {
      return getScaleTypeAccordingToCheckboxes(scalies);
    }

    if (scaletype === "pentatonic" && ! scalies["pentatonic"]) {
      return getScaleTypeAccordingToCheckboxes(scalies);
    }

    if (scaletype === "chromatic" && ! scalies["chromatic"]) {
      return getScaleTypeAccordingToCheckboxes(scalies);
    }

    if (scaletype === "whole_tone" && ! scalies["whole-tone"]) {
      return getScaleTypeAccordingToCheckboxes(scalies);
    }


    if ([ "dorian", 
          "phrygian", 
          "lydian", 
          "mixolydian", 
          "aeolian", 
          "locrian"
        ].includes(scaletype) && ! scalies["ionian-modes"]) {
      return getScaleTypeAccordingToCheckboxes(scalies);
    }

    if ([ "melodic_minor_mode_2", 
          "melodic_minor_mode_3", 
          "homeric", 
          "melodic_minor_mode_5", 
          "half_diminished", 
          "altered_dominant"
        ].includes(scaletype) && ! scalies["melodic-minor-modes"]) {
      return getScaleTypeAccordingToCheckboxes(scalies);
    }

  return scaletype;
  };


  function selectScale(level) {

    const scalies = {};
    const checkboxen = document.querySelectorAll('input[type = "checkbox"]')
    checkboxen.forEach((checkbox, idx, original) => {
      scalies[checkbox.id] = checkbox.checked;
    });

    const firstLetter = getLetterName();
    const scaletype = getScaleTypeAccordingToCheckboxes(scalies);

    difficultyLevel = level * letterNames[firstLetter] * scaleTypes[scaletype];

    return `${firstLetter} ${scaletype}, difficulty is ${difficultyLevel}`;
  };


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

  let mostRecent = null;

  function getRandomScale(difficulty) {
    // const scales = scalesByDifficulty[difficulty];
    // const numScales = scales.length;
    // let scale = scales[Math.floor(Math.random()*numScales)];
    // while (scale === mostRecent) {
      // scale = scales[Math.floor(Math.random()*numScales)];
    // }
    // mostRecent = scale;
    // selectScale(5);
    // return scale;

    return selectScale(4);
  }

  const difficultyInput = document.querySelector('#difficulty-input');
  difficultyInput.max = scalesByDifficulty.length - 1;
  
  document.querySelector('#go-button').onclick = function() {
    const difficulty = difficultyInput.value;
    document.querySelector('#scale-flavour').textContent = getRandomScale(difficulty);
  };

});
