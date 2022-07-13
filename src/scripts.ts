import { clear_staff, draw_key_sig, draw_note_heads } from './drawing';
import { interval_up_letter, up_fifth, up_fourth, interval_up } from './intervals';
import { Note, Scale, ScaleType, ScaleDetails, CheckBoxen, render_scale_type, Interval, LetterName, KeySig, Accidentals } from './types';
import { scale_types_difficulty, select_speed, note_difficulty_weight } from './difficulty';
import { applySettings, add_checkbox_savers } from './local_storage';

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
    // FIXME
//     ScaleType.PhrygianDominant,
//     ScaleType.AlteredDominant,
//     ScaleType.OctatonicDominant,
  ],

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
    ScaleType.SuperLocrian,
  ],

  // others
  "chromatic": [ScaleType.Chromatic],
  "octatonic": [ScaleType.OctatonicDominant, ScaleType.OctatonicDiminished],
  "altered-dominant": [ScaleType.AlteredDominant],
  "lydian-dominant": [ScaleType.LydianDominant],
  "hexatonic": [
    ScaleType.Blues,
    ScaleType.Prometheus,
    ScaleType.WholeTone,
  ],
  "pentatonic": [
    ScaleType.PentatonicMajor,
    ScaleType.PentatonicMinor,
  ],
  "whole-tone": [ScaleType.WholeTone],
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
    const key_sig = scale_details(scale).key_sig;
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
      message = `${render_note(scale.tonic)} <span id="test-id-scale-mode">${render_scale_type(scale.mode)}</span>, metronome at: ${speed}`;

      const scale_deets = scale_details(scale);

      const key_sig: KeySig = scale_deets.key_sig;
      const accids: Accidentals = scale_deets.accidentals;

      const staff: HTMLElement =
        document.querySelector('.staff svg') as HTMLElement;
      draw_key_sig(staff, key_sig);
      draw_note_heads(staff, scale.tonic.letter, accids, key_sig);
    }
    const scale_flavour: HTMLElement =
      document.querySelector('#scale-flavour') as HTMLElement;
    scale_flavour.innerHTML = message;
  };
}


