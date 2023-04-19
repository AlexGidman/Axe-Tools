/*
 * This code is based on https://github.com/dana-ross/flesch-kincaid by Dana Ross, which is in turn based on a Java port of Perl's Lingua::EN::Syllables.
 */

const syllables = (inputString: string) => {
  if (!inputString) {
    return 0;
  }
  /*
   * basic algortithm: each vowel-group indicates a syllable, except for: final
   * (silent) e 'ia' ind two syl @AddSyl and @SubSyl list regexps to massage the
   * basic count. Each match from @AddSyl adds 1 to the basic count, each
   * @SubSyl match -1 Keep in mind that when the regexps are checked, any final
   * 'e' will have been removed, and all '\'' will have been removed.
   */
  const subSyl = [
    /cial/,
    /tia/,
    /cius/,
    /cious/,
    /giu/, // belgium!
    /ion/,
    /iou/,
    /sia$/,
    /.ely$/, // absolutely! (but not ely!)
    /sed$/,
  ];

  const addSyl = [
    /ia/,
    /riet/,
    /dien/,
    /iu/,
    /io/,
    /ii/,
    /[aeiouym]bl$/, // -Vble, plus -mble
    /[aeiou]{3}/, // agreeable
    /^mc/,
    /ism$/, // -isms
    /([^aeiouy])\1l$/, // middle twiddle battle bottle, etc.
    /[^l]lien/, // // alien, salient [1]
    /^coa[dglx]./, // [2]
    /[^gq]ua[^auieo]/, // i think this fixes more than it breaks
    /dnt$/,
  ];

  // (comments refer to titan's /usr/dict/words)
  // [1] alien, salient, but not lien or ebbullient...
  // (those are the only 2 exceptions i found, there may be others)
  // [2] exception for 7 words:
  // coadjutor coagulable coagulate coalesce coalescent coalition coaxial

  const xx = inputString.toLowerCase().replace(/'/g, "").replace(/e\b/g, "");
  if (xx.length === 1) {
    return 1;
  }
  var scrugg = xx.split(/[^aeiouy]+/).filter(Boolean); // '-' should be perhaps added?

  return (
    subSyl
      .map(function (r) {
        return (xx.match(r) || []).length;
      })
      .reduce(function (a, b) {
        return a - b;
      }) +
    addSyl
      .map(function (r) {
        return (xx.match(r) || []).length;
      })
      .reduce(function (a, b) {
        return a + b;
      }) +
    scrugg.length -
    (scrugg.length > 0 && "" === scrugg[0] ? 1 : 0) +
    // got no vowels? ("the", "crwth")
    xx
      .split(/\b/)
      .map(function (x) {
        return x.trim();
      })
      .filter(Boolean)
      .filter(function (x) {
        return !x.match(/[.,'!?]/g);
      })
      .map(function (x) {
        return x.match(/[aeiouy]/) ? 0 : 1;
      })
      // @ts-ignore
      .reduce((a, b) => {
        return a + b;
      })
  );
};

const words = function words(inputString: string) {
  return (inputString.split(/\s+/) || [""]).length;
};
const sentences = function sentences(inputString: string) {
  const re = /[.!?]/;
  return (inputString.split(re) || [""]).length; // check for other punctuation ? !
};
const syllablesPerWord = function syllablesPerWord(inputString: string) {
  return syllables(inputString) / words(inputString);
};
const wordsPerSentence = function wordsPerSentence(inputString: string) {
  return words(inputString) / sentences(inputString);
};

const rate = function rate(inputString: string) {
  return (
    206.835 -
    1.015 * wordsPerSentence(inputString) -
    84.6 * syllablesPerWord(inputString)
  );
};

const grade = function grade(inputString: string) {
  return (
    0.39 * wordsPerSentence(inputString) +
    11.8 * syllablesPerWord(inputString) -
    15.59
  );
};

const convertRawGrade = (rawGrade: number) => {
  let result: string;
  switch (true) {
    case rawGrade < 6:
      result = "5th grade or lower: 'Very easy to read'";
      break;
    case rawGrade >= 6 && rawGrade < 7:
      result = "6th grade: 'Easy to read'";
      break;
    case rawGrade >= 7 && rawGrade < 8:
      result = "7th grade: 'Fairly easy to read'";
      break;
    case rawGrade >= 8 && rawGrade < 10:
      result = "8-9th grade: 'Conversational English'";
      break;
    case rawGrade >= 10 && rawGrade < 13:
      result = "10-12th grade: 'Fairly difficult to read'";
      break;
    case rawGrade >= 13 && rawGrade < 16:
      result = "Undergraduate: 'Difficult to read'";
      break;
    case rawGrade >= 16 && rawGrade < 18:
      result = "Postgraduate: 'Very difficult to read'";
      break;
    case rawGrade >= 18:
      result = "Professional: 'Very difficult to read'";
      break;
    default:
      result = "Invalid grade provided";
  }
  return result;
};

export {
  words,
  sentences,
  syllables,
  syllablesPerWord,
  wordsPerSentence,
  rate,
  grade,
  convertRawGrade,
};
