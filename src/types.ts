type Note = {
  letter: LetterName,
  sharps: number, // sharps positive, natural zero, flats negative
}


type Scale = {
  tonic: Note,
  mode: ScaleType, // FIXME please rename this
}


type KeySig = {
  // positive means sharps, negative means flats, zero means none/natural
  [LetterName.A]: number,
  [LetterName.B]: number,
  [LetterName.C]: number,
  [LetterName.D]: number,
  [LetterName.E]: number,
  [LetterName.F]: number,
  [LetterName.G]: number,
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


type RelativeNote = {
  position: number,
  accidental: number
}

type ScaleDetails = {
  key_sig: KeySig,
  pattern: RelativeNote[],
}


enum LetterName {
  'A' = 'A',
  'B' = 'B',
  'C' = 'C',
  'D' = 'D',
  'E' = 'E',
  'F' = 'F',
  'G' = 'G',
};

function letter_name_enum(letter: LetterName): number {
  switch (letter) {
    case LetterName.A: return 0;
    case LetterName.B: return 1;
    case LetterName.C: return 2;
    case LetterName.D: return 3;
    case LetterName.E: return 4;
    case LetterName.F: return 5;
    case LetterName.G: return 6;
  }
}


enum ScaleType {
  Ionian,
  MelodicMinor,
  HarmonicMinor,
  HarmonicMajor,
  DoubleHarmonic,
  NeapolitanMajor,
  NeapolitanMinor,
  HungarianMajor,

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
  SuperLocrian,

    // modes of harmonic minor
  HarmonicMinorMode2,
  HarmonicMinorMode3,
  UkrainianDorian,
  PhrygianDominant,
  HarmonicMinorMode6,
  HarmonicMinorMode7,

    // modes of harmonic major
  HarmonicMajorMode2,
  HarmonicMajorMode3,
  HarmonicMajorMode4,
  HarmonicMajorMode5,
  HarmonicMajorMode6,
  HarmonicMajorMode7,


    // modes of double harmonic scale
  DoubleHarmonicMode2,
  DoubleHarmonicMode3,
  HungarianMinor,
  DoubleHarmonicMode5,
  DoubleHarmonicMode6,
  DoubleHarmonicMode7,

    // modes of neapolitan major
  NeapolitanMajorMode2,
  NeapolitanMajorMode3,
  NeapolitanMajorMode4,
  NeapolitanMajorMode5,
  NeapolitanMajorMode6,
  NeapolitanMajorMode7,

    // modes of neapolitan minor
  NeapolitanMinorMode2,
  NeapolitanMinorMode3,
  NeapolitanMinorMode4,
  NeapolitanMinorMode5,
  NeapolitanMinorMode6,
  NeapolitanMinorMode7,
  // modes of hungarian major

  HungarianMajorMode2,
  HungarianMajorMode3,
  HungarianMajorMode4,
  HungarianMajorMode5,
  HungarianMajorMode6,
  HungarianMajorMode7,

    // others
  Chromatic,
  OctatonicDominant,
  OctatonicDiminished,
  AlteredDominant, // enharmonically the same as SuperLocrian,
                   // but with a different key sig and accidentals
  LydianDominant, // enharmonically the same as Simpsons,
                  // but different key sig and accidentals

  Blues,
  Prometheus,
  WholeTone,
  PentatonicMajor,
  PentatonicMinor,
}


const enum CheckBoxen {
  "ionian" = "ionian",
  "melodic-minor" = "melodic-minor",
  "harmonic-minor" = "harmonic-minor",
  "harmonic-major" = "harmonic-major",
  "double-harmonic" = "double-harmonic",
  "majors" = "majors",
  "minors" = "minors",
  "dominants" = "dominants",
  "modes-ionian" = "modes-ionian",
  "memimos" = "memimos", // modes of melodic minor
  "modes-harmonic-minor" = "modes-harmonic-minor",
  "modes-harmonic-major" = "modes-harmonic-major",
  "modes-double-major" = "modes-double-harmonic",
  "chromatic" = "chromatic",
  "octatonic" = "octatonic",
  "altered-dominant" = "altered-dominant",
  "lydian-dominant" = "lydian-dominant",
  "hexatonic" = "hexatonic",
  "whole-tone" = "whole-tone",
  "pentatonic" = "pentatonic",
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

    case ScaleType.HarmonicMajor: return "harmonic major";

    case ScaleType.DoubleHarmonic: return "double harmonic";

    case ScaleType.NeapolitanMajor: return "Neapolitan major";
    case ScaleType.NeapolitanMinor: return "Neapolitan minor";

    case ScaleType.HungarianMajor: return "Hungarian major";


    case ScaleType.MelodicMinorMode2: return "mode 2 of melodic minor";
    case ScaleType.MelodicMinorMode3: return "Lydian augmented";
    case ScaleType.Simpsons: return "acoustic (Simpsons)";
    case ScaleType.MelodicMinorMode5: return "Aeolian dominant";
    case ScaleType.HalfDiminished: return "half-diminished";
    case ScaleType.SuperLocrian: return "super-Locrian";

    case ScaleType.HarmonicMinorMode2: return "mode 2 of harmonic minor";
    case ScaleType.HarmonicMinorMode3: return "mode 3 of harmonic minor";
    case ScaleType.UkrainianDorian: return "Ukrainian Dorian";
    case ScaleType.PhrygianDominant: return "Phrygian dominant";
    case ScaleType.HarmonicMinorMode6: return "mode 6 of harmonic minor";
    case ScaleType.HarmonicMinorMode7: return "mode 7 of harmonic minor";

    case ScaleType.HarmonicMajorMode2: return "mode 2 of harmonic major";
    case ScaleType.HarmonicMajorMode3: return "mode 3 of harmonic major";
    case ScaleType.HarmonicMajorMode4: return "mode 4 of harmonic major";
    case ScaleType.HarmonicMajorMode5: return "mode 5 of harmonic major";
    case ScaleType.HarmonicMajorMode6: return "mode 6 of harmonic major";
    case ScaleType.HarmonicMajorMode7: return "mode 7 of harmonic major";

    case ScaleType.DoubleHarmonicMode2: return "mode 2 of double harmonic";
    case ScaleType.DoubleHarmonicMode3: return "mode 3 of double harmonic";
    case ScaleType.HungarianMinor: return "Hungarian minor";
    case ScaleType.DoubleHarmonicMode5: return "mode 5 of double harmonic";
    case ScaleType.DoubleHarmonicMode6: return "mode 6 of double harmonic";
    case ScaleType.DoubleHarmonicMode7: return "mode 7 of double harmonic";

    case ScaleType.NeapolitanMajorMode2:
      return "mode 2 of Neapolitan major";
    case ScaleType.NeapolitanMajorMode3:
      return "mode 3 of Neapolitan major";
    case ScaleType.NeapolitanMajorMode4:
      return "Lydian minor";
    case ScaleType.NeapolitanMajorMode5:
      return "Locrian major";
    case ScaleType.NeapolitanMajorMode6:
      return "mode 6 of Neapolitan major";
    case ScaleType.NeapolitanMajorMode7:
      return "mode 7 of Neapolitan major";

    case ScaleType.NeapolitanMinorMode2:
      return "mode 2 of Neapolitan minor";
    case ScaleType.NeapolitanMinorMode3:
      return "mode 3 of Neapolitan minor";
    case ScaleType.NeapolitanMinorMode4:
      return "mode 4 of Neapolitan minor";
    case ScaleType.NeapolitanMinorMode5:
      return "mode 5 of Neapolitan minor";
    case ScaleType.NeapolitanMinorMode6:
      return "mode 6 of Neapolitan minor";
    case ScaleType.NeapolitanMinorMode7:
      return "mode 7 of Neapolitan minor";

    case ScaleType.HungarianMajorMode2:
      return "mode 2 of Hungarian minor";
    case ScaleType.HungarianMajorMode3:
      return "mode 3 of Hungarian minor";
    case ScaleType.HungarianMajorMode4:
      return "mode 4 of Hungarian minor";
    case ScaleType.HungarianMajorMode5:
      return "mode 5 of Hungarian minor";
    case ScaleType.HungarianMajorMode6:
      return "mode 6 of Hungarian minor";
    case ScaleType.HungarianMajorMode7:
      return "mode 7 of Hungarian minor";

    case ScaleType.Chromatic: return "chromatic";
    case ScaleType.OctatonicDominant: return "dominant octatonic";
    case ScaleType.OctatonicDiminished: return "diminished octatonic";
    case ScaleType.AlteredDominant: return "altered dominant";
    case ScaleType.LydianDominant: return "Lydian dominant";
    case ScaleType.Blues: return "blues";
    case ScaleType.Prometheus: return "Prometheus";
    case ScaleType.WholeTone: return "whole-tone";
    case ScaleType.PentatonicMajor: return "pentatonic major";
    case ScaleType.PentatonicMinor: return "pentatonic minor";
  }
}
