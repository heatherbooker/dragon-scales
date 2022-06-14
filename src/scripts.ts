type Note = {
  letter: LetterName,
  sharps: number, // sharps positive, natural zero, flats negative
}

type Scale = {
  tonic: Note,
  mode: ScaleType,
}

function render_note(note: Note): string {
  return note.letter + render_sharps(note.sharps);
}

function render_sharps(sharps: number): string {
  if (sharps === 0) {
    return '';
  } else if (sharps > 0) {
    return '♯'.repeat(sharps);
  } else {
    return '♭'.repeat(- sharps);
  }
}


const enum Interval {
  PerfectUnison,
  MinorSecond,
  MajorSecond,
  MinorThird,
  MajorThird,
  PerfectFourth,
  PerfectFifth,
  MinorSixth,
  MajorSixth,
  MinorSeventh,
  MajorSeventh,
};

enum LetterName {
  'A' = 'A',
  'B' = 'B',
  'C' = 'C',
  'D' = 'D',
  'E' = 'E',
  'F' = 'F',
  'G' = 'G',
};

function note_difficulty_weight(note: Note): number {
  // FIXME this is not terribly sophisticated.
  let difficulty: number;
  switch (note.letter) {
    case LetterName.A:
    case LetterName.C:
    case LetterName.D:
    case LetterName.G:
      difficulty = 0.2;
      break;
    case LetterName.E:
    case LetterName.F:
      difficulty = 0.3;
      break;
    case LetterName.B:
      difficulty = 0.4;
      break;
  }
  if (note.sharps !== 0) {
    difficulty = 2*difficulty;
  }
  return difficulty;
}

type KeySig = { sharps: number, flats: number }

function ionian_signatures_for_letter(letter: LetterName): number {
  switch (letter) {
    case LetterName.A: return 3;
    case LetterName.B: return 5;
    case LetterName.C: return 0;
    case LetterName.D: return 2;
    case LetterName.E: return 4;
    case LetterName.F: return -1;
    case LetterName.G: return 1;
  }
}

function ionian_signatures(note: Note): KeySig {
  const extra_sharps = 7 * note.sharps;
  const sharps = ionian_signatures_for_letter(note.letter) + extra_sharps;
  if (sharps < 0) {
    return {
      sharps: 0,
      flats: (-sharps),
    }
  } else {
    return {
      sharps: sharps,
      flats: 0,
    }
  }
}

enum ScaleType {
  Ionian,
  MelodicMinor,
  HarmonicMinor,
  DoubleHarmonic, // flat 2 and flat 6

    // modes of ionian
  Aeolian,
  Dorian,
  Phrygian,
  Lydian,
  Mixolydian,
  Locrian,

    // modes of melodic minor
  MelodicMinorMode2,
  MelodicMinorMode3,
  Homeric,
  MelodicMinorMode5,
  HalfDiminished,
  AlteredDominant,

  HarmonicMinorMode2,
  HarmonicMinorMode3,
  HarmonicMinorMode4,
  HarmonicMinorMode5,
  HarmonicMinorMode6,
  HarmonicMinorMode7,

  DoubleHarmonicMode2,
  DoubleHarmonicMode3,
  DoubleHarmonicMode4,
  DoubleHarmonicMode5,
  DoubleHarmonicMode6,
  DoubleHarmonicMode7,

    // others
  Pentatonic,
  WholeTone,
  Chromatic,
  OctatonicDominant,
  OctatonicDiminished,
}


