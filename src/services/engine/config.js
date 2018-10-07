import Binance from './services/Binance'
import TriangularArbitrage from './services/TriangularArbitrage'

const config = {
    contexts: {
        TriangularArbitrage,
    },
    exchanges: {
        Binance,
    }
}

export default config