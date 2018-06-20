import axios from 'axios'
import crypto from 'crypto'
import moment from 'moment'
import querystring from 'querystring'

import Exchange from '../Exchange'

class Binance extends Exchange {
    constructor () {
        super()
        this.createV1HttpClient()
        this.createV3HttpClient()
    }

    apiKey = process.env.BINANCE_API_KEY
    apiSecretKey = process.env.BINANCE_SECRET_KEY


    v1HttpClient = null
    v3HttpClient = null

    createV1HttpClient = async () => {
        console.log('Initializing Binance connection...')
        this.v1HttpClient = axios.create({
            baseURL: 'https://api.binance.com/api/v1',
            timeout: 5000,
        })
    }

    createV3HttpClient = async () => {

        console.log('apiKey:', this.apiKey)

        console.log('Initializing Binance connection...')
        this.v3HttpClient = axios.create({
            baseURL: 'https://api.binance.com/api/v3',
            timeout: 5000,
        })
    }

    getBalances = async (keys) => {
        try {
            const timestamp = new Date().getTime()

            const totalParams = `https://api.binance.com/api/v3/account?timestamp=${timestamp}`
    
            const balances = (await this.v3HttpClient.get(`/account?timestamp=${timestamp}`, {
                headers: {
                    'X-MBX-APIKEY': this.apiKey,
                },
                params: {
                    signature: this.hmacSha256(`timestamp=${timestamp}`),
                },
            })).data.balances

            const filteredBalances = balances.filter((balance) => keys.includes(balance.asset))
    
            console.log(filteredBalances)
            return filteredBalances
        } catch(err) {
            console.error(err)
        }
    }

    getOrderBook = async ({
        baseSymbol,
        limit = 1000,
        quoteSymbol,
    }) => {
        try {
            const result = (await this.v1HttpClient.get('/depth', {
                params: {
                    symbol: `${quoteSymbol}${baseSymbol}`,
                    limit,
                }
            })).data

            console.log(`${moment().format()} | Bid: ${result.bids[0][0]} Ask: ${result.asks[0][0]}`)
        } catch(err) {
            console.error(err)
        }
    }

    submitOrder = async ({
        baseSymbol,
        price,
        quantity,
        quoteSymbol,
        recvWindow,
        side,
        timeInForce,
        timestamp,
        type,
    }) => await this.httpClient.post('order', {
        headers: {
            'X-MBX-APIKEY': signPayload('')
        }
    })

    hmacSha256 = (message) => crypto.createHmac('sha256', this.apiSecretKey)
            .update(message)
            .digest()
            .toString('hex')
}

export default Binance