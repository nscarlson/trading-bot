const states = {
    CREATED: 0,
    FAILED: 1,
    QUEUED: 2,
    SUCCESS: 3,
}

const types = {
    LIMIT: 0,
    MARKET: 1,
}

const sides = {
    BUY: 0,
    SELL: 1,
}

/**
 * Order class
 */
class Order {
    /**
     * Create an Order
     * @param {string} baseSymbol
     * @param {number} price
     * @param {number} quantity
     * @param {string} quoteSymbol
     * @param {string} side 
     * @param {string} type Type of order
     */
    constructor({
        baseSymbol,
        price,
        quantity,
        quoteSymbol,
        side,
        type
    }) {
        this.price = price
        this.quantity = quantity
        this.side = side
        this.timeInForce = timeInForce
        this.type = type
    }

    price = null
    quantity = null
    side = null
    timeInForce = null
    type = null
}

export default Order
