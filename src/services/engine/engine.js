import 'source-map-support/register'

import AlertContext from './services/AlertContext'
import BlessedScreenContext from '../../contexts/BlessedScreenContext'
// import TriangularArbitrage from './services/TriangularArbitrage'
import Binance from './services/Binance'

// import sms from '../sms'

const binance = new Binance()
// const triangularArbitrage = new TriangularArbitrage()
const alertContext = new AlertContext()
const blessedScreenContext = new BlessedScreenContext()

const contexts = [alertContext, blessedScreenContext]
const exchanges = [binance]

const engine = async () => {
    for (const exchange of exchanges) {
        const orderBook = await exchange.getOrderBook({
            baseSymbol: 'USDT',
            quoteSymbol: 'BTC',
        })

        const balances = await exchange.getBalances(['BTC', 'USDT'])

        const frame = {
            balances,
            orderBook,
        }

        // every context gets the frame
        for (const context of contexts) {
            context.processFrame(frame)
        }
    }
}

const init = async () => {
    setInterval(engine, 1000)
}

export default init()
