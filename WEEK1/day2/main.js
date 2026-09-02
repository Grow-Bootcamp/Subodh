//Topics

const eventLoop = '== Event Loop =='
const hoisting = '== Hoisting =='
const coreMethods = '== Core Data types Methods =='
const timers = '== Timers =='
const promiseAsyncAwait = '== Asynchronous code in JS =='
const asyncTaskQueueTitle = '== Async Task Queue =='


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

    // Array: map, filter, reduce, find, join, toString, slice, splice
    let demoArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]


    let arrayMap = demoArray.map((num) => {
        return num * 10
    })
    console.log(arrayMap)

    let arrayFilter = arrayMap.filter(num => {
        return num < 90
    })
    console.log(arrayFilter)

    let arrayReduce = demoArray.reduce((a, c) => {
        return a * c
    }, 1)
    console.log(arrayReduce)

    let arrayFind = demoArray.find((number) => {
        return number * number > 50
    })
    console.log(arrayFind)

    let arrayJoin = demoArray.join("")
    console.log(arrayJoin)

    let arraySlice = demoArray.slice(2, 6)
    console.log(arraySlice)

    let arraySplice = demoArray.splice(5, 2)
    console.log(demoArray + ": Original array after splice")
    console.log(arraySplice + ": Spliced array")


    // Object: keys, values, entries
    let demoObject = {
        fname: 'Subodh',
        lname: 'Shah',
        age: 21,
        address: "Dhangadhi, Kailali",
        contact: {
            ncell: '9824692161',
            ntc: ''
        }
    };

    console.log(Object.keys(demoObject))
    console.log(Object.values(demoObject))
    console.log(Object.entries(demoObject))

    // String: includes, slice, trim, toLowercase, split, toLowerCase, toUpperCase
    let demoString = '   Subodh is currently at CloudTech Dhangadhi branch  '

    console.log(demoString.includes('CloudTech'))
    console.log(demoString.slice(0, 7))
    console.log(demoString.trim())
    console.log(demoString.toLowerCase())
    console.log(demoString.toUpperCase())
    console.log(demoString.split(' '))

    // Number: toString, toFixed, Math.floor, Math.round, Math.random
    let demoNumber = 99.99
    console.log(demoNumber.toString())
    console.log(demoNumber.toFixed(1))
    console.log(Math.floor(demoNumber))
    console.log(Math.round(demoNumber))
    console.log(Math.random())

    console.log(coreMethods)
}()


const timersDemo = function () {
    console.log(timers)
    console.log('Timer start')

    let delay = 3000;
    setTimeout(() => {
        console.log(`Timeout after ${delay}ms`)
    }, delay)

    let count = 0
    let totalIntervalTime = 0
    let intervalId = setInterval(() => {
        count++
        totalIntervalTime += delay
        if (count > 1) {
            clearInterval(intervalId)
            console.log(`Interval stopped after ${totalIntervalTime}: Count = ${count}`)
        }
    }, delay)

    console.log('Timer End - interval runs in background')
}()

const promiseAsyncAwaitDemo = function () {
    console.log(promiseAsyncAwait)
    const fetchData = function (delay, label) {
        return new Promise((resolve) => {
            setTimeout(() => { resolve(`${label} resolves after ${delay}ms`) }, delay)
        })
    }

    fetchData(500, 'Task 1')
        .then((res) => {
            console.log(res)
            return fetchData(800, 'Task 2')
        })
        .then((res) => {
            console.log(res)
        })
        .catch((error) => console.error(`Error: ${error}`))
        .finally(() => {
            console.log('Promise Chain complete')
        })

    const runAsync = async function () {
        let result1 = await fetchData(1000, 'Async Task 1')
        console.log(result1)
        let result2 = await fetchData(1200, 'Async Task 2')
        console.log(result2)
    }
    runAsync();

    console.log(promiseAsyncAwait)
}()

const asyncTaskQueue = function () {
    console.log(asyncTaskQueueTitle)
    const tasks = [
        { name: 'Download file', duration: 2000 },
        { name: 'Process data', duration: 1500 },
        { name: 'Save to DB', duration: 1000 },
        { name: 'Send notification', duration: 800 },
    ]

    const executeTask = (task) {
        return new Promise((resolve) => {
            console.log(`[START] ${task.name}`)
            setTimeout(() => {
                console.log(`[DONE] ${task.name} ${task.duration}ms`)
                resolve(task.name)
            }, task.duration);
        })
    }

    const runQueue = async function () {
        console.log('-- Tasks Queue --')
        let taskQueue = []
        for (const task of tasks) {
            let result = await executeTask(task)
            taskQueue.push(result)
        }
        console.log('-- All Tasks completed --')
        console.log('Results:', taskQueue)

    }
    console.log(asyncTaskQueueTitle)
}()