var permuter = require('./index');

permuter(
  ["a", "b"],
  [1, 2],
  function(letter, number) {
    console.log(letter.value, number.value);
  }
)

console.log("\n");

permuter(
  [1, 2, 5, 10], // Number
  [10, 4], // xFactor
  function applySomeReasoning(number, xFactor) {
    return number.value*2 == xFactor.value;
  },
  "words", ["a", "bo"],
  "$words", // Letter
  function(number, xFactor, word, letter) {
    console.log(word.value, letter.value, number.value, xFactor.value);
  }
)
