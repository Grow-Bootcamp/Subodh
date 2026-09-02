console.log('1. Start');

setTimeout(() => {
    console.log('2. MacroTask 1')
}, 10000)

Promise.resolve().then(() => {
    console.log('3. MicroTask 1');
}).then(() => {
    console.log('4. MicrosTask 2')
})

console.log('5. End')