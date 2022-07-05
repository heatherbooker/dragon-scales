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

function interval_up_letter(letter: LetterName, interval: number): LetterName {
  const letter_name_array: LetterName[] = Object.values(LetterName);
  const idx: number = letter_name_array.indexOf(letter);
  return letter_name_array[(idx+interval-1) % 7];
}


function up_fifth(letter: LetterName): LetterName {
  return interval_up_letter(letter, 5)
}

function up_fourth(letter: LetterName): LetterName {
  return interval_up_letter(letter, 4)
}


function ionian_signature(note: Note): KeySig {
  const sig: KeySig = {
      [LetterName.A]: 0,
      [LetterName.B]: 0,
      [LetterName.C]: 0,
      [LetterName.D]: 0,
      [LetterName.E]: 0,
      [LetterName.F]: 0,
      [LetterName.G]: 0,
  }

  // negative sharps implies flats
  const starting_sharps = 7 * note.sharps;
  let sharps = ionian_signatures_for_letter(note.letter) + starting_sharps;

  for (let current_sharp = LetterName.F; sharps > 0; sharps--) {
    sig[current_sharp]++;
    current_sharp = up_fifth(current_sharp);
  }

  for (let current_flat = LetterName.B; sharps < 0; sharps++) {
    sig[current_flat]--;
    current_flat = up_fourth(current_flat);
  }

  return sig;
}


const scale_types_difficulty: {[index in ScaleType]: number} = {
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
  [ScaleType.Simpsons]: 0.5,
  [ScaleType.MelodicMinorMode5]: 0.7,
  [ScaleType.HalfDiminished]: 0.4,
  [ScaleType.AlteredDominant]: 0.4,

  // modes of melodic minor
  [ScaleType.HarmonicMinorMode2]: 0.9,
  [ScaleType.HarmonicMinorMode3]: 0.9,
  [ScaleType.UkrainianDorian]: 0.9,
  [ScaleType.PhrygianDominant]: 0.9,
  [ScaleType.HarmonicMinorMode6]: 0.9,
  [ScaleType.HarmonicMinorMode7]: 0.9,

  [ScaleType.DoubleHarmonicMode2]: 0.9,
  [ScaleType.DoubleHarmonicMode3]: 0.9,
  [ScaleType.HungarianMinor]: 0.9,
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

const scaletype_subsets: {[index in CheckBoxen]: ScaleType[]} = {
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
    ScaleType.Simpsons,
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

function get_random_array_value(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
};

function get_random_note(): Note {
  const note_letter = get_random_array_value(Object.keys(LetterName));
  const note_accidental = Math.floor(3*Math.random()) - 1
                          // integer in [-1, 0, 1]
  return {
    letter: note_letter,
    sharps: note_accidental,
  }
};

function get_random(min: number, max: number) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) {
    num = get_random(min, max); // resample between 0 and 1 if out of range
  }
  else {
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
  }
  return num;
}

function select_speed(levelFactor: number,
                      letterFactor: number,
                      scaleFactor: number): number {
  const metronome_min = 44;
  const metronome_max = 250;
  const inflation_factor = 480; // to make it BIG
  const difficultyLevel = levelFactor * (1 - letterFactor) * (1 - scaleFactor);
  let speed = difficultyLevel * inflation_factor;
  speed = get_random(speed - 10, speed + 10);
  return Math.floor(Math.min(metronome_max, Math.max(metronome_min, speed)));
}

