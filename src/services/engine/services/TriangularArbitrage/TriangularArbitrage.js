import Context from "../Context";
import config from "./config";

class TriangularArbitrage extends Context {
  constructor({ engine }) {
    super();

    this.assets = config.assets;
    this.frames = config.frames;
  }

  engine = null;

  assets = null;
  frames = null;

  findBest = frames => {};

  /**
   * Identify needed frame for the trading pair
   * For example, for BTC, ETH, and USDT, we will be processing BTCUSDT, ETHUSDT, ETHBTC frames.
   */
  findFrame = symbolPair =>
    this.frames.filter(
      frame => [frame.baseAsset, frame.quoteAsset].sort() === symbolPair.sort()
    );

  /**
   * Test a particular arbitrage triangle
   * For example, BTC -> ETH -> USDT -> BTC
   */
  testTriangle = (frames, triangle) => {
    let orderSequence = [];

    triangle.forEach((asset, i, arr) => {
      const nextAsset = triangle[(i + 1) % 2];

      const frame = this.findFrame([asset, nextAsset]);

      /**
       * Determine which side of orderbook for the trade
       * needed to move asset -> nextAsset
       */

      const side = frame.baseAsset === nextAsset ? "SELL" : "BUY";

      // Get amount of asset available to trade
      const amount = this.context.exchange.balances[nextAsset];

      // Get best bid/ask rate
      const bestRate = frame[side === "SELL" ? "asks" : "bids"][0];

      const order = new Order({
        amount,
        side,
        type: "LIMIT"
      });

      orderSequence.push(order);

      if (this.calculateProfit(orderSequence) > 0) {
        return order;
      }

      return null;
    });
  };

  testFrame = frame => {
    // Process each asset
    for (let i = 0; i < assets.length; i++) {
      const asset1 = i % 2;
      const asset2 = (i + 1) % 2;
      const asset3 = (i + 2) % 2;
    }
  };

  init = () => {
    while (true) {
      this.findBest();
    }
  };
}

export default TriangularArbitrage;
