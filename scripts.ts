window.addEventListener('load', function() {

  enum LetterName {
    'A♭' = 'A♭',
    'A' = 'A',
    'B♭' = 'B♭',
    'B' = 'B',
    'C' = 'C',
    'D♭' = 'D♭',
    'D' = 'D',
    'E♭' = 'E♭',
    'E' = 'E',
    'F' = 'F',
    'F♯' = 'F♯',
    'G' = 'G',
  };

  const letter_name_weight: {[key in LetterName]: number} = {
    'A♭': 0.6,
    'A': 0.2,
    'B♭': 0.5,
    'B': 0.6,
    'C': 0.2,
    'D♭': 0.65,
    'D': 0.3,
    'E♭': 0.3,
    'E': 0.4,
    'F': 0.4,
    'F♯': 0.65,
    'G': 0.3,
  };


  type ScaleType = "Ionian"
                | "melodic minor"
                | "harmonic minor"

                  // modes of ionian
                | "Aeolian"
                | "Dorian"
                | "Phrygian"
                | "Lydian"
                | "Mixolydian"
                | "Locrian"

                  // modes of melodic minor
                | "melodic minor mode 2"
                | "melodic minor mode 3"
                | "Homeric"
                | "melodic minor mode 5"
                | "half diminished"
                | "altered dominant"

                  // others
                | "pentatonic"
                | "whole tone"
                | "chromatic"
                | "octatonic dominant"
                | "octatonic diminished"


  const scaleTypes: {[index in ScaleType]: number} = {
    "Ionian": 0.1,
    "melodic minor": 0.3,
    "harmonic minor": 0.4,

    // modes of ionian
    "Aeolian": 0.15,
    "Dorian": 0.18,
    "Phrygian": 0.4,
    "Lydian": 0.25,
    "Mixolydian": 0.2,
    "Locrian": 0.5,

    // modes of melodic minor
    "melodic minor mode 2": 0.7,
    "melodic minor mode 3": 0.7,
    "Homeric": 0.5,
    "melodic minor mode 5": 0.7,
    "half diminished": 0.4,
    "altered dominant": 0.4,

    // others
    "pentatonic": 0.4,
    "whole tone": 0.4,
    "chromatic": 0.3,
    "octatonic dominant": 0.5,
    "octatonic diminished": 0.6,

  };

  const scales_to_checkbox_ids: {[index in ScaleType]: string} = {
    "Ionian": "majors",
    "melodic minor": "melodic-minor",
    "harmonic minor": "harmonic-minor",

    // modes of ionian
    "Aeolian": "ionian-modes",
    "Dorian": "ionian-modes",
    "Phrygian": "ionian-modes",
    "Lydian": "ionian-modes",
    "Mixolydian": "ionian-modes",
    "Locrian": "ionian-modes",

    // modes of melodic minor
    "melodic minor mode 2": "memimos",
    "melodic minor mode 3": "memimos",
    "Homeric": "memimos",
    "melodic minor mode 5": "memimos",
    "half diminished": "memimos",
    "altered dominant": "memimos",

    // others
    "pentatonic": "pentatonic",
    "whole tone": "whole-tone",
    "chromatic": "chromatic",
    "octatonic dominant": "octatonic",
    "octatonic diminished": "octatonic",
  };

  function getRandomProperty(dict) {
    var keys = Object.keys(dict);
    return keys[Math.floor(keys.length * Math.random())];
  };

  function getRandomArrayValue(array: Array<any>) {
    return array[Math.floor(Math.random() * array.length)];
  };

  function getScaleTypeAccordingToCheckboxes(scalies: Set<string>) {
    if (scalies.size === 0) { return null; }

    do {
      var scaletype = getRandomProperty(scaleTypes);
    } while (! (scalies.has(scales_to_checkbox_ids[scaletype])));

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
    const scalies = new Set<string>();
    const checkboxen = document.querySelectorAll<HTMLInputElement>('input[type = "checkbox"]')
    checkboxen.forEach((checkbox, idx, original) => {
      checkbox.checked && scalies.add(checkbox.id);
    });

    return getScaleTypeAccordingToCheckboxes(scalies);
  };

  function main() {
    document.querySelector<HTMLElement>('#go-button').onclick = function () {
      const scaletype = selectScale();
      let message = 'check a box';
      clearStaff();

      if (scaletype !== null) {
        const difficulty = document.querySelector<HTMLInputElement>('#difficulty-input').value;
        const firstNote = getRandomArrayValue(Object.keys(LetterName));
        const speed = selectSpeed(difficulty, letter_name_weight[firstNote], scaleTypes[scaletype]);
        message = `${firstNote} ${scaletype}, metronome at: ${speed}`;
        drawScale(firstNote, scaletype);
      }
      document.querySelector('#scale-flavour').textContent = message;
    };
  }
  main();

  function determineKeySignature(scaleType, firstNote): { sharps: number; flats: number } {
    return { sharps: 2, flats: 0 };
  }

  function drawScale(firstNote, scaleType) {
    const staff = document.querySelector('.staff svg');

    const keySignature = determineKeySignature(scaleType, firstNote);
    drawKeySignature(staff, keySignature);

    const pureFirstNote = firstNote.toLowerCase()[0]; // remove sharp or flat symbol
    drawNotes(staff, pureFirstNote);
  }

  function drawNotes(staff, first) {
    let staffNoteheadsCounter = 0;
    const notes = ['c', 'd', 'e', 'f', 'g', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'a', 'b'];
    const lowestNote = 7; // C
    let position = lowestNote + notes.indexOf(first);

    const topLinePitchesKeyIndex = 20; //what does that even mean
    const distanceBetweenStaffLines = 10;

    const lowestCy = 200; // since size of our svg is 200

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

      const ledgerLines = [10, 130]; // highest and lowest notes
      if (ledgerLines.includes(cy)) {
        const ledgerLine = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        ledgerLine.setAttribute('height', '2');
        ledgerLine.setAttribute('width', '44');
        ledgerLine.setAttribute('y', cy.toString());
        ledgerLine.setAttribute('x', (cx - 22).toString());
        ledgerLine.setAttribute('class', "ledger");
        staff.appendChild(ledgerLine);
      }
    }
  }

  function clearStaff() {
    document.querySelectorAll('ellipse.notehead').forEach(note => note.remove());
    document.querySelectorAll('rect.ledger').forEach(note => note.remove());

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
