import axios, { AxiosInstance } from 'axios'
import crypto from 'crypto'

import Exchange from './Exchange'
import { Candle, OrderBook } from '../types'

// interface BybitOrder {
//     order_id?: string
//     order_link_id?: string
//     side?: string
//     symbol?: string
//     exec_id?: string
//     price?: string
//     order_price?: string
//     order_qty?: string
//     order_type?: string
//     fee_rate?: string
//     exec_price?: string
//     exec_type?: string
//     exec_qty?: string
//     exec_fee?: string
//     exec_value?: string
//     leaves_qty?: string
//     closed_size?: string
//     last_liquidity_ind?: string
//     trade_time?: string
//     trade_time_ms?: string
// }

export default class Bybit extends Exchange {
    constructor() {
        super({
            name: 'bybit',
        })

        this.createHttpClient()
    }

    httpClient: AxiosInstance

    createHttpClient = (): AxiosInstance =>
        (this.httpClient = axios.create({
            baseURL: 'https://api.bybit.com',
            timeout: 50000,
        }))

    getCandles = async ({
        interval,
    }: {
        interval: string
    }): Promise<Candle[]> => {
        const getCandlesResult = 

        const candles: Candle[] = []

        return candles
    }

    getSignature = ({
        apiSecretKey,
        parameters,
    }: {
        apiSecretKey: string
        parameters: { [key: string]: string }
    }): string => {
        let orderedParams = ''

        Object.keys(parameters)
            .sort()
            .forEach(function (key) {
                orderedParams += `${key}=${parameters[key]}&`
            })

        orderedParams = orderedParams.substring(0, orderedParams.length - 1)

        return crypto
            .createHmac('sha256', apiSecretKey)
            .update(orderedParams)
            .digest('hex')
    }

    getOrderBook = async ({
        baseSymbol,
        quoteSymbol,
    }: {
        baseSymbol: string
        quoteSymbol: string
    }): Promise<OrderBook> => {}

    normalizeOrders = (): Transaction[] => []
}