function get_enabled_scales(): ScaleType[] {
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

function choose_random_scale(enabled_scale_types: ScaleType[]): Scale {
    const first_note = get_random_note();
    const scale_type = get_random_array_value(enabled_scale_types);

    let scale = {
      tonic: first_note,
      mode: scale_type,
    }

    // if a scale has double-sharps or double-flats in its key sig,
    // that's a silly scale. roll again.
    const key_sig = key_signature(scale);
    for (let n of Object.values(key_sig)) {
      if (n < -1 || n > 1) {
        return choose_random_scale(enabled_scale_types); // re-roll
      }
    }

    return scale;
}

function main() {
  add_checkbox_savers();
  applySettings();
  const go_button: HTMLElement =
    document.querySelector('#go-button') as HTMLElement;
  go_button.onclick = function () {
    clear_staff();
    let message: string;

    const enabled_scales = get_enabled_scales();

    if (enabled_scales.length === 0) {
      message = 'check a box';
    } else {
      const scale: Scale = choose_random_scale(enabled_scales);
      const difficulty_input: HTMLInputElement =
        document.querySelector('#difficulty-input') as HTMLInputElement;
      const difficulty = Number(difficulty_input.value);
      const speed: number = select_speed(difficulty,
                                         note_difficulty_weight(scale.tonic),
                                         scale_types_difficulty[scale.mode]);
      message = `${render_note(scale.tonic)} ${render_scale_type(scale.mode)}, metronome at: ${speed}`;
      const key_sig: KeySig = key_signature(scale);
      console.log("key sig is : " + JSON.stringify(key_sig));

      const accids: Accidentals = accidentals(scale);

      const staff: HTMLElement =
        document.querySelector('.staff svg') as HTMLElement;
      draw_key_sig(staff, key_sig);
      draw_note_heads(staff, scale.tonic.letter, accids, key_sig);
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

  let not_yet_implemented_key_sig = {
    [LetterName.A]: 0,
    [LetterName.B]: -1,
    [LetterName.C]: 1,
    [LetterName.D]: 0,
    [LetterName.E]: -1,
    [LetterName.F]: 1,
    [LetterName.G]: 0,
  };

  switch (scale.mode) {
    case ScaleType.Ionian:
      return ionian_signature(scale.tonic);
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

    case ScaleType.MelodicMinor:
      return not_yet_implemented_key_sig;

    case ScaleType.HarmonicMinor:
      return key_signature({ tonic: scale.tonic,
                             mode: ScaleType.Aeolian });

    case ScaleType.DoubleHarmonic:
      return not_yet_implemented_key_sig;

    case ScaleType.MelodicMinorMode2:
    case ScaleType.MelodicMinorMode3:
    case ScaleType.Simpsons:
    case ScaleType.MelodicMinorMode5:
    case ScaleType.HalfDiminished:
    case ScaleType.AlteredDominant:
      return not_yet_implemented_key_sig;

    case ScaleType.HarmonicMinorMode2:
    case ScaleType.HarmonicMinorMode3:
    case ScaleType.UkrainianDorian:
    case ScaleType.PhrygianDominant:
    case ScaleType.HarmonicMinorMode6:
    case ScaleType.HarmonicMinorMode7:
      return not_yet_implemented_key_sig;

    case ScaleType.DoubleHarmonicMode2:
    case ScaleType.DoubleHarmonicMode3:
    case ScaleType.HungarianMinor:
    case ScaleType.DoubleHarmonicMode5:
    case ScaleType.DoubleHarmonicMode6:
    case ScaleType.DoubleHarmonicMode7:
      return not_yet_implemented_key_sig;

    case ScaleType.Pentatonic:
    case ScaleType.WholeTone:
    case ScaleType.Chromatic:
    case ScaleType.OctatonicDominant:
    case ScaleType.OctatonicDiminished:
      return not_yet_implemented_key_sig;
  }
}


function accidentals(scale: Scale): Accidentals {
  const all_naturals: Accidentals = {
    [LetterName.A]: 0,
    [LetterName.B]: 0,
    [LetterName.C]: 0,
    [LetterName.D]: 0,
    [LetterName.E]: 0,
    [LetterName.F]: 0,
    [LetterName.G]: 0,
  };

  const not_yet_implemented_accidentals: Accidentals = all_naturals;

  switch (scale.mode) {
    case ScaleType.Ionian:
    case ScaleType.Dorian:
    case ScaleType.Phrygian:
    case ScaleType.Lydian:
    case ScaleType.Mixolydian:
    case ScaleType.Aeolian:
    case ScaleType.Locrian:
      return all_naturals;

    case ScaleType.MelodicMinor:
      return not_yet_implemented_accidentals;
    case ScaleType.HarmonicMinor:
      // has a raised seventh
      const seventh = interval_up_letter(scale.tonic.letter, 7);
      return {... all_naturals, [seventh]: 1};
    case ScaleType.DoubleHarmonic:
      return not_yet_implemented_accidentals;

    case ScaleType.MelodicMinorMode2:
    case ScaleType.MelodicMinorMode3:
    case ScaleType.Simpsons:
    case ScaleType.MelodicMinorMode5:
    case ScaleType.HalfDiminished:
    case ScaleType.AlteredDominant:
      return not_yet_implemented_accidentals;

    case ScaleType.HarmonicMinorMode2:
    case ScaleType.HarmonicMinorMode3:
    case ScaleType.UkrainianDorian:
    case ScaleType.PhrygianDominant:
    case ScaleType.HarmonicMinorMode6:
    case ScaleType.HarmonicMinorMode7:
      return not_yet_implemented_accidentals;

    case ScaleType.DoubleHarmonicMode2:
    case ScaleType.DoubleHarmonicMode3:
    case ScaleType.HungarianMinor:
    case ScaleType.DoubleHarmonicMode5:
    case ScaleType.DoubleHarmonicMode6:
    case ScaleType.DoubleHarmonicMode7:
      return not_yet_implemented_accidentals;

    case ScaleType.Pentatonic:
    case ScaleType.WholeTone:
    case ScaleType.Chromatic:
    case ScaleType.OctatonicDominant:
    case ScaleType.OctatonicDiminished:
      return not_yet_implemented_accidentals;
  }
}


try {
  window.addEventListener('load', main);
} catch (err) {
//   console.log(err.name + ": " + err.message)
//   console.log('not running in the browser? OK :^)')
}
