const BigNumber = require("bignumber.js");

class Frame {
  /**
   * Create a frame
   * @param {Object}    frame
   * @param {string[]}  frame.asks
   * @param {string[]}  frame.bids
   * @param {string}    frame.market
   * @param {string}    frame.timestamp
   *
   */
  constructor({ asks, bids, market, timestamp }) {
    try {
      this.asks = asks;
      this.bids = bids;
      this.market = market;
      this.timestamp = timestamp;
    } catch (e) {
      console.error(e);
      console.error("Invalid initialization input!");
    }
  }

  get timestamp() {
    if (this._timestamp) {
      return this._timestamp;
    }
    return "";
  }

  set timestamp(value) {
    if (typeof value === "string") {
      this._timestamp = value;
    } else {
      console.error("timestamp must be a string!");
    }
  }

  get market() {
    if (this._market) {
      return this._market;
    }
    return "";
  }

  set market(value) {
    if (typeof value === "string") {
      this._market = value;
    } else {
      console.error("Market must be a string!");
    }
  }

  get asks() {
    if (!!this._asks) {
      return this._asks.sort((a, b) => {
        const bigNumberA = new BigNumber(a[0]);
        console.log("A:", bigNumberA);
        const bigNumberB = new BigNumber(b[0]);
        console.log("B:", bigNumberB);
        return bigNumberA.isGreaterThan(bigNumberB);
      });
    }
    return [];
  }

  get spread() {
    const ask = new BigNumber(this.asks[0][0]);
    const bid = new BigNumber(this.bids[0][0]);
    const percent = ask
      .minus(bid)
      .div(bid)
      .times("100");
    const spread = ask.minus(bid);
    console.log("ask:", ask.toString());
    console.log("bid:", bid.toString());

    return {
      ask: ask.toString(),
      bid: bid.toString(),
      percent: `${percent.decimalPlaces(2).toString()}%`,
      spread: spread.toString()
    };
  }

  set asks(value) {
    if (value.constructor === Array) {
      this._asks = value;
    } else {
      console.error("Asks must be an array!");
    }
  }

  get bids() {
    if (!!this._bids) {
      return this._bids.sort((a, b) => {
        const bigNumberA = new BigNumber(a[0]);
        const bigNumberB = new BigNumber(b[0]);
        return bigNumberA.isLessThan(bigNumberB);
      });
    }
    return [];
  }

  set bids(value) {
    if (value.constructor === Array) {
      this._bids = value;
    } else {
      console.error("Bids must be an array!");
    }
  }
}

export default Frame;
