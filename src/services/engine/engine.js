import 'source-map-support/register'

import TriangularArbitrage from './services/TriangularArbitrage'
import Binance from './services/Binance'

const binance = new Binance()
const triangularArbitrage = new TriangularArbitrage()

const contexts = [triangularArbitrage]
const exchanges = [binance]
const frames = []

const engine = async () => {
    for (let i = 0; i < exchanges.length; i++) {
        await exchanges[i].getOrderBook({
            baseSymbol: 'USDT',
            quoteSymbol: 'BTC',
        })

        await exchanges[i].getBalances(['BTC', 'USDT'])

        await exchanges[i].createOrder({
            baseSymbol: 'USDT',
            quantity: '55',
            price: '4000',
            quoteSymbol: 'BTC',
            side: 'BUY',
            type: 'LIMIT',
        })
    }
}

/**
 * Get all frames for each context, from each configured exchange
 * TODO: Reduce computational complexity
 */
const getFrames = async () => {
    const frames = []

    exchanges.forEach((exchange) => {
        contexts.forEach((context) => {
            context.frames.forEach((frame) => {
                const baseSymbol = frame.baseSymbol
                const quoteSymbol = frame.quoteSymbol

                const frame = await exchange.getOrderBook({
                    baseSymbol,
                    quoteSymbol,
                })

                /**
                 * Check for uniqueness to ensure fetching each frame at most once
                 */
                if (frames.filter((frame) => {
                    return frame.baseSymbol === baseSymbol && frame.quoteSymbol == quoteSymbol 
                }).length == 0) {
                    frames.push(frame)
                }
            })
        })
    })

    return frames
}

const init = async () => {
    setInterval(engine, 1000)
}

export default init()
