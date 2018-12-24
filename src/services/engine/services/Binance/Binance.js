import axios from "axios";
import BigNumber from "bignumber.js";
import crypto from "crypto";
import get from "lodash/get";
import moment, { duration } from "moment";
import querystring from "querystring";
import rateLimit from "function-rate-limit";
import uuid from "uuid/v4";

import Exchange from "../Exchange";
import Order from "../Order";

/**
 * @class Binance
 * @type {Object}
 * @property {string} apiKey
 * @property {string} apiSecretKey
 * @property {string} asyncIterator
 * @property {string} exchangeInfo
 * @property {string} v1HttpClient
 * @property {string} v3HttpClient
 * @property {string} withdrawalApiClient
 * @property {string} requestLimit
 * @property {string} orderLimit

 */
class Binance extends Exchange {
  constructor() {
    super({
      exchangeName: "binance"
    });

    this.createV1HttpClient();
    this.createV3HttpClient();
    this.createWithdrawalApiClient();

    this.requestLimit = moment(1200, "minutes").valueOf();
    this.orderLimit = moment(10, "seconds").valueOf();
  }

  apiKey = process.env.BINANCE_API_KEY;
  apiSecretKey = process.env.BINANCE_SECRET_KEY;

  asyncIterator = null;

  exchangeInfo = null;

  v1HttpClient = null;
  v3HttpClient = null;
  withdrawalApiClient = null;

  requestLimit = null;
  orderLimit = null;

  // getOrder = async ({
  //     baseSymbol,
  //     newClientOrderId,
  //     orderId,
  //     origClientOrderId,
  //     quoteSymbol,
  // }) => {
  //     try {
  //         symbol: `${quoteSymbol}${baseSymbol}`

  //         const timestamp = new Date().getTime()

  //         const totalParams = `timestamp=${timestamp}`

  //         const order = (await this.v3HttpClient.get(`/order${totalParams}`, {
  //             headers: {
  //                 'X-MBX-APIKEY': this.apiKey,
  //             },
  //             params: {
  //                 symbol: `${quoteSymbol}${baseSymbol}`,
  //             },
  //         })).data
  //     } catch(err) {
  //         console.error(err)
  //     }
  // }

  /**
   * @async
   * @param {Object} executionSequence Execution Sequence object
   * @return {Promise<Object>} Total estimated fees for execution sequence
   */
  getExecutionSequenceFee = async executionSequence =>
    executionSequence.reduce(async (acc, value) =>
      (await this.getExecutionFee(acc)).plus(value)
    );

  /**
   * @param {Object} execution execution object
   * @return {Promise<BigNumber>}
   */
  getExecutionFee = async execution => {
    switch (execution.type) {
      case "WITHDRAWAL":
        return this.getWithdrawalFee(execution.amount);
      case "":
        return this.getTradeFee(execution);
      default:
        return new BigNumber(0);
    }
  };

  /**
   * TODO: Calculate additional influences of trading fees such as
   * VIP level and amount of BNB held
   */

  /**
   * @param {string} market
   * @return {Promise<BigNumber>}
   */
  getTradeFee = async market => {
    const params = `symbol=${market}&timestamp=${moment().format("x")}`;
    const signature = this.hmacSha256(params);

    const result = (await this.withdrawalApiClient(
      `/v3/tradeFee.html&${params}&signature=${signature}`,
      {
        headers: {
          "X-MBX-APIKEY": this.apiKey
        },
        method: "POST"
      }
    )).data;

    const takerTradeFee = get(result, "taker", "");

    return new BigNumber(takerTradeFee || 0);
  };

  /**
   * @async
   * @param {string} assetSymbol  Asset name
   * @return {Promise<BigNumber>} Estimated withdrawal fee
   */
  getWithdrawalFee = async assetSymbol => {
    const params = `timestamp=${moment().format("x")}`;
    const signature = this.hmacSha256(params);

    const result = (await this.withdrawalApiClient(
      `/v3/assetDetail.html&${params}&signature=${signature}`,
      {
        headers: {
          "X-MBX-APIKEY": this.apiKey
        },
        method: "POST"
      }
    )).data;

    const withdrawalFee = get(
      result,
      `assetDetail.${assetSymbol}.withdrawFee`,
      ""
    );

    return new BigNumber(withdrawalFee || 0);
  };

