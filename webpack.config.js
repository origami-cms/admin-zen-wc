const PluginHTML = require('html-webpack-plugin');
const ExtractCSS = require('extract-text-webpack-plugin');
const BitBarPlugin = require('bitbar-webpack-progress-plugin');


module.exports = {
    entry: [
        './src/polyfills/treeWalker.js',
        './src/app.ts'
    ],
    output: {
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.html/,
                loader: 'raw-loader'
            },
            {
                test: /\.scss/,
                exclude: /base\.scss/,
                loader: 'css-loader!sass-loader'
            },
            {
                test: /base\.scss/,
                use: ExtractCSS.extract({
                    use: 'css-loader!sass-loader'
                })
            },
            {
                test: /\.(svg|jpe?g|png)/,
                exclude: [/apps/, /questions/],
                loader: 'file-loader',
                options: {
                    outputPath: '/images',
                    name: '[name].[ext]'
                }
            },
            // {
            //     test: /\.(svg|jpg|png)/,
            //     loader: 'file-loader',
            //     exclude: [/loading\.svg/, /node_modules/]
            // }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            'actions': './src/actions',
            'store': './src/store',
            'reducers': './src/reducers'
        }
    },
    plugins: [
        new PluginHTML({
            template: './src/app.html'
        }),
        new ExtractCSS('zen.css'),
        new BitBarPlugin()
    ]
}
