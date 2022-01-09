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

  type ScaleType = "ionian"
                  | "melodic_minor"
                  | "harmonic_minor"
                    // modes of ionian

                  | "aeolian"
                  | "dorian"
                  | "phrygian"
                  | "lydian"
                  | "mixolydian"
                  | "locrian"

                    // modes of melodic minor
                  | "melodic_minor_mode_2"
                  | "melodic_minor_mode_3"
                  | "homeric"
                  | "melodic_minor_mode_5"
                  | "half_diminished"
                  | "altered_dominant"

                    // others
                  | "pentatonic"
                  | "whole_tone"
                  | "chromatic"
                  | "octatonic_dominant"
                  | "octatonic_diminished"


  function scaleTypes(scale: ScaleType): number {
    switch (scale) {

      case "ionian": 0.1;
      case "melodic_minor": 0.3;
      case "harmonic_minor": 0.4;

      // modes of ionian
      case "aeolian": 0.15;
      case "dorian": 0.18;
      case "phrygian": 0.4;
      case "lydian": 0.25;
      case "mixolydian": 0.2;
      case "locrian": 0.5;

      // modes of melodic minor
      case "melodic_minor_mode_2": 0.7;
      case "melodic_minor_mode_3": 0.7;
      case "homeric": 0.5;
      case "melodic_minor_mode_5": 0.7;
      case "half_diminished": 0.4;
      case "altered_dominant": 0.4;

      // others
      case "pentatonic": 0.4;
      case "whole_tone": 0.4;
      case "chromatic": 0.3;
      case "octatonic_dominant": 0.5;
      case "octatonic_diminished": 0.6;
    }; 
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
    const checkboxen = document.querySelectorAll<HTMLInputElement>('input[type = "checkbox"]')
    checkboxen.forEach((checkbox, idx, original) => {
      checkbox.checked && scalies.add(checkbox.id);
    });

    return getScaleTypeAccordingToCheckboxes(scalies);
  };

  function main() {
    document.querySelector<HTMLElement>('#go-button').onclick = function () {
      const difficulty = document.querySelector<HTMLInputElement>('#difficulty-input').value;
      const scaletype = selectScale();
      const firstNote = getLetterName();
      const speed = selectSpeed(difficulty, letterNames[firstNote], scaleTypes[scaletype]);
      const message = (scaletype === null) ? 'check a box' : `${firstNote} ${scaletype}, metronome at: ${speed}`;
      document.querySelector('#scale-flavour').textContent = message;
      drawScale(firstNote, scaletype);
    };
  }
  main();

  function determineKeySignature(scaleType, firstNote): { sharps: number; flats: number } {
    return { sharps: 2, flats: 0 };
  }

  function drawScale(firstNote, scaleType) {
    clearStaff();

    const staff = document.querySelector('.staff svg');

    const keySignature = determineKeySignature(scaleType, firstNote);
    drawKeySignature(staff, keySignature);

    const pureFirstNote = firstNote.toLowerCase()[0]; // remove sharp or flat symbol
    drawNotes(staff, pureFirstNote);
  }

  function drawNotes(staff, first) {
    let staffNoteheadsCounter = 0;
    const notes = ['d', 'e', 'f', 'g', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'a', 'b', 'c'];
    const lowestNote = 7; // D
    let position = lowestNote + notes.indexOf(first);

    const topLinePitchesKeyIndex = 20;
    const distanceBetweenStaffLines = 10;

    const lowestCy = 190;

    for (let highest = position+7 ; position < highest ; position++) {
      const notehead = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      notehead.setAttribute('class', "notehead");

      const cx = 250 + staffNoteheadsCounter * 50;
      notehead.setAttribute('cx', cx.toString()); // distance between notes

      const cy = lowestCy - (10 * position);
      notehead.setAttribute('cy', cy.toString());
      notehead.setAttribute('rx', '14');
      notehead.setAttribute('ry', '10');

      staff.appendChild(notehead);
      staffNoteheadsCounter++;
    }
  }

  function clearStaff() {
    document.querySelectorAll('ellipse.notehead').forEach(note => note.remove());

    document.querySelectorAll('path.flat').forEach(flat => flat.remove());
    document.querySelectorAll('path.sharp').forEach(sharp => sharp.remove());
  }

  function drawKeySignature(staff, sig) {
    how_to_draw_sharps(staff, sig.sharps);
    and_flats(staff, sig.flats);
  }

  function how_to_draw_sharps(staff, quantity) {
    sharp_sig_positions.slice(0, quantity).forEach((pos, idx) => {

      const sharp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      sharp.setAttribute('d', SHARP_SVG_PATH);
      sharp.setAttribute('class', 'sharp');
      const sharp_x = 70 + 20*idx;
      const sharp_y = pos;
      sharp.setAttribute('transform', `translate(${sharp_x} , ${sharp_y})`);
      staff.appendChild(sharp);
    });
  }

  function and_flats(staff, quantity){
    flat_signature_positions.slice(0, quantity).forEach((pos, idx) => {
      const flat = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      flat.setAttribute('d', FLAT_SVG_PATH);
      flat.setAttribute('class', 'flat');
      const flat_x = 70 + 20*idx;
      const flat_y = pos;
      flat.setAttribute('transform', `translate(${flat_x} , ${flat_y})`);
      staff.appendChild(flat);
    });
  }
});

