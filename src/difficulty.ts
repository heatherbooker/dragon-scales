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


const scale_types_difficulty: {[index in ScaleType]: number} = {
  [ScaleType.Ionian]: 0.1,
  [ScaleType.MelodicMinor]: 0.3,
  [ScaleType.HarmonicMinor]: 0.4,
  [ScaleType.HarmonicMajor]: 0.4,
  [ScaleType.DoubleHarmonic]: 0.6,
  [ScaleType.NeapolitanMajor]: 0.7,
  [ScaleType.NeapolitanMinor]: 0.7,
  [ScaleType.HungarianMajor]: 0.7,
  [ScaleType.RomanianMajor]: 0.7,

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
  [ScaleType.SuperLocrian]: 0.4,

  [ScaleType.HarmonicMinorMode2]: 0.9,
  [ScaleType.HarmonicMinorMode3]: 0.9,
  [ScaleType.UkrainianDorian]: 0.9,
  [ScaleType.PhrygianDominant]: 0.9,
  [ScaleType.HarmonicMinorMode6]: 0.9,
  [ScaleType.HarmonicMinorMode7]: 0.9,

  [ScaleType.HarmonicMajorMode2]: 0.9,
  [ScaleType.HarmonicMajorMode3]: 0.9,
  [ScaleType.HarmonicMajorMode4]: 0.9,
  [ScaleType.HarmonicMajorMode5]: 0.9,
  [ScaleType.HarmonicMajorMode6]: 0.9,
  [ScaleType.HarmonicMajorMode7]: 0.9,

  [ScaleType.HarmonicMajorMode2]: 0.9,
  [ScaleType.HarmonicMajorMode3]: 0.9,
  [ScaleType.HarmonicMajorMode4]: 0.9,
  [ScaleType.HarmonicMajorMode5]: 0.9,
  [ScaleType.HarmonicMajorMode6]: 0.9,
  [ScaleType.HarmonicMajorMode7]: 0.9,

  [ScaleType.DoubleHarmonicMode2]: 0.9,
  [ScaleType.DoubleHarmonicMode3]: 0.9,
  [ScaleType.HungarianMinor]: 0.9,
  [ScaleType.DoubleHarmonicMode5]: 0.9,
  [ScaleType.DoubleHarmonicMode6]: 0.9,
  [ScaleType.DoubleHarmonicMode7]: 0.9,

  [ScaleType.NeapolitanMajorMode2]: 0.9,
  [ScaleType.NeapolitanMajorMode3]: 0.9,
  [ScaleType.NeapolitanMajorMode4]: 0.9,
  [ScaleType.NeapolitanMajorMode5]: 0.9,
  [ScaleType.NeapolitanMajorMode6]: 0.9,
  [ScaleType.NeapolitanMajorMode7]: 0.9,

  [ScaleType.NeapolitanMinorMode2]: 0.9,
  [ScaleType.NeapolitanMinorMode3]: 0.9,
  [ScaleType.NeapolitanMinorMode4]: 0.9,
  [ScaleType.NeapolitanMinorMode5]: 0.9,
  [ScaleType.NeapolitanMinorMode6]: 0.9,
  [ScaleType.NeapolitanMinorMode7]: 0.9,

  [ScaleType.HungarianMajorMode2]: 0.9,
  [ScaleType.HungarianMajorMode3]: 0.9,
  [ScaleType.HungarianMajorMode4]: 0.9,
  [ScaleType.HungarianMajorMode5]: 0.9,
  [ScaleType.HungarianMajorMode6]: 0.9,
  [ScaleType.HungarianMajorMode7]: 0.9,

  [ScaleType.RomanianMajorMode2]: 0.9,
  [ScaleType.RomanianMajorMode3]: 0.9,
  [ScaleType.RomanianMajorMode4]: 0.9,
  [ScaleType.RomanianMajorMode5]: 0.9,
  [ScaleType.RomanianMajorMode6]: 0.9,
  [ScaleType.RomanianMajorMode7]: 0.9,

  // others
  [ScaleType.Chromatic]: 0.3,
  [ScaleType.OctatonicDominant]: 0.5,
  [ScaleType.OctatonicDiminished]: 0.6,
  [ScaleType.AlteredDominant]: 0.4,
  [ScaleType.LydianDominant]: 0.4,
  [ScaleType.Blues]: 0.4,
  [ScaleType.MajorBlues]: 0.4,
  [ScaleType.Prometheus]: 0.4,
  [ScaleType.WholeTone]: 0.4,
  [ScaleType.MajorHexatonic]: 0.8,
  [ScaleType.MinorHexatonic]: 0.8,
  [ScaleType.Augmented]: 0.8,
  [ScaleType.Petrushka]: 0.8,
  [ScaleType.TwoSemitoneTritone]: 0.8,
  [ScaleType.PentatonicMajor]: 0.4,
  [ScaleType.PentatonicMinor]: 0.4,
  [ScaleType.NonatonicBlues]: 0.8,

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

