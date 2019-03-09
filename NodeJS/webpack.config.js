var path = require('path');
var AutoDllPlugin = require('autodll-webpack-plugin');

var config = {
	module: {}
};

var chatConfig = Object.assign({},config,{
	name: "chat",
	entry: "./js/chat.js",
	output: {
		path: path.resolve(__dirname,'build/chat'),
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
                vendor: ['jquery']
            }
        })
    ],

    stats: {
        colors: true
    },
    devtool: 'source-map'
});

var threeJSConfig = Object.assign({},config,{
    name: "threeJS",
    entry: "./js/threejs.js",
    output: {
        path: path.resolve(__dirname,'build/ThreeJS'),
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
                vendor: ['three','three-orbitcontrols','three-text2d','three-gltf-loader']
            }
        })
    ],

    stats: {
        colors: true
    },
    devtool: 'source-map'
});

module.exports = [
	chatConfig,threeJSConfig
];
