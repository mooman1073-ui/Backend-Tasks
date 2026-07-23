// Assignment 1
// Parts 1 and 2

// ============================================================
// PART 1: CODING QUESTIONS
// ============================================================

// Question 1: Convert the string "123" to a number and add 7.
const stringNumber = "123";
const convertedNumber = Number(stringNumber);
console.log("Question 1:", convertedNumber + 7); // 130

// Question 2: Return "Invalid" when the given value is falsy.
function checkValue(value) {
    if (!value) {
        return "Invalid";
    }

    return "Valid";
}

console.log("Question 2:", checkValue(0)); // Invalid

// Question 3: Print the numbers from 1 to 10, skipping even numbers.
console.log("Question 3:");
for (let number = 1; number <= 10; number++) {
    if (number % 2 === 0) {
        continue;
    }

    console.log(number);
}

// Question 4: Return only the even numbers using filter().
const numbersToFilter = [1, 2, 3, 4, 5];
const evenNumbers = numbersToFilter.filter(function (number) {
    return number % 2 === 0;
});

console.log("Question 4:", evenNumbers); // [2, 4]

// Question 5: Merge two arrays using the spread operator.
function mergeArrays(firstArray, secondArray) {
    return [...firstArray, ...secondArray];
}

console.log("Question 5:", mergeArrays([1, 2, 3], [4, 5, 6]));

// Question 6: Return the day of the week that matches a number.
function getDay(number) {
    switch (number) {
        case 1:
            return "Sunday";
        case 2:
            return "Monday";
        case 3:
            return "Tuesday";
        case 4:
            return "Wednesday";
        case 5:
            return "Thursday";
        case 6:
            return "Friday";
        case 7:
            return "Saturday";
        default:
            return "Invalid day number";
    }
}

console.log("Question 6:", getDay(2)); // Monday

// Question 7: Return the length of every string using map().
const strings = ["a", "ab", "abc"];
const stringLengths = strings.map(function (word) {
    return word.length;
});

console.log("Question 7:", stringLengths); // [1, 2, 3]

// Question 8: Check whether a number is divisible by both 3 and 5.
function checkDivisibility(number) {
    if (number % 3 === 0 && number % 5 === 0) {
        return "Divisible by both";
    }

    return "Not divisible by both";
}

console.log("Question 8:", checkDivisibility(15));

// Question 9: Return the square of a number using an arrow function.
const square = (number) => number * number;

console.log("Question 9:", square(5)); // 25

// Question 10: Destructure an object and return a formatted string.
function introducePerson(person) {
    const { name, age } = person;
    return `${name} is ${age} years old`;
}

const personToIntroduce = {
    name: "John",
    age: 25
};

console.log("Question 10:", introducePerson(personToIntroduce));

// Question 11: Accept multiple numbers and return their sum.
function addNumbers(...numbers) {
    let total = 0;

    for (const number of numbers) {
        total += number;
    }

    return total;
}

console.log("Question 11:", addNumbers(1, 2, 3, 4, 5)); // 15

// Question 12: Resolve a Promise after 3 seconds with "Success".
function getSuccessMessage() {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve("Success");
        }, 3000);
    });
}

getSuccessMessage().then(function (message) {
    console.log("Question 12:", message);
});

// Question 13: Find the largest number in an array.
function findLargest(numbers) {
    let largest = numbers[0];

    for (const number of numbers) {
        if (number > largest) {
            largest = number;
        }
    }

    return largest;
}

console.log("Question 13:", findLargest([1, 3, 7, 2, 4])); // 7

// Question 14: Return an array containing only an object's keys.
function getObjectKeys(object) {
    return Object.keys(object);
}

const personWithKeys = {
    name: "John",
    age: 30
};

console.log("Question 14:", getObjectKeys(personWithKeys));

// Question 15: Split a string into words at its spaces.
function splitIntoWords(text) {
    return text.split(" ");
}

console.log("Question 15:", splitIntoWords("The quick brown fox"));

// ============================================================
// PART 2: ESSAY QUESTIONS
// ============================================================

/*
Question 1: What is the difference between forEach and for...of?
When would you use each?

Answer:
forEach runs a function for every item in an array. I use it when I want to
do something with every item, like printing all the items.

for...of is a loop that goes through the items one by one. I use it when I
need more control because I can use break or continue with it.

Example:
const numbers = [1, 2, 3];

numbers.forEach(function (number) {
    console.log(number);
});

for (const number of numbers) {
    if (number === 2) continue;
    console.log(number);
}
*/

/*
Question 2: What are hoisting and the Temporal Dead Zone (TDZ)?

Answer:
Hoisting means JavaScript knows about declarations before it runs the code.
For example, a function declaration can be called before it is written.

The Temporal Dead Zone is the time before a let or const variable is declared.
We cannot use the variable during this time. If we try, JavaScript gives us a
ReferenceError.

Examples:
sayHello(); // This works because the function is hoisted.
function sayHello() {
    console.log("Hello");
}

// console.log(newValue); // ReferenceError: newValue is in the TDZ.
let newValue = 10;
*/

/*
Question 3: What are the main differences between == and ===?

Answer:
== compares the values and may change their types automatically. For example,
5 == "5" is true even though one is a number and one is a string.

=== compares both the value and the type. For example, 5 === "5" is false
because their types are different. It is usually better to use === because
the result is clearer.
*/

/*
Question 4: How does try-catch work, and why is it important in async
operations?

Answer:
We put code that may fail inside try. If an error happens, JavaScript moves
to catch. In catch, we can show an error message instead of letting the whole
program stop.

This is important with async code because an API call, file operation, or
database operation may fail. We can use try-catch with await to handle the
error.

Example:
async function loadData() {
    try {
        const data = await getData();
        console.log(data);
    } catch (error) {
        console.log("Could not load the data:", error.message);
    }
}
*/

/*
Question 5: What is the difference between type conversion and coercion?

Answer:
Type conversion is when I change a value's type myself. For example,
Number("123") changes the string "123" into the number 123.

Type coercion is when JavaScript changes a type automatically. For example,
"5" + 2 gives "52" because JavaScript changes 2 into a string.
*/
