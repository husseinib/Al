const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    mode: 'production',
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    optimization: {
        minimizer: [new UglifyJSPlugin({
            uglifyOptions: {
                output: {
                    comments: false //use it for removing comments like "/*! ... */"
                }
            }
        })]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "src/assets",
                    to: "assets",
                    noErrorOnMissing: true
                },
            ],
        }),
        new HTMLWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html',
            hash: true,
            minify: false
        })
    ]
}