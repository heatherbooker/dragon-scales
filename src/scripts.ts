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


const scaletype_subsets: {[index in CheckBoxen]: ScaleType[]} = {
  "ionian": [ScaleType.Ionian],
  "melodic-minor": [ScaleType.MelodicMinor],
  "harmonic-minor": [ScaleType.HarmonicMinor],
  "harmonic-major": [ScaleType.HarmonicMajor],
  "double-harmonic": [ScaleType.DoubleHarmonic],

  // various major scales
  "majors": [
    ScaleType.Ionian,
    ScaleType.Lydian,
    ScaleType.Mixolydian,
    ScaleType.Simpsons,
    ScaleType.HarmonicMajor,
    ScaleType.HungarianMajor,
    // ScaleType.RomanianMajor,
  ],

  // various minor scales
  "minors": [
    ScaleType.Aeolian,
    ScaleType.Dorian,
    ScaleType.MelodicMinor,
    ScaleType.HarmonicMinor,
    // FIXME
    // ScaleType.NeapolitanMajor,
    // ScaleType.NeapolitanMinor,
    // ScaleType.HungarianMinor,
  ],

  "dominants": [
    ScaleType.Mixolydian,
    ScaleType.LydianDominant,
    ScaleType.PhrygianDominant,
    ScaleType.AlteredDominant,
    ScaleType.MelodicMinorMode5,
    ScaleType.OctatonicDominant,
  ],

  // modes of ionian
  "modes-ionian": [
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
    ScaleType.SuperLocrian,
  ],

  "modes-harmonic-minor": [
    ScaleType.HarmonicMinor,
    ScaleType.HarmonicMinorMode2,
    ScaleType.HarmonicMinorMode3,
    ScaleType.UkrainianDorian,
    ScaleType.PhrygianDominant,
    ScaleType.HarmonicMinorMode6,
    ScaleType.HarmonicMinorMode7,
  ],

  "modes-harmonic-major": [
    ScaleType.HarmonicMajor,
    ScaleType.HarmonicMajorMode2,
    ScaleType.HarmonicMajorMode3,
    ScaleType.HarmonicMajorMode4,
    ScaleType.HarmonicMajorMode5,
    ScaleType.HarmonicMajorMode6,
    ScaleType.HarmonicMajorMode7,
  ],

  "modes-double-harmonic": [
    ScaleType.DoubleHarmonic,
    ScaleType.DoubleHarmonicMode2,
    ScaleType.DoubleHarmonicMode3,
    ScaleType.HungarianMinor,
    ScaleType.DoubleHarmonicMode5,
    ScaleType.DoubleHarmonicMode6,
    ScaleType.DoubleHarmonicMode7,
  ],

  // others
  "funky": [
    ScaleType.Chromatic,
    ScaleType.OctatonicDominant,
    ScaleType.OctatonicDiminished,
    ScaleType.AlteredDominant,
    ScaleType.LydianDominant,
    ScaleType.Blues,
    ScaleType.Prometheus,
    ScaleType.WholeTone,
    ScaleType.PentatonicMajor,
    ScaleType.PentatonicMinor,
  ],

  "octatonic": [
    ScaleType.OctatonicDominant,
    ScaleType.OctatonicDiminished,
  ],

  "hexatonic": [
    ScaleType.WholeTone,
    ScaleType.Blues,
    ScaleType.MajorBlues,
    ScaleType.Prometheus,
    ScaleType.Petrushka,
    ScaleType.Augmented,
    ScaleType.MajorHexatonic,
    ScaleType.MinorHexatonic,
    ScaleType.TwoSemitoneTritone,
  ],

  "pentatonic": [
    ScaleType.PentatonicMajor,
    ScaleType.PentatonicMinor,
  ],

  // individual funky scales
  "altered-dominant": [ScaleType.AlteredDominant],
  "lydian-dominant": [ScaleType.LydianDominant],
  "chromatic": [ScaleType.Chromatic],
  "oct-dim": [ScaleType.OctatonicDiminished],
  "oct-dom": [ScaleType.OctatonicDominant],
  "whole-tone": [ScaleType.WholeTone],
  "blues": [ScaleType.Blues],
  "major-blues": [ScaleType.MajorBlues],
  "prometheus": [ScaleType.Prometheus],
  "petrushka": [ScaleType.Petrushka],
  "augmented": [ScaleType.Augmented],
  "major-hexatonic": [ScaleType.MajorHexatonic],
  "minor-hexatonic": [ScaleType.MinorHexatonic],
  "two-semitone-tritone": [ScaleType.TwoSemitoneTritone],
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


function get_enabled_scales(): ScaleType[] {
  const checked_boxen = get_checked_boxen();

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

    const key_sig = scale_details(scale).key_sig;
    const total_sharps = key_sig_total(key_sig);

    if (recent(scale)) {
      return choose_random_scale(enabled_scale_types); // re-roll
    }

    const difficulty = get_key_sig_complexity();
    if (total_sharps < -difficulty || total_sharps > difficulty) {
      // FIXME there's gotta be a better way
      return choose_random_scale(enabled_scale_types); // re-roll
    }

    // if a scale has double-sharps or double-flats in its key sig,
    // that's a silly scale. roll again.
    for (let n of Object.values(key_sig)) {
      if (n < -1 || n > 1) {
        return choose_random_scale(enabled_scale_types); // re-roll
      }
    }

    return scale;
}

function key_sig_total(sig: KeySig): number {
  let sum = 0;
  for (let n of Object.values(sig)) {
    sum += n;
  }
  return sum;
}

function main() {
  add_checkbox_savers();
  applySettings();

  const go_button: HTMLElement   = get_html_element('#go-button');
  const back_button: HTMLElement = get_back_button();
  go_button.onclick   = next_scale;
  back_button.onclick = previous_scale;

  next_scale();
  get_back_button().disabled = true;
}

let scale_history: Scale[] = [];
let scale_future : Scale[] = [];

function recent(scale: Scale): boolean {
  const enabled_scales = get_enabled_scales().length;
  const sig_complexity = get_key_sig_complexity();

  const history_length = ((sig_complexity === 0) || (enabled_scales === 0))
    ? Math.max(sig_complexity,enabled_scales)
    : enabled_scales * sig_complexity;

  if (history_length < 2) {
    return false;
  }

  return scale_history
    .slice(-(history_length-1))
    .map((s) => JSON.stringify(s))
    .includes(JSON.stringify(scale));
}

function present(scale: Scale) {
  clear_staff();

  const scale_deets = scale_details(scale);

  const key_sig: KeySig = scale_deets.key_sig;
  const pattern: RelativeNote[] = scale_deets.pattern;

  const staff: HTMLElement = get_html_element('.staff svg');
  draw_key_sig(staff, key_sig);
  draw_scale(staff, scale.tonic.letter, pattern, key_sig);

  const scale_description = get_html_element('#scale-description');
  scale_description.innerHTML = render_scale(scale);
};

function new_random_scale(): Scale | undefined {
  const enabled_scales = get_enabled_scales();

  if (enabled_scales.length === 0) {
    return undefined;
  } else {
    return choose_random_scale(enabled_scales);
  }
}

function next_scale(): void {
  let scale = scale_future.pop();
  if (scale === undefined) {
    scale = new_random_scale();
  }

  if (scale === undefined) {
    const scale_description = get_html_element('#scale-description');
    scale_description.innerHTML = 'check a box';
  } else {
    present(scale);
    get_back_button().disabled = false;
    scale_history.push(scale);
  }
}

function previous_scale(): void {
  const current = scale_history.pop();
  if (current === undefined) {
    console.log("no current scale; this is an invalid state");
    return;
  }

  if (scale_history.length < 2) {
    get_back_button().disabled = true;
  }

  const scale = scale_history.at(-1);
  if (scale === undefined) {
    scale_history.push(current);
    return;
  }

  present(scale);
  scale_future.push(current);
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

function mode_of(mode: ScaleType,
                 tonic: Note,
                 interval: Interval): ScaleDetails {
  let deets = scale_details({ mode: mode,
                              tonic: interval_up(tonic, interval) });
  deets.pattern = cycle_accidentals(deets.pattern,
                                    1 + deets.pattern.length
                                      - interval_size(interval));
  return deets;
}

function cycle_accidentals(pattern: RelativeNote[],
                           times: number): RelativeNote[] {
  if (pattern.length === 0) {
    return [];
  }

  const positions = pattern.map((x) => x.position);
  let sharps = pattern.map((x) => x.accidental);

  for (let i = 0; i < times; i++) {
    // typescript thinks `shift` could return `undefined`
    // (because the array could be empty)
    // but `pattern` has already been checked for emptiness!
    sharps.push(sharps.shift() as number);
  }

  return positions.map((p,i) => ({ position: p, accidental: sharps[i] }) );
}


function key_sig_of(tonic: Note, mode: ScaleType): KeySig {
  return mode_of(mode, tonic, Interval.PerfectUnison).key_sig;
}

function scale_details(scale: Scale): ScaleDetails {
  const not_yet_implemented_key_sig = {
    [LetterName.A]: 0,
    [LetterName.B]: -1,
    [LetterName.C]: 1,
    [LetterName.D]: 0,
    [LetterName.E]: -1,
    [LetterName.F]: 1,
    [LetterName.G]: 0,
  };

  const no_accidentals: RelativeNote[] = [
    { position: 0, accidental: 0 },
    { position: 1, accidental: 0 },
    { position: 2, accidental: 0 },
    { position: 3, accidental: 0 },
    { position: 4, accidental: 0 },
    { position: 5, accidental: 0 },
    { position: 6, accidental: 0 },
  ];

  const not_yet_implemented_pattern: RelativeNote[] = [
    { position: 3, accidental: 0 },
    { position: 4, accidental: 0 },
    { position: 5, accidental: 0 },
  ];

  const not_yet_implemented_scale = {
    key_sig: not_yet_implemented_key_sig,
    pattern: not_yet_implemented_pattern,
  };

  const sharpen = (x: number) => x+1;
  const flatten = (x: number) => x-1;

  function modify_pattern(original: RelativeNote[],
                          position: number,
                          modify: (x: number) => number): RelativeNote[] {
    const index = position - 1;
    const new_pat = [... original];
    new_pat[index].accidental = modify(new_pat[index].accidental);
    return new_pat;
  }

  switch (scale.mode) {
    case ScaleType.Ionian: {
      const sig = ionian_signature(scale.tonic);
      return { key_sig: sig, pattern: no_accidentals };
    }

    case ScaleType.Dorian:
      return mode_of(ScaleType.Ionian, scale.tonic, Interval.MinorSeventh);
    case ScaleType.Phrygian:
      return mode_of(ScaleType.Ionian, scale.tonic, Interval.MinorSixth);
    case ScaleType.Lydian:
      return mode_of(ScaleType.Ionian, scale.tonic, Interval.PerfectFifth);
    case ScaleType.Mixolydian:
      return mode_of(ScaleType.Ionian, scale.tonic, Interval.PerfectFourth);
    case ScaleType.Aeolian:
      return mode_of(ScaleType.Ionian, scale.tonic, Interval.MinorThird);
    case ScaleType.Locrian:
      return mode_of(ScaleType.Ionian, scale.tonic, Interval.MinorSecond);

    case ScaleType.MelodicMinor: {
      // Aeolian with a raised sixth and seventh
      const sig = key_sig_of(scale.tonic, ScaleType.Aeolian);
      const accs = modify_pattern(
        modify_pattern(no_accidentals,
          6, sharpen),
        7, sharpen);
      return { key_sig: sig, pattern: accs };
    }

    case ScaleType.HarmonicMinor: {
      // Aeolian with a raised seventh
      const sig = key_sig_of(scale.tonic, ScaleType.Aeolian);
      const accs = modify_pattern(no_accidentals, 7, sharpen);
      return { key_sig: sig, pattern: accs };
    }

    case ScaleType.HarmonicMajor: {
      // Ionian wih a lowered sixth
      const sig = key_sig_of(scale.tonic, ScaleType.Ionian);
      const accs = modify_pattern(no_accidentals, 6, flatten);
      return { key_sig: sig, pattern: accs };
    }

    case ScaleType.DoubleHarmonic: {
      // harmonic major with a lowered second
      const { key_sig, pattern } =
        scale_details({ tonic: scale.tonic, mode: ScaleType.HarmonicMajor });
      const accs = modify_pattern(pattern, 2, flatten);
      return { key_sig: key_sig, pattern: accs };
    }

    case ScaleType.NeapolitanMajor:
      return not_yet_implemented_scale;
    case ScaleType.NeapolitanMinor:
      return not_yet_implemented_scale;
    case ScaleType.HungarianMajor: {
      // Simpsons with a raised 2
      const sig = key_sig_of(scale.tonic, ScaleType.Simpsons);
      const accs = modify_pattern(no_accidentals, 2, sharpen);
      return { key_sig: sig, pattern: accs };
    }
    case ScaleType.RomanianMajor:
      return not_yet_implemented_scale;

    case ScaleType.MelodicMinorMode2:
      return mode_of(ScaleType.MelodicMinor, scale.tonic,
                     Interval.MinorSeventh);
    case ScaleType.MelodicMinorMode3:
      return mode_of(ScaleType.MelodicMinor, scale.tonic,
                     Interval.MinorSixth);
    case ScaleType.Simpsons: {
      // FIXME should this use a traditional key sig?
      // Lydian with a lowered seventh in the key sig
      const parallel_lydian = key_sig_of(scale.tonic, ScaleType.Lydian);
      const seventh = interval_up_letter(scale.tonic.letter, 7);
      const sig = {... parallel_lydian,
              [seventh]: parallel_lydian[seventh] - 1,
      };
      return { key_sig: sig, pattern: no_accidentals };
    }
    case ScaleType.MelodicMinorMode5:
      return mode_of(ScaleType.MelodicMinor, scale.tonic,
                     Interval.PerfectFourth);
    case ScaleType.HalfDiminished: {
      // for traditional mode rules:
//       return mode_of(ScaleType.MelodicMinor,
//                      scale.tonic,
//                      Interval.MinorThird);
      // has the key sig of its seventh, with a raised 2
      const sig = key_sig_of(interval_up(scale.tonic, Interval.MinorSeventh),
                             ScaleType.MelodicMinor);
      const accs = modify_pattern(no_accidentals, 2, sharpen);
      return { key_sig: sig, pattern: accs };
    }
    case ScaleType.SuperLocrian: {
      // Locrian with a lowered fourth
      const parallel_locrian = key_sig_of(scale.tonic, ScaleType.Locrian);
      const fourth = interval_up_letter(scale.tonic.letter, 4);
      const sig = {... parallel_locrian,
              [fourth]: parallel_locrian[fourth] - 1,
      };
      return { key_sig: sig, pattern: no_accidentals };
    }

    // do this for all of em
    // but actually write a more general form of this
    case ScaleType.HarmonicMinorMode2:
      return mode_of(ScaleType.HarmonicMinor, scale.tonic,
                     Interval.MinorSeventh);
    case ScaleType.HarmonicMinorMode3:
      return mode_of(ScaleType.HarmonicMinor, scale.tonic,
                     Interval.MajorSixth);
    case ScaleType.UkrainianDorian:
      return mode_of(ScaleType.HarmonicMinor, scale.tonic,
                     Interval.PerfectFifth);
    case ScaleType.PhrygianDominant:
      return mode_of(ScaleType.HarmonicMinor, scale.tonic,
                     Interval.PerfectFourth);
    case ScaleType.HarmonicMinorMode6:
      return mode_of(ScaleType.HarmonicMinor, scale.tonic,
                     Interval.MajorThird);
    case ScaleType.HarmonicMinorMode7:
      return mode_of(ScaleType.HarmonicMinor, scale.tonic,
                     Interval.MinorSecond);

    case ScaleType.HarmonicMajorMode2:
      return mode_of(ScaleType.HarmonicMajor, scale.tonic, Interval.MinorSeventh);
    case ScaleType.HarmonicMajorMode3:
      return mode_of(ScaleType.HarmonicMajor, scale.tonic, Interval.MinorSixth);
    case ScaleType.HarmonicMajorMode4:
      return mode_of(ScaleType.HarmonicMajor, scale.tonic, Interval.PerfectFifth);
    case ScaleType.HarmonicMajorMode5:
      return mode_of(ScaleType.HarmonicMajor, scale.tonic, Interval.PerfectFourth);
    case ScaleType.HarmonicMajorMode6:
      return mode_of(ScaleType.HarmonicMajor, scale.tonic, Interval.MajorThird);
    case ScaleType.HarmonicMajorMode7:
      return mode_of(ScaleType.HarmonicMajor, scale.tonic, Interval.MinorSecond);

    case ScaleType.DoubleHarmonicMode2:
      return mode_of(ScaleType.DoubleHarmonic, scale.tonic, Interval.MajorSeventh);
    case ScaleType.DoubleHarmonicMode3:
      return mode_of(ScaleType.DoubleHarmonic, scale.tonic, Interval.MinorSixth);
    case ScaleType.HungarianMinor:
      return mode_of(ScaleType.DoubleHarmonic, scale.tonic, Interval.PerfectFifth);
    case ScaleType.DoubleHarmonicMode5:
      return mode_of(ScaleType.DoubleHarmonic, scale.tonic, Interval.PerfectFourth);
    case ScaleType.DoubleHarmonicMode6:
      return mode_of(ScaleType.DoubleHarmonic, scale.tonic, Interval.MajorThird);
    case ScaleType.DoubleHarmonicMode7:
      return mode_of(ScaleType.DoubleHarmonic, scale.tonic, Interval.MinorSecond);

    case ScaleType.NeapolitanMajorMode2:
    case ScaleType.NeapolitanMajorMode3:
    case ScaleType.NeapolitanMajorMode4:
    case ScaleType.NeapolitanMajorMode5:
    case ScaleType.NeapolitanMajorMode6:
    case ScaleType.NeapolitanMajorMode7:
      return not_yet_implemented_scale;

    case ScaleType.NeapolitanMinorMode2:
    case ScaleType.NeapolitanMinorMode3:
    case ScaleType.NeapolitanMinorMode4:
    case ScaleType.NeapolitanMinorMode5:
    case ScaleType.NeapolitanMinorMode6:
    case ScaleType.NeapolitanMinorMode7:
      return not_yet_implemented_scale;

    case ScaleType.HungarianMajorMode2:
    case ScaleType.HungarianMajorMode3:
    case ScaleType.HungarianMajorMode4:
    case ScaleType.HungarianMajorMode5:
    case ScaleType.HungarianMajorMode6:
    case ScaleType.HungarianMajorMode7:
      return not_yet_implemented_scale;

    case ScaleType.RomanianMajorMode2:
    case ScaleType.RomanianMajorMode3:
    case ScaleType.RomanianMajorMode4:
    case ScaleType.RomanianMajorMode5:
    case ScaleType.RomanianMajorMode6:
    case ScaleType.RomanianMajorMode7:
      return not_yet_implemented_scale;

    case ScaleType.Chromatic:
      return not_yet_implemented_scale;
    case ScaleType.OctatonicDominant: {
      const sig = key_sig_of(scale.tonic, ScaleType.Mixolydian);
      const pat: RelativeNote[] = [
        { position: 0, accidental: 0 },
        { position: 1, accidental: -1 },
        { position: 1, accidental: +1 },
        { position: 2, accidental: 0 },
        { position: 3, accidental: +1 },
        { position: 4, accidental: 0 },
        { position: 5, accidental: 0 },
        { position: 6, accidental: 0 },
      ];

      return { key_sig: sig, pattern: pat };
    }
    case ScaleType.OctatonicDiminished: {
      const sig = key_sig_of(scale.tonic, ScaleType.Ionian);
      const pat: RelativeNote[] = [
        { position: 0, accidental: 0 },
        { position: 1, accidental: 0 },
        { position: 2, accidental: -1 },
        { position: 3, accidental: 0 },
        { position: 4, accidental: -1 },
        { position: 4, accidental: +1 },
        { position: 5, accidental: 0 },
        { position: 6, accidental: 0 },
      ];

      return { key_sig: sig, pattern: pat };
    }
    case ScaleType.AlteredDominant: {
      // C7alt has the key sig of F major
      const sig = key_sig_of(interval_up(scale.tonic, Interval.PerfectFourth),
                             ScaleType.Ionian);
      // has a flat 5, sharp 5, flat 9, sharp 9, without a 4 or 6
      const pat: RelativeNote[] = [
        { position: 0, accidental: 0 },
        { position: 1, accidental: -1 },
        { position: 1, accidental: +1 },
        { position: 2, accidental: 0 },
        { position: 4, accidental: -1 },
        { position: 4, accidental: +1 },
        { position: 6, accidental: 0 },
      ];

      return { key_sig: sig, pattern: pat };
    }
    case ScaleType.LydianDominant: {
      // is a dominant scale with a raised 4
      const sig = key_sig_of(interval_up(scale.tonic, Interval.PerfectFourth),
                             ScaleType.Ionian);
      const accs = modify_pattern(no_accidentals, 4, sharpen);
      return { key_sig: sig, pattern: accs };
    }

    case ScaleType.Blues: {
      const sig = key_sig_of(scale.tonic, ScaleType.Aeolian);
      const pat: RelativeNote[] = [
        { position: 0, accidental: 0 },
        { position: 2, accidental: 0 },
        { position: 3, accidental: 0 },
        { position: 3, accidental: +1 },
        { position: 4, accidental: 0 },
        { position: 6, accidental: 0 },
      ];
      return { key_sig: sig, pattern: pat };
    }
    case ScaleType.MajorBlues:
      const sig = key_sig_of(scale.tonic, ScaleType.Ionian);
      const pat = [
        { position: 0, accidental: 0 },
        { position: 1, accidental: 0 },
        { position: 1, accidental: +1 },
        { position: 2, accidental: 0 },
        { position: 4, accidental: 0 },
        { position: 5, accidental: 0 },
      ];
      return { key_sig: sig, pattern: pat };
    case ScaleType.Prometheus: {
      const sig = key_sig_of(scale.tonic, ScaleType.Ionian);
      const pat: RelativeNote[] = [
        { position: 0, accidental: 0 },
        { position: 1, accidental: 0 },
        { position: 2, accidental: 0 },
        { position: 3, accidental: +1 },
        { position: 5, accidental: 0 },
        { position: 6, accidental: -1 },
      ];
      return { key_sig: sig, pattern: pat };
    }
    case ScaleType.WholeTone: {
      const sig = key_sig_of(scale.tonic, ScaleType.Ionian);
      const pat: RelativeNote[] = [
        { position: 0, accidental: 0 },
        { position: 1, accidental: 0 },
        { position: 2, accidental: 0 },
        { position: 3, accidental: +1 },
        { position: 4, accidental: +1 },
        { position: 5, accidental: +1 },
      ];
      return { key_sig: sig, pattern: pat };
    }
    case ScaleType.MajorHexatonic: {
      // ionian scale without its 7th
      let { key_sig, pattern } = scale_details({ tonic: scale.tonic,
                                                 mode: ScaleType.Ionian });

      pattern.pop(); // remove 7th
      return { key_sig: key_sig, pattern: pattern };
    }
    case ScaleType.MinorHexatonic: {
      // aeolian scale without its 6th
      let { key_sig, pattern } = scale_details({ tonic: scale.tonic,
                                                 mode: ScaleType.Aeolian });

      const seventh = pattern.pop() as RelativeNote; // remove 7th
      pattern.pop(); // remove 6th
      pattern.push(seventh);
      return { key_sig: key_sig, pattern: pattern };
    }
    case ScaleType.Augmented: {
      // FIXME this should arguably have flat 3 instead of sharp 2
      // but "cancel previous accidental" accidentals are not implemented
      const sig = key_sig_of(scale.tonic, ScaleType.Ionian);
      const pat: RelativeNote[] = [
        { position: 0, accidental: 0 },
        { position: 1, accidental: +1 },
        { position: 2, accidental: 0 },
        { position: 4, accidental: 0 },
        { position: 4, accidental: +1 },
        { position: 6, accidental: 0 },
      ];
      return { key_sig: sig, pattern: pat };
    }
    case ScaleType.Petrushka: {
      const sig = key_sig_of(scale.tonic, ScaleType.Simpsons);
      const pat: RelativeNote[] = [
        { position: 0, accidental: 0 },
        { position: 1, accidental: -1 },
        { position: 2, accidental: 0 },
        { position: 3, accidental: 0 },
        { position: 4, accidental: 0 },
        { position: 6, accidental: 0 },
      ];
      return { key_sig: sig, pattern: pat };
    }
    case ScaleType.TwoSemitoneTritone: {
      const sig = key_sig_of(scale.tonic, ScaleType.Ionian);
      const pat = [
        { position: 0, accidental: 0 },
        { position: 0, accidental: +1 },
        { position: 1, accidental: 0 },
        { position: 3, accidental: +1 },
        { position: 4, accidental: 0 },
        { position: 5, accidental: -1 },
      ];
      return { key_sig: sig, pattern: pat };
    }
    case ScaleType.PentatonicMajor:
    case ScaleType.PentatonicMinor:
    case ScaleType.NonatonicBlues:
      return not_yet_implemented_scale;
  }
}

function scale_length(scale: Scale): number {
  switch (scale.mode) {
    case ScaleType.PentatonicMajor:
    case ScaleType.PentatonicMinor:
      return 5;

    case ScaleType.Blues:
    case ScaleType.MajorBlues:
    case ScaleType.Prometheus:
    case ScaleType.WholeTone:
    case ScaleType.MajorHexatonic:
    case ScaleType.MinorHexatonic:
    case ScaleType.Augmented:
    case ScaleType.Petrushka:
    case ScaleType.TwoSemitoneTritone:
      return 6;

    case ScaleType.Ionian:
    case ScaleType.Dorian:
    case ScaleType.Phrygian:
    case ScaleType.Lydian:
    case ScaleType.Mixolydian:
    case ScaleType.Aeolian:
    case ScaleType.Locrian:
    case ScaleType.MelodicMinor:
    case ScaleType.HarmonicMinor:
    case ScaleType.HarmonicMajor:
    case ScaleType.DoubleHarmonic:
    case ScaleType.NeapolitanMajor:
    case ScaleType.NeapolitanMinor:
    case ScaleType.HungarianMajor:
    case ScaleType.RomanianMajor:
    case ScaleType.MelodicMinorMode2:
    case ScaleType.MelodicMinorMode3:
    case ScaleType.Simpsons:
    case ScaleType.MelodicMinorMode5:
    case ScaleType.HalfDiminished:
    case ScaleType.SuperLocrian:
    case ScaleType.HarmonicMinorMode2:
    case ScaleType.HarmonicMinorMode3:
    case ScaleType.UkrainianDorian:
    case ScaleType.PhrygianDominant:
    case ScaleType.HarmonicMinorMode6:
    case ScaleType.HarmonicMinorMode7:
    case ScaleType.HarmonicMajorMode2:
    case ScaleType.HarmonicMajorMode3:
    case ScaleType.HarmonicMajorMode4:
    case ScaleType.HarmonicMajorMode5:
    case ScaleType.HarmonicMajorMode6:
    case ScaleType.HarmonicMajorMode7:
    case ScaleType.DoubleHarmonicMode2:
    case ScaleType.DoubleHarmonicMode3:
    case ScaleType.HungarianMinor:
    case ScaleType.DoubleHarmonicMode5:
    case ScaleType.DoubleHarmonicMode6:
    case ScaleType.DoubleHarmonicMode7:
    case ScaleType.NeapolitanMajorMode2:
    case ScaleType.NeapolitanMajorMode3:
    case ScaleType.NeapolitanMajorMode4:
    case ScaleType.NeapolitanMajorMode5:
    case ScaleType.NeapolitanMajorMode6:
    case ScaleType.NeapolitanMajorMode7:
    case ScaleType.NeapolitanMinorMode2:
    case ScaleType.NeapolitanMinorMode3:
    case ScaleType.NeapolitanMinorMode4:
    case ScaleType.NeapolitanMinorMode5:
    case ScaleType.NeapolitanMinorMode6:
    case ScaleType.NeapolitanMinorMode7:
    case ScaleType.HungarianMajorMode2:
    case ScaleType.HungarianMajorMode3:
    case ScaleType.HungarianMajorMode4:
    case ScaleType.HungarianMajorMode5:
    case ScaleType.HungarianMajorMode6:
    case ScaleType.HungarianMajorMode7:
    case ScaleType.RomanianMajorMode2:
    case ScaleType.RomanianMajorMode3:
    case ScaleType.RomanianMajorMode4:
    case ScaleType.RomanianMajorMode5:
    case ScaleType.RomanianMajorMode6:
    case ScaleType.RomanianMajorMode7:
    case ScaleType.AlteredDominant:
    case ScaleType.LydianDominant:
      return 7;

    case ScaleType.OctatonicDominant:
    case ScaleType.OctatonicDiminished:
      return 8;

    case ScaleType.NonatonicBlues:
      return 9;
    case ScaleType.Chromatic:
      return 12;
  }
}


try {
  window.addEventListener('load', main);
} catch (err) {
//   console.log(err.name + ": " + err.message)
//   console.log('not running in the browser? OK :^)')
}
