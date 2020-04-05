var blessed = require('blessed')
const contrib = require('blessed-contrib')
const screen = blessed.screen()

screen.key(['C-c'], (ch, key) => process.exit(0))

const sortBids = (a, b) => b[0] - a[0]

const sortAsks = (a, b) => a[0] - b[0]

const bids = blessed.listtable({
    left: 0,
    width: '50%',
    style: {
        header: {
            bg: 'green',
            transparent: true,
        },
    },
    scrollbar: {
        bg: 'blue',
    },
    scrollable: true,
    alwaysScroll: true,
})

const bidsData = [
    ...[...new Array(100)].map(() =>
        [Math.random(), Math.random()].map((n) => n.toString()),
    ),
].sort(sortBids)

bids.setData([['quantity', 'price'], ...bidsData])

const asks = blessed.listtable({
    left: '50%-2',
    width: '50%',
    style: {
        header: {
            bg: 'red',
            transparent: true,
        },
    },
})

const asksData = [
    ...[...new Array(100)].map(() =>
        [Math.random(), Math.random()].map((n) => n.toString()),
    ),
].sort(sortAsks)

asks.setData([['price', 'quantity'], ...asksData])

screen.append(bids)
screen.append(asks)

screen.render()

// screen.key(['left', 'right', 'up', 'down'], (ch, key) => {
//     switch (key.name) {
//         case 'left':
//             if (cursorX.left > 1) {
//                 cursorX.left--
//             }
//             break
//         case 'right':
//             if (cursorX.left < spark.width - 2) {
//                 cursorX.left++
//             }
//             break
//         case 'up':
//             if (cursorY.top > spark.top + 1) {
//                 cursorY.top--
//             }
//             break
//         case 'down':
//             if (cursorY.top < spark.height - 2) {
//                 cursorY.top++
//             }
//             break
//     }
//     screen.render()
// })

screen.render()
