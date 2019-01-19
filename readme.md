# arbitrage-bot

An experimental, configurable and automated node.js trading engine.  This project is divided mainly into three components:
- The Exchange classes, which are essentially just API clients for the exchanges, and know everything about the exchange, such as rate limits, trading fees, api endpoints, funds & balances, etc.
- The Trade classes, which are an instantiated group of stateful objects representing a trade or a series of trades.  The Trade classes know everything pertaining to trades: which orderbook it's being traded on, the total amounts of input currencies and expected output amounts.
- The  Context classes, which house all of the logic and decision-making.  The context knows everything about the profitability of the proposed trades.  The Context is responsible for checking the Trade or list of Trades in each step of the Trades' existence in order to ensure the trade is still profitable before executing the next step. The Contexts also have the role of telling the Exchanges which orderbook(s) they need to be continuously fed in order to perform all of the calculations that the Context logic dictates.

## Development roadmap
- [ ] Exchange classes
    - [x] Binance
        - [x] Order creation
        - [x] Balance querying
        - [x] Orderbook fetching
        - [x] Authenticated (hmac 256 signed) endpoint support
- [ ] Context plugins
    - [ ] Base class functionality
        - [ ] Orderbook polling
        - [ ] Profitability logic
        - [ ] Theoretical trade(s) proposing logic
- [ ] Backtesting support
    - [ ] Historical data in db store
- [ ] Advanced liquidity management
    - [ ] Segregated pools of liquidity for multiple contexts
- [ ] Web interface
- [ ] DevOps things
    - [ ] Dockerize all the things
    - [ ] Circle CI pipelines
- [ ] Quality Assurance
    - [ ] Thorough unit testing


## Setup

- Define binance api env variables in your cli environment:

    ```
    export BINANCE_API_KEY=<api key>
    export BINANCE_SECRET_KEY=<secret key>
    ```
- Run `yarn`

## Start arbitrage-bot

`yarn start`
