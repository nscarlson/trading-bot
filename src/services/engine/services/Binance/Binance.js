import axios from "axios";
import crypto from "crypto";
import moment from "moment";
import querystring from "querystring";
import uuid from "uuid/v4";

import Exchange from "../Exchange";

class Binance extends Exchange {
  constructor() {
    super();
    this.createV1HttpClient();
    this.createV3HttpClient();
  }

  apiKey = process.env.BINANCE_API_KEY;
  apiSecretKey = process.env.BINANCE_SECRET_KEY;

  v1HttpClient = null;
  v3HttpClient = null;

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

      console.info();
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
    console.log("Initializing Binance v1 client...");
    this.v1HttpClient = axios.create({
      baseURL: "https://api.binance.com/api/v1",
      timeout: 5000
    });
  };

  createV3HttpClient = () => {
    console.log("apiKey:", this.apiKey);

    console.log("Initializing Binance v3 connection...");
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

      const filteredBalances = balances.filter(balance =>
        keys.includes(balance.asset)
      );

      return filteredBalances;
    } catch (err) {
      console.error(err);
    }
  };

  getOrderBook = async ({ baseSymbol, limit = 1000, quoteSymbol }) => {
    try {
      const result = (await this.v1HttpClient.get("/depth", {
        params: {
          symbol: `${quoteSymbol}${baseSymbol}`,
          limit
        }
      })).data;

      console.log(
        `${moment().format()} | orderbook info   | Bid: ${
          result.bids[0][0]
        } Ask: ${result.asks[0][0]}`
      );
    } catch (err) {
      console.error(err);
    }
  };

  hmacSha256 = message =>
    crypto
      .createHmac("sha256", this.apiSecretKey)
      .update(message)
      .digest()
      .toString("hex");
}

export default Binance;
