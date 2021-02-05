export interface Balance {
    asset: string
}

export interface Candle {
    s: string // symbol
    t: string // timestamp interval opened
    o: string // open
    h: string // high
    l: string // low
    c: string // close
    v: string // volume in interval
}

export enum OrderType {
    Market = 'MARKET',
}

export interface Order {
    price: string
    quantity: string
    side: string
    timeInForce: number
    type: number
}

export interface OrderBook {
    asks: string[][]
    bids: string[][]
}
