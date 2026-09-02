let x = 10; // Number
let y = 'Subodh' // String


// Comparison Operators
if (x == y) {
    console.log('Equal');
}

if (x !== y) {
    console.log('Not Equal');
}

function binarySearch(arr, target) {  // Function for Binary Search
    let low = 0;
    let high = arr.length - 1;
    let mid = Math.floor((low + high) / 2)
    if (arr[mid] === target) {
        return mid;
    }

    else if (arr[mid] < target) {
        low = mid + 1;
        return binarySearch(arr.slice(low, high + 1), target);
    }
    else {
        high = mid - 1;
        return binarySearch(arr.slice(low, high + 1), target);
    }
}


const customerDetails = [{ // Array and Object
    name: 'Subodh',
    age: 25,
    city: 'Dhangadhi',
},
{
    name: 'John',
    age: 30,
    city: 'Los Angeles'
},
{
    name: 'Jane',
    age: 28,
    city: 'Chicago'
},
{
    name: 'Bob',
    age: 35,
    city: 'Houston'
},
{
    name: 'Alice',
    age: 22,
    city: 'Phoenix'
}
];


customerDetails.forEach((customer) => { // For Each Loop
    console.log(`Name: ${customer.name}, Age: ${customer.age}, City: ${customer.city}`);
});