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

  function drawScale(firstNote, scaleType) {
    const pureFirstNote = firstNote.toLowerCase()[0];
    drawNotes(pureFirstNote);
  }

  function drawNotes(first) {
    let staffNoteheadsCounter = 0;
    const notes = ['d', 'e', 'f', 'g', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'a', 'b', 'c'];
    const lowestNote = 7; // D
    let position = lowestNote + notes.indexOf(first);

    const topLinePitchesKeyIndex = 20;
    const distanceBetweenStaffLines = 10;

    const staff = document.querySelector('.staff svg');

    document.querySelectorAll('ellipse.notehead').forEach(note => note.remove());

    const lowestCy = 170;

    for (highest = position+7 ; position < highest ; position++) {
      const notehead = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      notehead.setAttribute('class', "notehead");

      const cx = 90 + staffNoteheadsCounter * 50;
      notehead.setAttribute('cx', cx); // distance between notes

      const cy = lowestCy - (10 * position);
      notehead.setAttribute('cy', cy);
      notehead.setAttribute('rx', 14);
      notehead.setAttribute('ry', 10);

      staff.appendChild(notehead);
      staffNoteheadsCounter++;
    }

    how_to_draw_sharps(staff);
    and_flats(staff);
  }


  function how_to_draw_sharps(staff) {
    const sharp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    sharp.setAttribute('d', FLAT_SVG_PATH);
    const sharp_x = (440);
    const sharp_y = (100);
    sharp.setAttribute('transform', `translate(${sharp_x} , ${sharp_y})`);
    staff.appendChild(sharp);
  }

  function and_flats(staff){
    const flat = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    flat.setAttribute('d', FLAT_SVG_PATH);
    flat.setAttribute('class', 'flatty');
    const flat_x = (340);
    const flat_y = (93);
    flat.setAttribute('transform', `translate(${flat_x} , ${flat_y})`);
    staff.appendChild(flat);
  }
});

const SHARP_SVG_PATH = "M 3.2167 24.5 h 2.9201 l 1.6939 -6.8845 h 6.113 L 12.2695 24.5 h 2.9201 l 1.6939 -6.8845 h 5.996 v -2.4081 h -5.412 l 1.46 -5.8662 h 3.952 v -2.4081 H 19.5115 L 21.2054 0 H 18.2655 l -1.6939 6.9331 H 10.4395 L 12.1334 0 h -2.9207 l -1.6932 6.9331 H 1.6206 v 2.4081 h 5.3149 l -1.4409 5.8662 h -3.874 v 2.4081 h 3.29 L 3.2167 24.5 z M 9.8555 9.3412 h 6.1321 l -1.46 5.8662 H 8.4146 L 9.8555 9.3412 z";

const FLAT_SVG_PATH = "M 10.6178 -15.1513 C 10.6178 -13.2883 9.9194 -11.504 8.0032 -9.1091 C 5.9731 -6.572 4.2642 -5.1199 2.0124 -3.4124 L 2.0124 -14.5325 C 2.5243 -15.8252 3.2792 -16.8718 4.2804 -17.6753 C 5.2783 -18.4756 6.2892 -18.8773 7.313 -18.8773 C 9.0043 -18.8773 10.0768 -17.9183 10.5401 -16.0067 C 10.5919 -15.8512 10.6178 -15.566 10.6178 -15.1513 z M 10.3748 -22.9273 C 8.9784 -22.9273 7.5593 -22.5418 6.1142 -21.7674 C 4.6692 -20.9963 3.3019 -19.9627 2.0124 -18.6764 L 2.0124 -42.2367 L 0.1883 -42.2367 L 0.1883 -1.8831 C 0.1883 -0.7426 0.4993 -0.1724 1.1214 -0.1724 C 1.481 -0.1724 1.9279 -0.4737 2.5956 -0.8722 C 4.4856 -2.0002 5.6637 -2.754 6.9437 -3.5493 C 8.4037 -4.4563 10.0476 -5.5156 12.2216 -7.5892 C 13.7218 -9.0958 14.8072 -10.6153 15.4811 -12.1446 C 16.1518 -13.6771 16.4887 -15.1934 16.4887 -16.7 C 16.4887 -18.9292 15.8958 -20.5135 14.71 -21.4499 C 13.3686 -22.4348 11.9203 -22.9273 10.3748 -22.9273 z";
