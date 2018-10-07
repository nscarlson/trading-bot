import axios from "axios";
import crypto from "crypto";
import moment, { duration } from "moment";
import querystring from "querystring";
import rateLimit from "function-rate-limit";
import uuid from "uuid/v4";

import Exchange from "../Exchange";

class Binance extends Exchange {
  constructor() {
    super({
      exchangeName: "binance"
    });

    this.createV1HttpClient();
    this.createV3HttpClient();

    this.requestLimit = moment(1200, "minutes").valueOf();
    this.orderLimit = moment(10, "seconds").valueOf();
  }

  apiKey = process.env.BINANCE_API_KEY;
  apiSecretKey = process.env.BINANCE_SECRET_KEY;

  asyncIterator = null;

  exchangeInfo = null;

  v1HttpClient = null;
  v3HttpClient = null;

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

  createOrder = async ({
    baseSymbol,
    price,
    quantity,
    quoteSymbol,
    side,
    type
  }) => {
    try {
      const newClientOrderId = uuid();
      const symbol = `${quoteSymbol}${baseSymbol}`;
      const timestamp = new Date().getTime();

      // TODO: Make this more pleasant and readable
      const totalParams = `newClientOrderId=${newClientOrderId}&symbol=${symbol}&side=${side}&type=${type}&timeInForce=FOK&quantity=${quantity}&price=${price}&timestamp=${timestamp}`;
      const signature = this.hmacSha256(totalParams);

      console.info(
        `${moment().format()} | submitting order | ${newClientOrderId} ${type} ${side} ${quantity} ${quoteSymbol} @${price}`
      );

      const result = (await this.v3HttpClient(
        `/order/test?${totalParams}&signature=${signature}`,
        {
          headers: {
            "X-MBX-APIKEY": this.apiKey
          },
          method: "POST"
        }
      )).data;
    } catch (err) {
      console.error(err);
    }
  };

  createV1HttpClient = () => {
    console.info("Initializing Binance v1 client...");
    this.v1HttpClient = axios.create({
      baseURL: "https://api.binance.com/api/v1",
      timeout: 5000
    });
  };

  createV3HttpClient = () => {
    console.info("Initializing Binance v3 client...");
    this.v3HttpClient = axios.create({
      baseURL: "https://api.binance.com/api/v3",
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

      createV1HttpClient = () => {
        console.info(`Initializing ${this.exchangeName} v1 client...`);
        this.v1HttpClient = axios.create({
          baseURL: "https://api.binance.com/api/v1",
          timeout: 5000
        });
      };

      createV3HttpClient = () => {
        console.info("Initializing Binance v3 connection...");
        this.v3HttpClient = axios.create({
          baseURL: "https://api.binance.com/api/v3",
          timeout: 5000
        });
      };

      return filteredBalances;
    } catch (err) {
      console.error(err);
    }

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
      } catch (err) {
        console.error(err);
      }
    };

    console.info(
      `${moment().format()} | orderbook info   | Bid: ${
        result.bids[0][0]
      } Ask: ${result.asks[0][0]}`
    );
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
