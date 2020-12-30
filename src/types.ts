export interface Balance {
    asset: string
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