  getOrderHistory = async ({ apiKey, apiSecretKey, market }) => {
    try {
      const timestamp = moment().format("x");
      const totalParams = `timestamp=${timestamp}&symbol=${market}`;

      const orders = (await this.v3HttpClient.get(`/allOrders?${totalParams}`, {
        headers: {
          "X-MBX-APIKEY": apiKey
        },
        params: {
          signature: this.hmacSha256({
            message: totalParams,
            apiSecretKey
          })
        }
      })).data;

      return orders;
    } catch (err) {
      console.error(err);
    }
  };

  createOrder = async order => {
    try {
      const clientOrderId = uuid();
      const symbol = `${order.quoteSymbol}${order.baseSymbol}`;
      const timestamp = new Date().getTime();

      const newOrder = new Order({
        clientOrderId,
        ...order
      });

      return newOrder;
    } catch (err) {
      console.error(err);
    }
  };

  submitOrder = async order => {
    try {
      const {
        baseSymbol,
        clientOrderId,
        price,
        quantity,
        quoteSymbol,
        side,
        type
      } = order;

      const timestamp = moment().format("x");
      console.info(
        `${moment().format()} | submitting order | ${clientOrderId} ${type} ${side} ${quantity} ${quoteSymbol} @${price}`
      );

      const symbol = `${quoteSymbol}${baseSymbol}`;
      const params = `newClientOrderId=${clientOrderId}&symbol=${symbol}&side=${side}&type=${type}&timeInForce=FOK&quantity=${quantity}&price=${price}&timestamp=${timestamp}`;
      const signature = this.hmacSha256(params);

      const result = (await this.v3HttpClient(
        `/order/test?${params}&signature=${signature}`,
        {
          headers: {
            "X-MBX-APIKEY": this.apiKey
          },
          method: "POST"
        }
      )).data;
    } catch (err) {
      console.error("Could not submit order:", order);
      console.error(err);
    }
  };

  createV1HttpClient = () => {
    this.v1HttpClient = axios.create({
      baseURL: "https://api.binance.com/api/v1",
      timeout: 5000
    });
  };

  createV3HttpClient = () => {
    this.v3HttpClient = axios.create({
      baseURL: "https://api.binance.com/api/v3",
      timeout: 5000
    });
  };

  createWithdrawalApiClient = () => {
    this.v3HttpClient = axios.create({
      baseURL: "https://api.binance.com/wapi",
      timeout: 5000
    });
  };

  getBalances = async keys => {
    try {
      const timestamp = new Date().getTime();
      const totalParams = `timestamp=${timestamp}`;

      const balances = (await this.v3HttpClient.get(`/account?${totalParams}`, {
        headers: {
          "X-MBX-APIKEY": this.apiKey
        },
        params: {
          signature: this.hmacSha256(totalParams)
        }
      })).data.balances;
      return filteredBalances;
    } catch (err) {
      console.error(err);
    }
  };

  getExchangeInfo = async () => {
    try {
      const info = (await this.v1HttpClient.get("/exchangeInfo")).data;
      console.info("rateLimits", info.rateLimits);
    } catch (err) {
      console.error(err);
    }
  };

  getOrderBook = async ({
    baseSymbol,
    // TODO: don't hardcode rate-limiting config
    limit = 1000,
    quoteSymbol
  }) => {
    try {
      const result = (await this.v1HttpClient.get("/depth", {
        params: {
          symbol: `${quoteSymbol}${baseSymbol}`,
          limit
        }
      })).data;

      console.info(
        `${moment().format()} | ${
          this.exchangeName
        } | orderbook info   | Bid: ${result.bids[0][0]} Ask: ${
          result.asks[0][0]
        }`
      );

      console.info(
        `${moment().format()} | orderbook info   | Bid: ${
          result.bids[0][0]
        } Ask: ${result.asks[0][0]}`
      );
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * TODO: Move this to utils if hmac functionality is needed in multiple places
   * @returns
   */
  hmacSha256 = message =>
    crypto
      .createHmac("sha256", this.apiSecretKey)
      .update(message)
      .digest()
      .toString("hex");

  rateLimitOrders = () => {};

  rateLimitRequests = () => {};
}

export default Binance;
