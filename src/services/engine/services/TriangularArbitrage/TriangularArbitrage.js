import Context from '../Context'

class TriangularArbitrage extends Context {
    constructor() {
        super()

        config = {
            exchanges: ['binance'],
        }
    }

    config = {}

    processFrame(frame) {
        //  console.log('frame:', frame)
    }
}

export default TriangularArbitrage