const flat_signature_positions = [ 83, 53, 93, 63, 103, 73, 113 ];

const sharp_sig_positions = [ 53, 83, 43, 73, 103, 63, 93 ];

const SHARP_SVG_PATH = "M 5.0448 -16.5032 L 5.0448 -27.7928 L 9.8448 -29.1176 L 9.8448 -17.8856 L 5.0448 -16.5032 z M 14.496 -19.2344 L 11.196 -18.2888 L 11.196 -29.5208 L 14.496 -30.4424 L 14.496 -35.108 L 11.196 -34.1864 L 11.196 -45.6626 L 9.8448 -45.6626 L 9.8448 -33.8384 L 5.0448 -32.4584 L 5.0448 -43.6178 L 3.7704 -43.6178 L 3.7704 -32.0336 L 0.4704 -31.1096 L 0.4704 -26.4344 L 3.7704 -27.356 L 3.7704 -16.1456 L 0.4704 -15.2264 L 0.4704 -10.5704 L 3.7704 -11.492 L 3.7704 -0.0806 L 5.0448 -0.0806 L 5.0448 -11.9 L 9.8448 -13.22 L 9.8448 -2.1182 L 11.196 -2.1182 L 11.196 -13.6376 L 14.496 -14.5616 L 14.496 -19.2344 z";

const FLAT_SVG_PATH = "M 10.6178 -15.1513 C 10.6178 -13.2883 9.9194 -11.504 8.0032 -9.1091 C 5.9731 -6.572 4.2642 -5.1199 2.0124 -3.4124 L 2.0124 -14.5325 C 2.5243 -15.8252 3.2792 -16.8718 4.2804 -17.6753 C 5.2783 -18.4756 6.2892 -18.8773 7.313 -18.8773 C 9.0043 -18.8773 10.0768 -17.9183 10.5401 -16.0067 C 10.5919 -15.8512 10.6178 -15.566 10.6178 -15.1513 z M 10.3748 -22.9273 C 8.9784 -22.9273 7.5593 -22.5418 6.1142 -21.7674 C 4.6692 -20.9963 3.3019 -19.9627 2.0124 -18.6764 L 2.0124 -42.2367 L 0.1883 -42.2367 L 0.1883 -1.8831 C 0.1883 -0.7426 0.4993 -0.1724 1.1214 -0.1724 C 1.481 -0.1724 1.9279 -0.4737 2.5956 -0.8722 C 4.4856 -2.0002 5.6637 -2.754 6.9437 -3.5493 C 8.4037 -4.4563 10.0476 -5.5156 12.2216 -7.5892 C 13.7218 -9.0958 14.8072 -10.6153 15.4811 -12.1446 C 16.1518 -13.6771 16.4887 -15.1934 16.4887 -16.7 C 16.4887 -18.9292 15.8958 -20.5135 14.71 -21.4499 C 13.3686 -22.4348 11.9203 -22.9273 10.3748 -22.9273 z";