const scaleTypes: {[index in ScaleType]: number} = {
  [ScaleType.Ionian]: 0.1,
  [ScaleType.MelodicMinor]: 0.3,
  [ScaleType.HarmonicMinor]: 0.4,
  [ScaleType.DoubleHarmonic]: 0.6,

  // modes of ionian
  [ScaleType.Aeolian]: 0.15,
  [ScaleType.Dorian]: 0.18,
  [ScaleType.Phrygian]: 0.4,
  [ScaleType.Lydian]: 0.25,
  [ScaleType.Mixolydian]: 0.2,
  [ScaleType.Locrian]: 0.5,

  // modes of melodic minor
  [ScaleType.MelodicMinorMode2]: 0.7,
  [ScaleType.MelodicMinorMode3]: 0.7,
  [ScaleType.Homeric]: 0.5,
  [ScaleType.MelodicMinorMode5]: 0.7,
  [ScaleType.HalfDiminished]: 0.4,
  [ScaleType.AlteredDominant]: 0.4,

  // modes of melodic minor
  [ScaleType.HarmonicMinorMode2]: 0.9,
  [ScaleType.HarmonicMinorMode3]: 0.9,
  [ScaleType.HarmonicMinorMode4]: 0.9,
  [ScaleType.HarmonicMinorMode5]: 0.9,
  [ScaleType.HarmonicMinorMode6]: 0.9,
  [ScaleType.HarmonicMinorMode7]: 0.9,

  [ScaleType.DoubleHarmonicMode2]: 0.9,
  [ScaleType.DoubleHarmonicMode3]: 0.9,
  [ScaleType.DoubleHarmonicMode4]: 0.9,
  [ScaleType.DoubleHarmonicMode5]: 0.9,
  [ScaleType.DoubleHarmonicMode6]: 0.9,
  [ScaleType.DoubleHarmonicMode7]: 0.9,

  // others
  [ScaleType.Pentatonic]: 0.4,
  [ScaleType.WholeTone]: 0.4,
  [ScaleType.Chromatic]: 0.3,
  [ScaleType.OctatonicDominant]: 0.5,
  [ScaleType.OctatonicDiminished]: 0.6,

};

const enum CheckBoxen {
  "majors" = "majors",
  "melodic-minor" = "melodic-minor",
  "harmonic-minor" = "harmonic-minor",
  "ionian-modes" = "ionian-modes",
  "memimos" = "memimos", // modes of melodic minor
  "pentatonic" = "pentatonic",
  "whole-tone" = "whole-tone",
  "chromatic" = "chromatic",
  "octatonic" = "octatonic",
};

const scaletype_subsets: {[index in CheckBoxen]: Array<ScaleType>} = {
  "majors": [ScaleType.Ionian],
  "melodic-minor": [ScaleType.MelodicMinor],
  "harmonic-minor": [ScaleType.HarmonicMinor],

  // modes of ionian
  "ionian-modes": [
    ScaleType.Ionian,
    ScaleType.Aeolian,
    ScaleType.Dorian,
    ScaleType.Phrygian,
    ScaleType.Lydian,
    ScaleType.Mixolydian,
    ScaleType.Locrian
  ],

  // modes of melodic minor
  "memimos": [
    ScaleType.MelodicMinor,
    ScaleType.MelodicMinorMode2,
    ScaleType.MelodicMinorMode3,
    ScaleType.Homeric,
    ScaleType.MelodicMinorMode5,
    ScaleType.HalfDiminished,
    ScaleType.AlteredDominant,
  ],

  // others
  "pentatonic": [ScaleType.Pentatonic],
  "whole-tone": [ScaleType.WholeTone],
  "chromatic": [ScaleType.Chromatic],
  "octatonic": [ScaleType.OctatonicDominant, ScaleType.OctatonicDiminished],
}

function getRandomArrayValue(array: Array<any>) {
  return array[Math.floor(Math.random() * array.length)];
};

function get_random_note(): Note {
  const note_letter = getRandomArrayValue(Object.keys(LetterName));
  const note_accidental = Math.floor(3*Math.random()) - 1
                          // integer in [-1, 0, 1]
  return {
    letter: note_letter,
    sharps: note_accidental,
  }
};

