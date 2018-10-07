import "source-map-support/register";

import TriangularArbitrage from "./services/TriangularArbitrage";
import Binance from "./services/Binance";

const triangularArbitrage = new TriangularArbitrage({
  state: {
    frames: ["BTCUSDT", "ETHBTC", "ETHUSDT"]
  }
});
import sms from "../sms";

const binance = new Binance();

const contexts = [triangularArbitrage];
const exchanges = [binance];

sms.sendSms({
  body: `${new Date()} The engine is starting`
});

async function* theGenerator(stream) {
  // Get lock on stream
  const reader = stream.getReader();

  try {
    while (true) {
      // Read from stream
      const { done, value } = await reader.read();

      // Exit if done
      if (done) {
        return
      }

      // Else, yield
      yield value
    }
  } finally {
    /**
     * The finally clause is important.
     * If we break of the loop it'll cause the async generator
     * to return after the current (or next) yield point. If
     * this happens, we still want to release the lock on the
     * reader, and a finally is the only thing that can execute
     * after a return.
     */
    reader.releaseLock();
  }
}

const engine = async () => {
  for (let i = 0; i < exchanges.length; i++) {
    // await exchanges[i].getOrderBook({
    //     baseSymbol: 'USDT',
    //     quoteSymbol: 'BTC',
    // })
    // contexts.forEach((() => {
    // }))
    // await exchanges[i].getBalances(['BTC', 'USDT'])
    // await exchanges[i].createOrder({
    //     baseSymbol: 'USDT',
    //     quantity: '55',
    //     price: '4000',
    //     quoteSymbol: 'BTC',
    //     side: 'BUY',
    //     type: 'LIMIT',
    // })
  }
};

/**
 * Get all frames for each context, from each configured exchange
 * TODO: Reduce computational complexity
 */
// const getFrames = async () => {
//     const frames = []

//     exchanges.forEach((exchange) => {
//         contexts.forEach((context) => {
//             context.frames.forEach(async (frame) => {
//                 const baseSymbol = frame.baseSymbol
//                 const quoteSymbol = frame.quoteSymbol

//                 const frame = await exchange.getOrderBook({
//                     baseSymbol,
//                     quoteSymbol,
//                 })

//                 /**
//                  * Check for uniqueness to ensure fetching each frame at most once
//                  */
//                 if (frames.filter((frame) => {
//                     return frame.baseSymbol === baseSymbol && frame.quoteSymbol == quoteSymbol
//                 }).length == 0) {
//                     frames.push(frame)
//                 }
//             })
//         })
//     })

//     return frames
// }

const init = async () => {
  setInterval(engine, 1000);
};

export default init();
