class Exchange {
    constructor({ exchangeName }) {
        this.exchangeName = exchangeName
    }

    exchangeName = null
    
    getOrderBook = () => {}
    createOrder = () => {}
}

export default Exchange
