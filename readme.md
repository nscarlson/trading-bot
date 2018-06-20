# arbitrage-bot

A configurable node.js trading engine

## Prerequisites

- Define binance api env variables in your cli environment:
    ```sh
    export BINANCE_API_KEY=<api key>
    export BINANCE_SECRET_KEY=<secret key>
    ```
- Run `yarn`

## Run arbitrage-bot

`pm2 start process.config.js && pm2 logs`
