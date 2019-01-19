import 'source-map-support/register'

import { TriangularArbitrage } from '@tb/contexts'
import * as exchanges from '@tb/exchanges'

import sms from '@tb/sms'

const binance = new exchanges.Binance()
const triangularArbitrage = new TriangularArbitrage()

const contexts = [triangularArbitrage]
const exchangeList = [binance]

sms.sendSms({
    body: `${new Date()} The engine is starting`,
})

const engine = async () => {
    for (let i = 0; i < exchangeList.length; i++) {
        await exchangeList[i].getOrderBook({
            baseSymbol: 'USDT',
            quoteSymbol: 'BTC',
        })

        await exchangeList[i].getBalances(['BTC', 'USDT'])

        await exchangeList[i].createOrder({
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
