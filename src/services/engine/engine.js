import 'source-map-support/register'

import EventEmitter from 'events'

import Binance from './services/Binance'

const emitter = new EventEmitter()

// TODO: Implement a solutiont that fetches all configured exchanges dynamically
const binance = new Binance()

const exchanges = [binance]

const engine = async () => {
    for (let i = 0; i < exchanges.length; i++) {
        const result = await exchanges[i].getOrderBook({
            baseSymbol: 'USDT',
            quoteSymbol: 'BTC',
        })

        await exchanges[i].getBalances(['BTC', 'USDT'])
    }
}

const init = async () => {
    setInterval(engine, 1000)
}

export default init()