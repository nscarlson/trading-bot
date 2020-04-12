import WebSocket from 'ws'

// import AlertContext from './services/AlertContext'
import BlessedScreenContext from '../../contexts/BlessedScreenContext'
// import TriangularArbitrage from './services/TriangularArbitrage'
import Binance from './services/Binance'

// import sms from '../sms'

const binance = new Binance()
// const triangularArbitrage = new TriangularArbitrage()
// const alertContext = new AlertContext()
const blessedScreenContext = new BlessedScreenContext()

// const contexts = [alertContext]
// const exchanges = [binance]

// const engine = async () => {
//     for (const exchange of exchanges) {
//         const orderBook = await exchange.getOrderBook({
//             baseSymbol: 'USDT',
//             quoteSymbol: 'BTC',
//         })

//         const balances = await exchange.getBalances(['BTC', 'USDT'])

//         const frame = {
//             balances,
//             orderBook,
//         }

//         // every context gets the frame
//         // for (const context of contexts) {
//         //     context.processFrame(frame)
//         // }
//     }
// }

const init = async () => {
    // TODO: manage websockets dynamically elsewhere
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusd@depth')

    ws.on('open', () =>
        ws.send(
            JSON.stringify({
                method: 'SUBSCRIBE',
                params: ['btcusdt@depth'],
                id: 312,
            }),
        ),
    )
    ws.on('message', async (data) => {
        // console.log('data:', JSON.stringify(JSON.parse(data), null, 4))
        // console.log(JSON.stringify(JSON.parse(data), null, 4)),

        const parsedData = JSON.parse(data)

        await binance.getOrderBook({
            baseSymbol: 'USDT',
            quoteSymbol: 'BTC',
        })

        const updatedOrderBook = await binance.updateOrderBook({
            baseSymbol: 'USDT',
            quoteSymbol: 'BTC',
            newAsks: parsedData.a,
            newBids: parsedData.b,
        })

        blessedScreenContext.processFrame({ orderBook: updatedOrderBook })

        // console.log(updatedOrderBook.asks.slice(0, 10))
        // console.log(updatedOrderBook.bids.slice(0, 10))
        // console.log()
    })
    ws.on('error', (err) => console.log(err))

    // setInterval(engine, 1000)
}

export default init()
