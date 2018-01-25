const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
// const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const cssExtract = new ExtractTextPlugin('origami.css');

const PATH_DIST = path.resolve(__dirname, './dist');
const PATH_SRC = path.resolve(__dirname, './src');

module.exports = {
    entry: {
        'main.js': path.resolve('./src/main.js'),
        'origami.css': path.resolve(__dirname, 'node_modules/origami-css/base.scss')
    },
    output: {
        path: PATH_DIST,
        filename: '[name]',
        publicPath: '/admin/'
    },
    // Devtool: 'eval-source-map',
    devServer: {
        contentBase: PATH_SRC,
        hot: true,
        open: true,
        inline: true
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                include: [
                    PATH_SRC
                ],
                loader: 'babel-loader'
            },
            {
                test: /\.html/,
                loader: 'raw-loader'
            },
            {
                test: /\.scss/,
                include: [/origami-css/],
                loader: cssExtract.extract(['css-loader', 'sass-loader'])
            },
            {
                test: /\.scss/,
                include: [/src\/components/, /src\/pages/, /src\/ui/],
                loaders: ['css-loader', 'sass-loader']
            },
            {
                test: /\.s?css$/,
                loader: 'style-loader!css-loader!sass-loader',
                include: [/src\/styles/]
            },
            {
                test: /\.(svg|jpg|png)/,
                loader: 'file-loader',
                exclude: [/loading\.svg/, /node_modules/]
            }
        ]
    },
    resolve: {
        symlinks: false,
        alias: {
            'bc': path.resolve(__dirname, 'bower_components'),
            'lib': path.resolve(PATH_SRC, 'lib'),
            'const': path.resolve(PATH_SRC, 'const'),
            'styles': path.resolve(PATH_SRC, 'styles'),
            'images': path.resolve(PATH_SRC, 'images'),
            'store': path.resolve(PATH_SRC, 'store'),
            'actions': path.resolve(PATH_SRC, 'actions'),
            'reducers': path.resolve(PATH_SRC, 'reducers'),

            'icons': path.resolve(__dirname, 'node_modules/origami-icons'),
            // 'grapejs': path.resolve(__dirname, 'node_modules/grapejs/dist/index.js')
            // 'origami-css': path.resolve(__dirname, 'node_modules/origami-css')

        }
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(PATH_SRC, 'app.html'),
            inject: true
        }),
        cssExtract
        // new ScriptExtHtmlWebpackPlugin({
        //     inline: /\.js/
        // }),
        // HTMLExtract
    ]
};
