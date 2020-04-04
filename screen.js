/*
 * I've used blessed to create a textbox at the bottom line in the screen.
 * The rest of the screen is the 'body' where your code output will be added.
 * This way, when you type input, your program won't muddle it with output.
 *
 * To try this code:
 * - $ npm install blessed --save
 * - $ node screen.js
 *
 * Key points here are:
 * - Your code should show output using the log function.
 *   Think of this as a console.log drop-in-replacement.
 *   Don't use console.* functions anymore, they'll mess up blessed's screen.
 * - You have to 'focus' the inputBar element for it to receive input.
 *   You can have it always focused, however, but my demonstration shows listening for an enter key press or click on the blue bar to focus it.
 * - If you write code that manipulates the screen, remember to run screen.render() to render your changes.
 */
const moment = require('moment')
const blessed = require('blessed')

var screen = blessed.screen()
const leftScreen = blessed.box({
    top: 0,
    left: 0,
    height: '100%',
    width: '50%',
    keys: false,
    mouse: false,
    alwaysScroll: true,
    scrollable: true,
})

const rightScreen = blessed.textbox({
    top: 0,
    right: 0,
    height: '100%',
    width: '50%',
    keys: false,
    mouse: false,
    alwaysScroll: true,
    scrollable: true,
})

// Add body to blessed screen
screen.append(leftScreen)
screen.append(rightScreen)

// Close the example on Escape, Q, or Ctrl+C
screen.key(['C-c'], (ch, key) => process.exit(0))

const logLeft = (text) => {
    leftScreen.setText(text)
    screen.render()
}
const logRight = (text) => {
    rightScreen.setText(text)
    screen.render()
}

/*
 * Demonstration purposes
 */

var asciichart = require('asciichart')

const drawChart = (scale) => {
    var s0 = new Array(120)
    for (var i = 0; i < s0.length; i++) {
        s0[i] = 15 * Math.sin(i * ((Math.PI * scale) / s0.length))
    }

    return s0
}

logLeft(asciichart.plot(drawChart(Math.random() * 10)))
logRight(asciichart.plot(drawChart(Math.random() * 10)))

// Log example output

setInterval(() => {
    logLeft(asciichart.plot(drawChart(Math.random() * 10)))
    logRight(asciichart.plot(drawChart(Math.random() * 10)))
}, 500)