function scale_details(scale: Scale): ScaleDetails {
  console.log(scale)
  const not_yet_implemented_key_sig = {
    [LetterName.A]: 0,
    [LetterName.B]: -1,
    [LetterName.C]: 1,
    [LetterName.D]: 0,
    [LetterName.E]: -1,
    [LetterName.F]: 1,
    [LetterName.G]: 0,
  };

  const no_accidentals: Accidentals = {
    [LetterName.A]: 0,
    [LetterName.B]: 0,
    [LetterName.C]: 0,
    [LetterName.D]: 0,
    [LetterName.E]: 0,
    [LetterName.F]: 0,
    [LetterName.G]: 0,
  };

  const not_yet_implemented_accidentals: Accidentals = no_accidentals;

  const not_yet_implemented_scale = {
    key_sig: not_yet_implemented_key_sig,
    accidentals: not_yet_implemented_accidentals,
  };

  function deets_equiv(mode: ScaleType, interval: Interval): ScaleDetails {
    return scale_details({ mode: mode,
                           tonic: interval_up(scale.tonic, interval)});
  }

  function key_sig_equiv(mode: ScaleType, interval: Interval): KeySig {
    return deets_equiv(mode, interval).key_sig;
  }


  switch (scale.mode) {
    case ScaleType.Ionian: {
      const sig = ionian_signature(scale.tonic);
      return { key_sig: sig, accidentals: no_accidentals };
    }
    case ScaleType.Dorian: {
      const sig = key_sig_equiv(ScaleType.Ionian, Interval.MinorSeventh);
      return { key_sig: sig, accidentals: no_accidentals };
    }
    case ScaleType.Phrygian: {
      const sig = key_sig_equiv(ScaleType.Ionian, Interval.MinorSixth);
      return { key_sig: sig, accidentals: no_accidentals };
    }
    case ScaleType.Lydian: {
      const sig = key_sig_equiv(ScaleType.Ionian, Interval.PerfectFifth);
      return { key_sig: sig, accidentals: no_accidentals };
    }
    case ScaleType.Mixolydian: {
      const sig = key_sig_equiv(ScaleType.Ionian, Interval.PerfectFourth);
      return { key_sig: sig, accidentals: no_accidentals };
    }
    case ScaleType.Aeolian: {
      const sig = key_sig_equiv(ScaleType.Ionian, Interval.MinorThird);
      return { key_sig: sig, accidentals: no_accidentals };
    }
    case ScaleType.Locrian: {
      const sig = key_sig_equiv(ScaleType.Ionian, Interval.MinorSecond);
      return { key_sig: sig, accidentals: no_accidentals };
    }

    case ScaleType.MelodicMinor: {
      // Aeolian with a raised sixth and seventh
      const sig = key_sig_equiv(ScaleType.Aeolian, Interval.PerfectUnison);
      const sixth = interval_up_letter(scale.tonic.letter, 6);
      const seventh = interval_up_letter(scale.tonic.letter, 7);
      const accs = {... no_accidentals, [sixth]: 1, [seventh]: 1};
      return { key_sig: sig, accidentals: accs };
    }
    case ScaleType.HarmonicMinor: {
      // Aeolian with a raised seventh
      const sig = key_sig_equiv(ScaleType.Aeolian, Interval.PerfectUnison);
      const seventh = interval_up_letter(scale.tonic.letter, 7);
      const accs = {... no_accidentals, [seventh]: 1};
      return { key_sig: sig, accidentals: accs };
    }

    case ScaleType.HarmonicMajor: {
      // Ionian wih a lowered sixth
      const sig = key_sig_equiv(ScaleType.Ionian, Interval.PerfectUnison);
      const sixth = interval_up_letter(scale.tonic.letter, 6);
      const accs = {... no_accidentals, [sixth]: -1};
      return { key_sig: sig, accidentals: accs };
    }

    case ScaleType.DoubleHarmonic: {
      // harmonic major with a lowered second
      const { key_sig, accidentals } = deets_equiv(ScaleType.HarmonicMajor,
                                                   Interval.PerfectUnison);
      const second = interval_up_letter(scale.tonic.letter, 2);
      const accs = {... accidentals, [second]: -1};
      return { key_sig: key_sig, accidentals: accs };
    }

    case ScaleType.NeapolitanMajor:
      return not_yet_implemented_scale;
    case ScaleType.NeapolitanMinor:
      return not_yet_implemented_scale;
    case ScaleType.HungarianMajor: {
      // Simpsons with a raised 2
      const sig = key_sig_equiv(ScaleType.Simpsons, Interval.PerfectUnison);
      const second = interval_up_letter(scale.tonic.letter, 2);
      const accs = {... no_accidentals, [second]: 1};
      return { key_sig: sig, accidentals: accs };
    }

    case ScaleType.MelodicMinorMode2: {
      // has the key sig of its seventh, with a raised 5 and 6
      const sig = key_sig_equiv(ScaleType.MelodicMinor, Interval.MinorSeventh);
      const fifth = interval_up_letter(scale.tonic.letter, 5);
      const sixth = interval_up_letter(scale.tonic.letter, 6);
      const accs = {... no_accidentals, [fifth]: 1, [sixth]: 1};
      return { key_sig: sig, accidentals: accs };
    }
    case ScaleType.MelodicMinorMode3: {
      // Lydian with a raised fifth
      const sig = key_sig_equiv(ScaleType.Lydian, Interval.PerfectUnison);
      const fifth = interval_up_letter(scale.tonic.letter, 5);
      const accs = {... no_accidentals, [fifth]: 1};
      return { key_sig: sig, accidentals: accs };
    }
    case ScaleType.Simpsons: {
      // Lydian with a lowered seventh in the key sig
      const parallel_lydian = key_sig_equiv(ScaleType.Lydian,
                                            Interval.PerfectUnison);
      const seventh = interval_up_letter(scale.tonic.letter, 7);
      const sig = {... parallel_lydian,
              [seventh]: parallel_lydian[seventh] - 1,
      };
      return { key_sig: sig, accidentals: no_accidentals };
    }
    case ScaleType.MelodicMinorMode5: {
      // has the key sig of its fourth, with a raised 2 and 3
      const sig = key_sig_equiv(ScaleType.MelodicMinor,
                                Interval.PerfectFourth);
      const second = interval_up_letter(scale.tonic.letter, 2);
      const third = interval_up_letter(scale.tonic.letter, 3);
      const accs = {... no_accidentals, [second]: 1, [third]: 1};
      return { key_sig: sig, accidentals: accs };
    }
    case ScaleType.HalfDiminished: {
      // has the key sig of its seventh, with a raised 2
      const sig = key_sig_equiv(ScaleType.Aeolian, Interval.MinorSeventh);
      const second = interval_up_letter(scale.tonic.letter, 2);
      const accs = {... no_accidentals, [second]: 1};
      return { key_sig: sig, accidentals: accs };
    }
    case ScaleType.SuperLocrian: {
      // Locrian with a lowered fourth
      const parallel_locrian = key_sig_equiv(ScaleType.Locrian,
                                             Interval.PerfectUnison);
      const fourth = interval_up_letter(scale.tonic.letter, 4);
      const sig = {... parallel_locrian,
              [fourth]: parallel_locrian[fourth] - 1,
      };
      return { key_sig: sig, accidentals: no_accidentals };
    }

    case ScaleType.HarmonicMinorMode2:
    case ScaleType.HarmonicMinorMode3:
    case ScaleType.UkrainianDorian:
    case ScaleType.PhrygianDominant:
    case ScaleType.HarmonicMinorMode6:
    case ScaleType.HarmonicMinorMode7:
      return not_yet_implemented_scale;

    case ScaleType.HarmonicMajorMode2:
    case ScaleType.HarmonicMajorMode3:
    case ScaleType.HarmonicMajorMode4:
    case ScaleType.HarmonicMajorMode5:
    case ScaleType.HarmonicMajorMode6:
    case ScaleType.HarmonicMajorMode7:
      return not_yet_implemented_scale;

    case ScaleType.DoubleHarmonicMode2:
    case ScaleType.DoubleHarmonicMode3:
    case ScaleType.HungarianMinor:
    case ScaleType.DoubleHarmonicMode5:
    case ScaleType.DoubleHarmonicMode6:
    case ScaleType.DoubleHarmonicMode7:
      return not_yet_implemented_scale;

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

    case ScaleType.Chromatic:
    case ScaleType.OctatonicDominant:
    case ScaleType.OctatonicDiminished:
      return not_yet_implemented_scale;
    case ScaleType.AlteredDominant:
      // has a flat 5, sharp 5, flat 9, sharp 9
      return not_yet_implemented_scale;
    case ScaleType.LydianDominant: {
      // is a dominant scale with a raised 4
      const sig = key_sig_equiv(ScaleType.Ionian, Interval.PerfectFourth);
      const fourth = interval_up_letter(scale.tonic.letter, 4);
      const accs = {... no_accidentals, [fourth]: 1};
      return { key_sig: sig, accidentals: accs };
    }
    case ScaleType.Blues:
    case ScaleType.Prometheus:
    case ScaleType.WholeTone:
    case ScaleType.PentatonicMajor:
    case ScaleType.PentatonicMinor:
      return not_yet_implemented_scale;
  }
}


try {
  window.addEventListener('load', main);
} catch (err) {
//   console.log(err.name + ": " + err.message)
//   console.log('not running in the browser? OK :^)')
}
