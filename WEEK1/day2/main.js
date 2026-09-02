//Topics

let eventLoop = '== Event Loop =='
let hoisting = '== Hoisting =='
let coreMethods = '== Core Data types Methods =='
let timers = '== Timers =='
let promiseAsyncAwait = '== Asynchronous code in JS =='
let asyncTaskEngineCli = '== Async Task Engine Cli =='


const eventLoopDemo = function () {
    console.log(eventLoop)
    console.log('1. Start');

    setTimeout(() => {
        console.log('2. MacroTask 1')
        console.log(eventLoop)
    }, 2000)

    Promise.resolve().then(() => {
        console.log('3. MicroTask 1');
    }).then(() => {
        console.log('4. MicrosTask 2')
    })

    console.log('5. End')

    /*
    == Output ==:
    1. Start
    5. End 
    3. MicroTask 1
    4. MicroTask2
    2. MacroTask1
    
    == Flow order==
    1. Start -- Goes to CallStack for execution
    2. MacroTask1 -- Goes to MacroTask Queue handled by EventLoop first -- Resolves after all other task(CallStack, MicroTask Queue) but first inside MacroTask Queue
    3. MicroTask 1 -- Goes to MicroTask Queue handled by Eventloop first -- Resolves first inside MicroTask Queue -- Resolves after CallStack
    4. MicroTask2 -- Goes to MicroTask Queue handled by Eventloop second -- Resolves second inside MicroTask Queue -- Resolves after CallStack 
    5. End -- Goes to CallStack for execution
    x
    */

}()



const hoistingDemo = function () {
    console.log(hoisting)
    try {
        // Function Declarations are hoisted fully : Outputs 'Hi'
        hi();
        function hi() {
            console.log('Hi: Function')
        }
    } catch (e) {
        console.log(`${e.message}: Function`)
    } finally {
        try {
            // let declarations throw error if acccessed before initialization
            console.log(`${fname}: let`)
            let fname = 'Subodh'
        } catch (e) {
            console.log(`${e.message}: let`)
        } finally {
            try {
                // const declaration throw error if accessed before initialization
                console.log(`${lname}: const`)
                const lname = 'Shah'
            } catch (e) {
                console.log(`${e.message}: const`)
            } finally {
                // var declarations show undefined if accessed before initialization
                console.log(`${age}: var`)
                var age = 21;
            }
        }
    }
    console.log(hoisting)
}()

const coreMethodsDemo = function () {
    console.log(coreMethods)

    // Array: map, filter, reduce, find, indexOf
    let demoArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]

    // Object: keys, values, entries
    let demoObject = {};

    // String: includes, slice, trim, toLowercase
    let demoString = 'Subodh is currently at CloudTech Dhangadhi branch'

    // Number: parseint
    console.log(coreMethods)
}()








