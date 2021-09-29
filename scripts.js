window.addEventListener('load', function() {

  const letterNames = {
    'A♭': 0.6,
    'A': 0.2,
    'B♭': 0.5,
    'B': 0.6,
    'C': 0.2,
    'C♯': 0.65,
    'D♭': 0.65,
    'D': 0.3,
    'E♭': 0.3,
    'E': 0.4,
    'F': 0.4,
    'F♯': 0.65,
    'G': 0.3,
    'G♯': 0.65
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
    if (scalies.size === 0) { return null; }

    let scaletype = getRandomProperty(scaleTypes);

    if (scaletype === "ionian" && ! scalies.has("majors")) {
      return getScaleTypeAccordingToCheckboxes(scalies);
    }

    if ([ "melodic_minor", 
          "harmonic_minor"
        ].includes(scaletype) && ! scalies.has("both-minors")) {
      return getScaleTypeAccordingToCheckboxes(scalies);
    }

    if (scaletype.includes("octatonic") && ! scalies.has("octatonic")) {
      return getScaleTypeAccordingToCheckboxes(scalies);
    }

    if (scaletype === "pentatonic" && ! scalies.has("pentatonic")) {
      return getScaleTypeAccordingToCheckboxes(scalies);
    }

    if (scaletype === "chromatic" && ! scalies.has("chromatic")) {
      return getScaleTypeAccordingToCheckboxes(scalies);
    }

    if (scaletype === "whole_tone" && ! scalies.has("whole-tone")) {
      return getScaleTypeAccordingToCheckboxes(scalies);
    }


    if ([ "dorian", 
          "phrygian", 
          "lydian", 
          "mixolydian", 
          "aeolian", 
          "locrian"
        ].includes(scaletype) && ! scalies.has("ionian-modes")) {
      return getScaleTypeAccordingToCheckboxes(scalies);
    }

    if ([ "melodic_minor_mode_2", 
          "melodic_minor_mode_3", 
          "homeric", 
          "melodic_minor_mode_5", 
          "half_diminished", 
          "altered_dominant"
        ].includes(scaletype) && ! scalies.has("melodic-minor-modes")) {
      return getScaleTypeAccordingToCheckboxes(scalies);
    }

  return scaletype;
  };

  function getRandom(min, max) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) {
      num = getRandom(min, max); // resample between 0 and 1 if out of range
    }
    
    else {
      num *= max - min; // Stretch to fill range
      num += min; // offset to min
    }
    return num;
  }

  function selectSpeed(levelFactor, letterFactor, scaleFactor) {
    const metronome_min = 44;
    const metronome_max = 250;
    const inflation_factor = 480; // to make it BIG
    const difficultyLevel = levelFactor * (1 - letterFactor) * (1 - scaleFactor);
    let speed = difficultyLevel * inflation_factor;
    speed = getRandom(speed - 10, speed + 10);
    return Math.floor(Math.min(metronome_max, Math.max(metronome_min, speed)));
  }

  function selectScale() {
    const scalies = new Set();
    const checkboxen = document.querySelectorAll('input[type = "checkbox"]')
    checkboxen.forEach((checkbox, idx, original) => {
      checkbox.checked && scalies.add(checkbox.id);
    });

    return getScaleTypeAccordingToCheckboxes(scalies);
  };

  function main() {
    document.querySelector('#go-button').onclick = function() {
      const difficulty = document.querySelector('#difficulty-input').value;
      const scaletype = selectScale(difficulty);
      const firstNote = getLetterName();
      const speed = selectSpeed(difficulty, letterNames[firstNote], scaleTypes[scaletype]);
      const message = (scaletype === null) ? 'check a box' : `${firstNote} ${scaletype}, metronome at: ${speed}`;
      document.querySelector('#scale-flavour').textContent = message;
      drawScale(firstNote, scaletype);
    };
  }
  main();

  function drawScale(firstNote, scaleType) {}

  let staffNoteheadsCounter = 0;
  function addNoteToStaff(letterName) {
    const notes = ['d', 'e', 'f', 'g', 'a', 'b', 'c'];
    const lowestNote = 7; // D
    const position = lowestNote + notes.indexOf(letterName);

    const topLinePitchesKeyIndex = 20;
    const distanceBetweenStaffLines = 10;

    const staff = document.querySelector('.staff svg');
    const notehead = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    const cx = 90 + staffNoteheadsCounter * 50;
    notehead.setAttribute('cx', cx); // distance between notes
    staffNoteheadsCounter++;
    const lowestCy = 170; // 140;
    const cy = lowestCy - (10 * position);
    notehead.setAttribute('cy', cy);
    notehead.setAttribute('rx', 14);
    notehead.setAttribute('ry', 10);

    staff.appendChild(notehead);
  }
  addNoteToStaff('d');
  addNoteToStaff('e');
  addNoteToStaff('f');
  addNoteToStaff('g');
  addNoteToStaff('a');
  addNoteToStaff('b');
  addNoteToStaff('c');
    /*if (remainder === 1) {
      const sharp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      sharp.setAttribute('d', SHARP_SVG_PATH);
      const sharp_x = (cx - 40);
      const sharp_y = (cy - 11);
      sharp.setAttribute('transform', `translate(${sharp_x} , ${sharp_y})`);
      staff.appendChild(sharp);
    }*/
});
