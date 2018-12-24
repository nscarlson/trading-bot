const states = {
  CREATED: 0,
  FAILED: 1,
  QUEUED: 2,
  SUCCESS: 3
};

const types = {
  LIMIT: 0,
  MARKET: 1
};

const sides = {
  BUY: 0,
  SELL: 1
};

/**
 * Order class
 */
class Order {
  /**
   * Create an Order
   * @param {Object} order
   * @param {string} order.baseSymbol
   * @param {number} order.price
   * @param {number} order.quantity
   * @param {string} order.quoteSymbol
   * @param {string} order.side
   * @param {string} order.timeInForce
   * @param {string} order.type Type of order
   */
  constructor({
    baseSymbol,
    price,
    quantity,
    quoteSymbol,
    side,
    timeInForce,
    type
  }) {
    this.baseSymbol = baseSymbol;
    this.quoteSymbol = quoteSymbol;
    this.price = price;
    this.quantity = quantity;
    this.side = side;
    this.timeInForce = timeInForce;
    this.type = type;
  }

  baseSymbol = null;
  price = null;
  quantity = null;
  side = null;
  timeInForce = null;
  type = null;
}

export default Order;
