const path = require('path');
const PluginHTML = require('html-webpack-plugin');
const ExtractCSS = require('extract-text-webpack-plugin');
const BitBarPlugin = require('bitbar-webpack-progress-plugin');


const CSS_FILES = [
    /styles\/app\.scss/,
    /base\.scss/
]

module.exports = {
    entry: [
        './node_modules/tasty-treewalker/src/TreeWalker-polyfill.js',
        './src/app.ts'
    ],
    output: {
        filename: 'app.js',
        publicPath: '/admin/'
    },
    devtool: "inline-source-map",
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
                exclude: CSS_FILES,
                loader: 'css-loader!sass-loader'
            },
            {
                test: CSS_FILES,
                use: ExtractCSS.extract({
                    use: [
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            // options:
                        }
                    ]
                })
            },
            {
                test: /\.(svg|jpe?g|png)/,
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
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            'const': path.resolve(__dirname, './src/const.ts'),
            'actions': path.resolve(__dirname, './src/actions'),
            'store': path.resolve(__dirname, './src/store'),
            'store/state': path.resolve(__dirname, './src/store/state.ts'),
            'reducers': path.resolve(__dirname, './src/reducers'),
            'lib': path.resolve(__dirname, './src/lib'),
            'styles': path.resolve(__dirname, './src/styles'),
            'images': path.resolve(__dirname, './src/images')
            // 'zen-css': path.resolve(__dirname, './node_modules/zen-css/base.scss')
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
