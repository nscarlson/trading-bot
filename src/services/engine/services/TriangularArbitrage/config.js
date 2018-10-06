const config = {
    assets: ['BTC', 'ETH', 'USDT'],

    frames: [
        {
            baseSymbol: 'BTC',
            quoteSymbol: 'ETH',
        }, {
            baseSymbol: 'USDT',
            quoteSymbol: 'ETH',
        }, {
            baseSymbol: 'USDT',
            quoteSymbol: 'BTC',
        }
    ]
}

export default config