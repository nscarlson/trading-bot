class Order {
    constructor({ exchange, price, quantity, side, timeInForce, type }) {
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

    // createOrder = async () => {
    //     try {
    //         const result = await exchange.createOrder(this)
    //     } catch(err) {
    //         console.error(err)
    //     }
    // }
}

export default Order