function getRandom(min: number, max: number) {
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

function selectSpeed(levelFactor: number,
                     letterFactor: number,
                     scaleFactor: number): number {
  const metronome_min = 44;
  const metronome_max = 250;
  const inflation_factor = 480; // to make it BIG
  const difficultyLevel = levelFactor * (1 - letterFactor) * (1 - scaleFactor);
  let speed = difficultyLevel * inflation_factor;
  speed = getRandom(speed - 10, speed + 10);
  return Math.floor(Math.min(metronome_max, Math.max(metronome_min, speed)));
}

function get_enabled_scales(): Array<ScaleType> {
  const checked_boxen = new Set<CheckBoxen>();

  const checkboxen: NodeListOf<HTMLInputElement> =
    document.querySelectorAll('input[type = "checkbox"]');
  checkboxen.forEach((checkbox) => {
    checkbox.checked && checked_boxen.add(checkbox.id as CheckBoxen);
  });

  const options = new Set<ScaleType>();

  checked_boxen.forEach((scalestypes_subset) => {
    scaletype_subsets[scalestypes_subset].forEach((scale_type) => {
      options.add(scale_type);
    });
  });

  return Array.from(options);
}

function choose_random_scale(enabled_scale_types: Array<ScaleType>): Scale {
    const first_note: Note = get_random_note();
    const scale_type: ScaleType = getRandomArrayValue(enabled_scale_types);

    let scale = {
      tonic: first_note,
      mode: scale_type,
    }

    const key_sig = key_signature(scale);
    if (key_sig.sharps > 7 || key_sig.flats > 7) {
      return choose_random_scale(enabled_scale_types); // re-roll
    }

    return scale;
}

function main() {
  const go_button: HTMLElement =
    document.querySelector('#go-button') as HTMLElement;
  go_button.onclick = function () {
    clearStaff();
    let message: string
    const enabled_scales = get_enabled_scales();

    if (enabled_scales.length === 0) {
      message = 'check a box';
    } else {
      const scale = choose_random_scale(enabled_scales);
      const difficulty_input: HTMLInputElement =
        document.querySelector('#difficulty-input') as HTMLInputElement;
      const difficulty = Number(difficulty_input.value);
      const speed: number = selectSpeed(difficulty,
                                        note_difficulty_weight(scale.tonic),
                                        scaleTypes[scale.mode]);
      message = `${render_note(scale.tonic)} ${ScaleType[scale.mode]}, metronome at: ${speed}`;
      const keySignature: KeySig = key_signature(scale);
      console.log("key sig is : " + JSON.stringify(keySignature));

      const staff: HTMLElement =
        document.querySelector('.staff svg') as HTMLElement;
      drawKeySignature(staff, keySignature);
      drawNotes(staff, scale.tonic.letter);
    }
    const scale_flavour: HTMLElement =
      document.querySelector('#scale-flavour') as HTMLElement;
    scale_flavour.textContent = message;
  };
}

function interval_up(note: Note, interval: Interval): Note {
  function next_letter_fn(letter: LetterName): LetterName {
    const letter_name_array = Object.values(LetterName);
    const idx: number = letter_name_array.indexOf(letter);
    return letter_name_array[(idx+1) % 7];
  }

  const next_letter = next_letter_fn(note.letter);

  switch (interval) {
    case Interval.PerfectUnison:
      return note;
    case Interval.MinorSecond:
      if (note.letter === LetterName.E
         || note.letter === LetterName.B) {
        return {
          letter: next_letter,
          sharps: note.sharps
        };
      } else {
        return {
          letter: next_letter,
          sharps: note.sharps - 1,
        };
      }
    case Interval.MajorSecond:
      if (note.letter === LetterName.E
         || note.letter === LetterName.B) {
        return {
          letter: next_letter,
          sharps: note.sharps + 1,
        };
      } else {
        return {
          letter: next_letter,
          sharps: note.sharps,
        };
      }
    case Interval.MinorThird:
      return interval_up(interval_up(note,
               Interval.MajorSecond),
               Interval.MinorSecond);
    case Interval.MajorThird:
      return interval_up(interval_up(note,
               Interval.MajorSecond),
               Interval.MajorSecond);
    case Interval.PerfectFourth:
      return interval_up(interval_up(note,
               Interval.MajorThird),
               Interval.MinorSecond);
    case Interval.PerfectFifth:
      return interval_up(interval_up(note,
               Interval.PerfectFourth),
               Interval.MajorSecond);
    case Interval.MinorSixth:
      return interval_up(interval_up(note,
               Interval.PerfectFifth),
               Interval.MinorSecond);
    case Interval.MajorSixth:
      return interval_up(interval_up(note,
               Interval.PerfectFifth),
               Interval.MajorSecond);
    case Interval.MinorSeventh:
      return interval_up(interval_up(note,
               Interval.MajorSixth),
               Interval.MinorSecond);
    case Interval.MajorSeventh:
      return interval_up(interval_up(note,
               Interval.MajorSixth),
               Interval.MajorSecond);
  }
}


function key_signature(scale: Scale): KeySig {
  function key_signature_ionian(tonic: Note, interval: Interval): KeySig {
    return key_signature({ mode: ScaleType.Ionian,
                           tonic: interval_up(tonic, interval)});
  }

  let key_sig = { sharps: 2, flats: 2 };

  switch (scale.mode) {
    case ScaleType.Ionian:
      key_sig = ionian_signatures(scale.tonic);
      break;

    case ScaleType.Dorian:
      return key_signature_ionian(scale.tonic, Interval.MinorSeventh);
    case ScaleType.Phrygian:
      return key_signature_ionian(scale.tonic, Interval.MinorSixth);
    case ScaleType.Lydian:
      return key_signature_ionian(scale.tonic, Interval.PerfectFifth);
    case ScaleType.Mixolydian:
      return key_signature_ionian(scale.tonic, Interval.PerfectFourth);
    case ScaleType.Aeolian:
      return key_signature_ionian(scale.tonic, Interval.MinorThird);
    case ScaleType.Locrian:
      return key_signature_ionian(scale.tonic, Interval.MinorSecond);

    case ScaleType.MelodicMinor: break;
    case ScaleType.HarmonicMinor: break;
    case ScaleType.DoubleHarmonicMinor: break;

    case ScaleType.MelodicMinorMode2: break;
    case ScaleType.MelodicMinorMode3: break;
    case ScaleType.Homeric: break;
    case ScaleType.MelodicMinorMode5: break;
    case ScaleType.HalfDiminished: break;
    case ScaleType.AlteredDominant: break;

    case ScaleType.HarmonicMinorMode2: break;
    case ScaleType.HarmonicMinorMode3: break;
    case ScaleType.HarmonicMinorMode4: break;
    case ScaleType.HarmonicMinorMode5: break;
    case ScaleType.HarmonicMinorMode6: break;
    case ScaleType.HarmonicMinorMode7: break;

    case ScaleType.DoubleHarmonicMinorMode2: break;
    case ScaleType.DoubleHarmonicMinorMode3: break;
    case ScaleType.DoubleHarmonicMinorMode4: break;
    case ScaleType.DoubleHarmonicMinorMode5: break;
    case ScaleType.DoubleHarmonicMinorMode6: break;
    case ScaleType.DoubleHarmonicMinorMode7: break;

    case ScaleType.Pentatonic: break;
    case ScaleType.WholeTone: break;
    case ScaleType.Chromatic: break;
    case ScaleType.OctatonicDominant: break;
    case ScaleType.OctatonicDiminished: break;
    default:
      // to prevent forgetting any cases
      const exhaustiveCheck: never = scale.mode;
      throw new Error(`Unhandled case: ${exhaustiveCheck}`);

  }
  return key_sig;
}

function drawNotes(staff: HTMLElement, first: LetterName): void {
  let staffNoteheadsCounter = 0;
  const notes =
    ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const lowestNote = 7; // C
  let position = lowestNote + notes.indexOf(first);

  const distanceBetweenStaffLines = 10;

  const lowestCy = 200; // since size of our svg is 200

  for (let highest = position+7 ; position < highest ; position++) {
    const notehead = createElementSVG('ellipse');
    notehead.setAttribute('class', "notehead");

    const cx = 250 + staffNoteheadsCounter * 50;
    notehead.setAttribute('cx', cx.toString()); // distance between notes

    const cy = lowestCy - (distanceBetweenStaffLines * position);
    notehead.setAttribute('cy', cy.toString());
    notehead.setAttribute('rx', '14');
    notehead.setAttribute('ry', '10');

    staff.appendChild(notehead);
    staffNoteheadsCounter++;

    const ledgerLines = [10, 130]; // highest and lowest notes
    if (ledgerLines.includes(cy)) {
      const ledgerLine = createElementSVG('rect');
      ledgerLine.setAttribute('height', '2');
      ledgerLine.setAttribute('width', '44');
      ledgerLine.setAttribute('y', cy.toString());
      ledgerLine.setAttribute('x', (cx - 22).toString());
      ledgerLine.setAttribute('class', "ledger");
      staff.appendChild(ledgerLine);
    }
  }
}

function createElementSVG(shape: string) {
  return document.createElementNS('http://www.w3.org/2000/svg', shape);
}

function clearStaff() {
  document.querySelectorAll('ellipse.notehead').forEach(note => note.remove());
  document.querySelectorAll('rect.ledger').forEach(note => note.remove());

  document.querySelectorAll('path.flat').forEach(flat => flat.remove());
  document.querySelectorAll('path.sharp').forEach(sharp => sharp.remove());
}

function drawKeySignature(staff: HTMLElement, sig: KeySig) {
  how_to_draw_sharps(staff, sig.sharps);
  and_flats(staff, sig.flats);
}

function how_to_draw_sharps(staff: HTMLElement, quantity: number) {
  sharp_sig_positions.slice(0, quantity).forEach((pos, idx) => {
    const sharp = createElementSVG('path');
    sharp.setAttribute('d', SHARP_SVG_PATH);
    sharp.setAttribute('class', 'sharp');
    const sharp_x = 70 + 20*idx;
    const sharp_y = pos;
    sharp.setAttribute('transform', `translate(${sharp_x} , ${sharp_y})`);
    staff.appendChild(sharp);
  });
}

function and_flats(staff: HTMLElement, quantity: number) {
  flat_signature_positions.slice(0, quantity).forEach((pos, idx) => {
    const flat = createElementSVG('path');
    flat.setAttribute('d', FLAT_SVG_PATH);
    flat.setAttribute('class', 'flat');
    const flat_x = 70 + 20*idx;
    const flat_y = pos;
    flat.setAttribute('transform', `translate(${flat_x} , ${flat_y})`);
    staff.appendChild(flat);
  });
}

const flat_signature_positions = [ 83, 53, 93, 63, 103, 73, 113 ];

const sharp_sig_positions = [ 53, 83, 43, 73, 103, 63, 93 ];

const SHARP_SVG_PATH = "M 5.0448 -16.5032 L 5.0448 -27.7928 L 9.8448 -29.1176 L 9.8448 -17.8856 L 5.0448 -16.5032 z M 14.496 -19.2344 L 11.196 -18.2888 L 11.196 -29.5208 L 14.496 -30.4424 L 14.496 -35.108 L 11.196 -34.1864 L 11.196 -45.6626 L 9.8448 -45.6626 L 9.8448 -33.8384 L 5.0448 -32.4584 L 5.0448 -43.6178 L 3.7704 -43.6178 L 3.7704 -32.0336 L 0.4704 -31.1096 L 0.4704 -26.4344 L 3.7704 -27.356 L 3.7704 -16.1456 L 0.4704 -15.2264 L 0.4704 -10.5704 L 3.7704 -11.492 L 3.7704 -0.0806 L 5.0448 -0.0806 L 5.0448 -11.9 L 9.8448 -13.22 L 9.8448 -2.1182 L 11.196 -2.1182 L 11.196 -13.6376 L 14.496 -14.5616 L 14.496 -19.2344 z";

const FLAT_SVG_PATH = "M 10.6178 -15.1513 C 10.6178 -13.2883 9.9194 -11.504 8.0032 -9.1091 C 5.9731 -6.572 4.2642 -5.1199 2.0124 -3.4124 L 2.0124 -14.5325 C 2.5243 -15.8252 3.2792 -16.8718 4.2804 -17.6753 C 5.2783 -18.4756 6.2892 -18.8773 7.313 -18.8773 C 9.0043 -18.8773 10.0768 -17.9183 10.5401 -16.0067 C 10.5919 -15.8512 10.6178 -15.566 10.6178 -15.1513 z M 10.3748 -22.9273 C 8.9784 -22.9273 7.5593 -22.5418 6.1142 -21.7674 C 4.6692 -20.9963 3.3019 -19.9627 2.0124 -18.6764 L 2.0124 -42.2367 L 0.1883 -42.2367 L 0.1883 -1.8831 C 0.1883 -0.7426 0.4993 -0.1724 1.1214 -0.1724 C 1.481 -0.1724 1.9279 -0.4737 2.5956 -0.8722 C 4.4856 -2.0002 5.6637 -2.754 6.9437 -3.5493 C 8.4037 -4.4563 10.0476 -5.5156 12.2216 -7.5892 C 13.7218 -9.0958 14.8072 -10.6153 15.4811 -12.1446 C 16.1518 -13.6771 16.4887 -15.1934 16.4887 -16.7 C 16.4887 -18.9292 15.8958 -20.5135 14.71 -21.4499 C 13.3686 -22.4348 11.9203 -22.9273 10.3748 -22.9273 z";


try {
  window.addEventListener('load', main);
} catch (err) {
//   console.log(err.name + ": " + err.message)
//   console.log('not running in the browser? OK :^)')
}
