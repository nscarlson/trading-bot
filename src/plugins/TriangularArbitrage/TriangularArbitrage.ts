class TriangularArbitrage {
    constructor() {
        this.config = {
            exchanges: ['binance'],
        }
    }

    config = {}

    processFrame(frame: unknown): void {
        console.log('frame:', frame)
    }
}

export default TriangularArbitrage
