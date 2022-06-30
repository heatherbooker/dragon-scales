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

interface Settings {
  checkboxen: string[];
}

function render_scale_type(scale: ScaleType): string {
  switch (scale) {
    case ScaleType.Ionian: return "Ionian";
    case ScaleType.Dorian: return "Dorian";
    case ScaleType.Phrygian: return "Phrygian";
    case ScaleType.Lydian: return "Lydian";
    case ScaleType.Mixolydian: return "Mixolydian";
    case ScaleType.Aeolian: return "Aeolian";
    case ScaleType.Locrian: return "Locrian";

    case ScaleType.MelodicMinor: return "melodic minor";

    case ScaleType.HarmonicMinor: return "harmonic minor";

    case ScaleType.DoubleHarmonic: return "double harmonic minor";

    case ScaleType.MelodicMinorMode2: return "mode 2 of melodic minor";
    case ScaleType.MelodicMinorMode3: return "mode 3 of melodic minor";
    case ScaleType.Simpsons: return "acoustic (Simpsons)";
    case ScaleType.MelodicMinorMode5: return "mode 5 of melodic minor";
    case ScaleType.HalfDiminished: return "half-diminished";
    case ScaleType.AlteredDominant: return "altered dominant";

    case ScaleType.HarmonicMinorMode2: return "mode 2 of harmonic minor";
    case ScaleType.HarmonicMinorMode3: return "mode 3 of harmonic minor";
    case ScaleType.UkrainianDorian: return "Ukrainian Dorian";
    case ScaleType.PhrygianDominant: return "Phrygian dominant";
    case ScaleType.HarmonicMinorMode6: return "mode 6 of harmonic minor";
    case ScaleType.HarmonicMinorMode7: return "mode 7 of harmonic minor";

    case ScaleType.DoubleHarmonicMode2: return "mode 2 of double harmonic minor";
    case ScaleType.DoubleHarmonicMode3: return "mode 3 of double harmonic minor";
    case ScaleType.HungarianMinor: return "Hungarian minor";
    case ScaleType.DoubleHarmonicMode5: return "mode 5 of double harmonic minor";
    case ScaleType.DoubleHarmonicMode6: return "mode 6 of double harmonic minor";
    case ScaleType.DoubleHarmonicMode7: return "mode 7 of double harmonic minor";

    case ScaleType.Pentatonic: return "pentatonic";
    case ScaleType.WholeTone: return "whole-tone";
    case ScaleType.Chromatic: return "chromatic";
    case ScaleType.OctatonicDominant: return "dominant octatonic";
    case ScaleType.OctatonicDiminished: return "diminished octatonic";
  }
}
