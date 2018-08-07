class Exchange {
    constructor({ exchangeName }) {
        this.exchangeName = exchangeName
    }

    exchangeName = null
    
    createOrder = () => {}
    getOrderBook = () => {}

    rateLimit = () => {}
}

export default Exchange
