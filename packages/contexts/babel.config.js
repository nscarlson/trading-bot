module.exports = {
    compact: false,
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-transform-async-to-generator',
    ],
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
            },
        ],
    ],
}
