import { OrderBook } from '../types'

export default abstract class Exchange {
    constructor({ name }: { name: string }) {
        this.name = name
    }

    name: string
    orderBook: OrderBook

    public abstract getOrderBook({
        baseSymbol,
        quoteSymbol,
    }: {
        baseSymbol: string
        quoteSymbol: string
    }): Promise<OrderBook>

    public abstract updateOrderBook({
        baseSymbol,
        quoteSymbol,
    }: {
        baseSymbol: string
        quoteSymbol: string
    }): Promise<OrderBook>

    public abstract resyncOrderBook({
        baseSymbol,
        quoteSymbol,
    }: {
        baseSymbol: string
        quoteSymbol: string
    }): Promise<void>

    public abstract subscribeOrderBook(
        baseSymbol: string,
        quoteSymbol: string,
        callback: (arg: unknown) => void,
    ): Promise<void>
}
