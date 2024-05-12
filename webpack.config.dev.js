const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    devServer: {
        static: 'dist',
        port: 3000
    },
    devtool: 'inline-source-map',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "src/assets",
                    to: "assets"
                },
            ],
        }),
        new HTMLWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html'
        })
    ]
}