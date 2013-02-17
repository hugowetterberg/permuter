var lib = {
  permuter: require('./index')
}

var people = {
  "Hugo": {"age":31},
  "Simon": {"age":27, "dislikes":"Tonic"},
}
var snacks = {
  "beverage": {
    "Cola": {"effect":"refreshed", "leftover":"mug"},
    "Tonic": {"effect":"happy", "leftover":"bottle"}
  },
  "snack": {
    "Snickers": {"effect":"sticky", "leftover":"wrapper"},
    "Chips": {"effect":"thirsty", "leftover":"bag"}
  }
}
var salons = {
  "Salon 1": {"movie": "Slasher", "ageLimit": 30},
  "Salon 2": {"movie": "Kidpix", "ageLimit": 10}
}

var thePermuterWay = function() {
  lib.permuter(
    people,
    "snackType", snacks,
    salons,
    function checkAgeLimit(person, snackType, salon) {
      return person.value.age >= salon.value.ageLimit;
    },
    "$snackType",
    function checkIntenseDislikes(person, snackType, salon, snack) {
      return !person.value.dislikes || person.value.dislikes != snack.key;
    },
    function permutationResult(person, snackType, salon, snack) {
      var snackName = snack.key, salonName = salon.key;
      salon = salon.value, snack = snack.value;

      salon.trash = salon.trash || {};
      salon.trash[snack.leftover] = salon.trash[snack.leftover] ?
        salon.trash[snack.leftover] + 1 : 1;

      console.log(person.key, "goes to", salonName ,"and sees", salon.movie, "and consume the tasty", snackType.key, snackName,
        "and will then feel", snack.effect, "and leave a", snack.leftover, "on the floor");
    }
  )
}

// This replaces the following:
var usingLoops = function() {
  var firstname, person, snackType, snackList, salonName, salon,
    snackName, snack;
  for (firstname in people) {
    person = people[firstname];
    for (snackType in snacks) {
      snackList = snacks[snackType];
      for (salonName in salons) {
        salon = salons[salonName];
        if (person.age >= salon.ageLimit) {
          for (snackName in snackList) {
            snack = snackList[snackName];
            if (!person.dislikes || person.dislikes !== snackName) {
              salon.trash = salon.trash || {};
              salon.trash[snack.leftover] = salon.trash[snack.leftover] ?
                salon.trash[snack.leftover] + 1 : 1;

              console.log(firstname, "goes to", salonName ,"and sees", salon.movie, "and consume the tasty", snackType, snackName,
                "and will then feel", snack.effect, "and leave a", snack.leftover, "on the floor");
            }
          }
        }
      }
    }
  }
}

thePermuterWay();
// usingLoops();

console.log("\nAfter a long day the staff collects the following from the floor");
lib.permuter(salons, function(salon) {
  var trash;
  console.log(salon.key + ":");
  for (trash in salon.value.trash) {
    console.log('\t', trash+':', salon.value.trash[trash]);
  }
})
