import 'source-map-support/register'

import TriangularArbitrage from './services/TriangularArbitrage'
import Binance from './services/Binance'

import sms from '../sms'

const binance = new Binance()
const triangularArbitrage = new TriangularArbitrage()

const contexts = [triangularArbitrage]
const exchanges = [binance]

sms.sendSms({
    body: `${new Date()} The engine is starting`,
})

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

const init = async () => {
    setInterval(engine, 1000)
}

export default init()
