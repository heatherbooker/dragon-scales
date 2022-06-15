type Note = {
  letter: LetterName,
  sharps: number, // sharps positive, natural zero, flats negative
}


type Scale = {
  tonic: Note,
  mode: ScaleType,
}


type KeySig = { sharps: number, flats: number }


type Accidentals = [ number, number, number, number, number, number, number ]


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
  Simpsons,
  MelodicMinorMode5,
  HalfDiminished,
  AlteredDominant,

    // modes of harmonic minor
  HarmonicMinorMode2,
  HarmonicMinorMode3,
  UkrainianDorian,
  PhrygianDominant,
  HarmonicMinorMode6,
  HarmonicMinorMode7,

    // modes of double harmonic scale
  DoubleHarmonicMode2,
  DoubleHarmonicMode3,
  HungarianMinor,
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

