"use strict";
;
var LetterName;
(function (LetterName) {
    LetterName["A"] = "A";
    LetterName["B"] = "B";
    LetterName["C"] = "C";
    LetterName["D"] = "D";
    LetterName["E"] = "E";
    LetterName["F"] = "F";
    LetterName["G"] = "G";
})(LetterName || (LetterName = {}));
;
var ScaleType;
(function (ScaleType) {
    ScaleType[ScaleType["Ionian"] = 0] = "Ionian";
    ScaleType[ScaleType["MelodicMinor"] = 1] = "MelodicMinor";
    ScaleType[ScaleType["HarmonicMinor"] = 2] = "HarmonicMinor";
    ScaleType[ScaleType["DoubleHarmonic"] = 3] = "DoubleHarmonic";
    // modes of ionian
    ScaleType[ScaleType["Aeolian"] = 4] = "Aeolian";
    ScaleType[ScaleType["Dorian"] = 5] = "Dorian";
    ScaleType[ScaleType["Phrygian"] = 6] = "Phrygian";
    ScaleType[ScaleType["Lydian"] = 7] = "Lydian";
    ScaleType[ScaleType["Mixolydian"] = 8] = "Mixolydian";
    ScaleType[ScaleType["Locrian"] = 9] = "Locrian";
    // modes of melodic minor
    ScaleType[ScaleType["MelodicMinorMode2"] = 10] = "MelodicMinorMode2";
    ScaleType[ScaleType["MelodicMinorMode3"] = 11] = "MelodicMinorMode3";
    ScaleType[ScaleType["Simpsons"] = 12] = "Simpsons";
    ScaleType[ScaleType["MelodicMinorMode5"] = 13] = "MelodicMinorMode5";
    ScaleType[ScaleType["HalfDiminished"] = 14] = "HalfDiminished";
    ScaleType[ScaleType["AlteredDominant"] = 15] = "AlteredDominant";
    // modes of harmonic minor
    ScaleType[ScaleType["HarmonicMinorMode2"] = 16] = "HarmonicMinorMode2";
    ScaleType[ScaleType["HarmonicMinorMode3"] = 17] = "HarmonicMinorMode3";
    ScaleType[ScaleType["UkrainianDorian"] = 18] = "UkrainianDorian";
    ScaleType[ScaleType["PhrygianDominant"] = 19] = "PhrygianDominant";
    ScaleType[ScaleType["HarmonicMinorMode6"] = 20] = "HarmonicMinorMode6";
    ScaleType[ScaleType["HarmonicMinorMode7"] = 21] = "HarmonicMinorMode7";
    // modes of double harmonic scale
    ScaleType[ScaleType["DoubleHarmonicMode2"] = 22] = "DoubleHarmonicMode2";
    ScaleType[ScaleType["DoubleHarmonicMode3"] = 23] = "DoubleHarmonicMode3";
    ScaleType[ScaleType["HungarianMinor"] = 24] = "HungarianMinor";
    ScaleType[ScaleType["DoubleHarmonicMode5"] = 25] = "DoubleHarmonicMode5";
    ScaleType[ScaleType["DoubleHarmonicMode6"] = 26] = "DoubleHarmonicMode6";
    ScaleType[ScaleType["DoubleHarmonicMode7"] = 27] = "DoubleHarmonicMode7";
    // others
    ScaleType[ScaleType["Pentatonic"] = 28] = "Pentatonic";
    ScaleType[ScaleType["WholeTone"] = 29] = "WholeTone";
    ScaleType[ScaleType["Chromatic"] = 30] = "Chromatic";
    ScaleType[ScaleType["OctatonicDominant"] = 31] = "OctatonicDominant";
    ScaleType[ScaleType["OctatonicDiminished"] = 32] = "OctatonicDiminished";
})(ScaleType || (ScaleType = {}));
;
