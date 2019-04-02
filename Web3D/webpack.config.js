var path = require('path');
var AutoDllPlugin = require('autodll-webpack-plugin');

var config = {
    module: {}
};

var hw2Config = Object.assign({},config,{
    name: "main",
    entry: "./Hw2/main.js",
    output: {
        path: path.resolve(__dirname,'build/hw2'),
        filename: "main.bundle.js"
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new AutoDllPlugin({
            filename: '[name].dll.js',
            entry: {
                vendor: ['three','three-orbitcontrols']
            }
        })
    ],

    stats: {
        colors: true
    },
    devtool: 'source-map'
})

var ModuleBuildConfig = Object.assign({},config,{
    name: "main",
    entry: "./ModuleBuild/main.js",
    output: {
        path: path.resolve(__dirname,'build/ModuleBuild'),
        filename: "main.bundle.js"
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new AutoDllPlugin({
            filename: '[name].dll.js',
            entry: {
                vendor: ['three','three-orbitcontrols']
            }
        })
    ],

    stats: {
        colors: true
    },
    devtool: 'source-map'
})

module.exports = [
    hw2Config
];