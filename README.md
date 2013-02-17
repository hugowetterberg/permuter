# Permuter

Permuter is a small utility for doing permutations between objects and applying rules to the generated permutations. A simple example:

    permuter(
      ["a", "b"],
      [1, 2],
      function(letter, number) {
        console.log(letter.value, number.value);
      }
    )

This produces the following output:

    a 1
    a 2
    b 1
    b 2

## A slightly more advanced example

Here's a slightly more advanced example where we add a blocker function `applySomeReasoning` that only accepts permutations where the `xFactor` is twice the size of `Number`. WE also use a backreference to iterate over the letters of the selected word.

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

The result of this is:

    a a 2 4
    bo b 2 4
    bo o 2 4
    a a 5 10
    bo b 5 10
    bo o 5 10

## A more convoluted example

Here is a more convoluted and silly example where backreferences and block functions also are used. Backreferences are used to include the value of a previously selected item in the permutation set. In the example below we will include ["Cola", "Tonic"] when "beverage" is selected and ["Snickers", "Chips"] when "snack" is selected. Blocker functions are used to exclude certain permutations, if "Simon" is too young to see the movie "Splatter" we'll stop those combinations in `checkAgeLimit`, likewise we don't force people to eat or drink what they really dislike by adding the blocker `checkIntenseDislikes`.

    var lib = {
      permuter: require('permuter')
    }

    var people = {
      "Hugo": {"age":31},
      "Simon": {"age":24, "dislikes":"Tonic"},
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
    );

    console.log("\nAfter a long day the staff collects the following from the floor");
    lib.permuter(salons, function(salon) {
      var trash;
      console.log(salon.key + ":");
      for (trash in salon.value.trash) {
        console.log('\t', trash+':', salon.value.trash[trash]);
      }
    })

The output from this is:

    Hugo goes to Salon 1 and sees Slasher and consume the tasty beverage Cola and will then feel refreshed and leave a mug on the floor
    Hugo goes to Salon 1 and sees Slasher and consume the tasty beverage Tonic and will then feel happy and leave a bottle on the floor
    Hugo goes to Salon 2 and sees Kidpix and consume the tasty beverage Cola and will then feel refreshed and leave a mug on the floor
    Hugo goes to Salon 2 and sees Kidpix and consume the tasty beverage Tonic and will then feel happy and leave a bottle on the floor
    Hugo goes to Salon 1 and sees Slasher and consume the tasty snack Snickers and will then feel sticky and leave a wrapper on the floor
    Hugo goes to Salon 1 and sees Slasher and consume the tasty snack Chips and will then feel thirsty and leave a bag on the floor
    Hugo goes to Salon 2 and sees Kidpix and consume the tasty snack Snickers and will then feel sticky and leave a wrapper on the floor
    Hugo goes to Salon 2 and sees Kidpix and consume the tasty snack Chips and will then feel thirsty and leave a bag on the floor
    Simon goes to Salon 2 and sees Kidpix and consume the tasty beverage Cola and will then feel refreshed and leave a mug on the floor
    Simon goes to Salon 2 and sees Kidpix and consume the tasty snack Snickers and will then feel sticky and leave a wrapper on the floor
    Simon goes to Salon 2 and sees Kidpix and consume the tasty snack Chips and will then feel thirsty and leave a bag on the floor

    After a long day the staff collects the following from the floor
    Salon 1:
      mug: 1
      bottle: 1
      wrapper: 1
      bag: 1
    Salon 2:
      mug: 2
      bottle: 1
      wrapper: 2
      bag: 2

The permuter call with the main data set replaces the following loop:

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
