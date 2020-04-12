import Context from '../../services/engine/services/Context'
import moment from 'moment'

const blessed = require('blessed')

export default class BlessedScreen extends Context {
    constructor() {
        super()

        this.screen = blessed.screen()
        this.screen.key(['C-c'], () => process.exit(0))

        this.bidsTable = blessed.listtable({
            left: 0,
            width: '50%',
            style: {
                header: {
                    bg: 'green',

                    transparent: true,
                },
            },
        })

        this.asksTable = blessed.listtable({
            left: '50%-2',
            width: '50%',
            style: {
                header: {
                    bg: 'red',
                    transparent: true,
                },
            },
        })

        this.screen.append(this.bidsTable)
        this.screen.append(this.asksTable)

        this.screen.render()
    }
    asksTable = null
    asksData = null
    bidsTable = null
    bidsData = null
    orderBook = null
    screen = null

    processFrame = (frame) => {
        this.bidsData = frame.orderBook.bids.map((bid) => [bid[1], bid[0]])
        this.bidsData.sort(this.sortBids)

        this.asksData = frame.orderBook.asks
        this.asksData.sort(this.sortAsks)

        this.bidsTable.setData([['Quantity', 'Bids'], ...this.bidsData])
        this.asksTable.setData([['Asks', 'Quantity'], ...this.asksData])

        this.screen.render()
    }

    sortBids = (a, b) => b[1] - a[1]
    sortAsks = (a, b) => a[0] - b[0]
}
