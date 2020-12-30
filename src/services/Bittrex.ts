/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios, { AxiosInstance } from 'axios'
import { Balance, OrderBook } from '../types'

import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import Exchange from './Exchange'

export default class Bittrex extends Exchange {
    constructor() {
        super({
            name: 'bittrex',
        })

        this.createV1_1HttpClient()
    }

    apiKey = process.env.BITTREX_API_KEY
    apiSecretKey = process.env.BITTREX_SECRET_KEY

    asyncIterator = null

    exchangeInfo = null

    v1HttpClient: AxiosInstance
    v3HttpClient: AxiosInstance

    requestLimit = null
    orderLimit = null

    // getOrder = async ({
    //     baseSymbol,
    //     newClientOrderId,
    //     orderId,
    //     origClientOrderId,
    //     quoteSymbol,
    // }) => {
    //     try {
    //         symbol: `${quoteSymbol}${baseSymbol}`

    //         const timestamp = new Date().getTime()

    //         const totalParams = `timestamp=${timestamp}`

    //         const order = (await this.v3HttpClient.get(`/order${totalParams}`, {
    //             headers: {
    //                 'X-MBX-APIKEY': this.apiKey,
    //             },
    //             params: {
    //                 symbol: `${quoteSymbol}${baseSymbol}`,
    //             },
    //         })).data
    //     } catch(err) {
    //         console.error(err)
    //     }
    // }

    createOrder = async ({
        baseSymbol,
        price,
        quantity,
        quoteSymbol,
        side,
        type,
    }: {
        baseSymbol: string
        price: string
        quantity: string
        quoteSymbol: string
        side: string
        type: string
    }) => {
        try {
            const newClientOrderId = uuidv4()
            const symbol = `${quoteSymbol}${baseSymbol}`
            const timestamp = new Date().getTime()

            const totalParams = `newClientOrderId=${newClientOrderId}&symbol=${symbol}&side=${side}&type=${type}&timeInForce=FOK&quantity=${quantity}&price=${price}&timestamp=${timestamp}`
            const signature = this.hmacSha256(totalParams)

            console.info(
                `${new Date().toISOString()} | submitting order | ${newClientOrderId} ${type} ${side} ${quantity} ${quoteSymbol} @${price}`,
            )

            const result = (
                await this.v3HttpClient(
                    `/order/test?${totalParams}&signature=${signature}`,
                    {
                        headers: {
                            'X-MBX-APIKEY': this.apiKey,
                        },
                        method: 'POST',
                    },
                )
            ).data

            return result
        } catch (err) {
            console.error(err)
        }
    }

    createV1_1HttpClient = () => {
        console.log(`Initializing ${this.name} v1 client...`)
        this.v1HttpClient = axios.create({
            baseURL: 'https://bittrex.com/api/v1.1',
            timeout: 5000,
        })
    }

    getBalances = async (keys: string[]) => {
        try {
            const timestamp = new Date().getTime()
            const totalParams = `timestamp=${timestamp}`

            const { balances } = (
                await this.v3HttpClient.get(`/account?${totalParams}`, {
                    headers: {
                        'X-MBX-APIKEY': this.apiKey,
                    },
                    params: {
                        signature: this.hmacSha256(totalParams),
                    },
                })
            ).data

            const filteredBalances = balances.filter((balance: Balance) =>
                keys.includes(balance.asset),
            )

            return filteredBalances
        } catch (err) {
            console.error(err)
        }
    }

    getExchangeInfo = async () => {
        try {
            const info = (await this.v1HttpClient.get('/exchangeInfo')).data
            console.log('rateLimits', info.rateLimits)
        } catch (err) {
            console.error(err)
        }
    }

    getOrderBook = async ({
        baseSymbol,
        quoteSymbol,
    }: {
        baseSymbol: string
        quoteSymbol: string
    }): Promise<OrderBook> => {
        try {
            const result = (
                await this.v1HttpClient.get('/public/getorderbook', {
                    params: {
                        market: `${baseSymbol}-${quoteSymbol}`,
                        type: 'both',
                    },
                })
            ).data

            console.log(
                `${new Date().toISOString()} | ${
                    this.name
                } | orderbook info   | Bid: ${result.bids[0][0]} Ask: ${
                    result.asks[0][0]
                }`,
            )

            return result
        } catch (err) {
            throw err
        }
    }

    hmacSha256 = (message: string) =>
        crypto
            .createHmac('sha256', this.apiSecretKey ?? '')
            .update(message)
            .digest()
            .toString('hex')

    rateLimitOrders = () => {}

    rateLimitRequests = () => {}

    resyncOrderBook = async () => {}

    subscribeOrderBook = async () => {}

    updateOrderBook = async ({
        baseSymbol,
        quoteSymbol,
    }: {
        baseSymbol: string
        quoteSymbol: string
    }): Promise<OrderBook> => ({
        bids: [],
        asks: [],
    })
}
